<template>
  <div>
    <div class="tag-box">
      <!-- 筛选条件 -->
      <div class="search-box font-14">
        <el-row class="screen-box">
          <el-col class="screen" :span="5">
            <label>榜单名称:</label>
            <el-select v-model="params.rankingListName" placeholder="请选择" clearable size="small">
              <el-option v-for="item in ListNameOptions" :key="item.rankingListName" :label="item.rankingListName" :value="item.rankingListName"></el-option>
            </el-select>
          </el-col>
          <el-col class="screen" :span="5">
            <label>榜单类型:</label>
            <el-select v-model="params.rankingListCollectionType" placeholder="请选择" clearable size="small">
              <el-option v-for="item in valOption[0]" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <label>采集时间：</label>
            <el-date-picker v-model="collectionTime" type="daterange" size="small" style="width:400px" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
          <el-col :push="1" :span="1">
            <el-button type="primary" size="medium" @click="handleFilter">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 -->
      <div class="tag-con">
        <el-row class="row">
          <el-col :span="21">
            <el-button @click="monthlyAdd" size="medium" type="primary">新增</el-button>
            <el-button size="medium" type="primary" @click="exportFunc">导出</el-button>
            <el-button size="medium" type="primary" @click="monthlyDelete">删除</el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data="tableData" stripe tooltip-effect="dark" border highlight-current-row style="width:100%;min-height:600px;" header-row-class-name="table-head" @selection-change="handleSelectionChange" @row-dblclick="monthlyUpdate">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="rankingListName" label="榜单名称" width="120"></el-table-column>
          <el-table-column prop="site" label="信源" width="120"></el-table-column>
          <el-table-column prop="rankingListCollectionType" label="榜单类型" show-overflow-tooltip>
            <template slot-scope="scope">{{rankingList(valOption[0],scope.row.rankingListCollectionType)}}</template>
          </el-table-column>
          <el-table-column prop="collectionTime" label="采集时间" show-overflow-tooltip>
            <template slot-scope="scope">{{proDate(scope.row.collectionTime)}}</template>
          </el-table-column>
          <el-table-column prop="bookNumber" label="上榜作品" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button @click="handleOpenDetail(scope.row)" type="text" size="small">{{scope.row.bookNumber}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20,40,60,80,100]" layout="total, prev, pager, next,sizes" style="margin-top:10px;" :total="curTotal" :page-size="curPageSize" :current-page="currentPage"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getDownloadFunc } from '@/views/kbms/func';
import axios from "axios";
const querystring = require("querystring");
export default {
  name: "tag",
  data() {
    return {
      taskList: [],
      selectRow: [], //
      ListNameOptions: [], //榜单名称列表
      select: "",
      value: "",
      collectionTime: null,
      curTotal: 0,
      currentPage: 1, //当前页数
      curPageSize: 20, //每页的条数
      params: {
        pageNo: 1,
        pageSize: 20,
        endTime: "",
        startTime: "",
        rankingListCollectionType: null,
        rankingListName: null
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      tableData: [],
      currentPage4: 2,
      dialogFormVisible: false,
      form: {
        name: ""
      },
      formLabelWidth: "120px",
      dialogFormVisible1: false
    };
  },
  created() {
    this.getExampleData(this.params); //   获取榜单库信息
    this.getRankingList(); // 获取榜单名称下拉框列表
    // 获取字典
    this.getDictList(["rankingListCollectionType"]);
  },
  computed: {
    ...mapGetters(["rankingListCollectionType"]),
    valOption() {
      let arr = [
        // 馆藏数据库类型0
        this.rankingListCollectionType
      ];
      return arr;
    }
  },
  watch: {
    multipleSelection(data) {
      //存储选中的row
      this.selectRow = [];
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(item.id);
        });
      }
    }
  },
  methods: {
    ...mapActions(["getDictList"]),
    exportFunc() {
      if (this.multipleSelection != undefined && this.multipleSelection.length > 0) {

      } else {
        return this.$message.error("至少选择一个榜单");
      }
      let fileName = "榜单库导出" + (new Date()).valueOf();
      this.$message.success("正在下载...请稍后");
      this.taskList = [];
      this.multipleSelection.forEach(item => {
        this.taskList.push(item.id);
      });
      let data = this.taskList.join(',');
      // GET /api/rankingList/exportRankingList
      getDownloadFunc('br/api/rankingList/exportRankingList?ids=' + data, fileName);
    },
    // 查看上榜作品
    handleOpenDetail(data) {
      // var ids = [];
      // this.tableData.forEach(item => {
      //   ids.push(item.isbn);
      // });
      // localStorage.setItem('bookCheckList',JSON.stringify(ids));
      let router = this.$router.resolve({
        path: "/monthly/works",
        query: {
          id: data.id,
          rankingListName: data.rankingListName,
          collectionTime: data.collectionTime,
          site: data.site,
          rankingListCollectionType: data.rankingListCollectionType,
          collectionTime: data.collectionTime,
        }
      });
      window.open(router.href, "_blank");
    },
    monthlyDelete() {
      if (
        this.multipleSelection != undefined &&
        this.multipleSelection.length > 0
      ) {
        this.$confirm("删除后该榜单及上榜图书信息不可恢复！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.taskList = [];
            this.multipleSelection.forEach(item => {
              this.taskList.push(item.id);
            });
            // POST /api/rankingList/deleteRankingList
            //  querystring.stringify(reqObj)
            this.$post(
              "/api/rankingList/deleteRankingList?ids=" + this.taskList + ""
            )
              .then(res => {
                this.$message(res.message);
                this.handleFilter();
              })
              .catch(res => { });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.warning("请选择删除项");
      }
    },
    rankingList(data, type) {
      data.forEach(element => {
        if (element.value == type) {
          type = element.name;
        }
      });
      return type;
    },
    // 获取榜单名称下拉框列表
    getRankingList() {
      this.$post("/api/rankingList/findAllRankingListName")
        .then(res => {
          this.ListNameOptions = res.data;
        })
        .catch(res => { });
    },
    // 查询
    handleFilter() {
      this.currentPage = 1;
      if (this.params.rankingListName == "") {
        this.params.rankingListName = null;
      }
      if (this.collectionTime != null) {
        this.params.startTime = this.collectionTime[0];
        this.params.endTime = this.collectionTime[1];
      } else {
        this.params.startTime = "";
        this.params.endTime = "";
      }
      this.getExampleData(this.params);
    },
    //   获取榜单库信息
    getExampleData(params) {
      params.pageNo = this.currentPage;
      params.pageSize = this.curPageSize;
      this.$post("/api/rankingList/findRankingList", params)
        .then(res => {
          if (res.data.result && res.data.result.length > 0) {
            var data = [];
            res.data.result.forEach(obj => {
              data.push(obj);
            });
          }
          this.tableData = data;
          this.curTotal = res.data.totalCount;
        })
        .catch(res => { });
    },
    // 修改
    monthlyUpdate(data) {
      if (data.rankingListCreateType == 0) {
        this.$message.warning("采集榜单不能修改");
        return;
      }
      sessionStorage.setItem(data.id, JSON.stringify(data));
      this.$router.push({ path: "/monthly/add", query: { id: data.id } });
    },
    // 新增
    monthlyAdd() {
      this.$router.push({ path: "/monthly/add" });
    },
    //   表格
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 时间格式转换
    proDate(date) {
      if (date != null) {
        // date = date.replace("00:00:00", "");
        date = date.substring(0, 10);
      }
      return date;
    },
    // 分页
    handleSizeChange(val) {
      this.curPageSize = val;
      this.getExampleData(this.params);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getExampleData(this.params);
    }
  }
};
</script>

<style lang="scss" scoped>
.font-14 {
  font-size: 14px;
}
.tag-box {
  background: #f1f4f5;
  // padding: 30px;
  .search-box {
    padding: 30px;
    background: #fff;
    span {
      margin-right: 10px;
    }
    .option-box {
      width: 700px;
      margin-top: 20px;
    }
    .screen-box {
      padding-bottom: 20px;
    }
    .screen {
      display: flex;
      align-items: center;
      label {
        width: 100px;
      }
      // .screen-item {
      //   flex: 1;
      // }
    }
  }
  .tag-con {
    margin-top: 30px;
    background: #fff;
    padding: 30px;
    .row {
      padding-bottom: 30px;
    }
    /deep/ .table-head th {
      background: #e5f0f6 !important;
    }
  }
  /deep/ .el-select .el-input {
    width: 130px;
  }
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}

.pop-foot {
  display: flex;
  justify-content: space-around;
}
</style>

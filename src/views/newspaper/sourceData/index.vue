<template>
  <div id="vendibilityManage">
    <div id="search">
      <el-row>
        <el-col :span="22">
          <span>
            <label>渠道:</label>
            <el-select v-model="params.source" size="small" class="selectItem">
              <el-option v-for="obj in sourceOption" :key="obj.value" :label="obj.name" :value="obj.value"></el-option>
            </el-select>
          </span>
          <span>
            <label>刊号:</label>
            <el-input v-model="params.pressNo" size="small" style="width:140px" placeholder="请输入内容" clearable></el-input>
          </span>
          <span>
            <label>ISSN:</label>
            <el-input v-model="params.issn" size="small" style="width:140px" placeholder="请输入内容" clearable></el-input>
          </span>
          <span>
            <label>刊名:</label>
            <el-input v-model="params.name" size="small" style="width:140px" placeholder="请输入内容" clearable></el-input>
          </span>
          <span>
            <label>出版社:</label>
            <el-input v-model="params.publisher" size="small" style="width:140px" placeholder="请输入内容" clearable></el-input>
          </span>
          <span>
            <label>出版地:</label>
            <el-input v-model="params.publishLocate" size="small" style="width:140px" placeholder="请输入内容" clearable></el-input>
          </span>
          <span>
            <label>译文简介:</label>
            <el-input v-model="params.translatIntroduction" size="small" style="width:140px" placeholder="请输入内容" clearable></el-input>
          </span>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="primary" @click="handleFilter">检索</el-button>
          <el-button size="small" type="primary" @click="exportPress">导出</el-button>
          <!-- <el-button size="small" type="primary" @click="clearFilter">重置条件</el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="btnCont">
      <!-- <el-checkbox v-model="checkedAll" @change="handleCheckedAll" style="margin-left:20px;">全选</el-checkbox> -->
    </div>
    <div class="content">
      <el-table ref="filterTable" :data="tableData" v-loading="loading" tooltip-effect="dark" border height="100%" style="width:100%;min-height:690px;" :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}" @selection-change="handleSelectionChange" @row-click="handleclick" row-key="isbn">
        <el-table-column :show-overflow-tooltip="true" type="selection" fixed="left" width="45"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="issn" label="ISSN"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="name" label="刊名"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="pressNo" label="刊号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="issue" label="期数"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="status" label="状态"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="chClassNo" label="中图分类号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="language" label="文种"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="isCompendex" :formatter="isCompendex" label="是否核心刊"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="chCurrency" label="中图币制"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="chPrice" label="中图刊价"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="creadYear" label="创刊年"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="catalogDate" label="编目日期"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="publisher" label="出版社"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="publishLocate" label="出版地"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="isOa" :formatter="formatRole" label="是否OA刊"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleOpenDetail(scope.row)" type="text" size="small">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20,40,60,80,100]" layout="total, prev, pager, next,sizes" style="margin-top:10px;" :total="curTotal" :page-size="curPageSize" :current-page="currentPage"></el-pagination>
    </div>
  </div>
</template>

<script>
import selectTem from "@/components/export/selectTem";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    selectTem
  },
  data() {
    return {
      sourceOption: [
        { name: "中图报刊", value: 4 },
        { name: "EBSCO报刊", value: 6 }
      ],
      search: "",
      tableData: [],
      checkedAllIsAble: false,
      selectFiltData: [], //查询的数据
      tableDataEnd: [],
      salableOrgan: {},
      pubDate: [],
      libraryOption: [],
      checkList: ["复选框 A"],
      params: {},
      params: {
        source: 4, //4为中图6为eb
        pageNo: "1", //当前页，从1开始，
        pageSize: "20", //每页显示条数，
        pressNo: "", //“刊号”，
        name: "", //“刊名”，
        issn: "", //“issn”，
        publisher: "", //“出版社”，
        publishLocate: "", //“出版地”，
        translatIntroduction: "" //“译文简介”
      },
      checkList: [], //可售机构对话框可选机构
      salableOrganType: ["机构一", "机构二", "机构三"],
      centerDialogVisible: false, //选择可售机构对话框
      exportDialog: false, //导出选项
      imgResultType: ["白名单", "待定", "黑名单"],
      entityResultType: ["白名单", "黑一", "黑二", "黑三"],
      commonResultType: ["灰名单", "黄名单", "白名单", "黑一", "黑二", "黑三"],
      selectRow: [], //
      multipleSelection: [],
      currentPage: 1, //当前页数
      curPageSize: 20, //每页的条数
      curTotal: 0, //总条数
      searchParams: {}, //查询可售数据所需传参
      pressVal: 0,
      taskList: [],
      salableOrganParams: {}, //可售机构传参
      flag: false,
      Newitems: [],
      column: [], //后端排序
      checkedAll: false,
      loading: false
    };
  },
  created() {
    if (this.$route.query.siteid) {
      this.params.site = Number(this.$route.query.siteid);
    }
    this.getSalableData(this.params); //获取列表数据
    this.findByLibrary(); //获取图书馆数据
    // 获取字典
    this.getDictList(["gcCategory"]);
  },
  computed: {
    ...mapGetters(["gcCategory"]),
    valOption() {
      let arr = [
        // 馆藏数据库类型0
        this.gcCategory
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
          this.selectRow.push(item.isbn);
        });
      }
    }
  },
  methods: {
    ...mapActions(["getDictList"]),
    //是否OA刊
    formatRole(row, column) {
      if (row.isOa == undefined) {
        return;
      }
      return row.isOa == true ? "是" : "否";
    },
    //是否核心刊
    isCompendex(row, column) {
      if (row.isCompendex == undefined) {
        return;
      }
      return row.isCompendex == true ? "是" : "否";
    },
    // 查看详细
    handleOpenDetail(data) {
      // var ids = [];
      // this.tableData.forEach(item => {
      //   ids.push(item.isbn);
      // });
      // localStorage.setItem('bookCheckList',JSON.stringify(ids));
      let router = this.$router.resolve({
        path: "/newspaperDetail",
        query: { sn: data.sn, source: this.params.source }
      });
      window.open(router.href, "_blank");
    },
    // 重置条件
    clearFilter() {
      var params = [];
      this.params.forEach(function (cur, index) {
        cur.value[0] = "";
        params.push(cur);
      });
      this.params = params;
      this.getSalableData();
    },
    // 选择图书馆
    selectChange(data) {
      this.$forceUpdate();
      this.getPressCategroy(data);
    },
    // 判断是否全选
    handleCheckedAll(data) {
      if (this.multipleSelection.length != this.tableData.length || !data) {
        this.$refs.filterTable.toggleAllSelection();
      }
    },
    // 导出
    exportPress() {
      var pressParams = {
        // brief: "",
        // category: "",
        // documentId: "",
        source: this.params.source,
        ids: [""]
        // name: "",
        // other: "",
        // publisher: "",
        // site: "",
        // subject: ""
      };
      if (this.multipleSelection.length > 0 && this.checkedAll == false) {
        this.taskList = [];
        this.multipleSelection.forEach(item => {
          this.taskList.push(item.sn);
        });
        pressParams.ids = this.taskList;
      } else if (this.checkedAll) {
        delete pressParams.ids;
      } else {
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: "请选择数据！",
            type: "warning"
          });
          return;
        }
      }
      if (pressParams.ids[0] == null) {
        this.$message.warning("必要的导出参数sn为空");
        return;
      }
      // POST /api/pressData/exportInfo
      axios
        .post("/br/api/pressData/exportInfo", pressParams, {
          responseType: "blob"
        })
        .then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            "报刊数据库" + new Date().getTime() + ".xls"
          );
          document.body.appendChild(link);
          link.click();
        });
      this.getSalableData(this.params); //获取列表数据
    },
    // 查询
    handleFilter() {
      this.currentPage = 1
      this.getSalableData(this.params);
    },
    changeReader(str) {
      let reader = [];
      str.split(",").forEach(item => {
        if (item) {
          reader.push(this.salableOrganType[item]);
        }
      });
      return reader.join(",");
    },
    // 图书馆查询
    findByLibrary() {
      this.$get("/api/library/findByLibrary", {
        id: "0"
      })
        .then(res => {
          this.libraryOption = res.data.result;
        })
        .catch(res => { });
    },
    // 获取报刊源数据列表
    getSalableData(params) {
      // let params1 = { pageNo: 1, pageSize: 10, source: "4" };
      this.tableData = [];
      this.loading = true;
      params.pageNo = this.currentPage;
      params.pageSize = this.curPageSize;
      this.$post("/api/pressData/findList", params)
        .then(res => {
          this.loading = false;
          if (res.data.result && res.data.result.length > 0) {
            let data = [];
            res.data.result.forEach(obj => {
              data.push(obj);
            });
            this.tableData = data;
          }

          this.curTotal = res.data.totalCount;
        })
        .catch(err => {
          this.loading = false;
          // this.$message.error(err);
        });
    },
    openTask(type) {
      if (type == "新增任务") {
        this.openTaskType = type;
        this.taskDialog = true;
      } else {
        if (this.multipleSelection.length > 0 || this.checkedAll) {
          this.taskList = [];
          this.multipleSelection.forEach(item => {
            this.taskList.push(item.isbn);
          });
          if (type == "导出") {
            this.exportDialog = true;
            this.$nextTick(() => {
              this.$refs.selectTem.init(this.searchParams, "bookExport");
            });
          }
        } else {
          this.$message.warning("请选择导出任务");
        }
      }
    },
    handleclick() { },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length != this.tableData.length) {
        this.checkedAll = false;
      }
    },
    // 联动查询
    linkageQuery() { },
    // 分页每页多少条
    handleSizeChange(val) {
      this.curPageSize = val;
      this.getSalableData(this.params);
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSalableData(this.params);
    }
  }
};
</script>
<style lang='scss' scoped>
#vendibilityManage {
  padding: 15px;
  // background: #fff;
  // min-height: 100%;
  border-radius: 5px;
  font-size: 14px;
  #search {
    border-radius: 5px;
    margin-bottom: 10px;
    background: #fff;
    padding-left: 10px;
    span {
      margin-left: 14px;
    }
  }
  .el-checkbox-group {
    margin-top: 5px;
  }
  .el-col-22 {
    margin: 8px 0 8px 0;
  }
  .el-col-2 {
    margin: 8px 0 8px 0;
  }
  .selectItem {
    width: 150px;
    margin-right: 30px;
  }
  .keywords {
    margin-top: 20px;
  }
  .btnCont {
    // margin: 20px 0 10px 0;
    // padding: 20px 0 10px 0;
    // background: #fff;
  }
  .content{
     background: #fff;
  }
  .salableOrganBookNumber {
    font-size: 16px;
    color: #a1a1a1;
    margin-bottom: 20px;
  }
}
</style>

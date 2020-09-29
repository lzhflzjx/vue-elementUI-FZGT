<template>
  <div id="vendibilityManage">
    <div id="search">
      <el-row>
        <el-col :span="4">
          <label>数据库:</label>
          <el-input
            v-model="params.name"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <label>图书馆:</label>
          <el-select
            v-model="params.site"
            clearable
            size="small"
            class="selectItem"
            @change="selectChange"
          >
            <el-option
              v-for="obj in libraryOption"
              :key="obj.siteid"
              :label="obj.library"
              :value="obj.siteid"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <label>类型:</label>
          <el-select v-model="params.category" clearable size="small" class="selectItem">
            <el-option
              v-for="obj in valOption[0]"
              :key="obj.name"
              :label="obj.name"
              :value="obj.name"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <label>出版社/集成商:</label>
          <el-input
            v-model="params.publisher"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <label>所属学科:</label>
          <el-input
            v-model="params.subject"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="1">
          <el-button size="small" type="primary" @click="handleFilter">查询</el-button>
          <!-- <el-button size="small" type="primary" @click="clearFilter">重置条件</el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="btnCont">
      <!-- <el-checkbox v-model="checkedAll" @change="handleCheckedAll" style="margin-left:20px;">全选</el-checkbox> -->
      <el-button size="small" type="primary" @click="exportPress" style="margin-left:10px">导出</el-button>
    </div>
    <el-table
      ref="filterTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      border
      height="100%"
      style="width:100%;min-height:600px;"
      :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
      @selection-change="handleSelectionChange"
      @row-click="handleclick"
      row-key="isbn"
    >
      <el-table-column type="selection" fixed="left" width="45"></el-table-column>
      <el-table-column prop="name" label="馆藏数据库"></el-table-column>
      <el-table-column prop="category" label="类型"></el-table-column>
      <el-table-column prop="publisher" label="出版社/集成商"></el-table-column>
      <el-table-column prop="subject" label="所属学科"></el-table-column>
      <el-table-column prop="other" label="其他"></el-table-column>
      <el-table-column prop="brief" :show-overflow-tooltip="true" label="简介"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[20,40,60,80,100]"
      layout="total, prev, pager, next,sizes"
      style="margin-top:10px;"
      :total="curTotal"
      :page-size="searchParams.curPageSize"
      :current-page="searchParams.currentPage"
    ></el-pagination>
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
    // 重置条件
    clearFilter() {
      var params = [];
      this.params.forEach(function(cur, index) {
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
          this.taskList.push(item.documentId);
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
      // POST /api/gcdatabse/exportInfo
      axios
        .post("/br/api/gcdatabse/exportInfo", pressParams, {
          responseType: "blob"
        })
        .then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            "馆藏数据库" + new Date().getTime() + ".xls"
          );
          document.body.appendChild(link);
          link.click();
        });
      this.getSalableData({}); //获取列表数据
    },
    // 查询
    handleFilter() {
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
        .catch(res => {});
    },
    getSalableData(params) {
      this.tableData = [];
      // POST /api/gcdatabse/findDataList
      this.loading = true;
      this.$post(
        "/api/gcdatabse/findDataList?pageNo=+" +
          this.currentPage +
          "+&pageSize=" +
          this.curPageSize +
          "",
        params
      )
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
    handleclick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length != this.tableData.length) {
        this.checkedAll = false;
      }
    },
    // 联动查询
    linkageQuery() {},
    // 分页每页多少条
    handleSizeChange(val) {
      this.curPageSize = val;
      this.getSalableData({});
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSalableData({});
    }
  }
};
</script>
<style lang='scss' scoped>
#vendibilityManage {
  padding: 15px;
  // background: #fff;
  min-height: 100%;
  border-radius: 5px;
  font-size: 14px;
  #search {
    border-radius: 5px;
    margin-bottom: 10px;
    background: #fff;
    padding-left: 10px;
  }
  .el-checkbox-group {
    margin-top: 5px;
  }
  .el-col-4 {
    margin: 8px;
  }
  .el-col-6 {
    margin: 8px;
  }
  .el-col-5 {
    margin: 8px;
  }
  .el-col-1 {
    margin: 8px;
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
    padding: 20px 0 10px 0;
    background: #fff;
  }
  .salableOrganBookNumber {
    font-size: 16px;
    color: #a1a1a1;
    margin-bottom: 20px;
  }
}
</style>

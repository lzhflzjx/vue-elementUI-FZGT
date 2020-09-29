<template>
  <div id="vendibilityManage">
    <div id="search">
      <el-row>
        <el-col :span="4">
          <label>报刊:</label>
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
          <label>分类:</label>
          <!-- <el-select v-model="params.category" clearable size="small" class="selectItem" disabled>
            <el-option
              v-for="obj in valOption[1]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>-->
          <el-input
            v-model="params.category"
            v-loading="loading"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
            disabled
          ></el-input>
        </el-col>
        <el-col :span="3">
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
      <el-table-column prop="name" label="报刊名"></el-table-column>
      <el-table-column prop="issn" label="刊号"></el-table-column>
      <el-table-column prop="language" label="语种"></el-table-column>
      <el-table-column prop="category" label="分类"></el-table-column>
      <el-table-column prop="startDate" :show-overflow-tooltip="true" label="起始时间"></el-table-column>
      <el-table-column prop="endDate" :show-overflow-tooltip="true" label="截止时间"></el-table-column>
      <el-table-column prop="brief" :show-overflow-tooltip="true" label="简介"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[20,40,60,80,100]"
      layout="total, prev, pager, next,sizes"
      style="margin-top:10px;"
      :total="curTotal"
      :page-size="curPageSize"
      :current-page="currentPage"
    ></el-pagination>
  </div>
</template>

<script>
export default {
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
      params: {
        // brief: "", //简介
        category: "", //分类
        // documentId: "", //唯一标示
        // endDate: "", //截止时间 ,
        // ids: [""], //导出部分信息使用，全选为空 ,
        // issn: "", //刊号 ,
        // language: "", //语种 ,
        name: "", //报刊名 ,
        site: "" // 图书馆 ,
        // startDate: "" //起始时间
      },
      selectRow: [], //
      multipleSelection: [],
      currentPage: 1, //当前页数
      curPageSize: 20, //每页的条数
      curTotal: 0, //总条数
      searchParams: {}, //查询可售数据所需传参
      taskList: [],
      flag: false,
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
    // this.getPressCategroy(); //获取分类数据
    this.findByLibrary(); //获取图书馆数据
  },
  computed: {},
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
    // 查询
    handleFilter() {
      if (this.params.category == "" && this.params.name == "" && this.params.site == "") {
        this.getSalableData(this.params);
      } else {
        this.currentPage = 1;
        this.getSalableData(this.params);
      }
    },
    // 判断是否全选
    handleCheckedAll(data) {
      if (this.multipleSelection.length != this.tableData.length || !data) {
        this.$refs.filterTable.toggleAllSelection();
      }
    },
    // 图书馆查询
    findByLibrary() {
      this.$get("/api/library/findByLibrary", {
        id: "0"
      })
        .then(res => {
          this.libraryOption = res.data.result;
          // this.params.site = Number(this.$route.query.siteid);
        })
        .catch(res => {});
    },
    selectChange(data) {
      this.$forceUpdate();
      this.getPressCategroy(data);
      // this.handleFilter(this.params);
    },
    // 分类查询
    getPressCategroy(id) {
      if (id == "") {
        this.params.category = "";
        return;
      }
      this.loading = true;
      this.$get("/api/press/getPressCategroy", { site: id })
        .then(res => {
          this.params.category = "";
          this.params.category = res.data[0];
          this.loading = false;
        })
        .catch(res => {
          this.loading = false;
        });
    },
    getSalableData(params) {
      this.tableData = [];
      // POST /api/book/find
      this.loading = true;
      this.$post(
        "/api/press/find?pageNo=+" +
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
    exportPress() {
      var pressParams = {
        brief: "",
        category: "",
        documentId: "",
        endDate: "",
        ids: [""],
        issn: "",
        language: "",
        name: "",
        site: "",
        startDate: ""
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
      // POST /api/press/exportPress

      axios
        .post("/br/api/press/exportPress", pressParams, {
          responseType: "blob"
        })
        .then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            "馆藏报刊" + new Date().getTime() + ".xls"
          );
          document.body.appendChild(link);
          link.click();
        });
      this.getSalableData(this.params); //获取列表数据
    },
    handleclick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length != this.tableData.length) {
        this.checkedAll = false;
      }
    },
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
  .el-col-3 {
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

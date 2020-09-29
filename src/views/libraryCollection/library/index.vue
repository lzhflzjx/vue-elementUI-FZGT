<template>
  <div id="vendibilityManage">
    <div id="search">
      <el-row>
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
          <label>类目:</label>
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
        <el-col :span="4">
          <label>书号:</label>
          <el-input
            v-model="params.isbn"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <label>书名:</label>
          <el-input
            v-model="params.name"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
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
      <el-button size="small" type="primary" @click="openTask()" style="margin-left:10px">批量查询</el-button>
      <el-button size="small" type="primary" @click="exportLibrary" style="margin-left:10px">导出</el-button>
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
      <el-table-column prop="isbn" label="ISBN"></el-table-column>
      <el-table-column prop="name" label="主书名"></el-table-column>
      <el-table-column prop="author" label="责任人"></el-table-column>
      <el-table-column prop="publisher" label="出版社"></el-table-column>
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
      checkList: ["复选框 A"],
      libraryOption: [], //图书馆列表
      params: {
        category: "", //类目
        isbn: "", //书号
        name: "", //报刊名 ,
        site: "" // 图书馆 ,
      },
      // params: {
      //   author: "",
      //   category: "",
      //   documentId: "",
      //   ids: [""],
      //   isbn: "",
      //   itTheLibrary: false,
      //   name: "",
      //   publisher: "",
      //   site: ""
      // },
      checkList: [], //可售机构对话框可选机构
      salableOrganType: ["机构一", "机构二", "机构三"],
      exportDialog: false, //导出选项
      selectRow: [], //
      multipleSelection: [],
      currentPage: 1, //当前页数
      curPageSize: 20, //每页的条数
      curTotal: 0, //总条数
      searchParams: {}, //查询可售数据所需传参
      wordOption: [
        // 文字人工审读人：
        { label: "全部", value: "" },
        { label: "审读员", value: "审读员" },
        { label: "0", value: "0" }
      ],
      pressVal: 0,
      taskList: [],
      salableOrganParams: {}, //可售机构传参
      filterTableDataEnd: [],
      flag: false,
      Newitems: [],
      myBackToTopStyle: {
        right: "50px",
        bottom: "50px",
        width: "40px",
        height: "40px",
        "border-radius": "4px",
        "line-height": "45px", // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: "#e7eaf1" // 按钮的背景颜色 The background color of the button
      },
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
    this.getBookCategroy(0); //获取图书分类
    this.findByLibrary(); //获取图书馆数据
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
    closeExportDialog() {
      this.exportDialog = false;
      this.getSalableData(); //获取列表数据
    },
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
    // 图书馆选项变化
    selectChange(data) {
      this.$forceUpdate();
      this.getBookCategroy(data);
      // this.handleFilter(this.params);
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
    exportLibrary() {
      var libraryParams = {
        author: "",
        category: "",
        documentId: "",
        ids: [""],
        isbn: "",
        itTheLibrary: false,
        name: "",
        publisher: "",
        site: ""
      };

      if (this.multipleSelection.length > 0 && this.checkedAll == false) {
        this.taskList = [];
        this.multipleSelection.forEach(item => {
          this.taskList.push(item.documentId);
        });
        libraryParams.ids = this.taskList;
      } else if (this.checkedAll) {
        delete libraryParams.ids;
      } else {
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: "请选择数据！",
            type: "warning"
          });
          return;
        }
      }
      // POST /api/book/exportBook

      axios
        .post("/br/api/book/exportBook", libraryParams, {
          responseType: "blob"
        })
        .then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            "馆藏图书" + new Date().getTime() + ".xls"
          );
          document.body.appendChild(link);
          link.click();
        });
      this.getSalableData(this.params); //获取列表数据
    },
    // 分类查询
    getBookCategroy(id) {
      if (id == "") {
        this.params.category = "";
        return;
      }
      this.loading = true;
      this.$get("/api/book/getBookCategroy", { site: id })
        .then(res => {
          this.loading = false;
          this.params.category = "";
          this.params.category = res.data[0];
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // 判断是否全选
    handleCheckedAll(data) {
      if (this.multipleSelection.length != this.tableData.length || !data) {
        this.$refs.filterTable.toggleAllSelection();
      }
    },
    // 查询
    handleFilter() {
      if (
        this.params.category == "" &&
        this.params.name == "" &&
        this.params.site == "" &&
        this.params.isbn == ""
      ) {
        this.getSalableData(this.params);
      } else {
        this.currentPage = 1;
        this.getSalableData(this.params);
      }
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
    // POST /api/author/selAuthors
    getValue() {
      this.salableOrganParams = {
        isbns: this.taskList.join(),
        organs: this.checkList.join()
      };
    },
    getSalableData(params) {
      this.tableData = [];
      // POST /api/book/find
      this.loading = true;
      this.$post(
        "/api/book/find?pageNo=+" +
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
    // 查看详细
    openTask(type) {
      let site;
      if (this.params.site == "" || this.params.site == undefined) {
        site = null;
      } else {
        site = this.params.site;
      }
      // localStorage.setItem(this.params.site, JSON.stringify(this.tableData));
      let router = this.$router.resolve({
        path: "probe",
        query: { site: site }
      });
      window.open(router.href, "_blank");
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

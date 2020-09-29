<template>
  <div id="vendibilityManage">
    <div id="search">
      <div class="topBar">
        <div class="left">在馆量查询</div>
        <el-button class="right" size="small" type="primary" @click="handleFilter">馆藏探测</el-button>
      </div>
      <div>
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
      </div>
    </div>
    <div class="btnCont">
      <!-- <el-checkbox v-model="checkedAll" @change="handleCheckedAll" style="margin-left:20px;">全选</el-checkbox> -->
      <probeUpload style="float:left;margin-left:10px" ref="importExcel" @func="getTableData"></probeUpload>
      <!-- <el-button size="small" type="primary" @click="openTask('导出')" style="margin-left:10px">导入书单</el-button> -->
      <!-- <span>
        <el-input
          clearable
          v-model="item.val"
          @keyup.native="item.val=item.val.replace(/[^\d、]/g,'')"
          placeholder="多个ISBN用顿号间隔"
          size="mini"
          style="width:260px;"
        ></el-input>
        <input style="display:none" id="isbnImportBtn" type="file" @change="importf($event,item)" />
        <i
          style="font-size:20px;color:#409EFF;"
          class="el-icon-upload2"
          @click="selectFile"
          title="导入"
        ></i>
      </span>-->
      <el-button style="margin-left:10px" size="mini" type="primary" @click="handleDownload">导出</el-button>
      <!-- <el-button size="mini" type="primary" @click="exportLibrary" style="margin-left:10px">导出</el-button> -->
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
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column prop="publisher" label="出版社"></el-table-column>
      <el-table-column prop="flag" label="在馆数量" :formatter="formatRole"></el-table-column>
      <el-table-column prop="flag" label="在馆信息" :formatter="formatRole"></el-table-column>
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
import probeUpload from "@/components/probeUpload";

export default {
  components: {
    probeUpload
  },
  data() {
    return {
      flagType: ["否", "是"],
      files: null,
      item: "",
      search: "",
      tableData: [],
      checkedAllIsAble: false,
      selectFiltData: [], //查询的数据
      tableDataEnd: [],
      salableOrgan: {},
      pubDate: [],
      checkList: ["复选框 A"],
      libraryOption: [], //图书馆列表
      params: {},
      checkList: [], //可售机构对话框可选机构
      salableOrganType: ["机构一", "机构二", "机构三"],
      centerDialogVisible: false, //选择可售机构对话框
      exportDialog: false, //导出选项
      selectRow: [], //
      multipleSelection: [],
      currentPage: 1, //当前页数
      curPageSize: 20, //每页的条数
      curTotal: 0, //总条数
      searchParams: {}, //查询可售数据所需传参
      pressVal: 0,
      taskList: [],
      filterTableDataEnd: [],
      flag: false,
      Newitems: [],
      column: [], //后端排序
      checkedAll: false,
      loading: false
    };
  },
  created() {
    // this.getSalableData({}); //获取列表数据
    this.findByLibrary(); //获取图书馆数据
    // this.init(); //初始化数据
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
    //数据转换
    formatRole(row, column) {
      return row.flag == true ? "是" : "否";
    },
    getTableData(data) {
      if (this.params.site) {
        this.tableData = data;
        var isbnList = [];
        data.forEach(element => {
          if (element.isbn) {
            isbnList.push(element.isbn);
          }
        });
        this.collectionDetection(this.params.site, isbnList);
      } else {
        this.$message("请先选择图书馆");
        return;
      }
    },
    closeExportDialog() {
      this.exportDialog = false;
      this.getSalableData(); //获取列表数据
    },
    init() {
      if (this.$route.query.site == null) {
      } else {
        this.libraryOption.forEach(item => {
          if (this.$route.query.site == item.siteid) {
            this.params.site = item.library;
          }
        });
        this.collectionDetection(this.$route.query.site, ["1"]);
      }
    },
    //POST /api/book/findStock
    // 在馆量查询
    collectionDetection(site, isbnList) {
      this.$post("/api/book/findStock", {
        isbnList: isbnList,
        site: site
      })
        .then(res => {
          let arryNew = [];
          this.tableData.map((item, index) => {
            arryNew.push(Object.assign({}, item, { flag: 1 }));
          });
          let object = res.data;
          for (const key in object) {
            // const element = object[key];
            arryNew.forEach(element => {
              if (key == element.isbn) {
                element.flag = object[key];
              }
            });
          }
          this.tableData = arryNew;
          console.log("this.tableData");
          console.log(this.tableData);
        })
        .catch(res => {});
    },
    // 图书馆选项变化
    selectChange(data) {},
    // 导出
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["isbn", "主书名", "作者", "出版社", "是否在馆"];
        const filterVal = ["isbn", "name", "author", "publisher", "flag"];
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            // return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    // 图书馆查询
    findByLibrary() {
      this.$get("/api/library/findByLibrary", {
        id: "0"
      })
        .then(res => {
          this.libraryOption = res.data.result;
          this.init(this.libraryOption);
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
            "馆藏图书" + new Date().getTime() + ".xlsx"
          );
          document.body.appendChild(link);
          link.click();
        });
      this.getSalableData(); //获取列表数据
    },
    selectFile() {
      document.getElementById("isbnImportBtn").value = "";
      document.getElementById("isbnImportBtn").click();
    },
    importf(obj, filtItem) {
      if (!obj.target.files) {
        return;
      }
      var f = obj.target.files[0];
      var fileName = f.name;
      var fileext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
      if (fileext != ".xls" && fileext != ".xlsx") {
        this.$message.error("只能上传excel文件");
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var wb = XLSX.read(data, {
          type: "binary"
        });
        let fileObj = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        let arr = [];
        fileObj.forEach(item => {
          arr.push(item.ISBN);
        });
        filtItem.val = arr.join("、");
      };
      reader.readAsBinaryString(f);
    },
    // 判断是否全选
    handleCheckedAll(data) {
      if (this.multipleSelection.length != this.tableData.length || !data) {
        this.$refs.filterTable.toggleAllSelection();
      }
    },
    // 查询
    handleFilter() {
      let router = this.$router.resolve({
        path: "pavilion"
      });
      window.open(router.href, "_blank");
    },
    getSalableData(params) {
      this.tableData = [];
      // POST /api/book/find
      // this.loading = true;
      this.$post(
        "/api/book/find?pageNo=+" +
          this.currentPage +
          "+&pageSize=" +
          this.curPageSize +
          "",
        params
      )
        .then(res => {
          // this.loading = false;
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
          // this.loading = false;
          // this.$message.error(err);
        });
    },
    openTask(type) {
      if (this.multipleSelection.length == 1) {
        let library = "";
        this.multipleSelection.forEach(item => {
          library = item.library;
        });
        let url = "";
        if (type == "馆藏图书") {
          url = "dataBase";
        }
        if (type == "馆藏数据库") {
          url = "library";
        }
        if (type == "馆藏报刊") {
          url = "press";
        }
        let router = this.$router.resolve({
          path: url,
          query: { library: library }
        });
        window.open(router.href, "_blank");
      } else {
        this.$message("您需要选择且只能选择一条数据");
      }
    },
    handleclick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 联动查询
    linkageQuery() {},
    // 分页每页多少条
    handleSizeChange(val) {
      var params = [];
      this.params.forEach(function(cur, index) {
        if (cur.value[0] != "") {
          params.push(cur);
        }
      });
      if (this.column.prop != undefined && params.length != 0) {
        this.curPageSize = val;
        this.getSalableData(this.column, params);
      } else if (this.column.prop != undefined) {
        this.curPageSize = val;
        this.getSalableData(this.column, []);
      } else if (params.length != 0) {
        this.curPageSize = val;
        this.getSalableData(undefined, params);
      } else {
        this.curPageSize = val;
        this.getSalableData();
      }
    },
    // 翻页
    handleCurrentChange(val) {
      var params = [];
      this.params.forEach(function(cur, index) {
        if (cur.value[0] != "") {
          params.push(cur);
        }
      });
      if (this.column.prop != undefined && params.length != 0) {
        this.currentPage = val;
        this.getSalableData(this.column, params);
      } else if (this.column.prop != undefined) {
        this.currentPage = val;
        this.getSalableData(this.column, []);
      } else if (params.length != 0) {
        this.currentPage = val;
        this.getSalableData(undefined, params);
      } else {
        this.currentPage = val;
        this.getSalableData();
      }
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
    .topBar {
      height: 40px;
      padding: 5px;
      .left {
        float: left;
        margin-top: 5px;
        font-size: 18px;
      }
      .right {
        float: right;
        margin-top: 5px;
      }
    }
  }
  .el-checkbox-group {
    margin-top: 5px;
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

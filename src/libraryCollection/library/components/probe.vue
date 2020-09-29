<template>
  <div id="vendibilityManage">
    <div id="search">
      <div class="topBar">
        <div class="left">馆藏探测</div>
        <el-button class="right" size="small" type="primary" @click="handleFilter">在馆量查询</el-button>
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
      <el-button style="margin-left:10px" size="mini" type="primary" :loading="downloadLoading" @click="handleDownload">导出</el-button>
      <a href="./static/ISBNTemplate.xlsx" style="font-size:12px;margin-left: 10px;">馆藏探测模板</a>
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
      <el-table-column prop="itTheLibrary" label="是否在馆" :formatter="formatRole"></el-table-column>
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
      downloadLoading: false,//正在导出
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
      loading: false,
      list: [] // 导入的数据
    };
  },
  created() {
    this.findByLibrary(); //获取图书馆数据
    this.init(); //初始化数据
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
      return row.itTheLibrary == true ? "是" : "否";
    },
    // 导入
    getTableData(data) {
      this.tableData = []
      this.list = []
      if (data.toString() == []) {
        this.curTotal = data.length;
        return;
      }
      if (this.params.site) {
        this.tableData = data;
        var isbnList = [];
        this.tableData.forEach(element => {
          if (element.ISBN) {
            isbnList.push(element.ISBN);
          }
        });
        // if (isbnList.toString() == []) {
        //   return;
        // } else {
        //   // this.$message.success("导入成功");
        // }
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
        // 下拉框回显
        this.params.site = Number(this.$route.query.site)
        // var detail = JSON.parse(localStorage.getItem(this.$route.query.site));
        // this.tableData = detail;
        // let isbnList = [];
        // this.tableData.forEach(element => {
        //   if (element.isbn) {
        //     isbnList.push(element.isbn);
        //   }
        // });
        // this.collectionDetection(this.$route.query.site, isbnList);
      }
    },
    // POST /api/book/collectionDetection
    // 馆藏探测
    collectionDetection(site, isbnList) {
      this.$post("/api/book/collectionDetection", {
        isbnList: isbnList,
        site: site
      })
        .then(res => {
          if (this.$route.query.site == null && res.data != null) {
            this.$message.success("导入成功");
          }
          var obj = res.data;
          let list = []
          for (let i in obj) {
            list.push(obj[i]);
          }
          this.list = list
          this.getProbeList(this.list);
        })
        .catch(res => {});
    },
    // 处理导入数据
    getProbeList(list) {
      this.curTotal = list.length;
      //过滤分页
      this.tableData = list.filter(
        (item, index) =>
          index < this.currentPage * this.curPageSize &&
          index >= this.curPageSize * (this.currentPage - 1)
      );
    },
    // 图书馆选项变化
    selectChange(data) {
      this.$forceUpdate();
    },
    // 导出
    handleDownload() {
      if (this.multipleSelection.length > 0) {
        this.taskList = [];
        let download = this.multipleSelection
        var copyLIst = JSON.parse(JSON.stringify(download))
        copyLIst.forEach(item => {
          item.itTheLibrary = item.itTheLibrary == true ? "是" : "否";
          this.taskList.push(item);
        });
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = ["ISBN", "主书名", "责任人", "出版社", "是否在馆"];
          const filterVal = [
            "isbn",
            "name",
            "author",
            "publisher",
            "itTheLibrary"
          ];
          const list = this.taskList;
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
      } else {
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: "请选择导出数据！",
            type: "warning"
          });
          return;
        }
      }
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
    handleclick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 联动查询
    linkageQuery() {},
    // 分页每页多少条
    handleSizeChange(val) {
      this.curPageSize = val;
      this.getProbeList(this.list);
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getProbeList(this.list);
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

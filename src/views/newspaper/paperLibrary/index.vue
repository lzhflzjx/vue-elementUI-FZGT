<template>
  <div id="bookLibrary" v-loading="loading">
    <filterPage :modelName="'报刊库'" @sendSearchData="getData"></filterPage>
    <div class="operateBtns">
      <el-checkbox :disabled="curTotal>10000" v-model="checkedAll" @change="handleCheckedAll" style="margin-right:10px;">全选</el-checkbox>
      <el-button size="small" type="primary" @click="paperLibraryAdd()">单条新增</el-button>
      <el-button size="small" type="primary" @click="openUpload">批量新增</el-button>
      <el-button size="small" type="primary" @click="openTask('启用')">启用</el-button>
      <!-- <span v-if="permission.indexOf('F_BR_LOCK')!=-1" @click="openTask('锁定')"><i class="el-icon-lock"></i>
      锁定</span>&nbsp;&nbsp;&nbsp;&nbsp;-->
      <!-- <span v-if="permission.indexOf('F_BR_STOP')!=-1" @click="openTask('停用')"><i class="icon-tingyong"></i> 停用</span> -->
      <el-button size="small" type="primary" @click="openTask('停用')">停用</el-button>
      <el-button size="small" type="primary" @click="openTask('修改')">修改</el-button>
      <span class="rgBtn">
        <el-button size="small" @click="openTask('导出csv')">导出csv</el-button>
        <el-button size="small" @click="openTask('导出word')">导出word</el-button>
      </span>
    </div>
    <div class="content">
      <el-table ref="multipleTable" :data="tableData" border size="medium" height="740" style="width:100%;" @row-dblclick="openCheckDetail" :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}" :row-style="rowClass" row-key="sn" @selection-change="handleSelectionChange">
        <el-table-column type="selection" fixed="left" width="45"></el-table-column>
        <!-- <el-table-column type="index" label="序号" width="50">
          <template slot-scope="scope">{{scope.$index+1+(currentPage-1)*curPageSize}}</template>
        </el-table-column>-->
        <el-table-column width="70" label="机器审读结果"></el-table-column>
        <el-table-column width="70" label="审读人"></el-table-column>
        <el-table-column width="70" label="各期实物审读"></el-table-column>
        <el-table-column prop="pressNo" width="70" label="刊号"></el-table-column>
        <el-table-column prop="name" label="刊名"></el-table-column>
        <el-table-column prop="issn" label="ISSN"></el-table-column>
        <el-table-column prop="issue" :show-overflow-tooltip="true" label="期数"></el-table-column>
        <el-table-column prop="status" :show-overflow-tooltip="true" label="状态"></el-table-column>
        <el-table-column prop="publisher" width="70" label="出版社"></el-table-column>
        <el-table-column prop="isOa" width="128" :formatter="formatOA" label="是否OA刊"></el-table-column>
        <el-table-column prop="impactFactor" width="150" label="影响因子"></el-table-column>
        <!-- <el-table-column prop="seriesName" width="150" label="启停状态"></el-table-column>
        <el-table-column prop="secondName" width="150" label="副书名"></el-table-column>
        <el-table-column prop="cnName" width="150" label="中文参考译名"></el-table-column>
        <el-table-column prop="publishers" width="150" label="出版社"></el-table-column>
        <el-table-column prop="currency" width="70" label="币制"></el-table-column>
        <el-table-column prop="price" width="70" label="价格">
          <template slot-scope="scope">
            <a
              style="cursor:pointer;"
              @click="getPriceInfo(scope.row)"
              type="text"
              size="small"
            >{{scope.row.price}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="referenceRMBPrice" width="70" label="人民币参考价(元)"></el-table-column>
        <el-table-column prop="pageNumber" width="70" label="页码"></el-table-column>
        <el-table-column prop="pubDate" width="160" label="出版时间"></el-table-column>
        <el-table-column prop="medium" width="70" label="载体"></el-table-column>
        <el-table-column prop="isBlockUp" width="70" label="装帧"></el-table-column>-->
        <el-table-column prop="isBlockUp" :formatter="formatBlock" width="70" label="启停状态">
          <!-- <template slot-scope="scope">
            <i v-if="scope.row.isLock" class="el-icon-lock" style="font-size:17px;color:#409eff;"></i>
            <i v-if="scope.row.isBlockUp" class="icon-tingyong" style="color:#409eff;"></i>
          </template>-->
        </el-table-column>
      </el-table>
      <div class="pageAndExport" v-show="tableData.length>0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20,40,60,80,100]" :page-size="curPageSize" layout="total, prev, pager, next,sizes" :total="curTotal"></el-pagination>
      </div>

      <!-- 查看价格信息 -->
      <el-dialog title="导出csv" :visible.sync="dialogTableVisible" :before-close="closePriceInfoDialog">
        <span class="priceInfoStyle">价格对应的isbn:{{this.priceInfo.isbn}}</span>
        <el-table :data="priceInfoData" border>
          <el-table-column prop="site" label="渠道/来源">
            <template slot-scope="scope">
              <div>{{changeSite(site,scope.row.site)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格"></el-table-column>
          <el-table-column prop="currency" label="币制"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <!-- 导出csv -->
    <el-dialog class="exportcsv" title="导出CSV" :visible.sync="exportDialog" width="30%">
      <div class="titleCsv">请选择导出模板</div>
      <el-radio-group v-model="radioCsv">
        <el-radio :label="3">显示列</el-radio>
        <el-radio :label="6">报刊所有列</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportDialog = false">取 消</el-button>
        <el-button type="primary" @click="exportPress(radioCsv)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="openTaskType" @open="initTask(openTaskType)" :visible.sync="taskDialog" width="900px" center>
      <task ref="task" :modelType="'book'" :taskData="taskList" :taskTotleNum="curTotal" :checkedAll="checkedAll" :searchParams="searchParams" @closeDialog="closeDialog"></task>
    </el-dialog>
    <!-- <el-dialog title="批量新增" :visible.sync="taskClaimDialog" width="800px" center>
      <taskClaim ref="taskClaim" :taskData="taskList" @closeDialog="closeDialog"></taskClaim>
    </el-dialog> -->
    <el-dialog title="批量新增" :visible.sync="batchUploadDialog" width="1100px" center>
      <batchUpload :modelName="'报刊库'" ref="batchUpload" @closeDialog="closeDialog"></batchUpload>
    </el-dialog>
    <!-- <el-dialog title="导出选项" :visible.sync="exportDialog" width="600px" center>
      <selectTem ref="selectTem" :moudleType="'book'" :idList="taskList" :exportAll="checkedAll" @closeDialog="closeExportDialog"></selectTem>
    </el-dialog>-->
  </div>
</template>

<script>
import filterPage from "@/components/filter/filterPage";
import task from "@/components/task/taskAllocationAdd";
import taskClaim from "@/components/task/taskClaim";
import batchUpload from "@/components/task/batchUpload";
import selectTem from "@/components/export/selectTem";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      radioCsv: 3, //导出csv
      exportDialog: false, //导出csv
      loading: false,
      tableData: [],
      priceInfoData: [], //价格信息
      priceInfo: {
        isbn: ""
      }, //价格信息
      dialogTableVisible: false, //价格详细信息对话框
      selectRow: [], //
      multipleSelection: [],
      currentPage: 1,
      curPageSize: 20,
      curTotal: 0,
      searchParams: {},
      taskDialog: false,
      taskClaimDialog: false,
      addTaskDialog: false,
      batchUploadDialog: false,
      exportDialog: false,
      openTaskType: "",
      taskList: [],
      checkedAll: false,
      permission: JSON.parse(localStorage.getItem("userInfo")).permission
    };
  },
  components: {
    filterPage,
    task,
    taskClaim,
    batchUpload,
    selectTem
  },
  computed: {
    ...mapGetters([
      "commonReadResult",
      "entityReadResult",
      "imagesManualReadResult",
      "ctClassification",
      "bisacClassification",
      "classification1",
      "classification2",
      "site"
    ])
  },
  watch: {
    multipleSelection(data) {
      //存储选中的row
      this.selectRow = [];
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(item.sn);
        });
      }
    }
  },
  methods: {
    // 导出csv
    exportPress(allAttr) {
      allAttr == 3 ? (allAttr = false) : (allAttr = true);
      var pressParams = {
        all: false,
        allAttr: allAttr, //是否全字段 false--否
        sn: this.taskList
      };
      if (this.checkedAll == true) {
        pressParams = {
          all: true,
          allAttr: allAttr,
          pressLibraryQuery: {
            params: this.searchParams.params
          }
        };
      }
      // if (pressParams.sn[0] == null) {
      //   this.$message.warning("必要的导出参数sn为空");
      //   return;
      // }
      // POST /api/pressLibrary/exportToCsv
      axios
        .post("/br/api/pressLibrary/exportToCsv", pressParams, {
          responseType: "blob"
        })
        .then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            "报刊库" + new Date().getTime() + ".csv"
          );
          document.body.appendChild(link);
          link.click();
        });
      this.getSearchData(); //获取列表数据
      this.exportDialog = false;
    },
    // 导出word
    exportWord(allAttr) {
      let arrword = this.multipleSelection
      let wordParams
      for (var i in arrword) {
        wordParams = new Array();
        for (var j in arrword) {
          var objWord = new Object();  //每次循环都会新建一个对象，这个对象的name，issn等于每次循环的值
          // brief (string, optional): 译文简介 ，
          // corePress (string, optional): 是否核心刊 ,
          // createYear (string, optional): 创刊年份 ,
          // issn (string, optional): ISSN ,
          // name (string, optional): 刊名 ,
          // pastPress (string, optional): 可供过刊 ,------待确认
          // periods (integer, optional): 期数 ,
          // placeOfPublication (string, optional): 出版地 ,
          // pressId (string, optional): 刊号 ,
          // price (string, optional): 中图刊价 ,
          // publisher (string, optional): 出版社 ,
          // status (string, optional): 出版状态 ,
          // type (string, optional): 中图分类号
          // ------------------------------------列表字段对应
          // isCompendex 是否核心刊
          // status 出版状态
          // translatIntroduction  译文简介 
          // chPrice中图刊价
          // chClassNo中图分类号
          // creadYear创刊年
          // publishLocate出版地
          // isCompendex是否核心刊
          objWord.brief = arrword[j].translatIntroduction == undefined ? "" : arrword[j].translatIntroduction;
          objWord.corePress = arrword[j].isCompendex == undefined ? false : (arrword[j].isCompendex == true ? true : false);
          objWord.createYear = arrword[j].creadYear == undefined ? "" : arrword[j].creadYear;
          objWord.issn = arrword[j].issn == undefined ? "" : arrword[j].issn;
          objWord.name = arrword[j].name == undefined ? "" : arrword[j].name;
          objWord.pastPress = arrword[j].pastPress == undefined ? "" : arrword[j].pastPress; //删掉
          objWord.periods = arrword[j].issue == undefined ? 0 : arrword[j].issue;
          objWord.placeOfPublication = arrword[j].publishLocate == undefined ? "" : arrword[j].publishLocate;
          objWord.pressId = arrword[j].pressNo == undefined ? "" : arrword[j].pressNo;
          objWord.price = arrword[j].chPrice == undefined ? "" : arrword[j].chPrice;
          objWord.publisher = arrword[j].publisher.length == 0 ? "" : arrword[j].publisher;
          objWord.status = arrword[j].status == undefined ? "" : arrword[j].status;
          objWord.type = arrword[j].chClassNo == undefined ? "" : arrword[j].chClassNo;
          wordParams.push(objWord);//将每一次循环创建的对象push到数组中去
        }
      }
      // POST /api/pressLibrary/toWord
      axios
        .post("/br/api/pressLibrary/toWord", wordParams, {
          responseType: "blob"
        })
        .then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            "报刊库" + new Date().getTime() + ".doc"
          );
          document.body.appendChild(link);
          link.click();
        });
      this.getSearchData(); //获取列表数据
      this.exportDialog = false;
    },
    // 停用
    disBlock(flag, text) {
      this.$confirm("确定" + text + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$get("/api/pressLibrary/updateIsBlockUp", {
          sns: this.taskList.join(","),
          isBlockUp: flag
        }).then(res => {
          if (res.success) {
            this.getSearchData();
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    //启停状态
    formatBlock(row, column) {
      return row.isBlockUp == true ? "停用" : "启用";
    },
    //启停状态
    formatOA(row, column) {
      let isOA;
      if (row.isOa == true) {
        isOA = "是";
      } else if (row.isOa == false) {
        isOA = "否";
      } else {

      }
      return isOA
    },
    // 单条新增
    paperLibraryAdd(data) {
      let router = this.$router.resolve({
        path: "/paperLibraryAdd"
        // query: { sn: data.sn, source: this.params.source }
      });
      window.open(router.href, "_blank");
    },
    closeExportDialog() {
      this.$refs.multipleTable.clearSelection();
      this.checkedAll = false;
      this.exportDialog = false;
    },
    handleCheckedAll(data) {
      if (this.multipleSelection.length != this.tableData.length || !data) {
        this.$refs.multipleTable.toggleAllSelection();
      }
    },
    // 转换信源值
    changeSite(param, value) {
      param.forEach(item => {
        if (item.value == value) {
          value = item.name;
        }
      });
      return value;
    },
    // 查看价格信息
    getPriceInfo(data) {
      this.priceInfo.isbn = data.isbn;
      if (data.isbn == undefined) {
        var requestParams = {
          isbn: ""
        };
      } else {
        var requestParams = {
          isbn: data.isbn
        };
      }
      this.dialogTableVisible = true;
      this.$get("/api/product/getPriceInfo", requestParams)
        .then(res => {
          if (res.data.result && res.data.result.length > 0) {
            let data = [];
            res.data.result.forEach(obj => {
              data.push(obj);
            });
            this.priceInfoData = data;
          }
        })
        .catch();
    },
    closePriceInfoDialog() {
      this.priceInfoData = [];
      this.dialogTableVisible = false;
    },
    openCheckDetail(data) {
      var sn;
      if (data != undefined) {
        sn = data.sn;
        if (data.isBlockUp == true) {
          this.$message.warning("停用报刊不可编辑");
          return;
        }
      } else {
        if (this.taskList.length > 1) {
          this.$message.info("只能选择一条报刊数据修改");
          return;
        } else {
          sn = this.taskList.join(",");
          let BlockList = [];
          this.multipleSelection.forEach(item => {
            BlockList.push(item.isBlockUp);
          });
          if (BlockList[0] == true) {
            this.$message.warning("停用报刊不可编辑");
            return;
          }
        }
      }
      var sns = [];
      this.tableData.forEach(item => {
        sns.push(item.sn)
      })
      sessionStorage.setItem('paperLibraryList', JSON.stringify(sns));
      // sessionStorage.setItem("bookCheckList", JSON.stringify(ids));
      let router = this.$router.resolve({
        path: "/paperLibraryAdd",
        query: { sn: sn }
      });
      window.open(router.href, "_blank");
    },
    closeDialog() {
      this.taskDialog = false;
      this.taskClaimDialog = false;
      this.batchUploadDialog = false;
      this.getSearchData();
    },
    getData(obj) {
      this.currentPage = 1;
      this.curPageSize = 20;
      this.searchParams = obj;
      this.checkedAll = false;
      this.getSearchData();
    },
    //  选中行高亮
    rowClass({ row, rowIndex }) {
      if (this.selectRow.includes(row.sn)) {
        return { "background-color": "rgba(185, 221, 249, 0.75)" };
      }
    },
    getSearchData() {
      this.tableData = [];
      this.searchParams.pageNo = this.currentPage;
      this.searchParams.pageSize = this.curPageSize;
      this.loading = true;
      // POST /api/pressLibrary/findList
      this.$post("/api/pressLibrary/findList", this.searchParams)
        .then(res => {
          this.loading = false;
          if (res.data.result && res.data.result.length > 0) {
            let data = [];
            res.data.result.forEach(obj => {
              for (const k in obj) {
                if (obj[k].value) {
                  obj[k] = obj[k].value;
                } else {
                  obj[k] = "";
                }
              }
              data.push(obj);
            });
            this.tableData = data;
          }
          this.curTotal = res.data.totalCount;
          if (this.checkedAll) {
            this.$refs.multipleTable.toggleAllSelection();
          }
        })
        .catch(err => {
          this.loading = false;
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
            this.taskList.push(item.sn);
          });
          if (type == "任务分配") {
            this.openTaskType = type;
            this.taskDialog = true;
          }
          if (type == "批量新增") {
            this.taskClaimDialog = true;
            this.$nextTick(() => {
              this.$refs.taskClaim.init();
            });
          }
          if (type == "图书删除") {
            this.delBook();
          }
          if (type == "修改") {
            this.openCheckDetail();
          }
          if (type == "导出csv") {
            this.exportDialog = true;
            // this.$nextTick(() => {
            //   this.$refs.selectTem.init(this.searchParams, "paperExport");
            // });
          }
          if (type == "导出word") {
            this.exportWord()
          }
          if (type == "锁定") {
            this.lock();
          }
          if (type == "停用") {
            this.disBlock(true, "停用");
          }
          if (type == "启用") {
            this.disBlock(false, "启用");
          }
        } else {
          if (type == "导出") {
            this.$message.warning("请选择导出任务");
          } else if (type == "图书删除") {
            this.$message.warning("请选择图书");
          } else {
            this.$message.warning("请选择任务");
          }
        }
      }
    },
    lock() {
      this.$confirm("确定锁定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$get("/api/product/updateIsLock", {
          isbns: this.taskList.join(","),
          isLock: true
        }).then(res => {
          if (res.success) {
            this.getSearchData();
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    delBook() {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$get("/api/product/delProducts", {
          isbns: this.taskList.join(",")
        }).then(res => {
          if (res.success) {
            this.getSearchData();
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    openUpload() {
      this.batchUploadDialog = true;
      this.$nextTick(() => {
        this.$refs.batchUpload.init();
      });
    },
    initTask(data) {
      if (data == "批量图书上传") {
        this.$nextTick(() => {
          this.$refs.batchUpload.init();
        });
      } else {
        this.$nextTick(() => {
          this.$refs.task.init(data);
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length != this.tableData.length) {
        this.checkedAll = false;
      }
    },
    handleSizeChange(val) {
      this.curPageSize = val;
      this.getSearchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSearchData();
    }
  }
};
</script>
<style lang="scss" scoped>
#bookLibrary {
  padding: 15px;
  background: #fff;
  min-height: 100%;
  border-radius: 5px;
  box-sizing: border-box;
  .exportcsv {
    .titleCsv {
      padding-left: 150px;
      color: #a1a1a1;
    }
    /deep/ .el-dialog__body {
      padding: 0px;
      .el-radio-group {
        margin-left: 150px;
        .el-radio {
          display: block;
          margin-top: 20px;
        }
      }
    }
  }
  .operateBtns {
    padding-left: 12px;
    margin-bottom: 10px;
    .rgBtn {
      float: right;
      font-size: 12px;
      margin-right: 20px;
      color: gray;
      cursor: pointer;
      :hover {
        color: #409eff;
      }
      i {
        font-weight: 600;
        font-size: 18px;
      }
    }
  }
  .pageAndExport {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    span {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
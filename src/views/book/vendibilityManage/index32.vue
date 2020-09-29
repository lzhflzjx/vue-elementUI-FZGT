<template>
  <div id="vendibilityManage">
    <div>
      <el-row>
        <el-col :span="4">
          <label>人工审读结果:</label>
          <el-select v-model="params[0].value[0]" clearable size="small" class="selectItem">
            <el-option
              v-for="obj in valOption[0]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <label>机器审读结果:</label>
          <el-select v-model="params[1].value[0]" clearable size="small" class="selectItem">
            <el-option
              v-for="obj in valOption[1]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <label>实物审读结果:</label>
          <el-select v-model="params[2].value[0]" clearable size="small" class="selectItem">
            <el-option
              v-for="obj in valOption[2]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <label>图片审读结果:</label>
          <el-select v-model="params[3].value[0]" clearable size="small" class="selectItem">
            <el-option
              v-for="obj in valOption[3]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <label>文字人工审读人:</label>
          <el-select v-model="params[4].value[0]" clearable size="small" class="selectItem">
            <el-option
              v-for="obj in valOption[4]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div class="keywords">
        <el-input
          v-model="params[5].value[0]"
          size="small"
          placeholder="输入关键词或者完整ISBN进行查询"
          style="width:250px;"
          clearable
        ></el-input>
        <el-button size="small" type="primary" @click="handleFilter">查询</el-button>
        <el-button size="small" type="primary" @click="clearFilter">重置条件</el-button>
      </div>
    </div>
    <div class="btnCont">
      <el-checkbox
        v-model="checkedAll"
        :disabled="checkedAllIsAble||curTotal>10000"
        style="margin-right:10px;"
      >全部</el-checkbox>
      <el-button
        v-if="permission.indexOf('F_BR_SSG')!=-1"
        size="small"
        type="primary"
        @click="openSalableOrgan"
      >选择可售机构</el-button>
      <el-button size="small" type="primary" @click="openTask('导出')">导出</el-button>
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
      :row-style="rowClass"
      row-key="isbn"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" fixed="left" width="45"></el-table-column>
      <el-table-column type="index" label="序号" width="50">
        <template slot-scope="scope">{{scope.$index+1+(currentPage-1)*curPageSize}}</template>
      </el-table-column>
      <el-table-column prop="salableOrgan" width="70" label="可售机构">
        <!-- <template slot-scope="scope">{{salableOrganType[scope.row.salableOrgan]}}</template> -->
        <template slot-scope="scope">
          <span v-if="scope.row.salableOrgan != null" v-text="changeReader(scope.row.salableOrgan)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="commonReadResult" width="70" label="人工和机器审读结果">
        <template
          slot-scope="scope"
        >{{commonResultType[scope.row.manualReviewResult != null ? scope.row.manualReviewResult:scope.row.autoReviewResult]}}</template>
      </el-table-column>
      <el-table-column prop="entityReadResult" width="70" label="实物审读结果">
        <template slot-scope="scope">{{entityResultType[scope.row.entityReadResult]}}</template>
      </el-table-column>
      <el-table-column prop="imageReadResult" width="70" label="图片审读结果">
        <template slot-scope="scope">{{imgResultType[scope.row.imageReadResult]}}</template>
      </el-table-column>
      <el-table-column prop="manualReviewUser" width="70" label="文字人工审读人"></el-table-column>
      <el-table-column prop="classification1" width="70" label="业务分类1" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div>{{methods.classification(classification1,scope.row.classification1)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="classification2" width="70" label="业务分类2" :show-overflow-tooltip="true">
        <template slot-scope="scope">
            <div>{{methods.classification(classification2,scope.row.classification2)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="ctClassification" label="中图法" :show-overflow-tooltip="true">
        <template slot-scope="scope" >
            <div>{{methods.classification(ctClassification,scope.row.ctClassification)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="bisacClassification" label="BISAC分类" :show-overflow-tooltip="true">
        <template slot-scope="scope">
            <div>{{methods.classification(bisacClassification,scope.row.bisacClassification)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="language" width="70" label="文版"></el-table-column>
      <el-table-column prop="isbn" width="128" label="ISBN"></el-table-column>
      <el-table-column prop="bookName" width="150" label="主书名"></el-table-column>
      <el-table-column prop="seriesName" width="150" label="丛书名"></el-table-column>
      <el-table-column prop="secondName" width="150" label="副书名"></el-table-column>
      <el-table-column prop="cnName" width="150" label="中文参考译名"></el-table-column>
      <el-table-column prop="publishers" width="150" label="出版社"></el-table-column>
      <el-table-column prop="currency" width="70" label="币制"></el-table-column>
      <el-table-column prop="price" width="70" sortable="custom" label="价格"></el-table-column>
      <el-table-column prop="referenceRMBPrice" width="70" label="人民币参考价(元)"></el-table-column>
      <el-table-column prop="pageNumber" width="70" label="页码"></el-table-column>
      <el-table-column prop="pubDate" width="160" sortable="custom" label="出版时间"></el-table-column>
      <el-table-column prop="medium" width="70" label="载体"></el-table-column>
      <el-table-column prop="binding" width="70" label="装帧"></el-table-column>
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
    <!-- 选择可售机构对话框 -->
    <el-dialog
      title="选择可售机构"
      :visible.sync="centerDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <div class="salableOrganBookNumber">
        <span v-if="this.multipleSelection.length>0">已选定{{this.multipleSelection.length}}本图书</span>
        <span v-else>已选定{{this.curTotal}}本图书</span>
      </div>
      <el-checkbox-group v-model="checkList" @change="getValue()">
        <el-checkbox
          v-for="(item,i) in salableOrganOption"
          :key="i"
          :label="item.value"
          :checked="item.checked"
        >{{item.content}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" ref="closeDialog">取 消</el-button>
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导出选项" :visible.sync="exportDialog" width="600px" center>
      <selectTem
        ref="selectTem"
        :moudleType="'book'"
        :vendibilityManage="'vendibilityManage'"
        :idList="taskList"
        :exportAll="checkedAll"
        @closeDialog="closeExportDialog"
      ></selectTem>
    </el-dialog>
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
      permission: JSON.parse(localStorage.getItem("userInfo")).permission,
      search: "",
      tableData: [],
      checkedAllIsAble: false,
      selectFiltData: [], //查询的数据
      tableDataEnd: [],
      salableOrgan: {},
      params: [
        //传递的参数
        {
          field: "manualReviewResult", //参数名称 人工的审读结果
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "autoReviewResult", //参数名称 人工和机器的审读结果
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "entityReadResult", //参数名称 实物审读结果
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "imageReadResult", //参数名称 图片审读结果
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "manualReviewUser", //参数名称 文字人工审读人
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "all", //模糊搜索
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        }
      ],
      checkList: [], //可售机构对话框可选机构
      salableOrganType: ["机构一", "机构二", "机构三"],
      salableOrganOption: [
        { value: "0", content: "机构一", checked: false },
        { value: "1", content: "机构二", checked: false },
        { value: "2", content: "机构三", checked: false }
      ],
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
      statusOption: [
        //人工和机器审读结果
        { label: "全部", value: "" },
        { label: "灰名单", value: "0" },
        { label: "黄名单", value: "1" },
        { label: "白名单", value: "2" },
        { label: "黑一", value: "3" },
        { label: "黑二", value: "4" },
        { label: "黑三", value: "5" }
      ],
      materialStatusOption: [
        //实物审读结果
        { label: "全部", value: "" },
        { label: "白名单", value: "0" },
        { label: "黑一", value: "1" },
        { label: "黑二", value: "2" },
        { label: "黑三", value: "3" }
      ],
      pictureStatusOption: [
        //图片审读结果
        { label: "全部", value: "" },
        { label: "白名单", value: "0" },
        { label: "待定", value: "1" },
        { label: "黑名单", value: "2" }
      ],
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
    this.getSalableData(); //获取列表数据
    // 获取字典
    this.getDictList([
      "manualReviewResult",
      "autoReviewResult",
      "entityReadResult",
      "imageReadResult",
      "manualReviewUser"
    ]);
    //获取中图法等分类树形结构
    this.getClassify([
      "ctClassification",
      "bisacClassification",
      "classification1",
      "classification2"
    ]);
  },
  computed: {
    ...mapGetters([
      "manualReviewResult",
      "autoReviewResult",
      "entityReadResult",
      "imageReadResult",
      "manualReviewUser",
      "ctClassification",
      "bisacClassification",
      "classification1",
      "classification2"
    ]),
    valOption() {
      let arr = [
        // 人工审读结果 0
        this.manualReviewResult,
        // 机器审读结果 1
        this.autoReviewResult,
        // 实物审读结果 2
        this.entityReadResult,
        // 图片审读结果 3
        this.imageReadResult,
        // 文字人工审读人 4
        this.manualReviewUser,
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
    closeExportDialog(){
      this.exportDialog=false
      this.getSalableData(); //获取列表数据
    },
    ...mapActions(["getDictList", "getClassify"]),
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
      var params = [];
      this.params.forEach(function(cur, index) {
        if (cur.value[0] != "") {
          params.push(cur);
        }
      });
      if (params.length == 0) {
        this.getSalableData();
      } else {
        this.currentPage = 1;
        this.getSalableData(undefined, params);
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
    // 打开可售机构
    openSalableOrgan() {
      if (this.multipleSelection.length > 0) {
        this.taskList = [];
        this.multipleSelection.forEach(item => {
          this.taskList.push(item.isbn);
        });
        this.centerDialogVisible = true;
      } else if (this.checkedAll) {
        this.centerDialogVisible = true;
      } else {
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: "请选择图书！",
            type: "warning"
          });
        }
      }
    },
    getValue() {
      this.salableOrganParams = {
        isbns: this.taskList.join(),
        organs: this.checkList.join()
      };
    },
    // 关闭可售机构对话框
    async closeDialog(e) {
      if (e.target.innerText === "取 消") {
        this.checkList = [];
        this.centerDialogVisible = false;
        return;
      }
      if (e.target.innerText === "确 定") {
        this.getValue();
        if (this.salableOrganParams.organs.length == 0) {
          this.$message({
            message: "请选择机构！",
            type: "warning"
          });
          return;
        }
        try {
          var salableOrganParams;
          if (this.multipleSelection.length > 0) {
            // 选择部分
            var salableOrganParams = {
              organs: this.salableOrganParams.organs,
              isbns: this.salableOrganParams.isbns
            };
          } else if (this.checkedAll) {
            // 全选状态
            var params = [];
            this.params.forEach(function(cur, index) {
              if (cur.value[0] != "") {
                params.push(cur);
              }
            });
            var salableOrganParams = {
              parameter: {
                pageNo: this.currentPage,
                pageSize: this.curTotal,
                params: params
              },
              organs: this.salableOrganParams.organs
            };
          }
          this.loading = true;
          await this.$get(
            "/api/salableOrgan/updateSalableOrgan",
            salableOrganParams
          );

          this.centerDialogVisible = false;
          this.checkList = [];
          this.timer = setTimeout(() => {
            this.handleFilter();
            this.$message({
              message: "可售机构选择成功",
              type: "success"
            });
            this.loading = false;
          }, 2000);
        } catch (error) {
          this.$message.error("可售机构选择失败");
        }
      }
    },
    getSalableData(sortArr, params) {
      this.tableData = [];
      const searchParams = {
        pageNo: this.currentPage,
        pageSize: this.curPageSize,
        params
      };
      // 如果排序值不为underfind
      if (sortArr != undefined) {
        searchParams.order = sortArr.prop;
        if (sortArr.order.includes("ascending")) {
          searchParams.sort = sortArr.order.substr(0, 3);
        } else {
          searchParams.sort = sortArr.order.substr(0, 4);
        }
      }
      // this.loading = true;
      this.$post("/api/salableOrgan/list", searchParams)
        .then(res => {
          // this.loading = false;
          if (res.data.totalCount > 10000) {
            this.checkedAllIsAble = true;
          }
          if (res.data.result && res.data.result.length > 0) {
            let data = [];
            res.data.result.forEach(obj => {
              // this.salableOrganType.push(obj.salableOrgan.value);
              for (const k in obj) {
                obj[k] = obj[k].value;
              }
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
    //  选中行高亮
    rowClass({ row, rowIndex }) {
      if (this.selectRow.includes(row.isbn)) {
        return { "background-color": "rgba(185, 221, 249, 0.75)" };
      }
    },
    // 后端排序----
    sortChange(column) {
      // 当排序有查询的时候
      var params = [];
      this.params.forEach(function(cur, index) {
        if (cur.value[0] != "") {
          params.push(cur);
        }
      });
      // 当排序为默认的时候，刷新列表
      if (column.order == null) {
        this.getSalableData(undefined, params);
        this.column.prop = undefined;
      } else {
        this.column = column;
        // 把排序对应的值传参给后台
        this.getSalableData(this.column, params);
      }
    },
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
  background: #fff;
  min-height: 100%;
  border-radius: 5px;
  font-size: 14px;
  .selectItem {
    width: 150px;
    margin-right: 30px;
  }
  .keywords {
    margin-top: 20px;
  }
  .btnCont {
    margin: 20px 0 10px 0;
  }
  .salableOrganBookNumber {
    font-size: 16px;
    color: #a1a1a1;
    margin-bottom: 20px;
  }
}
</style>

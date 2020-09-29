<template>
  <div id="sourceData">
    <div>
      <el-row :gutter="20">
        <el-col :span="4">
          <label>渠道:</label>
          <el-select v-model="source" size="small" class="selectItem" @change="selectSource()">
            <el-option v-for="obj in valOption[2]" :key="obj.value" :label="obj.name" :value="obj.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <label>书号:</label>
          <el-input v-model="params[0].value[0]" size="small" style="width:200px" placeholder="请输入内容" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <label>主书名:</label>
          <el-input v-model="params[1].value[0]" clearable size="small" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          <label>副书名:</label>
          <el-input v-model="params[2].value[0]" clearable size="small" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          <label>丛书名:</label>
          <el-input v-model="params[3].value[0]" clearable size="small" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          <label>出版社:</label>
          <el-input v-model="params[9].value[0]" clearable size="small" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          <label>责任人:</label>
          <el-input v-model="params[6].value[0]" clearable size="small" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          <label>文版:</label>
          <el-select v-model="params[5].value[0]" clearable size="small" style="width:200px">
            <el-option v-for="obj in valOption[1]" :key="obj.value" :label="obj.name" :value="obj.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <label>装帧:</label>
          <!-- 值为枚举单选 -->
          <el-select v-model="params[10].value[0]" clearable size="small" style="width:200px">
            <el-option v-for="obj in valOption[0]" :key="obj.value" :label="obj.name" :value="obj.originalValue"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <label>版次:</label>
          <el-input v-model="params[4].value[0]" clearable size="small" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="5">
          <label>页码:</label>
          <el-select v-model="pageNumber.grammar" size="small" style="width:100px;" @change="selectTrigger()">
            <el-option v-for="item in pageNumberGrammar" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <!-- <input onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"> -->
          <!-- <el-input v-model="params[13].value[0]" size="small" placeholder="请输入内容"></el-input> -->
          <div v-if="pageNumber.grammar=='between'" style="display:inline">
            <el-input onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" onafterpaste="value=value.replace(/^(0+)|[^\d]+/g,'')" v-model="pageNumber.pageNumberValue[0]" size="small" placeholder="始" style="width:70px" clearable></el-input>至
            <el-input onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" onafterpaste="value=value.replace(/^(0+)|[^\d]+/g,'')" v-model="pageNumber.pageNumberValue[1]" size="small" placeholder="末" style="width:70px" clearable></el-input>
          </div>
          <div v-else-if="pageNumber.grammar!='between'" style="display:inline">
            <el-input onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" onafterpaste="value=value.replace(/^(0+)|[^\d]+/g,'')" v-model="pageNumber.pageNumberValue[0]" size="small" placeholder="请输入页码" style="width:110px" clearable></el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <label>出版时间:</label>
          <!-- 值为时间 -->
          <el-select v-model="pubDate.grammar" size="small" style="width:75px;" @change="selectTrigger()">
            <el-option v-for="item in pubDateGrammar" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <el-date-picker v-if="pubDate.grammar=='between'" v-model="pubDate.pubDateValue" size="small" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:220px"></el-date-picker>
          <el-date-picker v-else-if="pubDate.grammar!='between'" v-model="pubDate.pubDateValue" value-format="yyyy-MM-dd" style="width:220px" size="small" type="date" placeholder="选择日期" clearable></el-date-picker>
        </el-col>
        <el-col :span="4">
          <label>责任人简介:</label>
          <el-input v-model="params[8].value[0]" clearable size="small" style="width:170px" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          <label>简介:</label>
          <el-input v-model="params[11].value[0]" clearable size="small" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button size="small" type="primary" @click="handleFilter">查询</el-button>
          <el-button size="small" type="primary" @click="clearFilter">重置</el-button>
          <el-button size="small" type="primary" @click="exportSourceData">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="btnCont">
      <!-- <el-checkbox v-model="checkedAll" :disabled="checkedAllIsAble" style="margin-right:10px;">全部</el-checkbox> -->
    </div>
    <!-- 表格 -->
    <el-table ref="filterTable" :data="tableData" filter-placement="bottom" v-loading="loading" tooltip-effect="dark" border height="100%" style="width:100%;min-height:580px;" :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}" @selection-change="handleSelectionChange" row-key="isbn">
      <el-table-column type="selection" fixed="left" width="45"></el-table-column>
      <!-- <el-table-column type="index" label="序号" width="50">
        <template slot-scope="scope">{{scope.$index+1+(currentPage-1)*curPageSize}}</template>
      </el-table-column>-->
      <el-table-column prop="isbn" label="ISBN"></el-table-column>
      <el-table-column prop="bookName" :show-overflow-tooltip="true" label="主书名"></el-table-column>
      <el-table-column prop="secondName" :show-overflow-tooltip="true" label="副书名"></el-table-column>
      <el-table-column prop="seriesName" :show-overflow-tooltip="true" label="丛书名"></el-table-column>
      <el-table-column prop="publishers" :show-overflow-tooltip="true" label="出版社"></el-table-column>
      <el-table-column prop="personLiable" :show-overflow-tooltip="true" label="责任人"></el-table-column>
      <el-table-column prop="personLiableRole" :show-overflow-tooltip="true" label="责任人角色"></el-table-column>
      <el-table-column prop="edition" :show-overflow-tooltip="true" label="版次"></el-table-column>
      <el-table-column prop="language" :show-overflow-tooltip="true" label="文版"></el-table-column>
      <el-table-column prop="currency" :show-overflow-tooltip="true" label="币制"></el-table-column>
      <el-table-column prop="binding" :show-overflow-tooltip="true" label="装帧"></el-table-column>
      <el-table-column prop="pageNumber" :show-overflow-tooltip="true" label="页码"></el-table-column>
      <el-table-column prop="pubDate" width="160" label="出版时间">
        <template slot-scope="scope">{{proDate(scope.row.pubDate)}}</template>
      </el-table-column>
      <el-table-column prop="introduction" label="简介">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.introduction" placement="bottom-end">
            <span>{{fucIntroduction(scope.row.introduction)}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="personLiableIntroduction" label="责任人简介">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.personLiableIntroduction" placement="bottom-end">
            <span>{{fucIntroduction(scope.row.personLiableIntroduction)}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleOpenDetail(scope.row)" type="text">详细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20,40,60,80,100]" layout="total, prev, pager, next,sizes" style="margin-top:10px;" :total="curTotal" :page-size="curPageSize" :current-page="currentPage"></el-pagination>
  </div>
</template>

<script>
import selectTem from "@/components/export/selectTem";

import { mapActions, mapGetters } from "vuex";

import axios from "axios";
const querystring = require("querystring");
export default {
  components: {
    selectTem
  },
  data() {
    return {
      search: "",
      tableData: [{ isbn: 12131423123123123 }],
      checkedAllIsAble: false,
      selectFiltData: [], //查询的数据
      tableDataEnd: [],
      salableOrgan: {},
      dialogTableVisible: false, //详细信息对话框
      gridData: [], //详细信息
      multipleSelection: [], //对应选中的条数数据
      params: [
        //传递的参数
        {
          field: "isbn", //参数名称 书号0
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "bookName", //参数名称 主书名1
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "secondName", //参数名称 副书名2
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "seriesName", //参数名称 丛书名3
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "edition", //参数名称 版次4
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "language", //参数名称 文版5
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "personLiable", //参数名称 责任人6
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "personLiableRole", //参数名称 责任人角色7
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "personLiableIntroduction", //参数名称 责任人简介8
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "publishers", //参数名称 出版社9
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "binding", //参数名称 装帧10
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "introduction", //简介11
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "pubDate", //出版时间12
          grammar: "between", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "date", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "pageNumber", //页码13
          grammar: "between", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "introduction", //简介14
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "introduction", //简介15
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "introduction", //简介16
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "introduction", //简介17
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "introduction", //简介18
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "introduction", //简介19
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        }
      ],
      pageNumberGrammar: [
        { name: "介于", value: "between" },
        { name: "大于等于", value: "greaterEqual" },
        { name: "小于等于", value: "lessThanEqual" }
      ],
      pubDateGrammar: [
        { name: "介于", value: "between" },
        { name: "之前", value: "beforeTime" },
        { name: "之后", value: "afterTime" }
      ],
      pageNumber: {
        pageNumberValue: ["", ""], //页码
        grammar: "between"
      },
      pubDate: {
        pubDateValue: "", //出版时间
        grammar: "between"
      },
      exportDialog: false, //导出选项
      selectRow: [], //
      multipleSelection: [],
      currentPage: 1, //当前页数
      curPageSize: 20, //每页的条数
      curTotal: 0, //总条数
      searchParams: {}, //查询可售数据所需传参
      source: "2",
      sourceOption: [],
      bindingOption: [
        //装帧
      ],
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
    this.getSalableData(); //获取列表数据
    // 获取字典
    this.getDictList(["binding", "language", "site"]);
  },
  computed: {
    ...mapGetters(["binding", "language", "site"]),
    valOption() {
      let arr = [
        // 装帧 0
        this.binding,
        // 文版 1
        this.language,
        // 信源 2
        this.site
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
    fucIntroduction(data) {
      if (data == undefined) {
        return
      } else {
        data = data.substring(0, 7)
      }
      return data + '...'
    },
    proDate(date) {
      if (date != null) {
        date = date.replace('00:00:00', '')
      }
      return date
    },
    selectSource() {
      this.currentPage = 1;
      // this.curPageSize = 20;
      this.handleCurrentChange(1)
    },
    selectTrigger() {
      this.pubDate.pubDateValue = "";
      this.pageNumber.pageNumberValue = ["", ""];
    },
    closeDialog() {
      this.gridData = [];
      this.dialogTableVisible = false;
    },
    // 重置条件
    clearFilter() {
      this.source = "2";
      var params = [];
      this.pubDate.pubDateValue = "";
      (this.pageNumber.pageNumberValue = ["", ""]),
        this.params.forEach(function (cur, index) {
          cur.value[0] = "";
          params.push(cur);
        });
      this.params = params;
      this.currentPage = 1;
      this.curPageSize = 20;
      this.getSalableData();
    },
    // 查询
    handleFilter() {
      var params = [];
      if (this.pageNumber.pageNumberValue != "") {
        if (this.pageNumber.pageNumberValue[1] == "") {
          this.$delete(this.pageNumber.pageNumberValue, 1);
        }
        this.params[13].value = this.pageNumber.pageNumberValue;
        this.params[13].grammar = this.pageNumber.grammar;
      }
      if (this.pubDate.pubDateValue != "") {
        this.params[12].value = this.pubDate.pubDateValue;
        if (this.params[12].value == null) {
          this.params[12].value = [""];
        }
        if (this.params[12].value instanceof Array) {
        } else {
          this.params[12].value = [this.params[12].value]
        }
        this.params[12].grammar = this.pubDate.grammar;
      }

      this.params.forEach(function (cur, index) {
        if (cur.value[0] != "") {
          params.push(cur);
        }
      });
      if (params.length == 0) {
        this.getSalableData();
      } else {
        this.currentPage = 1;
        this.getSalableData(params);
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
    getValue() {
      this.salableOrganParams = {
        isbns: this.taskList.join(),
        organs: this.checkList.join()
      };
    },
    getSalableData(params) {
      this.tableData = [];
      const searchParams = {
        source: this.source,
        pageNo: this.currentPage,
        pageSize: this.curPageSize,
        params
      };
      this.loading = true;
      this.$post("/api/source/list", searchParams)
        .then(res => {
          this.loading = false;
          if (res.data.result && res.data.result.length > 0) {
            let data = [];
            res.data.result.forEach(obj => {
              if (obj.personLiables) {
                data.push({
                  personLiable: obj.personLiables[0].name,
                  personLiableRole: obj.personLiables[0].role,
                  personLiableIntroduction: obj.personLiables[0].personLiableIntroduction,
                  ...obj
                });
              } else {
                data.push(obj)
              }
            });
            this.tableData = data;
          }

          this.curTotal = res.data.totalCount;
        })
        .catch(err => {
          // this.loading = false;
          // this.$message.error(err);
          this.curTotal = 0;
        });
    },
    exportSourceData() {
      if (this.multipleSelection.length > 0) {
        this.taskList = [];
        this.multipleSelection.forEach(item => {
          this.taskList.push(item.sn);
        });
        var sourceDataParams = {
          source: this.source,
          sns: this.taskList.join()
        };
      } else {
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: "请选择数据！",
            type: "warning"
          });
          return;
        }
      }
      // post/api/source/exportBySns
      axios
        .post(
          "/br/api/source/exportBySns",
          querystring.stringify(sourceDataParams),
          { responseType: "blob" }
        )
        .then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            "图书源数据" + new Date().getTime() + ".csv"
          );
          document.body.appendChild(link);
          link.click();
        });
      this.getSalableData(); //获取列表数据
    },
    // 查看详细
    handleOpenDetail(data) {
      var ids = [];
      this.tableData.forEach(item => {
        ids.push(item.sn);
      });
      // localStorage.setItem('bookCheckList',JSON.stringify(ids));
      let router = this.$router.resolve({
        path: "/sourceDetail",
        query: { sn: data.sn, source: this.source }
      });
      window.open(router.href, "_blank");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 联动查询
    linkageQuery() { },
    // 分页每页多少条
    handleSizeChange(val) {
      var params = [];
      this.params.forEach(function (cur, index) {
        if (cur.value[0] != "") {
          params.push(cur);
        }
      });
      if (params.length != 0) {
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
      this.params.forEach(function (cur, index) {
        if (cur.value[0] != "") {
          params.push(cur);
        }
      });
      if (params.length != 0) {
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
#sourceData {
  padding: 15px;
  background: #fff;
  // min-height: 100%;
  border-radius: 5px;
  font-size: 14px;
  .el-col-4 {
    width: 16.66667%;
    margin: 8px;
  }
  .el-col-6 {
    margin: 8px;
  }
  .el-col-5 {
    margin: 8px;
  }
  .el-button + .el-button {
    margin-left: 4px;
  }
  // .el-col-3 {
  //   margin: 8px;
  // }
  .el-input--small {
    font-size: 13px;
    width: 200px;
  }
  .selectItem {
    width: 150px;
    margin-right: 30px;
  }
  .el-button--small {
    margin-top: 8px;
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

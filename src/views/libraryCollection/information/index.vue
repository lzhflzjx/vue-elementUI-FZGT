<template>
  <div id="collectionInformation">
    <div id="search">
      <el-row>
        <el-col :span="4">
          <label>图书馆:</label>
          <el-input
            v-model="params[0].value[0]"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="5">
          <label>等级:</label>
          <el-select v-model="params[1].value[0]" clearable size="small" class="selectItem">
            <el-option
              v-for="obj in valOption[0]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <label>类型:</label>
          <el-select v-model="params[2].value[0]" clearable size="small" class="selectItem">
            <el-option
              v-for="obj in valOption[1]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <label>国家/地区:</label>
          <el-select v-model="params[3].value[0]" clearable size="small" class="selectItem">
            <el-option v-for="obj in countrys" :key="obj.id" :label="obj.name" :value="obj.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <label>所在地:</label>
          <el-input
            v-model="params[4].value[0]"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <label>所属大学:</label>
          <el-input
            v-model="params[5].value[0]"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <div>
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="双一流"></el-checkbox>
              <el-checkbox label="985"></el-checkbox>
              <el-checkbox label="211"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="6">
          <label>录入时间:</label>
          <!-- 值为时间 -->
          <el-date-picker
            v-model="entryTime"
            size="small"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:220px"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button size="small" type="primary" @click="handleFilter">查询</el-button>
          <!-- <el-button size="small" type="primary" @click="clearFilter">重置条件</el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="btnCont">
      <el-button @click="handleOpenDetail()" type="primary" size="small" style="margin-left:10px">新增</el-button>
      <el-button size="small" type="primary" @click="openTask('馆藏图书')">馆藏图书</el-button>
      <el-button size="small" type="primary" @click="openTask('馆藏数据库')">馆藏数据库</el-button>
      <el-button size="small" type="primary" @click="openTask('馆藏报刊')">馆藏报刊</el-button>
      <el-button size="small" type="primary" @click="exportInformation">导出</el-button>
      <el-button size="small" type="primary" @click="deleteData">删除</el-button>
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
      @row-dblclick="handleOpenDetail"
      @row-click="handleclick"
      row-key="isbn"
    >
      <el-table-column type="selection" fixed="left" width="45"></el-table-column>
      <el-table-column prop="library" width="70" label="图书馆"></el-table-column>
      <el-table-column prop="gclevel" width="70" label="等级">
        <template slot-scope="scope">
          <div>{{changeWord(valOption[0],scope.row.gclevel)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="gctype" width="70" label="类型">
        <template slot-scope="scope">
          <div>{{changeWord(valOption[1],scope.row.gctype)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="country" width="90" label="国家/地区">
        <template slot-scope="scope">
          <div>{{changeCountry(countrys,scope.row.country)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="location" width="70" label="所在地"></el-table-column>
      <el-table-column prop="college" :show-overflow-tooltip="true" width="80" label="所属大学"></el-table-column>
      <el-table-column prop="issyl" :show-overflow-tooltip="true" width="110" label="是否双一流">
        <template slot-scope="scope">{{issylType[scope.row.issyl]}}</template>
      </el-table-column>
      <el-table-column prop="isnef" :show-overflow-tooltip="true" label="是否985">
        <template slot-scope="scope">{{isnefType[scope.row.isnef]}}</template>
      </el-table-column>
      <el-table-column prop="istoo" :show-overflow-tooltip="true" label="是否211">
        <template slot-scope="scope">{{istooType[scope.row.istoo]}}</template>
      </el-table-column>
      <el-table-column prop="doctor" label="博士点"></el-table-column>
      <el-table-column prop="master" label="硕士点"></el-table-column>
      <el-table-column prop="department" label="重点研究室"></el-table-column>
      <el-table-column prop="ranking" label="Ranking"></el-table-column>
      <el-table-column prop="creater" width="70" label="录入人"></el-table-column>
      <el-table-column prop="create_date" width="80" label="录入时间"></el-table-column>
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
import Cookies from "js-cookie";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      search: "",
      tableData: [],
      selectFiltData: [], //查询的数据
      tableDataEnd: [],
      salableOrgan: {},
      pubDate: [],
      checkList: [],
      countrys: [], //国家列表
      entryTime: "", //录入时间
      issylType: ["否", "是"],
      isnefType: ["否", "是"],
      istooType: ["否", "是"],
      params: [
        //传递的参数
        {
          field: "library", //参数名称 图书馆0
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "gclevel", //参数名称 等级	1
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "gctype", //参数名称 类型2
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "country", //参数名称 国家/地区3
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "location", //参数名称 所在地4
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "college", //	所属大学5
          grammar: "contain", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "String", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "issyl", //	是否双一流6
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "isnef", //	是否985	7
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "istoo", //	是否211 8
          grammar: "equal", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "digital", //参数类型
          value: [
            "" //参数值
          ]
        },
        {
          field: "create_date", // 录入时间 9
          grammar: "between", //查询语法
          logic: "and", //参数逻辑关系，这块目前逻辑关系都为and
          type: "date", //参数类型
          value: [""] //参数值
        }
      ],
      selectRow: [], //选择行
      multipleSelection: [],
      currentPage: 1, //当前页数
      curPageSize: 20, //每页的条数
      curTotal: 0, //总条数
      searchParams: {}, //查询可售数据所需传参
      pressVal: 0,
      taskList: [],
      salableOrganParams: {}, //可售机构传参
      filterTableDataEnd: [],
      flag: false,
      Newitems: [],
      column: [], //后端排序
      checkedAll: false,
      loading: false
    };
  },
  created() {
    this.getInformationData(); //获取列表数据
    // this.getCountryData(); //获取列表数据
    this.getAddressList({ level: 1, parentId: "" }); //获取国家列表
    // 获取字典
    this.getDictList(["gcLevel", "gcType"]);
  },
  computed: {
    ...mapGetters(["gcLevel", "gcType"]),
    valOption() {
      let arr = [
        // 馆藏信息等级 0
        this.gcLevel,
        // 馆藏信息类型 1
        this.gcType
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
  mounted() {
    this.timer = setInterval(this.Judge, 3000);
  },
  beforeDestroy() {
    Cookies.remove(this.timer);
  },
  methods: {
    Judge() {
      var flag = Cookies.get("need_refresh"); //getCookie跟setCookie一样，都百度一下。
      if (flag === "yes") {
        //检查到yes说明b.html页面让我刷新了。
        this.handleFilter(); //执行你刷新的方法。
        Cookies.remove("need_refresh"); //删除cookie避免重复执行。
      }
    },
    ...mapActions(["getDictList"]),
    // 国家地区
    getCountryData() {
      this.$get("/api/region/findRegions")
        .then(res => {})
        .catch(res => {});
    },
    // 转换国家
    changeCountry(data, type) {
      if (type == null) {
      } else {
        data.forEach(item => {
          if (type == item.id) {
            type = item.name;
          }
        });
        return type;
      }
    },
    // 转换等级 类型
    changeWord(data, type) {
      if (type == null) {
      } else {
        data.forEach(item => {
          if (type == item.value) {
            type = item.name;
          }
        });
        return type;
      }
    },
    // 获取国家列表
    // data  {level:1,parentId:""}
    getAddressList(data) {
      this.$get("/api/region/findRegions", data).then(res => {
        if (data.level == 1) {
          this.countrys = res.data;
          this.provinces = [];
          this.citys = [];
          if (res.data.length > 0) {
            this.getAddressList({ level: 2, parentId: res.data[0].id });
          }
        } else if (data.level == 2) {
          this.provinces = res.data;
          this.citys = [];
          if (res.data.length > 0) {
            this.getAddressList({ level: 3, parentId: res.data[0].id });
          }
        } else if (data.level == 3) {
          this.citys = res.data;
        }
      });
    },
    // 查看详细
    handleOpenDetail(data) {
      if (data == undefined) {
        let router = this.$router.resolve({
          path: "/detail"
        });
        window.open(router.href, "_blank");
      } else {
        var id = [];
        var library = [];
        this.tableData.forEach(item => {
          id.push(item.id);
          library.push(item.library);
        });
        // localStorage.setItem('bookCheckList',JSON.stringify(ids));
        localStorage.setItem(data.id, JSON.stringify(data));
        let router = this.$router.resolve({
          path: "/detail",
          query: { id: data.id, library: data.library }
        });
        window.open(router.href, "_blank");
      }
    },
    // 删除数据
    deleteData() {
      if (this.multipleSelection.length > 0) {
        this.taskList = [];
        this.multipleSelection.forEach(item => {
          this.taskList.push(item.id);
        });
        this.$confirm("删除后数据不可恢复，确认删除选中信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var ss = [];
            for (var i = 0; i < this.taskList.length; i++) {
              ss.push({ id: this.taskList[i] });
            }
            let params = {
              ids: JSON.stringify(ss)
            };
            // GET /api/library/delLibrarys
            this.$get("/api/library/delLibrarys", params)
              .then(res => {
                this.$message.success("删除成功");
                this.getInformationData();
              })
              .catch(res => {});
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      } else {
        this.$message({
          message: "请选择要删除的项！",
          type: "warning"
        });
      }
    },
    // 重置条件
    clearFilter() {
      var params = [];
      this.params.forEach(function(cur, index) {
        cur.value[0] = "";
        params.push(cur);
      });
      this.params = params;
      this.getInformationData();
    },
    // 查询
    handleFilter() {
      if (this.checkList.includes("双一流")) {
        this.params[6].value[0] = "1";
      } else {
        this.params[6].value[0] = "";
      }
      if (this.checkList.includes("985")) {
        this.params[7].value[0] = "1";
      } else {
        this.params[7].value[0] = "";
      }
      if (this.checkList.includes("211")) {
        this.params[8].value[0] = "1";
      } else {
        this.params[8].value[0] = "";
      }
      if (this.entryTime != "") {
        this.params[9].value = this.entryTime;
      }
      var params = [];
      this.params.forEach(function(cur, index) {
        if (cur.value[0] != "") {
          params.push(cur);
        }
      });
      if (params.length == 0) {
        this.getInformationData();
      } else {
        this.currentPage = 1;
        this.getInformationData(undefined, params);
      }
    },
    // 获取列表数据
    getInformationData(sortArr, params) {
      this.loading = true;
      this.tableData = [];
      const searchParams = {
        pageNo: this.currentPage,
        pageSize: this.curPageSize,
        params
      };
      this.$post("/api/library/list", searchParams)
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
      if (this.multipleSelection.length == 1) {
        let siteid = "";
        this.multipleSelection.forEach(item => {
          siteid = item.siteid;
        });
        let url = "";
        if (type == "馆藏图书") {
          url = "library";
        }
        if (type == "馆藏数据库") {
          url = "collectDataBase";
        }
        if (type == "馆藏报刊") {
          url = "press";
        }
        let router = this.$router.resolve({
          path: url,
          query: { siteid: siteid }
        });
        window.open(router.href, "_blank");
      } else {
        this.$message("您需要选择且只能选择一条数据");
      }
    },
    // 导出馆藏信息
    exportInformation() {
      if (this.multipleSelection.length > 0) {
        this.taskList = [];
        this.multipleSelection.forEach(item => {
          this.taskList.push(item.id);
        });
        var sourceDataParams = this.taskList;
        axios
          .post("br/api/library/export", sourceDataParams, {
            responseType: "blob"
          })
          .then(res => {
            let url = window.URL.createObjectURL(new Blob([res.data]));
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute(
              "download",
              "馆藏信息" + new Date().getTime() + ".xls"
            );
            document.body.appendChild(link);
            link.click();
          });
      } else {
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: "请选择数据！",
            type: "warning"
          });
          return;
        }
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
      this.curPageSize = val;
      this.getInformationData();
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getInformationData();
    }
  }
};
</script>
<style lang='scss' scoped>
#collectionInformation {
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

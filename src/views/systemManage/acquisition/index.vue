<template>
  <div id="vendibilityManage">
    <div>
      <el-row style="margin: 10px">
        <el-col :span="4">
          <label>来源:</label>
          <el-select v-model="source" size="mini" style="width:100px" class="selectItem">
            <el-option
              v-for="obj in valOption[0]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <label>任务发布时间:</label>
          <el-date-picker
            v-model="pubDateValue"
            size="mini"
            style="width:300px"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button size="small" type="primary" style="width:100px" @click="handleFilter">查询</el-button>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </div>
    <div class="formItem">
      <label class="label">上传书单文件：</label>
      <div class="cont">
        <!-- <span><i>*</i> 上传附件：</span> -->
        <el-input
          v-model="uploadfile"
          disabled
          placeholder="请选择上传文件"
          size="mini"
          style="width:200px;"
        ></el-input>
        <input style="display:none" id="bookUploadBtn" type="file" @change="importf($event)" />
        <el-button type="primary" size="mini" @click="selectFile">上传</el-button>
        <a  href="./static/ISBNTemplate.xlsx" style="font-size:12px;margin-left: 10px;">采集管理模板</a>
      </div>
    </div>
    <el-table
      ref="filterTable"
      :data="tableData"
      tooltip-effect="dark"
      v-loading="loading"
      border
      height="100%"
      style="width:100%;min-height:670px;"
      :header-cell-style="{background: '#cccccc',color:'#727878', fontSize:'14px'}"
    >
      <el-table-column prop="sn" label="ISBN"></el-table-column>
      <el-table-column prop="create_type" label="来源">
        <template slot-scope="scope">
          <div>{{createType(valOption[0],scope.row.create_type)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="任务发布时间"></el-table-column>
      <el-table-column prop="finish_time" label="完成时间"></el-table-column>
      <el-table-column prop="finish" label="状态">
        <template slot-scope="scope">
          <div>{{finishType(valOption[1],scope.row.finish)}}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="searchParams.curPageSize"
      :current-page="searchParams.currentPage"
      :page-sizes="[20, 40, 60, 80, 100]"
      layout="total, prev, pager, next, sizes"
      :total="curTotal"
    ></el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      source: "1",
      loading:false,
      sourceOption: [
        {
          value: "1",
          label: "ERP订单"
        },
        {
          value: "2",
          label: "导入书单"
        },
        {
          value: "3",
          label: "系统任务"
        }
      ],
      pubDateValue: null,
      tableData: [],
      ruleForm: {
        file: ""
      },
      uploadfile: "",
      currentPage: 1, //当前页数
      curPageSize: 20, //每页的条数
      curTotal: 0, //总条数
      searchParams: {} //查询可售数据所需传参
    };
  },
  created() {
    this.getSelectData(this.searchParams);
    // 获取字典
    this.getDictList(["missionSource","finish"]);
  },
  computed: {
    ...mapGetters(["missionSource","finish"]),
    valOption() {
      let arr = [
        // 装帧 0
        this.missionSource,
        // 采集完成状态
        this.finish
      ];
      return arr;
    }
  },
  methods: {
    ...mapActions(["getDictList"]),
     //来源数据转换
    createType(data, type) {
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
     //来源数据转换
    finishType(data, type) {
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
    // 查询
    handleFilter() {
      if (this.pubDateValue == null) {
        // this.getSelectData();
      } else {
        var Params = {
          createTime1: this.pubDateValue[0], //任务发布时间起始时间
          createTime2: this.pubDateValue[1] //任务发布时间终止时间
        };
      }
      this.getSelectData(Params);
    },
    selectFile() {
      document.getElementById("bookUploadBtn").value = "";
      document.getElementById("bookUploadBtn").click();
    },
    importf(obj) {
      // if (!obj.target.files) {
      //   return;
      // }
      var _this = this;
      var f = obj.target.files[0];
      var fileName = f.name;
      var fileext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
      if (fileext != ".xls" && fileext != ".xlsx") {
        this.$message.error("只能上传excel文件");
        return;
      }
      this.uploadfile = fileName;
      let formData = new FormData();
      formData.append("file", f);
      var url = "";
      url = "/api/cj/importFile";
      this.$bqcmPost(url, formData)
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.timer = setTimeout(() => {
                this.handleFilter();
                if (res.data.result[0].isbnList.length != 0) {
                  let num = res.data.result[0].isbnList.length
                  this.$message.success(`${num}个文件上传成功`);
                }else {
                  let num = res.data.result[0].exitIsbnList.length
                  this.$message(`${num}个文件列表已存在`);
                }
              }, 1500);
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });

    },
    getSelectData(Params) {
      if (Params == null || Params == undefined) {
        var searchParams = {
          pageNo: this.currentPage, //当前页数
          pageSize: this.curPageSize, //每页条数
          source: this.source //来源
        };
      } else {
        var searchParams = {
          pageNo: this.currentPage, //当前页数
          pageSize: this.curPageSize, //每页条数
          source: this.source, //来源
          createTime1: Params.createTime1,
          createTime2: Params.createTime2
        };
      }

      this.tableData = [];
      this.loading = true
      this.$bqcmPost("/api/cj/select", searchParams)
        .then(res => {
          if (res.data.result && res.data.result.length > 0) {
            let data = [];
            res.data.result.forEach(obj => {
              data.push(obj);
            });
            this.tableData = data;
          }

          this.curTotal = res.data.totalCount;
          this.loading = false
        })
        .catch(err => {
          this.loading = false;
          // this.$message.error(err);
        });
    },
    // 分页每页多少条
    handleSizeChange(val) {
      this.curPageSize = val;
      this.getSelectData(null);
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSelectData(null);
    }
  }
};
</script>

<style lang="scss" scoped>
#vendibilityManage {
  padding: 15px;
  background: #fff;
  // min-height: 100%;
  border-radius: 5px;
  font-size: 14px;
  .formItem {
    margin: 10px;
  }
}
</style>

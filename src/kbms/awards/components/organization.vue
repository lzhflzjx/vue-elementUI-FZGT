<template>
  <div>
    <div class="tag-box">
      <div class="search-box font-14">
        <el-row class="screen-box">
          <el-col class="screen" :span="4">书号：
            <el-input disabled v-model="form.isbn" style="width:180px" clearable placeholder="请输入内容"></el-input>
          </el-col>
          <el-col class="screen" :span="4">出版社：
            <el-input v-model="form.author" style="width:180px" clearable placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="6">奖项名称：
            <el-input v-model="form.name" style="width:240px" clearable placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="2">
            <div style="line-height:34px">奖项时间：</div>
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="awardTime" value-format="yyyy-MM-dd HH:mm:ss" clearable type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col :push="1" :span="1">
            <el-button @click="search" type="primary" size="medium">查询</el-button>
          </el-col>
        </el-row>

      </div>
      <!-- 表格 -->
      <div class="tag-con">
        <el-row class="row">
          <el-col :span="21">
            <el-row>
              <el-col :span="20">
                <el-button size="medium" type="primary" @click="$router.push({ path: '/awards/add' })">新增</el-button>
                <!-- <el-upload style="display: inline-block;margin-left: 10px;margin-right: 10px" action="http://59.108.111.18:8080/br/api/awardsManage/importFile?flag=2" :headers="{'x-access-token':xAccessToken}" :on-success="onUploadSuccess" :on-error="onUploadError" size="medium">
                  <el-button size="medium" type="primary">导入</el-button>
                </el-upload> -->
                <input style="display:none" id="bookUploadBtn" type="file" @change="importf($event)">
                <el-button type="primary" size="medium" v-loading='loading' @click="selectFile">导入</el-button>
                <el-button size="medium" type="primary" @click="exportFunc">导出</el-button>
                <el-button size="medium" type="primary" @click.native="remove">删除</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-button size="medium" @click="downloadTemplate">导入模板下载</el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data="awardList" stripe height="520" tooltip-effect="dark" border highlight-current-row style="width: 100%" header-row-class-name="table-head" @row-dblclick="awardsChange" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="奖项名称" width="120">
          </el-table-column>
          <el-table-column prop="level" label="奖项等级" width="120">
            <template slot-scope="scope">{{awardLevel(valOption[0],scope.row.level)}}</template>
          </el-table-column>
          <el-table-column prop="type" label="奖项类型" show-overflow-tooltip>
            <template slot-scope="scope">{{awardType(valOption[1],scope.row.type)}}</template>
          </el-table-column>
          <el-table-column prop="objectType" label="获奖对象类型" show-overflow-tooltip>
            <template slot-scope="scope">{{objType(valOption[2],scope.row.objectType)}}</template>
          </el-table-column>
          <el-table-column prop="time" label="获奖时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="author" label="获奖人/组织" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="refOpus" label="关联作品" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="关联产品" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top:30px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20,40,60,80,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import { getDownloadFunc } from '@/views/kbms/func';
import { mapActions, mapGetters } from "vuex";
export default {
  name: 'tag',
  data() {
    return {
      // xAccessToken: localStorage.getItem('token'),
      loading: false,
      input3: '',
      select: '',
      input: '',
      value: '',
      awardTime: '',
      dialogFormVisible: false,
      form: {
        name: '',
        level: '',
        author: '',
        isbn: '',
        type: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible1: false,
      awardList: [],
      // 分页
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
      ids: [],
      selectRow: [],//选中的数据
      multipleSelection: [],//选中的数据
    };
  },
  created() {
    this.getAwardList();
    // 获取字典
    this.getDictList(["awardsLevel", "awardsType", "awardsObjectType"]);
  },
  watch: {
    multipleSelection(data) {
      //存储选中的row
      this.selectRow = [];
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(item.id);
        });
      }
    }
  },
  computed: {
    ...mapGetters(["awardsLevel", "awardsType", "awardsObjectType"]),
    valOption() {
      let arr = [
        // 奖项等级 0
        this.awardsLevel,
        // 奖项类型 1
        this.awardsType,
        // 获奖对象类型 2
        this.awardsObjectType
      ];
      return arr;
    }
  },
  methods: {
    ...mapActions(["getDictList"]),
    selectFile() {
      document.getElementById('bookUploadBtn').value = '';
      document.getElementById('bookUploadBtn').click();
    },
    importf(obj) {
      if (!obj.target.files) {
        return;
      }
      var _this = this;
      var f = obj.target.files[0];
      var fileName = f.name;
      var fileext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
      if (fileext != '.xls') {
        this.$message.error('只能上传xls文件');
        return;
      }
      let formData = new FormData();
      formData.append('file', f)
      this.loading = true;
      this.$post('/api/awardsManage/importFile?flag=2', formData).then(res => {
        this.$message.info(res.message)
        this.getAwardList()
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    },
    // 转换获奖对象类型
    objType(arr, type) {
      let obj;
      arr.forEach(element => {
        if (element.value == type) {
          obj = element.name
        }
      });
      return obj
    },
    // 转换奖项类型
    awardType(arr, type) {
      let obj;
      arr.forEach(element => {
        if (element.value == type) {
          obj = element.name
        }
      });
      return obj
    },
    // 转换奖项等级
    awardLevel(arr, type) {
      let obj;
      arr.forEach(element => {
        if (element.value == type) {
          obj = element.name
        }
      });
      return obj
    },
    awardsChange(rows) {
      this.$router.push({ path: '/awards/add', query: { awardsObj: JSON.stringify(rows) } });
    },
    // 查看
    handleClick(row) {
      this.$router.push({ path: '/awards/product', query: { awards: JSON.stringify(row) } });
    },
    //   表格
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //   for (let i in val) {
      //     this.ids.push(val[i].id)
      //   }
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAwardList({ pageSize: val });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAwardList({ pageNo: val });
    },
    // 查询
    search() {
      let data = {};
      if (this.form.name) {
        data.name = this.form.name;
      }
      if (this.form.type) {
        data.type = this.form.type;
      }
      if (this.form.level) {
        data.level = this.form.level;
      }
      if (this.form.isbn) {
        data.isbn = this.form.isbn;
      }
      if (this.form.author) {
        data.author = this.form.author;
      }
      data.pageNo = 1;
      this.getAwardList(data);
    },
    exportFunc() {
      if (this.selectRow.length < 1) {
        return this.$message.error("至少选择一个奖项");
      }
      let fileName = "奖项库导出" + (new Date()).valueOf();
      let data = this.selectRow.join(',');
      this.$message.success("正在下载...请稍后");
      // GET /api/awardsManage/exportFileJXRZ
      getDownloadFunc('br/api/awardsManage/exportFileJXRZ?fileName=' + fileName + '&ids=' + data, fileName);
    },
    downloadTemplate() {
      let fileName = "奖项库导出模板" + (new Date()).valueOf();
      this.$message.success("正在下载...请稍后");
      // GET /api/awardsManage/importTemplate
      getDownloadFunc('br/api/awardsManage/importTemplate?flag=2', fileName);
    },
    // 删除
    remove() {
      if (this.selectRow.length < 1) {
        return this.$message.error("至少选择一个")
      }
      this.$confirm('确定修改该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let that = this;
        this.$post('/api/awardsManage/deleteAwards?ids=' + this.selectRow.join(','))
          .then(res => {
            if (res.success && res.status === 0) {
              that.getAwardList();
              this.$message.success("删除成功")
              return 
            }
          }).catch(function (error) {
            that.$message.error("删除出错");
          })
      }).catch(() => {
        // this.$message.info('已取消删除');
      });

    },
    // 获取奖项库列表
    getAwardList(data = {}) {
      data.pageNo = data.pageNo ? data.pageNo : this.currentPage;
      data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
      data.flag = data.flag ? data.flag : 2;
      if (this.form.name !== '') {
        data.name = this.form.name;
      }
      if (this.awardTime !== '') {
        data.beginTime = this.awardTime[0];
        data.endTime = this.awardTime[1];
      }
      // POST /api/awardsManage/findAwards
      this.$post('/api/awardsManage/findAwards', data)
        .then(res => {
          if (res.data.result != null) {
            res.data.result.forEach(item => {
              // item.isAwards=item.isAwards==1?'有':'无'
              // item.isSensitive=item.isSensitive==1?'是':'否'
            });
            this.awardList = res.data.result;
            this.totalCount = res.data.totalCount;
          } else {
            this.awardList = [];
            this.totalCount = 0;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.font-14 {
  font-size: 14px;
}
.tag-box {
  background: #f1f4f5;
  // padding: 30px;
  .search-box {
    padding: 30px;
    background: #fff;

    span {
      margin-right: 10px;
    }

    .option-box {
      width: 700px;
      margin-top: 20px;
    }

    .screen-box {
      padding-bottom: 20px;
    }

    .screen {
      display: flex;
      align-items: center;

      .screen-item {
        flex: 1;
      }
    }
  }

  .tag-con {
    margin-top: 30px;
    background: #fff;
    padding: 30px;

    .row {
      padding-bottom: 30px;
    }

    /deep/ .table-head th {
      background: #e5f0f6 !important;
    }
  }

  /deep/ .el-select .el-input {
    width: 130px;
  }

  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}

.pop-foot {
  display: flex;
  justify-content: space-around;
}
</style>

<template>
  <div>
    <div class="tag-box">
      <!-- 筛选条件 -->
      <div class="search-box font-14">
        <el-row class="screen-type">
          <el-col :span="4">榜单名称：{{this.$route.query.rankingListName}}</el-col>
          <el-col :span="4">榜单信源：{{this.$route.query.site}}</el-col>
          <el-col :span="4">榜单类型：{{rankingList(valOption[0],this.$route.query.rankingListCollectionType)}}</el-col>
          <el-col :span="4">采集时间：{{this.$route.query.collectionTime.substring(0, 10)}}</el-col>
        </el-row>
        <el-row class="screen-box">
          <el-col class="screen" :span="4">
            书号：
            <el-input class="screen-item" clearable v-model="searchParams.isbn" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col class="screen" :push="1" :span="4">
            书名：
            <el-input class="screen-item" clearable v-model="searchParams.title" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :push="2" :span="1">
            <el-button type="primary" size="medium" @click="handleFilter()">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 -->
      <div class="tag-con">
        <el-row class="row">
          <el-col :span="21">
            <el-button @click="dialogFormVisible=true" size="medium" type="primary">新增</el-button>
            <input style="display:none" id="bookUploadBtn" type="file" @change="importf($event)">
            <el-button type="primary" size="medium" v-loading='loading' @click="selectFile">导入</el-button>
            <el-button size="medium" type="primary" @click="monthlyDelete">删除</el-button>
          </el-col>
          <el-col :span="3">
            <el-button size="medium" @click="downloadTemplate">导入模板下载</el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data="tableData" stripe height="480" tooltip-effect="dark" border highlight-current-row style="width: 100%" header-row-class-name="table-head" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="title" label="书名" width="120"></el-table-column>
          <el-table-column prop="isbn" label="ISBN" width="120"></el-table-column>
          <el-table-column prop="zhuangzhen" label="版本" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ranks" label="排名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pub" label="出版社" show-overflow-tooltip></el-table-column>
          <el-table-column prop="zerenren" label="责任人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pubDate" label="出版时间" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20,40,60,80,100]" layout="total, prev, pager, next,sizes" style="margin-top:10px;" :total="curTotal" :page-size="curPageSize" :current-page="currentPage"></el-pagination>
      </div>
    </div>

    <!-- 弹框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="书名：" prop="title">
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="排名：" prop="ranks">
              <el-input v-model="ruleForm.ranks"></el-input>
            </el-form-item>
            <el-form-item label="出版社：" prop="pub">
              <el-input v-model="ruleForm.pub"></el-input>
            </el-form-item>
            <el-form-item label="出版日期：" prop="pubDate">
              <el-date-picker v-model="ruleForm.pubDate" type="date" placeholder="选择日期时间" value-format='yyyy-MM-dd'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :push="2" :span="10">
            <el-form-item label="ISBN：" prop="isbn">
              <el-input v-model="ruleForm.isbn"></el-input>
            </el-form-item>
            <el-form-item label="版本：" prop="zhuangzhen">
              <el-input v-model="ruleForm.zhuangzhen"></el-input>
            </el-form-item>
            <el-form-item label="责任人：" prop="zerenren">
              <el-input v-model="ruleForm.zerenren"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer pop-foot">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="exampleAdd('ruleForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDownloadFunc } from '@/views/kbms/func';
import { mapActions, mapGetters } from "vuex";
export default {
  name: "tag",
  data() {
    return {
      xAccessToken: localStorage.getItem('token'),
      searchParams: {
        // ids: ["string"],
        isbn: "",//书号
        pageNo: 1,
        pageSize: 20,
        // siteName: "委屈翁",
        // startRow: 0,
        title: "",//书名
        // totalPageNo: 0,
        // totalPageNum: 0,
        // version: "2020-03-10"
      },//查询条件
      input3: "",
      select: "",
      input: "",
      value: "",
      value1: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      loading: false,
      tableData: [
        {
          tag: "aaaa",
          date: "2016-05-03",
          name: "王小虎",
          checked: "是"
        },
        {
          tag: "aaaa",
          date: "2016-05-03",
          name: "王小虎",
          checked: "是"
        }
      ],
      curTotal: 0,
      currentPage: 1, //当前页数
      curPageSize: 20, //每页的条数
      dialogFormVisible: false,
      form: {
        name: ""
      },
      formLabelWidth: "120px",
      ruleForm: {
        title: "",//书名
        ranks: "",//排名
        pub: "",//出版社
        isbn: "",//书号
        zerenren: "",//责任人
        zhuangzhen: "",//版本
        pubDate: "",//出版日期
        // siteId: "8",//榜单id
        // siteName: "委屈翁",//榜单名称
        // version: "2020-03-10",//采集时间
      },
      rules: {
        title: [
          { required: true, message: "请输入书名", trigger: "blur" },
        ],
        ranks: [
          { required: true, message: "请输入排名", trigger: "blur" },
        ],
        pub: [
          { required: true, message: "请输入出版社", trigger: "blur" },
        ],
        zerenren: [
          { required: true, message: "请输入责任人", trigger: "blur" },
        ],
        zhuangzhen: [
          { required: true, message: "请输入版本", trigger: "blur" },
        ],
        pubDate: [
          { required: true, message: "请输入出版日期", trigger: "blur" },
        ],
        isbn: [
          { required: true, message: "请输入书号", trigger: "blur" },
        ],
      }
    };
  },
  created() {
    this.getListWorks()//获取列表
    // 获取字典
    this.getDictList(["rankingListCollectionType"]);
  },
  computed: {
    ...mapGetters(["rankingListCollectionType"]),
    valOption() {
      let arr = [
        // 馆藏数据库类型0
        this.rankingListCollectionType
      ];
      return arr;
    }
  },
  methods: {
    ...mapActions(["getDictList"]),
    rankingList(data, type) {
      data.forEach(element => {
        if (element.value == type) {
          type = element.name;
        }
      });
      return type;
    },
    handleFilter() {
      this.currentPage = 1
      this.getListWorks()
    },
    // 上榜作品删除
    monthlyDelete() {
      if (
        this.multipleSelection != undefined &&
        this.multipleSelection.length > 0
      ) {
        this.$confirm("删除后该上榜图书信息不可恢复！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let taskList = [];
            this.multipleSelection.forEach(item => {
              taskList.push(item._id);
            });
            let data = {
              ids: taskList
            }
            // POST /api/rankingListBook/deleteRankingListBook
            this.$post(
              "/api/rankingListBook/deleteRankingListBook", data
            )
              .then(res => {
                this.$message(res.message);
                this.handleFilter();
              })
              .catch(res => { });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.warning("请选择删除项");
      }
    },
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
      this.$post('/api/rankingListBook/importRankingListBook?榜单id=' + this.$route.query.id + '', formData).then(res => {
        this.$message.info(res.message)
        this.getListWorks()
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    },
    //   导出模板下载
    downloadTemplate() {
      let fileName = "上榜作品导出模板" + (new Date()).valueOf();
      this.$message.success("正在下载...请稍后");
      // GET /api/rankingListBook/exportRankingListBookTemplet
      getDownloadFunc('br/api/rankingListBook/exportRankingListBookTemplet', fileName);
    },
    //确定   
    exampleAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ...this.ruleForm
          };
          data.siteId = this.$route.query.id
          data.siteName = this.$route.query.rankingListName
          data.version = this.$route.query.collectionTime.substring(0, 10)
          //   POST /api/rankingListBook/insertRankingListBook
          this.$post('/api/rankingListBook/insertRankingListBook', data)
            .then(res => {
              this.$message(res.message);
              this.getListWorks()
              this.dialogFormVisible = false
              this.ruleForm = {
                title: "",//书名
                ranks: "",//排名
                pub: "",//出版社
                isbn: "",//书号
                zerenren: "",//责任人
                zhuangzhen: "",//版本
                pubDate: "",//出版日期
                // siteId: "8",//榜单id
                // siteName: "委屈翁",//榜单名称
                // version: "2020-03-10",//采集时间
              }
            });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.dialogFormVisible = false
      this.ruleForm = {
        title: "",//书名
        ranks: "",//排名
        pub: "",//出版社
        isbn: "",//书号
        zerenren: "",//责任人
        zhuangzhen: "",//版本
        pubDate: "",//出版日期
        // siteId: "8",//榜单id
        // siteName: "委屈翁",//榜单名称
        // version: "2020-03-10",//采集时间
      }
    },
    // 新增
    writerAdd() {
      this.$router.push({ path: "/author/add" });
    },
    // 获取上榜作品列表
    getListWorks() {
      this.searchParams.pageNo = this.currentPage
      this.searchParams.pageSize = this.curPageSize
      this.searchParams.siteName = this.$route.query.rankingListName
      this.searchParams.version = this.$route.query.collectionTime.substring(0, 10)
      // POST /api/rankingListBook/findRankingListBook
      this.$post("/api/rankingListBook/findRankingListBook", this.searchParams)
        .then(res => {
          let data = []
          res.data.result.forEach(element => {
            data.push(Object.assign(element.source, { _id: element._id }))
          });
          this.tableData = data
          this.curTotal = res.data.totalCount
        })
        .catch(res => { });
    },
    //   表格
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 分页
    handleSizeChange(val) {
      this.curPageSize = val;
      this.getListWorks();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListWorks();
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
    .screen-type {
      color: #a8a8a8;
      margin-bottom: 20px;
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

<template>
  <div>
    <div class="tag-box">
      <!-- 筛选条件 -->
      <div class="search-box">
        <el-row class="screen-box">
          <el-col style="line-height:40px;color:#07436A" :span="6">
            奖项：{{awards.name}}
            <!-- <label class="label">奖项：{{this.$route.query.name}}</label>
            <el-select v-model="awards" style="width:200px" size="mini"  filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="findPulishers" :loading="loading">
              <el-option v-for="item in pressOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select> -->
          </el-col>
          <!-- <el-col class="screen" :span="6">
                        <div style="width:100px">书号：</div>
                        <el-input v-model="seriesNumber" placeholder="请输入内容"></el-input>
                    </el-col>
                    <el-col class="screen" :push="1" :span="6">
                        <div style="width:100px">书名：</div>
                        <el-input v-model="name" placeholder="请输入内容"></el-input>
                    </el-col>
                    <el-col :push="2" :span="1">
                        <el-button type="primary" @click="getProductList" size="medium">查询</el-button>
                    </el-col> -->
        </el-row>

      </div>
      <!-- 表格 -->
      <div class="tag-con">
        <el-row class="row">
          <el-col :span="21">
            <el-button @click="removeConfirm(2)" size="medium" type="primary">删除关联</el-button>
            <el-button size="medium" @click="removeConfirm(1)" type="primary">确认关联</el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data="productList" stripe height="300" tooltip-effect="dark" border highlight-current-row style="width: 100%" header-row-class-name="table-head" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="isbn" label="ISBN" width="120">
          </el-table-column>
          <el-table-column prop="bookName" label="主书名" width="120">
          </el-table-column>
          <el-table-column prop="secondName" label="副书名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="seriesName" label="丛书名" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="seriesNumber" label="丛书卷号" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="publishers" label="出版社" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="personLiable" label="责任人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="pubDate" label="出版日期" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="language" label="语种" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" label="关联状态" show-overflow-tooltip>
            <!-- <template slot-scope="scope">
                            <el-button type="text" size="small">{{status}}</el-button>
                            <el-button type="text" size="small">未确认</el-button>
                        </template> -->
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top:30px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20,40,60,80,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tag',
  data() {
    return {
      awards:"",
      loading:false,
      list:[],
      pressOptions:[],
      select: '',
      input: '',
      value: '',
      value1: '',
      options: [],
      tableData: [],
      dialogFormVisible: false,
      form: {
        name: '',
      },
      formLabelWidth: '120px',
      dialogFormVisible1: false,
      seriesNumber: '',
      name: '',
      productList: [],
      awards: {},
      selectList: [],
      // 分页
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
    };
  },
  created() {
    if (JSON.stringify(this.$route.query) != '{}') {
      this.awards = JSON.parse(this.$route.query.awards);
      this.getProductList();
    }
  },
  methods: {
    findPulishers(query) {
      if (query !== '') {
        this.loading = true;
        // GET /api/awardsManage/findnames
        // this.$post('/api/publisher/findPulishers', querystring.stringify({ 'pulisher': query })).then(res => {
        this.$get('/api/awardsManage/findnames?name='+query+'').then(res => {
          // let states = []
          // res.data.forEach(element => {
          //   states.push(element)
          // });
          this.pressOptions = res.data.map(item => {
            return { value: `${item}`, label: `${item}` };
          });
          this.loading = false;
          // this.pressOptions = this.list.filter(item => {
          //   return item.label.toLowerCase()
          //     .indexOf(query.toLowerCase()) > -1;
          // });
          // this.pressOptions = res.data
        }).catch(err => {
          this.loading = false;
        })
      } else {
        this.pressOptions = [];
      }

    },
    // 新增
    monthlyAdd() {
      this.$router.push({ path: '/monthly/add' });
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    // 确认1,删除2
    removeConfirm(type) {
      if (this.selectList.length < 1) {
        this.$message('请选择至少一条数据');
        return false;
      }
      let url = type == 1 ? '/api/awardsManage/createRelation' : '/api/awardsManage/deleteRelation';
      let data = [];
      if (type == 1) {
        // data = {
        //   awardsId: this.awards.id,
        //   isbn: this.selectList[0].isbn,
        //   name: this.awards.name
        // };
        this.selectList.forEach(element => {
          data.push(
            {
              awardsId: this.awards.id,
              isbn: element.isbn,
              name: this.awards.name
            }
          )
        });
      } else {
        this.selectList.forEach(element => {
          data.push(
            {
              awardsId: this.awards.id,
              isbn: element.isbn,
            }
          )
        });
      }
      this.$post(url, data)
        .then(res => {
          this.$message(res.message);
          this.currentPage = 1
          this.getProductList()
        });
    },
    // 分页
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getProductList();
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getProductList();
    },
    // 获取产品列表
    getProductList() {
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        id: this.awards.id,
        isbn: this.awards.isbn,
        opus: this.awards.opus,
        author: this.awards.author,
        refOpus: this.awards.refOpus,
        // flag: "2"
      };
      if (this.name) {
        data.name = this.name;
      }
      if (this.seriesNumber) {
        data.seriesNumber = this.seriesNumber;
      }
      this.$post('/api/awardsManage/queryRelation', data)
        .then(res => {
          if (res.data != null) {
            res.data.result.forEach(item => {
              item.status = item.status === 1 ? <div style="color:#409EFF">已确认</div> : '未确认';
            });
            this.productList = res.data.result;
            this.totalCount = res.data.totalCount;
          } else {
            this.productList = [];
            this.totalCount = 0;
          }
        });
    }

  }
};
</script>

<style lang="scss" scoped>
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

<template>
  <div id='entityRead'>
    <div v-if="pageName==0">
      <filterPage :modelName="'实物审读'" :dicListAll="globalDicsListAll" @sendSearchData="getSearchParamsFuc"></filterPage>
      <div class="main-entityRead-body">
        <div class="operateBtns">
            <el-checkbox v-model="checkedAll" style="margin-right:10px;" @change="selectAllFuc">全选</el-checkbox>
            <el-button size="small" type="primary" @click="changePageName(1)">单条新增</el-button>
            <el-button size="small" type="primary" @click="batchAddFuc">批量新增</el-button>
            <div class="rightCont">
              <el-button size="small" type="primary" @click="downloadWorld">下载报告</el-button>
              <el-button size="small" type="primary" @click="exportFuc">导出</el-button>
            </div>
        </div>
        <div class="content">
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            tooltip-effect="dark"
            size="medium"
            style="width: 100%"
            height="730"
            @sort-change='sortChange'
            :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              fixed="left"
              width="45">
            </el-table-column>
            <el-table-column
              :label="showHeaderItem.label"
              :prop="showHeaderItem.prop"
              :key="index"
              :sortable="showHeaderItem.prop=='lastmodifyTime'?'custom':false"
              v-for="(showHeaderItem,index) in tableShowHeaders"
              :width="showHeaderItem.width?showHeaderItem.width:''"
              min-width="80">
            </el-table-column>
            <el-table-column
              v-if="false"
              label="操作"
              fixed="right"
              min-width="80">
              <template slot-scope="scope">
                <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
                <el-button type="text" size="small" @click="downLoadReportFuc(scope.row)">下载报告</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pageAndExport" v-show="tableData.length>0">
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="searchParams.pageNo"
                  :page-size="searchParams.pageSize"
                  :page-sizes="defaultPageSizes"
                  :total="totalCount"
                  layout="total, prev, pager, next,sizes">
              </el-pagination>
          </div>
        </div>
        <!-- <div v-if="tableData.length==0">
          <noData></noData>  
        </div> -->
      </div>
    </div>
    <div v-if="pageName==1">
      <addSingleDataPage :dicListAll="globalDicsListAll" @goHomePage="changePageName"></addSingleDataPage>
    </div>
    <el-dialog title="批量新增" :visible.sync="batchUploadDialog" width="1100px" center>
      <batchUpload ref="batchUpload" @closeDialog="batchUploadCloseDialog"></batchUpload>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import getEntityReadAllDicList from '@/components/js/getEntityReadDicList.js'
import {dateFormat} from '@/filters/index.js'
import filtData from '@/components/js/filtDataEntityRead.js'
import filterPage from '@/components/filter/filterPageEntityRead'
import addSingleDataPage from '@/views/book/entityRead/addSingleData.vue'
import batchUpload from '@/components/task/batchUploadEntityRead.vue'
import noData from '@/components/noData'

const curEnd = new Date()
const curStart = new Date()
curStart.setTime(curStart.getTime() - 3600 * 1000 * 24 * 7)
const curDate = [curStart, curEnd]
console.log(curDate)

export default {
  data(){
    return {
        pageName:0, // 0初始展示页面 1新增单条页面
        searchParams:{
          // isbn: [],// ISBN 逗号隔开 Array[String] 
          // bookName: '',//书名 String 
          // principal: '',// 责任人 String
          // publisher: [],// 出版社--逗号分割 , 默认全部
          // reviewUser: [],// 审读员 默认全部
          // 审读时间 快捷选项包含近一周、近一月。默认展示近一周。开始日期不大于结束日期。
          reviewTimeBegin: dateFormat(curDate[0]), // 审读时间 开始时间 2020-02-26T00:09:29.389Z
          reviewTimeEnd: dateFormat(curDate[1]), // 审读时间 结束时间 2020-02-26T00:09:29.389Z
          // reviewResult: [], // 实物审读结果 备选项包含全部、白名单、黑一、黑二、黑三。默认全部
          // sensitiveClassification: [], // 问题类型 调用敏感词库。默认全部
          pageNo: 1, // 当前页，默认是1
          pageSize: 20, //  每页条数，默认是10
          orderType: "desc", // 排序方式:asc/desc
          // maxSize: 0, // 单个文件数据存储上限
          // startRow: 0, // 起始条数，不需要传
          // totalPageNo: 0, // 总页数，不需要传
          // totalPageNum: 0 // 总条数，不需要传
        },
        defaultPageSizes:[20, 40, 60, 80, 100],
        totalCount:0,
        checkedAll:false,
        tableData:[
          // {
          //   "isbn": "9999999999999",
          //   "autoReviewResult": null,
          //   "manuelReviewResult": "",
          //   "entReviewResult": "黑一",
          //   "entReviewUser": "测试用户222",
          //   "bookName": "qweqwerere",
          //   "secondName": "sdfsaf",
          //   "transNameCn": "sfsfsf",
          //   "principal": "dsafdsaf,dfgdgs,hhuhjh",
          //   "publisher": "sdfgdsg",
          //   "publishRegion": null,
          //   "author": null,
          //   "publicationYear": null,
          //   "lastmodifyTime": "2020-02-24 18:23:56",
          //   "sensitiveClassification": "分类名称2020010215171114",
          //   "problemContent": null,
          //   "problemPage": null
          // }
        ],
        tableShowHeaders:filtData.tableHeader,
        globalDicsListAll:[],// 索引0代表审读人员 索引1代表实物审读结果; 2出版社 3问题
        publisherListObj:{},// 审读人员键值对
        entityReadResultObj:{},// 实物审读结果
        multipleSelection:[],
        batchUploadDialog:false,
        timeDis:7,
        DicsAll:{},
    }
  },
  components:{
    filterPage,
    noData,
    addSingleDataPage,
    batchUpload
  },
  created(){  
    let DicsAllTestFuc = getEntityReadAllDicList()
    DicsAllTestFuc.then(res=>{
      this.DicsAll = res;
      console.log("DicsAll");
      console.log(this.DicsAll)
      if(this.DicsAll){
        this.globalDicsListAll = this.DicsAll['Obj'];
        this.publisherListObj = this.DicsAll['Obj'][0];
        this.entityReadResultObj = this.DicsAll['Obj'][1];
      }
    })
  },
  mounted(){
    console.log("dics")
  },
  methods: {
    initSelectItems(){
      this.checkedAll = false;
      this.multipleSelection = [];
      if(this.$refs.multipleTable){
        this.$refs.multipleTable.clearSelection();
      }
    },
    initPageParams(){
      this.initSelectItems()
      this.searchParams.pageSize  = 20;
      this.searchParams.pageNo = 1;
    },
    getSearchParamsFuc(obj){
      console.log("456")
      this.searchParams=Object.assign({}, obj);
      this.searchParams.orderType = "desc";
      this.initPageParams();
      this.getImgList();
    },
    sortChange(column){
      this.searchParams.orderType=column.order=='ascending'?'asc':'desc'
      this.initPageParams();
      this.getImgList();
    },
    getImgList(){
      console.log("789")
      let curEndInner = new Date()
      let curStartInner = new Date()
      curStartInner.setTime(curStartInner.getTime() - 3600 * 1000 * 24 * this.timeDis)
      this.searchParams.reviewTimeBegin = this.searchParams.reviewTimeBegin||dateFormat(curStartInner);
      // this.searchParams.reviewTimeEnd = this.searchParams.reviewTimeEnd||dateFormat(curEndInner);
      this.searchParams.reviewTimeEnd = this.searchParams.reviewTimeEnd||'';
      console.log('searchParams', this.searchParams)
      console.log(JSON.stringify(this.searchParams))
      this.$post('/api/review/entReview/queryEntReviewResult', this.searchParams).then(res=>{
        let {status, success, data} = res;
        if(status==0 && success){
          if(data && data.totalCount){
            this.totalCount = data.totalCount;
          }else{
            this.totalCount = 0;
          }
          if(data && data.result){
            this.tableData = data.result;
          }else{
            this.tableData = [];
          }
        }else{
          this.totalCount = 0;
          this.tableData = [];
          this.$message({
            message:message,
            type:'warning'
          })
        }
      }).catch(err=>{
        this.totalCount = 0;
        this.tableData = [];
        console.log(err)
      })
    },
    selectAllFuc(val){
      // 此全选为数据库全选 与批操作 this.searchParams.allFlag等价
      this.checkedAll=val;
      if(this.checkedAll){
        this.$refs.multipleTable.toggleAllSelection();
      }else{
        this.$refs.multipleTable.clearSelection();
      }     
    },
    downloadWorld(){
      // 下载报告
      let reqParams = Object.assign({}, this.searchParams);
      if(this.checkedAll){
        // 数据库整体导出
        reqParams.allFlag = true;
      }else{
        if(this.multipleSelection && this.multipleSelection.length>0){
          reqParams.isbn = []
          reqParams.allFlag = false;
          this.multipleSelection.forEach(ele=>{
            if(ele && ele.isbn){
              reqParams.isbn.push(ele.isbn);
            }
          })
        }else{
          this.$message({
            type:'warning',
            message:'请选择要下载的报告'
          })
          return false;
        }
      }
      axios({
        method: 'post',
        url: '/br/api/review/entReview/createReviewReport',
        data: reqParams,
        responseType: 'blob'
      }).then(res=>{
        if (!res.data) {
            return
        }
        let fileName = '实物审读报告'+ new Date().getTime();
        let type=res.data.type.split('/')[1]
        type==='zip'? fileName += '.zip' : fileName += '.doc'
        // if(type==='zip'){
        //   fileName='实物审读报告'+new Date().getTime()+'.zip'
        // }else{
        //   fileName='实物审读报告'+new Date().getTime()+'.doc'
        // }
        this.initSelectItems();
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download',fileName)
        document.body.appendChild(link)
        link.click()
      }).catch(err=>{
        this.initSelectItems();
        console.log(err)
      })
    },
    exportFuc(){
      // 导出
      let reqParams = Object.assign({}, this.searchParams);
      if(this.checkedAll){
        // 数据库整体导出
        reqParams.allFlag = true;
      }else{
        if(this.multipleSelection && this.multipleSelection.length>0){
          reqParams.isbn = []
          reqParams.allFlag = false;
          this.multipleSelection.forEach(ele=>{
            if(ele && ele.isbn){
              reqParams.isbn.push(ele.isbn);
            }
          })
        }else{
          this.$message({
            type:'warning',
            message:'请选择要导出的数据'
          })
          return false;
        }
      }
      axios({
        method: 'post',
        url: '/br/api/review/entReview/exportEntReviewList',
        data: reqParams,
        responseType: 'blob'
      }).then(res=>{
        if (!res.data) {
            return
        }
        let fileName='实物审读'+new Date().getTime()+'.csv'
        let url = window.URL.createObjectURL(new Blob([res.data]))
        this.initSelectItems();
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download',fileName)
        document.body.appendChild(link)
        link.click()
      }).catch(err=>{
        this.initSelectItems();
        console.log(err)
      })
    },
    handleSelectionChange(val){
      console.log(val);
      this.multipleSelection = val;
      if (val.length!=this.tableData.length) {
        this.checkedAll=false
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.getImgList();
    },
    handleCurrentChange(val){
      console.log(`当前页: ${val}`);
      this.searchParams.pageNo = val;
      this.getImgList();
    },
    downLoadReportFuc(curItem){
      this.$post('/api/review/entReview/exportEntReviewList', curItem).then(res=>{

      }).catch(err=>{

      })
    },
    changePageName(curPageName){
      this.pageName = curPageName
    },
    batchUploadCloseDialog(){
      this.initPageParams();
      this.getImgList();
      this.batchUploadDialog = false;
    },
    batchAddFuc(){
      this.batchUploadDialog = true;
      this.$refs.batchUpload.initSysFuc();
    }
  }
}
</script>
<style lang='scss' scoped>
   .main-entityRead-body{
     background-color: #ffffff;
     margin: 20px 0;
     padding: 20px;
     .operateBtns{
       overflow: hidden;
       .rightCont{
         float: right;
       }
     }
     .content{
      .el-table{
        margin-top: 20px;
      }
      .pageAndExport{
        margin-top: 30px;
      }
     }
     
   }
</style>

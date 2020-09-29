<template>
  <div id='redListManage'>
    <div class="loginPage" v-if="!isLogin">
      <div class="tit"><i style="color:#e6a23c;" class="el-icon-info"></i> 输入密码才能进入红名单图书库</div>
      <span>密码：</span>
      <el-input size='small' type="password" style="width:210px;" v-model.trim="password" show-password placeholder="请输入密码" @keyup.enter.native="enterManagePage"></el-input>
      <el-button size='small' type="primary" :loading="lockLoading" @click.native="enterManagePage">确定</el-button>
    </div>
    <div v-if="isLogin">
      <filterPage :modelName="'红名单'" @sendSearchData='getData'></filterPage>
      <div class="btn">
          <el-checkbox :disabled="curTotal>10000" v-model="checkedAll" @change="handleCheckedAll" style="margin-right:10px;">全选</el-checkbox>
          <el-button size="small" type="primary" @click="openUpload">批量图书上传</el-button>
          <el-button size="small" type="primary" @click="exportBook">导出</el-button>
      </div>
      <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          stripe border
          size="medium"
          height="740"
          tooltip-effect="dark"
          style="width:100%;"
          :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
          @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              fixed="left"
              width="45">
          </el-table-column>
          <el-table-column
            v-for="item in columnData"
            :key="item.prop"
            :width="item.width"
            :label="item.label">
            <template slot-scope="scope">
              <span :title="scope.row[item.prop]">{{scope.row[item.prop]?(scope.row[item.prop].length>20?scope.row[item.prop].slice(0,20)+'...':scope.row[item.prop]):''}}</span>
            </template>
          </el-table-column>
      </el-table>
      <div class="pageAndExport" v-show="tableData.length>0">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20,40,60,80,100]"
              :page-size="curPageSize"
              layout="total, prev, pager, next,sizes"
              :total="curTotal">
          </el-pagination>
      </div>
    </div>
    <el-dialog
      title="图书批量上传"
      :visible.sync="batchUploadDialog"
      width="1100px"
      center>
      <batchUpload :modelName="'红名单'" ref="batchUpload" @closeDialog='closeUpload'></batchUpload>
    </el-dialog>
    <el-dialog
      title="导出选项"
      :visible.sync="exportDialog"
      width="600px">
      <selectTem ref="selectTem" :moudleType="'book'" :idList='taskList' :exportAll='checkedAll' @closeDialog='closeExportDialog'></selectTem>
    </el-dialog>
  </div>
</template>

<script>
import filterPage from '@/components/filter/filterPage'
import batchUpload from '@/components/task/batchUploadRed'
import selectTem from '@/components/export/selectTem'
export default {
  data(){
    return {
        loading:false,
        lockLoading:false,
        checkedAll:false,
        isLogin:false,
        exportDialog:false,
        password:'',
        currentPage:1,
        curPageSize:20,
        curTotal:0,
        searchParams:{},
        multipleSelection: [],
        batchUploadDialog:false,
        tableData:[],
        taskList:[],
        columnData:[
          {prop:"batch",label:"批次"},
          {prop:"number",label:"序号"},
          {prop:"isbn",label:"ISBN",width:"128"},
          {prop:"bookName",label:"主书名",width:"150"},
          {prop:"secondName",label:"副书名",width:"150"},
          {prop:"seriesName",label:"丛书名",width:"150"},
          {prop:"publishers",label:"出版社"},
          {prop:"pubDate",label:"出版时间",width:"160"},
          {prop:"personLiable",label:"责任人"},
          {prop:"personLiableRole",label:"责任人角色"},
          {prop:"update",label:"人工审读时间",width:"160"},
          {prop:"readLevel",label:"审读等级"},
          {prop:"remarks",label:"备注"},
        ]
    }
  },
  components:{
    filterPage,
    batchUpload,
    selectTem
  },
  methods: {
    closeExportDialog(){
      this.$refs.multipleTable.clearSelection()
      this.checkedAll=false
      this.exportDialog=false
    },
    handleCheckedAll(data){
      if (this.multipleSelection.length!=this.tableData.length||!data) {
        this.$refs.multipleTable.toggleAllSelection()
      }
    },
    exportBook(){
      if (this.multipleSelection.length>0) {
        this.taskList=[];
        this.multipleSelection.forEach(item=>{
          this.taskList.push(item.isbn)
        })
        this.exportDialog=true;
        this.$nextTick(()=>{
          this.$refs.selectTem.init(this.searchParams,'redListExport');
        })
      }else{
        this.$message.warning('请选择导出任务');
      }
    },
    closeUpload(){
      this.batchUploadDialog=false
      this.getSearchData()
    },
    openUpload(){
      this.batchUploadDialog=true
      this.$nextTick(()=>{
        this.$refs.batchUpload.init();
      })
    },
    enterManagePage(){
      if (this.password=='') {
        this.$message.warning('请输入密码')
        return
      }
      this.lockLoading=true
      this.$get('/api/product/checkRedProduct',{password:this.password}).then(res=>{
        this.lockLoading=false
        if (res.success) {
          this.isLogin=true;
        }else{
          this.$message.error('密码不正确，请重新修改')
        }
      }).catch(err=>{
        this.lockLoading=false
      })
    },
    getData(obj){
      this.currentPage=1;
      this.curPageSize=20;
      this.searchParams=obj;
      this.getSearchData();
    },
    getSearchData(){
      this.searchParams.pageNo=this.currentPage;
      this.searchParams.pageSize=this.curPageSize;
      this.loading=true;
      this.$post('/api/product/redList',this.searchParams).then(res=>{
        this.loading=false;
        if (res.data.result&&res.data.result.length>0) {
          let data=[];
          res.data.result.forEach(obj => {
            for (const k in obj) {
              obj[k]=obj[k].value
            }
            data.push(obj)
          });
          this.tableData=data;
        }else{
          this.tableData=[];
        }
        this.curTotal=res.data.totalCount
        if (this.checkedAll) {
          this.$refs.multipleTable.toggleAllSelection()
        }
      }).catch(err=>{
        this.tableData=[];
        this.loading=false;
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length!=this.tableData.length) {
        this.checkedAll=false
      }
    },
    handleSizeChange(val) {
      this.curPageSize=val;
      this.getSearchData()
    },
    handleCurrentChange(val) {
      this.currentPage=val;
      this.getSearchData()
    }
  }
}
</script>
<style lang='scss' scoped>
    #redListManage{
        padding:15px;
        background: #fff;
        min-height:100%;
        border-radius: 5px;
        box-sizing: border-box;
        .loginPage{
          text-align: center;
          padding-top: 200px;
          .tit{
            margin-bottom:50px;
          }
        }
        .btn{
            padding-left: 15px;
            margin-bottom:10px;
        }
        .pageAndExport{
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            span{
            color: #409eff;
            cursor: pointer;
            }
        }
    }
</style>

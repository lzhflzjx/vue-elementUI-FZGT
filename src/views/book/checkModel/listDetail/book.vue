<template>
  <div id="booklist">
    <filterPage :modelName="'图书清单'"  @sendSearchData='getData'></filterPage>
    <div class="operateBtns">
      <el-checkbox :disabled="curTotal>10000" v-model="checkedAll" @change="handleCheckedAll" style="margin-right:10px;">全选</el-checkbox>
      <el-button v-if="permission.indexOf('F_BR_BM_RL')!=-1" size="small" type="primary" @click="taskAgainAllot">任务重分配</el-button>
      <!-- <el-button v-if="permission.indexOf('F_BR_CR_STOP')!=-1" size="small" type="primary">采集终止</el-button>
      <el-button v-if="permission.indexOf('F_BR_CR_START')!=-1" size="small" type="primary">采集启动</el-button> -->
      <el-button v-if="permission.indexOf('F_BR_BUD')!=-1" size="small" type="primary" @click="replenishOne">单条补齐材料</el-button>
      <el-button v-if="permission.indexOf('F_BR_BUD')!=-1" size="small" type="primary" @click="batchUpload">批量补齐材料</el-button>
      <el-button size="small" type="primary" @click="exportTask">导出</el-button>
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        stripe border
        tooltip-effect="dark"
        size="medium"
        style="width: 100%"
        height="730"
        @sort-change='sortChange'
        @row-dblclick='openCheckDetail'
        :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          fixed="left"
          width="45">
        </el-table-column>
        <el-table-column
          prop="isbn"
          width="150"
          label="ISBN">
        </el-table-column>
        <el-table-column
          label="触发采集状态">
          <template slot-scope="scope">{{methods.changeDict(crawlStatus,scope.row.collectStatus)}}</template>
        </el-table-column>
        <el-table-column
          label="采集结果">
          <template slot-scope="scope">{{resultOption[scope.row.collectResult]}}</template>
        </el-table-column>
        <el-table-column
          prop="missionId"
          label="任务编号">
        </el-table-column>
        <el-table-column
          prop="source"
          label="任务来源">
        </el-table-column>
        <el-table-column
          sortable='custom'
          width="160"
          label="生成时间">
          <template slot-scope="scope">{{methods.changeTime(scope.row.createDate)}}</template>
        </el-table-column>
        <el-table-column
          width="160"
          label="要求完成时间">
          <template slot-scope="scope">{{methods.changeTime(scope.row.completeDate)}}</template>
        </el-table-column>
        <el-table-column
          label="优先级">
          <template slot-scope="scope">{{methods.changeDict(reviewLevel,scope.row.priority)}}</template>
        </el-table-column>
        <el-table-column
          prop="readerstatus"
          label="审读状态">
            <template slot-scope="scope">{{readerstatusOption[scope.row.missionStatus]}}</template>
        </el-table-column>
        <el-table-column
          prop="reader"
          label="审读人">
        </el-table-column>
        <el-table-column
          prop="publishers"
          label="出版社名称">
        </el-table-column>
        <el-table-column
          prop="membershipGroup"
          label="所属集团">
        </el-table-column>
        <el-table-column
          prop="classification"
          :show-overflow-tooltip="true"
          label="分类">
          <template slot-scope="scope">
            <div v-if="scope.row.classification">{{methods.classification(classification1,scope.row.classification)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="bookName"
          width="150"
          label="主书名">
        </el-table-column>
        <el-table-column
          prop="secondName"
          width="150"
          label="副书名">
        </el-table-column>
        <el-table-column
          prop="seriesName"
          width="150"
          label="丛书名">
        </el-table-column>
        <el-table-column
          prop="language"
          label="语种">
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
      title="任务重分配"
      @open='initTask'
      :visible.sync="taskDialog"
      width="900px"
      center>
      <task ref="task" :modelName="'清单'" :modelType="'book'" :taskData='taskList' :taskTotleNum='curTotal' :checkedAll='checkedAll' :searchParams='searchParams' @closeDialog='closeDialog'></task>
    </el-dialog>
    <el-dialog
      title="补充材料上传"
      :visible.sync="batchUploadDialog"
      width="700px"
      center>
      <batchUpload :modelName="'图书库'" ref="batchUpload" @closeDialog='closeDialog'></batchUpload>
      <!-- <supMaterials ref="supMaterials" @closeDialog='batchUploadDialog=false' @getList='getSearchData'></supMaterials> -->
    </el-dialog>
    <el-dialog
      title="导出选项"
      :visible.sync="exportDialog"
      width="600px">
      <selectTem ref="selectTem" :moudleType="'taskDetail'" :idList='taskList' :exportAll='checkedAll' @closeDialog='closeExportDialog'></selectTem>
    </el-dialog>
  </div>
</template>

<script>
import filterPage from '@/components/filter/filterPage'
import task from '@/components/task/taskAllocationAdd'
import taskClaim from '@/components/task/taskClaim'
// import supMaterials from './component/supMaterials'
import selectTem from '@/components/export/selectTem'
import batchUpload from '@/components/task/batchUpload'
import {mapGetters} from 'vuex'
export default {
  data(){
    return{
        loading:false,
        resultOption:['无结果','有结果'],
        readerstatusOption:['采集中','未审','已审'],
        tableData: [],
        multipleSelection: [],
        currentPage:1,
        curPageSize:20,
        curTotal:0,
        taskDialog:false,
        taskClaimDialog:false,
        addTaskDialog:false,
        batchUploadDialog:false,
        openTaskType:'',
        searchParams:{},
        taskList:[],
        checkedAll:false,
        singleCheckAll:false,
        exportDialog:false,
        permission:JSON.parse(localStorage.getItem('userInfo')).permission
    }
  },
  components:{
    filterPage,
    task,
    taskClaim,
    // supMaterials,
    selectTem,
    batchUpload
  },
  computed:{
    ...mapGetters(['reviewLevel','crawlStatus','classification1']),
  },
  methods:{
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
    sortChange(column){
      this.searchParams.sort=column.order=='ascending'?'asc':'desc'
      this.getSearchData()
    },
    exportTask(){
      if (this.multipleSelection.length>0) {
        this.taskList=[];
        this.multipleSelection.forEach(item=>{
          this.taskList.push(item.id)
        })
        this.exportDialog=true;
        this.$nextTick(()=>{
          this.$refs.selectTem.init(this.searchParams,'bookCheckList');
        })
      }else{
        this.$message.warning('请选择导出任务');
      }
    },
    replenishOne(){
      if (this.multipleSelection.length>0) {
        if (this.multipleSelection.length==1) {
          let router = this.$router.resolve({path:'/bookDetail',query:{isbn:this.multipleSelection[0].isbn,type:'replenish'}})
          window.open(router.href, '_blank');
        } else {
          this.$message.warning('只能选择一项');
        }
      } else {
        this.$message.warning('请至少选择一项任务');
      }
    },
    batchUpload(){
      this.batchUploadDialog=true;
      this.$nextTick(()=>{
        this.$refs.batchUpload.init();
      })
    },
    closeDialog(){
      this.checkedAll=false;
      this.taskDialog=false;
      this.batchUploadDialog=false;
      this.getSearchData()
    },
    taskAgainAllot(){
      if (this.multipleSelection.length>0) {
        this.taskList=[];
        this.multipleSelection.forEach(item=>{
          this.taskList.push(item.id)
        })
        this.taskDialog=true;
      } else {
        this.$message.warning('请至少选择一项任务');
      }
    },
    openCheckDetail(data){
      var ids=[];
      this.tableData.forEach(item=>{
        ids.push(item.isbn)
      })
      localStorage.setItem('bookCheckList',JSON.stringify(ids));
      let router = this.$router.resolve({path:'/bookDetail',query:{isbn:data.isbn}})
      window.open(router.href, '_blank');
    },
    getData(obj){
      this.checkedAll=false;
      this.currentPage=1;
      this.curPageSize=20;
      this.searchParams=obj;
      this.searchParams.order='createDate'
      this.searchParams.sort='desc'
      if (this.$route.query.id) {
        this.searchParams.params.push({
          field:'missionId',
          grammar: "equal",
          logic: "and",
          type: "digital",
          value:this.$route.query.id.toString().split(',')
        })
      }
      this.getSearchData();
    },
    getSearchData(){
      this.searchParams.flag=0;
      this.searchParams.pageNo=this.currentPage;
      this.searchParams.pageSize=this.curPageSize;
      this.loading=true;
      this.$post('/api/mission/getMissionInfo',this.searchParams).then(res=>{
        this.loading=false;
        if (res.data.result&&res.data.result.length>0) {
          this.tableData=res.data.result;
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
    initTask(){
      this.$nextTick(()=>{
        this.$refs.task.init('任务分配');
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
      this.getSearchData();
    },
    handleCurrentChange(val) {
      this.currentPage=val;
      this.getSearchData();
    }
  }
};
</script>
<style lang="scss" scoped>
#booklist{
  .operateBtns{
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
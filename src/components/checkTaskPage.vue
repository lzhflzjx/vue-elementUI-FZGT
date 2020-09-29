<template>
  <div id='checkPage'>
    <filterPage :modelName="curModel"  @sendSearchData='getData'></filterPage>
    <div class="btn">
        <el-checkbox :disabled="curTotal>10000" v-model="checkedAll" @change="handleCheckedAll" style="margin-right:10px;">全选</el-checkbox>
        <el-button v-if="($route.path=='/bookCheck'&&permission.indexOf('F_BR_BD')!=-1)||($route.path=='/imgCheck'&&permission.indexOf('F_BI_MRL')!=-1)" size="small" type="primary" @click="taskAgainAllot">任务重新分配</el-button>
        <el-button size="small" type="primary" @click="openTasksDetail">查看任务清单</el-button>
        <el-button size="small" type="primary" @click="exportTask">导出</el-button>
    </div>
    <el-table
        v-loading='loading'
        ref="multipleTable"
        :data="tableData"
        :cell-style="cellStyle"
        stripe border
        tooltip-effect="dark"
        height="740"
        @sort-change='sortChange'
        style="width: 100%;"
        @row-dblclick='openList'
        :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
        @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="45">
        </el-table-column>
        <el-table-column
            prop="id"
            width="150"
            label="任务编号">
        </el-table-column>
        <el-table-column
            prop="source"
            label="任务来源">
        </el-table-column>
        <el-table-column
            prop="count"
            sortable='custom'
            label="数量（个）">
        </el-table-column>
        <el-table-column
            width="70"
            label="优先级">
            <template slot-scope="scope">{{methods.changeDict(reviewLevel,scope.row.priority)}}</template>
        </el-table-column>
        <el-table-column
            prop="createDate"
            sortable='custom'
            label="生成时间">
            <template slot-scope="scope">{{methods.changeTime(scope.row.createDate)}}</template>
        </el-table-column>
        <el-table-column
            prop="completeDate"
            sortable='custom'
            label="要求完成时间">
            <template slot-scope="scope">{{methods.changeTime(scope.row.completeDate)}}</template>
        </el-table-column>
        <el-table-column
            prop="progress"
            sortable='custom'
            label="任务进度">
            <template slot-scope="scope">{{scope.row.progress}}%</template>
        </el-table-column>
        <el-table-column
            prop="reader"
            label="审读人">
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
    <el-dialog
      title="任务重分配"
      :visible.sync="taskDialog"
      width="900px"
      center>
      <task ref="task" v-loading='taskLoading' :modelName="'任务'" :modelType="pageType" :taskData='taskList' :taskTotleNum='isbnTotal' :checkedAll='checkedAll' :searchParams='searchParams' @closeDialog='closeDialog'></task>
    </el-dialog>
    <el-dialog
      title="导出选项"
      :visible.sync="exportDialog"
      width="600px">
      <selectTem ref="selectTem" :moudleType="'task'" :idList='taskList' :exportAll='checkedAll' @closeDialog='closeExportDialog'></selectTem>
    </el-dialog>
  </div>
</template>

<script>
import filterPage from '@/components/filter/filterPage'
import task from '@/components/task/taskAllocationAdd'
import selectTem from '@/components/export/selectTem'
import {mapGetters} from 'vuex'
export default {
  data(){
    return {
      loading:false,
      taskLoading:true,
      checkedAll:false,
      currentPage:1,
      curPageSize:20,
      curTotal:0,
      isbnTotal:0,
      multipleSelection: [],
      taskDialog:false,
      tableData:[],
      taskList:[],
      searchParams:{},
      exportDialog:false,
      pageType:'',
      curModel:'',
      permission:JSON.parse(localStorage.getItem('userInfo')).permission
    }
  },
  components:{
    filterPage,
    task,
    selectTem
  },
  created(){
    if (this.$route.path=='/bookCheck') {
      this.pageType='book'
      this.curModel='图书任务'
    } else {
      this.pageType='img'
      this.curModel='图片任务'
    }
  },
  computed:{
    ...mapGetters(['reviewLevel']),
  },
  props:['userId'],
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
    sortChange(column){
      this.searchParams.order=column.prop
      this.searchParams.sort=column.order=='ascending'?'asc':'desc'
      this.getSearchData()
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      //根据是否过期显示颜色
      if (new Date(row.row.completeDate).getTime() < new Date().getTime()) {
        return "color:#f60b0b";
      }
    },
    openTasksDetail(){
      if (this.multipleSelection.length==0) {
        this.$message.warning('请选择多个任务查看清单详情');
        return
      }
      let ids=[]
      this.multipleSelection.forEach(item=>{
        ids.push(item.id)
      })
      this.openList({id:ids.join(',')})
    },
    openList(data){
      this.$emit('changePage')
      this.$router.push({path:this.$route.path,query:{id:data.id}})
    },
    exportTask(){
      if (this.multipleSelection.length>0) {
        this.taskList=[];
        this.multipleSelection.forEach(item=>{
          this.taskList.push(item.id)
        })
        this.exportDialog=true;
        this.$nextTick(()=>{
          this.$refs.selectTem.init(this.searchParams);
        })
      }else{
        this.$message.warning('请选择导出任务');
      }
    },
    closeDialog(){
      this.taskDialog=false;
      this.checkedAll=false;
      this.getSearchData()
    },
    taskAgainAllot(){
      if (this.multipleSelection.length>0) {
        this.taskList=[];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].progress == 100) {
            this.$message.warning("任务进度已经为100%，不可以再重新分配！");
            return;
          }
        }
        // 转化任务ID为isbn
        let params={
          flag:this.$route.path=='/bookCheck'?0:1,
        }
        if (this.checkedAll) {
          params.productMissionQuery=this.searchParams
        }else{
          let taskIds=[]
          this.multipleSelection.forEach(item=>{
            taskIds.push(item.id)
          })
          params.ids=taskIds
        }
        this.taskLoading=true;
        this.$post('/api/mission/selectByMissionId',params).then(res=>{
          this.taskLoading=false;
          if (this.checkedAll) {
            this.isbnTotal=res.data.totalCount
          }else{
            if (res.data.result.length>0) {
              this.taskList=res.data.result
            }
          }
        }).catch(err=>{
          this.taskLoading=false;
        })
        this.taskDialog=true;
        this.$nextTick(()=>{
          this.$refs.task.init('任务分配');
        })
      } else {
        this.$message.warning('请选择任务');
      }
    },
    getCurUserTask(){
      this.checkedAll=false;
      this.currentPage=1;
      this.curPageSize=20;
      this.searchParams.order='createDate'
      this.searchParams.sort='desc'
      this.searchParams.params=[]
      if (this.userId) {
        this.searchParams.params.push({
          field:'userid',
          grammar: "equal",
          logic: "and",
          type: "digital",
          value:[this.userId]
        })
      }
      this.getSearchData();
    },
    getData(obj){
      this.checkedAll=false;
      this.currentPage=1;
      this.curPageSize=20;
      this.searchParams=obj;
      this.searchParams.order='createDate'
      this.searchParams.sort='desc'
      if (this.userId) {
        this.searchParams.params.push({
          field:'userid',
          grammar: "equal",
          logic: "and",
          type: "digital",
          value:[this.userId]
        })
      }
      this.getSearchData();
    },
    getSearchData(){
      this.searchParams.pageNo=this.currentPage,
      this.searchParams.pageSize=this.curPageSize,
      this.searchParams.flag=(this.$route.path=='/bookCheck'?0:1)
      this.loading=true;
      this.$post('/api/mission/list',this.searchParams).then(res=>{
        this.loading=false;
        if (res.data.result.length>0) {
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
    },
  }
}
</script>
<style lang='scss' scoped>
    #checkPage{
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

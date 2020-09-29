<template>
    <div id='report' v-loading="loading">
        <div class="topTxt">本报告共计<b>{{curTotal}}</b>篇文章，<b>{{nonentity}}</b>篇文章链接不存在，<b>{{nentity}}</b>篇文章链接仍然存在。</div>
        <el-table
            ref="multipleTable" :data="tableData" border
            stripe size="medium" height="740" style="width:100%;"
            :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}">
            <el-table-column type="index" label="序号" width="80">
                <template slot-scope="scope">{{scope.$index+1+(pageNo-1)*pageSize}}</template>
            </el-table-column>
            <el-table-column width="200" label="文章ID" prop="titleId"></el-table-column>
            <el-table-column label="文章链接" show-overflow-tooltip>
                <template slot-scope="scope"><el-link type="primary" :underline="false" :href="scope.row.titleUrl.indexOf('http')!=-1?scope.row.titleUrl:'http://'+scope.row.titleUrl" target="_blank">{{scope.row.titleUrl}}</el-link></template>
            </el-table-column>
            <el-table-column width="100" label="链接状态">
                <template slot-scope="scope"><span>{{status[scope.row.status]}}</span></template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-show="tableData.length>0"
            style="margin-top:10px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[20,40,60,80,100]"
            :page-size="pageSize"
            layout="total, prev, pager, next,sizes"
            :total="curTotal">
        </el-pagination>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loading:false,
            tableData:[],
            pageNo:1,
            pageSize:20,
            curTotal:0,
            taskId:'',
            status:['不存在','存在'],
            nonentity:'',
            nentity:''
        }
    },
    methods: {
        init(id){
            this.tableData=[];
            this.pageNo=1
            this.pageSize=20
            this.taskId=id
            this.search()
            this.getStatistics()
        },
        getStatistics(){
           this.$get('/api/databaseCheck/getRecheckInfo',{id:this.taskId}).then(res=>{
               this.nonentity=res.data.error
               this.nentity=res.data.correct
           })
        },
        search(){
            let params={
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                taskId:this.taskId
            }
            this.loading=true
            this.$post('/api/databaseCheck/queryRecheck',params).then(res=>{
                this.loading=false
                if (res.data.result&&res.data.result.length>0) {
                    this.tableData=res.data.result
                }else{
                    this.tableData=[]
                }
                this.curTotal=res.data.totalCount
            }).catch(err=>{
                this.tableData=[]
                this.loading=false
            })
        },
        handleSizeChange(val){
            this.pageSize=val;
            this.search()
        },
        handleCurrentChange(val){
            this.pageNo=val;
            this.search()
        },
    }
}
</script>
<style lang='scss' scoped>
#report{
    .topTxt{
        margin-bottom: 15px;
        b{
            color: #409eff;
            cursor: pointer;
        }
    }
}
</style>

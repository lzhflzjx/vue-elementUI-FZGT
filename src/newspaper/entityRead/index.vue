<template>
    <div id='entityRead'>
        <filterPage :modelName="'报刊实物审读'" @sendSearchData='getData'></filterPage>
        <div class="btn">
            <el-checkbox v-model="checkedAll" @change="handleCheckedAll">全选</el-checkbox>
            <el-button size="small" type="primary" @click="addTask">单条新增</el-button>
            <el-button size="small" type="primary" @click="batchAdd">批量新增</el-button>
            <el-button class="export" size="small" type="primary" @click="exportData">导出</el-button>
        </div>
        <el-table
            ref="multipleTable" border
            v-loading='loading'
            :data="tableData" size="medium"
            height="740" style="width:100%;"
            :row-style="rowClass"
            @row-dblclick='openDetail'
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
                show-overflow-tooltip
                :width="item.width"
                :label="item.label">
                <template slot-scope="scope">
                    <span v-if="item.label=='审读结果'">{{methods.changeDict(paperReview,scope.row[item.prop])}}</span>
                    <span v-else-if="item.label=='问题类型'">{{methods.changeDict(paperProblemType,scope.row[item.prop])}}</span>
                    <span v-else-if="item.label=='审读意见'">{{methods.changeDict(paperReviewOpinion,scope.row[item.prop])}}</span>
                    <span v-else>{{scope.row[item.prop]}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 20px;"
            v-show="tableData.length>0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20,40,60,80,100]"
            :page-size="curPageSize"
            layout="total, prev, pager, next,sizes"
            :total="curTotal">
        </el-pagination>

        <el-dialog :title="addDialogTitle" :visible.sync="addDialog" width="1200px">
            <addTask v-if="addDialog" ref="addTask" :modelType='addDialogTitle' @closeDialog="closeDetail"></addTask>
        </el-dialog>
        <el-dialog title="批量新增" :visible.sync="batchDialog" width="800px">
            <batchAdd ref="batchAdd" @closeDialog="closeDetail"></batchAdd>
        </el-dialog>
        <el-dialog title="导出" :visible.sync="exportDialog" width="600px">
            <exportModel v-if="exportDialog" ref="exportModel" :curTotal='curTotal' :selectData='multipleSelection' :checkedAll='checkedAll' :queryParams='searchParams' @closeDialog="closeDetail"></exportModel>
        </el-dialog>
    </div>
</template>

<script>
import filterPage from '@/components/filter/filterPage'
import addTask from './component/addTask'
import batchAdd from './component/batchAdd'
import exportModel from './component/export'
import {mapGetters} from 'vuex'
export default {
    data(){
        return {
            loading:false,
            checkedAll:false,
            addDialog:false,
            batchDialog:false,
            exportDialog:false,
            tableData:[],
            multipleSelection: [],
            currentPage:1,
            curPageSize:20,
            curTotal:0,
            searchParams:{},
            columnData:[
                {prop:"paperCode",label:"刊号"},
                {prop:"paperName",label:"刊名"},
                {prop:"chinaName",label:"中文译名"},
                {prop:"publishingDepartmentType",label:"出版署类别"},
                {prop:"issn",label:"ISSN"},
                {prop:"volumeDescription",label:"卷期描述"},
                {prop:"coverDate",label:"封面日期"},
                {prop:"nameList",label:"审读结果"},
                {prop:"reviewUserName",label:"审读员"},
                {prop:"reviewDate",label:"审读时间",width:'160'},
                {prop:"questionType",label:"问题类型"},
                {prop:"errorPage",label:"问题出现页"},
                {prop:"reviewOpinion",label:"审读意见"},
            ],
            addDialogTitle:''
        }
    },
    computed:{
        ...mapGetters(['paperReview','paperProblemType','paperReviewOpinion'])
    },
    components:{
        filterPage,batchAdd,exportModel,addTask
    },
    methods: {
        openDetail(data){
            this.addDialogTitle='详情'
            this.addDialog=true;
            this.$nextTick(()=>{
                this.$refs.addTask.init(data)
            })
        },
        rowClass({ row, rowIndex }) {
            let isCheck=false
            this.multipleSelection.forEach(item=>{
                if (row.id==item.id) {
                    isCheck=true
                }
            })
            if (isCheck) {
                return { "background": "#cbe6fb" };
            }
        },
        closeDetail(){
            this.addDialog=false;
            this.batchDialog=false;
            this.exportDialog=false;
            this.getSearchData()
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
            this.$post('/api/paperReview/findList',this.searchParams).then(res=>{
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
        handleCheckedAll(data){
            if (this.multipleSelection.length!=this.tableData.length||!data) {
                this.$refs.multipleTable.toggleAllSelection()
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            if (val.length!=this.tableData.length) {
                this.checkedAll=false
            }
        },
        addTask(){
            this.addDialogTitle='单条新增'
            this.addDialog=true;
            this.$nextTick(()=>{
                this.$refs.addTask.init()
            })
        },
        batchAdd(){
            this.batchDialog=true;
            this.$nextTick(()=>{
                this.$refs.addTask.init()
            })
        },
        exportData(){
            if (this.multipleSelection.length==0) {
                this.$message.warning('请选择任务')
                return
            }
            this.exportDialog=true;
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
#entityRead{
    padding:15px;
    background: #fff;
    min-height:100%;
    border-radius: 5px;
    .btn{
        padding:0 15px;
        margin-bottom:10px;
        .el-checkbox{
            margin-right:10px;
        }
        .export{
            float: right;
        }
    }
}
</style>

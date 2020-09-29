<template>
    <div id='dataBaseRead'>
        <div class="searchDiv">
            <el-select size="small" style="width:300px;" v-model="searchQuery.baseId" filterable>
                <el-option v-for="item in baseDataOptions" :key="item.id" :label="item.baseName" :value="item.id"></el-option>
            </el-select>
            <div class="search">
                <span>
                    <label>下达时间：</label>
                    <el-date-picker
                        v-model="timeVal"
                        size="small"
                        style="width:330px;"
                        type="daterange"
                        :picker-options="pickerOptions"
                        value-format='yyyy-MM-dd'
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                    </el-date-picker>
                </span>
                <!-- <span class="ml20">
                    <label>任务状态：</label>
                    <el-select style="width:160px;" size="small" v-model="searchQuery.taskStuats">
                        <el-option v-for="item in taskStuats" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </span> -->
                <span class="ml20">
                    <label>结果状态：</label>
                    <el-select style="width:160px;" size="small" v-model="searchQuery.resultStuats">
                        <el-option v-for="item in resultStuats" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </span>
                <span class="ml20">
                    <el-input v-model.trim="searchQuery.keyWord" size="small" style="width:250px;" placeholder="请输入关键词进行查询" clearable></el-input>
                    <el-button size="small" type="primary" @click="getList">查询</el-button>
                </span>
            </div>
        </div>
        <div class="cont">
            <div class="btn">
                <div>
                    <el-checkbox v-model="checkedAll" @change="handleCheckedAll" style="margin-right:10px;">全选</el-checkbox>
                    <el-button size="small" type="primary" @click="addTask">新建任务</el-button>
                    <el-button v-if="permission.indexOf('F_DB_REVIEW_DEL_TASK')!=-1" size="small" type="primary" @click="handleTask('删除')">删除任务</el-button>
                    <el-button size="small" type="primary" @click="handleTask('启动')">启动任务</el-button>
                    <el-button size="small" type="primary" @click="handleTask('停止')">停止任务</el-button>
                </div>
                <div>
                    <span>共{{curTotal}}次审读记录</span>
                </div>
            </div>
            <el-table
                v-loading="loading"
                ref="multipleTable" :data="tableData" border
                size="medium" height="740" style="width:100%;"
                @sort-change='sortChange'
                @row-dblclick='openDetail'
                :row-style="rowClass"
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
                    :label="item.label"
                    :prop="item.prop"
                    :sortable='item.sortable'>
                    <template slot-scope="scope">
                        <span v-if="item.label=='操作'" class="handlebtns">
                            <span v-if="scope.row.resultStuats==3" @click="lookReport(scope.row.id)">查看审读报告</span>
                            <span v-if="scope.row.resultStuats==3" @click="recheck(scope.row.id)">复审</span>
                            <span v-if="scope.row.resultStuats==5" @click="lookRecheckReport(scope.row.id)">查看复审报告</span>
                            <span v-if="scope.row.resultStuats!=3&&scope.row.resultStuats!=5">
                                <span v-if="scope.row.stuats!=1" @click="updataTaskStatus('启动',scope.row,'one')">启动</span>
                                <span v-if="scope.row.stuats!=2" @click="updataTaskStatus('停止',scope.row,'one')">停止</span>
                            </span>
                            <span v-if="permission.indexOf('F_DB_REVIEW_DEL_TASK')!=-1&&scope.row.resultStuats==0&&scope.row.stuats!=1" @click="delTask(scope.row)">删除</span>
                        </span>
                        <!-- <span v-else-if="item.label=='任务状态'">{{methods.changeDict(taskStuats,scope.row.taskStuats)}}</span> -->
                        <span v-else-if="item.label=='结果状态'">{{methods.changeDict(resultStuats,scope.row.resultStuats)}}</span>
                        <span v-else>{{scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin-top:10px;"
                v-show="tableData.length>0"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchQuery.pageNo"
                :page-sizes="[20,40,60,80,100]"
                :page-size="searchQuery.pageSize"
                layout="total, prev, pager, next,sizes"
                :total="curTotal">
            </el-pagination>
        </div>
        <!-- 配置 -->
        <el-dialog title="数据库配置" :visible.sync="setingDialog" width="900px" center>
            <seting ref="seting"></seting>
        </el-dialog>

        <el-dialog title="复审报告" :visible.sync="reportDialog" width="1000px">
            <report ref="report"></report>
        </el-dialog>

        <el-dialog title="机器审读报告" :visible.sync="machineReportDialog" width="1400px">
            <machineReport v-if="machineReportDialog" ref="machineReport"></machineReport>
        </el-dialog>

        <el-dialog title="任务详情" :visible.sync="detailDialog" width="1400px">
            <taskDetail v-if="detailDialog" ref="taskDetail"></taskDetail>
        </el-dialog>
    </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import seting from '../dataBase/component/seting'
import report from './component/report'
import machineReport from './component/machineReport'
import taskDetail from './component/taskDetail'
export default {
    data(){
        return {
            loading:false,
            searchQuery:{
                baseId:'',
                bigenDate:'',
                endDate:'',
                // taskStuats:'1',
                resultStuats:'3',
                keyWord:'',
                sort:'',
                order:'',
                pageNo:1,
                pageSize:20,
            },
            curTotal:0,
            baseDataOptions:[],
            timeVal:'',
            checkedAll:false,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            tableData:[],
            multipleSelection:[],
            columnData:[
                {prop:"id",label:"任务ID",width:"160"},
                {prop:"createDate",label:"下达时间",width:"",sortable:'custom'},
                {prop:"userPass",label:"账号密码",width:""},
                {prop:"wordCount",label:"关键词总量",width:"",sortable:'custom'},
                // {prop:"taskStuats",label:"任务状态",width:""},
                {prop:"resultStuats",label:"结果状态",width:""},
                {prop:"yevaluatecountStr",label:"已审读数量",width:""},
                {prop:"wevaluatecountStr",label:"待审读数量",width:""},
                {prop:"indicating",label:"操作",width:"200"},
            ],
            setingDialog:false,
            reportDialog:false,
            machineReportDialog:false,
            detailDialog:false,
            baseName:'',
            permission:JSON.parse(localStorage.getItem('userInfo')).permission
        }
    },
    components:{
        seting,report,machineReport,taskDetail
    },
    computed:{
        ...mapGetters(['resultStuats','taskStuats'])
    },
    created(){
        let startTime=this.changeTime(new Date(new Date().getTime() - 3600 * 1000 * 24 * 7));
        let endTime=this.changeTime(new Date());
        this.timeVal=[startTime,endTime];
        this.getDictList(['taskStuats','resultStuats'])
        this.getDatabaseList()
    },
    methods: {
        ...mapActions(['getDictList']),
        recheck(taskId){
            this.$confirm('确认复审该任务?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$get('/api/databaseCheck/recheckDataTask',{id:taskId}).then(res=>{
                   if (res.success) {
                       this.$message.success(res.message)
                       this.getList()
                   } else {
                       this.$message.error(res.message)
                   } 
                })
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
        changeTime(data) {
            let time = new Date(data);
            let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
            let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
            return time.getFullYear() + '-' + month + '-' + date
        },
        openDetail(data){
            this.detailDialog=true;
            this.$nextTick(()=>{
                this.$refs.taskDetail.init(data.id)
            })
        },
        lookReport(id){
            this.machineReportDialog=true;
            this.$nextTick(()=>{
                this.$refs.machineReport.init(id)
            })
        },
        lookRecheckReport(id){
            this.reportDialog=true;
            this.$nextTick(()=>{
                this.$refs.report.init(id)
            })
        },
        getDatabaseList(){
            this.loading=true;
            this.$get('/api/databaseCheck/getDataBaseInfo').then(res=>{
                if (res.data.result&&res.data.result.length>0) {
                    this.baseDataOptions=res.data.result
                    if (this.$route.query.id) {
                        this.searchQuery.baseId=this.$route.query.id/1;
                        this.baseName=this.$route.query.baseName;
                    }else{
                        this.searchQuery.baseId=this.baseDataOptions[0].id;
                        this.baseName=this.baseDataOptions[0].baseName;
                    }
                }
                this.getList()
            }).catch(err=>{
                this.loading=false;
            })
        },
        addTask(){
            this.$get('/api/databaseCheck/addDataTask',{id:this.searchQuery.baseId}).then(res=>{
                if (res.success) {
                    this.$message.success(res.message)
                    this.getList()
                } else {
                    if (res.message=='请先完成数据库配置') {
                        this.$confirm('该数据库配置无效，请配置后再创建', '提示', {
                            confirmButtonText: '立即配置',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let configData={
                                databaseId:this.searchQuery.baseId,
                                databaseName:this.baseName
                            };
                            this.setingDialog=true;
                            this.$nextTick(()=>{
                                this.$refs.seting.init(configData)
                            })
                        })
                    }else{
                        this.$message.error(res.message)
                    }
                }
            })
        },
        handleTask(type){
            if (this.multipleSelection.length==0) {
                this.$message.warning('请选择任务')
                return
            }
            if (type=='删除') {
                this.delTask()
            }
            if (type=='启动'||type=='停止') {
                this.updataTaskStatus(type,this.multipleSelection,'more')
            }
        },
        delTask(data){
            if (data) {
                if (data.stuats==1) {
                    return
                }
            } else {
                let haveRunTask=false
                this.multipleSelection.forEach(item=>{
                    if (item.stuats==1) {
                        haveRunTask=true
                    }
                })
                if (haveRunTask) {
                    this.$message.warning('已启动的任务不能删除')
                    return
                }
            }
            this.$confirm('确认要删除这'+(data?'1':this.multipleSelection.length)+'个任务吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let arr=[];
                if (data) {
                    arr=[data.id]
                } else {
                    this.multipleSelection.forEach(item=>{
                        arr.push(item.id)
                    })
                }
                let obj={ids:arr};
                this.loading=true;
                this.$post('/api/databaseCheck/deleteDataTask',obj).then(res=>{
                    this.loading=false;
                    if (res.success) {
                        this.$message.success(res.message)
                        this.getList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err=>{
                    this.loading=false;
                })
            })
        },
        updataTaskStatus(type,data,handleTp){
            let idList=[];
            if (handleTp=='one') {
                // if ((type=='启动'&&data.stuats==1)||(type=='停止'&&data.stuats==2)) {
                //     return
                // }
                idList=[data.id]
            }else{
                data.forEach(item=>{
                    idList.push(item.id)
                })
            }
            this.$confirm('确认要'+type+'选中的审读任务吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params={
                    ids:idList,
                    stuats:type=='启动'?1:2,
                }
                this.loading=true;
                this.$post('/api/databaseCheck/updateDataTask',params).then(res=>{
                    this.loading=false;
                    if (res.success) {
                        this.$message.success(res.message)
                        this.getList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err=>{
                    this.loading=false;
                })
            })
        },
        handleCheckedAll(data){
            if (this.multipleSelection.length!=this.tableData.length||!data) {
                this.$refs.multipleTable.toggleAllSelection()
            }
        },
        sortChange(column){
            this.searchQuery.sort=column.prop
            this.searchQuery.order=column.order=='descending'?'DESC':'ASC'
            this.getList()
        },
        getList(){
            this.searchQuery.pageNo=1;
            this.searchQuery.pageSize=20;
            this.search()
        },
        search(){
            this.searchQuery.bigenDate=this.timeVal?this.timeVal[0]:'';
            this.searchQuery.endDate=this.timeVal?this.timeVal[1]:'';
            this.loading=true;
            this.$post('/api/databaseCheck/findList',this.searchQuery).then(res=>{
                this.loading=false;
                if (res.data.result&&res.data.result.length>0) {
                    this.tableData=res.data.result
                }else{
                    this.tableData=[];
                }
                this.curTotal=res.data.totalCount
            }).catch(err=>{
                this.tableData=[];
                this.loading=false;
            })
        },
        handleSelectionChange(val){
            this.multipleSelection=val;
        },
        handleSizeChange(val){
            this.searchQuery.pageSize=val;
            this.search()
        },
        handleCurrentChange(val){
            this.searchQuery.pageNo=val;
            this.search()
        },
    }
}
</script>
<style lang='scss' scoped>
#dataBaseRead{
    .searchDiv{
        padding:20px 30px;
        background: #fff;
        border-radius: 5px;
        .search{
            margin-top: 20px;
            .ml20{
                margin-left: 20px;
            }
        }
    }
    .cont{
        padding:15px;
        margin-top: 20px;
        background: #fff;
        border-radius: 5px;
        .btn{
            display: flex;
            justify-content: space-between;
            margin:20px 15px;
        }
        .handlebtns{
            span{
                color: #409eff;
                cursor: pointer;
                margin-left: 5px;
            }
            .gray{
                color: gray;
            }
        }
    }
}
</style>

<template>
    <div id='dataBase'>
        <div class="search">
            <span>
                <label>数据库全称：</label>
                <el-autocomplete v-model.trim="params.baseName" :fetch-suggestions="baseNameSearch" size="small" style="width:180px;" placeholder="请输入" clearable @select="baseNameSelect">
                    <template slot-scope="{ item }">
                        <div v-if="item.baseName"><div style="overflow:hidden;text-overflow:ellipsis;" :title="item.baseName">{{item.baseName}}</div></div>
                    </template>
                </el-autocomplete>
            </span>
            <span>
                <label>文种：</label>
                <el-autocomplete v-model.trim="params.recordType" :fetch-suggestions="recordTypeSearch" size="small" style="width:180px;" placeholder="请输入" clearable @select="recordTypeSelect">
                    <template slot-scope="{ item }">
                        <div v-if="item.recordType"><div style="overflow:hidden;text-overflow:ellipsis;" :title="item.recordType">{{item.recordType}}</div></div>
                    </template>
                </el-autocomplete>
            </span>
            <span>
                <label>所属学科：</label>
                <el-autocomplete v-model.trim="params.subject" :fetch-suggestions="subjectSearch" size="small" style="width:180px;" placeholder="请输入" clearable @select="subjectSelect">
                    <template slot-scope="{ item }">
                        <div v-if="item.subject"><div style="overflow:hidden;text-overflow:ellipsis;" :title="item.subject">{{item.subject}}</div></div>
                    </template>
                </el-autocomplete>
            </span>
            <span>
                <el-input v-model.trim="params.keyword" size="small" style="width:250px;" placeholder="请输入关键词进行查询" clearable></el-input>
                <el-button size="small" type="primary" @click="getList">查询</el-button>
            </span>
        </div>
        <div class="cont">
            <div class="btn">
                <div>
                    <!-- <el-checkbox v-model="checkedAll" @change="handleCheckedAll" style="margin-right:10px;">全选</el-checkbox> -->
                    <el-button size="small" type="primary" @click="addOne">单条新增</el-button>
                    <el-button size="small" type="primary" @click="batchAdd">批量新增</el-button>
                    <el-button size="small" type="primary" @click="del">删除</el-button>
                    <el-button size="small" type="primary" @click="hanldDb('修改')">修改</el-button>
                </div>
                <div>
                    <el-button size="small" type="primary" @click="hanldDb('配置')">配置</el-button>
                    <el-button size="small" type="primary" @click="hanldDb('新建任务')">新建任务</el-button>
                    <el-button size="small" type="primary" @click="hanldDb('审读历史')">审读历史</el-button>
                </div>
            </div>
            <el-table
                 v-loading='loading'
                ref="multipleTable" :data="tableData" border
                 size="medium" height="740" style="width:100%;"
                @row-dblclick='openDetail' @sort-change='sortChange'
                :row-style="rowClass"
                row-key="baseName"
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
                        <span :title="scope.row[item.prop]">{{scope.row[item.prop]?(scope.row[item.prop].length>20?scope.row[item.prop].slice(0,20)+'...':scope.row[item.prop]):''}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page" v-show="tableData.length>0">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="params.pageNo"
                    :page-sizes="[20,40,60,80,100]"
                    :page-size="params.pageSize"
                    layout="total, prev, pager, next,sizes"
                    :total="curTotal">
                </el-pagination>
            </div>
        </div>
        <!-- 数据库详情、新增弹窗 -->
        <el-dialog :title="dialogName" :visible.sync="detailDialog" width="1100px" center>
            <detail v-if="detailDialog" ref="detail" @closeDialog="closeDetail"></detail>
        </el-dialog>
        <!-- 批量上传 -->
        <el-dialog title="批量新增" :visible.sync="batchDialog" width="800px" center>
            <batchAdd ref="batchAdd" @closeDialog="closeDetail"></batchAdd>
        </el-dialog>
        <!-- 配置 -->
        <el-dialog title="数据库配置" :visible.sync="setingDialog" width="900px" center>
            <seting ref="seting"></seting>
        </el-dialog>
    </div>
</template>

<script>
import detail from './component/detail'
import batchAdd from './component/batchAdd'
import seting from './component/seting'
export default {
    data(){
      return {
        loading:false,
        checkedAll:false,
        params:{
            baseName:'',
            recordType:'',
            subject:'',
            keyword:'',
            sort:'',
            order:'',
            pageNo:1,
            pageSize:20,
        },
        curTotal:0,
        multipleSelection: [],
        detailDialog:false,
        batchDialog:false,
        setingDialog:false,
        dialogName:'',
        tableData:[],
        columnData:[
          {prop:"normativeName",label:"数据库DRAA规范名称",width:"160"},
          {prop:"baseName",label:"数据库全称",width:""},
          {prop:"trivialName",label:"别名",width:""},
          {prop:"recordType",label:"文种",width:""},
          {prop:"producerName",label:"生产商全称",width:""},
          {prop:"producerAbbreviation",label:"生产商简称",width:""},
          {prop:"baseDealer",label:"数据库商",width:""},
          {prop:"subject",label:"所属学科",width:""},
          {prop:"indicating",label:"文献揭示层次",width:""},
          {prop:"collectedType",label:"收录文献类型",width:""},
          {prop:"collectedScope",label:"收录范围",width:""},
          {prop:"updateFrequency",label:"更新频率",width:""},
          {prop:"sCICondition",label:"Sci收录情况",width:""},
          {prop:"comment",label:"同行评议",width:""},
          {prop:"openURl",label:"openURL接口",width:""},
          {prop:"total",label:"内容总量",width:"110",sortable:'custom'},
        ],
        curConfig:null,
      }
    },
    components:{
        detail,batchAdd,seting
    },
    created(){
        this.getList()
    },
    methods: {
        //  选中行高亮
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
        hanldDb(type){
            if (this.multipleSelection.length==0) {
                this.$message.warning('请选择任务');
                return
            }
            if (this.multipleSelection.length>1) {
                this.$message.warning('仅支持单个任务操作')
                return
            }
            if (type=='修改') {
                this.edit()
            }
            if (type=='配置') {
                this.seting()
            }
            if (type=='审读历史') {
                this.readHistory()
            }
            if (type=='新建任务') {
                this.addTask()
            }
        },
        edit(){
            this.dialogName='数据库编辑'
            this.detailDialog=true;
            this.$nextTick(()=>{
                this.$refs.detail.init('edit',this.multipleSelection[0])
            })
        },
        closeDetail(){
            this.checkedAll=false;
            this.detailDialog=false;
            this.batchDialog=false;
            this.search()
        },
        // 获取全称联想
        baseNameSearch(queryString, cb) {
            if (queryString.trim().length<1) {
                cb([])
                return
            }
            let params={
                baseName:this.params.baseName,
                pageNo:1,
                pageSize:10
            };
            this.getQueryList(params,cb,'baseName')
        },
        // 获取文种联想
        recordTypeSearch(queryString, cb) {
            if (queryString.trim().length<1) {
                cb([])
                return
            }
            let params={
                recordType:this.params.recordType,
                pageNo:1,
                pageSize:10
            };
            this.getQueryList(params,cb,'recordType')
        },
        // 获取学科联想
        subjectSearch(queryString, cb) {
            if (queryString.trim().length<1) {
                cb([])
                return
            }
            let params={
                subject:this.params.subject,
                pageNo:1,
                pageSize:10
            };
            this.getQueryList(params,cb,'subject')
        },
        getQueryList(params,cb,type){
            this.$post('/api/dataBaseManage/findlist',params).then(res=>{
                if (res.data.result&&res.data.result.length>0) {
                    var restaurants = res.data.result;
                    cb(restaurants);
                }else{
                    if (type=='baseName') {
                        cb([{baseName:'无搜索匹配项'}])
                    } else if (type=='recordType'){
                        cb([{recordType:'无搜索匹配项'}])
                    } else if (type=='subject'){
                        cb([{subject:'无搜索匹配项'}])
                    }
                }
            }).catch(()=>{
                cb()
            })
        },
        //选取联想值
        baseNameSelect(item) {
            if (item.baseName) {
                this.params.baseName=item.baseName
            }
        },
        recordTypeSelect(item) {
            if (item.recordType) {
                this.params.recordType=item.recordType
            }
        },
        subjectSelect(item) {
            if (item.subject) {
                this.params.subject=item.subject
            }
        },
        openDetail(data){
            this.dialogName='数据库详情'
            this.detailDialog=true;
            this.$nextTick(()=>{
                this.$refs.detail.init('detail',data)
            })
        },
        getList(){
            this.checkedAll=false;
            this.params.pageNo=1;
            this.params.pageSize=20;
            this.search()
        },
        search(){
            this.loading=true;
            this.$post('/api/dataBaseManage/findlist',this.params).then(res=>{
                this.loading=false;
                if (res.data.result&&res.data.result.length>0) {
                    this.tableData=res.data.result
                }else{
                    this.tableData=[]
                }
                this.curTotal=res.data.totalCount
            }).catch(err=>{
                this.tableData=[]
                this.loading=false;
            })
            
        },
        sortChange(column){
            this.params.sort=column.prop
            this.params.order=column.order=='descending'?'DESC':'ASC'
            this.getList()
        },
        handleCheckedAll(data){
            if (this.multipleSelection.length!=this.tableData.length||!data) {
                this.$refs.multipleTable.toggleAllSelection()
            }
        },
        addOne(){
            this.dialogName='新增数据库'
            this.detailDialog=true;
            this.$nextTick(()=>{
                this.$refs.detail.init('edit')
            })
        },
        batchAdd(){
            this.batchDialog=true;
            this.$nextTick(()=>{
                this.$refs.batchAdd.init()
            })
        },
        del(){
            if (this.multipleSelection.length==0) {
                this.$message.warning('请选择任务');
                return
            }
            this.$confirm('确认要删除这'+this.multipleSelection.length+'个数据库吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let idList=[];
                this.multipleSelection.forEach(item=>{
                    idList.push(item.id)
                })
                this.$post('/api/dataBaseManage/deleteById',{ids:idList}).then(res=>{
                    if (res.success) {
                        this.$message.success(res.message)
                        this.search()
                    }else{
                        this.$message.error(res.message);
                    }
                })
            })
        },
        seting(){
            let configData={
                databaseId:this.multipleSelection[0].id,
                databaseName:this.multipleSelection[0].baseName
            };
            this.setingDialog=true;
            this.$nextTick(()=>{
                this.$refs.seting.init(configData)
            })
        },
        addTask(){
            this.$get('/api/databaseCheck/addDataTask',{id:this.multipleSelection[0].id}).then(res=>{
                if (res.success) {
                    this.$message.success(res.message)
                } else {
                    if (res.message=='请先完成数据库配置') {
                        this.$confirm('该数据库配置无效，请配置后再创建', '提示', {
                            confirmButtonText: '立即配置',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.setingDialog=true;
                            let configData={
                                databaseId:this.multipleSelection[0].id,
                                databaseName:this.multipleSelection[0].baseName
                            };
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
        readHistory(){
            let router = this.$router.resolve({path:'/dataBaseRead',query:{id:this.multipleSelection[0].id,name:this.multipleSelection[0].baseName}})
            window.open(router.href, '_blank');
        },
        handleSelectionChange(val){
            this.multipleSelection=val;
        },
        handleSizeChange(val){
            this.params.pageSize=val;
            this.search()
        },
        handleCurrentChange(val){
            this.params.pageNo=val;
            this.search()
        },
    }
}
</script>
<style lang='scss' scoped>
#dataBase{
    .search{
        padding:20px ;
        background: #fff;
        border-radius: 5px;
        font-size: 14px;
        span{
            margin-right: 20px;
        }
    }
    .cont{
        padding:20px;
        background: #fff;
        border-radius: 5px;
        margin-top: 20px;
        .btn{
            display: flex;
            justify-content: space-between;
            margin:20px 15px;
        }
        .page{
            margin-top: 10px;
        }
    }
}
</style>

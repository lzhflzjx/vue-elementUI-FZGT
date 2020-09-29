<template>
    <div id='taskManage'>
        <filterPage :modelName="'自动分配任务管理'" @sendSearchData='getData'></filterPage>
        <div class="btnCont">
            <el-button @click="openRulePage('新建规则')" size="small" type="primary">新建规则</el-button>
            <el-button @click="openRulePage('修改规则')" size="small" type="primary">修改规则</el-button>
            <el-button @click="delRule" size="small" type="primary">删除规则</el-button>
            <el-button @click="openRulePage('批量修改')" size="small" type="primary">批量修改</el-button>
            <el-button size="small" type="primary">导出</el-button>
            <span @click="openPublishing">出版社维护</span>
        </div>
        <el-table
            v-loading='loading'
            ref="multipleTable"
            :data="tableData"
            stripe border
            height="740"
            style="width:100%;"
            :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="45">
            </el-table-column>
            <el-table-column
                prop="ruleName"
                label="规则名称">
            </el-table-column>
            <el-table-column
                prop="ruleType"
                label="规则类型">
                <template slot-scope="scope">{{ruleTypeOption[scope.row.ruleType]}}</template>
            </el-table-column>
            <el-table-column
                label="优先级">
                <template slot-scope="scope">{{methods.changeDict(reviewLevel,scope.row.priority)}}</template>
            </el-table-column>
            <el-table-column
                prop="readerName"
                label="审读人">
            </el-table-column>
            <el-table-column
                prop="creater"
                label="创建人员">
            </el-table-column>
            <el-table-column
                prop="create_date"
                width="160"
                label="创建时间">
            </el-table-column>
            <el-table-column
                prop="update_date"
                width="160"
                label="最后修改时间">
            </el-table-column>
        </el-table>
        <el-pagination
            v-if="tableData.length>0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20,40,60,80,100]"
            :page-size="curPageSize"
            layout="total, prev, pager, next,sizes"
            style="margin-top:10px;"
            :total="curTotal">
        </el-pagination>

        <el-dialog :title="pageName" :visible.sync="ruleDialog" width="1000px">
            <rule ref="rule" :ruleData='ruleData' :pageName='pageName' @closeRule='closeRulePage'></rule>
        </el-dialog>
    </div>
</template>

<script>
import filterPage from '@/components/filter/filterPage'
import rule from './createAndUpdata'
import {mapGetters,mapActions} from 'vuex'
export default {
    data(){
      return {
            ruleTypeOption:['机审任务分配','ERP订单任务'],
            priorityOption:['低','中','高'],
            tableData:[],
            multipleSelection:[],
            ruleData:[],
            currentPage:1,
            curPageSize:20,
            curTotal:0,
            searchParams:{},
            loading:false,
            ruleDialog:false,
            pageName:'',
      }
    },
    components:{
        filterPage,
        rule
    },
    computed:{
        ...mapGetters(['reviewLevel']),
    },
    created(){
        this.getReaderList('book')
    },
    methods: {
        ...mapActions(['getReaderList']),
        openPublishing(){
            localStorage.setItem('curMenuIndex','5')
            let router = this.$router.resolve({path:'/publishing'})
            window.open(router.href, '_blank');
        },
        closeRulePage(){
            this.ruleDialog=false;
            this.search();
        },
        openRulePage(name){
            if (name!='新建规则') {
                if (this.multipleSelection.length==0) {
                    this.$message.warning('请至少选择一条规则')
                    return
                }
                if (name=='修改规则') {
                    if (this.multipleSelection.length>1) {
                        this.$message.warning('多条规则请选择批量修改操作')
                        return
                    }
                    this.ruleData= this.multipleSelection[0]
                }
                if (name=='批量修改') {
                    let ids=[]
                    this.multipleSelection.forEach(item=>{
                        ids.push(item.id)
                    })
                    this.ruleData= ids.join(',') 
                }
            }
            this.pageName=name;
            this.ruleDialog=true;
            this.$nextTick(()=>{
                this.$refs.rule.init()
            })
        },
        delRule(){
            if (this.multipleSelection.length==0) {
                this.$message.warning('请至少选择一条规则')
                return
            }
            this.$confirm('确定删除该规则?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let arr=[]
                this.multipleSelection.forEach(item=>{
                    arr.push({id:item.id})
                })
                this.$get('/api/rule/delRules',{ids:JSON.stringify(arr)}).then(res=>{
                    if (res.success) {
                        this.$message.success('删除成功')
                        this.search()
                    } else {
                        this.$message.error('删除失败')
                    }
                })
            })
        },
        getData(obj){
            this.currentPage=1;
            this.curPageSize=20;
            this.searchParams=obj;
            this.search();
        },
        search(){
            this.searchParams.pageNo=this.currentPage;
            this.searchParams.pageSize=this.curPageSize;
            this.loading=true;
            this.$post('/api/rule/list',this.searchParams).then(res=>{
                this.loading=false;
                if (res.data.result&&res.data.result.length>0) {
                    this.tableData=res.data.result;
                }else{
                    this.tableData=[];
                }
                this.curTotal=res.data.totalCount
            }).catch(err=>{
                this.tableData=[];
                this.loading=false;
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            this.currentPage = 1
            this.curPageSize=val;
            this.search();
        },
        handleCurrentChange(val) {
            this.currentPage=val;
            this.search();
        }
    }
}
</script>
<style lang='scss' scoped>
#taskManage{
    padding:15px;
    background: #fff;
    min-height:100%;
    border-radius: 5px;
    font-size:14px;
    .btnCont{
        margin:10px 0;
        span{
            color: #409eff;
            cursor: pointer;
            float:right;
            margin-right: 10px;
            font-weight: bold;
        }
    }
}
</style>

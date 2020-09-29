<template>
    <div id='dictManage' v-loading='loading'>
        <div class="searchCont">
            <el-input size='medium' placeholder="请输入名称/code" v-model="searchVal" @keyup.enter.native="search" style="width:300px;"></el-input>
            <el-button size='medium' type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <div class="btns">
            <el-button size="small" type="primary" @click="addDict">添加</el-button>
            <el-button size="small" type="primary" @click="handleDict('edit')">修改</el-button>
            <el-button size="small" type="primary" @click="handleDict('del')">删除</el-button>
        </div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            size="medium"
            stripe border
            height="661"
            style="width: 100%"
            @row-dblclick='openDetail'
            @row-click='clickRow'
            :header-cell-style="{background: '#d5eaf6',color:'#727878'}">
            <el-table-column width="55">
                <template slot-scope="scope">
                    <el-radio v-model="curChecked" :label="scope.row"></el-radio>
                </template>
            </el-table-column>
            <el-table-column
            prop="id"
            align="center"
            width="80"
            label="ID">
            </el-table-column>
            <el-table-column
            prop="name"
            label="名称">
            </el-table-column>
            <el-table-column
            prop="code"
            label="code">
            </el-table-column>
        </el-table>
        <!-- <div class="page" v-show="tableData.length>0">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20,40,60,80,100]"
            :page-size="curPageSize"
            layout="total, prev, pager, next,sizes"
            :total="curTotal">
            </el-pagination>
        </div> -->
        <el-dialog :title="dialogTit" :visible.sync="dialogVisible" width="700px">
            <div class="dialogCont">
                <div class="head">
                    <label>字典名称</label>
                    <el-input size="small" v-model="dictData.dictionary.name"></el-input>
                    <label>code</label>
                    <el-input size="small" v-model="dictData.dictionary.code"></el-input>
                    <el-button size="mini" type="primary" plain @click="addAttr" v-if="dialogTit!='字典详情'">增加</el-button>
                </div>
                <div class="arrtCont">
                    <div v-for="(item,index) in dictData.dictionaryInfoList" class="list">
                        <label>名称</label>
                        <el-input size="small" v-model="item.name"></el-input>
                        <label>值</label>
                        <el-input size="small" v-model="item.value"></el-input>
                        <el-button size="mini" type="danger" plain @click="delAttr(item,index)" v-if="dialogTit!='字典详情'">删除</el-button>
                    </div>
                </div>
            </div>
            <div class="dialogBtns" v-if="dialogTit!='字典详情'">
                <el-button size="medium" @click="dialogVisible=false">取消</el-button>
                <el-button size="medium" type="primary" :loading="saveLoading" @click="save">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loading:false,
            saveLoading:false,
            searchVal:'',
            tableData:[],
            dictData:{
                dictionary:{name:'',code:''},
                dictionaryInfoList:[{name:'',value:''}]
            },
            curPageSize:20,
            currentPage:1,
            curTotal:0,
            dialogVisible:false,
            dialogTit:'',
            curChecked:''
        }
    },
    created(){
        this.search()
    },
    methods: {
        clickRow(data){
            this.curChecked=data
        },
        openDetail(data){
            this.dialogTit='字典详情'
            this.getDictDetail(data.id)
        },
        addAttr(){
           let obj={name:'',value:''};
           if (this.dialogTit=='修改字典') {
               obj.dicId=this.curChecked.id
           }
           this.dictData.dictionaryInfoList.push(obj)
        },
        delAttr(item,index){
            if (item.id) {
                this.$get('/api/dic/deleteByInfoId',{id:item.id}).then(res=>{
                    if (res.success) {
                        this.$message.success(res.message)
                        this.dictData.dictionaryInfoList.splice(index,1)
                    }else{
                        this.$message.error(res.message)
                    }
                })
            } else {
                this.dictData.dictionaryInfoList.splice(index,1)
            }
        },
        save(){
            var attrLack=false
            this.dictData.dictionaryInfoList.forEach(item=>{
                if (item.name===''||item.value==='') {
                    attrLack=true
                }
            })
            if (this.dictData.dictionary.name===''||this.dictData.dictionary.code===''||attrLack) {
                this.$message.warning('请完善字典信息')
                return
            }
            var isExist=false
            this.tableData.forEach(item=>{
                if ((this.dictData.dictionary.code==item.code)&&(this.dictData.dictionary.id!=item.id)) {
                    isExist=true
                }
            })
            if (isExist) {
                this.$message.warning('code值已存在')
                return
            } 
            this.saveLoading=true
            this.$post('/api/dic/saveOrUpdate',this.dictData).then(res=>{
                this.saveLoading=false
                if (res.success) {
                    this.$message.success(res.message)
                    this.dialogVisible=false
                    this.search()
                } else {
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.saveLoading=false
            })
        },
        search(){
            this.tableData=[]
            this.currentPage=1
            this.curPageSize=20
            this.getDictList()
        },
        getDictList(){
            this.curChecked=''
            this.loading=true
            let params={
                code:this.searchVal,
                // pageNo:this.currentPage,
                // pageSize:this.curPageSize,
            }
            this.$post('/api/dic/list',params).then(res=>{
                this.loading=false
                if (res.result&&res.result.length>0) {
                    this.tableData=res.result
                }
                this.curTotal=res.totalCount
            }).catch(err=>{
                this.loading=false
            })
        },
        addDict(){
            this.dictData={
                dictionary:{name:'',code:''},
                dictionaryInfoList:[{name:'',value:''}]
            }
            this.dialogTit='添加字典'
            this.dialogVisible=true
        },
        handleDict(type){
            if (this.curChecked==='') {
                this.$message.warning('请选择需要操作的字典')
                return
            }
            if (type=='edit') {
                this.dialogTit='修改字典'
                this.getDictDetail(this.curChecked.id)
            }else{
                this.$confirm('确认删除字典 '+this.curChecked.name+'?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
                    this.loading=true
                    this.$get('/api/dic/delete',{id:this.curChecked.id}).then(res=>{
                        this.loading=false
                        if (res.success) {
                            this.search()
                            this.$message.success(res.message)
                        } else {
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.loading=false
                    })
                })
            }
        },
        getDictDetail(dictId){
            this.loading=true
            this.$get('/api/dic/selectById',{id:dictId}).then(res=>{
                this.loading=false
                if (res.data) {
                    this.dictData=res.data
                    this.dialogVisible=true
                }
            }).catch(err=>{
                this.loading=false
            })
        },
        handleSizeChange(val) {
            this.curPageSize=val;
            this.getDictList()
        },
        handleCurrentChange(val) {
            this.currentPage=val;
            this.getDictList()
        }
    }
}
</script>
<style lang='scss' scoped>
#dictManage{
    padding:0 15px;
    background: #fff;
    min-height:100%;
    border-radius: 5px;
    .searchCont{
        padding-top: 20px;
    }
    .btns{
        margin: 20px 0;
        .el-button{
            width:70px;
        }
    }
    /deep/ .el-table{
        td,th{
            text-align:left !important;
        }
    } 
    .el-radio{
        /deep/ .el-radio__label{
            display:none;
        }
    }
    .page{
        margin-top: 20px;
    }
    .dialogCont{
        .el-input{
            width: 150px;
        }
        label{
            padding: 0 20px;
        }
        .el-button{
            margin-left:20px;
        }
        .head{
            padding-bottom:20px;
            border-bottom: dashed 1px #e3e3e3;
        }
        .arrtCont{
            padding-top:20px;
            .list{
                margin-bottom: 10px;
            }
        }
    }
    .dialogBtns{
        text-align: center;
        margin-top:100px;
    }
}
</style>

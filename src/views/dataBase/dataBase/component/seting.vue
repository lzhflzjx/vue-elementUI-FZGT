<template>
    <div id='seting'>
        <div class="hisBtn"><span @click="openHisSeting">历史配置</span></div>
        <div class="cont">
            <div class="item">
                <label class="label">数据库全称：</label>
                <el-input size="small" placeholder="请输入" disabled v-model="configData.databaseName" clearable></el-input>
            </div>
            <div class="item">
                <label class="label">数据库网址：</label>
                <el-input size="small" placeholder="请输入" v-model="configData.databaseUrl" clearable></el-input>
            </div>
            <div class="item">
                <label class="label">账号：</label>
                <el-input size="small" placeholder="请输入" v-model="configData.databaseUserName" clearable></el-input>
            </div>
            <div class="item">
                <label class="label">密码：</label>
                <el-input size="small" placeholder="请输入" v-model="configData.databasePwd" clearable></el-input>
            </div>
            <div class="item">
                <label class="label">关键词：</label>
                <div class="kwDiv">
                    <el-radio-group v-model="configData.keyWordType" @change="changeType">
                        <el-radio :label="2">手动输入</el-radio>
                        <el-radio :label="3">批量导入</el-radio>
                        <el-radio :label="1">选择类别</el-radio>
                    </el-radio-group>
                    <div class="kwCont">
                        <el-tree
                            v-if="configData.keyWordType==1"
                            style="display:inline-block;" 
                            ref="tree" 
                            :data="wordTree" 
                            :props="defaultProps"
                            show-checkbox
                            @check-change="handleCheck"
                            node-key="id">
                        </el-tree>
                        <el-input v-if="configData.keyWordType==2" type="textarea" placeholder="关键词以空格分隔，该处不支持逻辑运算符的关键词" :autosize="{ minRows: 4, maxRows: 6}"  v-model="textareaVal" @keyup.native="spaceEvent"></el-input>
                        <el-upload
                            v-if="configData.keyWordType==3"
                            class="upload-demo"
                            drag :limit='1' :before-remove='removeFile'
                            action="" 
                            :before-upload="beforeUpload"
                            :http-request="request"
                            :on-change='changeFile'>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传Excel文件，Excel文件格式要求每行录入一个关键词</div>
                        </el-upload>
                    </div>
                </div>
            </div>
            <div class="item" v-if="configData.keyWordType!=3">
                <label class="label">已配置的关键词：</label>
                <div class="keywordDiv">{{configData.keyWordType==2?configData.databaseKeyWord:groupWords}}</div>
            </div>
        </div>
        <div class="btns">
            <el-button size="medium" @click="initData()">清空</el-button>
            <el-button size="medium" type="primary" :loading="savaLoading" @click="saveConfig">预览结果</el-button>
        </div>

        <!-- 配置 -->
        <el-dialog title="历史配置" append-to-body :visible.sync="hisDialog" width="1300px">
            <div id="hisSet" v-loading="hisLoading">
                <div class="topTxt">该结果默认按时间顺序倒序展示</div>
                <el-table
                    ref="multipleTable" :data="tableData"
                    stripe size="medium" height="600" style="width:100%;"
                    :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
                    @sort-change='sortChange'>
                    <el-table-column type="index" label="序号" width="50">
                        <template slot-scope="scope">{{scope.$index+1+(currentPage-1)*curPageSize}}</template>
                    </el-table-column>
                    <el-table-column
                        v-for="item in columnData"
                        :key="item.prop"
                        :width="item.width"
                        :label="item.label"
                        :prop="item.prop"
                        :sortable='item.sortable'>
                        <template slot-scope="scope">
                            <span v-if="item.label=='关键词'">
                                <span v-if="scope.row.keyWordType==3" style="color:#409eff;cursor:pointer;" @click="downloadKeyword(scope.row)">关键词文件</span>
                                <span v-if="scope.row.keyWordType!=3">{{scope.row[item.prop]}}</span>
                            </span>
                            <span v-else-if="item.label=='分析报告'" style="color:#409eff;cursor:pointer;" @click="downloadReport(scope.row)">下载报告</span>
                            <span v-else-if="item.label=='操作'">
                                <el-switch v-model="scope.row.status" @change="updataStatus(scope.row)"></el-switch>
                            </span>
                            <span v-else>{{scope.row[item.prop]}}</span>
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
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data(){
        return {
            configData:{
                databaseName:'',
                databaseUrl:'',
                databaseUserName:'',
                databasePwd:'',
                keyWordType:2,
                databaseKeyWord:'',
                file:''
            },
            textareaVal:'',
            wordTree:[],
            defaultProps:{
                children: 'childList',
                label: 'sortName'
            },
            hisDialog:false,
            currentPage:1,
            curPageSize:20,
            curTotal:0,
            tableData:[],
            columnData:[
                {prop:"databaseKeyWord",label:"关键词",width:"400"},
                {prop:"resultNumber",label:"结果数量",width:"110",sortable:'custom'},
                {prop:"maxResultNumber",label:"最大结果数量(单个关键词)",width:"230",sortable:'custom'},
                {label:"分析报告",width:""},
                {prop:"creator",label:"配置人",width:""},
                {prop:"createTime",label:"配置时间",width:"170",sortable:'custom'},
                {label:"操作",width:""},
            ],
            hisLoading:false,
            savaLoading:false,
            orderVal:'0',
            groupWords:'',
            treeData:{},
        }
    },
    methods: {
        beforeUpload(file) {
            if (file.name.split('.')[1]!='xlsx'&&file.name.split('.')[1]!='xls') {
                this.$message.error('只能上传Excel文件!');
                return false;
            }
        },
        removeFile(){
            this.configData.file='';
        },
        // 文件上传空请求
        request(){},
        changeFile(data){
            this.configData.file=data.raw;
        },
        sortChange(data){
            if (data.prop=='createTime') {
                if (data.order=="descending") {
                    this.orderVal='0'
                } else {
                    this.orderVal='1'
                }
            }
            if (data.prop=='resultNumber') {
                if (data.order=="descending") {
                    this.orderVal='3'
                } else {
                    this.orderVal='2'
                }
            }
            if (data.prop=='maxResultNumber') {
                if (data.order=="descending") {
                    this.orderVal='5'
                } else {
                    this.orderVal='4'
                }
            }
            this.currentPage=1;
            this.curPageSize=20;
            this.getHisData()
        },
        updataStatus(item){
            let params={
                id:item.id,
                status:item.status?1:0
            }
            this.hisLoading=true;
            this.$post('/api/databaseConfig/updateById',params).then(res=>{
                this.hisLoading=false
                this.getHisData()
                if (res.success) {
                    this.$message.success(res.message)
                }else{
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.hisLoading=false
            })
        },
        downloadKeyword(item){
            axios.get('br/api/dataBaseManage/importTemplate?type=2&id='+item.id,{responseType:'blob'}).then(res=>{
                let url = window.URL.createObjectURL(new Blob([res.data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', '关键词文件'+new Date().getTime()+'.xls')
                document.body.appendChild(link)
                link.click()
            })
        },
        downloadReport(item){
            axios.get('br/api/dataBaseManage/importTemplate?type=1&id='+item.id,{responseType:'blob'}).then(res=>{
                let url = window.URL.createObjectURL(new Blob([res.data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', '报告'+new Date().getTime()+'.xls')
                document.body.appendChild(link)
                link.click()
            })
        },
        changeType(){
            this.textareaVal='';
            this.configData.databaseKeyWord='';
            this.configData.file='';
        },
        spaceEvent(){
            this.configData.databaseKeyWord=this.textareaVal.split(' ').join(';')
        },
        handleCheck(){
            let checkPer=this.$refs.tree.getCheckedNodes();
            let checkedArr=[];
            let checkedIds=[];
            console.log(checkPer)
            checkPer.forEach(item => {
                if (item.childList) {
                    checkedArr.push(item.sortName)
                    checkedIds.push(item.id)
                }
            })
            this.groupWords=checkedArr.join(';')
            this.configData.databaseKeyWord=checkedIds.join(';')
        },
        saveConfig(){
            if (!this.configData.databaseUrl) {
                this.$message.warning('数据库网址不能为空')
                return
            }
            if (!this.configData.databaseUserName) {
                this.$message.warning('账号不能为空')
                return
            }
            if (!this.configData.databasePwd) {
                this.$message.warning('密码不能为空')
                return
            }
            if (this.configData.keyWordType==3) {
                if (!this.configData.file) {
                    this.$message.warning('请上传文件')
                    return
                }
            }else{
                if (!this.configData.databaseKeyWord) {
                    this.$message.warning('关键词不能为空')
                    return
                }
            }
            let formData = new FormData();
            formData.append('databaseId',this.configData.databaseId)
            formData.append('databaseName',this.configData.databaseName)
            formData.append('databaseUrl',this.configData.databaseUrl)
            formData.append('databaseUserName',this.configData.databaseUserName)
            formData.append('databasePwd',this.configData.databasePwd)
            formData.append('keyWordType',this.configData.keyWordType)
            if (this.configData.keyWordType==3) {
                formData.append('file',this.configData.file)
            }else{
                formData.append('databaseKeyWord',this.configData.databaseKeyWord)
            }
            this.savaLoading=true
            this.$post('/api/databaseConfig/insertDatabaseConfig',formData).then(res=>{
                this.savaLoading=false
                this.openHisSeting()
            }).catch(err=>{
                this.savaLoading=false
            })
        },
        init(data){
            this.initData()
            this.configData.databaseName=data.databaseName
            this.configData.databaseId=data.databaseId
        },
        initData(){
            this.configData.databaseUrl=''
            this.configData.databaseUserName=''
            this.configData.databasePwd=''
            this.configData.keyWordType=2
            this.configData.databaseKeyWord=''
            this.configData.file=''
            this.textareaVal='';
            this.getTree()
        },
        getTree(){
            this.treeData={};
            this.wordTree=[];
            this.$post('/api/databaseConfig/querySortWordList',).then(res=>{
                if (res.data&&res.data.length>0) {
                    this.wordTree=res.data;
                    this.wordTree.forEach(item=>{
                        this.treeData[item.id]=item.sortName
                    })
                }
            })
        },
        openHisSeting(){
            this.hisDialog=true;
            this.orderVal='0';
            this.currentPage=1;
            this.curPageSize=20;
            this.getHisData()
        },
        getHisData(){
            let params={
                databaseId:this.configData.databaseId,
                orderBy:this.orderVal,
                pageNo:this.currentPage,
                pageSize:this.curPageSize,
            }
            this.hisLoading=true;
            this.$post('/api/databaseConfig/queryList',params).then(res=>{
                this.hisLoading=false;
                if (res.data.result&&res.data.result.length>0) {
                    res.data.result.forEach(item=>{
                        item.status=item.status==1?true:false
                    })
                    this.tableData=res.data.result
                }else{
                    this.tableData=[];
                }
                this.curTotal=res.data.totalCount
            }).catch(err=>{
                this.tableData=[];
                this.loadhisLoadinging=false;
            })
        },
        handleSizeChange(val){
            this.curPageSize=val;
            this.getHisData()
        },
        handleCurrentChange(val){
            this.currentPage=val
            this.getHisData()
        },
    }
}
</script>
<style lang='scss' scoped>
#seting{
    .hisBtn{
        text-align: right;
        span{
            cursor: pointer;
            color:#409eff;
        }
    }
    .cont{
        padding-left: 150px;
        .item{
            margin-bottom: 15px;
        }
        .label{
            display: inline-block;
            width:120px;
            text-align: right;
            vertical-align: top;
        }
        .el-input{
            width:390px;
            margin-left: 13px;
        }
        .kwDiv{
            display: inline-block;
            width:400px;
            padding-left: 10px;
            .kwCont{
                margin-top: 10px;
            }
        }
        .keywordDiv{
            display: inline-block;
            width:400px;
        }
    }
    .btns{
        text-align: center;
        margin-top: 50px;
    }
}
.topTxt{
    color:#c3c3c3;
    margin-bottom:10px;
}
</style>

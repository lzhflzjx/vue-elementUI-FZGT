<template>
    <div id='addTask' v-loading='loading'>
        <div v-if="readOnlyMode" class="editDiv">
            <el-button size="small" type="primary" @click="edit">编辑</el-button>
        </div>
        <div class="info">
            <div class="tit"><b>基本信息</b><span v-if="!readOnlyMode" class="red">*为必填项</span></div>
            <el-row>
                <el-col :span="12">
                    <label><span v-if="!readOnlyMode" class="red">*</span>刊号：</label>
                    <span v-if="readOnlyMode" v-text="taskData.paperCode"></span>
                    <el-input v-if="!readOnlyMode" :disabled="modelType=='详情'" size="small" v-model="taskData.paperCode" @blur="getVolumeOptions"></el-input>
                </el-col>
                <el-col :span="12">
                    <label>刊名：</label>
                    <span v-if="readOnlyMode" v-text="taskData.paperName"></span>
                    <el-input v-if="!readOnlyMode" size="small" v-model="taskData.paperName"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <label>ISSN：</label>
                    <span v-if="readOnlyMode" v-text="taskData.issn"></span>
                    <el-input v-if="!readOnlyMode" size="small" v-model="taskData.issn"></el-input>
                </el-col>
                <el-col :span="12">
                    <label>中文译名：</label>
                    <span v-if="readOnlyMode" v-text="taskData.chinaName"></span>
                    <el-input v-if="!readOnlyMode" size="small" v-model="taskData.chinaName"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <label><span v-if="!readOnlyMode" class="red">*</span>卷期描述：</label>
                    <span v-if="readOnlyMode" v-text="taskData.volumeDescription"></span>
                    <el-select v-if="!readOnlyMode" :disabled="modelType=='详情'" size="small" v-model="taskData.volumeDescription" @change="changeVolumeDescription">
                        <el-option v-for="item in volumeOptions" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="12">
                    <label>封面日期：</label>
                    <span v-if="readOnlyMode" v-text="taskData.coverDate"></span>
                    <el-date-picker
                        v-if="!readOnlyMode"
                        @change="changeCoverDate"
                        v-model="coverDate"
                        style="width: 300px;"
                        type="daterange" size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <label>出版署类别：</label>
                    <span v-if="readOnlyMode" v-text="taskData.publishingDepartmentType"></span>
                    <el-input v-if="!readOnlyMode" size="small" v-model="taskData.publishingDepartmentType"></el-input>
                </el-col>
                <el-col :span="12">
                    <label>份数：</label>
                    <span v-if="readOnlyMode" v-text="taskData.copiesNumber"></span>
                    <el-input v-if="!readOnlyMode" size="small" v-model="taskData.copiesNumber"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <label>出版地：</label>
                    <span v-if="readOnlyMode" v-text="taskData.publicationPlace"></span>
                    <el-input v-if="!readOnlyMode" size="small" v-model="taskData.publicationPlace"></el-input>
                </el-col>
            </el-row>
        </div>
        <div class="readIdea">
            <div class="tit"><b>审读意见</b><span v-if="!readOnlyMode" class="red">*为必填项</span></div>
            <el-row>
                <el-col :span="3">
                    <label class="label"><span v-if="!readOnlyMode" class="red">*</span>名单：</label>
                </el-col>
                <el-col :span="21">
                    <div v-if="readOnlyMode" v-text="methods.changeDict(paperReview,taskData.nameList)"></div>
                    <el-radio-group v-if="!readOnlyMode" v-model="taskData.nameList">
                        <el-radio v-for="item in paperReview" :key="item.id" :label="item.value">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <label class="label">问题类型：</label>
                </el-col>
                <el-col :span="21">
                    <div v-if="readOnlyMode" v-text="methods.changeDict(paperProblemType,taskData.questionType)"></div>
                    <el-checkbox-group v-if="!readOnlyMode" v-model="typeCheckList" @change="changeQuestionType">
                        <el-checkbox v-for="item in paperProblemType" :key="item.id" :label="item.value">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <label class="label">有问题的版面：</label>
                </el-col>
                <el-col :span="21">
                    <div v-if="readOnlyMode" v-text="taskData.errorPage"></div>
                    <el-input v-if="!readOnlyMode" size="small" style="width:500px;" v-model="taskData.errorPage"></el-input>
                </el-col>
            </el-row>
            <el-row style="line-height:32px;">
                <el-col :span="3">
                    <label class="label">文字报导：</label>
                </el-col>
                <el-col :span="21">
                    <span v-if="readOnlyMode&&taskData.textReport">
                        <span v-text="taskData.textReport"></span> 篇
                    </span>
                    <span v-if="!readOnlyMode">
                        <el-input size="small" style="width:100px;" v-model="taskData.textReport" @keyup.native="taskData.textReport=taskData.textReport.replace(/[^\d]/g,'')"></el-input> 篇
                    </span>
                    <label class="label">新闻图片：</label>
                    <span v-if="readOnlyMode&&taskData.newsImage">
                        <span v-text="taskData.newsImage"></span> 幅
                    </span>
                    <span v-if="!readOnlyMode">
                        <el-input size="small" style="width:100px;" v-model="taskData.newsImage" @keyup.native="taskData.newsImage=taskData.newsImage.replace(/[^\d]/g,'')"></el-input> 幅
                    </span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <label class="label">拍照上传：</label>
                </el-col>
                <el-col :span="21">
                    <div class="imgList" v-if="readOnlyMode">
                        <img v-for="file in taskData.fileList" :src="file.url" @click="handlePictureCardPreview(file)">
                    </div>
                    <el-upload
                        v-if="!readOnlyMode"
                        ref="imgUpload"
                        action=""
                        :http-request='httprequest'
                        :class="{hide:readOnlyMode}"
                        :file-list="taskData.fileList"
                        multiple :limit='100'
                        list-type="picture-card"
                        :on-change="imgChange"
                        :on-exceed="exceed"
                        accept=".jpg,.jpeg,.png"
                        :before-upload='beforeupload'
                        :on-preview="handlePictureCardPreview"
                        :before-remove='beforeRemove'
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog append-to-body :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <label class="label">文章内容：</label>
                </el-col>
                <el-col :span="21">
                    <el-table ref="multipleTable" :data="opinionList" stripe border size="small">
                        <el-table-column type="index" label="序号"width="50"></el-table-column>
                        <el-table-column
                            v-for="item in articleColumn"
                            :key="item.prop"
                            :width="item.width"
                            :label="item.label">
                            <template slot-scope="scope">
                                <span v-if="item.label!='问题内容'">
                                    <div v-if="readOnlyMode" v-text="scope.row[item.prop]"></div>
                                    <el-input v-if="!readOnlyMode" size="small" v-model="scope.row[item.prop]"></el-input>
                                </span>
                                <span v-else>
                                    <div style="max-height: 110px;overflow-y: auto;" v-if="readOnlyMode" v-text="scope.row[item.prop]"></div>
                                    <el-input v-if="!readOnlyMode" type="textarea" v-model="scope.row[item.prop]" :autosize="{ minRows: 3,maxRows: 3}" maxlength="1000"></el-input>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <span v-if="!readOnlyMode" @click="addArticleData" title="添加列表" class="addArticleBtn el-icon-circle-plus"></span>
                </el-col>
            </el-row>
        </div>
        <div class="correlationIndent">
            <div class="tit"><b>相关订单</b></div>
            <div class="cont">
                <div class="btn">
                    <el-checkbox v-model="checkedAll" @change="handleCheckedAll">全选</el-checkbox>
                    <el-button size="small" type="primary" @click="selectIdea">选择处理意见</el-button>
                    <el-button size="small" type="primary" @click="addRemark">添加备注</el-button>
                </div>
                <el-table
                    ref="multipleTable"
                    :data="indentData" border size="medium"
                    height="600" style="width:100%;"
                    :row-style="rowClass"
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
                            <span v-if="item.label=='处理意见'">{{methods.changeDict(paperReviewOpinion,scope.row[item.prop])}}</span>
                            <span v-else>{{scope.row[item.prop]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="margin-top: 20px;"
                    v-show="indentData.length>0"
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
        <div class="btmBtn" v-if="!readOnlyMode">
            <el-button v-if="modelType=='单条新增'" :loading="nextLoading" size="medium" @click="save('next')">保存并下一条</el-button>
            <el-button size="medium" :loading="saveLoading" type="primary" @click="save">保存</el-button>
        </div>

        <el-dialog append-to-body title="选择处理意见" :visible.sync="ideaDialog" width="600px">
            <div>
                <div class="dialogTxt">已选定<b>{{checkedAll?curTotal:multipleSelection.length}}</b>个订单</div>
                <el-checkbox-group class="ideaCont" v-model="ideaCheckList">
                    <el-checkbox v-for="item in paperReviewOpinion" :key="item.id" :label="item.value">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <div class="dialogBtn">
                    <el-button size="medium" @click="ideaDialog=false">取消</el-button>
                    <el-button @click="saveIdea" size="medium" :loading="ideaLoading" type="primary">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog append-to-body title="添加备注" :visible.sync="remarkDialog" width="600px">
            <div>
                <div class="dialogTxt">已选定<b>{{checkedAll?curTotal:multipleSelection.length}}</b>个订单</div>
                <el-input class="remarkTextarea" type="textarea" v-model="remarkVal" :autosize="{ minRows: 5}" maxlength="100" show-word-limit></el-input>
                <div class="dialogBtn">
                    <el-button size="medium" @click="remarkDialog=false">取消</el-button>
                    <el-button @click="saveRemark" size="medium" :loading="remarkLoading" type="primary">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
const querystring = require('querystring');
export default {
    data(){
        return {
            loading:false,
            indentLoading:false,
            saveLoading:false,
            nextLoading:false,
            taskData:{},
            volumeOptions:[],
            typeCheckList:[],
            ideaCheckList:[],
            indentSelectIds:[],
            checkedAll:false,
            indentData:[],
            opinionList:[],
            multipleSelection: [],
            currentPage:1,
            curPageSize:20,
            curTotal:0,
            columnData:[
                {prop:"customerCode",label:"客户号"},
                {prop:"customerName",label:"客户名称"},
                {prop:"copiesNumber",label:"份数"},
                {prop:"disposeOpinion",label:"处理意见"},
                {prop:"remark",label:"备注"},
            ],
            articleColumn:[
                {prop:"originalTitle",label:"原文标题"},
                {prop:"chainaTitle",label:"中文标题"},
                {prop:"pageNumber",label:"页码"},
                {prop:"questionContent",label:"问题内容",width:'500'},
            ],
            ideaDialog:false,
            ideaLoading:false,
            remarkDialog:false,
            remarkLoading:false,
            remarkVal:'',
            dialogImageUrl: '',
            dialogVisible: false,
            coverDate:'',
            readOnlyMode:false
        }
    },
    props:['modelType'],
    computed:{
        ...mapGetters(['paperReview','paperProblemType','paperReviewOpinion'])
    },
    methods: {
        httprequest(){},
        beforeupload(file){
            let fileName=file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
            if (fileName!='.jpg'&&fileName!='.jpeg'&&fileName!='.png') {
                this.$message.error('仅支持上传jpg、jpeg、png类型文件');
                return false
            }
            if (file.name.indexOf('，')!=-1||file.name.indexOf(',')!=-1||file.name.indexOf('&')!=-1||file.name.indexOf('=')!=-1) {
                this.$message.error('文件名格式错误，不能包含特殊字符,&=');
                return false
            }
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
        edit(){
            this.readOnlyMode=false
            if (this.opinionList.length==0) {
                this.opinionList=[{}]
            }
        },
        changeVolumeDescription(){
            this.getTaskData()
            this.getIndentData()
        },
        changeCoverDate(data){
            if (data) {
                this.taskData.coverStartDate=data[0]
                this.taskData.coverEndDate=data[1]
            }else{
                this.taskData.coverStartDate=''
                this.taskData.coverEndDate=''
            }
        },
        getVolumeOptions(){
            this.taskData.volumeDescription=''
            this.volumeOptions=[]
            if (this.taskData.paperCode.trim()) {
                this.$post('/api/paperReview/findVolumeDescription',{paperCode:this.taskData.paperCode}).then(res=>{
                    if (res.data&&res.data.length>0) {
                        this.taskData.volumeDescription=res.data[0]
                        this.volumeOptions=res.data
                        this.getTaskData()
                        this.getIndentData()
                    }
                })
            }
        },
        // 获取页面数据
        getTaskData(){
            let params={
                paperCode:this.taskData.paperCode,
                volumeDescription:this.taskData.volumeDescription
            }
            this.loading=true;
            this.$post('/api/paperReview/findPaperReviewByIssn',params).then(res=>{
                this.loading=false;
                if (res.data.id) {
                    this.taskData.id=res.data.id
                    this.taskData.issn=res.data.issn
                    this.taskData.paperName=res.data.paperName
                    this.taskData.paperCode=res.data.paperCode
                    this.taskData.chinaName=res.data.chinaName
                    this.taskData.volumeDescription=res.data.volumeDescription
                    this.taskData.coverDate=res.data.coverDate
                    this.taskData.publishingDepartmentType=res.data.publishingDepartmentType
                    this.taskData.copiesNumber=res.data.copiesNumber
                    this.taskData.publicationPlace=res.data.publicationPlace
                    this.taskData.nameList=res.data.nameList
                    this.taskData.questionType=res.data.questionType
                    this.taskData.errorPage=res.data.errorPage
                    this.taskData.textReport=res.data.textReport
                    this.taskData.newsImage=res.data.newsImage
                    if (res.data.coverStartDate) {
                        let startTime=new Date(res.data.coverStartDate)
                        let endTime=new Date(res.data.coverEndDate)
                        this.coverDate=[startTime,endTime]
                    }
                    if (res.data.questionType) {
                        this.typeCheckList=res.data.questionType.split(',')
                    }
                    this.opinionList=res.data.opinionList
                    if (res.data.imageUrl) {
                        let arr=[]
                        res.data.imageUrl.split(',').forEach(item=>{
                            if (item) {
                                arr.push({url:'/imgUrl'+item})
                            }
                        })
                        this.taskData.fileList=arr
                    }
                }else{
                    this.taskData.id=''
                    this.taskData.issn=''
                    this.taskData.paperName=''
                    this.taskData.chinaName=''
                    this.taskData.coverStartDate=''
                    this.taskData.coverEndDate=''
                    this.taskData.publishingDepartmentType=''
                    this.taskData.copiesNumber=''
                    this.taskData.publicationPlace=''
                    this.taskData.nameList='1'
                    this.taskData.questionType=''
                    this.taskData.errorPage=''
                    this.taskData.textReport=''
                    this.taskData.newsImage=''
                    this.taskData.fileList=[]
                    this.taskData.opinionString =''
                    this.typeCheckList=[]
                    this.checkedAll=false
                    this.indentData=[]
                    this.opinionList=[{}]
                    this.coverDate=''
                }
            }).catch(err=>{
               this.loading=false; 
            })
        },
        // 获取订单列表
        getIndentData(){
            this.checkedAll=false;
            this.currentPage=1
            this.curPageSize=20
            this.searchIndent()
        },
        searchIndent(){
            this.indentData=[]
            let params={
                paperCode:this.taskData.paperCode,
                volumeDescription:this.taskData.volumeDescription,
                pageNo:this.currentPage,
                pageSize:this.curPageSize
            }
            this.indentLoading=true;
            this.$post('/api/paperReview/findPaperReviewBycodePage',params).then(res=>{
                this.indentLoading=false;
                if (res.data.orderList&&res.data.orderList.length>0) {
                    this.indentData=res.data.orderList
                }
                this.curTotal=res.data.page.totalPageNum
                if (this.checkedAll) {
                    this.$refs.multipleTable.toggleAllSelection()
                }
            }).catch(err=>{
               this.indentLoading=false; 
            })
        },

        addArticleData(){
            this.opinionList.push({})
        },
        init(data){
            this.taskData={
                issn:'',
                paperName:'',
                paperCode:'',
                chinaName:'',
                volumeDescription:'',
                coverStartDate:'',
                coverEndDate:'',
                publishingDepartmentType:'',
                copiesNumber:'',
                publicationPlace:'',
                nameList:'1',
                questionType:'',
                errorPage:'',
                textReport:'',
                newsImage:'',
                fileList:[],
                opinionString :'',
            }
            this.typeCheckList=[]
            this.checkedAll=false
            this.indentData=[]
            this.opinionList=[{}]
            this.coverDate=''
            if (data) {
                this.readOnlyMode=true
                this.taskData.paperCode=data.paperCode
                this.taskData.volumeDescription=data.volumeDescription
                this.getTaskData()
                this.getIndentData()
            }
        },
        exceed(){
            this.$message.warning('图片上传上限为100张')
        },
        imgChange(file, fileList){
            this.taskData.fileList=fileList;
        },
        beforeRemove(file){
            if (!file.raw) {
                let curIndex='';
                this.taskData.fileList.forEach((item,index)=>{
                    if (file.url==item.url) {
                        curIndex=index
                    }
                })
                this.$confirm('确定要删除该图片?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params={
                        id:this.taskData.id,
                        url:file.url.replace(/\/imgUrl/g,'')
                    }
                    this.$get('/api/paperReview/deleteImage',params).then(res=>{
                        if (res.success) {
                            this.$message.success(res.message)
                            this.taskData.fileList.splice(curIndex,1)
                        }else{
                            this.$message.error(res.message)
                        }
                    })
                })
                return false
            }
        },
        handleRemove(file, fileList) {
            this.taskData.fileList=fileList;
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        changeQuestionType(data){
            this.taskData.questionType=data.join(',')
        },
        save(type){
            if (!this.taskData.paperCode.trim()) {
                this.$message.warning('请填写刊号')
                return
            }
            if (!this.taskData.volumeDescription.trim()) {
                this.$message.warning('请选择卷期描述')
                return
            }
            let form=new FormData()
            for (const k in this.taskData) {
                if (k=='fileList') {
                    this.taskData.fileList.forEach((item,index)=>{
                        if (item.raw) {
                            form.append(k,item.raw)
                        }
                    })
                }else if (k=='opinionString') {
                    form.append(k,JSON.stringify(this.opinionList))
                } else {
                    form.append(k,this.taskData[k])
                }
            }
            let url=''
            if (this.taskData.id) {
                url='/api/paperReview/updatePaperReview'
            }else{
                url='/api/paperReview/insertPaperReview'
            }
            if (type=='next') {
                this.nextLoading=true;
            } else {
                this.saveLoading=true;
            }
            this.$post(url,form).then(res=>{
                this.saveLoading=false;
                this.nextLoading=false;
                if (res.success) {
                    this.$message.success(res.message)
                    if (type=='next') {
                        this.init()
                    }else{
                        this.$emit('closeDialog')
                    }
                }else{
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.saveLoading=false;
                this.nextLoading=false;
            })
        },
        saveIdea(){
            let params={
                disposeOpinion:this.ideaCheckList.join(',')
            }
            let url=''
            if (this.checkedAll) {
                params.paperCode=this.taskData.paperCode
                params.volumeDescription=this.taskData.volumeDescription
                url='/api/paperReview/updateDisposeOpinionAll'
            } else {
                params.ids=this.indentSelectIds.join(',')
                url='/api/paperReview/updateDisposeOpinion'
            }
            this.ideaLoading=true;
            this.$post(url,params).then(res=>{
                this.ideaLoading=false;
                if (res.success) {
                    this.checkedAll=false
                    this.searchIndent()
                    this.ideaDialog=false
                    this.$message.success(res.message)
                }else{
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.ideaLoading=false;
            })
        },
        saveRemark(){
            let params={
                remark:this.remarkVal
            }
            let url=''
            if (this.checkedAll) {
                params.paperCode=this.taskData.paperCode
                params.volumeDescription=this.taskData.volumeDescription
                url='/api/paperReview/updateRemarkAll'
            } else {
                params.ids=this.indentSelectIds.join(',')
                url='/api/paperReview/updateRemark'
            }
            this.ideaLoading=true;
            this.$post(url,params).then(res=>{
                this.ideaLoading=false;
                if (res.success) {
                    this.checkedAll=false
                    this.searchIndent()
                    this.remarkDialog=false
                    this.$message.success(res.message)
                }else{
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.ideaLoading=false;
            })
        },
        handleCheckedAll(data){
            if (this.multipleSelection.length!=this.indentData.length||!data) {
                this.$refs.multipleTable.toggleAllSelection()
            }
        },
        selectIdea(){
            if (this.multipleSelection.length==0){
                this.$message.warning('请选择订单')
                return
            }
            this.ideaCheckList=[]
            this.ideaDialog=true;
        },
        addRemark(){
            if (this.multipleSelection.length==0){
                this.$message.warning('请选择订单')
                return
            }
            this.remarkVal=''
            this.remarkDialog=true;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            if (val.length!=this.indentData.length) {
                this.checkedAll=false
            }
            this.indentSelectIds=[]
            val.forEach(item=>{
                this.indentSelectIds.push(item.id)
            })
        },
        handleSizeChange(val) {
            this.curPageSize=val;
            this.searchIndent()
        },
        handleCurrentChange(val) {
            this.currentPage=val;
            this.searchIndent()
        }
    }
}
</script>
<style lang='scss' scoped>
#addTask{
    .tit{
        background: #E1EFFE;
        padding: 10px;
        span{
            margin-left: 10px;
        }
    }
    .red{
        color: red;
    }
    .editDiv{
        margin:-20px 0 10px 0;
        text-align:right;
    }
    .info{
        .el-row{
            margin-top: 15px;
            label{
                display: inline-block;
                width: 150px;
                text-align: right;
            }
            .el-input,.el-select{
                width: 300px;
            }
        }
    }
    .readIdea{
        margin-top: 20px;
        .el-row{
           margin-top: 15px; 
           .label{
                display: inline-block;
                width: 150px;
                text-align: right;
           }
           .el-col:last-child{
               padding-left: 10px;
           }
           /deep/ .el-upload--picture-card{
                width: 90px!important;
                height: 90px!important;
                line-height: 90px!important;
           }
           /deep/ .el-upload-list--picture-card .el-upload-list__item{
                width: 90px!important;
                height: 90px!important;
           }
           .addArticleBtn{
                color: #409eff;
                font-size: 26px;
                margin: 5px 10px;
                cursor: pointer;
           }
           .hide{
                /deep/ .el-upload--picture-card {
                    display: none;
                }
            }
            .imgList{
                img{
                    width: 90px;
                    height: 90px;
                    border: 1px solid #c0ccda;
                    border-radius: 6px;
                    margin-right: 8px;
                    cursor: pointer;
                }
            }
        }
    }
    .correlationIndent{
        margin-top: 20px;
        .cont{
            padding: 20px;
            .el-checkbox{
                display: inline-block;
                margin:0 15px;
            }
            .el-table{
                margin: 10px 0;
            }
        }
    }
    .btmBtn{
        text-align: center;
    }
}
.el-checkbox{
    display: block;
    margin-right: 0;
    margin-bottom:10px;
}
.dialogTxt{
    margin-top: -20px;
    b{
        color: #409eff;
    }
}
.dialogBtn{
    text-align: center;
}
.remarkTextarea{
    margin:40px 0;
}
.ideaCont{
    width: 100px;
    margin: auto;
    padding:40px 0;
}
</style>

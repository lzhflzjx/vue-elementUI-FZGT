<template>
    <div id='taskAllocation' v-loading="loadingTask">
        <div class="topTxt" v-show="curType=='任务分配'">
            已选定<b style="color:#409eff;font-size:16px;">{{checkedAll?taskTotleNum:taskData.length }}</b>项任务
        </div>
        <div class="formDiv" v-loading='readerLoading'>
                <div class="existBook" v-if="achieveData&&achieveData.length>0&&curType=='任务分配'">
                    <div class="tit"><i style="color:#e6a23c;" class="el-icon-info"></i> 当前列表有<b style="color:#409eff;">{{achieveData.length}}</b>本书已完成人工审读，结果如下，请选择需要重审的图书</div>
                    <el-table
                        ref="multipleTable"
                        :data="achieveData"
                        stripe
                        border
                        style="width:600px;"
                        size="mini"
                        :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
                        @selection-change="selectAchieve">
                        <el-table-column type="selection" width="45"></el-table-column>
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="isbn" width="100" label="ISBN"></el-table-column>
                        <el-table-column prop="bookname" label="书名"></el-table-column>
                        <el-table-column prop="reader" label="审读员"></el-table-column>
                        <el-table-column prop="commoncheck" label="审读结果"></el-table-column>
                    </el-table>
                </div>
                <div class="existBook" v-if="releaseData&&releaseData.length>0&&curType=='任务分配'">
                    <div class="tit"><i style="color:#e6a23c;" class="el-icon-info"></i> 当前列表有<b style="color:#409eff;">{{releaseData.length}}</b>本书已发布人工审读任务，任务如下，请选择需要重审的图书</div>
                    <el-table
                        ref="multipleTable"
                        :data="releaseData"
                        stripe
                        border
                        size="mini"
                        style="width:600px;"
                        :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
                        @selection-change="selectRelease">
                        <el-table-column type="selection" width="45"></el-table-column>
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="isbn" width="100" label="ISBN"></el-table-column>
                        <el-table-column prop="bookname" label="书名"></el-table-column>
                        <el-table-column prop="reader" label="审读员"></el-table-column>
                    </el-table>
                </div>
                <div class="formItem">
                    <label class="label"><i>*</i> 优先级：</label>
                    <el-select v-model="ruleForm.level" size="mini" style="width:90px">
                        <el-option
                        v-for="item in reviewLevel"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="formItem" v-if="curType=='新增任务'">
                    <label class="label"><i>*</i> 上传附件：</label>
                    <el-input v-model="ruleForm.file" disabled placeholder="请选择上传文件" size="mini" style="width:200px;"></el-input>
                    <input style="display:none" id="addTaskImportBtn" type="file" @change="importf($event)">
                    <el-button type="primary" size="mini" @click="selectFile">上传</el-button>
                    <a v-if="$route.path=='/bookLibrary'" href="./static/ISBNTemplate.xlsx" style="font-size:12px;margin-left: 10px;">任务模板</a>
                </div>
                <div class="existBook" v-if="achieveData&&achieveData.length>0&&curType=='新增任务'">
                    <div class="tit"><i style="color:#e6a23c;" class="el-icon-info"></i> 当前列表有<b style="color:#409eff;">{{achieveData.length}}</b>本书已完成人工审读，结果如下，请选择需要重审的图书</div>
                    <el-table
                        ref="multipleTable"
                        :data="achieveData"
                        stripe
                        border
                        style="width:600px;"
                        size="mini"
                        :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
                        @selection-change="selectAchieve">
                        <el-table-column type="selection" width="45"></el-table-column>
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="isbn" width="100" label="ISBN"></el-table-column>
                        <el-table-column prop="bookname" label="书名"></el-table-column>
                        <el-table-column prop="reader" label="审读员"></el-table-column>
                        <el-table-column prop="commoncheck" label="审读结果"></el-table-column>
                    </el-table>
                </div>
                <div class="existBook" v-if="releaseData&&releaseData.length>0&&curType=='新增任务'">
                    <div class="tit"><i style="color:#e6a23c;" class="el-icon-info"></i> 当前列表有<b style="color:#409eff;">{{releaseData.length}}</b>本书已发布人工审读任务，任务如下，请选择需要重审的图书</div>
                    <el-table
                        ref="multipleTable"
                        :data="releaseData"
                        stripe
                        border
                        size="mini"
                        style="width:600px;"
                        :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
                        @selection-change="selectRelease">
                        <el-table-column type="selection" width="45"></el-table-column>
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="isbn" width="100" label="ISBN"></el-table-column>
                        <el-table-column prop="bookname" label="书名"></el-table-column>
                        <el-table-column prop="reader" label="审读员"></el-table-column>
                    </el-table>
                </div>
                <!-- <div class="taskHint">当前有<span>{{taskData.length}}</span>个待分配任务</div> -->
                <div class="formItem">
                    <label style="vertical-align:top;" class="label"><i>*</i> 审读员：</label>
                    <el-tree
                        ref="tree"
                        style="display:inline-block;"
                        :data="readerList"
                        show-checkbox
                        node-key="id"
                        @check-change="handleCheck">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span style="margin-left:10px;" v-text="changeTree(data)"></span>
                        </span>
                    </el-tree>
                </div>
                <div class="formItem">
                    <label style="vertical-align:top;" class="label">个人任务分配数：</label>
                    <div style="display:inline-block;">
                        <div v-for="item in checkPersList" style="margin-bottom:5px;">
                            <span>{{item.name}}</span>
                            <el-input size="mini" style="width:60px;" v-model="item.count" @keyup.native="item.count=item.count.replace(/[^\d]/g,'')"></el-input>个
                        </div>
                    </div>
                </div>
                <div class="formItem">
                    <label class="label">完成日期：</label>
                    <el-date-picker
                        v-model="ruleForm.date"
                        value-format='yyyy-MM-dd HH:mm:ss'
                        size="mini"
                        style="width:180px"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </div>
                <div class="btns">
                    <el-button size="medium" @click="closeDialog">取消</el-button>
                    <el-button :loading="btnLoading" size="medium" type="primary" @click="submitForm()">确定</el-button>
                </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import {mapActions,mapGetters} from 'vuex'
export default {
    data(){
        return {
            loadingTask:false,
            btnLoading:false,
            readerstatusOption:['待分配','在审读','已审读'],
            achieveData:[],
            releaseData:[],
            checkPersList:[],
            ruleForm: {
                imgType:1,
                level:'',
                checkPers:'1',
                file: '',
                date: '',
            },
            persData:[],
            curType:'',
            imgTypeSuffix:['.png', '.jpg', '.jpeg', 'webp', '.zip']
        }
    },
    props:['taskData','modelName','modelType','checkedAll','taskTotleNum','searchParams'],
    computed:{
        ...mapGetters(['readerList','reviewLevel','commonReadResult','readerLoading']),
    },
    methods: {
        ...mapActions(['getReaderList']),
        selectAchieve(val){
            let ids=[];
            val.forEach(item=>{
                ids.push(item.isbn)
            })
            this.achieveData.forEach(item=>{
                if (ids.indexOf(item.isbn)==-1) {
                    if (this.taskData.indexOf(item.isbn)!=-1) {
                        this.taskData.splice(this.taskData.indexOf(item.isbn),1)
                    }
                }else{
                    if (this.taskData.indexOf(item.isbn)==-1) {
                        this.taskData.push(item.isbn)
                    }
                }
            })
            this.handleCheck()
        },
        selectRelease(val){
            let ids=[];
            val.forEach(item=>{
                ids.push(item.isbn)
            })
            this.releaseData.forEach(item=>{
                if (ids.indexOf(item.isbn)==-1) {
                    if (this.taskData.indexOf(item.isbn)!=-1) {
                        this.taskData.splice(this.taskData.indexOf(item.isbn),1)
                    }
                }else{
                    if (this.taskData.indexOf(item.isbn)==-1) {
                        this.taskData.push(item.isbn)
                    }
                }
            })
            this.handleCheck()
        },
        changeTree(data){
            if (!data.children) {
                let type=this.modelType=="book"?'图书':'图片';
                return '待审读'+type+'量：'+data.count
            }
        },
        closeDialog(){
            this.$emit('closeDialog')
        },
        init(data){
            this.getReaderList(this.modelType)
            this.$refs.tree.setCheckedNodes([])
            this.curType=data;
            this.ruleForm.level='';
            this.checkPersList=[];
            this.achieveData=[];
            this.releaseData=[];
            this.ruleForm.file='';
            this.ruleForm.date='';
            if (this.curType=='新增任务') {
                this.taskData=[]
            }else{
                if (this.$route.path=='/bookLibrary'&&!this.checkedAll) {
                    this.allocationed()
                }
            }
        },
        handleCheck(){
            if(this.curType!=='新增任务'){
              if ((!this.checkedAll&&this.taskData.length==0)||(this.checkedAll&&this.taskTotleNum==0)) {
                  this.$message.warning('暂无可分配任务')
                  this.$refs.tree.setCheckedNodes([])
                  return
              }
            }
            this.checkPersList=[]
            let checkPer=this.$refs.tree.getCheckedNodes();
            let checkedArr=[];
            checkPer.forEach((item,index) => {
                if (!item.children) {
                    checkedArr.push(item)
                }
            })
            let totalNum=0
            if (this.checkedAll) {
                totalNum=this.taskTotleNum
            } else {
                totalNum=this.taskData.length
            }
            let num=parseInt(totalNum/checkedArr.length);
            let arr=[];
            checkedArr.forEach((item,index) => {
                let obj={}
                obj.userId=item.id
                obj.name=item.label
                if (index==checkedArr.length-1) {
                    obj.count=totalNum-(num*index)
                } else {
                    obj.count=num
                }
                arr.push(obj)
            });
            this.checkPersList=arr;
        },
        submitForm() {
            if (this.ruleForm.level==='') {
                this.$message.warning('请选择优先级')
                return
            }
            if (this.curType=='新增任务') {
                if (this.ruleForm.file=='') {
                    this.$message.warning('请上传附件')
                    return
                }
            }
            if (this.checkPersList.length==0) {
                this.$message.warning('请分配任务')
                return
            }
            var num=0;
            var i=0;
            this.checkPersList.forEach(item=>{
                num+=item.count/1
                // 非全选时为审读员分配任务ID
                if (!this.checkedAll) {
                    item.ids=this.taskData.slice(i,i+item.count)
                }
                i+=item.count/1
            })
            // 过滤分配数为0的数据
            var checkPersList=JSON.parse(JSON.stringify(this.checkPersList))
            for (let i = 0; i < checkPersList.length; i++) {
                if (checkPersList[i].count<1) {
                    checkPersList.splice(i,1)
                    i--
                }
            }
            let taskTotal=this.checkedAll?this.taskTotleNum:this.taskData.length
            if (num!=taskTotal) {
                this.$message.warning('任务分配数与总任务数需保持一致')
                return
            }
            var params={
                priority:this.ruleForm.level,
                completeDate:this.ruleForm.date,
                reader:checkPersList,
                source:'任务下发',
            }
            this.btnLoading=true;
            // 审读任务重分配
            if (this.$route.path=='/bookCheck'||this.$route.path=='/imgCheck') {
                params.flag=this.$route.path=='/bookCheck'?0:1;
                if (this.modelName=='清单') {
                    params.model=1;
                } else {
                    params.model=0;
                }
                let url=''
                let data={}
                if (this.checkedAll) {
                    if (this.modelName=='清单') {
                        url='/api/mission/allTaskListReallocation'
                    } else {
                        url='/api/mission/allTasksReallocation'
                    }
                    data.missionParam=params
                    data.queryParam=this.searchParams
                } else {
                    url='/api/mission/reallocation'
                    data=params
                }
                this.$post(url,data).then(res=>{
                    this.btnLoading=false;
                    if (res.success) {
                        this.$message.success('任务分配成功')
                        this.$emit('closeDialog')
                    } else {
                        this.$message.error(res.message) 
                    }
                }).catch(err=>{
                    this.btnLoading=false;
                })
            }
            // 图书库任务分配
            if (this.$route.path=='/bookLibrary'&&this.curType=='任务分配') {
                params.flag=0;
                let url=''
                let data={}
                if (this.checkedAll) {
                    url='/api/mission/allBooksAllocation'
                    data.missionParam=params
                    data.queryParam=this.searchParams
                } else {
                    url='/api/mission/allocation'
                    data=params
                }
                this.$post(url,data).then(res=>{
                    this.btnLoading=false;
                    if (res.success) {
                        this.$message.success('任务分配成功')
                        this.$emit('closeDialog')
                    } else {
                        this.$message.error(res.message) 
                    }
                }).catch(err=>{
                    this.btnLoading=false;
                })
            }
            // 图书库任务新增
            if (this.$route.path=='/bookLibrary'&&this.curType=='新增任务') {
                params.flag=0;
                this.$post('/api/mission/addMission',params).then(res=>{
                    this.btnLoading=false;
                    if (res.success) {
                        this.$message.success(res.message)
                        this.$emit('closeDialog')
                    } else {
                        this.$message.error(res.message) 
                    }
                }).catch(err=>{
                    this.btnLoading=false;
                })
            }
        },
        selectFile() {
            document.getElementById('addTaskImportBtn').value=''
            document.getElementById('addTaskImportBtn').click();
        },
        importf(obj) {
            if (!obj.target.files) {
            return;
            }
            this.ISBNList=[];
            var that = this;
            var f = obj.target.files[0];
            var fileName =f.name;
            var fileext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
            if (fileext != '.xls' && fileext != '.xlsx') {
                this.$message.error('只能上传excel文件');
                return;
            }
            this.ruleForm.file=fileName;
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                var wb = XLSX.read(data, {
                    type: 'binary'
                });
                let fileObj = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                fileObj.forEach(item=>{
                    that.taskData.push(item.ISBN)
                })
                that.taskData=Array.from(new Set(that.taskData))
                that.allocationed()
            };
            reader.readAsBinaryString(f);
        },
        allocationed(){
            this.loadingTask=true;
            this.achieveData=[];
            this.releaseData=[];
            let params={
                ids:this.taskData.join(','),
                flag:0
            }
            this.$post('/api/mission/allocationed',params).then(res=>{
                this.loadingTask=false;
                if (res.data.result&&res.data.result.length>0) {
                    this.releaseData=res.data.result[0].reviewInfoList
                    this.achieveData=res.data.result[0].publishInfoList
                    if( this.releaseData && this.releaseData.length>0 ){
                        this.releaseData.forEach(item=>{
                            this.taskData.splice(this.taskData.indexOf(item.isbn),1)
                        })
                    }
                    if( this.achieveData && this.achieveData.length>0 ){
                        this.achieveData.forEach(item=>{
                            this.taskData.splice(this.taskData.indexOf(item.isbn),1)
                        })
                    }   
                }
            }).catch(err=>{
              this.loadingTask=false;
            })
        },
    }
}
</script>
<style lang='scss' scoped>
    #taskAllocation{
        .topTxt{
            color: gray;
        }
        .formDiv{
            margin-left: 200px;
            .formItem{
                margin-bottom:30px;
                .label{
                    display: inline-block;
                    width:140px;
                    text-align: right;
                    margin-right:10px;
                    color: gray;
                    i{
                        color: red;
                    }
                }
            }
            .imgImportTitle{
                color: #c1c1c1;
                font-size: 12px;
                margin: -20px 0 20px 40px;
            }
            .existBook{
                margin-left:-60px;
                margin-bottom: 10px;
                .tit{
                    margin:10px 0;
                    font-size: 13px;
                }
            }
            .taskHint{
                color: gray;
                margin: 0 0 10px 50px;
                span{
                    color:#409eff;
                }
            }
            .btns{
              margin-top:80px;
              margin-left: 160px;
            }
        }
    }
</style>

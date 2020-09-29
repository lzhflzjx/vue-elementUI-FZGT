<template>
    <div id='wordCheck'>
        <div class="apparatusCheck">
            <div class="tit">机器审读结果 <span>{{resultMessage}}</span></div>
            <el-table :data="tableData" size="mini" border :header-cell-style="{background:'#eaf2f7'}">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column width="100" prop="detectionRange" label="敏感词位置">
                    <template slot-scope="scope">
                        <span style="color:#409eff;cursor:pointer;" v-if="scope.row.detectionRange=='Look inside'" @click="openInsideDetail">{{scope.row.detectionRange}}</span>
                        <span v-else>{{scope.row.detectionRange}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="81" prop="wordFrequency" label="出现词频"></el-table-column>
                <el-table-column label="所在段落">
                    <template slot-scope="scope"><span v-html="keywordRed(scope.row.textValue,scope.row.wordValue,'str')"></span></template>
                </el-table-column>
            </el-table>
        </div>
        <div class="type">
            <label class="labelName">名单：</label>
            <el-radio-group v-model="type">
                <el-radio v-for="item in txtReadResult" :key="item.value" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
        </div>
        <div class="class">
            <label class="labelName">敏感分类：</label>
            <el-tree ref="wordTree" style="margin-left:10px;" :data="wordTree" :props="defaultProps" node-key="id" show-checkbox @check-change="handleCheck"></el-tree>
        </div>
        <div class="opinion">
            <label class="labelName">审读意见：</label>
            <el-input
                type="textarea"
                v-model="textarea"
                maxlength="300"
                :autosize="{ minRows:3}"
                style="width:calc(100% - 70px);font-size: 13px;"
                show-word-limit>
            </el-input>
        </div>
        <el-dialog title="look inside详情" :visible.sync="insidekDialog" width="1000px">
            <div v-loading='insideLoading'>
                <div class="insideDiv">涉及关键词：
                    <el-checkbox v-model="wordCheckAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="selectKeyWord" @change="handlecheckedChange">
                        <el-checkbox v-for="item in insideDetail.words" :label="item.wordValue" :key="item.wordValue">
                        <span>{{item.wordValue.replace('#',' ')+'('+item.wordFrequency+')'}}</span> 
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="text" v-html="keywordRed(insideDetail.textValue,selectKeyWord,'arr')"></div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return {
            type:0,
            textarea:'',
            checked:'',
            wordTree:[],
            defaultProps:{
                children: 'childList',
                label: 'sortName'
            },
            tableData:[],
            insideDetail:{},
            insidekDialog:false,
            insideLoading:false,
            wordCheckAll:false,
            selectKeyWord:[],
            resultMessage:''
        }
    },
    created(){
        this.getInfo()
        this.getTree()
        this.getTextAutoReview()
    },
    computed:{
        ...mapGetters(['txtReadResult'])
    },
    methods: {
        openInsideDetail(){
            this.insidekDialog=true;
            this.insideLoading=true;
            this.$post('/api/getLookInsideAutoReview?isbn='+this.$route.query.isbn).then(res=>{
                this.insideLoading=false;
                if (res.data) {
                    this.insideDetail=res.data
                    // 默认关键词全选
                    this.wordCheckAll=true;
                    this.handleCheckAllChange(true)
                }
            }).catch(err=>{
                this.insideLoading=false;
            })
        },
        getTextAutoReview(){
            this.tableData=[]
            this.resultMessage=''
            this.$post('/api/getTextAutoReview?isbn='+this.$route.query.isbn).then(res=>{
                if (res.data.textAutoESModelList&&res.data.textAutoESModelList.length>0) {
                    this.tableData=res.data.textAutoESModelList
                    this.resultMessage=res.data.message
                }
            })
        },
        handlecheckedChange(value) {
            let checkedCount = value.length;
            this.wordCheckAll = checkedCount === this.insideDetail.words.length;
        },
        handleCheckAllChange(val) {
            let all=[];
            this.insideDetail.words.forEach(item => {
                all.push(item.wordValue)
            });
            this.selectKeyWord = val ? all : [];
        },
        // 高亮关键词
        keywordRed(txt,word,type) {
            if (txt) {
                let wordList=[]
                if (type=='str') {
                    wordList=word.split('#')
                } else {
                    word.forEach(item=>{
                        if (item.indexOf('#')!=-1) {
                            wordList=wordList.concat(item.split('#'))
                        } else {
                            wordList.push(item)
                        }
                    })
                    txt=txt.replace(new RegExp("<span style='color:#f9656e'>", "g"),'').replace(new RegExp("</span>", "g"),'')
                }
                wordList.forEach(keyword=>{
                    txt=txt.replace(new RegExp(keyword, "g"),`<span style='color:#f9656e'>${keyword}</span>`)
                })
                return txt
            }
        },
        getTree(){
            this.$post('/api/sortManage/findListByPraentId',{type:1}).then(res=>{
                if (res.data.result&&res.data.result.length>0) {
                    this.wordTree=res.data.result;
                }
            })
        },
        handleCheck(){
            let checkPer=this.$refs.wordTree.getCheckedNodes();
            let checkedArr=[];
            checkPer.forEach((item,index) => {
                if (!item.childList) {
                    checkedArr.push(item.id)
                }
            })
            this.checked=checkedArr.join(',')
        },
        sava(){
            let params=[{
                isbn:this.$route.query.isbn,
                type:'txt',
                manualReviewResult:this.type,
                sensitiveClassification:this.checked,
                reviewOpinion:this.textarea
            }]
            this.$post('/api/review/person/saveList',params).then(res=>{
                if (!res.success) {
                    this.$message.error(res.message);
                }
            })
        },
        getInfo(){
            let params={
                isbn:this.$route.query.isbn,
                type:'txt'
            }
            this.$get('/api/review/person/findByIsbnIsAndTypeIs',params).then(res=>{
                if (res.data.result&&res.data.result.length>0) {
                    let data=res.data.result[0];
                    this.type=data.manualReviewResult.toString()
                    this.$refs.wordTree.setCheckedKeys(data.sensitiveClassification.split(','))
                    this.textarea=data.reviewOpinion
                }
            })
        },
    }
}
</script>
<style lang='scss' scoped>
#wordCheck{
    max-height:1010px;
    overflow-y: auto;
    font-size:14px;
    .apparatusCheck{
        .tit{
            color: gray;
            margin-bottom:10px;
            padding-left: 10px;
            span{
                color: red;
                margin-left: 50px;
            }
        }
    }
    .type,.class,.opinion{
        margin-top:30px;
        display:flex;
        .labelName{
            display: inline-block;
            width:70px;
            text-align: right;
        }
    }
    .el-radio{
        margin-right: 8px!important;
    }
}
.insideDiv{
    margin-bottom: 20px;
    .el-checkbox-group{
        display: inline-block;
        margin-left: 15px;
    }
}
</style>

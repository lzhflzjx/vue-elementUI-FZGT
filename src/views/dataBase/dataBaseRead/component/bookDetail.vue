<template>
    <div id='bookDetail' v-loading='loading'>
        <el-card class="infoDiv">
            <div>ID：{{bookDetail.identity_in_site}}</div>
            <div>文章标题：{{bookDetail.title}}</div>
            <div><span>类型：{{methods.changeDict(types,bookDetail.type)}}</span><span class="ml100">出版物：{{bookDetail.publicationName}}</span></div>
            <div>责任人：{{bookDetail.personLiable}}</div>
            <div>原文链接：<el-link type="primary" :href="bookDetail.url.indexOf('http')!=-1?bookDetail.url:'http://'+bookDetail.url" target="_blank" :underline="false">{{bookDetail.url}}</el-link></div>
            <div>涉及关键词：
                <el-checkbox v-if="bookDetail.textReview" v-model="wordCheckAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-if="bookDetail.textReview" v-model="selectKeyWord" @change="handlecheckedChange">
                    <el-checkbox v-for="item in bookDetail.textReview" :label="item.keyword" :key="item.keyword" :title="title">
                       <span @mouseover="getGroupName(item.keyword)">{{item.keyword+'('+item.hitTotal+')'}}</span> 
                    </el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="remark">
                <div>备注：</div>
                <div>
                    <el-input style="width:530px;" type="textarea" :rows="4" v-model="bookDetail.remarks" maxlength="100" show-word-limit></el-input>
                    <el-button size="small" type="primary" @click="saveRemark">保存备注</el-button>
                </div>
            </div>
        </el-card>
        <div class="cont">
            <div class="btns">
                <el-radio-group size="small" v-model="curTag">
                    <el-radio-button label="图片"></el-radio-button>
                    <el-radio-button label="正文"></el-radio-button>
                </el-radio-group>
                <div>
                    <span class="red" @click="updata(2,'more')"><i class="el-icon-error"></i> 不通过</span>
                    <span class="green" @click="updata(1,'more')"><i class="el-icon-success"></i> 通过</span>
                </div>
            </div>
            <div class="imgDiv" v-if="curTag=='图片'&&bookDetail.imagesReview">
                <div class="imgItem" v-for="item in bookDetail.imagesReview">
                    <div class="status">
                        <span :class="item.manualReviewResult=='2'?'red':'gray'"  @click="updata(2,'one',item)"><i class="el-icon-error"></i> 不通过</span>
                        <span :class="item.manualReviewResult=='1'?'green':'gray'" @click="updata(1,'one',item)"><i class="el-icon-success"></i> 通过</span>
                    </div>
                    <div class="img">
                        <input type="checkbox" :value="item" v-model="checkedList">
                        <img :src="item.name?'/imgUrl/group1/book/'+item.name:''">
                    </div>
                    <div class="autoReview" v-if="item.imageAutoReview"><span>机审：</span>
                        <span class="tag" v-for="tag in item.imageAutoReviewKeywords.split(',')">{{tag}}</span>
                    </div>
                </div>
            </div>
            <div class="text" v-if="curTag=='正文'" v-html="bookDetail.text"></div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loading:false,
            remark:'',
            curTag:'图片',
            bookDetail:{},
            wordCheckAll:false,
            selectKeyWord:[],
            checkedList:[],
            types:[
                {name:'图书',value:1},
                {name:'报刊',value:2},
                {name:'博客',value:3},
                {name:'网络文章',value:4},
                {name:'其他',value:5},
            ],
            curData:'',
            title:''
        }
    },
    methods: {
        getGroupName(name){
            this.title=''
            this.$post('/api/databaseTaskDetail/findTypeByKeyWord',{keyWord:name}).then(res=>{
                this.title=res.data
            })
        },
        handleCheckAllChange(val) {
            let all=[];
            this.bookDetail.textReview.forEach(item => {
                all.push(item.keyword)
            });
            this.selectKeyWord = val ? all : [];
            this.keywordRed()
        },
        handlecheckedChange(value) {
            let checkedCount = value.length;
            this.wordCheckAll = checkedCount === this.bookDetail.textReview.length;
            this.keywordRed()
        },
        init(data){
            this.curData=data;
            this.getBookDetail()
        },
        updata(stuats,type,data){
            if (type=='more'&&this.curTag=='图片'&&this.checkedList.length==0) {
                this.$message.warning('请选择图片')
                return
            }
            let params={
                id:this.bookDetail.id,
                stuats:stuats,
                taskId:this.bookDetail.taskId,
                type:this.curTag=='图片'?1:2
            }
            if (this.curTag=='图片') {
                params.pictureModels=type=='more'?this.checkedList:[data]
            }
            this.loading=true;
            this.$post('/api/databaseTaskDetail/updateStuats',params).then(res=>{
                this.loading=false;
                if (res.success) {
                    this.$message.success(res.message)
                    this.getBookDetail()
                } else {
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.loading=false;
            })
        },
        saveRemark(){
            let params=new FormData()
            params.append('id',this.bookDetail.id)
            params.append('notes',this.bookDetail.remarks)
            this.loading=true;
            this.$post('/api/databaseTaskDetail/insertNotes',params).then(res=>{
                this.loading=false;
                if (res.success) {
                    this.$message.success(res.message)
                } else {
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.loading=false;
            })
        },
        getBookDetail(){
            this.bookDetail={};
            let params=new FormData()
            params.append('id',this.curData.task_batch_id)
            params.append('articleid',this.curData.identity_in_site)
            this.loading=true;
            this.$post('/api/databaseTaskDetail/queryTestDetail',params).then(res=>{
                this.loading=false;
                if (res.data) {
                    this.bookDetail=res.data
                    // 默认关键词全选
                    this.wordCheckAll=true;
                    this.handleCheckAllChange(true)
                    // 高亮关键词
                    this.keywordRed()
                }
            }).catch(err=>{
                this.loading=false;
            })
        },
        keywordRed() {
            if (this.bookDetail.text) {
                this.bookDetail.text=this.bookDetail.text.replace(new RegExp("<span style='color:#f9656e'>", "g"),'').replace(new RegExp("</span>", "g"),'')
                this.selectKeyWord.forEach(keyword=>{
                    this.bookDetail.text=this.bookDetail.text.replace(new RegExp(keyword, "g"),
                    `<span style='color:#f9656e'>${keyword}</span>`)
                })
            }
        },
    }
}
</script>
<style lang='scss' scoped>
#bookDetail{
    .infoDiv{
        line-height: 33px;
        margin-bottom: 20px;
        .ml100{
            margin-left: 100px;
        }
        .el-checkbox-group{
            display: inline-block;
            margin-left: 15px;
        }
        .remark{
            display: flex;
        }
    }
    .cont{
        padding: 20px;
        .red{
            color:red;
        }
        .green{
            color:#409eff;
        }
        .gray{
            color:#c3c3c3;
        }
        .btns{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            span{
                margin-right:10px;
                cursor: pointer;
            }
        }
        .imgDiv{
            display: flex;
            flex-wrap: wrap;
            .imgItem{
                width: 17%;
                font-size: 12px;
                margin-right: 20px;
                .status{
                    font-size: 14px;
                    text-align: right;
                    min-height: 17px;
                    margin-bottom: 5px;
                    span{
                        margin-right: 10px;
                        cursor: pointer;
                    }
                }
                .img{
                    position: relative;
                    input{
                        position: absolute;
                        top: 1px;
                        left: 1px;
                    }
                    img{
                        width: 100%;
                        height: auto;
                    }
                }
                .autoReview{
                    margin-top: 5px;
                    .tag{
                        border: solid 1px red;
                        padding: 0 5px;
                        border-radius: 5px;
                        color: red;
                        margin-right: 10px;
                    }
                }
            }
        }
        .text{
            text-indent: 2em;
        }
    }
}
</style>

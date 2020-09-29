<template>
    <div id='relatedRecommend'>
        <el-row>
            <el-col class="tit" :span="5"><div>图书获奖信息:</div></el-col>
            <el-col :span="19" class="cont">
                <div v-for="item in awardList" class="list">
                    <el-input  size="mini" v-model="item.val"></el-input>
                </div>
                <i @click="addList('award')" class="el-icon-circle-plus"></i>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="5"><div>图书馆藏推荐信息:</div></el-col>
            <el-col :span="19" class="cont">
                <div v-for="item in recommendList" class="list">
                    <el-input  size="mini" v-model="item.val"></el-input>
                </div>
                <i @click="addList('recommend')" class="el-icon-circle-plus"></i>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="5"><div>排行榜信息:</div></el-col>
            <el-col :span="19" class="cont">
                <div v-for="item in rankList" class="list">
                    <el-input  size="mini" v-model="item.val"></el-input>
                </div>
                <i @click="addList('rank')" class="el-icon-circle-plus"></i>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="5"><div>读者对象:</div></el-col>
            <el-col :span="19" class="cont">
                <el-input  size="mini" v-model="bookData.readers.value"></el-input>
            </el-col>
        </el-row>
    </div>
</template>

<script>
const querystring = require('querystring');
export default {
    data(){
      return {
          awardList:[{val:''}],
          recommendList:[{val:''}],
          rankList:[{val:''}],
      }
    },
    props:['bookData'],
    created(){
        if (this.bookData.bookAwardInformation.value) {
            let arr=[]
            this.bookData.bookAwardInformation.value.split(',').forEach(item=>{
                arr.push({val:item})
            })
            this.awardList=arr
        }
        if (this.bookData.libraryRecommendationInformat.value) {
            let arr=[]
            this.bookData.libraryRecommendationInformat.value.split(',').forEach(item=>{
                arr.push({val:item})
            })
            this.recommendList=arr
        }
        if (this.bookData.label.rank) {
            let arr=[]
            this.bookData.label.rank.split(',').forEach(item=>{
                arr.push({val:item})
            })
            this.rankList=arr
        }
    },
    methods: {
        addList(name){
            let obj={val:''};
            if (name=='award') {
                this.awardList.push(obj)
            } 
            if (name=='recommend') {
                this.recommendList.push(obj)
            } 
            if (name=='rank') {
                this.rankList.push(obj)
            } 
        },
        save(){
            let awardList=[]
            this.awardList.forEach(item=>{
                if (item.val.trim()) {
                    awardList.push(item.val)
                }
            })
            this.bookData.bookAwardInformation.value=awardList.join(',')

            let recommendList=[]
            this.recommendList.forEach(item=>{
                if (item.val.trim()) {
                    recommendList.push(item.val)
                }
            })
            this.bookData.libraryRecommendationInformat.value=recommendList.join(',')

            let rankList=[]
            this.rankList.forEach(item=>{
                if (item.val.trim()) {
                    rankList.push(item.val)
                }
            })
            let form=new FormData()
            form.append('isbn',this.$route.query.isbn)
            form.append('rank',rankList.join(','))
            this.$post('/api/review/person/saveLabelRank',form).then(res=>{
                
            })
        }
    }
}
</script>
<style lang='scss' scoped>
#relatedRecommend{
    font-size: 14px;
    .el-row{
        margin-top:20px;
        .tit{
            text-align: right;
            padding-right: 10px;
        }
        .cont{
            position: relative;
            .el-input{
                width:420px;
            }
            i{
                position: absolute;
                right:30px;
                top:2px;
                font-size: 23px;
                color: #409eff;
                cursor: pointer;
            }
            .list{
                margin-bottom:10px;
            }
        }
    }
}
</style>

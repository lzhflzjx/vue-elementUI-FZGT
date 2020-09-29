<template>
    <div id='relevance'>
        <el-row>
            <el-col class="tit" :span="4"><div>关联ISSN:</div></el-col>
            <el-col :span="20" class="cont">
                <div v-for="item in issnList" class="list">
                    <el-input style="width:450px;" size="mini" v-model="item.val"></el-input>
                </div>
                <i @click="addIssn" class="el-icon-circle-plus"></i>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="4">
                <div>关联图书ISBN:</div>
                <div style="margin-top:20px;">关联图书原因:</div>
            </el-col>
            <el-col :span="20" class="cont">
                <div v-for="item in isbnList" class="list">
                    <div><el-input style="width:450px;" size="mini" v-model="item.isbn"></el-input></div>
                    <div style="margin-top:10px;"><el-input style="width:450px;" size="mini" type="textarea" :autosize="{ minRows:5,maxRows: 5}" v-model="item.reason"></el-input></div>
                </div>
                <i @click="addIsbn" class="el-icon-circle-plus"></i>
            </el-col>
        </el-row>
    </div>
</template>

<script>
const querystring = require('querystring');
export default {
    data(){
      return {
          issnList:[{val:''}],
          isbnList:[{isbn:'',reason:''}]
      }
    },
    methods: {
        initData(bookData){
            if (bookData.associatedISSN&&bookData.associatedISSN.value) {
                let arr=[]
                bookData.associatedISSN.value.split(',').forEach(item=>{
                    arr.push({val:item})
                })
                this.issnList=arr
            }
            if (bookData.associatedBookISBN&&bookData.associatedBookISBN.value) {
                this.isbnList=eval(bookData.associatedBookReason.value)
            }else{
                this.$post('/api/product/getRelationProduct',querystring.stringify({isbn:this.$route.query.isbn})).then(res=>{
                    let data=eval(res.data.associatedBookReason.value)
                    if (data.length>0) {
                        this.isbnList=data
                    }
                })
            }
        },
        addIssn(){
            let obj={val:''};
            this.issnList.push(obj)
        },
        addIsbn(){
            let obj={isbn:'',reason:''};
            this.isbnList.push(obj)
        },
        saveRelevance(){
            let issnData=[]
            this.issnList.forEach(item=>{
                issnData.push(item.val)
            })
            let params={
                isbn:this.$route.query.isbn,
                issn:issnData.join(','),
                productRelations:this.isbnList
            }
            this.$post('/api/product/relationProduct',params).then(res=>{
                if (!res.success) {
                    this.$message.error(res.message);
                }
            })
        }
    }
}
</script>
<style lang='scss' scoped>
#relevance{
    font-size: 14px;
    .el-row{
        margin-top:20px;
        .tit{
            text-align: right;
            padding-right: 10px;
        }
        .cont{
            position: relative;
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

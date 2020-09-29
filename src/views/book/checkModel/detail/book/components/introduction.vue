<template>
    <div id='introduction'>
        <el-row>
            <el-col class="tit" :span="4"><label>简介:</label></el-col>
            <el-col :span="20">
                <el-input size="mini" type="textarea" :autosize="{ minRows:5,maxRows: 5}" v-model="bookData.introduction.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="4"><label>简介(中文):</label></el-col>
            <el-col :span="20">
                <el-input size="mini" type="textarea" :autosize="{ minRows:5,maxRows: 5}" v-model="bookData.cnIntroduction.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="4"><label>目次:</label></el-col>
            <el-col :span="20">
                <el-input size="mini" type="textarea" :autosize="{ minRows:5,maxRows: 5}" v-model="bookData.content.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="4"><label>目次(中文):</label></el-col>
            <el-col :span="20">
                <el-input size="mini" type="textarea" :autosize="{ minRows:5,maxRows: 5}" v-model="bookData.cnContent.value"></el-input>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data(){
      return {}
    },
    props:['bookData'],
}
</script>
<style lang='scss' scoped>
#introduction{
    font-size: 14px;
    .el-row{
        margin-top: 20px;
        .tit{
            text-align: right;
            padding-right: 10px;
        }
    }
}
</style>

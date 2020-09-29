<template>
  <div id='batchUpload' v-loading='loading'>
    <div class="cont">
        <span><i>*</i> 上传附件：</span>
        <el-input v-model="uploadfile" disabled placeholder="请选择上传文件" size="mini" style="width:200px;"></el-input>
        <el-upload
          :on-success="filesSuccessFuc"
          :on-error="filesErrorFuc"
          :show-file-list="false"
          :on-change="fileChangeFuc"
          ref="upload"
          class="upload-demo"
          action="/br/api/review/entReview/batchAddingByFile"
          :limit="1"
          :headers="{'x-access-token':xAccessToken}"
          :auto-upload="false"
          :file-list="fileList">
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
        <a @click="downloadFuc" style="cursor: pointer;">批量模板</a>
    </div>
    <div class="desc">
      <div>上传文件说明：</div>
      <div>
        <div>1、请下载批量模板，填写后上传</div>
        <div>2、文件名、内容格式需严格按照已定标准，否则无法正确导入</div>
        <div>3、录入必填项请参考单条新增必填项</div>
      </div>
    </div>
    <div class="btns">
        <el-button size="medium" @click="closeDialog">取消</el-button>
        <el-button size="medium" type="primary" :loading="btnLoading" @click="sureUpload">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
        xAccessToken: localStorage.getItem('token'),
        uploadfile:'',
        loading:false,
        btnLoading:false,
        fileList:[],
    }
  },
  methods: {
    initSysFuc(){
      if(this.$refs.upload){
        this.$refs.upload.clearFiles()
      }
      this.fileList = [];
      this.uploadfile = '';
    },
    fileChangeFuc(file, fileList){
      if(fileList.length>0){
        this.uploadfile = file.name;
      }
    },
    filesSuccessFuc(res, file, fileList){
      let {success, status, message, data} = res;
      this.initSysFuc();
      if(success && status==0){
        this.$message({
          message:message,
          type:'success'
        })
        this.closeDialog()
      }else{
        this.uploadfile = '';
        this.$message({
          message:message,
          type:'warning'
        })
      }
    },
    filesErrorFuc(err, file, fileList){
      this.initSysFuc();
      this.$message({
          message:'上传失败',
          type:'warning'
      })
    },
    sureUpload(){
      if(this.uploadfile){
        this.$refs.upload.submit();
      }else{
        this.$message({
          message:'请选择上传文件',
          type:'warning'
        })
      }
    },
    downloadFuc(){
      axios.get('br/api/review/entReview/downloadTemplate',{responseType:'blob'}).then(res=>{
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '实物审读批量新增模板'+new Date().getTime()+'.xls')
          document.body.appendChild(link)
          link.click()
      })
    },
    closeDialog(){
        this.$emit('closeDialog')
    },
  }
}
</script>
<style lang='scss' scoped>
#batchUpload{
    padding-top: 50px;
    text-align: center;
    .cont{
      margin-top:50px;
      width: 500px;
      margin: 0 auto;
      i{
        color: red;
      }
      .upload-demo{
        display:inline-block;
      }
    }
    .desc{
        text-align: left;
        color: gray;
        margin: 20px auto;
        width: 500px;
        padding-left:58px;
      }
    .btns{
      margin:30px 0 80px 0;
    }
}

</style>

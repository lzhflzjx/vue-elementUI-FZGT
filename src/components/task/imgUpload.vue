<template>
  <div id='imgUpload'>
    <div class="cont">
        <div>
            <label>图片类型：</label>
            <el-radio-group v-model="imgType">
                <el-radio label="master">封面主图</el-radio>
                <el-radio label="slave">非主图</el-radio>
            </el-radio-group>
        </div>
        <div style="margin:20px 0 10px 0;">
            <label>上传附件：</label>
            <el-input v-model="uploadfile" disabled placeholder="请选择上传文件" size="mini" style="width:200px;"></el-input>
            <input style="display:none" id="imgUploadBtn" type="file" @change="importf($event)">
            <el-button type="primary" size="mini" @click="selectFile">上传</el-button>
        </div>
        <div class="imgImportTitle">上传文件说明：上传的封面图片名称为ISBN，多张图片zip压缩后上传</div>
        <div class="btns">
            <el-button size="medium" @click="closeDialog">取消</el-button>
            <el-button @click="upload" size="medium" type="primary" :loading="btnLoading" >确定</el-button>
        </div>
    </div>
  </div>

</template>

<script>
export default {
  data(){
    return {
        uploadfile:'',
        imgType:'master',
        file:'',
        btnLoading:false
    }
  },
  methods: {
      closeDialog(){
          this.uploadfile='';
          this.file= '';
          this.$emit('closeDialog')
      },
      selectFile() {
        document.getElementById('imgUploadBtn').value='';
        document.getElementById('imgUploadBtn').click();
      },
      importf(obj) {
        this.file=''
        var f = obj.target.files[0];
        var fileName =f.name;
        var fileext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
        if (fileext != '.jpg'&&fileext != '.jpeg'&&fileext != '.png'&&fileext != '.zip') {
            this.$message.error('只能上传图片或zip压缩包');
            return;
        }
        this.uploadfile=f.name;
        this.file=f;
      },
      upload(){
        this.btnLoading = true;
        let formData = new FormData();
        formData.append('file',this.file)
        formData.append('type',this.imgType)
        this.$post('/api/image/upload',formData).then(res=>{
          this.btnLoading = false;
          let {success, message, status}  = res;
          if( status==0 ){
            if(success){
              this.$message({
                message:message,
                type:'success'
              })
              this.closeDialog();
            }else{
              this.$message({
                message:message,
                type:'warning'
              })
            }
          }else{
            this.$message({
              message:message,
              type:'warning'
            })
          }
        })
      }
  }
}
</script>
<style lang='scss' scoped>
#imgUpload{
    .cont{
        padding:30px 0 60px 130px;
        label{
            display: inline-block;
            width: 100px;
            text-align: right;
        }
        .imgImportTitle{
            color:#c1c1c1;
            font-size:12px;
            margin-left:20px;
        }
        .btns{
            margin-left:130px;
            margin-top:100px;
        }
    }
}
</style>

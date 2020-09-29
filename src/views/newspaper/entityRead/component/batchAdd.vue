<template>
  <div id='batchAdd'>
    <div class="cont">
      <div class="uploadDiv">
          <label><b class="red">*</b> 上传附件：</label>
          <el-input v-model="uploadfile" disabled placeholder="请选择上传文件" size="small" style="width:250px;"></el-input>
          <input style="display:none" id="addDataBaseBtn" type="file" @change="importf($event)">
          <el-button type="primary" size="mini" @click="selectFile">上传</el-button>
          <span @click="downLoadTemp">批量模板</span>
      </div>
      <div class="importTitle">
          <div class="tit">上传文件说明：</div>
          <div class="txt">1、请下载批量模板，填写后上传</div>
          <div class="txt">2、文件名、内容格式需严格按照已定标准，否则无法正确导入。</div>
      </div>
    </div>
    <div class="btns">
        <el-button size="medium" @click="$emit('closeDialog')">取消</el-button>
        <el-button @click="upload" size="medium" :loading="loading" type="primary">确定</el-button>
    </div>
  </div>

</template>

<script>
import axios from "axios";
export default {
  data(){
    return {
        uploadfile:'',
        file:'',
        loading:false
    }
  },
  methods: {
      downLoadTemp(){
        axios.get('br/api/paperReview/importTemplate',{responseType:'blob'}).then(res=>{
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '报刊实物审读批量新增'+new Date().getTime()+'.xls')
          document.body.appendChild(link)
          link.click()
        })
      },
      init(){
        this.uploadfile='';
        this.file='';
      },
      selectFile() {
        document.getElementById('addDataBaseBtn').value='';
        document.getElementById('addDataBaseBtn').click();
      },
      importf(obj) {
        this.file=''
        var f = obj.target.files[0];
        var fileName =f.name;
        var fileext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
        if (fileext != '.xls') {
            this.$message.error('只能上传Excel文件');
            return;
        }
        this.uploadfile=f.name;
        this.file=f;
      },
      upload(){
        if (!this.file||!this.uploadfile) {
          this.$message.warning('请上传文件')
          return
        }
        let formData = new FormData();
        formData.append('file',this.file)
        this.loading=true;
        this.$post('/api/paperReview/importFile',formData).then(res=>{
          this.loading=false;
          if(res.success){
            this.$message.success(res.message)
            this.$emit('closeDialog')
          }else{
            this.$message.error(res.message)
          }
        }).catch(err=>{
          this.loading=false;
        })
      }
  }
}
</script>
<style lang='scss' scoped>
#batchAdd{
    .cont{
      width: 500px;
      margin: auto;
      .uploadDiv{
        margin:20px 0 10px 0;
        label{
            display: inline-block;
            width: 100px;
            text-align: right;
        }
        span{
            color:#409eff;
            cursor: pointer;
            margin-left: 20px;
        }
        .red{
            color: red;
        }
      }
      .importTitle{
          color:#8e8e8e;
          font-size:14px;
          margin-left:20px;
          .tit{
              margin: 20px 0;
          }
          .txt{
              padding-left: 30px;
          }
      }
    }
    .btns{
        text-align: center;
        margin-top:100px;
    }
}
</style>

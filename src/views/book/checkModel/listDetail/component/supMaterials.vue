<template>
    <div id='supMaterials'>
        <div class="cont">
            <label><i>*</i> 上传附件：</label>
            <el-input v-model="uploadfile" disabled placeholder="请选择上传文件" size="mini" style="width:200px;"></el-input>
            <input style="display:none" id="supMaterialsBtn" type="file" @change="importf($event)">
            <el-button type="primary" size="mini" @click="selectFile">上传</el-button>
            <span @click="downLoad">材料模板</span>
        </div>
        <div class="tit">上传文件说明：请下载任务补充材料后上传，或按材料模板导出补充材料后上传</div>
        <div class="btns">
            <el-button size="medium" @click="closeDialog">取消</el-button>
            <el-button size="medium" type="primary" :loading="btnLoading" @click="sureUpload">确定</el-button>
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
          btnLoading:false
      }
    },
    methods: {
        init(){
          this.uploadfile='';  
          this.file='';  
        },
        downLoad(){
            axios.get('br/api/product/downloadTemplate',{responseType:'blob'}).then(res=>{
                if (!res.data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([res.data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', '图书库全字段模板'+new Date().getTime()+'.csv')
                document.body.appendChild(link)
                link.click()
            })
        },
        sureUpload(){
            if (this.file=='') {
                this.$message.warning('请上传文件')
                return
            }
            this.btnLoading=true;
            this.$post('/api/product/uploadAndSave',this.file).then(res=>{
                this.btnLoading=false;
                if (res.success) {
                    this.$message.success('上传成功')
                    this.closeDialog()
                    this.$emit('getList')
                } else {
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.btnLoading=false;
            })
        },
        closeDialog(){
            this.$emit('closeDialog')
        },
        selectFile() {
            document.getElementById('supMaterialsBtn').value='';
            document.getElementById('supMaterialsBtn').click();
        },
        importf(obj) {
            if (!obj.target.files) {
            return;
            }
            var _this = this;
            var f = obj.target.files[0];
            var fileName =f.name;
            var fileext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
            if (fileext != '.csv') {
                this.$message.error('只能上传csv文件');
                return;
            }
            this.uploadfile=fileName;
            let formData = new FormData();
            formData.append('file',f)
            this.file=formData
        },
    }
}
</script>
<style lang='scss' scoped>
#supMaterials{
    text-align: center;
    .cont{
        margin-top:50px;
        label{
            i{
                color: red;
            }
        }
        span{
            color: #409eff;
            font-size:12px;
            margin-left: 10px;
            cursor: pointer;
        }
    }
    .tit{
        font-size:12px;
        color:gray;
        margin-top:10px;
    }
    .btns{
        margin-top:100px;
    }
}
</style>

<template>
  <div id='redListPassword'>
    <div class="cont">
      <div class="title"><i style="color:#e6a23c;" class="el-icon-info"></i> 设置查看红名单密码</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="demo-ruleForm">
        <el-form-item label="新密码：" prop="password">
          <el-input size='small' placeholder="请输入密码" v-model.trim="form.password" show-password style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="verificationCode">
          <el-input size='small' style="width:120px;" v-model.trim="form.verificationCode" placeholder="请输入验证码"></el-input>
          <el-button size='mini' type="primary" :disabled='isDisable' @click="verification">{{btnTxt}}</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
          <el-button style="width:230px;" size="medium" type="primary" @click.native="updataPw">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      btnTxt:'发送验证码',
      isDisable:false,
      count:20,
      form:{
        verificationCode:'',
        password:''
      },
      rules: {
          verificationCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
      },
    }
  },
  methods: {
    verification(){
      var countDown = setInterval(()=>{
        if(this.count < 1){
          this.isDisable = false;
          this.btnTxt = '发送验证码';
          this.count = 20;
          clearInterval(countDown);
        }else{
          this.isDisable=true;
          this.btnTxt = this.count-- + 's后重发';
        }
      },1000);
      this.$get('/api/product/sendVerificationCode').then(res=>{
        if (res.success) {
          this.$message.success('短信发送成功，请注意查收')
        }
      })
    },
    updataPw(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params={
            verificationCode:this.form.verificationCode,
            redPwd:this.form.password,
            operater:'张三'
          }
          this.$get('/api/product/updateRedListPassword',params).then(res=>{
            if (res.success) {
              this.$message.success(res.message)
              this.form.verificationCode=''
              this.form.password=''
              this.isDisable = false;
              this.btnTxt = '发送验证码';
              this.count = 20;
            }else{
              this.$message.error(res.message)
            }
          })
        }
      });
    }
  }
}
</script>
<style lang='scss' scoped>
#redListPassword{
  padding:15px;
  background: #fff;
  min-height:100%;
  border-radius: 5px;
  box-sizing: border-box;
  .cont{
    width:300px;
    padding-top:180px;
    margin: auto;
    span{
      color: gray;
    }
    .title{
      text-align: center;
      margin-bottom:30px;
    }
    .oldPw{
      margin: 50px 0 10px 0;
    }
    .btns{
      margin-top: 50px;
      text-align:center;
    }
  }
}
</style>

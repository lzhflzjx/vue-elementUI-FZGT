<template>
  <div>
    <el-button size='mini' type="primary" :disabled='isDisable' @click="verification">{{btnTxt}}</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDisable: false,
      btnTxt: "发送验证码",
      count: 5,
    }
  },
  methods: {
    verification() {
      var countDown = setInterval(() => {
        if (this.count < 1) {
          this.isDisable = false;
          this.btnTxt = '发送验证码';
          this.count = 5;
          clearInterval(countDown);
        } else {
          this.isDisable = true;
          this.btnTxt = this.count-- + 's后重发';
        }
      }, 1000);
    }
  },
}
</script>

<style lang="scss" scoped>
</style>

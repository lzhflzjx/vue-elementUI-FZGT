<template>
  <div>

  </div>
</template>

<script>
export default {
  created() {
    this.get()
  },
  methods: {
    get() {
      var result = {
        time: (callback) => {
          this.qqq = setInterval(() => {
            let ss = '121231'
            console.log('ss')
            console.log(ss)
            callback(ss);
          }, 2000);
        }
      };
      console.log('result')
      console.log(result.time)
      result.time((ss) => {
        if (ss == '121231') {
          console.log("已清除")

          clearInterval(this.qqq);
        }
      });
      // clearInterval(this.timer);
    },
  },
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  provide(){
    return{
      reload:this.reload
    }
  },
  data() {
    return {
      isRouterAlive:true
    };
  },
  watch: {},
  created() {},
  methods: {
    reload(){
      this.isRouterAlive=false;
      this.$nextTick(()=>{
        this.isRouterAlive=true
      })
    }
  },
  computed: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  min-width: 1900px;
  height: 100%;
  overflow: hidden;
}
a{
  text-decoration: none;
  color:#409EFF;
}
</style>
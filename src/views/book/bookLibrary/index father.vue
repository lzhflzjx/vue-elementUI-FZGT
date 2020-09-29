<template>
  <div id="app">
    <child :message="message"></child>
  </div>
</template>

<script>
import child from "./child";
export default {
  name: "app",
  components: {child },
 
  data() {
    return {
      message:{age:18}
    };
  },
  mounted(){
    // 模拟异步请求
    // setTimeout( () => this.message.age = 18,2000)
  }
};
</script>

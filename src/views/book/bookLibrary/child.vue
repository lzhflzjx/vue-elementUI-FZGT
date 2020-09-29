<template>
    <div>{{age}}</div>
</template>

<script type='text/ecmascript-6'>
export default {
  props: ["message"],
  mounted() {
    console.log('this.message.age')
    console.log(this.message.age)
    this.age = this.message.age;
  },
  // watch: {
  //   message: {
  //     deep: true,
  //     handler(nv, ov) {
  //       this.age = nv.age;
  //     }
  //   }
  // },
  data() {
    return {
      age: null
    };
  }
};
</script>

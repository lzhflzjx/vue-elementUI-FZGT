<template>
  <div>
    <div class="app">
      <div ref="msgDiv">{{msg}}</div>
      <div v-if="msg1">Message got outside $nextTick: {{msg1}}</div>
      <div v-if="msg2">Message got inside $nextTick: {{msg2}}</div>
      <div v-if="msg3">Message got outside $nextTick: {{msg3}}</div>
      <button @click="changeMsg">
        Change the Message
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'data里的数据',
      msg1: '1',
      msg2: '2',
      msg3: '3'
    }
  },
  methods: {
    changeMsg() {
      this.msg = "方法里的数据"
      this.msg1 = this.$refs.msgDiv.innerHTML
      this.$nextTick(() => {
        this.msg2 = this.$refs.msgDiv.innerHTML
        this.msg3 = this.$refs.msgDiv.innerHTML
      })

    }
  }
}
new Vue({
  el: '.app',
  data: {
    msg: 'Hello Vue.',
    msg1: '1',
    msg2: '2',
    msg3: '3'
  },
  methods: {
    changeMsg() {
      this.msg = "Hello world."
      this.msg1 = this.$refs.msgDiv.innerHTML
      this.$nextTick(() => {
        this.msg2 = this.$refs.msgDiv.innerHTML
      })
      this.msg3 = this.$refs.msgDiv.innerHTML
    }
  }
})
</script>

<style lang="scss" scoped>
</style>

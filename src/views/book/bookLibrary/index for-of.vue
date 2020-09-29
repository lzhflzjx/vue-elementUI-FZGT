<template>
  <div>

  </div>
</template>

<script>
export default {
  created() {
    this.sss()
  },
  methods: {
    sss() {
      const persons = [
        { name: 'John Smith' },
        { name: 'Jane Doe' }
      ];

      for (const { name } of persons) {
        console.log(name);
      }
      // 'John Smith'
      // 'Jane Doe'

    }
  },
}
</script>

<style lang="scss" scoped>
</style>

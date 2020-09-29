<template>
  <div class="common-condition">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <i class="icon btn-list" />常用条件
        </span>
      </div>
      <div v-for="(item,index) in listData" :key="index" class="item" :title="item.title">
        <em :class="index<=2?'top':''">{{ parseInt(index+1) }}</em>
        <span @click="search(item.title)">{{ item.title }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CommonCondition',
  // props: {
  //   listData: {
  //     type: Array,
  //     default() {
  //       return []
  //     }
  //   }
  // },
  created() {
    this.listData = [1,3,4,12,41,4,12,3,5,123,123,124,12,3,14,1,23,1,4,123,1,123,123,213]
  },
  methods: {
    search(val) {
      this.$emit('advSearch', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.common-condition {
  /deep/ .el-card {
    box-shadow: none;
    border: none;
    overflow: initial;
    &__header {
      display: flex;
      padding: 20px 6px 10px;
      line-height: 16px;
      font-size: 14px;
      border-color: rgba(223, 229, 231, 1);
      color: rgba(30, 105, 181, 1);
      i {
        float: left;
        margin-right: 13px;
      }
    }
    &__body {
      padding: 0 0 0 5px;
      .item {
        margin-top: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: rgba(108, 108, 108, 1);
        cursor: pointer;
        em {
          float: left;
          width: 20px;
          height: 20px;
          margin-right: 20px;
          background: rgba(193, 193, 193, 1);
          font-style: normal;
          font-size: 12px;
          color: #fff;
          text-align: center;
          line-height: 20px;
          &.top {
            background: rgba(4, 153, 243, 1);
          }
        }
      }
    }
  }
}
</style>

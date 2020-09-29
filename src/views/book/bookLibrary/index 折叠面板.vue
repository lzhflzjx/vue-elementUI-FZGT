<template>
  <div>
    <div class="title" @click="isExpand">{{isShow?'收起':'展开'}}
      <i :class="isShow?'icon-shouqi':'icon-zhankai'"></i>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="0">
        <template slot="title">
          <div class="title">
            <!-- @click="isShow=!isShow" -->
            <!-- <i class="header-icon el-icon-info"></i> -->
            <i :title="isFold[0]?'收起':'展开'" :class="isFold[0]?'icon-shouqi':'icon-zhankai'"></i>基本信息
          </div>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item name="1">
        <template slot="title">
          <div class="title">
            <!-- @click="isShow=!isShow" -->
            <!-- <i class="header-icon el-icon-info"></i> -->
            <i :title="isFold[1]?'收起':'展开'" :class="isFold[1]?'icon-shouqi':'icon-zhankai'"></i>基本信息
          </div>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="title">
            <!-- @click="isShow=!isShow" -->
            <!-- <i class="header-icon el-icon-info"></i> -->
            <i :title="isFold[2]?'收起':'展开'" :class="isFold[2]?'icon-shouqi':'icon-zhankai'"></i>基本信息
          </div>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="title">
            <!-- @click="isShow=!isShow" -->
            <!-- <i class="header-icon el-icon-info"></i> -->
            <i :title="isFold[3]?'收起':'展开'" :class="isFold[3]?'icon-shouqi':'icon-zhankai'"></i>基本信息
          </div>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          <div class="title">
            <!-- @click="isShow=!isShow" -->
            <!-- <i class="header-icon el-icon-info"></i> -->
            <i :title="isFold[4]?'收起':'展开'" :class="isFold[4]?'icon-shouqi':'icon-zhankai'"></i>基本信息
          </div>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <div class="title">
            <!-- @click="isShow=!isShow" -->
            <!-- <i class="header-icon el-icon-info"></i> -->
            <i :title="isFold[5]?'收起':'展开'" :class="isFold[5]?'icon-shouqi':'icon-zhankai'"></i>基本信息
          </div>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
    </el-collapse>
  </div>

</template>
<script>
export default {
  data() {
    return {
      activeNames: ["0", "1", "2", "3", "4", "5"],
      isShow: false,
      isFold: [false, false, false, false, false, false],
    };
  },
  methods: {
    isExpand() {
      this.isShow = !this.isShow
      if (this.isShow == true) {
        this.activeNames = []
        this.isFold = [true, true, true, true, true, true]
      } else {
        this.activeNames = ["0", "1", "2", "3", "4", "5"]
        this.isFold = [false, false, false, false, false, false]
      }
    },
    handleChange(val) {
      console.log(val);
      for (let i = 0; i < 6; i++) {
        this.activeNames.indexOf(i.toString()) > -1 ? this.isFold[i] = false : this.isFold[i] = true
      }
    }
  }
};
</script>

<style lang="scss" scope>
.el-collapse-item__header {
  background-color: #dfefff;
}
.el-icon-arrow-right:before {
  content: "";
}
.title {
  border-bottom: solid 1px #e6e6e6;
  // border-left: solid 5px #409eff;
  cursor: pointer;
  padding-left: 5px;
  color: #409eff;
  i {
    float: left;
    margin-right: 5px;
    color: #409eff;
    cursor: pointer;
  }
}
</style>
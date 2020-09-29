<template>
  <div id="bookCheck">
    <div style="margin-bottom:15px;">
      <el-radio-group size="small" v-model="curPage" @change="changeTab">
        <el-radio-button label="1">获奖组织/人</el-radio-button>
        <el-radio-button label="2">获奖作品</el-radio-button>
        <el-radio-button label="3">获奖清单</el-radio-button>
      </el-radio-group>
    </div>
    <!-- <inquire></inquire> -->
    <organization v-if="curPage=='1'"></organization>
    <works v-if="curPage=='2'"></works>
    <checklist v-if="curPage=='3'"></checklist>
  </div>
</template>

<script>
import organization from "./components/organization";
import works from "./components/works";
import inquire from "./components/inquire";
import checklist from "./components/checklist";
export default {
  components: {
    organization,
    works,
    inquire,
    checklist
  },
  data() {
    return {
      curPage: "1"
    };
  },
  methods: {
    changeTab(){}
  },
};
</script>

<style lang="scss" scoped>
#bookCheck {
  padding: 15px;
  background: #fff;
  min-height: 100%;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>

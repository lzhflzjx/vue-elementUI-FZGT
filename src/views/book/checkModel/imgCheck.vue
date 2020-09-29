<template>
  <div id="imgCheck">
    <div style="margin-bottom:15px;">
      <el-radio-group size="small" v-model="curPage" @change="changeTab">
        <el-radio-button label="1">我的任务</el-radio-button>
        <el-radio-button label="2" v-if="permission.indexOf('超级管理员')!=-1">全部任务</el-radio-button>
        <el-radio-button label="3">任务清单</el-radio-button>
      </el-radio-group>
    </div>
    <task ref="task" v-if="curPage=='1'||curPage=='2'" @changePage="curPage='3'" :userId='userId'></task>
    <imgList v-if="curPage=='3'"></imgList>
  </div>
</template>

<script>
import task from '@/components/checkTaskPage'
import imgList from './listDetail/img'
export default {
  data(){
    return {
        curPage:'1',
        userId:JSON.parse(localStorage.getItem('userInfo')).userInfo.id,
        permission:JSON.parse(localStorage.getItem('userInfo')).userInfo.roleNames
    }
  },
  components:{
      task,
      imgList,
  },
  methods:{
    changeTab(){
      if (this.curPage=='1'||this.curPage=='2') {
        this.$router.push({path:this.$route.path})
        if (this.curPage=='1') {
          this.userId=JSON.parse(localStorage.getItem('userInfo')).userInfo.id
        }
        if (this.curPage=='2') {
          this.userId=''
        }
        this.$nextTick(()=>{
          this.$refs.task.getCurUserTask()
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
#imgCheck{
  padding:15px;
  background: #fff;
  min-height:100%;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>

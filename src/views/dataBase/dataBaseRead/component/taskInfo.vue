<template>
    <div class="infoDiv" v-loading="loading">
        <div class="attrs">
            <span>任务ID：{{taskInfo.id}}</span>
            <span>下达时间：{{taskInfo.createDate}}</span>
            <span>任务状态：{{methods.changeDict(taskStuats,taskInfo.taskStuats)}}</span>
            <span>结果状态：{{methods.changeDict(resultStuats,taskInfo.resultStuats)}}</span>
            <span>文章总量（原始）：{{taskInfo.essayCount}}</span>
            <span>文章总量（去重）：{{taskInfo.qcEssayCount}}</span>
            <span>关键词总量：{{taskInfo.wordCount}}</span>
            <span>命中关键词总量：{{taskInfo.hitWordCount}}</span>
        </div>
        <div class="type">
            关键词类别：<span v-if="taskInfo.sortName&&taskInfo.sortName.length>0">{{taskInfo.sortName.join('；')}}</span>
        </div>
        <div class="words">
            附加关键词：<span v-if="taskInfo.keyWord&&taskInfo.keyWord.length>0">{{isUnfold?taskInfo.keyWord.join('；'):taskInfo.keyWord.slice(0,20).join('；')}}</span>
            <span class="btn" v-if="taskInfo.keyWord&&taskInfo.keyWord.length>20" @click="isUnfold=!isUnfold">{{isUnfold?'收起':'展开'}}<i :class="isUnfold?'el-icon-arrow-up':'el-icon-arrow-down'"></i></span>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
      return {
          loading:false,
          isUnfold:false,
          taskInfo:[]
      }
    },
    computed:{
        ...mapGetters(['resultStuats','taskStuats'])
    },
    methods:{
        getDetail(id){
            this.loading=true;
            this.$get('/api/databaseCheck/queryDetail',{taskId:id}).then(res=>{
                this.loading=false;
                this.taskInfo=res.data;
            }).catch(err=>{
                this.loading=false;
            })
        },
    }
}
</script>
<style lang='scss' scoped>
    .infoDiv{
        min-height: 130px;
        line-height:35px;
        .attrs{
            span{
                margin-right: 25px;
            }
        }
        .words{
            .btn{
                font-size: 12px;
                color: #409eff;
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
</style>

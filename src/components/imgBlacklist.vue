<template>
  <div id='blacklist'>
      <div>已选定<b>{{list.length}}</b>张图片</div>
      <div class="cont">
          <div>
            <label><span>*</span> 敏感分类：</label>
            <el-tree  
              style="display:inline-block;" 
              ref="imgTree" 
              :data="wordTree" 
              :props="defaultProps"
              show-checkbox 
              node-key="id">
            </el-tree>
          </div>
          <div style="margin-top:20px;">
              <label><span>*</span> 审读意见：</label>
              <el-input style="width:400px;margin-left:10px;" :rows="4" type="textarea" v-model="idea"></el-input>
          </div>
          <div class="btns">
            <el-button size="medium" @click="closeDialog">取消</el-button>
            <el-button size="medium" type="primary" @click="submit">确定</el-button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            idea:'',
            checked:[],
            wordTree:[],
            defaultProps:{
                children: 'childList',
                label: 'sortName'
            },
        }
    },
    props:['list'],
    created(){
       this.getTree() 
    },
    methods: {
        getTree(){
            this.$post('/api/sortManage/findListByPraentId',{type:2}).then(res=>{
                if (res.data.result&&res.data.result.length>0) {
                    this.wordTree=res.data.result;
                }
            })
        },
        handleCheck(){
            let checkedData=this.$refs.imgTree.getCheckedNodes();
            this.checked = [];
            checkedData.forEach(item => {
                if (item && (item.checkedData == null || item.childList.length==0)) {
                    this.checked.push(item.id)
                }
            })
        },
        submit(){
            this.handleCheck()
            if (this.checked.length==0) {
                this.$message.warning('请选择敏感分类')
                return
            }
            if (!this.idea) {
                this.$message.warning('审读意见不能为空')
                return
            }
            let obj={
                class:this.checked.join(','),
                idea:this.idea
            }
            this.$emit('sendData',obj)
            this.$emit('closeDialog')
        },
        init(){
            this.checked=[]
            this.idea='';
            this.$refs.imgTree.setCheckedNodes([])
        },
        closeDialog(){
            this.$emit('closeDialog')
        },
    }
}
</script>
<style lang='scss' scoped>
#blacklist{
    b{
        color:#409eff;
    }
    .cont{
        margin-left:140px;
        margin-top: 30px;
        label{
            vertical-align: top;
            span{
                color: red;
            }
        }
        .btns{
            margin-left:150px;
            margin-top:80px;
        }
    }
}
</style>

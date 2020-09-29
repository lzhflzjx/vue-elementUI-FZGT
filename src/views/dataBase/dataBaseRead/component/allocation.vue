<template>
    <div id='allocation'>
        <div class="topTxt">
            已选定的<b>{{checkedAll?taskTotleNum:taskData.length}}</b>篇文章，文章均分到审读员
        </div>
        <div class="cont">
            <div class="readerDiv">
                <label style="vertical-align:top;" class="label"><b>*</b> 审读员：</label>
                <el-tree
                    ref="tree"
                    style="display:inline-block;"
                    :data="readerList"
                    show-checkbox
                    node-key="id"
                    @check-change="handleCheck">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                    </span>
                </el-tree>
            </div>
            <div>
                <label class="label">截止日期：</label>
                <el-date-picker
                    v-model="completeDate"
                    value-format='yyyy-MM-dd HH:mm:ss'
                    size="mini"
                    style="width:180px"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </div>
        </div>
        <div class="btns">
            <el-button size="medium" @click="$emit('closeDialog')">取消</el-button>
            <el-button :loading="btnLoading" size="medium" type="primary" @click="save">确定</el-button>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return {
            btnLoading:false,
            completeDate:'',
            checkPersList:[],
            firstChecked:''
        }
    },
    props:['taskData','checkedAll','taskTotleNum','searchParams'],
    computed:{
        ...mapGetters(['readerList'])
    },
    methods: {
        init(){
           this.$refs.tree.setCheckedNodes([])
           this.completeDate=''
        },        
        save() {
            if (this.checkPersList.length==0) {
                this.$message.warning('请分配任务')
                return
            }
            var num=0;
            var i=0;
            this.checkPersList.forEach(item=>{
                num+=item.count/1
                // 非全选时为审读员分配任务ID
                if (!this.checkedAll) {
                    item.ids=this.taskData.slice(i,i+item.count)
                }
                i+=item.count/1
            })
            // 过滤分配数为0的数据
            var readerData=JSON.parse(JSON.stringify(this.checkPersList))
            for (let i = 0; i < readerData.length; i++) {
                if (readerData[i].count<1) {
                    readerData.splice(i,1)
                    i--
                }
            }
            let taskTotal=this.checkedAll?this.taskTotleNum:this.taskData.length
            if (num!=taskTotal) {
                this.$message.warning('任务分配数与总任务数需保持一致')
                return
            }
            var params={
                reader:readerData,
                completeDate:this.completeDate,
            }
            this.btnLoading=true;
            let url=''
            if (this.checkedAll) {
                url='/api/databaseCheck/allAllocation'
                params.query=this.searchParams
            } else {
                url='/api/databaseCheck/allocation'
                params.taskId=this.searchParams.taskId
            }
            this.$post(url,params).then(res=>{
                this.btnLoading=false;
                if (res.success) {
                    this.$message.success('任务分配成功')
                    this.$emit('closeDialog')
                } else {
                    this.$message.error(res.message) 
                }
            }).catch(err=>{
                this.btnLoading=false;
            })
        },
        handleCheck(){
            this.checkPersList=[]
            let checkPer=this.$refs.tree.getCheckedNodes();
            let checkedArr=[];
            checkPer.forEach((item,index) => {
                if (!item.children) {
                    checkedArr.push(item)
                }
            })
            if (checkedArr.length==1) {
                this.firstChecked=checkedArr[0].id
            }
            if ((this.taskTotleNum==1||this.taskData.length==1)&&checkedArr.length>1) {
                this.$refs.tree.setCheckedKeys([this.firstChecked])
                this.$message.warning('一篇文章仅可以分配给一个审读员')
                return
            }
            let totalNum=0
            if (this.checkedAll) {
                totalNum=this.taskTotleNum
            } else {
                totalNum=this.taskData.length
            }
            let num=parseInt(totalNum/checkedArr.length);
            let arr=[];
            checkedArr.forEach((item,index) => {
                let obj={}
                obj.userId=item.id
                obj.name=item.label
                if (index==checkedArr.length-1) {
                    obj.count=totalNum-(num*index)
                } else {
                    obj.count=num
                }
                arr.push(obj)
            });
            this.checkPersList=arr;
        },
    }
}
</script>
<style lang='scss' scoped>
#allocation{
    .topTxt{
        b{
            color:#409eff;
            font-size:16px;
        }
    }
    .cont{
        width: 300px;
        margin: auto;
        .readerDiv{
            margin:30px 0;
            b{
                color: red;
            }
        }
    }
    .btns{
        text-align: center;
        margin-top: 60px;
    }
}
</style>

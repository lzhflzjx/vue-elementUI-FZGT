<template>
    <div id='export'>
        <div class="txt">已选定<b>{{checkedAll?curTotal:selectData.length}}</b>个任务</div>
        <div class="cont">
            <el-checkbox-group v-model="checkList">
                <el-checkbox label="1">期刊实物审读批量导出模板1</el-checkbox>
                <el-checkbox label="2">期刊实物审读批量导出模板2</el-checkbox>
                <el-checkbox label="3">期刊实物审读批量导出模板3</el-checkbox>
            </el-checkbox-group>
            <div class="btns">
                <el-button size="medium" @click="$emit('closeDialog')">取消</el-button>
                <el-button @click="upload" size="medium" :loading="loading" type="primary">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data(){
        return {
            loading:false,
            checkList: [],
        }
    },
    props:['checkedAll','queryParams','selectData','curTotal'],
    methods: {
        upload(){
            let obj={
                allFlag:this.checkedAll,
                templateTypes:this.checkList
            }
            if (this.checkedAll) {
                obj.paperReviewQuery=this.queryParams
            } else {
                let arr=[];
                this.selectData.forEach(item => {
                    arr.push(item.id)
                });
                obj.ids=arr
            }
            this.loading=true;
            axios.post('br/api/paperReview/exportFile',obj,{responseType:'blob'}).then(res=>{
                this.loading=false;
                if (!res.data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([res.data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download','报刊实物审读'+new Date().getTime()+'.zip')
                document.body.appendChild(link)
                link.click()
                this.$emit('closeDialog')
            }).catch(err=>{
                this.loading=false;
            })
        }
    }
}
</script>
<style lang='scss' scoped>
#export{
    .txt{
        b{
            color: #409eff;
        }
    }
    .cont{
        text-align: center;
        .el-checkbox{
            display: block;
            margin-right: 0;
            margin-top:15px;
        }
        .btns{
            margin-top: 80px;
        }
    }
}
</style>

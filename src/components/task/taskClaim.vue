<template>
    <div id='taskClaim' v-loading="loading">
        <div class="topTxt">
            已选定<b style="color:#409eff;font-size:16px;">{{taskData.length}}</b>项任务
        </div>
        <div class="content">
            <div class="existBook" v-if="achieveData&&achieveData.length>0">
                <div class="tit"><i style="color:#e6a23c;" class="el-icon-info"></i> 当前列表有<b style="color:#409eff;">{{achieveData.length}}</b>本书已完成人工审读，结果如下，请选择需要重审的图书</div>
                <el-table
                    ref="multipleTable"
                    :data="achieveData"
                    stripe
                    border
                    style="width:600px;"
                    size="mini"
                    :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
                    @selection-change="selectAchieve">
                    <template v-if="curGlobalType=='book'">
                      <el-table-column type="selection" width="45"></el-table-column>
                      <el-table-column type="index" label="序号" width="50"></el-table-column>
                      <el-table-column prop="isbn" width="100" label="ISBN"></el-table-column>
                      <el-table-column prop="bookname" label="书名"></el-table-column>
                      <el-table-column prop="reader" label="审读员"></el-table-column>
                      <el-table-column prop="commoncheck" label="审读结果"></el-table-column>
                    </template>  
                    <template v-if="curGlobalType=='img'">
                      <el-table-column type="selection" width="45"></el-table-column>
                      <el-table-column type="index" label="序号" width="50"></el-table-column>
                      <el-table-column prop="md5Hash" width="100" label="MD5"></el-table-column>
                      <el-table-column prop="path" label="图片路径">
                        <template slot-scope="scope">
                            <img :src="'/imgUrl/group1/book/'+scope.row.path" alt="" style="height:40px">
                          </template>
                      </el-table-column>
                      <el-table-column prop="manualReviewUser" label="审读员">
                        <template slot-scope="scope">
                            <span v-text="scope.row && scope.row.manualReviewUser && curReaderList[scope.row.manualReviewUser]?curReaderList[scope.row.manualReviewUser]:scope.row.manualReviewUser"></span>
                          </template> 
                      </el-table-column>
                      <!-- <el-table-column prop="commoncheck" label="审读结果"></el-table-column> -->
                      <el-table-column prop="manualReviewResult" label="审读结果">
                        <template slot-scope="scope">
                            <div>{{imgCheck(valOption[0],scope.row.manualReviewResult)}}</div>
                        </template>
                      </el-table-column>
                    </template>
                </el-table>
            </div>
            <div class="existBook" v-if="releaseData&&releaseData.length>0">
                <div class="tit"><i style="color:#e6a23c;" class="el-icon-info"></i> 当前列表有<b style="color:#409eff;">{{releaseData.length}}</b>本书已发布人工审读任务，任务如下，请选择需要重审的图书</div>
                <el-table
                    ref="multipleTable"
                    :data="releaseData"
                    stripe
                    border
                    size="mini"
                    style="width:600px;"
                    :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
                    @selection-change="selectRelease">
                    <template v-if="curGlobalType=='book'">
                      <el-table-column type="selection" width="45"></el-table-column>
                      <el-table-column type="index" label="序号" width="50"></el-table-column>
                      <el-table-column prop="isbn" width="100" label="ISBN"></el-table-column>
                      <el-table-column prop="bookname" label="书名"></el-table-column>
                      <el-table-column prop="reader" label="审读员"></el-table-column>
                    </template>
                    <template v-if="curGlobalType=='img'">
                      <el-table-column type="selection" width="45"></el-table-column>
                      <el-table-column type="index" label="序号" width="50"></el-table-column>
                      <el-table-column prop="md5Hash" width="100" label="MD5"></el-table-column>
                      <el-table-column prop="path" label="图片路径">
                        <template slot-scope="scope">
                            <img :src="'/imgUrl/group1/book/'+scope.row.path" alt="" style="height:40px">
                          </template>
                      </el-table-column>
                      <el-table-column prop="manualReviewUser" label="审读员">
                        <template slot-scope="scope">
                            <span v-text="scope.row && scope.row.manualReviewUser && curReaderList[scope.row.manualReviewUser]?curReaderList[scope.row.manualReviewUser]:scope.row.manualReviewUser"></span>
                          </template> 
                      </el-table-column>
                    </template>
                </el-table>
            </div>
            <div class="top">
                <label><i>*</i> 优先级：</label>
                <el-select v-model="level" size="mini" style="width:90px">
                    <el-option
                    v-for="item in reviewLevel"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="top">
                <label>计划完成时间：</label>
                <el-date-picker
                    v-model="date"
                    value-format='yyyy-MM-dd HH:mm:ss'
                    size="mini"
                    style="width:180px"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <div class="btns">
                <el-button size="medium" @click="closeDialog">取消</el-button>
                <el-button size="medium" type="primary" @click="submit">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    data(){
        return {
            level:'',
            date:'',
            achieveData:[],
            releaseData:[],
            loading:false,
            readerstatusOption:['待分配','在审读','已审读'],
            curGlobalType:'book',// img
            curReaderList:{}
        }
    },
    props:['taskData'],
    computed:{
        ...mapGetters(['readerList', 'reviewLevel','imageReadResult']),
        valOption() {
            let arr = [
                // 图片审读结果 0
                this.imageReadResult
            ];
            return arr;
            }
        },
    created() {
    // 获取字典
    this.getDictList(["imageReadResult"]);
    },
    methods: {
        ...mapActions(["getDictList"]),
        // 图片审读格式化
        imgCheck(data,type){
            data.forEach(element => {
                if (element.value == type) {
                    type = element.name
                }
            });
            return type
        },
        init(){
            this.level='';
            this.date='';
            if(this.$route.path=='/bookLibrary'){
              this.curGlobalType = 'book'
            }else{
              this.curGlobalType = 'img'
            }
            this.handlerReaderList();
            this.allocationed()
        },
        handlerReaderList(){
          this.readerList.forEach(curItem=>{
            if(curItem && curItem.children){
              curItem.children.forEach(curInnerItem=>{
                this.curReaderList[curInnerItem.id] = curInnerItem.label;
              }) 
            }
          })
        },
        selectAchieve(val){
            let ids=[];
            val.forEach(item=>{
                ids.push(this.curGlobalType=='book'?item.isbn:item.md5Hash);
            })
            this.achieveData.forEach(item=>{
                if (ids.indexOf(this.curGlobalType=='book'?item.isbn:item.md5Hash)==-1) {
                    if (this.taskData.indexOf(this.curGlobalType=='book'?item.isbn:item.md5Hash)!=-1) {
                        this.taskData.splice(this.taskData.indexOf(this.curGlobalType=='book'?item.isbn:item.md5Hash),1)
                    }
                }else{
                    this.taskData.push(this.curGlobalType=='book'?item.isbn:item.md5Hash)
                }
            })
        },
        selectRelease(val){
            let ids=[];
            val.forEach(item=>{
                ids.push(this.curGlobalType=='book'?item.isbn:item.md5Hash)
            })
            this.releaseData.forEach(item=>{
                if (ids.indexOf(this.curGlobalType=='book'?item.isbn:item.md5Hash)==-1) {
                    if (this.taskData.indexOf(this.curGlobalType=='book'?item.isbn:item.md5Hash)!=-1) {
                        this.taskData.splice(this.taskData.indexOf(this.curGlobalType=='book'?item.isbn:item.md5Hash),1)
                    }
                }else{
                    this.taskData.push(this.curGlobalType=='book'?item.isbn:item.md5Hash)
                }
            })
        },
        allocationed(){
            this.loading=true;
            this.achieveData=[];
            this.releaseData=[];
            let params={
                ids:this.taskData.join(','),
                flag:this.$route.path=='/bookLibrary'?0:1
            }
            this.$post('/api/mission/allocationed',params).then(res=>{
                if (res.data.result&&res.data.result.length>0) {
                  if(this.$route.path=='/bookLibrary'){
                    this.releaseData=res.data.result[0].reviewInfoList
                    this.achieveData=res.data.result[0].publishInfoList
                    if(this.releaseData && this.releaseData.length>0){
                        this.releaseData.forEach(item=>{
                        this.taskData.splice(this.taskData.indexOf(item.isbn),1)
                        })
                    }
                    if(this.achieveData && this.achieveData.length>0){
                        this.achieveData.forEach(item=>{
                        this.taskData.splice(this.taskData.indexOf(item.isbn),1)
                        })
                    }
                  }else{
                    this.releaseData=res.data.result[0].reviewImageList
                    this.achieveData=res.data.result[0].publishImageList
                    if(this.releaseData && this.releaseData.length>0){
                        this.releaseData.forEach(item=>{
                        this.taskData.splice(this.taskData.indexOf(item.md5Hash),1)
                        })
                    }
                    if(this.achieveData && this.achieveData.length>0){
                        this.achieveData.forEach(item=>{
                        this.taskData.splice(this.taskData.indexOf(item.md5Hash),1)
                        })
                    }
                  }
                }
                this.loading=false;
            }).catch(err=>{
                this.loading=false;
            })
        },
        submit(){
            if (this.level==='') {
                this.$message.warning('请选择优先级')
                return
            }
            if (this.taskData.length==0) {
                this.$message.warning('暂无任务可认领')
                return
            }
            let params={
                ids:this.taskData,
                completeDate:this.date,
                flag:this.$route.path=='/bookLibrary'?0:1,
                priority:this.level
            }
            this.$post('/api/mission/claim',params).then(res=>{
                if (res.success) {
                    this.$message.success('任务认领成功')
                    this.$emit('closeDialog')
                } else {
                    this.$message.error(res.message) 
                }
            })
        },
        closeDialog(){
            this.$emit('closeDialog')
        }
    }
}
</script>
<style lang='scss' scoped>
#taskClaim{
    .topTxt{
        color: gray;
    }
    .content{
        padding:30px 0 60px 230px;
        .existBook{
            margin-left:-140px;
            margin-bottom: 10px;
            .tit{
                margin:10px 0;
                font-size: 13px;
            }
        }
        .top{
            margin-top:20px;
            label{
                display: inline-block;
                width: 100px;
                text-align: right;
                i{
                    color: red;
                }
            }
        }
        .btns{
            margin-left:100px;
            margin-top:100px;
        }
    }
}
</style>

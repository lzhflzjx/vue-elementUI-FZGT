<template>
  <div id='imgLibrary'>
    <filterPage :modelName="'图片库'" @sendSearchData='getData'></filterPage>
    <div class="operateBtns">
        <el-checkbox v-model="singleCheckAll" style="margin-right:10px;" @change="singPageSelectFuc">本页全选</el-checkbox>
        <el-checkbox :disabled="totalCount>10000" v-model="checkAll" style="margin-right:10px;" @change="selectAllFuc">全选</el-checkbox>
        <el-button v-if="permission.indexOf('F_BI_ML')!=-1" size="small" type="primary" @click="openTask('任务分配')">任务分配</el-button>
        <el-button v-if="permission.indexOf('F_BI_MG')!=-1" size="small" type="primary" @click="openTask('任务认领')">任务认领</el-button>
        <el-button v-if="permission.indexOf('F_BI_MC')!=-1" size="small" type="primary" @click="openTask('新增任务')">新增任务</el-button>
        <el-button v-if="permission.indexOf('F_BI_BU')!=-1" size="small" type="primary" @click="openUpload">批量图片上传</el-button>
        <el-button v-if="permission.indexOf('F_BI_D')!=-1" size="small" type="primary" @click="imgDelFuc">图片删除</el-button>
        <el-button size="small" type="primary" @click="exportFuc">导出</el-button>
    </div>
    <div class="content">
        <div 
          class="list"
          :key="idx" 
          v-for="(item,idx) in imgData">
            <input type="checkbox" :value="item&&item.id&&item.id.value?item.id.value:idx" v-model="checkFilt" class="checkInput">
            <img  :src="item&&item.path&&item.path.value?('/imgUrl/group1/book/' + item.path.value): defaultImgSrc">
            <div class="item-desc-cont">
              <div v-text="item && item.id && item.id.value ?item.id.value:''"></div>
              <div class="snNum-cont">
                <span v-text="item && item.sn && item.sn.value ?item.sn.value:''">978-0399226908</span>
                <span @click="changeImageTypeFuc(item)" :class="[item && item.imageType && item.imageType.value && item.imageType.value=='master'?'icon-home1':'icon-home']"></span>
              </div>
              <div>
                <i class="icon-Logfileupload"></i> 
                <span v-text="item && item.update && item.update.value?item.update.value:'0000-00-00 00:00:00'">2019-09-01</span>
                ,
                <span v-text="item&&item.site&&item.site.value?item.site.value :''">Ingram</span>
              </div>
              <div>
                <span class="icon-robot"></span>
                <span v-text="item && item.autoReviewResult && item.autoReviewResult.value && autoReviewResultList[item.autoReviewResult.value] ? autoReviewResultList[item.autoReviewResult.value] :''" :class="[item && item.autoReviewResult && item.autoReviewResult.value?'curMargin':'']">灰</span>
                <span v-text="item && item.autoReviewDate && item.autoReviewDate.value ? item.autoReviewDate.value : '0000-00-00 00:00:00' ">2019-09-08</span>
              </div>
              <div>
                <span class="icon-user"></span>
                <!-- <span v-text="item && item.manualReviewUser && item.manualReviewUser.value && readerList && readerList[item.manualReviewUser.value] ? '(' + readerList[item.manualReviewUser.value]+ ')' : ''">(张三)</span> -->
                <span v-text="item && item.manualReviewUser && item.manualReviewUser.value  ? '(' + item.manualReviewUser.value+ ')' : ''">(张三)</span>
                <span v-text="item && item.manualReviewResult && item.manualReviewResult.value &&imagesManualReadResultList &&  imagesManualReadResultList[item.manualReviewResult.value]? imagesManualReadResultList[item.manualReviewResult.value] :'' "> 白 </span> 
                <span v-text="item && item.manualReviewDate && item.manualReviewDate.value ?item.manualReviewDate.value:'0000-00-00 00:00:00'">2019-09-08</span>   
                <span :title="item && item.sensitiveType && item.sensitiveType.value ? item.sensitiveType.value : '' " v-text="item && item.sensitiveType && item.sensitiveType.value ? item.sensitiveType.value : '' ">政治敏感</span>  
              </div>
            </div>
        </div>
        <div v-if="imgData.length==0">
          <noData></noData>
        </div>
    </div>
    <div class="pageAndExport" v-show="imgData.length>0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            :page-sizes="defaultPageSizes"
            :total="totalCount"
            layout="total, prev, pager, next,sizes">
        </el-pagination>
    </div>
    <el-dialog
      :title="openTaskType"
      @open='initTask(openTaskType)'
      :visible.sync="taskDialog"
      width="900px"
      center>
      <task ref="task" :modelName="'图片库'" :modelType="'img'" :taskData='checkFilt' :taskTotleNum='totalCount' :checkedAll='checkAll' :searchParams='searchParams'  @closeDialog='closeTaskDialogFuc'></task>
    </el-dialog>
    <el-dialog
      title="任务认领"
      :visible.sync="taskClaimDialog"
      width="700px"
      center>
      <taskClaim ref="taskClaim" :taskData='checkFilt' @closeDialog='closeTaskClaimDialogFuc'></taskClaim>
    </el-dialog>
    <el-dialog
      title="批量图片上传"
      :visible.sync="batchUploadDialog"
      width="700px"
      center>
      <imgUpload @closeDialog='closeImgUploadDialogFuc'></imgUpload>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import filterPage from '@/components/filter/filterPage'
import task from '@/components/task/taskAllocationAddImg'
import taskClaim from '@/components/task/taskClaim'
import imgUpload from '@/components/task/imgUpload'
import noData from '@/components/noData'
import { mapActions, mapGetters } from 'vuex'

export default {
  data(){
    return {
        openTaskType:"",
        checkFilt:[],
        checkIdsFilt:[],
        currentPage:1,
        singleCheckAll:false,
        checkAll:false,
        taskDialog:false,
        taskClaimDialog:false,
        batchUploadDialog:false,
        imgData:[],
        totalCount:0,
        searchParams:{
          pageSize:20,
          pageNo:1
        },
        defaultImgSrc:require('../../../assets/img/default.png'),
        defaultPageSizes:[20, 40, 60, 80, 100],
        permission:JSON.parse(localStorage.getItem('userInfo')).permission,
        imagesManualReadResultList:{},
        readerList:{},
        autoReviewResultList:{}
    }
  },
  components:{
    filterPage,
    task,
    taskClaim,
    imgUpload,
    noData
  },
  computed:{
    ...mapGetters(['reader', 'autoReviewResult']),
  },
  created(){
    // this.getImagesManualReadResultFuc()
    this.getCodeFuc('autoReviewResult')
    this.getCodeFuc('imagesManualReadResult')
    this.getUserList();
  },
  mounted(){
    // this.getImgList()
  },
  methods: {
    getUserList(){
      let obj={
          permission:'F_BI_MG',
          flag:1
      }
      this.$get('/api/mission/getUserList',obj).then(res=>{
          if (res.data.result&&res.data.result.length>0) {
              var personList={}
              res.data.result.forEach(item=>{
                  personList[item.id] = item.name
              })
              this.readerList = personList
          }
      })
    },
    getCodeFuc(curCode){
      // 图片库人审结果
      this.$get('/api/dic/selectByCode', {
        code:curCode
      }).then(res=>{
        let {status, success, data} = res;
        if(status==0 && success){
          if(data && data.dictionaryInfoList && data.dictionaryInfoList.length>0){
             data.dictionaryInfoList.forEach(curItem=>{
              if(curItem && curItem.value){
                if('autoReviewResult'== curCode){
                  this.autoReviewResultList[curItem.value] = curItem && curItem.name ?curItem.name:''; 
                }else if('imagesManualReadResult' == curCode){
                  this.imagesManualReadResultList[curItem.value] = curItem && curItem.name ?curItem.name:'';
                  // console.log('this.imagesManualReadResultList===',this.imagesManualReadResultList)
                }
              }
            });
          }
        }else{
          this.$message({
            message:message,
            type:'warning'
          })
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    getIdsFuc(){
      this.checkIdsFilt = []
      this.imgData.forEach(curItem=>{
        if(curItem.sn && curItem.sn.value){
          if(this.checkFilt.indexOf(curItem.sn.value)>-1){
            if(curItem.id && curItem.id.value){
              this.checkIdsFilt.push(curItem.id.value)
            }
          }
        }
      })
    },
    exportFuc(){
      // 导出
      if(this.checkFilt && this.checkFilt.length>0){
        // this.getIdsFuc();
        let curReq = {
          flag: 1,
          id: 2,
          params: [
            {
              field: "id",
              grammar: "equal",
              type: "String",
              logic: "and",
              value: this.checkFilt
            }
          ]
        }
        axios({
          method: 'post',
          url: '/br/api/image/export',
          data: curReq,
          responseType: 'blob'
        }).then(res=>{
          if (!res.data) {
              return
          }
          let fileName='图片库'+new Date().getTime()+'.zip'
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download',fileName)
          document.body.appendChild(link)
          link.click()
        })
      }else{
        this.$message({
          message:'请选择导出任务',
          type:'warning'
        })
      }
    },
    singPageSelectFuc(){
      this.checkAll=false;
      this.checkItemJudgeFuc()
    },
    selectAllFuc(){
      this.singleCheckAll = false
      this.checkItemJudgeFuc()
    },
    initPageParams(){
      this.initSelectItems()
      this.searchParams.pageSize  = 20;
      this.searchParams.pageNo = 1;
    },
    getData(obj){
      this.searchParams=obj;
      this.initPageParams();
      this.getImgList();
      
    },
    checkItemJudgeFuc(){
      this.checkFilt = [];
      if(this.imgData && this.imgData.length>0 && ( this.checkAll || this.singleCheckAll)){
        // 全选
        this.imgData.forEach(curItem=>{
          if(curItem && curItem.id && curItem.id.value){
            this.checkFilt.push(curItem.id.value)
          }
        })
      }
    },
    handlerImgDataFuc(){
      // 列表审读者
      console.log('autoReviewResult:====', this.readerList)
      // this.reader.forEach(curItem=>{
      //   this.readerList[curItem.value] = curItem.name;
      // })

      // this.autoReviewResult.forEach(curItem=>{
      //   this.autoReviewResultList[curItem.value] = curItem.name;
      // })
    },
    getImgList(){
      console.log(JSON.stringify(this.searchParams))
      this.imgData = [];
      this.$post('/api/image/find', this.searchParams).then(res=>{
        let {data, exception, message, status, success} = res
        if(success){
          if(status==0){
            this.imgData = data && data.result ? data.result :[];
            this.$nextTick(()=>{
              this.handlerImgDataFuc();
            })
            this.checkItemJudgeFuc()
            if(data && data.totalCount){
              this.totalCount = data.totalCount
            }else{
               this.totalCount = 0;
            }
          }else{
            this.showMessage(message)
          }
        }else{
          this.showMessage(message)
        }
      })
    },
    clearSelectItem(){
      // 初始化全选和已选择项目
      this.checkAll = false;
      this.checkFilt = [];
    },
    openTask(type){
      if (type=='新增任务') {
        this.clearSelectItem();
        this.checkFilt = [];
        this.openTaskType=type;
        // this.getIdsFuc();
        this.taskDialog=true;
        this.$nextTick(()=>{
          this.$refs.task.handlerReaderList()
        })
        
      }else{
        if(this.checkFilt && this.checkFilt.length>0){
          if (type=='任务分配') {
            this.openTaskType=type;
            // this.getIdsFuc();
            this.taskDialog=true;
            this.$nextTick(()=>{
              this.$refs.task.handlerReaderList()
            })
          }
          if (type=='任务认领') {
            // this.getIdsFuc();
            this.taskClaimDialog=true;
            this.$nextTick(()=>{
              this.$refs.taskClaim.init();
            })
          }
        }else{
          this.$message.warning('请选择任务');
        }
        
      }
    },
    imgDelFuc(){
      if(this.checkAll){
        this.$message({
          type:'warning',
          message:'全选功能不支持删除，请选择具体项删除'
        })
        return false;
      }
      if(this.checkFilt && this.checkFilt.length>0){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let curPathStrings = [];
          let curPaths = [];
          this.imgData.forEach(curItem=>{
            if(curItem.id && curItem.id.value){
              if(this.checkFilt.indexOf(curItem.id.value)>-1){
                // if(curItem.path && curItem.path.value){
                //   curPathStrings.push(curItem.path.value)
                // }
                if(curItem.id && curItem.id.value){
                  curPathStrings.push(curItem.id.value)
                  curPaths.push(curItem.path && curItem.path.value ? curItem.path.value : '')
                }
              }
            }
          })
          this.$get('/api/image/delete',{
            ids: curPathStrings.join(','),
            paths:curPaths.join(',')
          }).then(res=>{
              let { status, success, message } = res;
              if(status==0 && success){
                this.$message({
                  type:'success',
                  message:'删除成功'
                })
                this.initSelectItems();
                this.getImgList();
              }else{
                this.$message({
                  type:'warning',
                  message:message
                })
              }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }else{
        this.$message({
          type:'warning',
          message:'请选择元素'
        })
      }
    },
    openUpload(){
      this.initSelectItems();
      this.batchUploadDialog=true;
      // this.$nextTick(()=>{
      //   this.$refs.batchUpload.init();
      // })
    },
    initTask(data){
      this.$nextTick(()=>{
        this.$refs.task.init(data);
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.searchParams.pageSize = val;
      this.getImgList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.searchParams.pageNo = val;
      this.getImgList();
    },
    showMessage(msg, type){
      this.$message({
        message:msg,
        type:type?type:'waring'
      })
    },
    closeTaskDialogFuc(){
      this.taskDialog=false;
      this.initSelectItems();
      this.getImgList();
    },
    closeTaskClaimDialogFuc(){
      this.taskClaimDialog = false;
      this.initSelectItems();
      this.getImgList();
    },
    closeImgUploadDialogFuc(){
      this.initPageParams();
      this.getImgList();
      this.batchUploadDialog=false;
    },
    initSelectItems(){
      this.checkFilt = [];
      this.checkAll = false;
      this.singleCheckAll = false;
    },
    changeImageTypeFuc(curItem){
      if(curItem && curItem.imageType && curItem.imageType.value && curItem.imageType.value == 'slave'){
        this.$confirm('此操作将本图设为主图, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
          let curReq = {
            isbn: curItem && curItem.sn && curItem.sn.value? curItem.sn.value : null,
            id: curItem && curItem.id && curItem.id.value ? curItem.id.value : null
          };
          this.$get( '/api/image/changeImageType', curReq ).then(res=>{
            let { success, status, message } = res;
            if(success && status==0){
              this.$message({
                message:message,
                type:'success'
              })
              this.initPageParams();
              this.getImgList();
            }else{
              this.$message({
                message:message,
                type:'warning'
              })
            } 
          }).catch(err=>{
            console.log(err)
          })
        }).catch(err=>{
          this.$message({
              type: 'info',
              message: '已取消本次操作'
            });      
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
    .curMargin{
      margin-right: 10p;
    }
    #imgLibrary{
        padding:15px;
        background: #fff;
        min-height:100%;
        border-radius: 5px;
        box-sizing: border-box;
        .operateBtns{
            margin-bottom:10px;
        }
        .content{
            .list{
                position: relative;
                display:inline-block;
                width:19%;
                padding:5px;
                font-size:14px;
                text-align: center;
                .checkInput{
                    position:absolute;
                    top:5px;
                    left:5px;
                }
                img{
                  height: 200px;
                  // width: calc( 100% - 30px);
                  width: 100%;
                }
                .item-desc-cont{
                  text-align: left;
                  &>div{
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                  }
                  .snNum-cont{
                    position: relative;
                    span:nth-child(2){
                      position: absolute;
                      right: 0;
                      cursor: pointer;
                    }
                    &:after{
                      content: '';
                      display: block;
                      clear: both;
                      width: 100%;
                    }
                  }
                }
            }
        }
        .pageAndExport{
            margin-top: 20px;
        }
    }
</style>

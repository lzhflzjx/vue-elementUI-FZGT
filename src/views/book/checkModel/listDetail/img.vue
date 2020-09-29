<template>
  <div id='imgList' v-loading="loading">
    <filterPage :modelName="'图片清单'" @sendSearchData='getData'></filterPage>
    <div class="operateBtns">
        <el-checkbox v-model="singleCheckAll" style="margin-right:10px;" @change="singPageSelectFuc">本页全选</el-checkbox>
        <el-checkbox :disabled="totalCount>10000" v-model="checkAll" style="margin-right:10px;"  @change="selectAllFuc">全选</el-checkbox>
        <el-button v-if="permission.indexOf('F_BI_SET_W')!=-1" size="small" type="primary" @click="setWhiteListFuc">设为白名单</el-button>
        <el-button v-if="permission.indexOf('F_BI_SET_D')!=-1" size="small" type="primary" @click="setPendingFuc">设为待定</el-button>
        <el-button v-if="permission.indexOf('F_BI_SET_B')!=-1" size="small" type="primary" @click="setBlackListFuc">设为黑名单</el-button>
        <el-button size="small" type="primary" @click="exportFuc">导出</el-button>
    </div>
    <div class="content">
        <div 
          v-for="(item,idx) in imgData"
          :key="idx"
          class="list">
            <input type="checkbox" :value="item && item.md5Hash ? item.md5Hash:idx" v-model="checkFiltIdsMd5Hash" class="checkInput">
            <!-- <input type="checkbox" :value="item && item.sn ? item.sn:idx" v-model="checkFilt" class="checkInput"> -->
            <img :src="item && item.path ? ('/imgUrl/group1/book/' + item.path) : defaultImgSrc"  style="width:calc(100% - 30px);">
            <div class="item-desc-cont">
              <div class="snNum-cont">
                <span v-text="item && item.sn ? item.sn:''">978-0399226908</span>
                <span :class="'priorityClass'+item.priority" v-text="item && item.priority && reviewLevelList[item.priority] ? reviewLevelList[item.priority] : '低'"></span>
              </div>
              <div>
                <i class="icon-bianhao"></i> 
                <span v-text="item && item.missionId ? '#' + item.missionId:'#0000'">#12321</span>
                ,
                <span v-text="item&&item.site?item.site :''">Ingram</span>
              </div>
              <div>
                <div>
                  CT：<span v-text="item && item.createDate ? methods.changeTime(item.createDate) :'0000-00-00 00:00:00'"></span>
                </div>
                <div>
                  RT：<span v-text="item && item.completeDate ? methods.changeTime(item.completeDate) :'0000-00-00 00:00:00'"></span>
                </div>
              </div>
              <div>
                <span class="icon-robot"></span>
                <span v-text="item && item.autoReviewResult ? item.autoReviewResult :''" :class="[item && item.autoReviewResult?'curMargin':'']">灰</span>
                <span v-text="item && item.autoReviewDate ? methods.changeTime(item.autoReviewDate): '0000-00-00 00:00:00' ">2019-09-08</span>
              </div>
              <div>
                <span class="icon-user"></span>
                <span v-text="item && item.manualReviewUser ? '(' + item.manualReviewUser+ ')' :''">(张三)</span>
                <!-- <span v-text="item && item.manualReviewUser && readerList[item.manualReviewUser] ? '(' + readerList[item.manualReviewUser]+ ')' :''">(张三)</span> -->
                <!-- <template v-if="item && item.manualReviewResult && imagesManualReadResultList[item.manualReviewResult]">
                  <span v-if="imagesManualReadResultList[item.manualReviewResult]=='白名单' || imagesManualReadResultList[item.manualReviewResult]=='白'">白</span>
                  <span v-else-if="imagesManualReadResultList[item.manualReviewResult]=='黑名单' || imagesManualReadResultList[item.manualReviewResult]=='黑'">黑</span>
                  <span v-else="imagesManualReadResultList[item.manualReviewResult]=='待定'">待定</span>
                </template>   -->
                <template v-if="item && item.manualReviewResult">
                  <span v-if="item.manualReviewResult=='白名单'">白</span>
                  <span v-else-if="item.manualReviewResult=='黑名单'">黑</span>
                  <span v-else-if="item.manualReviewResult=='待定'">待定</span>
                </template>  
                <span :title="item && item.sensitiveType ? item.sensitiveType :''" v-text="item && item.sensitiveType ? item.sensitiveType :''">(张三)</span>
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
            :page-size="searchParams.pageSize"
            :current-page="searchParams.pageNo"
            :page-sizes="defaultPageSizes"
            :total="totalCount"
            layout="total, prev, pager, next,sizes">
        </el-pagination>
        <div style="color:gray;" v-if="false">
            <i class="el-icon-s-tools"></i> 导出 <span>excel</span><el-divider direction="vertical"></el-divider><span>csv</span><el-divider direction="vertical"></el-divider><span>pfd</span>
        </div>
    </div>

    <el-dialog
      title="设为黑名单"
      @open='initBlackList'
      :visible.sync="blackListDialog"
      width="800px"
      center>
      <blacklist ref="blacklist" :list="bookList" @sendData="blackListAction"  @closeDialog='closeBlackListFuc'></blacklist>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from "axios"
import filterPage from '@/components/filter/filterPage'
import blacklist from '@/components/imgBlacklist'
import noData from '@/components/noData'
export default {
  data(){
    return {
        loading:false,
        checkFilt:[],
        checkFiltIdsMd5Hash:[],
        currentPage:1,
        curPageSize:20,
        totalCount:0,
        blackListDialog:false,
        checkAll:false,
        singleCheckAll:false,
        imgData:[],
        searchParams:{
          pageSize:20,
          pageNo:1
        },
        defaultPageSizes:[20, 40, 60, 80, 100],
        defaultImgSrc:require('../../../../assets/img/default.png'),
        bookList:[],
        permission:JSON.parse(localStorage.getItem('userInfo')).permission,
        readerList:{},
        reviewLevelList:{},
        imagesManualReadResultList:{}
    }
  },
  components:{
    filterPage,
    blacklist,
    noData
  },
  computed:{
    ...mapGetters(['reviewLevel','reader','imagesManualReadResult']),
  },
  created(){
    // this.getSearchData();
  },
  methods: {
    handlerReqParmas(handleType){
      // https://kb.fzyun.io/projects/ztshd/wiki/%E5%9B%BE%E4%B9%A6%E5%9B%BE%E7%89%87%E5%AE%A1%E8%AF%BB%E4%BF%9D%E5%AD%98%E6%8E%A5%E5%8F%A3
      // handleType: 0(白名单),1(待定),2(黑名单)
      let curActionParamsArray = [];
      let curHandleTypeObj = this.imagesManualReadResultList;
      let curHandlerTypeList = ['白名单', '待定', '黑名单'];
      let curHandleType;
      for(let key in curHandleTypeObj){
        if( curHandleTypeObj[key] == curHandlerTypeList[handleType]){
          curHandleType = key;
        }
      }
      this.imgData.forEach(curItem=>{
        // if(curItem.sn && this.checkFilt.indexOf(curItem.sn)>-1){
        if(curItem.md5Hash && this.checkFiltIdsMd5Hash.indexOf(curItem.md5Hash)>-1){
          let innerCurItem = {};
          innerCurItem.isbn = curItem.sn;
          innerCurItem.type = 'pic';
          innerCurItem.manualReviewResult = curHandleType?curHandleType:handleType;
          innerCurItem.md5 = curItem.md5Hash;
          innerCurItem.sensitiveClassification = curItem.sensitiveType;
          innerCurItem.reviewOpinion = '';
          innerCurItem.createUser = '';
          curActionParamsArray.push(innerCurItem)
        }
      })
      return curActionParamsArray;
    },
    blackListAction(curObj){
      // 设置黑名单
      let curBookList = this.bookList.map(curItem=>{
        curItem.reviewOpinion = curObj && curObj.idea ? curObj.idea : '';
        curItem.sensitiveClassification = curObj && curObj.class ? curObj.class : '';
        return curItem;
      });
      this.$post('/api/review/person/saveList', curBookList).then(res=>{
        let { success, message, status} = res;
        if(success && status==0){
          this.$message({
            message:message,
            type:'success'
          })
          this.initPageParams();
          this.getSearchData();
        }else{
          this.$message({
            message:message,
            type:'warning'
          })
        }
      }).catch(err=>{
        this.initSelectItems()
      })
    },
    setWhiteListFuc(){
      // 设置白名单
      // if(this.checkFilt && this.checkFilt.length>0){
      if(this.checkFiltIdsMd5Hash && this.checkFiltIdsMd5Hash.length>0){
        let curActionParamsArray = this.handlerReqParmas(0);
        this.$confirm( '确认设置为白名单？', '提示', {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          curActionParamsArray[0].sensitiveClassification = ""
          this.$post('/api/review/person/saveList', curActionParamsArray).then(res=>{
            let { success, message, status} = res;
            if(success && status==0){
              this.$message({
                message:message,
                type:'success'
              })
              this.initPageParams();
              this.getSearchData();
            }else{
              this.$message({
                message:message,
                type:'warning'
              })
            }
          }).catch(err=>{
              this.initSelectItems()
          })
        }).catch(()=>{
          this.initSelectItems()
        })
      }else{
        this.$message({
          message:'请选择要操作的元素',
          type:'warning'
        })
      }
      
    },
    setPendingFuc(){
      // 设为待定
      // if(this.checkFilt && this.checkFilt.length>0){
      if(this.checkFiltIdsMd5Hash && this.checkFiltIdsMd5Hash.length>0){
        let curActionParamsArray = this.handlerReqParmas(1);
        this.$confirm( '确认设置为待定？', '提示', {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.$post('/api/review/person/saveList', curActionParamsArray).then(res=>{
            let { success, message, status} = res;
            if(success && status==0){
              this.$message({
                message:message,
                type:'success'
              })
              this.initPageParams();
              this.getSearchData();
            }else{
              this.$message({
                message:message,
                type:'warning'
              })
            }
          }).catch(err=>{
            this.initSelectItems()
          })
        }).catch(()=>{
          this.initSelectItems()
        })
      }else{
        this.$message({
          message:'请选择要操作的元素',
          type:'warning'
        })
      }
    },
    setBlackListFuc(){
      // 设置黑名单
      // if(this.checkFilt && this.checkFilt.length>0){
      if(this.checkFiltIdsMd5Hash && this.checkFiltIdsMd5Hash.length>0){
        this.bookList = this.handlerReqParmas(2);
        this.blackListDialog=true
      }else{
        this.$message({
          message:'请选择要操作的元素',
          type:'warning'
        })
      }
    },
    closeBlackListFuc(){
      this.blackListDialog=false;
      // this.initPageParams();
      // this.getSearchData();
    },
    exportFuc(){
      // 导出
      // if(this.checkFilt && this.checkFilt.length>0){
      if(this.checkFiltIdsMd5Hash && this.checkFiltIdsMd5Hash.length>0){
        let curIds = [];
        this.imgData.forEach(curItem=>{
          // if(curItem && curItem.sn && this.checkFilt.indexOf(curItem.sn)>-1){
          if(curItem && curItem.md5Hash && this.checkFiltIdsMd5Hash.indexOf(curItem.md5Hash)>-1){
            if(curItem && curItem.id){
              curIds.push(curItem.id)
            }
          }
        })
        this.initSelectItems();
        let curReq = {
          flag: 1,
          ids: curIds.join(',')
        }
        axios({
          method: 'post',
          url: '/br/api/mission/exportMissionImage',
          data: curReq,
          responseType: 'blob'
        }).then(res=>{
          if (!res.data) {
              return
          }
          let fileName='图片审读'+new Date().getTime()+'.zip'
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
    initBlackList(){
    //   this.$nextTick(()=>{
    //     this.$refs.task.init('任务分配');
    //   })
    },
    judegeNullFuc(paramsObj){
      let curResult = Object.assign({}, paramsObj);
      curResult.params = []
      if(paramsObj && paramsObj.params && paramsObj.params.length>0){
        paramsObj.params.forEach(curItem=>{
          if(curItem && curItem.value && curItem.value.length>0){
            curResult.params.push(curItem)
          }
        })
      }
      return curResult;
    },
    getData(obj){
      this.searchParams= this.judegeNullFuc(obj);
      if (this.$route.query.id) {
        this.searchParams.params.push({
          field:'missionId',
          grammar: "equal",
          logic: "and",
          type: "digital",
          value:this.$route.query.id.toString().split(',')
        })
      }
      this.initPageParams();
      this.getSearchData();
    },
    checkItemJudgeFuc(){
      this.checkFilt = [];
      this.checkFiltIdsMd5Hash = [];
      if(this.imgData && this.imgData.length>0 && ( this.checkAll || this.singleCheckAll)){
        // 全选
        this.imgData.forEach(curItem=>{
          if(curItem && curItem.sn){
            this.checkFilt.push(curItem.sn)
          }
          if(curItem && curItem.md5Hash){
            this.checkFiltIdsMd5Hash.push(curItem.md5Hash);
          }
        })
      }
    },
    handlerImgDataFuc(){
      // 主要做码表对应关系转换
      console.log(this.imagesManualReadResult);
      // 列表审读者
      this.reader.forEach(curItem=>{
        this.readerList[curItem.value] = curItem.name;
      })
      // 列表优先级
      this.reviewLevel.forEach(curItem=>{
        this.reviewLevelList[curItem.value] =curItem.name
      })
      // 黑白名单
      this.imagesManualReadResult.forEach(curItem=>{
        this.imagesManualReadResultList[curItem.value] = curItem.name;
      })
    },
    getSearchData(){
      this.imgData=[];
      this.loading=true;
      this.searchParams.flag=1;
      this.$post('/api/mission/getMissionImage',this.searchParams).then(res=>{
        this.loading=false;
        let {success, message, status, data} = res;
        if(status==0 && success){
          if (data.result && data.result.length>0) {
            this.imgData= data.result;
            this.handlerImgDataFuc();
            this.checkItemJudgeFuc()
          }
        }else{
          this.$message({
            message:message,
            type:'warning'
          })
        }
        if(data && data.totalCount){
          this.totalCount=data.totalCount
        }else{
          this.totalCount = 0
        }
        
      }).catch(err=>{
        this.loading=false;
      })
    },
    handleSizeChange(val) {
      this.searchParams.pageSize = val;
      this.getSearchData();
    },
    handleCurrentChange(val) {
      this.searchParams.pageNo = val;
      this.getSearchData();
    },
    initPageParams(){
      this.initSelectItems()
      this.searchParams.pageSize  = 20;
      this.searchParams.pageNo = 1;
    },
    initSelectItems(){
      this.checkFilt = [];
      this.checkFiltIdsMd5Hash = [];
      this.checkAll = false;
      this.singleCheckAll = false;
    }
  }
}
</script>
<style lang='scss' scoped>
    .curMargin{
      margin-right: 10p;
    }
    #imgList{
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
                .checkInput{
                    position:absolute;
                    top:5px;
                    left:5px;
                }
                img{
                  height: 200px;
                  width: calc( 100% - 30px);
                }
            }
        }
        .pageAndExport{
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            span{
            color: #409eff;
            cursor: pointer;
            }
        }
    }
    .item-desc-cont{
      &>div{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .snNum-cont{
      position: relative;
      span:nth-child(2){
        position: absolute;
        right: 30px;
        cursor: pointer;
      }
      &:after{
        content: '';
        display: block;
        clear: both;
        width: 100%;
      }
    }
    .priorityClass1{
      color: red;
    }
    .priorityClass2{
      color: #d3a724;
    }
</style>

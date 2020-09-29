<template>
  <div id='imgCheck' v-loading="loading">
      <div class="noData" v-if="noData">暂无数据</div>
      <div class="top" v-if="imgData.length>0">
          <div>
            <el-checkbox v-model="checkedAll" @change="checkAll">全部</el-checkbox>
          </div>
          <div>
            <el-button size="mini" v-for="item in imagesManualReadResult" :key="item.value" @click="handleImg(item.name,item.value)">{{'设为'+item.name}}</el-button>
          </div>
      </div>
      <div class="content">
          <div class="item" v-for="(item,index) in imgData">
              <input type="checkbox" :value="item.id.value" v-model="checkedList">
              <img :src="item.path.value" lazy>
              <div class="result" v-if="item.manualReviewResult||item.autoReviewResult">
                <span class="tit">{{item.manualReviewResult?'人审':'机审'}}</span>
                <span v-if="item.manualReviewResult">
                  <el-tag size="mini" type="info" v-for="typeName in item.manualReviewResult.value" :key="typeName">{{typeName}}</el-tag>
                </span>
                <span v-else>
                  <el-tag size="mini" type="info">{{item.autoReviewResult.value}}</el-tag>
                  <span v-if="item.sensitiveContent&&item.sensitiveContent.value">
                    <el-tag v-for="tag in item.sensitiveContent.value.split(',')" :key="tag" size="mini" type="info">{{tag}}</el-tag>
                  </span>
                </span>
              </div>
          </div>
      </div>
      <el-dialog
          title="设为黑名单"
          @open='initBlackList'
          :visible.sync="blackListDialog"
          width="800px">
          <blacklist ref="blacklist" :list='checkedList' @sendData="getParams" @closeDialog='blackListDialog=false'></blacklist>
      </el-dialog>
  </div>
</template>

<script>
import blacklist from '@/components/imgBlacklist'
import {mapGetters} from 'vuex'
export default {
  data(){
    return {
        checkedList:[],
        checkedAll:false,
        blackListDialog:false,
        imgData:[],
        sensitiveWord:[],
        noData:false,
        loading:false,
        blackListParams:'',
        blacklistId:''
    }
  },
  created(){
    // this.getInfo()
    this.getImgList()
  },
  components:{
    blacklist
  },
  computed:{
    ...mapGetters(['imagesManualReadResult','imagesAutoReviewResult'])
  },
  methods: {
    handleImg(name,value){
      if (name=='黑名单') {
        this.blacklistId=value
        if (this.checkedList.length==0) {
          this.$message.warning('请选择图片')
          return
        }
        this.blackListDialog=true
      } else {
        this.changeType(value,'设为'+name)
      }
    },
    getParams(data){
      this.blackListParams=data
      this.changeType(this.blacklistId,'设为黑名单')
    },
    initBlackList(){
      this.$refs.blacklist.init()
    },
    getImgList(){
      this.loading=true
      this.noData=false
      this.imgData=[];
      this.checkedAll=false;
      this.checkedList=[];
      let params={
        isbn:this.$route.query.isbn,
        pageSize:1000,
        pageNo:1,
      }
      this.$get('/api/image/findProductImageByIsbnIs',params).then(res=>{
        this.loading=false
          if (res.data.result&&res.data.result.length>0) {
            res.data.result.forEach(item=>{
              item.path.value='/imgUrl/group1/book/'+item.path.value
              if (item.manualReviewResult) {
                let name=this.methods.changeDict(this.imagesManualReadResult,item.manualReviewResult.value)
                if (name=='黑名单') {
                  let arr=[]
                  this.$post('/api/sortManage/sortList',{ids:item.sensitiveType.value.split(',')}).then(res=>{
                    if (res.data.result&&res.data.result.length>0) {
                      res.data.result.forEach(word=>{
                        arr.push(word.sortName)
                      })
                    }
                  })
                  item.manualReviewResult.value=arr
                } else {
                  item.manualReviewResult.value=[name]
                }
              }
              if (item.autoReviewResult) {
                item.autoReviewResult.value=this.methods.changeDict(this.imagesAutoReviewResult,item.autoReviewResult.value)
              }
            })
            this.imgData=res.data.result
          }else{
            this.noData=true
          }
      }).catch(err=>{
        this.loading=false
      })
    },
    changeType(type,label){
      if (this.checkedList.length==0) {
        this.$message.warning('请选择图片')
        return
      }
      this.$confirm('确定'+label+'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        let params=[]
        this.checkedList.forEach(id=>{
          let obj={
            isbn:this.$route.query.isbn,
            type:'pic',
            manualReviewResult:type,
            md5:id,
          }
          if (label=='设为黑名单') {
            obj.sensitiveClassification=this.blackListParams.class
            obj.reviewOpinion=this.blackListParams.idea
          }
          params.push(obj)
        })
        this.loading=true
        this.$post('/api/review/person/saveList',params).then(res=>{
          this.loading=false
          if (res.success) {
            this.$message.success('设置成功');
            this.getImgList()
          }else{
            this.$message.error(res.message);
          }
        }).catch(err=>{
          this.loading=false
        })
      })
    },
    getInfo(){
        let params={
            isbn:this.$route.query.isbn,
            type:'pic'
        }
        this.$get('/api/review/person/findByIsbnIsAndTypeIs',params).then(res=>{
            if (res.data.result&&res.data.result.length>0) {
                let data=res.data.result[0];
            }
        })
    },
    checkAll(data){
      if (this.checkedAll) {
        let arr=[]
        this.imgData.forEach(item=>{
          arr.push(item.id.value)
        })
        this.checkedList=arr
      }else{
        this.checkedList=[]
      }
    },
  }
}
</script>
<style lang='scss' scoped>
#imgCheck{
    min-height:200px;
    font-size:14px;
    .noData{
      color: #c1c1c1;
      text-align: center;
      margin-top:30px;
    }
    .top{
        display: flex;
        justify-content: space-between;
    }
    .content{
        max-height:1030px;
        overflow-y: auto;
        margin-top:30px;
        .item{
            position: relative;
            display: inline-block;
            width: 31%;
            margin-right: 10px;
            margin-bottom: 10px;
            vertical-align: top;
            input{
                position: absolute;
                top:0;
                left:0;
            }
            img{
               width:100%;
               height: 260px;
            }
            .result{
              .tit{
                padding:1px 3px;
                font-size: 12px;
                background: #e0efff;
                border-radius: 3px;
              }
              .el-tag{
                margin-right: 6px;
                margin-top: 5px;
              }
            }
        }
    }
}
</style>

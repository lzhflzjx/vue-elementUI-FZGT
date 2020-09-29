<template>
    <div class="main-entityRead-body">
      <div>
          <span @click="changePageName(0)" style="cursor: pointer;color: #409EFF;">
            <i class="el-icon-arrow-left"></i>
            返回
          </span>
          <span class="backpageTitle">
            单条新增
          </span>
      </div>
      <div class="baseInfosCont">
        <div class="baseDataTitle">
          <span>基本信息</span>
          <span class="alertText">*为必填项</span>
        </div>
        <div class="baseDataCont">
            <div 
              :key="idx"
              v-for="(baseHeader,idx) in baseInfosHeader"
              :class="'baseInfoCont_col'+baseHeader.row">
              <span 
                :class="baseHeader.prop=='isbn'?'highlightRed':''"
                v-text="baseHeader.label+':'"></span>
              <el-input
                v-if="baseHeader.prop!=='publisher'"
                @input="(val)=>{isbnReqFuc(baseHeader,val)}"
                size="mini"
                v-model="searchParams[baseHeader.prop]">
              </el-input>
              <el-select 
                v-if="baseHeader.prop=='publisher'"
                v-model="searchParams[baseHeader.prop]" 
                collapse-tags 
                placeholder="请选择"
                size="mini" 
                style="width:315px;">
                <el-option
                  v-for="(objVal,curKey) in dicListAll[2]"
                  :key="curKey"
                  :label="objVal"
                  :value="objVal">
                </el-option>
              </el-select>
            </div>
        </div>  
      </div>
      <div class="navPageCont">
        <div class="navPageTitle">
          <span :class="curNavPageNum==1?'active':'unActive'" @click="curNavPageNum=1">审读意见</span>
          <span :class="curNavPageNum==2?'active':'unActive'" @click="curNavPageNum=2">审读历史</span>
        </div>
        <div v-if="curNavPageNum==1">
          <div class="baseDataCont navPageOne">
            <!-- searchParams['manualReviewResult'] -->
            <div 
              class="baseInfoCont_col1">
              <span class="highlightRed">名单:</span>
              <span>
                <el-button
                  :type="manualReviewResultIdx==key?'primary':''"
                  :plain="manualReviewResultIdx==key?false:true"
                  @click="changeManualReviewResult(curItem,key)"
                  size="mini"
                  v-text="curItem"
                  :key="key" 
                  v-for="(curItem,key) in dicListAll[1]">
                </el-button>
              </span>
            </div>
            <div 
              class="baseInfoCont_col1">
              <span class="highlightRed">问题类型:</span>
              <span>
                <el-cascader 
                  v-model="searchParams['sensitiveClassification']" 
                  clearable 
                  :show-all-levels="false" 
                  size="mini" 
                  style="width:315px;" 
                  placeholder="请选择" 
                  :options="dicListAll[3]" 
                  :props="defaultProps" 
                  filterable>
                </el-cascader>
              </span>
            </div>
            <div 
              class="baseInfoCont_col1">
              <span>问题出现页码:</span>
              <span>
                <el-input
                  size="mini"
                  v-model="searchParams['problemPage']">
                </el-input>
              </span>
            </div>
            <div 
              class="baseInfoCont_col1">
              <span>问题照片:</span>
              <span>
                <el-upload
                  class="upload-demo"
                  drag
                  :limit="filesLimitNum"
                  :before-upload="beforeFileFuc"
                  :on-error="filesErrorFuc"
                  :on-success="filesSuccessFuc"
                  :on-remove="filesRemoveFuc"
                  :on-exceed="filesExceedFuc"
                  :accept="filesType"
                  action="/br/api/review/entReview/pictureUpload"
                  :headers="{'x-access-token':xAccessToken}">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">点击上传</em></div>
                </el-upload>
              </span>
            </div>
            <div 
              class="baseInfoCont_col1">
              <span>问题内容:</span>
              <span>
                <el-input
                  type="textarea"
                  size="mini"
                  :rows="2"
                  :maxlength="1000"
                  placeholder="请输入内容"
                  v-model="searchParams['problemContent']">
                </el-input>
              </span>
            </div>
        </div>  
        </div>
        <div v-if="curNavPageNum==2">
            <el-timeline>
              <el-timeline-item
                :color="reviewHistoryItem.color"
                v-for="(reviewHistoryItem, index) in reviewHistoryList"
                :key="index">
                <!-- 实物审读 -->
                <el-card 
                  v-if="reviewHistoryItem.manOrMachine+reviewHistoryItem.reviewType == 'manent'">
                  <div v-text="'实物审读结果为：'+reviewHistoryItem.reviewResult"></div>
                  <div v-text="reviewHistoryItem.sensitiveClassification"></div>
                  <div v-text="reviewHistoryItem.problemPage"></div>
                </el-card>
                <!-- 人工审读 -->
                <el-card 
                  v-if="reviewHistoryItem.manOrMachine+reviewHistoryItem.reviewType == 'mantxt' || reviewHistoryItem.manOrMachine+reviewHistoryItem.reviewType == 'manpic'">
                  <div v-text="'人工审读结果为：' + reviewHistoryItem.reviewResult"></div>
                  <div v-text="reviewHistoryItem.reviewTime"></div>
                  <div v-text="reviewHistoryItem.reviewUser"></div>
                </el-card>
                <!-- 机器审读 -->
                <el-card 
                 v-if="reviewHistoryItem.manOrMachine+reviewHistoryItem.reviewType == 'machinetxt' || reviewHistoryItem.manOrMachine+reviewHistoryItem.reviewType == 'machinepic'">
                  <div v-text="'机器审读结果为：' + reviewHistoryItem.reviewResult"></div>
                  <div v-text="reviewHistoryItem.reviewTime"></div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <div v-if="reviewHistoryList.length==0">
              <noData></noData>
            </div>
        </div>
      </div>
      <div class="relationOrderCont">
        <div class="relationOrderTitle">相关订单</div>
        <div class="relationOrderMain">
          <div class="operateBtns">
            <el-checkbox v-model="checkedAll" style="margin-right:10px;" @change="selectAllFuc">全选</el-checkbox>
            <el-button size="small" type="primary" @click="addAdviseFuc(true)">选择处理意见</el-button>
            <el-button size="small" type="primary" @click="addRemarkFuc(true)">添加备注</el-button>
          </div>
          <div class="content">
            <el-table
              ref="addSingleData"
              :data="orderList"
              stripe
              tooltip-effect="dark"
              size="medium"
              style="width: 100%"
              height="500"
              :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
              :row-class-name="rowClass"
              @row-dblclick="showDetail"
              @sort-change='sortChange'
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                fixed="left"
                :selectable="isSelectable"
                width="45">
              </el-table-column>
              <el-table-column
                :sortable="showHeaderItem.prop=='orderTime'?'custom':false"
                :label="showHeaderItem.label"
                :prop="showHeaderItem.prop"
                :key="index"
                v-for="(showHeaderItem,index) in orderListHeaders"
                :width="showHeaderItem.width?showHeaderItem.width:''"
                min-width="80">
                <template slot-scope="scope">
                  <template v-if="showHeaderItem.prop == 'disposeOpinion'" >
                    <span v-if="(scope.row[showHeaderItem.prop]&&scope.row[showHeaderItem.prop]!=='')||parseInt(scope.row.state)===1" v-text="scope.row[showHeaderItem.prop]"></span>
                    <el-button 
                      v-else
                      @click="addAdviseFuc(false, scope.row)"
                      type="text" 
                      size="small">
                      选择处理意见
                    </el-button>
                  </template>
                  <template v-else-if="showHeaderItem.prop == 'problemPicturePath'" >
                    <span v-if="(scope.row[showHeaderItem.prop]&&scope.row[showHeaderItem.prop]!=='')||parseInt(scope.row.state)===1">{{handleImgLen(scope.row[showHeaderItem.prop])}}</span>
                    <el-button 
                      v-else
                      @click="addImgFuc(false, scope.row)"
                      type="text" 
                      size="small">
                      添加图片
                    </el-button>
                  </template>
                   <template v-else-if="showHeaderItem.prop == 'remark'" >
                    <span 
                      v-if="(scope.row[showHeaderItem.prop]&&scope.row[showHeaderItem.prop]!=='')||parseInt(scope.row.state)===1" 
                      v-text="scope.row[showHeaderItem.prop]&&scope.row[showHeaderItem.prop].length>10?(scope.row[showHeaderItem.prop].slice(0,10)+'...'):scope.row[showHeaderItem.prop]">
                    </span>
                    <el-button 
                      @click="addRemarkFuc(false, scope.row)"
                      v-else 
                      type="text" 
                      size="small">
                      添加备注
                    </el-button>
                  </template>
                  <span v-else-if="showHeaderItem.prop == 'orderTime'||showHeaderItem.prop == 'disposeTime'">{{formateTime(scope.row[showHeaderItem.prop])}}</span>
                  <span v-else v-text="scope.row[showHeaderItem.prop]"></span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pageAndExport" v-show="orderList.length>0">
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="orderListParams.pageNo"
                  :page-size="orderListParams.pageSize"
                  :page-sizes="defaultPageSizes"
                  :total="totalCount"
                  layout="total, prev, pager, next,sizes">
              </el-pagination>
          </div>
          </div>
        </div>
      </div>
      <div class="btnAction">
        <el-button size="small" @click="cancelAction">取消</el-button>
        <el-button type="primary" size="small" @click="sureAction">确定</el-button>
      </div>
      <el-dialog
        :title="curDialogTitle"
        :visible.sync="dialogVisible"
        center
        :class="curDialogTitle=='订单详情' ? 'detail-dialog':''"
        :width="curDialogTitle=='订单详情' ? '850px':'30%'"
        :before-close="handleClose">
        <template v-if="curDialogTitle=='选择处理意见'">
          <div v-if="!checkedAll&&!operationTag">已选定{{multipleSelection.length}}个订单</div>
          <div style="margin-top:20px;text-align:center">
            <el-checkbox-group v-model="checkedDisposeOpinionDics">
              <div
                :key="curKey" 
                v-for="(curVal,curKey) in disposeOpinionDicsObj">
                <el-checkbox  :label="curKey">{{curVal}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </template>  
        <template v-if="curDialogTitle=='添加备注'">
          <div v-if="!checkedAll&&!operationTag">已选定{{multipleSelection.length}}个订单</div>
          <div style="margin-top:20px;">
            <el-input
              type="textarea"
              :rows="6"
              :maxlength="100"
              placeholder="请输入内容"
              v-model="reMarkMultiple">
            </el-input>
          </div>
        </template> 
        <template v-if="curDialogTitle=='订单详情'">
          <div class="orderDetail">
            <div>
              <span>订购时间：</span>
              <span v-text="curDisposeOpinionObj.orderTime"></span>
              <span style="margin-left:50px;">订单号：</span>
              <span v-text="curDisposeOpinionObj.orderNo"></span>
              <span style="margin-left:50px;">订户：</span>
              <span v-text="curDisposeOpinionObj.orderUser"></span>
            </div>
            <div>
              <span>处理意见：</span>
              <el-checkbox-group v-model="checkedDisposeOpinionDics">
                <el-checkbox  
                  :key="curKey" 
                  v-for="(curVal,curKey) in disposeOpinionDicsObj"
                  :label="curKey">{{curVal}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div>
              <span>处理照片：</span>
              <el-upload
                  ref="detailUpload"
                  class="upload-demo"
                  drag
                  :limit="filesLimitNum"
                  :before-upload="beforeFileFuc"
                  :on-error="filesErrorFuc"
                  :on-success="filesSuccessFuc"
                  :on-remove="filesRemoveFuc"
                  :on-exceed="filesExceedFuc"
                  :accept="filesType"
                  action="/br/api/review/entReview/pictureUpload"
                  :headers="{'x-access-token':xAccessToken}">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">点击上传</em></div>
                </el-upload>
            </div>
            <div>
              <span>备注：</span>
              <el-input
                type="textarea"
                :rows="6"
                :maxlength="100"
                placeholder="请输入内容"
                v-model="curDisposeOpinionObj.remark">
              </el-input>
            </div>
          </div>
        </template> 
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="sureDialogFuc">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import {dateFormat} from '@/filters/index.js'
import filtData from '@/components/js/filtDataEntityRead.js'
import {debounce} from '@/util/util.js'
import noData from '@/components/noData'

export default {
  data(){
    return {
      xAccessToken: localStorage.getItem('token'),
      filesNumLimit:1,
      baseInfosHeader:filtData.baseInfosHeader,
      searchParams:{},
      curNavPageNum:1,
      manualReviewResultIdx:0,
      defaultProps: {
        children: "childList",
        label: "sortName",
        value: "id",
      },
      checkedAll:false,
      reviewHistoryList:[],
      filesType:'image/*',
      curFileList:[],
      orderListParams:{
        isbn:null,
        orderType:'asc',
        pageNo:1,
        pageSize:20
      },
      orderListHeaders:filtData.orderListHeaders,
      orderList:[],
      defaultPageSizes:[20, 40, 60, 80, 100],
      totalCount:0,
      multipleSelection:[],
      disposeOpinionDicsObj:{},
      checkedDisposeOpinionDics:[],
      reMarkMultiple:'',
      curDisposeOpinionObj:{},
      operationTag:false, // 相关订单批操作标志 false 单条操作 true 批操作
      curDialogTitle:'',// 选择处理意见 /  添加备注 / 订单详情 
      dialogVisible:false,
      filesLimitNum:100,
    }
  },
  props:['dicListAll'],
  components:{
    noData,
  },
  created(){  
    this.searchParams['manualReviewResult'] = Object.keys(this.dicListAll[1])[0];
    this.manualReviewResultIdx = this.searchParams['manualReviewResult'];
    this.getDisposeOpinionFuc();
    // this.getCorrelationOrderSubListFuc();
  },
  mounted(){
    console.log("dics")
  },
  methods: {
    sortChange(column){
      this.orderListParams.orderType=column.order=='ascending'?'asc':'desc'
      if(this.orderListParams.isbn){
        this.initPageParams();
        this.getCorrelationOrderSubListFuc(this.orderListParams)
      }
    },
    getDisposeOpinionFuc(){
      // 获取实物审读- 订单处理意见
      this.disposeOpinionDicsObj = {}
      this.$get('/api/dic/selectByCode', {code:'disposeOpinion'}).then(res=>{
        let {success, status, message, data} = res;
        if(success && status==0){
          if(data && data.dictionaryInfoList){
            data.dictionaryInfoList.forEach(ele=>{
              if(ele && ele.value){
                this.disposeOpinionDicsObj[ele.value] = ele.name
              }
            })
          }
        }else{
          this.$message({
            message:message,
            type:'warning'
          })
        }
      })
      console.log('disposeOpinionDicsObj',this.disposeOpinionDicsObj)
    },
    handleSearchParamsFuc(){
      let curParams = {}
      for(let key in this.searchParams){
        if(this.searchParams[key]){
          if(key=='sensitiveClassification'){
            curParams[key] = this.searchParams[key].join(',')
          }else{
            curParams[key] = this.searchParams[key]
          }
        }
      }
      curParams['type'] = 'ent'
      return curParams;
    },
    sureAction(){
      let reqParams = this.handleSearchParamsFuc();
      // 判断必填选项
      if(!reqParams.isbn){
        this.$message({
          message:'ISBN不能为空'
        })
        return false;
      }
      if(!reqParams.manualReviewResult){
        this.$message({
          message:'名单不能为空'
        })
        return false;
      }
      if(!reqParams.sensitiveClassification){
        this.$message({
          message:'问题类型不能为空'
        })
        return false;
      }
      if(reqParams.problemContent&&reqParams.problemContent.length>1000){
        this.$message({
          message:'问题内容长度不能大于1000'
        })
        return false;
      }
      console.log(JSON.stringify(reqParams))
      this.$post('/api/review/entReview/entityReviewSingleSubmit', reqParams)
      .then(res=>{
         let {success, status, message, data} = res;
         if(success && status==0){
           if(data){
             this.changePageName(0);
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
    cancelAction(){
      this.changePageName(0);
    },
    getCorrelationOrderSubListFuc(reqParams){
      // 获取相关订单列表数据
      /**
       * isbn: "1231231231231",
       * orderType: "desc",
       * pageNo: 1,
       * pageSize: 3
      */
      // let test = {
      //   "isbn": "1231231231231",
      //   "orderType": "desc",
      //   "pageNo": 1,
      //   "pageSize": 3
      // }
      this.$post('/api/order/getCorrelationOrderSubList', reqParams).then(res=>{
        /**
          "orderNo": "222222",//订单号
          "isbn": "1231231231231",//isbn
          "disposeOpinion": "",//处理意见
          "remark": "",//备注
          "packingListNo": null,//包装单号
          "problemPicturePath": "",//问题图片路径--逗号分割
          "disposeUser": "",//处理人
          "disposeAccount": "",//处理人账号
          "disposeTime": "2020-02-17 09:05:52",//处理时间
          "orderTime": "2020-02-17 09:00:22",//订购时间（订单产生时间）
          "orderUser": "交通部",//订户（订购的用户）
          "state": "0"//是否是历史订单（0-待处理订单；1-历史订单）
        */
       this.orderList = []
       this.totalCount = 0;
       let {success, status, message, data} = res;
       if(success && status==0){
        if(data && data.result){
          this.orderList = data.result;
        }
        if(data && data.totalCount){
          this.totalCount = data.totalCount;
        }
        this.$nextTick(()=>{
          this.selectAllFuc()
        })
       }else{
          this.$message({
            message:message,
            type:'warning'
          })
       }
      }).catch(err=>{
        this.orderList = []
        this.totalCount = 0;
        console.log(err)
      })
    },
    getReviewHistoryFuc(curIsbn){
      this.$get('/api/review/entReview/getReviewHistory', {
        isbn:curIsbn
      }).then(res=>{
        let {success, status, message, data} = res;
        if( success && status ==0 ){
          this.reviewHistoryList = [];
          if(data){
            /**
             * manOrMachine: man-人审 / machine-机审
             * reviewType: ent-实物审读 / txt-文字审读 / pic-图片审读
             * 图片（pic）和文字（txt）审读 都有机审和人审两种   实物审读（ent）只有人审
             * 
             * 实物审读[man-ent] ---  1
             *    展示所有实物审读记录，包含审读结果类型、敏感类型、问题出现页码。
             *      reviewResult：审读结果类型
             *      sensitiveClassification：敏感类型
             *      problemPage：问题出现页码
             * 
             * 人工审读[man-txt | man-pic]  --- 2
             *    展示所有人工审读记录，包含审读结果类型、审读结束时间、审读人。
             *      reviewResult：审读结果类型
             *      reviewTime: 审读结束时间
             *      reviewUser: 审读人
             * 
             * 机器审读[machine-txt | machine-pic] -- 3
             *    展示最后一次机器审读记录，包含审读结果类型、审读结束时间、敏感词位置及各位置敏感词出现次数。
             *      reviewResult：审读结果类型
             *      reviewTime: 审读结束时间
             * 
             *      :敏感词位置[功能暂无]
             *      :各位置敏感词出现次数[功能暂无]
             * 
             * 
                "manOrMachine": "man",//人审还是机审 man-人审；machine-机审
                "reviewType": "ent",//审读类型：ent-实物审读 txt-文字审读 pic-图片审读
                "picPath": "", 图片路径，逗号分割--需要拼接图片服务前缀获取图片
                "sensitiveClassification": "分类名称2020010215171114",//问题类型/敏感词分类--返回的是汉字
                "reviewResult": "",//审读结果（名单类型）--返回的是汉字
                "reviewUser": "测试用户222",//审读人--返回的是用户名
                "problemPage": "234",//问题页码（实物审读才有）
                "sensitiveContent": "",//敏感内容（图片机审才有）
                "reviewTime": "2020-02-28 16:04:31"//审读时间
             * 
            */
          // 机器审读展示最后一次处理数据
          // this.reviewHistoryList=data.filter(item=>item.manOrMachine!=='machine')
          // let machine=data.filter(item=>item.manOrMachine==='machine')
          // if(machine&&machine.length!==0){
          //   let machineList = machine[0]
          //   let initTime=Date.parse(new Date(machineList.reviewTime))
          //   machine.forEach((item,index)=>{
          //     let time=Date.parse(new Date(item.reviewTime))
          //     if(initTime<time){
          //       machineList=machine[index]
          //       initTime = Date.parse(new Date(machineList.reviewTime))
          //     }
          //   }) 
          //   this.reviewHistoryList.push(machineList) 
          // }
          //  this.reviewHistoryList = this.reviewHistoryList.map(reviewHistoryItem=>{
          //   if(reviewHistoryItem){
          //     let curStr = reviewHistoryItem.manOrMachine+reviewHistoryItem.reviewType;
          //     if(curStr == 'manent'){
          //       // 实物审读
          //       reviewHistoryItem.color = "#67c23a"
          //     }else if(curStr == 'mantxt' || curStr == 'manpic'){
          //       // 人工审读
          //       reviewHistoryItem.color = "#67c23a"
          //     }else if(curStr == 'machinetxt' || curStr == 'machinepic'){
          //       // 机器审读
          //       reviewHistoryItem.color = "red"
          //     }
          //   }
          //   return reviewHistoryItem;
          //  })         
          this.reviewHistoryList = data.map(reviewHistoryItem=>{
            if(reviewHistoryItem){
              let curStr = reviewHistoryItem.manOrMachine+reviewHistoryItem.reviewType;
              if(curStr == 'manent'){
                // 实物审读
                reviewHistoryItem.color = "#67c23a"
              }else if(curStr == 'mantxt' || curStr == 'manpic'){
                // 人工审读
                reviewHistoryItem.color = "#67c23a"
              }else if(curStr == 'machinetxt' || curStr == 'machinepic'){
                // 机器审读
                reviewHistoryItem.color = "red"
              }
            }
            return reviewHistoryItem;
           })         
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
    isbnReqFuc(curObj, val){
      if(curObj.prop == 'isbn'){
        debounce(this.getBaseInfoFuc(val), 3000)
      }else{
        return false;
      }
    },
    getBaseInfoFuc(val){
      // 获取历史数据
      this.getReviewHistoryFuc(val)
      // 获取相关订单
      this.orderListParams.isbn = val;
      if(this.orderListParams.isbn){
        this.initPageParams();
        this.getCorrelationOrderSubListFuc(this.orderListParams)
      }
      this.$get('/api/review/entReview/getBasicInfo',{
        isbn:val
      }).then(res=>{
        console.log("6666")
        let {success, status, message, data} = res;
        if(success && status== 0 ){
            this.baseInfosHeader.forEach(infoHeaderItem=>{
              if(infoHeaderItem && infoHeaderItem.prop){
                // vue 新增属性无法双向绑定 解决方案
                if(data && data[infoHeaderItem.prop]){
                  this.$set(this.searchParams, infoHeaderItem.prop, data[infoHeaderItem.prop])
                }else{
                  if(infoHeaderItem.prop!=='isbn'){
                    this.$set(this.searchParams, infoHeaderItem.prop, '')
                  }
                }
              }
            })
          console.log("getBaseInfoFuc");
          console.log(this.searchParams)
        }else{
          this.$message({
            message:message,
            type:'warning'
          })
        }
      }).catch(err=>{
        console.log(JSON.stringify(err))
      })
    },
    changePageName(curPageName){
      this.$emit('goHomePage', curPageName)
    },
    changeManualReviewResult(curItem,key){
      // console.log("999")
      this.manualReviewResultIdx = key;
      this.searchParams['manualReviewResult'] = key;
      console.log(this.searchParams['manualReviewResult'])
    },
    selectAllFuc(){
      // if(this.checkedAll){
      //   this.multipleSelection = this.orderList;
      // }else{
      //   this.multipleSelection = [];
      // }
      if(this.checkedAll){
        this.$refs.addSingleData.toggleAllSelection();
      }else{
        this.$refs.addSingleData.clearSelection();
      }   
    },
    initFileSysFuc(){
      this.searchParams['problemPicture'] = '';
      if(this.dialogVisible){
         this.curDisposeOpinionObj['problemPicture'] = '';
      }
    },
    filesSuccessFuc(res, file, fileList){
      // 图片上传成功回调函数
      // this.initFileSysFuc()
      let {success, message, data, status} = res;
      if(success && status==0){
        if(data){
          if(this.dialogVisible){
            // 订单详情更新订单也用到这块东西了
            // 解决上传图片不确定但是列表数据更新
            this.curDisposeOpinionObj['problemPicture']? this.curDisposeOpinionObj['problemPicture'] += ';' + data:this.curDisposeOpinionObj['problemPicture']=data
          }else{
            this.searchParams['problemPicturePath'] = data;
          }
        }
      }else{
        this.$message({
          message:message,
          type:'waring'
        })
      }
    },
    beforeFileFuc(file){
      // 上传文件之前操作
      // this.initFileSysFuc()
    },
    filesRemoveFuc(file, fileList){
      // 文件列表移除
      if(this.dialogVisible){
        let curPathArray = this.curDisposeOpinionObj['problemPicture'] && this.curDisposeOpinionObj['problemPicture'].split(';') ? this.curDisposeOpinionObj['problemPicture'].split(';'):[]
        if(curPathArray){
          if(fileList.indexof(file)>-1){
            this.curDisposeOpinionObj['problemPicture'] = curPathArray.splice(fileList.indexof(file),1).join(';')
          }
        }
      }
    },
    filesErrorFuc(err, file, fileList){
      // 图片上传失败回调函数

    },
    filesExceedFuc(files, fileList){
      // 文件上传超过限定之后调用函数 100
      this.$message.warning("上传文件数量上限为100")

    },
    handleSelectionChange(val){
      this.multipleSelection = val;
      let len=this.orderList.filter(item=>item.state==='0').length
      val.length!==len?this.checkedAll=false:this.checkedAll=true
    },
    initSelectItems(){
      this.$refs.addSingleData.clearSelection();
      this.checkedAll = false;
      this.multipleSelection = [];
    },
    initPageParams(){
      this.initSelectItems()
      this.orderListParams.pageSize  = 20;
      this.orderListParams.pageNo = 1;
    },
    handleSizeChange(val){
      this.orderListParams.pageNo = 1;
      this.orderListParams.pageSize = val;
      if(this.orderListParams.isbn){
        this.getCorrelationOrderSubListFuc(this.orderListParams);
      }
    },
    handleCurrentChange(val){
      this.orderListParams.pageNo = val;
      if(this.orderListParams.isbn){
        this.getCorrelationOrderSubListFuc(this.orderListParams);
      }
    },
    updateOrderSubListFuc(reqParamsList){
      console.log(JSON.stringify(reqParamsList));
      this.$post('/api/order/updateOrderSubLists',reqParamsList).then(res=>{
        let {success, message, data, status} = res;
        if(success && status==0){
          this.$message({
            message:'成功',
            type:'waring'
          })
          if(this.orderListParams.isbn){
            this.initPageParams();
            this.getCorrelationOrderSubListFuc(this.orderListParams);
          }
          this.dialogVisible = false;
        }else{
          this.$message({
            message:message,
            type:'waring'
          })
        }
      })
    },
    addImgCallbackFuc(){
      let reqParams = [];
      this.curDisposeOpinionObj.disposeOpinion = this.checkedDisposeOpinionDics.toString();
      //赋值给真实请求图片参数
      this.curDisposeOpinionObj.problemPicturePath= this.curDisposeOpinionObj.problemPicture
      this.curDisposeOpinionObj.problemPicture=undefined
      reqParams.push(this.curDisposeOpinionObj);
      this.updateOrderSubListFuc(reqParams)
    },
    addRemarkCallbackFuc(multipleSelectionTag){
      // multipleSelectionTag true 多选操作 false 单选操作
      let reqParams = [];
      if(multipleSelectionTag){
        reqParams = this.multipleSelection.map(ele=>{
          ele.remark = this.reMarkMultiple;
          return ele;
        })
      }else{
        this.curDisposeOpinionObj.remark = this.reMarkMultiple;
        reqParams.push(this.curDisposeOpinionObj);
      }
      this.updateOrderSubListFuc(reqParams)
    },
    addAdviseCallbackFuc(multipleSelectionTag){
       // multipleSelectionTag true 多选操作 false 单选操作
      let reqParams = [];
      if(multipleSelectionTag){
        reqParams = this.multipleSelection.map(ele=>{
          ele.disposeOpinion = this.checkedDisposeOpinionDics.toString();
          return ele;
        })
      }else{
        this.curDisposeOpinionObj.disposeOpinion = this.checkedDisposeOpinionDics.toString();
        reqParams.push(this.curDisposeOpinionObj);
      }
      this.updateOrderSubListFuc(reqParams)
    },
    updateOrderSubListsOfAllFuc(reqParams){
      /**
       * {
            "disposeOpinion": "",
            "isbn": "",
            "remark": ""
          }
      */
      this.$post('/api/order/updateOrderSubListsOfAll',reqParams).then(res=>{
        let {success, message, data, status} = res;
        this.$message({
          message:message,
          type:'warning'
        })
        if(success && status == 0){
          if(this.orderListParams.isbn){
            this.initPageParams();
            this.getCorrelationOrderSubListFuc(this.orderListParams);
          }
          this.dialogVisible = false;
        }
      })
    },
    addAdviseAllCallbackFuc(){
      if(this.searchParams['isbn']){
        let reqParams = {
          disposeOpinion: this.checkedDisposeOpinionDics.toString(),
          isbn: this.searchParams['isbn'],
          remark: null
        }
        this.updateOrderSubListsOfAllFuc(reqParams)
      }
    },
    addRemarkAllCallbackFuc(){
      if(this.searchParams['isbn']){
        let reqParams = {
          disposeOpinion: null,
          isbn: this.searchParams['isbn'],
          remark: this.reMarkMultiple
        }
        this.updateOrderSubListsOfAllFuc(reqParams)
      }
    },
    sureDialogFuc(){
      if(this.operationTag){
        // 批操作处理 只有选择处理意见和添加备注可以批操作 添加图片订单详情没有批操作处理
        if(this.checkedAll){
          // 全选情况比较特殊
          if(this.searchParams['isbn']){
            switch(this.curDialogTitle){
              case '选择处理意见':this.addAdviseAllCallbackFuc();break;
              case '添加备注':this.addRemarkAllCallbackFuc();break;
              default:console.log("暂无此种情况处理");
            }
          }else{
            this.$message({
              message:'ISBN不能为空',
              type:'warning'
            })
          }
        }else{
          if(this.multipleSelection.length>0){
            switch(this.curDialogTitle){
              case '选择处理意见':this.addAdviseCallbackFuc(true);break;
              case '添加备注':this.addRemarkCallbackFuc(true);break;
              default:console.log("暂无此种情况处理");
            }
          }else{
            this.$message({
              message:'请选择要操作元素',
              type:'warning'
            })
          }
        }
      }else{
        // 单条操作
        switch(this.curDialogTitle){
          case '选择处理意见':this.addAdviseCallbackFuc(false);break;
          case '添加备注':this.addRemarkCallbackFuc(false);break;
          case '订单详情':this.addImgCallbackFuc(false);break;
          default:console.log("暂无此种情况处理");
        }
      }
    },
    addAdviseFuc(multTag, curItem){
      // 添加处理意见
      this.initDialogData()
      this.operationTag = multTag;
      if(!multTag){
        // 单条操作
        if(this.multipleSelection.length===0){  //直接操作选择处理意见
          this.multipleSelection.push(curItem)
        }
        this.curDisposeOpinionObj = curItem;
      }else{
        if(this.multipleSelection.length==0 && !this.checkedAll){
          this.$message({
            message:'请选择要操作元素',
            type:'warning'
          })
          return false;
        }
      }
      this.curDialogTitle = '选择处理意见'
      if(curItem && curItem.disposeOpinion){
        curItem.disposeOpinion.split(',').forEach(ele=>{
          this.checkedDisposeOpinionDics.push(ele)
        })
      }else{
        this.checkedDisposeOpinionDics = [];
      }
      this.dialogVisible = true;
    },
    addRemarkFuc(multTag, curItem){
      console.log(curItem);
      this.operationTag = multTag;
      if(!multTag){
        // 单条操作
        if(this.multipleSelection.length===0){  //直接操作选择处理意见
          this.multipleSelection.push(curItem)
        }
        this.curDisposeOpinionObj = curItem;
      }else{
        if(this.multipleSelection.length==0 && !this.checkedAll){
          this.$message({
            message:'请选择要操作元素',
            type:'warning'
          })
          return false;
        }
      }
      this.curDialogTitle = '添加备注';
      this.reMarkMultiple = "";
      this.dialogVisible = true;
      this.initDialogData();
    },
    showDetail(row){
      // if(row.state!=='1'){
        this.addImgFuc(false,row)
      // }
    },
    addImgFuc(multTag, curItem){
      this.initDialogData()
      this.operationTag = multTag;
      if(!multTag){
        // 单条操作
        this.curDisposeOpinionObj = curItem;
        this.curDisposeOpinionObj.problemPicture=this.curDisposeOpinionObj.problemPicturePath
        if(this.curDisposeOpinionObj.disposeOpinion){
          this.curDisposeOpinionObj.disposeOpinion.split(',').forEach(item=>{
            Object.keys(this.disposeOpinionDicsObj).forEach(dis=>{
              console.log(this.disposeOpinionDicsObj[dis])
              if(this.disposeOpinionDicsObj[dis]===item){
                this.checkedDisposeOpinionDics.push(dis)
              }
            })
          })
        }
     }
      // 添加图片 == 订单详情
      this.curDialogTitle = '订单详情';
      this.dialogVisible = true;
    },
    handleCancel(){
      this.initFileSysFuc()
      this.dialogVisible=false
    },
    handleClose(done) {
      this.initFileSysFuc()
      done();
    },
    formateTime(value){
      return value?value.slice(0,value.length-3):''
    },
    isSelectable(row){
      return row.state&&row.state==='1'?false:true
    },
    initDialogData(){
      this.checkedDisposeOpinionDics = []
      this.reMarkMultiple = ""
      if(this.$refs.detailUpload){
        this.$refs.detailUpload.clearFiles();
      }
    },
    rowClass({row, rowIndex}) {
      if (this.multipleSelection.findIndex(ele=> ele.orderNo ==row.orderNo)>-1) {
        return 'selectedRow';
      } else {
        return '';
      }
    },
    handleImgLen(value){
      let res=value
      if(res){
        res = res.split(';').length
      }
      return res
    }
  }
}
</script>
<style lang='scss' scoped>
    .highlightRed{
      &:before{
        content: '*';
        color:red;
        margin-right: 6px;
      }
    }
   .main-entityRead-body{
     background-color: #ffffff;
     margin: 20px 0;
     padding: 20px;
     .backpageTitle{
        border-left: 1px solid #B5B5B5;
        padding-left: 10px;
        margin-left: 10px;
        font-size: 18px;
        font-weight: 600;
        color: #303232;
     }
     .content{
      padding: 20px;
     }
     .baseInfosCont{
       .baseDataTitle{
         background-color: #E1EFFE;
         font-size: 16px;
         padding: 10px 20px;
         margin: 20px 0;
         color: #409EFF;
         .alertText{
           font-size: 10px;
           margin-left:12px; 
         }
       }
       .baseDataCont{
          overflow: hidden;
           &:after{
             content: '';
             display: block;
             clear: both;
             width: 100%;
          }
         .baseInfoCont_col1{
           float: left;
           width: 100%;
           overflow: hidden;
           margin-bottom: 10px;
           span {
             width: 150px;
             display: inline-block;
             text-align: right;
             margin-right: 10px;
           }
           /deep/.el-input{
            width:calc(100% - 300px);
           }
         }
        .baseInfoCont_col2{
          float: left;
          width: 50%;
          margin-bottom: 10px;
          overflow: hidden;
          span {
             width: 150px;
             display: inline-block;
             text-align: right;
             margin-right: 10px;
          }
          /deep/.el-input{
            width:500px;
           }
        }
       }
     }
     .navPageCont{
       .navPageTitle{
         background-color: #E1EFFE;
         font-size: 16px;
         height: 40px;
         line-height: 40px;
         margin: 20px 0;
         color: #409EFF;
         overflow: hidden;
         span{
            width: 100px;
            height: 100%;
            text-align: center;
            box-sizing: border-box;
            float: left;
            cursor: pointer;
         }
         .active{
            background-color: #409EFF;
            color: #ffffff;
         }
         .unActive{
            color: #409EFF;
            border: 1px solid #409EFF;
         }
       }
       .navPageOne{
         .baseInfoCont_col1{
           margin-top:10px;
           span:nth-child(1){
             width: 150px;
             display: inline-block;
             text-align: right;
             margin-right: 10px;
           }
           /deep/.el-input{
             width: 500px;
           } 
           /deep/.el-textarea{
            width: 800px;
            vertical-align: top;
           }
           .upload-demo{
             width: 200px;
             display:inline-block;
             vertical-align: top;
           }
         }
       }
     }
     .relationOrderCont{
       .relationOrderTitle{
         background-color: #E1EFFE;
         font-size: 16px;
         padding: 10px 20px;
         margin: 20px 0;
         color: #409EFF;
       }
       .relationOrderMain{
         .operateBtns{
           .el-button{
             margin-left: 12px;
           }
         }
       }
     }
     .btnAction{
       text-align: center;
       margin-top: 20px;
       .el-button:nth-child(1){
         margin-right: 100px;
       }
     }
   }
   .alertText{
     color: red;
   }
   .orderDetail{
     &>div{
       margin-bottom:20px; 
     }
     .el-checkbox-group{
        display:inline-block;
     }
     .upload-demo{
        display:inline-block;
        vertical-align: top;
     }
     .el-textarea{
        display:inline-block;
        width: 600px;
        vertical-align: top;
     }
   }
   .detail-dialog{
     /deep/ .el-dialog__body{
       padding-left: 100px;
     }
   }
   /deep/ .el-table {
      .el-table__body{
        tr {
          &.el-table__row{
            &.selectedRow{
              td {
              background: rgba(185, 221, 249, 0.75);
              } 
            }
          }
        }
     }
   }
</style>

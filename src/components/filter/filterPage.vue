<template>
    <div id="filtBox">
        <div class="searchCondition">
            <div class="filtCont">
                <div class="title">查询
                    <i @click="isShow=!isShow" :title="isShow?'收起':'展开'" :class="isShow?'icon-shouqi':'icon-zhankai'"></i>
                </div>
                <el-collapse-transition>
                    <div class="filtDiv" v-show="isShow">
                        <div v-if="modelName=='图书库'">
                            <span>增加查询条件 </span>
                            <el-select v-model="addFiltModel" filterable size="mini" style="width:130px" placeholder="请选择" @change="addModel">
                                <el-option-group
                                  v-for="group in addFiltList"
                                  :key="group.label"
                                  :label="group.label">
                                  <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :disabled="item.disabled"
                                    :value="item">
                                  </el-option>
                                </el-option-group>
                            </el-select>
                            <span v-if="modelName=='图书库'">
                              <span v-if="(isEditStatu&&disabledData)||!isEditStatu" style="margin-left:100px;margin-right:30px;"><input type="checkbox" v-model="disabledData">是否检索已停用数据</span>
                              <span v-if="(isEditStatu&&paperBook)||!isEditStatu"><input type="checkbox" v-model="paperBook">是否仅查询纸质图书</span>
                            </span>
                        </div>
                        <div v-if="modelName=='报刊库'">
                            <span>增加查询条件 </span>
                            <el-select v-model="addFiltModel" filterable size="mini" style="width:130px" placeholder="请选择" @change="addModel">
                                  <el-option
                                    v-for="item in pressList"
                                    :key="item.value"
                                    :label="item.label"
                                    :disabled="item.disabled"
                                    :value="item">
                                  </el-option>
                            </el-select>
                            <span>
                              <span v-if="(isEditStatu&&disabledData)||!isEditStatu" style="margin-left:100px;margin-right:30px;"><input type="checkbox" v-model="disabledData">是否检索已停用数据</span>
                            </span>
                        </div>
                        <div style="margin-top:10px;">
                            <div v-for="(item,index) in selectFiltData" style="display:inline-block;width:50%;">
                                <!-- 关系 -->
                                <span style="display:inline-block;min-width:70px;" v-if="modelName=='图书库'">
                                    <el-select v-model="item.relation" size="mini" style="width:71px;" v-if="index!=0">
                                        <el-option
                                            v-for="obj in conditionList[0]"
                                            :key="obj.value"
                                            :label="obj.label"
                                            :value="obj.value">
                                        </el-option>
                                    </el-select>
                                </span>
                                <span style="display:inline-block;min-width:70px;" v-if="modelName=='报刊库'||modelName=='报刊实物审读'">
                                    <el-select v-model="item.relation" size="mini" style="width:71px;">
                                        <el-option
                                            v-for="obj in conditionList[0]"
                                            :key="obj.value"
                                            :label="obj.label"
                                            :value="obj.value">
                                        </el-option>
                                    </el-select>
                                </span>
                                <!-- 名称 -->
                                <div style="width:110px;display:inline-block;margin-bottom:10px;">
                                    <!-- <input type="checkbox" :value="item" v-model="checkFilt" @change="chanceChecked(item,$event)"> -->
                                    <span>{{item.label}}</span>
                                </div>
                                <!-- 条件 -->
                                <el-select v-model="item.condition" size="mini" style="width:95px;" @change="changeCondition(item)">
                                    <el-option
                                        v-for="obj in conditionList[item.conditionType]"
                                        :key="obj.value"
                                        :label="obj.label"
                                        :value="obj.value">
                                    </el-option>
                                </el-select>
                                <!-- 条件值 -->
                                <!-- 值为枚举单选 -->
                                <el-select clearable v-model="item.val" size="mini" style="width:315px" v-if="typeof(item.valType)=='number'&&item.valType!=6&&item.dataType!='tree'">
                                    <el-option
                                        v-for="obj in valOption[item.valType]"
                                        :key="obj.value"
                                        :label="obj.name"
                                        :value="obj.value">
                                    </el-option>
                                </el-select>
                                <!-- 值为枚举多选 -->
                                <el-select v-model="item.val" multiple collapse-tags size="mini" style="width:315px;" v-if="item.valType==6">
                                  <el-option
                                    v-for="item in valOption[item.valType]"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                                <!-- 值为树形结构 -->
                                <el-cascader v-if="item.dataType=='tree'" v-model="item.val" clearable :show-all-levels="false" size="mini" style="width:315px;" placeholder="请选择" :options="valOption[item.valType]" :props="defaultProps" filterable></el-cascader>
                                <!-- 值为文本 -->
                                <el-input clearable v-model="item.val" size="mini" style="width:315px" v-if="item.valType=='input'"></el-input>
                                <!-- 值为数字 -->
                                <span v-if="item.valType=='number'">
                                  <el-input :clearable="item.condition=='between'?false:true" v-model="item.val" @keyup.native="item.val=item.val.replace(/[^\d]/g,'')" size="mini" :style="{'width':item.condition=='between'?'100px':'315px'}"></el-input>
                                  <span v-if="item.condition=='between'">
                                    -- <el-input v-model="item.secondVal" @keyup.native="item.secondVal=item.secondVal.replace(/[^\d]/g,'')" size="mini" style="width:100px"></el-input>
                                  </span>
                                </span>
                                <!-- 值为百分比 -->
                                <span v-if="item.valType=='%'">
                                  <el-input v-model="item.val" @keyup.native="limit(item)" size="mini" style="width:100px"></el-input>%
                                  <span v-if="item.condition=='between'">
                                    -- <el-input v-model="item.secondVal" @keyup.native="limit(item)" size="mini" style="width:100px"></el-input>%
                                  </span>
                                </span>
                                <!-- 值为时间 -->
                                <span v-if="item.valType=='date'">
                                  <el-date-picker
                                      v-show="item.condition=='between'"
                                      v-model="item.betweenVal"
                                      style="width:315px"
                                      size="mini"
                                      :type="item.name=='pubDate'?'daterange':'datetimerange'"
                                      :value-format="item.name =='catalogDate'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期">
                                  </el-date-picker>
                                  <el-date-picker
                                      v-show="item.condition!='between'"
                                      v-model="item.val"
                                      value-format='yyyy-MM-dd HH:mm:ss'
                                      style="width:315px"
                                      size="mini"
                                      :type="item.name=='pubDate'?'date':'datetime'"
                                      placeholder="选择日期">
                                  </el-date-picker>
                                </span>
                                <!-- 值为文件 -->
                                <span v-if="item.valType=='file'">
                                    <el-input clearable v-model="item.val" @keyup.native="item.val=item.val.replace(/[^\d、]/g,'')" :placeholder="'多个'+item.label+'用顿号间隔'" size="mini" style="width:260px;"></el-input>
                                    <input style="display:none" id="isbnImportBtn" type="file" @change="importf($event,item,item.label)">
                                    <i style="font-size:20px;color:#409EFF;" class="el-icon-upload2" @click="selectFile" title="导入"></i>
                                    <a :href="item.label=='ISSN'?'./static/ISSNTemplate.xlsx':'./static/ISBNTemplate.xlsx'" style="font-size:20px;" class="el-icon-download" title="下载模板"></a>
                                </span>
                            </div>
                        </div>
                    </div>
                </el-collapse-transition>
            </div>
            <div class="customCont" v-if="modelName=='图书库'">
                <div class="rgTitle">我的自定义查询</div>
                <div class="cont">
                  <div v-for="item in customList" :class="curConfig.id==item.id?'active':''" @click="getCurConfig(item)">{{item.name}}</div>
                </div>
            </div>
        </div>
        <div class="searchBtns">
            <span @click="handleSearch"><i style="color:#409eff;" class="el-icon-search"></i> 查询</span>
            <span @click="initData"><i style="color:#f00;" class="el-icon-brush"></i> 清除</span>
            <span @click="editConfig('编辑')" v-show='isEditStatu'><i style="color:#e6a23c;" class="el-icon-edit"></i> 编辑</span>
            <span @click="delConfig" v-show="isEditStatu"><i style="color:#f00;" class="el-icon-delete"></i> 删除</span>
            <span @click="editConfig('新建查询')" v-show="!isEditStatu" v-if="modelName=='图书库'"><i style="color:#67c23a;" class="el-icon-document-checked"></i> 保存</span>
        </div>


        <el-dialog
            :title="dialogType"
            :visible.sync="saveDialog"
            width="1150px"
            center>
            <filterSave v-if="saveDialog" ref="filterSave" :valOption='valOption' :customList='customList' @closeSavaPage='saveDialog=false' @closeDialog='closeSaveDialog' :curModelName='modelName'></filterSave>
        </el-dialog>
    </div>
</template>

<script>
import filtData from '@/components/js/filtData.js'
import addFiltData from '@/components/js/addFiltData.js'
import filterSave from './filterSave'
import XLSX from 'xlsx'
import {mapActions,mapGetters} from 'vuex'
export default {
  data(){
    return {
        isEditStatu:false,
        disabledData:false,
        paperBook:false,
        isShow:true,
        addFiltList:JSON.parse(JSON.stringify(addFiltData.bookList)),
        pressList:JSON.parse(JSON.stringify(addFiltData.pressList)),//报刊扩展查询列表
        addFiltModel: '',
        checkFilt:[],
        conditionList:filtData.conditionOption,
        selectFiltData:[],
        customList:[],
        initFilData:'',
        saveDialog:false,
        curConfig:'',
        dialogType:'',
        defaultProps: {
          children: "childList",
          label: "sortName",
          value: "id",
        },
    }
  },
  components:{
      filterSave
  },
  props:['modelName'],
  computed:{
    ...mapGetters(['language','reviewLevel','taskSource','reader','crawlStatus','imagesAutoReviewResult','imagesManualReadResult','redReviewLevle','site',
    'ctClassification','bisacClassification','classification1','imgSensitiveType','paperReview','paperReviewOpinion']),
    valOption(){
      let arr=[
        // 文版 0
        this.language,
        // 优先级 1
        this.reviewLevel,
        // 任务来源 2
        this.taskSource,
        // 图片来源 3
        this.site,
        //触发采集状态 4
        this.crawlStatus,
        // 图片机审结果 5
        this.imagesAutoReviewResult,
        // 审读人 6
        this.reader,
        //规则类型 7
        [
          {value: 0,name: '机审任务分配'},
          {value: 1,name: 'ERP订单任务'}
        ],
        // 图书审读清单状态 8
        [
          {value: 0,name: '采集中'},
          {value: 1,name: '未审'},
          {value: 2,name: '已审'}
        ],
        //是否主图 9
        [
          { value:'master',name:'master'},
          {value: 'slave',name: 'slave'}
        ],
        //审读等级 10
        this.redReviewLevle,
        // 图片人审结果 11
        this.imagesManualReadResult,
        //中图法 12
        this.ctClassification,
        // BISAC分类 13
        this.bisacClassification,
        // 业务分类1 14
        this.classification1,
        // 业务分类2 15
        this.classification2,
        //图片敏感分类 16
        this.imgSensitiveType,
        //是否核心刊 17
        [
          { name: "是", value: true },
          { name: "否", value: false }
        ],
        //报刊实物审读结果/名单 18
        this.paperReview,
        //报刊实物审读处理意见 19
        this.paperReviewOpinion,
      ];
      return arr
    }
  },
  created(){
      this.initFilData=JSON.stringify(filtData.filtDataList) 
      this.initData()
      if (this.modelName=='报刊库') {
      }
      if (this.modelName=='图书库'){
        // 获取自定义查询
        this.getConfig()
        // 获取字典
        this.getDictList(['language','reviewLevel','commonReadResult','entityReadResult','imagesManualReadResult','productClassify'])
        // 获取审读人
        this.getReaderList('book')
        //获取中图法等分类树形结构  分类先取分类1的值
        this.getClassify(['ctClassification','bisacClassification','classification1','classification2'])
      }
      if (this.modelName=='图书任务') {
        this.getDictList(['reviewLevel','taskSource'])
        this.getReaderList('book')
      }
      if (this.modelName=='图书清单'){
        this.getDictList(['crawlStatus','language'])
        //获取业务分类1
        this.getClassify(['classification1'])
      }
      if(this.modelName=='图片库'){
        this.getDictList(['reviewLevel','imagesAutoReviewResult','imagesManualReadResult','site'])
        this.getReaderList('img')
        //获取敏感类型
        this.getClassify(['imgSensitiveType'])
      }
      if (this.modelName=='图片任务') {
        this.getDictList(['reviewLevel','taskSource'])
        this.getReaderList('img')
      }
      if(this.modelName=='图片清单'){
        this.getDictList(['imagesManualReadResult'])
        this.getReaderList('img')
      }
      if (this.modelName=='红名单') {
        this.getDictList(['redReviewLevle','productClassify'])
        this.getReaderList('book')
      }
      if (this.modelName=='自动分配任务管理') {
        this.getDictList(['reviewLevel'])
        this.getReaderList('book')
      }
      if (this.modelName=='报刊实物审读') {
        this.getDictList(['paperReview','paperProblemType','paperReviewOpinion'])
        this.getReaderList('entity')
      }
  },
  watch:{
      selectFiltData(){
          let arr=[]
          this.selectFiltData.forEach(item=>{
              arr.push(item.name)
          })
          this.addFiltList.forEach(obj=>{
              obj.options.forEach(item=>{
                  if (arr.indexOf(item.name)!=-1) {
                    item.disabled=true
                  }else{
                    item.disabled=false
                  }
              })
          })
          this.pressList.forEach(item=>{
                if (arr.indexOf(item.name)!=-1) {
                  item.disabled=true
                }else{
                  item.disabled=false
                }
          })
      }
  },
  methods: {
      ...mapActions(['getDictList','getReaderList','getClassify']),
      // 获取非空搜索条件
      getSearchFilt(){
        this.checkFilt=[];
        this.selectFiltData.forEach(item=>{
          if (item.dataType=='array'||item.dataType=='tree') {
            if (item.val.length>0) {
              this.checkFilt.push(item)
            }
          }else{
            if (item.val||item.betweenVal) {
              this.checkFilt.push(item)
            }
          }
        })
      },
      limit(item){
        var reg=/^(?:[1-9]?\d|100)$/;
        if (item.valType=='%'&&item.condition=='between') {
          if (reg.test(item.secondVal)) {
            item.secondVal=item.secondVal
          } else {
            item.secondVal=''
          }
        }
        if (reg.test(item.val)) {
          item.val=item.val
        } else {
          item.val=''
        }
      },
      changeCondition(item){
        if(item.valType=='date'){
          item.betweenVal='';
          item.val='';
        }
        if(item.valType=='number'||item.valType=='%'){
          item.val='';
          item.secondVal='';
        }
      },
      chanceChecked(item,event){
        if (!event.target.checked) {
          item.val=''
        }
      },
      closeSaveDialog(data){
        if (data!='close') {
          this.getConfig()
          this.getCurConfig(data)
        }
        this.saveDialog=false
      },
      getCurConfig(data){
        this.curConfig=data
        let config=JSON.parse(data.data)
        this.disabledData=config.disabledData
        this.paperBook=config.paperBook
        this.selectFiltData=config.list.concat([])
        // this.checkFilt=config.list.concat([])
        this.isEditStatu=true
        this.search()
      },
      delConfig(){
        this.$confirm('确认删除自定义 '+this.curConfig.name, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params={
              id:this.curConfig.id
          }
          this.$get('/api/config/template/del',params).then(res=>{
              if (res.success) {
                this.$message.success(res.message)
                this.getConfig()
                this.initData()
              } else {
                this.$message.error(res.message)
              }
          })
        })
      },
      getConfig(){
          this.customList=[];
          let params={
              module:'bookLibrary',
          }
          this.$get('/api/config/template/list/get',params).then(res=>{
              if (res.data.result&&res.data.result.length>0) {
                this.customList=res.data.result
              }
          })
      },
      editConfig(name){
        this.dialogType=name;
        this.saveDialog=true;
        if (name=='编辑') {
          let config=JSON.parse(this.curConfig.data);
          var params={
              name:this.curConfig.name,
              moduleId:this.curConfig.id,
              data:{
                  disabledData:config.disabledData,
                  paperBook:config.paperBook,
                  list:config.list
              }
          }
        } else {
          this.getSearchFilt()
          var params={
              name:'',
              data:{
                  disabledData:this.disabledData,
                  paperBook:this.paperBook,
                  list:this.checkFilt
              }
          }
        }
        this.$nextTick(()=>{
            this.$refs.filterSave.init(JSON.stringify(params));
        })
      },
      handleSearch(){
        this.curConfig='';
        if (this.isEditStatu) {
          this.isEditStatu=!this.isEditStatu
        }
        this.search()
      },
      search(){
          this.getSearchFilt()
          let arr=[];
          this.checkFilt.forEach(item=>{
              let val='';
              if (item.dataType=='array') {
                val=item.val
              }else if(item.dataType=='tree'){
                val=[item.val.join(',')]
              }else if(item.type=='date'&&item.condition=="between"){
                val=item.betweenVal
              }else if(item.name=='isbn' || item.name=='sn'|| item.name=='zIssn'||item.name=='issn'){
                val=item.val.split('、')
              }else if((item.valType=='number'||item.valType=='%')&&item.condition=="between"){
                val=[item.val,item.secondVal]
              }else{
                val=[item.val]
              }
              arr.push({
                field:item.name,
                grammar:item.condition,
                logic:item.relation,
                type:item.type,
                value:val
              })
          })
          let obj={
            params:arr
          }
          if (this.modelName=='图书库') {
            obj.disabledData=this.disabledData
            obj.paperBook=this.paperBook
          }
          if (this.modelName=='报刊库') {
            obj.disabledData=this.disabledData
          }
          this.$emit('sendSearchData',obj)  
      },
      addModel(data){
          var isHava=false;
          this.selectFiltData.forEach(item=>{
            if (item.label==data.label) {
              isHava=true
              return
            }
          })
          if (isHava) {
            this.$message.warning('条件已存在')
            this.addFiltModel='';
            return
          }
          this.selectFiltData.push(data)
          // this.checkFilt.push(data)
          this.addFiltModel='';
      },
      selectFile() {
        document.getElementById('isbnImportBtn').value='';
        document.getElementById('isbnImportBtn').click();
      },
      importf(obj,filtItem,type) {
        if (!obj.target.files) {
          return;
        }
        var f = obj.target.files[0];
        var fileName =f.name;
        var fileext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
        if (fileext != '.xls' && fileext != '.xlsx') {
            this.$message.error('只能上传excel文件');
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            var wb = XLSX.read(data, {
                type: 'binary'
            });
            let fileObj = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            let arr=[]
            fileObj.forEach(item=>{
                arr.push(item[type])
            })
            filtItem.val=arr.join('、')
        };
        reader.readAsBinaryString(f);
      },
      initData(){
        this.curConfig='';
        this.checkFilt=[];
        this.selectFiltData=[];
        this.disabledData=false;
        this.paperBook=false;
        this.isEditStatu=false;
        var list=[];
        var filtDataList=JSON.parse(this.initFilData)
        if (this.modelName =='报刊库'){
          list=[46,49,47,50,48];
        }
        if (this.modelName =='报刊实物审读'){
          list=[51,55,52,57,53,56,54];
        }
        if (this.modelName=='图书库'){
          list=[0,1,45,3,5,6,7,8,31,9,29,40];
        }
        if (this.modelName=='图书任务') {
          list=[10,11,12,13,14,15,16,17,1];
        }
        if (this.modelName=='图片任务') {
          list=[10,11,12,13,14,15,16,17];
        }
        if (this.modelName=='图书清单'){
          list=[18,1,38,3,40,39,31,41,11];
        }
        if(this.modelName=='图片库'){
          list=[ 19, 43, 20, 21, 22, 23, 24, 25, 42, 26 ];
        }
        if(this.modelName=='图片清单'){
          list=[ 10, 43, 13, 15, 11, 17, 42, 24 ];
        }
        if (this.modelName=='红名单') {
          list=[27,44,28,1,29,2,30,4,31,6,32,9];
        }
        if (this.modelName=='自动分配任务管理') {
          list=[34,16,35,13,36,37];
        }
        list.forEach(item=>{
          this.selectFiltData.push(filtDataList[item])
        })
        this.search()
      },
  }
}
</script>
<style lang='scss' scoped>
#filtBox{
    .searchCondition{
        display:flex;
        font-size: 14px;
        .filtCont{
            width: 100%;
            margin-right:10px;
            .title{
                border-bottom: solid 1px #e6e6e6;
                border-left: solid 5px #409eff;
                padding-left:5px;
                i{
                    float:right;
                    margin-right: 20px;
                    color: #409eff;
                    cursor: pointer;
                }
            }
            .filtDiv{
                margin-top:20px;
            }
        }
        .customCont{
            width: 150px;
            .rgTitle{
                border-left: solid 5px #409eff;
                padding-left:5px;
            }
            .cont{
              height:210px;
              overflow-y: auto;
              margin-top: 5px;
              padding-left:10px;
              div{
                color: gray;
                cursor: pointer;
                &:hover{
                  text-decoration:underline;
                }
              }
              .active{
                color: #409eff;
                font-weight: bold;
              }
            }
            // 滚动条样式
            ::-webkit-scrollbar {
              width: 7px;
              height: 7px;
            }
            ::-webkit-scrollbar-thumb {
              border-radius: 5px;
              background-color: hsla(225,4%,58%,.3);
            }
        }
    }
    .searchBtns{
        padding:20px 10px;
        font-size: 15px;
        span{
            margin-right:10px;
            cursor: pointer;
        }
    }
}
</style>

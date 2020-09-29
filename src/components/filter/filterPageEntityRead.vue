<template>
    <div id="filtBox">
        <div class="searchCondition">
            <div class="filtCont">
                <div class="title">查询
                    <i @click="isShow=!isShow" :title="isShow?'收起':'展开'" :class="isShow?'icon-shouqi':'icon-zhankai'"></i>
                </div>
                <el-collapse-transition>
                    <div class="filtDiv" v-show="isShow">
                        <div style="margin-top:10px;">
                            <div 
                              :key="index"
                              v-for="(item,index) in selectFiltData" 
                              style="display:inline-block;width:50%;">
                                <!-- 名称 -->
                                <div style="width:110px;display:inline-block;margin-bottom:10px;">
                                    <span>{{item.label}}</span>
                                </div>
                                <!-- 值为枚举单选 -->
                                <el-select clearable v-model="item.val" size="mini" style="width:315px" v-if="item.valType=='singleSelect'">
                                    <el-option
                                        v-for="(objVal,curKey) in valOption[item.valTypeIndex]"
                                        :key="curKey"
                                        :label="objVal"
                                        :value="curKey">
                                    </el-option>
                                </el-select>
                                <!-- 值为枚举多选 -->
                                <el-select 
                                  v-model="item.val" 
                                  multiple 
                                  collapse-tags 
                                  placeholder="全部"
                                  size="mini" 
                                  style="width:315px;" 
                                  v-if="item.valType=='multipleSelect'">
                                  <el-option
                                    v-for="(objVal,curKey) in valOption[item.valTypeIndex]"
                                    :key="curKey"
                                    :label="objVal"
                                    :value="curKey">
                                  </el-option>
                                </el-select>
                                <!-- 值为树形结构 -->
                                <el-cascader 
                                  v-if="item.valType=='tree'" 
                                  v-model="item.val" 
                                  clearable 
                                  :show-all-levels="false" 
                                  size="mini" 
                                  style="width:315px;" 
                                  placeholder="全部" 
                                  :options="valOption[item.valTypeIndex]" 
                                  :props="defaultProps" 
                                  filterable>
                                </el-cascader>
                                <!-- 值为文本 -->
                                <el-input clearable v-model="item.val" size="mini" style="width:315px" v-if="item.valType=='input'"></el-input>
                                <!-- 值为数字 -->
                                <span v-if="item.valType=='number'">
                                  <el-input :clearable="item.condition=='between'?false:true" v-model="item.val" @keyup.native="item.val=item.val.replace(/[^\d]/g,'')" size="mini" :style="{'width':item.condition=='between'?'100px':'315px'}"></el-input>
                                  <span v-if="item.condition=='between'">
                                    -- <el-input v-model="item.secondVal" @keyup.native="item.secondVal=item.secondVal.replace(/[^\d]/g,'')" size="mini" style="width:100px"></el-input>
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
                                      value-format='yyyy-MM-dd HH:mm:ss'
                                      range-separator="至"
                                      :picker-options="pickerOptions"
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
                                    <el-input clearable v-model="item.val" @keyup.native="item.val=item.val.replace(/[^\d,]/g,'')" placeholder="多个ISBN用逗号间隔" size="mini" style="width:260px;"></el-input>
                                    <input style="display:none" id="isbnImportBtn" type="file" @change="importf($event,item)">
                                    <i style="font-size:20px;color:#409EFF;" class="el-icon-upload2" @click="selectFile" title="导入"></i>
                                    <a href="./static/ISBNTemplate.xlsx" style="font-size:20px;" class="el-icon-download" title="下载模板"></a>
                                </span>
                            </div>
                        </div>
                    </div>
                </el-collapse-transition>
            </div>
        </div>
        <div class="searchBtns">
            <span @click="handleSearch"><i style="color:#409eff;" class="el-icon-search"></i> 查询</span>
            <span @click="initData"><i style="color:#f00;" class="el-icon-brush"></i> 清除</span>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import filtData from '@/components/js/filtDataEntityRead.js'
export default {
  data(){
    return {
        isShow:true,
        selectFiltData:JSON.parse(JSON.stringify(filtData.filtDataList)),
        defaultProps: {
          children: "childList",
          label: "sortName",
          value: "id",
          multiple: true
        },
        searchParams:{},
        pickerOptions:{
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, 
          // {
          //   text: '最近三个月',
          //   onClick(picker) {
          //     const end = new Date();
          //     const start = new Date();
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          //     picker.$emit('pick', [start, end]);
          //   }
          // }
          ]
        }
    }
  },
  props:['modelName','dicListAll'],
  computed:{
    valOption(){
      let arr = this.dicListAll;
      return arr;
    }
  },
  created(){
      console.log('this.dicListAll', this.dicListAll)
      this.initData()
  },
  methods: {
      handlerSearchParamsData(){
        this.searchParams={}
        this.selectFiltData.forEach((ele,index)=>{
          if(ele && ele.name && (ele.val||(ele.betweenVal && ele.betweenVal.length>0))){
            if(ele.name=='isbn'){
              this.searchParams[ele.name] = [];
              if(ele.val){
                let curIsbn = ele.val.split(',').forEach(curIsbn=>{
                  if(curIsbn){
                    this.searchParams[ele.name].push(curIsbn)
                  }
                })
              }
            }else if(ele.name=='sensitiveClassification' || ele.name == 'publisher' || ele.name == "reviewUser" || ele.name == "reviewResult"){
              if(ele.val){
                // this.searchParams[ele.name] = ele.val
                if(ele.name=='sensitiveClassification'){
                  this.searchParams[ele.name] = ele.val.map(cur=>{
                    cur= cur.toString()
                    return cur
                  })
                }else{
                  this.searchParams[ele.name] = ele.val
                }
              }
            }else if(ele.name=="reviewDate" && ele.betweenVal && ele.betweenVal.length>0){
              this.searchParams['reviewTimeBegin'] = ele.betweenVal[0];
              this.searchParams['reviewTimeEnd'] = ele.betweenVal[1];
            }else{
              if(ele.val){
                this.searchParams[ele.name] = ele.val;
              }
            }
          }
        })
      },
      handleSearch(){
         /**
            isbn: [],// ISBN 逗号隔开 Array[String] 
            bookName: "",//书名 String 
            principal: "",// 责任人 String
            publisher: [],// 出版社--逗号分割 , 默认全部
            reviewUser: [],// 审读员 默认全部
            // 审读时间 快捷选项包含近一周、近一月。默认展示近一周。开始日期不大于结束日期。
            reviewTimeBegin: "", // 审读时间 开始时间 2020-02-26T00:09:29.389Z
            reviewTimeEnd: "", // 审读时间 结束时间 2020-02-26T00:09:29.389Z
            reviewResult: [], // 实物审读结果 备选项包含全部、白名单、黑一、黑二、黑三。默认全部
            sensitiveClassification: [], // 问题类型 调用敏感词库。默认全部
            pageNo: 1, // 当前页，默认是1
            pageSize: 10, //  每页条数，默认是10
            orderType: "", // 排序方式:asc/desc
            // maxSize: 0, // 单个文件数据存储上限
            // startRow: 0, // 起始条数，不需要传
            // totalPageNo: 0, // 总页数，不需要传
            // totalPageNum: 0 // 总条数，不需要传
          */
        console.log(this.selectFiltData)
        this.handlerSearchParamsData();
        console.log('this.searchParams',this.searchParams)
        // this.selectFiltData.forEach((ele,index)=>{
        //   if(ele && ele.name && (ele.val||(ele.betweenVal && ele.betweenVal.length>0))){
        //     if(ele.name=='isbn'){
        //       this.searchParams[ele.name] = [];
        //       this.searchParams[ele.name].push(ele.val)
        //     }else if(ele.name=='sensitiveClassification' || ele.name == 'publisher' || ele.name == "reviewUser" || ele.name == "reviewResult"){
        //       this.searchParams[ele.name] = ele.val
        //     }else if(ele.name=="reviewDate" && ele.betweenVal && ele.betweenVal.length>0){
        //       this.searchParams['reviewTimeBegin'] = new Date(ele.betweenVal[0]);
        //       this.searchParams['reviewTimeEnd'] = new Date(ele.betweenVal[0]);
        //     }else{
        //       this.searchParams[ele.name] = ele.val;
        //     }
        //   }
        // })
        
        this.$emit('sendSearchData',this.searchParams)  
      },
      initData(){
        this.selectFiltData = [];
        this.selectFiltData = JSON.parse(JSON.stringify(filtData.filtDataList))
        this.handlerSearchParamsData();
        console.log('this.searchParams',this.searchParams)
        this.$emit('sendSearchData',this.searchParams) 
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
      importf(obj,filtItem) {
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
                arr.push(item.ISBN)
            })
            filtItem.val=arr.join(',')
        };
        reader.readAsBinaryString(f);
      },
      selectFile() {
        document.getElementById('isbnImportBtn').value='';
        document.getElementById('isbnImportBtn').click();
      },
  }
}
</script>
<style lang='scss' scoped>
#filtBox{
    background-color: #ffffff;
    padding: 20px;
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

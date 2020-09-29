<template>
    <div id='selectTem'>
      <div class="cont">
        <div v-if="vendibilityManage !=='vendibilityManage'">
          <span>导出格式：</span>
          <el-radio-group v-model="exportFormat" @change="formatChange">
            <el-radio label="CSV">CSV</el-radio>
            <el-radio label="Excel">Excel</el-radio>
            <el-radio label="Word">Word</el-radio>
            <el-radio label="Marc">Marc</el-radio>
          </el-radio-group>
        </div>
        <div class="MarcType" v-if="exportFormat=='Marc'">
          <span>类型：</span>
          <el-radio-group size="mini" v-model="typeRadio">
            <el-radio label="USMARC">USMarc</el-radio>
            <el-radio label="CNMARC">CNMarc</el-radio>
          </el-radio-group>
          <span class="code">编码：</span>
          <el-radio-group v-model="codeRadio">
            <el-radio label="UTF-8">UTF-8</el-radio>
            <el-radio label="UTF-16">UTF-16</el-radio>
            <el-radio label="Unicode">Unicode</el-radio>
          </el-radio-group>
        </div>
        <div class="mt-20" v-if="moudleType=='book'&&exportFormat=='CSV'">
          <span class="label">导出模板</span>
          <el-select size="small" v-model="selectTem" placeholder="请选择">
              <el-option
              v-for="item in temOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
          </el-select>
          <span class="temSetBtn" @click="openExportTem" >
            <i class="el-icon-s-tools"></i> 模板设置
          </span>
        </div>
        <div  v-if="vendibilityManage !=='vendibilityManage'" class="mt-20">
          单个文件数据存储上限 <el-input style="width:60px;" size='mini' v-model.number="maxLength"></el-input> 万条
          <el-checkbox v-if="exportFormat=='CSV'||exportFormat=='Excel'" v-model="isSeparator">ISBN是否加分隔符</el-checkbox>
        </div>
      </div>
      <div class="btns">
          <el-button size="medium" @click="$emit('closeDialog')">取消</el-button>
          <el-button size="medium" type="primary" :loading="btnLoading" @click="exportCsv">确定</el-button>
      </div>
      <el-dialog
        title="设置导出模板"
        :visible.sync="exportTemDialog"
        @close="getExpList"
        append-to-body
        width="1000px"
        center>
        <exportTem ref="exportTem" :moduleName='moduleName' @closeDialog='exportTemDialog=false'></exportTem>
      </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import exportTem from '@/components/export/exportTemplate'
export default {
  data(){
    return {
        selectTem:'',
        temOption:[],
        searchParams:{},
        exportTemDialog:false,
        exportFormat:'CSV',
        maxLength:10,
        moduleName:'',
        btnLoading:false,
        typeRadio:'USMARC',
        codeRadio:'UTF-8',
        isSeparator:false
    }
  },
  components:{
    exportTem,
  },
  props:['exportAll','idList','moudleType','vendibilityManage'],
  methods: {
    formatChange(data){
      if (data=='Marc') {
        this.typeRadio='USMARC'
        this.codeRadio='UTF-8'
      }
    },
    openExportTem(){
      this.exportTemDialog=true
      this.$nextTick(()=>{
        this.$refs.exportTem.initPage();
      })
    },
    init(params,str){
      this.exportFormat='CSV'
      this.isSeparator=false
      this.searchParams=params
      this.moduleName=str
      if (this.moudleType=='book') {
        this.getExpList()
      }
    },
    getExpList(){
      this.temOption=[]
      this.selectTem=''
      this.$get('/api/config/template/list/get',{module:this.moduleName}).then(res=>{
          this.temOption=res.data.result;
      })
    },
    exportCsv(){
      if (this.exportFormat=='Excel') {
        this.$message.warning('该功能暂未开发')
        return
      }
      // 图书
      if (this.moudleType=='book') {
        if (!this.selectTem&&this.exportFormat=='CSV') {
          this.$message.warning('请选择模板')
          return
        }
        var attrData={}
        this.temOption.forEach(moduleItem=>{
          if (moduleItem.id==this.selectTem) {
            JSON.parse(moduleItem.data).forEach(item=>{
              attrData[item.name]=item.comment
            })
          }
        })
        let fileType=''
        let obj={}
        let url=''
        if (this.exportFormat=='CSV') {
          obj.all=this.exportAll
          obj.attrs=JSON.stringify(attrData)
          obj.maxSize=this.maxLength*10000
          obj.formatIsbn=this.isSeparator
          if (this.$route.path=='/bookLibrary') {
            this.searchParams.id=0
          }
          if (this.$route.path=='/redListManage') {
            this.searchParams.id=1
          }
          if (this.$route.path=='/vendibilityManage') {
            this.searchParams.id=3
          }
          if (this.exportAll) {
            if (this.exportFormat=='Marc') {
              this.$message.warning('暂不支持Marc全选导出')
              return
            }
            obj.productQuery=this.searchParams
          }else{
            obj.isbns=this.idList
          }
          fileType='.zip'
          url='br/api/product/export'
        } else if (this.exportFormat=='Word'){
          obj.isbns=this.idList
          url='br/api/product/importProductDoc'
          fileType='.doc'
        } else if (this.exportFormat=='Marc'){
          obj.marcType=this.typeRadio
          obj.encoding=this.codeRadio
          obj.isbns=this.idList
          url='br/api/product/importProductMarc'
          fileType='.iso'
        }
        
        let fileName='图书'+new Date().getTime()+fileType
        this.downLoad(url,obj,fileName)
      }
      // 任务
      if (this.moudleType=='task') {
        let obj={
          flag:this.$route.path=='/bookCheck'?0:1,
          maxSize:this.maxLength*10000,
        }
        if (this.exportAll) {
          this.searchParams.pageNo=0
          this.searchParams.pageSize=0
          obj=Object.assign(obj,this.searchParams)
        }else{
          obj.ids=this.idList.join(',')
        }
        let fileName=(this.$route.path=='/bookCheck'?'图书':'图片')+'审读任务'+new Date().getTime()+'.csv'
        this.downLoad('br/api/mission/exportMissionInfo',obj,fileName)
      }
      // 任务清单
      if (this.moudleType=='taskDetail') {
        let obj={
          flag:0,
          maxSize:this.maxLength*10000,
        }
        if (this.exportAll) {
          this.searchParams.pageNo=0
          this.searchParams.pageSize=0
          obj=Object.assign(obj,this.searchParams)
        }else{
          obj.ids=this.idList.join(',')
        }
        let fileName='任务清单'+new Date().getTime()+'.csv'
        this.downLoad('br/api/mission/exportMission',obj,fileName)
      }
    },
    downLoad(url,data,fileName){
      this.btnLoading=true;
      axios.post(url,data,{responseType:'blob'}).then(res=>{
        this.btnLoading=false;
        if (!res.data) {
            return
        }
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download',fileName)
        document.body.appendChild(link)
        link.click()
        this.$emit('closeDialog')
      }).catch(err=>{
        this.btnLoading=false;
      })
    },
  }
}
</script>
<style lang='scss' scoped>
#selectTem{
  .cont{
    padding-left:30px;
    .MarcType{
      margin-top: 20px;
      .el-radio{
        margin-right: 8px;
      }
      .code{
        margin-left: 10px;
      }
    }
    .mt-20{
      margin-top:20px;
    }
    .label{
      margin-right:10px;
    }
    .el-select{
      width:200px;
    }
    .temSetBtn{
      cursor:pointer;
      color:#409eff;
      margin-left:100px;
    }
    .el-checkbox{
      margin-left: 80px;
    }
  }
  .btns{
      margin-top:60px;
      text-align:center;
  }

}
</style>

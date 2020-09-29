<template>
  <div id='batchUpload' v-loading='loading'>
    <div class="cont">
        <span><i>*</i> 上传附件：</span>
        <el-input v-model="uploadfile" disabled placeholder="请选择上传文件" size="mini" style="width:240px;"></el-input>
        <input style="display:none" id="bookUploadBtn" type="file" @change="importf($event)">
        <el-button type="primary" size="mini" @click="selectFile">上传</el-button>
        <span class="downBTn" @click="downLoad">上传模板</span>
    </div>
    <div class="table" v-show="bookNum>0">
      <div class="title"><i style="color:#e6a23c;" class="el-icon-info"></i> 当前列表有<b style="color:#409eff;font-size:15px;">{{bookNum}}</b>本书在产品库已存在，参照对比情况请选择您的操作</span></div>
      <div style="margin-top:10px">
        <el-button size="mini" @click="batchOperate('all')">全部覆盖</el-button>
        <el-button size="mini" @click="batchOperate('part')">部分覆盖</el-button>
        <el-button size="mini" @click="batchOperate('cancel')">取消</el-button>
        <el-button size="mini" @click="exportFuc">导出</el-button>
      </div>
      <el-table
        v-if="showTabel"
        :data="tableData"
        :span-method="objectSpanMethod"
        stripe
        border
        size='mini'
        @selection-change="handleSelectionChange"
        :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
        style="width: 100%; margin-top:5px">
        <el-table-column
          type="selection"
          width="45">
        </el-table-column>
        <el-table-column
          prop="index"
          label="列表序号"
          width="150">
        </el-table-column>
        <el-table-column
          v-if="false"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <i title="全部覆盖" @click="coverAll(scope.$index)" :class="scope.row.status=='all'?'icon-quanbu hl':'icon-quanbu'"></i>
            <i title="部分覆盖" @click="partCover(scope.row.isbn.value,scope.$index)" :class="scope.row.status=='part'&&scope.row.coverAttr.length>0?'icon-fugai hl':'icon-fugai'"></i>
            <i title="取消" @click="cancelCover(scope.row.isbn.value,scope.$index)" :class="scope.row.status=='cancel'?'el-icon-circle-close hl':'el-icon-circle-close'" style="font-size:20px;"></i>
          </template>
        </el-table-column>
        <el-table-column
          v-if="false"
          prop="loc"
          label="所在位置">
        </el-table-column>
        <el-table-column
          v-for="item in attrNew"
          :key="item.val"
          :prop="item.val"
          :label="item.label">
        </el-table-column>
      </el-table>
    </div>
    <div class="btns">
        <el-button size="medium" @click="closeDialog">取消</el-button>
        <el-button size="medium" type="primary" :loading="btnLoading" @click="sureUpload">确定</el-button>
    </div>

    <el-dialog
      title="部分覆盖"
      :visible.sync="coverDialog"
      append-to-body
      width="1000px">
      <div id="coverDialog">
        <div class="attrDiv" v-loading='attrLoading'>
          <input type="checkbox" v-if="attrGroup.length>0" v-model="checkedAll" @change="checkAll"> <b>全选</b> 
          <div v-for="item in attrGroup" class="group">
            <div v-if="item.attrs.length>0">
              <div><input type="checkbox" v-model="item.checked" @change="handlekChecked(item)"> <b>{{item.name}}</b></div>
              <div class="attrItem">
                  <span v-for="attrItem in item.attrs" class="attr">
                      <input type="checkbox" :value='attrItem.column_name' v-model="checkedAttr"><span :title="attrItem.column_comment">{{attrItem.column_comment.length>10?attrItem.column_comment.substring(0,10)+'...':attrItem.column_comment}}</span>
                  </span>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCont">
            <el-button size="medium" @click="coverDialog=false">取消</el-button>
            <el-button size="medium" type="primary" @click="surePartCover">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import axios from "axios";
import {mapGetters} from 'vuex'
const querystring = require('querystring');
export default {
  data(){
    return {
        loading:false,
        btnLoading:false,
        attrLoading:false,
        bookNum:0,
        checkedAttr:[],
        coverDialog:false,
        attr:[{
          label:'ISBN',
          val:'isbn.value'
        },{
          label:'主书名',
          val:'bookName.value'
        },{
          label:'副书名',
          val:'secondName.value'
        },{
          label:'丛书名',
          val:'seriesName.value'
        },{
          label:'中文参考译名',
          val:'cnName.value'
        },{
          label:'出版社',
          val:'publishers.value'
        },{
          label:'所属集团',
          val:'membershipGroup.value'
        },{
          label:'出版时间',
          val:'pubDate.value'
        },{
          label:'责任人',
          val:'personLiable.value'
        },{
          label:'装帧',
          val:'binding.value'
        },{
          label:'载体',
          val:'medium.value'
        },{
          label:'业务分类',
          val:'classification.value'
        },{
          label:'文版',
          val:'language.value'
        },{
          label:'标签',
          val:'label.value'
        }],
        attrNew:[
          {                 // 1
            label:'批次',
            val:'batch.value'
          },
          {                 // 2
            label:'序号',
            val:'number.value'
          },
          {                 // 3
            label:'ISBN',
            val:'isbn.value'
          },
          {                 // 4
            label:'主书名',
            val:'bookName.value'
          },
          {                 // 5
            label:'丛书名',
            val:'seriesName.value'
          },
          {                 // 6
            label:'副书名',
            val:'secondName.value'
          },
          {                 // 7
            label:'出版社',
            val:'publishers.value'
          },
          {                 // 8
            label:'责任人',
            val:'personLiable.value'
          },
          {                 // 9
            label:'责任人角色',
            val:'personLiableRole.value'
          },
          {                 // 10
            label:'出版时间',
            val:'pubDate.value'
          },
          {                 // 11
            label:'人工审读时间',
            val:'update.value'
          },
          {                 // 12
            label:'审读等级',
            val:'readLevel.value'
          },
          {                 // 13
            label:'备注',
            val:'remarks.value'
          }
        ],
        uploadfile:'',
        multipleSelection:[],
        fileData:'',
        tableData: [],
        curISBN:[],
        showTabel:true,
        attrGroup:[],
        checkedAll:false
    }
  },
  props:['modelName'],
  computed:{
      ...mapGetters(['productClassify'])
  },
  methods: {
      exportFuc(){
        if(this.multipleSelection.length>0){
          console.log('multipleSelection:=== ', this.multipleSelection)
          let curIsbnList = [];
          let curHeaderList = [];
          let count = 0;
          let getSelectIdxList = [];
          this.multipleSelection.forEach(curItem=>{
            if(curItem && curItem.index){
              getSelectIdxList.push(curItem.index);
            }
          })
          this.tableData.forEach(curItem=>{
            if(curItem && curItem.index && getSelectIdxList.indexOf(curItem.index)>-1){
              let curObj = {};
              this.attrNew.forEach(curKeyItem=>{
                if(curKeyItem && curKeyItem.label){
                  if(count==0){
                    curHeaderList.push(curKeyItem.label)
                  }
                  let key0 = curKeyItem.val.toString().split('.')[0];
                  let key1 = curKeyItem.val.toString().split('.')[1]
                  curObj[curKeyItem.label] = curItem && curItem[key0] && curItem[key0][key1] ? curItem[key0][key1] : null;
                }
              })
              curIsbnList.push(curObj);
            }
            count++;
          })
          let reqObj = {
            parameter: JSON.stringify({ 
              "headers":curHeaderList.join(','), 
              "products":curIsbnList
            })
          }
          // console.log(reqObj)
          axios.post('br/api/product/exportRepeatProduct', querystring.stringify(reqObj), {responseType:'blob'}).then(res=>{
            let url = window.URL.createObjectURL(new Blob([res.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', (this.modelName=='图书库'?'图书库全字段模板':'红名单更新字段')+new Date().getTime()+'.xls')
            document.body.appendChild(link)
            link.click()
          })
        }else{
          this.$message({
            type:'warning',
            message:'请至少选择一项导出'
          })
        }
      },
      checkAll(){
        if (this.checkedAll) {
            let arr=[]
            this.attrGroup.forEach(groupItem=>{
              groupItem.checked=true
              groupItem.attrs.forEach(item=>{
                  arr.push(item.column_name)
              })
            })
            this.checkedAttr=arr
        }else{
            this.attrGroup.forEach(item=>{
                item.checked=false
            })
            this.checkedAttr=[]
        }
      },
      handlekChecked(data){
        if (data.checked) {
          data.attrs.forEach(item=>{
              if (this.checkedAttr.indexOf(item.column_name)==-1) {
                  this.checkedAttr.push(item.column_name)
              }
          })
        }else{
          data.attrs.forEach(item=>{
              let index=this.checkedAttr.indexOf(item.column_name)
              this.checkedAttr.splice(index,1)
          })
        }
      },
      getAttrData(){
        this.attrGroup=[]
        this.attrLoading=true;
        this.$get('/api/product/getAllWords',{type:1}).then(res=>{
          this.attrLoading=false;
          let attrData=[]
          this.productClassify.forEach(item=>{
              if (item.value/1>0) {
                  attrData.push({name:item.name,type:item.value,checked:false,attrs:[]})
              }
          })
          res.data.result.forEach(item=>{
              item.listShowOrder=null
              attrData.forEach(obj=>{
                  if (item.column_type==obj.type) {
                      obj.attrs.push(item)
                  }
              })
          })
          this.attrGroup=attrData
        }).catch(err=>{
          this.attrLoading=false;
        })
      },
      downLoad(){
        let obj={
          mouldId:this.modelName=='图书库'?0:1
        }
        axios.post('br/api/product/downloadTemplate',querystring.stringify(obj),{responseType:'blob'}).then(res=>{
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', (this.modelName=='图书库'?'图书库全字段模板':'红名单更新字段')+new Date().getTime()+'.csv')
          document.body.appendChild(link)
          link.click()
        })
      },
      sureUpload(){
        if (!this.fileData) {
          this.$message.warning('请先上传附件')
          return
        }
        let obj=this.fileData;
        let arr=[];
        let allCoverList=[];
        let delList=[];
        let ids=[];
        let exist=false;
        let curBtnStates = '';
        this.tableData.forEach(item=>{
          // 判断已存在的图书是否已操作
          if (ids.indexOf(item.isbn.value)==-1) {
            ids.push(item.isbn.value)
            if (!item.status) {
              exist=true
              return
            }
          }
          if (item.status=='all') {
            allCoverList.push(item.isbn.value)
          }
          if (item.status=='cancel') {
            delList.push(item.isbn.value);
            curBtnStates = 'cancel'
          }
        })
        // 存在未操作的图书做出提示并跳出
        if (exist) {
          this.$message.warning('针对已存在图书，请选择您的操作')
          return
        }
        for (const k in obj) {
          if (obj[k].databaseproduct) {
            if (delList.indexOf(k)==-1) {
              if (allCoverList.indexOf(k)!=-1) {
                arr.push(obj[k].csvfileproduct)
              }else{
                arr.push(obj[k].databaseproduct)
              }
            }
          }else{
            arr.push(obj[k].csvfileproduct)
          }
        }
        if (arr.length==0) {
          console.log('curBtnStates', curBtnStates);
          if(curBtnStates == 'cancel'){
            this.$message.success('设置成功')
            this.$emit('closeDialog')
          }else{
            this.$message.warning('没有可上传的图书')
          }
          return
        }
        this.btnLoading=true;
        this.$post('/api/product/save',arr).then(res=>{
          this.btnLoading=false;
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('closeDialog')
          } else {
            this.$message.error(res.message)
          }
        }).catch(err=>{
          this.btnLoading=false;
        })
      },
      batchOperate(type){
        if (this.multipleSelection.length==0) {
          this.$message.warning('请至少选择一项')
          return
        }
        let arr=[]
        this.curISBN=[];
        this.multipleSelection.forEach((item,index)=>{
          if (arr.indexOf(item.isbn.value)==-1) {
            item.coverAttr=[]
            item.status=type
            arr.push(item.isbn.value)
          }
        })
        this.curISBN=arr;
        if (type=='part') {
          this.checkedAttr=[];
          this.coverDialog=true;
          this.getAttrData()
        }
      },
      cancelCover(id,i){
        this.tableData[i].status='cancel'
        this.curISBN=[id];
      },
      init(){
        this.uploadfile='';
        this.bookNum=0;
        this.tableData=[];
        this.fileData='';
      },
      partCover(id,i){
        if (this.tableData[i].status=='part') {
          this.checkedAttr=this.tableData[i].coverAttr
        }else{
          this.checkedAttr=[]
          this.tableData[i].coverAttr=[]
        }
        this.curISBN=[id];
        this.coverDialog=true;
        this.getAttrData()
      },
      coverAll(i){
        this.tableData[i].status='all'
      },
      surePartCover(){
        if (this.checkedAttr.length==0) {
          this.$message.warning('请勾选覆盖字段')
          return
        }
        this.curISBN.forEach(ite=>{
          this.fileData[ite].databaseproduct=JSON.parse(this.fileData[ite].initData) 
          this.checkedAttr.forEach(item => {
            let obj=this.fileData[ite]
            if (!obj.databaseproduct[item]) {
              obj.databaseproduct[item]={}
            }
            obj.databaseproduct[item].value=obj.csvfileproduct[item].value
          });
        })
        this.tableData.forEach(item=>{
          if (this.curISBN.indexOf(item.isbn.value)!=-1) {
            item.coverAttr=this.checkedAttr
            item.status='part'
          }
        })
        this.coverDialog=false;
      },
      changeData(obj){
        let arr=[];
        let count=1;
        let data=[];
        obj=JSON.parse(obj)
        for (const k in obj) {
          if (obj[k].databaseproduct) {
            data.push(k)
            let d=obj[k].csvfileproduct;
            d.index=count
            d.status=''
            d.coverAttr=[]
            d.loc='上传文件'
            arr.push(d)
            let o=obj[k].databaseproduct;
            o.index=count
            o.loc='产品库'
            arr.push(o)
            count++
          }
        }
        this.bookNum=data.length;
        this.tableData=arr.concat([]);
        console.log('tableData::: == ', this.tableData)
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex == 0||columnIndex == 1) {
        // if (columnIndex == 0||columnIndex == 1||columnIndex == 2) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      closeDialog(){
          this.$emit('closeDialog')
      },
      selectFile() {
        document.getElementById('bookUploadBtn').value='';
        document.getElementById('bookUploadBtn').click();
      },
      importf(obj) {
        if (!obj.target.files) {
          return;
        }
        var _this = this;
        var f = obj.target.files[0];
        var fileName =f.name;
        var fileext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
        if (fileext != '.csv') {
            this.$message.error('只能上传csv文件');
            return;
        }
        this.uploadfile=fileName;
        let formData = new FormData();
        formData.append('file',f)
        this.loading=true;
        var url='';
        if (this.modelName=='图书库') {
            url='/api/product/upload';
        }
        if(this.modelName=='红名单'){
            url='/api/product/uploadRedProduce';
        }
        this.$post(url,formData).then(res=>{
          this.loading=false;
          if (res.success) {
            if (res.data) {
              this.changeData(JSON.stringify(res.data))
              this.fileData=res.data;
              for (const k in this.fileData) {
                if (this.fileData[k].databaseproduct) {
                  this.fileData[k].initData=JSON.stringify(this.fileData[k].databaseproduct)
                }
              }
            }
          } else {
            this.$message.error(res.message)
          }
        }).catch(err=>{
          this.loading=false;
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
  }
}
</script>
<style lang='scss' scoped>
#batchUpload{
    padding-top: 50px;
    .cont{
      width: 450px;
      margin-top:50px;
      margin: auto;
      span{
        i{
            color: red;
        }
      }
      .downBTn{
        font-size:12px;
        margin-left: 10px;
        color: #409eff;
        cursor: pointer;
      }
    }
    .table{
      margin-top:20px;
      text-align: left;
    }
    .btns{
        margin-top:80px;
        margin-bottom:40px;
    }
    .img{
      width:23px;
      position: relative;
      bottom: -4px;
    }
    .hl{
      color:#409eff;
    }
    .btns{
      text-align: center;
    }
}
#coverDialog{
  .attrDiv{
    min-height:300px;
    padding:0 20px;
    .group{
      margin-top: 20px;
    }
    .attrItem{
      margin-top:10px;
      padding-left:20px;
      .attr{
        display: inline-block;
        width:200px;
        margin-right:20px; 
        margin-bottom:6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .btnCont{
    text-align:center;
    margin-top: 30px;
  }
}
</style>

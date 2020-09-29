<template>
    <div id='exportTemplate'>
        <div class="list">
            <el-input size='mini' v-model="searchName" @keyup.enter.native="getTemList"  style="width:165px;">
                <el-button size='mini' slot="append" icon="el-icon-search" @click="getTemList"></el-button>
            </el-input>
            <i @click="initPage" title="添加模板" class="el-icon-plus addBtn"></i>
            <div class="temList" v-loading='loading'>
                <div v-for="item in temList">{{item.name.length>8?item.name.slice(0,8)+'...':item.name}}
                    <span class="operateBtn">
                        <i @click="editTem(item)" class="el-icon-edit"></i>
                        <i @click="delTem(item.id)" style="color:#f00;" class="el-icon-delete"></i>
                    </span>
                </div>
            </div>
        </div>
        <div class="add">
            <div>
                <span>模板名称：</span>
                <el-input size='small' style="width:200px;" v-model="temName" placeholder="请输入模板名称"></el-input>
            </div>
            <div>
                <div class="title">
                    <span>导出字段：</span>
                    <input type="checkbox" v-model="checkedAll" @change="checkAll"> <b>全部</b> 
                </div>
                <div class="attrDiv">
                    <div v-for="item in attrGroup" class="group">
                        <div v-if="item.attrs.length>0">
                            <div><input type="checkbox" v-model="item.checked" @change="handlekChecked(item)"> <b>{{item.name}}</b></div>
                            <div class="attrItem">
                                <span v-for="attrItem in item.attrs" class="attr">
                                    <input type="checkbox"  :value='attrItem.column_comment' v-model="checkedList" @change="handlekAttr($event,item)"><span :title="attrItem.column_comment">{{attrItem.column_comment.length>8?attrItem.column_comment.substring(0,8)+'...':attrItem.column_comment}}</span>
                                    <input type="text" v-if="attrItem.listShowOrder != null" :value="attrItem.listShowOrder" @change="showConfigOrder($event, attrItem)" class="order">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns">
                <el-button size="medium" @click="closeDialog">取消</el-button>
                <el-button size="medium" type="primary" :loading="btnLoading" @click="saveTem">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return {
            temList:[],
            temName:'',
            checkedAll:false,
            allAttrs:[],
            checkedList:[],
            searchName:'',
            curTemId:null,
            loading:false,
            btnLoading:false,
            attrGroup:[]
        }
    },
    props:['moduleName'],
    watch:{
        checkedList(){
            this.allAttrs.forEach((item, index) => {
                if (this.checkedList.indexOf(item.column_comment) != -1) {
                    item.listShowOrder = this.checkedList.indexOf(item.column_comment) + 1;
                } else {
                    item.listShowOrder = null;
                }
            })
        }
    },
    created() {
        console.log('this.mouldName')
        console.log(this.mouldName)
    },
    computed:{
        ...mapGetters(['productClassify'])
    },
    methods: {
        handlekAttr(e,data){
            if (data.checked) {
                if (!e.target.checked) {
                    data.checked=false
                }
            }
        },
        handlekChecked(data){
            if (data.checked) {
                data.attrs.forEach(item=>{
                    if (this.checkedList.indexOf(item.column_comment)==-1) {
                        this.checkedList.push(item.column_comment)
                    }
                })
            }else{
                data.attrs.forEach(item=>{
                    let index=this.checkedList.indexOf(item.column_comment)
                    this.checkedList.splice(index,1)
                })
            }
        },
        // 显示字段排序
        showConfigOrder(event, data) {
            if (/[\D.]/.test(event.target.value)||event.target.value==='') {
                event.target.value = data.listShowOrder;
                return
            }
            data.listShowOrder=event.target.value
        },
        delTem(id){
            this.$confirm('确定删除该模板?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$get('/api/config/template/del',{id:id}).then(res=>{
                    if (res.success) {
                        this.$message.success('删除成功')
                        this.initPage()
                    } else {
                        this.$message.error('删除失败')
                    }
                })
            })
        },
        editTem(data){
            this.curTemId=data.id;
            this.temName=data.name;
            this.checkedAll=false;
            this.attrGroup.forEach(item=>{
                item.checked=false
            })
            let arr=[]
            JSON.parse(data.data).forEach(item=>{
                arr.push(item.comment)
                this.allAttrs.forEach(attr=>{
                    if (attr.column_comment==item.comment) {
                        attr.listShowOrder=item.listShowOrder
                    }
                })
            })
            this.checkedList=arr
        },
        initPage(){
            this.getAttrData()
            this.curTemId=null
            this.temName=''
            this.checkedAll=false
            this.checkedList=[]
            this.getTemList()
        },
        saveTem(){
            if (this.temName.trim()=='') {
                this.$message.warning('模板名称不能为空');
                return
            }
            if (this.checkedList.length==0) {
                this.$message.warning('请选择需要导出的字段');
                return
            }
            //   判断自定义名称是否已存在
            let isExist=false
            this.temList.forEach(item=>{
                if (this.curTemId) {
                    if (item.id!=this.curTemId&&item.name==this.temName) {
                        isExist=true
                        return
                    }
                }else{
                    if (item.name==this.temName) {
                        isExist=true
                        return
                    }
                }
            })
            if (isExist) {
                this.$message.warning('该模板名称已存在')
                return
            }  
            let attrs=[];
            this.allAttrs.forEach(item=>{
                if (item.listShowOrder) {
                    attrs.push({
                        comment:item.column_comment,
                        name:item.column_name,
                        listShowOrder:item.listShowOrder
                    })
                }
            })
            attrs=attrs.sort((a,b)=>{
                return a['listShowOrder']-b['listShowOrder']
            })
            var isRepetition=false
            for (let i = 0; i < attrs.length; i++) {
                if (i<attrs.length-1) {
                    if (attrs[i].listShowOrder==attrs[i+1].listShowOrder) {
                        isRepetition=true
                    }
                }
            }
            if (isRepetition) {
                this.$message.warning("排序不能重复");
                return
            }
            this.btnLoading=true
            if (this.curTemId) {
                let params={
                    id:this.curTemId,
                    name:this.temName,
                    module:this.moduleName,
                    data:JSON.stringify(attrs)
                }
                this.$post('/api/config/template/edit',params).then(res=>{
                    this.btnLoading=false
                    if (res.success) {
                        this.$message.success('修改成功')
                        this.initPage()
                    } else {
                        this.$message.error('修改失败')
                    }
                }).catch(err=>{
                    this.btnLoading=false
                })
            } else {
                let params={
                    name:this.temName,
                    module:this.moduleName,
                    data:JSON.stringify(attrs) ,
                    operator:'张三'
                }
                this.$post('/api/config/template/save',params).then(res=>{
                    this.btnLoading=false
                    if (res.success) {
                        this.$message.success('模板添加成功')
                        this.initPage()
                    } else {
                        this.$message.error('添加失败')
                    }
                }).catch(err=>{
                    this.btnLoading=false
                })
            }
        },
        getTemList(){
            this.temList=[];
            this.loading=true;
            this.$get('/api/config/template/list/get',{module:this.moduleName,mouldName:this.searchName}).then(res=>{
                this.loading=false;
                this.temList=res.data.result
            })
        },
        getAttrData(){
            this.attrGroup=[]
            this.allAttrs=[]
            let params={}
            if (this.moduleName=='redListExport') {
                params.type=1
            }else if (this.moduleName=='paperExport') {
                params.type=2
            }else{
                params=null 
            }
            this.$get('/api/product/getAllWords',params).then(res=>{
                let data=[];
                res.data.result.forEach(item=>{
                    if (item.column_type>0) {
                        data.push(item)
                    }
                })
                this.allAttrs=data.sort((a,b)=>{
                    return a['column_type']-b['column_type']
                });
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
            })
        },
        checkAll(){
            if (this.checkedAll) {
                let arr=[]
                this.allAttrs.forEach(item=>{
                    arr.push(item.column_comment)
                })
                this.attrGroup.forEach(item=>{
                    item.checked=true
                })
                this.checkedList=arr
            }else{
                this.attrGroup.forEach(item=>{
                    item.checked=false
                })
                this.checkedList=[]
            }
        },
        closeDialog(){
            this.$emit('closeDialog')
        },
    }
}
</script>
<style lang='scss' scoped>
#exportTemplate{
    display:flex;
    min-height:400px;
    .list{
        width:300px;
        border-right:solid 1px #e6e6e6;
        .addBtn{
            font-size: 17px;
            position: relative;
            bottom: -10px;
            font-weight: bold;
            left: 5px;
            color: #409eff;
        }
        .temList{
            height: calc(100% - 50px);
            overflow-y: auto;
            margin-top:15px;
            div{
                line-height:28px;
                .operateBtn{
                    margin-left:10px;
                    display:none;
                }
                &:hover .operateBtn{
                    display: inline-block;
                }
                &:nth-child(even){
                    background: #f6f6f6;
                }
            }
        }
    }
    .add{
        width:100%;
        padding-left:20px;
        .title{
            margin: 25px 0 10px 0;
        }
        .attrDiv{
            margin-left: 73px;
            .group{
                margin-top: 20px;
            }
            .attrItem{
                margin-top:10px;
                padding-left:20px;
                .attr{
                    display: inline-block;
                    width:184px;
                    margin-right:20px; 
                    margin-bottom:6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    .order{
                        width:50px;
                        text-align:center;
                    }
                }
            }
        }
        .btns{
            text-align: center;
            margin-top:60px;
        }
    }
}
</style>

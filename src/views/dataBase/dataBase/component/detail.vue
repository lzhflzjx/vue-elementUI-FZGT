<template>
    <div id='dataBaseDetail'>
        <div class="top">
            <el-button v-if="!editStatu" size="medium" type="primary" @click="editStatu=!editStatu">编辑</el-button>
            <div v-if="editStatu"><b class="red">*</b> 标识字段为必填项</div>
        </div>
        <div v-for="item in attrList" class="item">
            <label><b v-if="item.attr=='baseName'" class="red">*</b> {{item.label}}：</label>
            <div class="rCont">
                <div v-if="item.type=='textarea'" class="textarea">
                    <div v-if="!editStatu">{{dataBsDetail[item.attr]}}</div>
                    <el-input v-if="editStatu" type="textarea" :autosize="{ minRows: 3, maxRows: 6}"  v-model="dataBsDetail[item.attr]"></el-input>
                </div>
                <div v-else-if="item.type=='inputGroup'" v-for="(sjItem,index) in dataBsDetail.subjectList" class="sjItem">
                    <div v-if="!editStatu">{{sjItem.val}}</div>
                    <div v-if="editStatu">
                        <el-input size="small" v-model="sjItem.val"></el-input> <i @click="handlesj(index)" :class="index==0?'el-icon-circle-plus':'el-icon-remove'"></i>
                    </div>
                </div>
                <div v-else class="input">
                    <div v-if="!editStatu">{{dataBsDetail[item.attr]}}</div>
                    <div v-if="editStatu">
                        <el-input v-if="item.label=='内容总量'" size="small" v-model="dataBsDetail[item.attr]" @keyup.native="dataBsDetail[item.attr]=dataBsDetail[item.attr].replace(/[^\d]/g,'')"></el-input>
                        <el-input v-else size="small" v-model="dataBsDetail[item.attr]"></el-input>
                    </div>
                </div>
            </div>
        </div>
        <div  v-if="editStatu" class="foot">
            <el-button size="medium" type="primary" @click="initData">清空</el-button>
            <el-button size="medium" type="primary" :loading="saveLoading" @click="save">确定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            saveLoading:false,
            editStatu:false,
            dataBsDetail:{
                normativeName:'',
                baseName:'',
                abbreviation:'',
                trivialName:'',
                intro:'',
                recordType:'',
                producerName:'',
                producerAbbreviation:'',
                baseDealer:'',
                baseDealerAbbreviation:'',
                subjectList:[{val:''}],
                indicating:'',
                collectedType:'',
                collectedScope:'',
                updateFrequency:'',
                sCICondition:'',
                comment:'',
                openURl:'',
                total:'',
            },
            attrList:[
                {label:'数据库DRAA规范名称',attr:'normativeName'},
                {label:'数据库全称',attr:'baseName'},
                {label:'简称',attr:'abbreviation'},
                {label:'惯用名',attr:'trivialName'},
                {label:'数据库简介',attr:'intro',type:'textarea'},
                {label:'文种',attr:'recordType'},
                {label:'生产商全称',attr:'producerName'},
                {label:'生产商简介',attr:'producerAbbreviation'},
                {label:'数据库商',attr:'baseDealer'},
                {label:'数据库提供方简介',attr:'baseDealerAbbreviation',type:'textarea'},
                {label:'所属学科',attr:'subjectList',type:'inputGroup'},
                {label:'文献揭示层次',attr:'indicating'},
                {label:'收录文献类型',attr:'collectedType'},
                {label:'收录范围',attr:'collectedScope'},
                {label:'更新频率',attr:'updateFrequency'},
                {label:'Sci收录情况',attr:'sCICondition'},
                {label:'同行评议',attr:'comment'},
                {label:'openURL接口',attr:'openURl'},
                {label:'内容总量',attr:'total'},
            ],
        }
    },
    methods: {
        save(){
            if (!this.dataBsDetail.baseName.trim()) {
                this.$message.warning('数据库全称不能为空')
                return
            }
            if (this.dataBsDetail.subjectList) {
                let arr=[];
                this.dataBsDetail.subjectList.forEach(item=>{
                    if (item.val) {
                        arr.push(item.val)
                    }
                })
                this.dataBsDetail.subjectList=arr;
            }
            let url='';
            if (this.dataBsDetail.id) {
                url='/api/dataBaseManage/updateDataBase'
            } else {
                url='/api/dataBaseManage/insertDataBase'
            }
            this.saveLoading=true;
            this.$post(url,this.dataBsDetail).then(res=>{
                this.saveLoading=false;
                if (res.success) {
                    this.$message.success(res.message);
                    this.$emit('closeDialog')
                }else{
                    this.$message.error(res.message);
                }
            }).catch(err=>{
                this.saveLoading=false;
            })
        },
        init(type,data){
            this.initData()
            if (data) {
                if (data.subject) {
                    let arr=[];
                    data.subject.split(';').forEach(item=>{
                        arr.push({val:item})
                    })
                    data.subjectList=arr;
                }else{
                    data.subjectList=[{val:''}];
                }
                this.dataBsDetail=JSON.parse(JSON.stringify(data));
            }
            if (type=='edit') {
                this.editStatu=true;
            } else {
                this.editStatu=false;
            }
        },
        initData(){
            for (const k in this.dataBsDetail) {
                if (k=='subjectList') {
                    this.dataBsDetail[k]=[{val:''}]
                } else {
                    this.dataBsDetail[k]=''
                }
            }
        },
        handlesj(index){
            if (index==0) {
                this.dataBsDetail.subjectList.push({val:''})
            } else {
                this.dataBsDetail.subjectList.splice(index,1)
            }
        },
    }
}
</script>
<style lang='scss' scoped>
#dataBaseDetail{
    .red{
        color: red;
    }
    .top{
        text-align: right;
        padding: 20px 0;
    }
    .item{
        margin-bottom: 20px;
        min-height: 32px;
        label{
            display: inline-block;
            width: 300px;
            text-align: right;
            vertical-align: top;
        }
        .rCont{
            display: inline-block;
            .input{
                width: 400px;
            }
            .textarea{
                width: 600px;
            }
            .sjItem{
                width: 440px;
                margin-bottom: 10px;
                .el-input{
                    width: calc(100% - 40px);
                }
                i{
                    position: relative;
                    bottom: -3px;
                    font-size: 23px;
                    margin-left: 10px;
                    color: #409eff;
                }
            }
        }
    }
    .foot{
        margin-top: 50px;
        text-align: center;
        .el-button{
            margin-right: 20px;
        }
    }
}
</style>

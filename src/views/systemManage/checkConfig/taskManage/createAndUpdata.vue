<template>
    <div id='ruleBox'>
        <div class="formDiv">
            <!-- type为0（机审任务）1（ERP任务）2（批量修改） -->
            <div class="formItem" v-if="ruleForm.type!=2">
                <label class="label"><i>*</i> 规则类型：</label>
                <el-radio-group v-model="ruleForm.type">
                    <el-radio :label="0">机审任务</el-radio>
                    <el-radio :label="1">ERP订单任务</el-radio>
                </el-radio-group>
            </div>
            <div class="formItem" v-if="ruleForm.type!=2">
                <label class="label"><i>*</i> 规则名称：</label>
                <el-input v-model="ruleForm.name" placeholder="请输入规则名称" size="mini" style="width:200px;"></el-input>
            </div>
            <div class="formItem" v-if="ruleForm.type==0">
                <label class="label"><i>*</i> 优先级：</label>
                <el-select v-model="ruleForm.level" size="mini" style="width:85px">
                    <el-option
                    v-for="item in reviewLevel"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="formItem" v-if="ruleForm.type==0">
                <label class="label">出版社：</label>
                  <el-select
                    v-model="ruleForm.press"  
                    style="width:200px"
                    size="mini"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="findPulishers"
                    :loading="loading">
                    <el-option
                    v-for="item in pressOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="formItem" v-if="ruleForm.type==0">
                <label class="label">所属集团：</label>
                <!-- <el-select v-model="ruleForm.group" size="mini" style="width:200px">
                    <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> -->

                <el-select
                    v-model="ruleForm.group"  
                    style="width:200px"
                    size="mini"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="findMembershipGroups"
                    :loading="loading">
                    <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="formItem" v-if="ruleForm.type==0">
                <label class="label">出版时间：</label>
                <el-date-picker
                    v-model="ruleForm.publishDate"
                    style="width:312px"
                    size="mini"
                    type="daterange"
                    value-format='yyyy-MM-dd HH:mm:ss'
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="formItem" v-if="ruleForm.type==0">
                <label class="label">机审时间：</label>
                <el-date-picker
                    v-model="ruleForm.machineDate"
                    style="width:312px"
                    size="mini"
                    type="datetimerange"
                    value-format='yyyy-MM-dd HH:mm:ss'
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="formItem" v-if="ruleForm.type==0">
                <label class="label"><i>*</i> 时间周期：</label>
                <el-input v-model.number="ruleForm.datePeriod" size="mini" style="width:51px;"></el-input>
                <el-select v-model="ruleForm.periodVal" size="mini" style="width:58px">
                    <el-option
                    v-for="item in periodOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="formItem" v-if="ruleForm.type==1">
                <label class="label"><i>*</i> 单人分配任务上限：</label>
                <el-input-number v-model="ruleForm.upperLimit" size="mini" :min="1" :max="10000" style="width:105px"></el-input-number>
            </div>
            <div class="formItem" v-if="ruleForm.type==1">
                <label class="label"><i>*</i> 语种：</label>
                <el-select v-model="ruleForm.language" size="mini" style="width:200px">
                    <el-option
                    v-for="item in languageOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="formItem">
                <label style="vertical-align:top;" class="label"><i>*</i> 审读员：</label>
                <el-tree
                    ref="tree"
                    style="display:inline-block;"
                    :data="readerList"
                    show-checkbox
                    node-key="id"
                    @check-change="handleCheck">
                </el-tree>
            </div>
            <div class="formItem" v-if="ruleForm.type==0||ruleForm.type==2">
                <label class="label"><i>*</i> 规则生效日期：</label>
                <el-date-picker
                    v-model="ruleForm.startDate"
                    value-format='yyyy-MM-dd HH:mm:ss'
                    size="mini"
                    style="width:180px"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <div class="formItem" v-if="ruleForm.type==0||ruleForm.type==2">
                <label class="label">规则失效日期：</label>
                <el-date-picker
                    v-model="ruleForm.endDate"
                    value-format='yyyy-MM-dd HH:mm:ss'
                    size="mini"
                    style="width:180px"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <div class="btns">
                <el-button size="medium" @click="resetForm">清空</el-button>
                <el-button size="medium" :loading='submitLoading' type="primary" @click="submitForm()">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import axios from 'axios'
const querystring = require('querystring');
export default {
    data(){
        return {
            submitLoading:false,
            ruleForm: {
                id:null,
                type:0,
                name:'',
                level:'',
                press:'',
                group:'',
                publishDate:'',
                machineDate:'',
                datePeriod:'',
                startDate: '',
                endDate: '',
                language:'',
                upperLimit:1,
                checkPers:[],
                periodVal:'day',
                readername:''
            },
            periodOptions:[
                {
                    value:'day',
                    label:'日'
                },
                {
                    value:'month',
                    label:'月'
                },
                {
                    value:'year',
                    label:'年'
                }
            ],
            groupOptions:[],
            languageOptions:[{
                value:'英文',
                label:'英文'
            }],
            pressOptions:[],
            value: [],
            list: [],
            loading: false,
            states: [],
            }
    },
    props:['pageName','ruleData'],
    computed:{
        ...mapGetters(['readerList','reviewLevel']),
    },
    methods: {
        findPulishers(query){
            if (query !== '') {
            this.loading = true;
            this.$post('/api/publisher/findPulishers',querystring.stringify({'pulisher':query})).then(res=>{
                this.states = []
                res.data.result.forEach(element => {
                    this.states.push(element.publishers)
                });
                this.list = this.states.map(item => {
                    return { value: `${item}`, label: `${item}` };
                });
                this.loading = false;
                this.pressOptions = this.list.filter(item => {
                return item.label.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
                });
            }).catch(err=>{
                this.loading=false;
            })
            } else {
            this.pressOptions = [];
            }

        },
        findMembershipGroups(query){
            if (query !== '') {
                this.loading = true;
                this.$post('/api/publisher/findMembershipGroups',querystring.stringify({'membershipGroup':query})).then(res=>{
                this.states = []
                res.data.result.forEach(element => {
                    this.states.push(element.membershipGroup)
                });
                this.list = this.states.map(item => {
                    return { value: `${item}`, label: `${item}` };
                });
                this.loading = false;
                this.groupOptions = this.list.filter(item => {
                return item.label.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
                });
            }).catch(err=>{
                this.loading=false;
            })
            } else {
            this.groupOptions = [];
            }
 
        },
        init(){
            this.initData()
            if (this.pageName=='修改规则') {
                this.ruleForm.id=this.ruleData.id
                this.ruleForm.type=this.ruleData.ruleType
                this.ruleForm.name=this.ruleData.ruleName
                this.ruleForm.level=this.ruleData.priority.toString()
                this.ruleForm.press=[this.ruleData.publishers[0]] == "" ? null : [this.ruleData.publishers]
                this.ruleForm.group=[this.ruleData.membershipGroup[0]] == "" ? null : [this.ruleData.membershipGroup]
                this.ruleForm.publishDate=[this.methods.changeTime(this.ruleData.pub_begin_date),this.methods.changeTime(this.ruleData.pub_end_date)]
                this.ruleForm.machineDate=[this.methods.changeTime(this.ruleData.machine_begin_date),this.methods.changeTime(this.ruleData.machine_end_date)]
                this.ruleForm.datePeriod=this.ruleData.cycle_value
                this.ruleForm.periodVal=this.ruleData.cycle_time
                this.ruleForm.startDate=this.methods.changeTime(this.ruleData.begin_date)
                this.ruleForm.endDate=this.methods.changeTime(this.ruleData.end_date)
                this.ruleForm.upperLimit=this.ruleData.limitCount
                this.ruleForm.language=this.ruleData.language
                this.ruleForm.checkPers=this.ruleData.reader.split(',')
                this.ruleForm.create_date=this.ruleData.create_date
                this.ruleForm.readername=this.ruleData.readerName
                this.$nextTick(()=>{
                    this.$refs.tree.setCheckedKeys(this.ruleData.reader.split(','))
                })
            }
            if (this.pageName=='批量修改') {
                this.ruleForm.type=2
            }
        },
        initData(){
            this.$nextTick(()=>{
                this.$refs.tree.setCheckedNodes([])
            })
            this.ruleForm.id=null
            this.ruleForm.type=0
            this.ruleForm.name=''
            this.ruleForm.level=''
            this.ruleForm.press=''
            this.ruleForm.group=''
            this.ruleForm.publishDate=''
            this.ruleForm.machineDate=''
            this.ruleForm.datePeriod=''
            this.ruleForm.startDate=''
            this.ruleForm.endDate=''
            this.ruleForm.language=''
            this.ruleForm.upperLimit=1
            this.ruleForm.checkPers=[]
            this.ruleForm.periodVal='day'
            this.ruleForm.create_date=null
            this.ruleForm.readername=''
        },
        resetForm(){
            this.$refs.tree.setCheckedNodes([])
            this.ruleForm.name=''
            this.ruleForm.level=''
            this.ruleForm.press=''
            this.ruleForm.group=''
            this.ruleForm.publishDate=''
            this.ruleForm.machineDate=''
            this.ruleForm.datePeriod=''
            this.ruleForm.periodVal='day'
            this.ruleForm.startDate=''
            this.ruleForm.endDate=''
            this.ruleForm.language=''
            this.ruleForm.upperLimit=1
            this.ruleForm.checkPers=[]
            this.ruleForm.readername=''
        },
        handleCheck(){
            let checkPer=this.$refs.tree.getCheckedNodes();
            let checkedArr=[];
            let names=[];
            checkPer.forEach((item,index) => {
                if (!item.children) {
                    checkedArr.push(item.id)
                    names.push(item.label)
                }
            })
            this.ruleForm.checkPers=checkedArr
            this.ruleForm.readername=names.join(',')
        },
        submitForm() {
            if (this.ruleForm.checkPers.length==0) {
                this.$message.warning('请选择审读员')
                return
            }
            if (this.pageName=='批量修改') {
                if (this.ruleForm.startDate=='') {
                    this.$message.warning('规则生效日期不能为空')
                    return
                }
                var params={
                    ids:this.ruleData,
                    reader:this.ruleForm.checkPers.join(','),
                    beginDate:this.ruleForm.startDate,
                    endDate:this.ruleForm.endDate
                }
            } else {
                if (this.ruleForm.name=='') {
                    this.$message.warning('请输入规则名称')
                    return
                }
                var params={
                    id:this.ruleForm.id,
                    ruletype:this.ruleForm.type,
                    rulename:this.ruleForm.name,
                    reader:this.ruleForm.checkPers.join(','),
                    create_date:this.ruleForm.create_date?this.ruleForm.create_date:null
                }
                if (this.ruleForm.type==0) {
                    if (this.ruleForm.level==='') {
                        this.$message.warning('请选择优先级')
                        return
                    }
                    if (this.ruleForm.startDate=='') {
                        this.$message.warning('规则生效日期不能为空')
                        return
                    }
                    if (this.ruleForm.datePeriod=='') {
                        this.$message.warning('时间周期不能为空')
                        return
                    }
                    params.priority=this.ruleForm.level
                    params.publishers=this.ruleForm.press == null ? "" :this.ruleForm.press.toString()
                    params.membershipgroup=this.ruleForm.group == null ? "" :this.ruleForm.group.toString()
                    params.pub_begin_date=this.ruleForm.publishDate[0]?this.ruleForm.publishDate[0]:''
                    params.pub_end_date=this.ruleForm.publishDate[1]?this.ruleForm.publishDate[1]:''
                    params.machine_begin_date=this.ruleForm.machineDate[0]?this.ruleForm.machineDate[0]:''
                    params.machine_end_date=this.ruleForm.machineDate[1]?this.ruleForm.machineDate[1]:''
                    params.cycle_value=this.ruleForm.datePeriod
                    params.cycle_time=this.ruleForm.periodVal
                    params.begin_date=this.ruleForm.startDate
                    params.end_date=this.ruleForm.endDate
                } else {
                    if (this.ruleForm.language=='') {
                        this.$message.warning('请选择语种')
                        return
                    }
                    params.priority=2
                    params.limitcount=this.ruleForm.upperLimit
                    params.language=this.ruleForm.language
                }
            }
            params.readername=this.ruleForm.readername
            this.submitLoading=true;
            if (this.pageName=='批量修改') {
                this.$get('/api/rule/updateRule',params).then(res=>{
                    this.submitLoading=false;
                    if (res.success) {
                        this.$message.success(res.message)
                        this.$emit('closeRule')
                    } else {
                        this.$message.error(res.message) 
                    }
                }).catch(err=>{
                    this.submitLoading=false;
                })
            }else{
                this.$post('/api/rule/saveRule',params).then(res=>{
                    this.submitLoading=false;
                    if (res.success) {
                        this.$message.success(res.message)
                        this.$emit('closeRule')
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err=>{
                    this.submitLoading=false;
                })
            }
        },
    }
}
</script>
<style lang='scss' scoped>
    #ruleBox{
        .formDiv{
            margin-left: 250px;
            .formItem{
                margin-bottom:30px;
                .label{
                    display: inline-block;
                    width:140px;
                    text-align: right;
                    margin-right:10px;
                    color: gray;
                    i{
                        color: red;
                    }
                }
            }
            .btns{
              margin-top:80px;
              margin-left: 160px;
            }
        }
    }
</style>

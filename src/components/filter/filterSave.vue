<template>
    <div id="filtSava">
        <div class="name">
            <span>查询名称：</span>
            <el-input v-model="configName" placeholder="请输入名称" size="mini" style="width:220px"></el-input>
        </div>
        <div class="filtDiv">
            <span>增加查询条件 </span>
            <el-select v-model="addFiltModel" filterable size="mini" style="width:130px" placeholder="请选择" @change="addFilter">
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
            <span style="margin-left:100px;margin-right:30px;"><input type="checkbox" v-model="disabledData">是否检索已停用数据</span>
            <span><input type="checkbox" v-model="paperBook">是否仅查询纸质图书</span>
            <div style="margin-top:10px;">
                <div v-for="(item,index) in selectFilt" style="display:inline-block;width:50%;">
                    <!-- 关系 -->
                    <span style="display:inline-block;min-width:70px;">
                        <el-select v-model="item.relation" size="mini" style="width:71px;" v-if="index!=0">
                            <el-option
                                v-for="obj in conditionList[0]"
                                :key="obj.value"
                                :label="obj.label"
                                :value="obj.value">
                            </el-option>
                        </el-select>
                    </span>
                    <!-- 名称 -->
                    <div style="width:110px;display:inline-block;margin-bottom:15px;">
                        <!-- <input type="checkbox" :value="item" v-model="checkData"  @change="chanceChecked(item,$event)"> -->
                        <span style="margin-right:0px;">{{item.label}}</span>
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
                    <el-select clearable v-model="item.val" size="mini" style="width:220px" v-if="typeof(item.valType)=='number'&&item.valType!=6&&item.valType!=12&&item.valType!=13">
                        <el-option
                            v-for="obj in valOption[item.valType]"
                            :key="obj.value"
                            :label="obj.label"
                            :value="obj.value">
                        </el-option>
                    </el-select>
                    <!-- 值为枚举多选 -->
                    <el-select v-model="item.val" multiple collapse-tags size="mini" style="width:220px;" v-if="item.valType==6">
                        <el-option
                        v-for="item in valOption[item.valType]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <!-- 值为树形结构 -->
                    <el-cascader v-if="item.valType==12||item.valType==13" v-model="item.val" clearable :show-all-levels="false" size="mini" style="width:220px;" placeholder="请选择" :options="valOption[item.valType]" :props="defaultProps" filterable></el-cascader>
                    <!-- 值为文本 -->
                    <el-input clearable v-model="item.val" size="mini" style="width:220px" v-if="item.valType=='input'"></el-input>
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
                            style="width:220px"
                            size="mini"
                            :type="item.name=='pubDate'?'daterange':'datetimerange'"
                            value-format='yyyy-MM-dd HH:mm:ss'
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                        <el-date-picker
                            v-show="item.condition!='between'"
                            v-model="item.val"
                            value-format='yyyy-MM-dd HH:mm:ss'
                            style="width:220px"
                            size="mini"
                            :type="item.name=='pubDate'?'date':'datetime'"
                            placeholder="选择日期">
                        </el-date-picker>
                    </span>
                    <!-- 值为文件 -->
                    <span v-if="item.valType=='file'">
                        <el-input clearable v-model="item.val" placeholder="多个ISBN用顿号间隔" size="mini" style="width:170px;"></el-input>
                        <input style="display:none" id="saveFilterImportBtn" type="file" @change="importf($event,item)">
                        <i style="font-size:20px;color:#409EFF;" class="el-icon-upload2" @click="selectFile" title="导入"></i>
                        <a href="./static/ISBNTemplate.xlsx" style="font-size:20px;" class="el-icon-download" title="下载模板"></a>
                    </span>
                </div>
            </div>
        </div>
        <div class="btns">
            <el-button size="medium" @click="$emit('closeSavaPage')">取消</el-button>
            <el-button size="medium" type="primary" :loading="loading" @click="configSava">确定</el-button>
        </div>
    </div>
</template>

<script>
import modeData from '@/components/js/filtData.js'
import addFiltData from '@/components/js/addFiltData.js'
import XLSX from 'xlsx'
export default {
    data(){
        return {
            configName:'',
            disabledData:false,
            paperBook:false,
            addFiltList:JSON.parse(JSON.stringify(addFiltData.bookList)),
            addFiltModel: '',
            checkData:[],
            conditionList:modeData.conditionOption,
            selectFilt:[],
            configID:'',
            loading:false
        }
    },
    props:['curModelName','customList','valOption'],
    watch:{
        selectFilt(){
            let arr=[]
            this.selectFilt.forEach(item=>{
                arr.push(item.name)
            })
            this.addFiltList.forEach(obj=>{
                obj.options.forEach(item=>{
                    if (arr.indexOf(item.name)!=-1) {
                        item.disabled=true
                    }
                })
            })
        }
    },
    methods: {
        getSearchFilt(){
            this.checkData=[];
            this.selectFilt.forEach(item=>{
                if (item.name=='userid'||item.name=='ctClassification'||item.name=='bisacClassification') {
                    if (item.val.length>0) {
                        this.checkData.push(item)
                    }
                }else{
                    if (item.val||item.betweenVal) {
                        this.checkData.push(item)
                    }
                }
            })
        },
        limit(item){
            var reg=/^(?:[1-9]?\d|100)$/;
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
        },
        chanceChecked(item,event){
            if (!event.target.checked) {
            item.val=''
            }
        },
        init(filterData){
            let params=JSON.parse(filterData) 
            this.configName=params.name;
            this.configID=params.moduleId;
            this.disabledData=params.data.disabledData;
            this.paperBook=params.data.paperBook;
            this.selectFilt=params.data.list.concat([]);
            // this.checkData=params.data.list.concat([]);
        },
        configEdit(){
            let data={
                disabledData:this.disabledData,
                paperBook:this.paperBook,
                list:this.checkData
            }
            let params={
                id:this.configID,
                name:this.configName,
                module:'bookLibrary',
                data:JSON.stringify(data),
            }
            this.$post('/api/config/template/edit',params).then(res=>{
                if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('closeDialog',params)
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        configSava(){
            this.getSearchFilt()
            if (!this.configName) {
                this.$message.warning('查询名称不能为空')
                return
            }
            if (this.checkData.length==0) {
                this.$message.warning('查询条件不能为空')
                return
            }
            //   判断自定义名称是否已存在
            let isExist=false
            this.customList.forEach(item=>{
                if (this.configID) {
                    if (item.id!=this.configID&&item.name==this.configName) {
                        isExist=true
                        return
                    }
                }else{
                    if (item.name==this.configName) {
                        isExist=true
                        return
                    }
                }
            })
            if (isExist) {
                this.$message.warning('该自定义名称已存在')
                return
            }  
            // 判断是修改还是创建
            if (this.configID) {
                this.configEdit()
                return
            }
            let data={
                disabledData:this.disabledData,
                paperBook:this.paperBook,
                list:this.checkData
            }
            let params={
                name:this.configName,
                module:'bookLibrary',
                data:JSON.stringify(data),
            }
            this.loading=true
            this.$post('/api/config/template/save',params).then(res=>{
                this.loading=false
                if (res.success) {
                    this.$message.success('新建查询条件保存成功')
                    this.$emit('closeDialog',res.data)
                } else {
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.loading=false
            })
        },
        closeDialog(){
            this.$emit('closeDialog','close')
        },
        addFilter(data){
            var isHava=false;
            this.selectFilt.forEach(item=>{
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
            this.selectFilt.push(data)
            this.addFiltModel='';
            // this.checkData.push(data)
        },
        selectFile() {
            document.getElementById('saveFilterImportBtn').value='';
            document.getElementById('saveFilterImportBtn').click();
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
                filtItem.val=arr.join('、')
            };
            reader.readAsBinaryString(f);
        },
    }
}
</script>
<style lang='scss' scoped>
#filtSava{
    padding:13px;
    .name{
        margin-bottom:40px;
    }
    .btns{
        margin-top:50px;
        text-align: center;
    }
}
</style>

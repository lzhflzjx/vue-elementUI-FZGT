<template>
    <div>
        <div class="con">
            <div class="con-title">编辑/新增</div>
            <el-row class="el-row">
                <!-- 表单 -->
                <el-col class="from-left" :span="16">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="姓名：" prop="author">
                                    <el-input v-model="ruleForm.author"></el-input>
                                </el-form-item>
                                <el-form-item label="出生年份：" prop="birthYear">
                                    <el-date-picker
                                        v-model="ruleForm.birthYear"
                                        type="year"
                                        size="medium"
                                        clearable
                                        format="yyyy"
                                        value-format="yyyy"
                                        placeholder="选择年">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="从属关系：" prop="affiliation">
                                    <el-input v-model="ruleForm.affiliation"></el-input>
                                </el-form-item>
                                <el-form-item label="洲/省：" required>
                                    <el-select @change="provinceChange" v-model="province" class="lablel-width"
                                               placeholder="请选择">
                                        <el-option v-for="item in provinces" :key="item.id" :label="item.name"
                                                   :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <!-- <el-input v-model="ruleForm.province"></el-input> -->
                                </el-form-item>
                                <el-form-item label="联系方式：">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :push="2" :span="11">
                                <el-form-item label="编码：" prop="coding">
                                    <el-input v-model="ruleForm.coding"></el-input>
                                </el-form-item>
                                <el-form-item label="去世年份：" prop="diedYear">
                                    <el-date-picker
                                        v-model="ruleForm.diedYear"
                                        type="year"
                                        size="medium"
                                        format="yyyy"
                                        value-format="yyyy"
                                        placeholder="选择年">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="国家/地区：" required>
                                    <el-select @change="countryChange" v-model="country" class="lable-width"
                                               placeholder="请选择">
                                        <el-option v-for="item in countrys" :key="item.id" :label="item.name"
                                                   :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="城市：" required>
                                    <el-select v-model="city" class="lable-width" placeholder="请选择">
                                        <el-option v-for="item in citys" :key="item.id" :label="item.name"
                                                   :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <!-- <el-input v-model="ruleForm.name"></el-input> -->
                                </el-form-item>
                                <el-form-item label="是否敏感：" prop="isSensitive">
                                    <el-select v-model="ruleForm.isSensitive" class="lable-width" placeholder="请选择">
                                        <el-option v-for="item in options"
                                                   :key="item.value"
                                                   :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <!-- <el-input v-model="ruleForm.name"></el-input> -->
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="简介：">
                            <el-input type="textarea" v-model="text"></el-input>
                        </el-form-item>
                        <el-form-item label="维基：">
                            <el-input type="textarea" v-model="text1"></el-input>
                        </el-form-item>
                        <el-form-item label="百科：">
                            <el-input type="textarea" v-model="text2"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!-- 别名 -->
                <el-col :span="8">
                    <div class="from-right">
                        <div class="from-title">别名</div>
                        <el-input v-model="ruleForm.alias" type="textarea" rows="7" resize="none" placeholder="词之间使用';'分割"></el-input>
                    </div>
                    <div class="from-right">
                        <div class="from-title">获奖作品</div>
                        <el-input type="textarea" rows="7" resize="none" placeholder="词之间使用';'分割"></el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :push="8" :span="2">
                    <el-button @click="$router.go(-1)" size="medium">取消</el-button>
                </el-col>
                <el-col :push="10" :span="2">
                    <el-button type="primary" @click="writerAdd('ruleForm')" size="medium">保存</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tag',
        data() {
            return {
                ruleForm: {
                    author: '',
                    coding: '',
                    birthYear: '',
                    diedYear: '',
                    affiliation: '',
                    isSensitive: ''
                },
                text: '',
                text1: '',
                text2: '',
                rules: {
                    author: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    coding: [{
                        required: true,
                        message: '请输入编码',
                        trigger: 'blur'
                    }],
                    isSensitive: [{
                        required: true,
                        message: '请选择是否敏感',
                        trigger: 'blur'
                    }],

                },
                countrys: [],
                country: '',
                provinces: [],
                province: '',
                citys: [],
                city: '',
                options: [{
                    value: '1',
                    label: '是'
                }, {
                    value: '2',
                    label: '否'
                }],
                value: '',
                addIs: true
            };
        },
        created() {
            this.getAddressList({ level: 1, parentId: '' });
            if (this.$route.query.hasOwnProperty('writerObj')) {
                let oldData = JSON.parse(this.$route.query.writerObj)
                this.ruleForm = oldData;
                this.ruleForm.birthYear = oldData.birthYear.toString();
                this.ruleForm.diedYear = oldData.diedYear.toString();
                this.country = oldData.country;
                this.province = oldData.province;
                this.city = oldData.city;
                this.ruleForm.isAwards = this.ruleForm.isAwards == '有' ? 1 : 2;
                this.ruleForm.isSensitive = this.ruleForm.isSensitive == '是' ? 1 : 2;
                this.addIs = false;
            }
        },
        methods: {
            //   保存
            writerAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            ...this.ruleForm
                        };
                        if (this.country !== '') {
                            if (this.countrys.filter(item => item.id === this.country).length > 0){
                                data.country = this.countrys.filter(item => item.id === this.country)[0].name;
                            }
                        }
                        if (this.province !== '') {
                            if (this.provinces.filter(item => item.id === this.province).length > 0){
                                data.province = this.provinces.filter(item => item.id === this.province)[0].name;
                            }
                        }
                        if (this.city !== '') {
                            if (this.citys.filter(item => item.id === this.city).length > 0){
                                data.city = this.citys.filter(item => item.id === this.city)[0].name;
                            }
                        }
                        let that = this;
                        if (this.addIs) { //新增
                            this.$post('/api/author/insertAuthor', data)
                                .then(res => {
                                    if (res.status === 0 && res.success){
                                        return that.$message({
                                            type:'success',
                                            message: res.message,
                                            onClose:function () {
                                                that.$router.go(-1);
                                            }
                                        });
                                    }
                                    return that.$message.error(res.message)
                                });
                        } else { //修改
                            this.$post('/api/author/updateAuthor', data)
                                .then(res => {
                                    if (res.status === 0 && res.success){
                                        return that.$message({
                                            type:'success',
                                            message: res.message,
                                            onClose:function () {
                                                that.$router.go(-1);
                                            }
                                        });
                                    }
                                    return that.$message.error(res.message)
                                });
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 国家切换
            countryChange(val) {
                this.getAddressList({ level: 2, parentId: val });
            },
            // 省份切换
            provinceChange(val) {
                this.getAddressList({ level: 3, parentId: val });
            },
            // 获取地区列表
            // data  {level:1,parentId:""}
            getAddressList(data) {
                this.$get('/api/region/findRegions', data)
                    .then(res => {
                        if (data.level == 1) {
                            this.countrys = res.data;
                            this.provinces = [];
                            this.citys = [];
                            if (res.data.length > 0) {
                                this.getAddressList({ level: 2, parentId: res.data[0].id });
                            }
                        } else if (data.level == 2) {
                            this.provinces = res.data;
                            this.citys = [];
                            if (res.data.length > 0) {
                                this.getAddressList({ level: 3, parentId: res.data[0].id });
                            }
                        } else if (data.level == 3) {
                            this.citys = res.data;
                        }
                    });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .con-title {
        height: 40px;
        background: #E2F0FF;
        line-height: 40px;
        margin-top: 10px;
        color: #439FFF;
        padding-left: 30px;
    }

    .el-row {
        background: #fff;
        padding: 30px 20px;
    }

    .from-left {
        padding-right: 50px;
        border-right: 1px dashed #7CBCFF;
    }

    .from-right {
        width: 300px;
        height: 200px;
        border: 1px solid #eeeeee;
        margin-left: 30px;
        margin-bottom: 30px;

        .from-title {
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: #E1EFFE;
        }

        p {
            color: #CCCCCC;
            padding: 10px;
            box-sizing: border-box;
        }
    }
    .lable-width {
        width: 100%;
    }
</style>

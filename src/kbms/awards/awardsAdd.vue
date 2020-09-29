<template>
    <div>
        <div class="con">
            <div class="con-title">
                <p>个人/组织</p>
                <p class="con-title-right">图书</p>
            </div>
            <el-row class="el-row">
                <!-- 表单 -->
                <el-col class="from-left" :span="16">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="奖项名称：" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="奖项类型：" prop="type">
                                    <el-select v-model="ruleForm.type" placeholder="请选择">
                                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.name"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="获奖对象类型：" prop="objectType">
                                    <el-select v-model="ruleForm.objectType" placeholder="请选择">
                                        <el-option v-for="item in valOption[0]" :key="item.value" :label="item.name"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :push="2" :span="11">
                                <el-form-item label="获奖时间：" prop="time">
                                    <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                                    value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.time"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="获奖等级：" prop="level">
                                    <el-select v-model="ruleForm.level" placeholder="请选择">
                                        <el-option v-for="item in levelOptions" :key="item.value" :label="item.name"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="人/组织：" prop="author">
                                    <el-input v-model="ruleForm.author"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="简介：">
                            <el-input type="textarea" v-model="ruleForm.awardsDescribe"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!-- 别名 -->
                <el-col :span="8">
                    <div class="from-right">
                        <div class="from-title">关联作品</div>
                        <el-input type="textarea" placeholder="词之间使用“；”分割；" resize="none" rows="7"
                                  v-model="ruleForm.refOpus"></el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :push="8" :span="2">
                    <el-button @click="resetForm('ruleForm')" size="medium">取消</el-button>
                </el-col>
                <el-col :push="10" :span="2">
                    <el-button type="primary" @click="awardAdd('ruleForm')" size="medium">保存</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: 'tag',
        data() {
            return {
                ruleForm: {
                    name: '',
                    level: '',
                    type: '',
                    awardsDescribe: '',
                    author: '',
                    opus: '',
                    objectType: '',
                    refOpus: '',
                    isbn: '',
                    time: ''
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    },
                    ],
                    objectType: [{
                        required: true,
                        message: '请输入获奖对象类型',
                        trigger: 'blur'
                    },
                    ],
                    time: [{
                        required: true,
                        message: '请选择获奖时间',
                        trigger: 'blur'
                    },
                    ],
                    author: [{
                        required: true,
                        message: '请输入人/组织',
                        trigger: 'blur'
                    },
                    ],
                    level: [{
                        required: true,
                        message: '请选择获奖等级',
                        trigger: 'blur'
                    },
                    ],
                    type: [{
                        required: true,
                        message: '请选择获奖类型',
                        trigger: 'blur'
                    },
                    ],
                },
                levelOptions: [],
                typeOptions: [],
                value: '',
                addIs: true
            };
        },
        created() {
            if (this.$route.query.hasOwnProperty('awardsObj')) {
                this.ruleForm = JSON.parse(this.$route.query.awardsObj);
                this.addIs = false;
            }
            this.getLevelOptions();
            this.getTypeOptions();
            // 获取字典
            this.getDictList(['awardsObjectType']);
        },
        computed: {
            ...mapGetters(['awardsObjectType']),
            valOption() {
                let arr = [
                    // 获奖对象类型 0
                    this.awardsObjectType,
                ];
                return arr;
            }
        },
        methods: {
            ...mapActions(['getDictList']),
            // 等级
            getLevelOptions() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=awardsLevel')
                    .then(function (res) {
                        if (res.status === 0 && res.success) {
                            that.levelOptions = res.data.dictionaryInfoList;
                        }
                        //   return that.$message.error("获取奖项等级列表出错：" + res.message);
                    })
                    .catch(function (err) {
                        that.$message.error('请求奖项等级列表出错');
                    });
            },
            // 类型
            getTypeOptions() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=awardsType')
                    .then(function (res) {
                        if (res.status === 0) {
                            return that.typeOptions = res.data.dictionaryInfoList;
                        }
                        //   return that.$message.error("获取奖项等级列表出错：" + res.message);
                    })
                    .catch(function (err) {
                        that.$message.error('请求奖项类型列表出错');
                    });
            },
            awardAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            ...this.ruleForm
                        };
                        if (this.addIs) { //新增
                            //   POST /api/awardsManage/insertAwards
                            this.$post('/api/awardsManage/insertAwards', [data])
                                .then(res => {
                                    this.$message('保存成功');
                                    this.$router.back(-1);
                                });
                        } else { //修改
                            let flag = 2;
                            this.$post('/api/awardsManage/updateAwards?flag=' + flag + '', data)
                                .then(res => {
                                    this.$message('修改成功');
                                    this.$router.back(-1);
                                });
                        }
                    } else {
                        return false;
                    }
                });
            },
            //   取消
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.ruleForm = {
                    name: '',
                    level: '',
                    type: '',
                    awardsDescribe: '',
                    author: '',
                    opus: '',
                    objectType: '',
                    refOpus: '',
                    isbn: '',
                    time: ''
                };
            },
        }
    };
</script>

<style lang="scss" scoped>
    .con-title {
        height: 40px;
        background: #e2f0ff;
        line-height: 40px;
        margin-top: 10px;
        color: #439fff;
        padding-left: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .con-title-right {
            background: #409eff;
            width: 100px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #ffffff;
        }
    }

    .el-row {
        background: #fff;
        padding: 30px 20px;
    }

    .from-left {
        padding-right: 50px;
        border-right: 1px dashed #7cbcff;
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
            background: #e1effe;
        }

        p {
            color: #cccccc;
            padding: 10px;
            box-sizing: border-box;
        }
    }
</style>

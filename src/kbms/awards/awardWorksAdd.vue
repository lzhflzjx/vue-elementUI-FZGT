<template>
    <div>
        <div class="con">
            <div class="con-title">
                <p>图书</p>
                <p class="con-title-right">个人/组织</p>
            </div>
            <el-row class="el-row">
                <!-- 表单 -->
                <el-col class="from-left" :span="16">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="奖项名称：" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="获奖图书：" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="奖项类型：" prop="name">
                                    <el-select v-model="value" placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :push="2" :span="11">
                                <el-form-item label="获奖时间：" prop="name">
                                    <el-date-picker
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="获奖等级：" prop="name">
                                    <el-select v-model="value" placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <!-- <el-input v-model="ruleForm.name"></el-input> -->
                                </el-form-item>
                                <el-form-item label="ISBN：" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="简介：">
                            <el-input type="textarea" v-model="ruleForm.name"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!-- 别名 -->
                <el-col :span="8">
                    <div class="from-right">
                        <div class="from-title">关联作品</div>
                        <p>次之间使用';'分割</p>
                    </div>
                    <div class="from-right">
                        <div class="from-title">关联作者其他作品</div>
                        <p>次之间使用';'分割</p>
                    </div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <div style="padding:0 20px">
                            <el-form-item label="录入人：">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                        </div>
                        <div style="padding-left:10px">
                            <el-form-item label="录入时间：">
                                <el-date-picker
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :push="8" :span="2"><el-button size="medium">取消</el-button></el-col>
                <el-col :push="10" :span="2"><el-button type="primary" size="medium">保存</el-button></el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tag',
        data(){
            return {
                ruleForm:{
                    name:""
                },
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                },
                options: [],
                value: ''
            }
        },
        created() {
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
    .con-title{
        height: 40px;
        background: #E2F0FF;
        line-height: 40px;
        margin-top: 10px;
        color:#439FFF;
        padding-left: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .con-title-right{
            background: #409EFF;
            width: 100px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #ffffff;
        }
    }
    .el-row{
        background: #fff;
        padding: 30px 20px;
    }
    .from-left{
        padding-right: 50px;
        border-right: 1px dashed #7CBCFF;
    }
    .from-right{
        width: 300px;
        height:130px;
        border:1px solid #eeeeee;
        margin-left: 30px;
        margin-bottom: 30px;
        .from-title{
            height: 40px;
            line-height: 40px;
            text-align: center;
            background:  #E1EFFE;
        }
        p{
            color: #CCCCCC;
            padding: 10px;
            box-sizing: border-box;
        }
    }
</style>

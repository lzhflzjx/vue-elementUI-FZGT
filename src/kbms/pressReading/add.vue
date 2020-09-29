<template>
    <div class="bg-white">
        <el-form ref="form" :model="form" label-width="150px">
            <el-col :span="24">
                <div class="reading-header">
                    <p class="titles">基本信息 <span class="tips">*为必填项</span></p>
                </div>
            </el-col>
            <el-col :span="18" class="mt20">
                <el-col :span="12">
                    <el-form-item label="刊号：" required>
                        <el-input size="medium" v-model="form.publishers"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="刊名：" required>
                        <el-input size="medium" v-model="form.publisherCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ISSN：">
                        <el-input size="medium" v-model="form.number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="份数：">
                        <el-select v-model="form.region" size="small" placeholder="份数">
                            <el-option label="1000份" value="shanghai"></el-option>
                            <el-option label="2000份" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="卷期：">
                        <el-input size="medium" v-model="form.membershipGroup"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出版日期：">
                        <el-input size="medium" v-model="form.membershipId"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
            <div class="reading-header">
                <p class="titles">审读意见 <span class="tips">*为必填项</span></p>
            </div>
            <el-col :span="24" class="mt20">
                <el-form-item label="名单：" required>
                    <el-radio-group v-model="form.names">
                        <el-radio-button label="白名单"></el-radio-button>
                        <el-radio-button label="黑名单"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="敏感报道类型：" style="width: 500px" required>
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="AZ" checked></el-checkbox>
                        <el-checkbox label="SZ"></el-checkbox>
                        <el-checkbox label="AZ"></el-checkbox>
                        <el-checkbox label="SZ"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="敏感报道出现版：" style="width: 500px" required>
                    <el-input size="medium" v-model="form.membershipId"></el-input>
                </el-form-item>
                <div class="order-info">
                    <p class="info-item">文字报道：</p>
                    <el-select size="mini" style="width: 100px;float: left;margin-top: 10px">
                        <el-option label="1000份" value="shanghai"></el-option>
                        <el-option label="2000份" value="beijing"></el-option>
                    </el-select>
                    <p style="float: left;margin-left: 10px;line-height: 20px">篇</p>
                    <p class="info-item">文字报道：</p>
                    <el-select size="mini" style="width: 100px;float: left;margin-top: 10px">
                        <el-option label="1000份" value="shanghai"></el-option>
                        <el-option label="2000份" value="beijing"></el-option>
                    </el-select>
                    <p style="float: left;margin-left: 10px;line-height: 20px">幅</p>
                </div>
                <el-form-item label="问题照片：">
                    <el-upload
                        class="avatar-uploader"
                        action="/br/api/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-change="handleAvatarChange"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-picture-outline avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="问题内容：">
                    <el-input type="textarea"  resize="none" :rows="5" size="medium" v-model="form.membershipId"></el-input>
                </el-form-item>
            </el-col>
            <div class="reading-header">
                <p class="titles">审读意见 <span class="tips">*为必填项</span></p>
            </div>
            <el-col :span="24">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户号：" required>
                            <el-input size="medium" v-model="form.publishers"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户名称：" required>
                            <el-input size="medium" v-model="form.publisherCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="处理意见：" required>
                            <el-select size="medium">
                                <el-option label="撤页" value="shanghai"></el-option>
                                <el-option label="照发" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input size="medium" v-model="form.publisherCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户号：" required>
                            <el-input size="medium" v-model="form.publishers"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户名称：" required>
                            <el-input size="medium" v-model="form.publisherCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="处理意见：" required>
                            <el-select size="medium">
                                <el-option label="撤页" value="shanghai"></el-option>
                                <el-option label="照发" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input size="medium" v-model="form.publisherCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="24">
                <el-col :span="12" :offset="6">
                    <el-form-item>
                        <el-button size="medium">生成审读报告</el-button>
                        <el-button type="primary" size="medium" @click="onSubmit">上报</el-button>
                    </el-form-item>
                </el-col>
            </el-col>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'add',
        data() {
            return {
                imageUrl: '',
                form: {},
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tabActiveName:'待处理订单',
                checkList:'',
                oldCheckList:''
            };
        },
        created() {
        },
        methods: {
            handleNodeClick(){

            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            handleAvatarChange(res, file){
                console.log(res, file)
                this.imageUrl = URL.createObjectURL(res.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            onSubmit() {

            }
        }
    };
</script>

<style scoped>
    .mt20{
        margin-top: 20px;
    }
    .bg-white {
        padding: 10px;
        background: #ffffff;
        height: auto;
        overflow: hidden;
    }

    .reading-header {
        width: 100%;
        height: 44px;
        overflow: hidden;
        background: #e2effe;
        padding: 0;
        margin: 0;
    }

    .reading-header .titles {
        color: #2d8cf0;
        font-size: 16px;
        line-height: 44px;
        padding: 0;
        margin: 0;
        margin-left: 10px;
    }

    .reading-header .tips {
        color: #f00;
        font-size: 12px;
        line-height: 44px;
    }
    .avatar-uploader {
        width: 150px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 3.8rem;
        color: #8c939d;
        width: 150px;
        line-height: 150px;
        text-align: center;
        padding: 0;
        margin: 0;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .order-info{
        height: auto;
        overflow: hidden;
    }
    .info-item{
        font-size: 14px;
        color: #444444;
        float: left;
        width: 140px;
        text-align: right;
    }
    .item-select{
        display: inline;
    }
    .border-top{
        border-top: 1px dashed #2d8cf0;
    }
    .question-img{
        width: 150px;
        height: 150px;
        overflow: hidden;
        float: left;
        display: block;
        margin-right: 10px;
    }
</style>

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
                    <el-form-item label="原版图书名称：" required>
                        <el-input size="medium" v-model="form.publishers"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ISBN：" required>
                        <el-input size="medium" v-model="form.publisherCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="图书中文译名：">
                        <el-input size="medium" v-model="form.number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出版国家/地区：">
                        <el-input size="medium" v-model="form.publisherPrefix"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="作者：">
                        <el-input size="medium" v-model="form.membershipGroup"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出版年代：">
                        <el-input size="medium" v-model="form.membershipId"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
            <div class="reading-header">
                <p class="titles">审读意见</p>
            </div>
            <el-col :span="24" class="mt20">
                <el-form-item label="名单：" required>
                    <el-radio-group v-model="form.names">
                        <el-radio-button label="白名单"></el-radio-button>
                        <el-radio-button label="黑一"></el-radio-button>
                        <el-radio-button label="黑二"></el-radio-button>
                        <el-radio-button label="黑三"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="敏感类型：">
                    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" style="width: 200px"></el-tree>
                </el-form-item>
                <el-form-item label="问题出现页码：" style="width: 500px">
                    <el-input size="medium" v-model="form.membershipId"></el-input>
                </el-form-item>
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
                <el-radio-group v-model="tabActiveName" >
                    <el-radio-button label="待处理订单" border="false"></el-radio-button>
                    <el-radio-button label="历史订单" border="false"></el-radio-button>
                    <el-radio-button label="审读历史" border="false"></el-radio-button>
                </el-radio-group>
            </div>
            <el-col :span="24" v-if="tabActiveName === '待处理订单'">
                <el-row>
                    <div class="order-info">
                        <p class="info-item">订购时间：2018-09-09 09:09</p>
                        <p class="info-item">订单号：21345442344543232</p>
                        <p class="info-item">订户：北京大学</p>
                    </div>
                    <el-form-item label="处理意见：" style="width: 500px">
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="照发"></el-checkbox>
                            <el-checkbox label="扣发"></el-checkbox>
                            <el-checkbox label="涂抹"></el-checkbox>
                            <el-checkbox label="撤页"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
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
                    <el-form-item label="备注：">
                        <el-input type="textarea"  resize="none" :rows="5" size="medium" v-model="form.membershipId"></el-input>
                    </el-form-item>
                </el-row>
                <el-row class="border-top">
                    <div class="order-info">
                        <p class="info-item">订购时间：2018-09-09 09:09</p>
                        <p class="info-item">订单号：21345442344543232</p>
                        <p class="info-item">订户：北京大学</p>
                    </div>
                    <el-form-item label="处理意见：" style="width: 500px">
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="照发"></el-checkbox>
                            <el-checkbox label="扣发"></el-checkbox>
                            <el-checkbox label="涂抹"></el-checkbox>
                            <el-checkbox label="撤页"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
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
                    <el-form-item label="备注：">
                        <el-input type="textarea"  resize="none" :rows="5" size="medium" v-model="form.membershipId"></el-input>
                    </el-form-item>
                </el-row>
            </el-col>
            <el-col :span="24" v-if="tabActiveName === '历史订单'">
                <el-row>
                    <div class="order-info">
                        <p class="info-item">订购时间：2018-09-09 09:09</p>
                        <p class="info-item">订单号：21345442344543232</p>
                        <p class="info-item">订户：北京大学</p>
                    </div>
                    <el-form-item label="处理意见：" style="width: 500px">
                        <el-checkbox-group v-model="oldCheckList">
                            <el-checkbox label="照发"></el-checkbox>
                            <el-checkbox label="扣发" checked></el-checkbox>
                            <el-checkbox label="涂抹" checked></el-checkbox>
                            <el-checkbox label="撤页"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="问题照片：">
                        <img src="http://img08.tooopen.com/20200207/tooopen_sy_112252225268603.jpg" class="question-img" alt="">
                        <img src="http://img08.tooopen.com/20200207/tooopen_sy_112252225268603.jpg" class="question-img" alt="">
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input type="textarea"  resize="none" :rows="5" size="medium" v-model="form.membershipId"></el-input>
                    </el-form-item>
                    <el-form-item label="订单处理人：">哗哗哗</el-form-item>
                </el-row>
                <el-row class="border-top">
                    <div class="order-info">
                        <p class="info-item">订购时间：2018-09-09 09:09</p>
                        <p class="info-item">订单号：21345442344543232</p>
                        <p class="info-item">订户：北京大学</p>
                    </div>
                    <el-form-item label="处理意见：" style="width: 500px">
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="照发" checked></el-checkbox>
                            <el-checkbox label="扣发"></el-checkbox>
                            <el-checkbox label="涂抹"></el-checkbox>
                            <el-checkbox label="撤页"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="问题照片：">
                        <img src="http://img08.tooopen.com/20200207/tooopen_sy_112252225268603.jpg" class="question-img" alt="">
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input type="textarea"  resize="none" :rows="5" size="medium" v-model="form.membershipId"></el-input>
                    </el-form-item>
                    <el-form-item label="订单处理人：">哗哗哗</el-form-item>
                </el-row>
            </el-col>
            <el-col :span="24" v-if="tabActiveName === '审读历史'">
                <div style="height: 120px;margin-left: 100px;margin-top: 10px">
                    <el-steps direction="vertical" :active="1" finish-status="success" process-status="error">
                        <el-step title="人工审读为白名单 2020年02月14日 01:16:32" description="审读人：huahuahau"></el-step>
                        <el-step title="人工审读为白名单 2020年02月14日 01:16:32" description="敏感词位置：主书名、出版社、责任人简介、附件、目次、简介"></el-step>
                    </el-steps>
                </div>
            </el-col>
            <el-col :span="24">
                <el-col :span="12" :offset="6">
                    <el-form-item>
                        <el-button size="medium">取消</el-button>
                        <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
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
        width: 260px;
        text-align: right;
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

<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="page-top">{{ pageTitle }}</div>
            </el-col>
            <el-col :span="24" class="bg-white">
                <el-row>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-col :span="18" class="border-right">
                            <el-form-item label="" v-if="isUpload">
                                <div class="upload-button">
                                    <el-upload
                                        class="upload-demo"
                                        ref="upload"
                                        action=""
                                        :on-change="handleChange"
                                        :show-file-list="false"
                                        :http-request="handleUpload"
                                        :file-list="fileList"
                                        :multiple="form.id ? false : true"
                                        :limit="uploadLimit"
                                        :auto-upload="false">
                                        <i class="el-icon-plus" size="40px" style="size: 2rem"></i>
                                    </el-upload>
                                </div>
                                <div class="upload-tips">
                                    <h2 class="upload-title">上传文件</h2>
                                    <p class="upload-ps">支持：JPG、PSD、BMP、PCX、GIF、JFIF、PNG、TIF...</p>
                                </div>
                            </el-form-item>
                            <el-form-item :label="isUpload ? '已上传：': ''">
                                <el-row>
                                    <el-col :span="3" v-for="(fit, index) in url" :key="index" class="image-box">
                                        <el-image
                                            :src="fit.url"
                                            class="image-item"
                                            fit="fill"
                                            style="width: 100px;height: 100px;display: block;margin: 0 auto"
                                        ></el-image>
                                        <p class="demonstration" @click="delImage(index)"><i class="el-icon-delete"></i>
                                        </p>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-row v-if="!isUpload">
                                <el-col :span="6" :offset="8">
                                    <el-image :src="'http://59.108.111.18:8080/'+ form.path" style="width: 100%;display: inline-block;margin: 0 auto"></el-image>
                                    <p style="text-align: center;cursor: pointer;color: #2d8cf0" @click="delSingleImage"><i class="el-icon-delete-solid"></i></p>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="名称" required>
                                <el-input v-model="form.name" size="medium"></el-input>
                            </el-form-item>
                            <el-form-item label="敏感等级" required>
                                <el-select v-model="form.level" placeholder="请选择">
                                    <el-option
                                        v-for="item in levelOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="类型" required>
                                <el-select v-model="form.type" placeholder="请选择">
                                    <el-option
                                        v-for="item in typeOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="分类" required>
                                <el-row class="border">
                                    <el-col :span="20" :offset="2" class="pdn bg-blue-small">三级</el-col>
                                    <el-col :span="20" :offset="2" class="pdn br">
                                        <el-tree :data="data"
                                                 :props="defaultProps"
                                                 ref="tree"
                                                 node-key="id"
                                                 :highlight-current="true"
                                                 @check-change="handleNodeClick"
                                                 @node-click="nodeClick"
                                                 show-checkbox
                                                 :check-strictly="true"
                                                 :default-expanded-keys="expanded"
                                                 :default-checked-keys="[form.sortId]"
                                        ></el-tree>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input v-model="form.imageDescription" type="textarea" :rows="4"
                                          resize="none"></el-input>
                            </el-form-item>
                            <el-form-item v-if="!isUpload">
                                <el-button size="medium" @click="$router.go(-1)">取消</el-button>
                                <el-button type="primary" size="medium" @click="onSubmit" style="margin-left: 30%">保存</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="isUpload">
                            <el-col :span="12" :offset="6">
                                <el-form-item>
                                    <el-button size="medium" @click="$router.go(-1)">取消</el-button>
                                    <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-form>
                </el-row>
            </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
            <el-col :span="24" class="bg-white">
                <div style="height: 80px"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { setCategoryMenu } from '../func';

    export default {
        name: 'add',
        data() {
            return {
                fits: ['fill'],
                uploadLimit: 20,
                pageTitle: '新增',
                isUpload: true,
                dialogImageUrl: '',
                dialogVisible: false,
                url: [],
                form: {
                    files: [],
                    imageDescription: '',
                    imageName: '',
                    isbn: '',
                    level: '',
                    name: '',
                    path: '',
                    sortId: 0,
                    sortLevel: '',
                    status: '',
                    type: ''
                },
                fileList: [],
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                typeOptions: [],
                levelOptions: [],
                options: [],
                value: '',
                expanded: [],
                sortLevel: 1,
            };
        },
        created() {
            this.category();
            this.typeOptionsList();
            this.levelList();
            let paramData = this.$route.params;
            if (JSON.stringify(paramData) !== '{}') {
                this.pageTitle = '编辑';
                this.isUpload = false;
                paramData.type = parseInt(paramData.type);
                this.form = paramData;
                console.log(this.form);
            }
        },
        methods: {
            delImage(index) {
                this.fileList.splice(index, 1);
                this.url.splice(index, 1);
                console.log(this.fileList);
                this.form.files = this.fileList;
            },
            handleChange(file, fileList) {
                /* 另外一种本地预览方法 */
                let URL = window.URL || window.webkitURL;
                let temp = {
                    name: file.name,
                    url: URL.createObjectURL(file.raw)
                };
                this.url.push(temp);
                this.fileList = fileList;
                this.form.files = fileList;
            },
            handleUpload(fileList) {
                this.fileList = fileList;
            },
            category(data = {}) {
                let that = this;
                data.type = 2;
                data.pageNo = data.pageNo ? data.pageNo : 1;
                data.pageSize = data.pageSize ? data.pageSize : 20;
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        that.menuLoading = false;
                        that.data = setCategoryMenu(res.data.result);
                        let parentId = parseInt(that.form.sortId);
                        let menuData = res.data.result;
                        for (let i in menuData) {
                            if (menuData[i].id === parentId){
                                that.expanded = [menuData[i].id];
                            }
                            if (menuData[i].childList){
                                for (let j in menuData[i].childList){
                                    if (menuData[i].childList[j].id === parentId){
                                        that.expanded.push(menuData[i].childList[j].id);
                                        that.expanded.push(menuData[i].childList[j].parentId);
                                    }
                                    for (let q in menuData[i].childList[j].childList){
                                        if (menuData[i].childList[j].childList[q].id === parentId){
                                            that.expanded.push(menuData[i].childList[j].parentId);
                                            that.expanded.push(menuData[i].childList[j].childList[q].id);
                                            that.expanded.push(parentId);
                                        }
                                    }
                                }
                            }
                        }
                    })
            },
            findLevel(id) {
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].children !== null) {
                        for (let o = 0; o < this.data[i].children.length; o++) {
                            if (this.data[i].children[o].id === id) {
                                this.sortLevel = 2;
                            }
                            if (this.data[i].children[o].children !== null) {
                                for (let p = 0; p < this.data[i].children[o].children.length; p++) {
                                    if (this.data[i].children[o].children[p].id === id) {
                                        this.sortLevel = 3;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            typeOptionsList() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=pictureClass')
                    .then(function (res) {
                        if (res.success && res.status === 0 && res.data !== null) {
                            that.typeOptions = res.data.dictionaryInfoList;
                        }
                    })
            },
            levelList() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=sensitiveLevel')
                    .then(function (res) {
                        if (res.success && res.status === 0 && res.data !== null) {
                            that.levelOptions = res.data.dictionaryInfoList;
                        }
                    })
            },
            handleNodeClick(data, checked, node) {
                if (checked === true) {
                    this.$refs.tree.setCheckedNodes([data]);
                    this.form.sortId = data.id;
                    this.findLevel(data.id); //判断是几层
                }
            },
            nodeClick(data, checked, node) {
                // this.$refs.tree.setCheckedNodes([data]);
                // this.form.sortId = data.id;
            },
            delSingleImage(){
                this.form.path = '';
                this.isUpload = true;
                this.uploadLimit =1;
            },
            onSubmit() {
                const formData = new FormData();
                if (this.fileList.length > 0){
                    for (let i in this.fileList) {
                        if (i <= this.fileList) {
                            formData.append('files', this.fileList[i].raw);
                        }
                    }
                }
                formData.append('type', this.form.type);
                formData.append('sortId', this.form.sortId);
                formData.append('name', this.form.name);
                formData.append('imageDescription', this.form.imageDescription);
                formData.append('sortLevel', this.sortLevel);//当前分类层级
                formData.append('level', this.form.level);
                if (this.form.id){
                    formData.append('ids', [this.form.id]);
                }
                const uploadLoading = this.$loading({
                    text: '图片上传中...'
                });
                let that = this;
                let apiUrl = !this.form.id ? '/api/sensitiveImage/addSensitiveImage' : '/api/sensitiveImage/updateSensitiveImages';
                this.$post(apiUrl, formData)
                    .then(function (response) {
                        uploadLoading.close();
                        if (response.success && response.status === 0) {
                            return that.$message({
                                message: response.message,
                                type: 'success',
                                onClose: function () {
                                    that.$router.push({ path: '/images' });
                                }
                            });
                        }
                        return that.$message.error(response.message);
                    })
            }
        }
    };
</script>

<style scoped>
    .bg-white {
        background: #ffffff;
    }

    .page-top {
        background: rgb(225, 239, 254);
        height: 40px;
        line-height: 40px;
        color: rgb(75, 163, 255);
        padding-left: 10px;
    }

    .upload-button {
        width: 90px;
        height: 90px;
        border: 1px dashed #2d8cf0;
        color: #2d8cf0;
        line-height: 90px;
        text-align: center;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        font-size: 2rem;
        float: left;
    }

    .upload-tips{
        width: auto;
        height: 90px;
        overflow: hidden;
        float: left;
        padding: 0;
        margin-left: 10px;
        margin-right: 0;
        margin-top: 0;
        margin-bottom: 0;
    }
    .upload-title{
        color: #666666;
        line-height: 18px;
    }
    .upload-ps{
        font-size: 14px;
        color: #888888;
    }
    .border {
        border: 1px solid #f1f1f1;
    }

    .pdn {
        padding: 0;
        margin: 0;
    }

    .border-right {
        border-right: 1px dashed #2d8cf0;
        padding-right: 20px;
        min-height: 420px;
    }

    .bg-white {
        padding: 20px;
    }

    .demonstration {
        text-align: center;
        color: #2d8cf0;
        cursor: pointer;
    }

    .image-box {
        padding: 10px;
        overflow: hidden;
        position: relative;
    }

    .bg-blue {
        width: 100%;
        background: rgb(217, 236, 255);
        padding: 10px;
        color: #409EFF;
    }

    .bg-blue-small {
        width: 100%;
        height: 30px;
        background: rgb(217, 236, 255);
        color: #409EFF;
        /*margin-top:10px;*/
        text-align: center;
        line-height: 30px;
    }
</style>

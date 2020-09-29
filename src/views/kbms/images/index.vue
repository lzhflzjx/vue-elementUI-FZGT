<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button style="width:100%;margin-bottom: 10px" icon="el-icon-edit-outline" size="medium"
                           type="primary" :plain="true">敏感图片分类
                </el-button>
                <el-tree :data="data"
                         :props="defaultProps"
                         style="height: 729px;"
                         ref="tree"
                         node-key="id"
                         :highlight-current="true"
                         @check-change="handleNodeClick"
                         @node-click="nodeClick"
                ></el-tree>
            </el-col>
            <el-col :span="20">
                <el-header class="bg-white">
                    <el-col :span="2">
                        <p class="tips">搜索条件：</p>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="level" clearable filterable class="m-top" size="medium" placeholder="敏感等级">
                            <el-option
                                v-for="item in levelOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="type" clearable filterable class="m-top" size="medium" placeholder="类型">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" class="m-top" v-model="name"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="medium" type="primary" class="m-top" @click="searchFunc">搜索</el-button>
                    </el-col>
                </el-header>
                <el-main class="bg-white m-top">
                    <el-row>
                        <el-col :span="2" class="m-c-top">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                                         @change="handleCheckAllChange">全选
                            </el-checkbox>
                        </el-col>
                        <el-col :span="20">
                            <el-button type="primary" size="small" @click="$router.push({path:'/images/add'})">新建
                            </el-button>
                            <el-button type="primary" size="small" @click="exportFunc">导出</el-button>
                            <el-button type="primary" size="small" @click="deleteImage">删除</el-button>
                        </el-col>
                    </el-row>
                    <el-row class="m-top">
                        <el-checkbox-group v-model="checkedIds" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in imageData" :label="city.id" :key="city.id" class="image-list">
                                <el-image
                                    :src="'http://59.108.111.18:8080/'+city.path"
                                    fit="fill"
                                    class="image-item"
                                    @dblclick="editImage(city)"
                                ></el-image>
                                <p class="demonstration">{{ city.name }}</p>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-row>
                </el-main>
                <el-footer class="bg-white">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNo"
                        :page-sizes="[20, 40, 60, 80, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </el-footer>
            </el-col>
        </el-row>
        <el-row :offset="10">
            <el-col :span="24" class="bg-white" style="margin-top: 10px">
                <div style="height: 80px"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { postDownloadZip, setCategoryMenu } from '../func';

    export default {
        name: 'index',
        data() {
            return {
                currentPage: 2,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                imageData: [],
                fileList: [],
                data: [],
                tableData: [],
                levelOptions: [],
                typeOptions: [],
                level: '',
                name: '',
                pageNo: 1,
                pageSize: 20,
                totalCount: 0,
                sortId: 0,
                type: '',
                checkAll: false,
                isIndeterminate: false,
                selectIds: [],
                checkedIds: [],
                exportIds: []
            };
        },
        created() {
            this.category();
            this.imageList();
            this.levelOptionsList();
            this.typeOptionsList();
        },
        methods: {
            category() {
                let that = this;
                let data = {
                    type: 2,
                    pageNo: 1,
                    pageSize: 40
                };
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        that.menuLoading = false;
                        that.data = setCategoryMenu(res.data.result);
                    })
                    .catch(function (error) {
                        console.log(error);
                        that.menuLoading = false;
                    });
            },
            imageList(data = {}) {
                let that = this;
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                if (data.sortId !== 0) {
                    data.sortId = data.sortId;
                }
                this.$post('/api/sensitiveImage/getSensitiveImages', data)
                    .then(function (res) {
                        if (res.success && res.status === 0 && res.data.result) {
                            that.imageData = res.data.result;
                            that.totalCount = res.data.totalCount;
                            for (let i in res.data.result) {
                                that.selectIds.push(res.data.result[i].id);
                            }
                        }
                    })
            },
            levelOptionsList() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=sensitiveLevel')
                    .then(function (res) {
                        that.levelOptions = res.data.dictionaryInfoList;
                    })
            },
            typeOptionsList() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=pictureClass')
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            that.typeOptions = res.data.dictionaryInfoList;
                        }
                    })
            },
            searchFunc() {
                let data = {};
                if (this.name) {
                    data.name = this.name;
                }
                if (this.level) {
                    data.level = this.level;
                }
                if (this.type) {
                    data.type = this.type;
                }
                if (this.sortId !== 0) {
                    data.sortId = this.sortId;
                }
                if (JSON.stringify(data) === '{}') {
                    return this.$message.error('至少选择一个条件');
                }
                this.imageList(data);
            },
            handleNodeClick(data, checked, node) {
                if (checked === true) {
                    this.$refs.tree.setCheckedNodes([data]);
                    this.sortId = data.id;
                    this.imageList({ sortId: data.id });
                }
            },
            nodeClick(data, checked, node) {
                this.$refs.tree.setCheckedNodes([data]);
                this.sortId = data.id;
                this.imageList({ sortId: data.id });
            },
            handleSizeChange(e) {
                this.pageSize = e;
                this.imageList({ pageSize: e });
            },
            handleCurrentChange(e) {
                this.pageNo = e;
                this.imageList({ pageNo: e });
            },
            handleCheckAllChange(val) {
                // console.log('handleCheckAllChange', val);
                this.checkedIds = val ? this.selectIds : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                // console.log('handleCheckedCitiesChange', value);
                this.exportIds = value;
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.imageData.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.imageData.length;
            },
            editImage(e) {
                this.$router.push({ name: 'imagesAdd', params: e });
            },
            exportFunc() {
                let flag = this.checkAll ? 1 : 2;
                let data = {};
                if (this.name) {
                    data.name = this.name;
                }
                if (this.level) {
                    data.level = this.level;
                }
                if (this.status) {
                    data.status = this.status;
                }
                if (this.type) {
                    data.type = this.type;
                }
                if (this.sortId !== 0) {
                    data.sortId = this.sortId;
                }
                if (this.exportIds.length > 0) {
                    data.ids = this.exportIds;
                }
                data.pageNo = this.pageNo ? this.pageNo : 1;
                data.pageSize = this.pageSize ? this.pageSize : 20;
                let fileName = '敏感图片导出' + (new Date()).valueOf();
                this.$message.success('下载中...请稍后');
                this.checkAll = false;
                this.isIndeterminate = false;
                postDownloadZip('/br/api/sensitiveImage/export?flag=' + flag, data, fileName);
            },
            deleteImage() {
                if (this.checkedIds.length < 1) {
                    return this.$message.error('至少选择一张图片');
                }
                const DeleteLoading = this.$loading({ text: '删除中...' });
                let that = this;
                this.$get('/api/sensitiveImage/deleteSensitiveImage?ids=' + this.checkedIds.join(','))
                    .then(function (res) {
                        DeleteLoading.close();
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    that.imageList();
                                }
                            });
                        }
                        return that.$message.error(res.message);
                    })
                    .catch(function (err) {
                        DeleteLoading.close();
                    });
            }
        }
    };
</script>

<style scoped>
    .bg-white {
        background: #ffffff;
    }

    .m-top {
        margin-top: 12px;
    }

    .m-c-top {
        margin-top: 2px;
        margin-left: 20px;
    }

    .tips {
        line-height: 30px;
    }

    .image-item {
        display: block;
        width: 150px;
        height: 120px;
    }
</style>

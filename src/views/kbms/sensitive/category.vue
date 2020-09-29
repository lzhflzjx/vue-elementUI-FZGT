<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button style="width:100%;margin-bottom: 10px" size="medium" type="primary" :plain="true">敏感词分类
                </el-button>
                <el-tree :data="data"
                         :props="defaultProps"
                         v-loading="menuLoading"
                         ref="tree"
                         node-key="id"
                         :highlight-current="true"
                         @check-change="handleNodeClick"
                         @node-click="nodeClick"
                ></el-tree>
            </el-col>
            <el-col :span="20">
                <el-header class="bg-white">
                    <el-col :span="6">
                        <el-input size="medium" class="m-top" v-model="key"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="medium" type="primary" class="m-top" @click="search">搜索</el-button>
                    </el-col>
                </el-header>
                <el-main class="bg-white m-top">
                    <el-row style="margin-bottom: 10px">
                        <el-col :span="22">
                            <el-button
                                type="primary"
                                size="small"
                                @click="$router.push({path:'/sensitive/sensitiveCategory'})"
                            >新建
                            </el-button>
                            <el-upload
                                style="display: inline-block;margin-left: 10px;margin-right: 10px"
                                action="http://59.108.111.18:8080/br/api/sortManage/importFile"
                                :headers="{'x-access-token':xAccessToken}"
                                :data="{parentId: parentId,type: 1,sortIerarchy: 1}"
                                :on-success="onUploadSuccess"
                                :on-error="onUploadError"
                                size="medium">
                                <el-button size="small" type="primary">导入</el-button>
                            </el-upload>
                            <el-button type="primary" size="small" @click="exportFunc">导出</el-button>
                            <el-button type="primary" size="small" @click="deleteFunc">删除</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary"
                                       :plain="true"
                                       @click="downloadTemplate"
                                       style="float:right;"
                                       size="small">导入模板下载
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-table
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            v-loading="loadingData"
                            style="width: 100%"
                            :default-sort="{prop: 'date', order: 'descending'}"
                            @row-dblclick="editRow"
                            @selection-change="handleSelectionChange"
                            :header-cell-style="{background:'#e6f0f6',color:'#606266'}"
                            :stripe="true"
                        >
                            <el-table-column
                                type="selection"
                                prop="id"
                                sortable
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="sortName"
                                label="分类名称">
                            </el-table-column>
                            <el-table-column
                                prop="sortIerarchy"
                                label="层级"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="sortNumber"
                                label="顺序">
                            </el-table-column>
                            <el-table-column
                                prop="updateUser"
                                label="最后修改人">
                            </el-table-column>
                            <el-table-column
                                prop="updateTime"
                                label="修改时间">
                            </el-table-column>
                            <el-table-column
                                prop="sortDescribe"
                                label="描述">
                            </el-table-column>
                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="moveRow(1, scope.row)"
                                        type="text"
                                        size="small">
                                        上移
                                    </el-button>
                                    <el-button
                                        @click.native.prevent="moveRow(0, scope.row)"
                                        type="text"
                                        size="small">
                                        下移
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-main>
                <el-footer class="bg-white">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[100, 200, 300, 400]"
                        :page-size="resultSize"
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
    import { getDownloadFunc, postDownloadFunc, setCategoryMenu } from '../func';
    export default {
        name: 'sensitiveList',
        data() {
            return {
                xAccessToken: localStorage.getItem('token'),
                currentPage: 1,
                loadingData: true,
                menuLoading: true,
                totalCount: 0,
                resultSize: 0,
                pageSize: 20,
                parentId: 0,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [],
                tableData: [],
                ids: [],
                key: ''
            };
        },
        created() {
            this.list();
            this.categoryList();
        },
        methods: {
            onUploadSuccess(message) {
                this.$message.success(message);
            },
            onUploadError(error) {
                this.$message.error(error);
            },
            search() {
                let data ={}
                if (this.key){
                    data.sortNameQuery = this.key
                }
                if (this.parentId !== 0){
                    data.parentId = this.parentId
                }
                this.list(data);
            },
            list(data = {}) {
                let that = this;
                data.type = 1;
                data.pageNo = data.pageNo ? data.pageNo : this.currentPage;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                this.$post('/api/sortManage/sortList', data)
                    .then(function (res) {
                        that.loadingData = false;
                        that.totalCount = res.data.totalCount;
                        that.resultSzie = res.data.resultSize;
                        that.tableData = res.data.result;
                    })
                    .catch(function (error) {
                        that.loadingData = false;
                    });
            },
            categoryList(data = {}) {
                let that = this;
                data.type = data.type ? data.type : 1;
                data.pageNo = data.pageNo ? data.pageNo : 1;
                data.pageSize = data.pageSize ? data.pageSize : 20;
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        that.menuLoading = false;
                        that.data = setCategoryMenu(res.data.result);
                    })
                    .catch(function (error) {
                        that.menuLoading = false;
                    });
            },
            downloadTemplate() {
                let fileName = '敏感词分类导入模板' + (new Date()).valueOf();
                this.$message.success('正在下载...请稍后');
                getDownloadFunc('br/api/sortManage/importTemplate', fileName);
            },
            editRow(row) {
                this.$router.push({ name: 'sensitiveCategory', params: row });
            },
            handleNodeClick(data,checked,node) {
                if (checked === true){
                    this.parentId = data.id;
                    this.$refs.tree.setCheckedNodes([data]);
                    this.list({parentId: data.id});
                }
            },
            nodeClick(data,checked,node){
                this.$refs.tree.setCheckedNodes([data]);
                this.parentId = data.id;
                this.list({parentId: data.id});
            },
            handleSizeChange(e) {
                this.list({pageSize: e});
            },
            handleCurrentChange(e) {
                this.currentPage = e;
                this.list({pageNo: e});
            },
            handleSelectionChange(e) {
                this.ids = [];
                for (let i in e) {
                    let temp = {
                        id: e[i].id,
                        parentId: e[i].parentId
                    };
                    this.ids.push(temp);
                }
            },
            deleteFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error('至少选择一个');
                }
                let data = {
                    sortModelList: this.ids,
                    type: 1
                };
                let that = this;
                this.$post('/api/sortManage/deleteSortById', data)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.list();
                                    that.category();
                                }
                            });
                        }
                        return that.$message.error(res.message);
                    })
            },
            exportFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error('至少选择一个分类');
                }
                let checkIds = [];
                for (let i in this.ids) {
                    checkIds.push(this.ids[i].id);
                }
                let fileName = '敏感分类导出' + (new Date()).valueOf();
                let data = checkIds.join(',');
                this.$message.success('正在下载...请稍后');
                postDownloadFunc('br/api/sortManage/exportFile?fileName=' + fileName + '&ids=' + data, fileName, fileName);
            },
            moveRow(type, data) {
                console.log(type, data);
                let that = this;
                let moveData = {
                    id: data.id,
                    parentId: data.parentId,
                    sequence: data.sequence,
                    type: 1
                };
                this.$post('/api/sortManage/upOrDownSort?upOrDown=' + type, moveData)
                    .then(function (res) {
                        if (res.status !== 0) {
                            that.list();
                            return that.$message.error(res.message);
                        }
                        that.list();
                        return that.$message.success(res.message);
                    })
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
</style>

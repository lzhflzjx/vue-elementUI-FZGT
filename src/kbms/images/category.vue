<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button style="width:100%;margin-bottom: 10px" size="medium" type="primary" :plain="true">分类管理
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
                    <el-col :span="6">
                        <el-input size="medium" class="m-top" v-model="sortNameQuery"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="medium" type="primary" class="m-top" @click="searchFunc">搜索</el-button>
                    </el-col>
                </el-header>
                <el-main class="bg-white m-top">
                    <el-row>
                        <el-col :span="22">
                            <el-button type="primary"
                                       size="small"
                                       @click="$router.push({path:'/images/category/add'})">新建
                            </el-button>
                            <el-upload
                                style="display: inline-block;margin-left: 10px;margin-right: 10px"
                                action="/br/api/sortManage/importFile"
                                :show-file-list="false"
                                :headers="{'x-access-token':xAccessToken}"
                                :data="importForm"
                                :on-success="onUploadSuccess"
                                :on-error="onUploadError"
                                size="small">
                                <el-button size="small" type="primary">导入</el-button>
                            </el-upload>
                            <el-button type="primary" size="small" @click="exportFunc">导出</el-button>
                            <el-button type="primary" size="small" @click="deleteFunc">删除</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" size="small" :plain="true" @click="downloadTemplate" style="float: right">导入模板下载</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-table
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            :default-sort="{prop: 'date', order: 'descending'}"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column
                                type="selection"
                                sortable
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="sortName"
                                label="分类名称">
                            </el-table-column>
                            <el-table-column
                                prop="sequence"
                                label="层级"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="sortNumber"
                                label="顺序">
                            </el-table-column>
                            <el-table-column
                                prop="updateUser"
                                label="最后修改人"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="updateTime"
                                label="修改时间"
                                sortable
                                :formatter="editFormatter">
                            </el-table-column>
                            <el-table-column
                                prop="sortDescribe"
                                label="描述">
                            </el-table-column>
                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="moveRow(1,scope.row)"
                                        type="text"
                                        :disabled="scope.row.sequence < 2 ? true : false"
                                        size="small">
                                        上移
                                    </el-button>
                                    <el-button
                                        @click.native.prevent="moveRow(0,scope.row)"
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
                        :current-page="pageNo"
                        :page-sizes="[20,40,60,80,100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </el-footer>
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
                pageNo: 1,
                pageSize: 20,
                totalCount: 0,
                resultSize: 0,
                parentId: 0,
                sortNameQuery:'',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [],
                tableData: [],
                ids: [],
                importForm:{
                    parentId:0,
                    type:2,
                    sortIerarchy:1
                }
            };
        },
        created() {
            this.category();
            this.list();
        },
        methods: {
            searchFunc(){
                if (this.sortNameQuery){
                    this.list({sortNameQuery: this.sortNameQuery});
                }else {
                    this.list();
                }
            },
            list(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                data.type = 2;
                console.log(data);
                let that = this;
                this.$post('/api/sortManage/sortList', data)
                    .then(function (res) {
                        that.menuLoading = false;
                        that.tableData = [];
                        that.tableData = res.data.result;
                        that.totalCount = res.data.totalCount;
                        that.resultSize = res.data.resultSize;
                    })
                    .catch(function (error) {
                        that.menuLoading = false;
                    });
            },
            category() {
                let that = this;
                let data = {
                    type: 2,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                };
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        that.menuLoading = false;
                        that.data = setCategoryMenu(res.data.result);
                    })
                    .catch(function (error) {
                        that.menuLoading = false;
                    });
            },
            onUploadSuccess(message) {
                this.$message.success(message);
                this.category();
                this.list();
            },
            onUploadError(error) {
                this.$message.error(error);
            },
            editFormatter(row) {
                return row.updateTime;
            },
            formatter(row, column) {
                return row.date;
            },
            formatterSort(row, column) {
                return row.sort;
            },
            handleNodeClick(data,checked,node) {
                if (checked === true){
                    this.$refs.tree.setCheckedNodes([data]);
                    this.parentId = data.id;
                    this.importForm.parentId = data.id;
                    this.findLevel(data.id);
                    this.list({parentId: data.id})
                }
            },
            nodeClick(data,checked,node){
                this.$refs.tree.setCheckedNodes([data]);
                this.parentId = data.id;
                this.importForm.parentId = data.id;
                this.findLevel(data.id);
                // this.list({parentId: data.id})
            },
            findLevel(id) {
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].id === id) {
                        this.importForm.sortIerarchy = 2;
                    }
                    if (this.data[i].children !== null) {
                        for (let o = 0; o < this.data[i].children.length; o++) {
                            if (this.data[i].children[o].id === id) {
                                this.importForm.sortIerarchy = 2;
                            }
                            if (this.data[i].children[o].children !== null) {
                                for (let p = 0; p < this.data[i].children[o].children.length; p++) {
                                    if (this.data[i].children[o].children[p].id === id) {
                                        this.importForm.sortIerarchy = 3;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            handleSizeChange(e) {
                this.pageSize = e;
                this.list({ pageSize: e });
            },
            handleCurrentChange(e) {
                this.pageNo = e;
                this.list({ pageNo: e });
            },
            handleSelectionChange(e) {
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
                    type: 3
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
            moveRow(type, data) {
                console.log(type, data);
                let that = this;
                let moveData = {
                    id: data.id,
                    parentId: data.parentId,
                    sequence: data.sequence,
                    type: 2
                };
                this.$post('/api/sortManage/upOrDownSort?upOrDown=' + type, moveData)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.$router.go(0);
                                }
                            });
                        }
                        return that.$message.error(res.message);
                    });
            },
            exportFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error('请选择要导出的内容');
                }
                let checkIds = [];
                for (let i in this.ids){
                    checkIds.push(this.ids[i].id)
                }
                let fileName = '图片分类导出' + (new Date()).valueOf();
                let data = checkIds.join(',');
                this.$message.success("正在下载...请稍后");
                postDownloadFunc('br/api/sortManage/exportFile?fileName='+ fileName +'&ids=' + data,fileName, fileName);
            },
            downloadTemplate() {
                let fileName = '敏感图片分类导入模板' + (new Date()).valueOf();
                this.$message.success('正在下载...请稍后');
                getDownloadFunc('br/api/sortManage/importTemplate', fileName);
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

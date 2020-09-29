<template>
    <div>
        <el-row>
            <el-button-group style="margin-top: 4px;margin-bottom: 10px">
                <el-button type="primary" :plain="parentTypes === 3 ? false : true" size="medium"
                           @click="checkedTypeFunc(3,'业务分类1')">业务分类1
                </el-button>
                <el-button type="primary" :plain="parentTypes === 4 ? false : true" size="medium"
                           @click="checkedTypeFunc(4, '业务分类2')">业务分类2
                </el-button>
                <el-button type="primary" :plain="parentTypes === 5 ? false : true" size="medium"
                           @click="checkedTypeFunc(5, '中图分类')">中图分类
                </el-button>
                <el-button type="primary" :plain="parentTypes === 6 ? false : true" size="medium"
                           @click="checkedTypeFunc(6, 'Dewey')">Dewey
                </el-button>
                <el-button type="primary" :plain="parentTypes === 7 ? false : true" size="medium"
                           @click="checkedTypeFunc(7, 'BASIC')">BASIC
                </el-button>
                <el-button type="primary" :plain="parentTypes === 8 ? false : true" size="medium"
                           @click="checkedTypeFunc(8, 'BIC')">BIC
                </el-button>
                <el-button type="primary" :plain="parentTypes === 9 ? false : true" size="medium"
                           @click="checkedTypeFunc(9, 'LC')">LC
                </el-button>
                <el-button type="primary" :plain="parentTypes === 10 ? false : true" size="medium"
                           @click="checkedTypeFunc(10, 'NDC')">NDC
                </el-button>
            </el-button-group>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button style="width:100%;margin-bottom: 10px" size="medium" type="primary" :plain="true">{{
                    checkedTypeName }}
                </el-button>
                <el-tree :data="data"
                         :props="defaultProps" style="height: 729px;"
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
                        <el-input size="medium" v-model="searchKey" class="m-top"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="medium" type="primary" @click="searchFunc" class="m-top">搜索</el-button>
                    </el-col>
                </el-header>
                <el-main class="bg-white m-top">
                    <el-row style="margin-bottom: 10px">
                        <el-col :span="22">
                            <el-button type="primary"
                                       size="small"
                                       @click="$router.push({path:'/taxonomy/add'})">新建
                            </el-button>
                            <el-upload
                                style="display: inline-block;margin-left: 10px;margin-right: 10px"
                                action="/br/api/sortManage/importFile"
                                :headers="{'x-access-token':xAccessToken}"
                                :data="importData"
                                :on-success="onImportSuccess"
                                :on-error="onImportError"
                                size="small">
                                <el-button size="small" type="primary">导入</el-button>
                            </el-upload>
                            <el-button type="primary" size="small" @click="exportFunc">导出</el-button>
                            <el-button type="primary" size="small" @click="deleteFunc">删除</el-button>
                        </el-col>
                        <el-col :span="2" style="float:right;">
                            <el-button type="primary"
                                       :plain="true"
                                       size="small"
                                       @click="downloadTemplate"
                                       style="float:right;"
                            >导入模板下载
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-table
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            :default-sort="{prop: 'date', order: 'descending'}"
                            @row-dblclick="editRow"
                            @selection-change="handleSelectionChange"
                            :header-cell-style="{background:'#e6f0f6',color:'#606266'}"
                            :stripe="true"
                        >
                            <el-table-column
                                prop="id"
                                type="selection"
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
                                prop="sequence"
                                sortable
                                :formatter="sequenceFormatter"
                                label="顺序">
                            </el-table-column>
                            <el-table-column
                                prop="sortNumber"
                                label="分类号">
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
                                :formatter="updateFormatter">
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
                                        :disabled="scope.row.sequence < 2? true : false"
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
                        :current-page="pageNo"
                        :page-sizes="[20,40,60,80,100]"
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
    import { getDownloadFunc, postDownloadFunc, setCategoryMenu } from '../func';

    export default {
        name: 'sensitiveList',
        data() {
            return {
                xAccessToken: localStorage.getItem('token'),
                pageNo: 1,
                pageSize: 20,
                totalCount: 0,
                parentTypes: 3,
                checkedTypeName: '业务分类1',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [],
                tableData: [],
                ids: [],
                selectIds: [],
                searchKey: '',
                importData: {
                    parentId: 0,
                    type: 3,
                    sortIerarchy: 1
                }
            };
        },
        created() {
            this.leftCategory();
            this.getList();
        },
        methods: {
            deleteFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error('至少选择一个');
                }
                let data = {
                    sortModelList: this.ids,
                    type: this.parentTypes
                };
                let that = this;
                this.$post('/api/sortManage/deleteSortById', data)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.getList();
                                    that.leftCategory();
                                }
                            });
                        }
                        return that.$message.error(res.message);
                    });
            },
            checkedTypeFunc(type, name) {
                this.parentTypes = parseInt(type);
                this.checkedTypeName = name;
                this.getList();
                this.leftCategory();
            },
            leftCategory(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                data.type = this.parentTypes;
                let that = this;
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.data = setCategoryMenu(res.data.result);
                        }
                    });
            },
            getList(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                data.type = this.parentTypes;
                let that = this;
                this.$post('/api/sortManage/sortList', data)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            that.tableData = [];
                            that.totalCount = res.data.totalCount;
                            return that.tableData = res.data.result;
                        }
                    });
            },
            searchFunc() {
                if (!this.searchKey) {
                    return this.$message.error('请输入关键词');
                }
                this.getList({ sortNameQuery: this.searchKey });
            },
            onImportSuccess(response) {
                if (response.success && response.status === 0) {
                    return this.$message.success(response.message);
                }
                return this.$message.error(response.message);
            },
            onImportError() {
                this.$message.error('导入出错');
            },
            editRow(row) {
                this.$router.push({ name: 'taxonomyAdd', params: row });
            },
            exportFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error('至少选择一个');
                }
                let fileName = '分类法导出' + (new Date()).valueOf();
                let data = this.selectIds.join(',');
                this.$message.success('正在下载...请稍后');
                postDownloadFunc('br/api/sortManage/exportFile?fileName=' + fileName + '&ids=' + data, {}, fileName);
            },
            updateFormatter(row) {
                return row.updateTime;
            },
            sequenceFormatter(row) {
                return row.sequence;
            },
            handleNodeClick(data, checked, node) {
                if (checked === true) {
                    this.$refs.tree.setCheckedNodes([data]);
                    this.importData.parentId = data.id;
                    this.getList({ parentId: data.id });
                }
            },
            nodeClick(data, checked, node) {
                this.$refs.tree.setCheckedNodes([data]);
                this.importData.parentId = data.id;
                this.getList({ parentId: data.id });
            },
            handleSizeChange(e) {
                this.pageSize = e;
                this.getList({ pageSize: e });
            },
            handleCurrentChange(e) {
                this.getList({ pageNo: e });
            },
            handleSelectionChange(e) {
                this.ids = [];
                this.selectIds = [];
                for (let i in e) {
                    let temp = {
                        id: e[i].id,
                        parentId: e[i].parentId
                    };
                    this.ids.push(temp);
                    this.selectIds.push(e[i].id);
                }
            },
            downloadTemplate() {
                let fileName = '分类法导入模板' + (new Date()).valueOf();
                this.$message.success('正在下载...请稍后');
                getDownloadFunc('br/api/sortManage/importTemplate', fileName);
            },
            moveRow(type, data) {
                console.log(type, data);
                let that = this;
                let moveData = {
                    id: data.id,
                    parentId: data.parentId,
                    sequence: data.sequence,
                    type: this.parentTypes,
                    sortIerarchy: data.sortIerarchy
                };
                this.$post('/api/sortManage/upOrDownSort?upOrDown=' + type, moveData)
                    .then(function (res) {
                        if (res.status !== 0) {
                            return that.$message.error(res.message);
                        }
                        return that.$message.success(res.message);
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
</style>

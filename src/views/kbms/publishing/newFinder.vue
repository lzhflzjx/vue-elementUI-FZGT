<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-header class="bg-white">
                    <el-col :span="6">
                        <el-input size="medium" v-model="publishers" class="m-top"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="medium" type="primary" class="m-top" @click="search">搜索</el-button>
                    </el-col>
                </el-header>
                <el-main class="bg-white m-top">
                    <el-row style="margin-bottom: 10px">
                        <el-col :span="22">
                            <el-button type="primary" size="small" @click="dialogFormVisible = true">作为别名</el-button>
                        </el-col>
                        <el-col :span="2">
<!--                            <el-button type="primary" :plain="true" style="float:right;" size="small"-->
<!--                                       @click="downloadTemplate">导入模板下载-->
<!--                            </el-button>-->
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
                            :header-cell-style="{background:'#e6f0f6',color:'#606266'}"
                        >
                            <el-table-column
                                type="selection"
                                sortable
                                prop="id"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="publishers"
                                label="出版社">
                            </el-table-column>
                            <el-table-column
                                prop="publisherCode"
                                label="出版社号">
                            </el-table-column>
                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="$router.push({ name: 'publishingConfirm', params: scope.row })"
                                        type="text"
                                        size="small">
                                        确认
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
                        :page-sizes="[20, 40, 60, 80, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </el-footer>
            </el-col>
        </el-row>
        <el-dialog title="别名" :visible.sync="dialogFormVisible">
            <el-form :model="aliasForm">
                <el-form-item label="选择出版社：" :label-width="formLabelWidth">
                    <el-input v-model="aliasForm.publisherAlias" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="asAlias">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getDownloadFunc } from '../func';

    export default {
        name: 'sensitiveList',
        data() {
            return {
                pageNo: 1,
                pageSize: 20,
                totalCount: 0,
                publishers: '',
                dialogFormVisible: false,
                formLabelWidth: '150px',
                currentPage: 2,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tableData: [],
                selectIds: [],
                selectPublishName: '',
                aliasForm: { publisherAlias: '' }
            };
        },
        created() {
            this.getList();
        },
        methods: {
            getList(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                let that = this;
                this.tableData = [];
                this.$post('/api/publisher/queryNewList', data)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            that.totalCount = res.data.totalCount;
                            if (res.data.totalCount > 0) {
                                that.tableData = res.data.result;
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            handleSizeChange(e) {
                this.getList({ pageSize: e });
            },
            handleCurrentChange(e) {
                this.getList({ pageNo: e });
            },
            handleSelectionChange(e) {
                this.selectIds = [];
                this.selectPublishName = e[0].publishers;
                for (let i in e) {
                    this.selectIds.push(e[i].id);
                }
            },
            search() {
                if (!this.publishers) {
                    return this.$message.error('请输入查询条件');
                }
                this.getList({ publishers: this.publishers });
            },
            asAlias() {
                let that = this;

                if (this.selectIds.length > 1) {
                    return this.$message.error('只能选择一个');
                }
                this.$post('/api/publisher/NewPublisherToAlias?publisherName=' + this.aliasForm.publisherAlias + '&newPublisherName=' + this.selectPublishName)
                    .then(function (res) {
                        that.dialogFormVisible = false;
                        that.aliasForm.publisherAlias = '';
                        if (res.success && res.status === 0) {
                            return that.$message.success(res.message);
                            that.getList();
                        }
                        return that.$message.error(res.message);
                    })
                    .catch(function (err) {
                        that.dialogFormVisible = false;
                        that.aliasForm.publisherAlias = '';
                    });
            },
            downloadTemplate() {
                let fileName = '新发现出版社导入模板下载' + (new Date()).valueOf();
                let data = -1;
                this.$message.success('正在下载...请稍后');
                getDownloadFunc('br/api/publisher/export?fileName=' + fileName + '&ids=' + data, fileName);
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

<template>
    <div>
        <el-header class="bg-white">
            <el-col :span="6">
                <el-input size="medium" class="m-top" v-model="groupName"></el-input>
            </el-col>
            <el-col :span="4" style="margin-left:20px">
                <el-button size="medium" type="primary" @click="search" class="m-top" :clearable="true">搜索</el-button>
            </el-col>
        </el-header>
        <el-main class="bg-white m-top">
            <el-row style="margin-bottom: 10px">
                <el-col :span="20">
                    <el-button type="primary" size="small" @click="$router.push({path:'/sensitive/groupAdd'})">新建
                    </el-button>
                    <el-button type="primary" size="small" @click="deleteGroup">删除</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    :stripe="true"
                    :highlight-current-row="true"
                    v-loading="loading"
                    style="width: 100%"
                    :default-sort="{prop: 'date', order: 'descending'}"
                    @row-dblclick="updateFunc"
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
                        prop="groupName"
                        label="群组名称">
                    </el-table-column>
                    <el-table-column
                        prop="groupDescribe"
                        label="说明">
                    </el-table-column>
                    <el-table-column
                        prop="updateUser"
                        @dblclick.native="updateFunc"
                        label="最后修改人">
                    </el-table-column>
                    <el-table-column
                        prop="updateTime"
                        label="修改时间"
                        sortable
                        :formatter="formatter">
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
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageTotal">
            </el-pagination>
        </el-footer>
        <el-row :offset="10">
            <el-col :span="24" class="bg-white" style="margin-top: 10px">
                <div style="height: 80px"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'groupList',
        data() {
            return {
                loading: true,
                currentPage: 1,
                tableData: [],
                pageTotal: 0,
                selectGroup: [],
                groupName: ''
            };
        },
        created() {
            this.list();
        },
        methods: {
            list(data = {}) {
                let that = this;
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : 20;
                this.totalCount = 0;
                this.tableData = [];
                this.$post('/api/sensitiveWordGroup/sensitiveWordGroupIndex', data)
                    .then(function (res) {
                        that.loading = false;
                        if (res.status === 0) {
                            if (res.data && res.data.result) {
                                that.tableData = res.data.result;
                                that.pageTotal = res.data.totalCount;
                            }
                        }
                    })
                    .catch(function (err) {
                        that.loading = false;
                    });
            },
            formatter(row, column) {
                return row.updateTime;
            },
            handleNodeClick(e) {
                console.log(e);
            },
            handleSizeChange(e) {
                this.list({ pageSize: e });
            },
            handleCurrentChange(e) {
                this.list({ pageNo: e });
            },
            handleSelectionChange(e) {
                this.selectGroup = [];
                for (let i in e) {
                    this.selectGroup.push(e[i].id);
                }
            },
            updateFunc(e) {
                this.$router.push({ name: 'groupAdd', params: e });
            },
            search() {
                let data = {};
                if (this.groupName) {
                    data.groupName = this.groupName
                }
                this.list(data);
            },
            deleteGroup() {
                let that = this;
                const loading = this.$loading({
                    lock: true,
                    text: '删除中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$get('/api/sensitiveWordGroup/deleteSensitiveWordGroup?ids=' + that.selectGroup)
                    .then(function (res) {
                        loading.close();
                        if (res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.list();
                                }
                            });
                        }
                        that.$message.error(res.message);
                    })
                    .catch(function (err) {
                        loading.close();
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

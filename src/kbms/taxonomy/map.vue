<template>
    <div>
        <el-row>
            <el-col :span="24" class="bg-white">
                <el-form ref="form" :model="form" :inline="true" label-width="110px" style="padding-top: 10px">
                    <el-form-item label="映射分类：">
                        <el-select v-model="form.mappingType" size="medium" filterable clearable placeholder="请选择"
                                   style="width: 160px">
                            <el-option
                                v-for="item in businessClass"
                                :key="item.id"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类名称：">
                        <el-input v-model="form.mappingSortName" clearable size="medium" style="width: 160px"></el-input>
                    </el-form-item>
                    <el-form-item label="分类号：">
                        <el-input v-model="form.mappingSortNumber" clearable size="medium" style="width: 160px"></el-input>
                    </el-form-item>
                    <el-form-item label="业务分类：">
                        <el-select v-model="form.type" size="medium" filterable clearable placeholder="请选择"
                                   style="width: 160px">
                            <el-option
                                v-for="item in businessClass"
                                :key="item.id"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务分类名称：">
                        <el-input v-model="form.sortName" size="medium" style="width: 160px"></el-input>
                    </el-form-item>
                    <el-form-item label="业务分类号：">
                        <el-input v-model="form.sortNumber" size="medium" style="width: 160px"></el-input>
                    </el-form-item>
                    <el-button type="primary"
                               size="medium"
                               style="margin-top:2px;margin-left: 10px"
                               @click="searchFunc"
                    >查询
                    </el-button>
                </el-form>
            </el-col>
            <el-col :span="24">
                <el-main class="bg-white m-top">
                    <el-row style="margin-bottom: 10px">
                        <el-col :span="22">
                            <el-button type="primary"
                                       size="small"
                                       @click="$router.push({path:'/taxonomy/config/zhongtu'})">配置
                            </el-button>
                            <el-upload
                                style="display: inline-block;margin-left: 10px;margin-right: 10px"
                                action="/br/api/sortRelationManage/importFile"
                                :headers="{'x-access-token':xAccessToken}"
                                :show-file-list="false"
                                :on-success="onImportSuccess"
                                :on-error="onImportError"
                                size="small">
                                <el-button size="small" type="primary">导入</el-button>
                            </el-upload>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" :plain="true" size="small" @click="downloadTemplate"
                                       style="float:right;">导入模板下载
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
                                label="中图分类名称">
                            </el-table-column>
                            <el-table-column
                                prop="sortNumber"
                                label="中图分类号">
                            </el-table-column>
                            <el-table-column
                                prop="mappingSortName"
                                label="业务分类1名称">
                            </el-table-column>
                            <el-table-column
                                prop="mappingSortNumber"
                                label="业务分类1名分号">
                            </el-table-column>
                            <el-table-column
                                prop="createTime"
                                label="录入时间"
                                sortable
                                :formatter="formatter">
                            </el-table-column>
                            <el-table-column
                                prop="createUserName"
                                label="录入人">
                            </el-table-column>
                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="moveRow(scope.row)"
                                        type="text"
                                        size="small">
                                        删除关联
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
                        :current-page="mapPageNo"
                        :page-sizes="[20, 40, 60, 80, 100]"
                        :page-size="mapPageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="mapTotalCount">
                    </el-pagination>
                </el-footer>
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
    import { getDownloadFunc } from '../func';

    export default {
        name: 'sensitiveList',
        data() {
            return {
                xAccessToken: localStorage.getItem('token'),
                form: {
                    mappingType: '',
                    mappingSortName: '',
                    mappingSortNumber: '',
                    type: '',
                    sortName: '',
                    sortNumber: ''
                },
                businessClass: [
                    {
                        id: 3,
                        label: '业务分类1',
                        value: 3
                    }, {
                        id: 4,
                        label: '业务分类2',
                        value: 4
                    }, {
                        id: 5,
                        label: '中图分类',
                        value: 5
                    }, {
                        id: 6,
                        label: 'Dewey',
                        value: 6
                    }, {
                        id: 7,
                        label: 'BASIC',
                        value: 7
                    }, {
                        id: 8,
                        label: 'BIC',
                        value: 8
                    }, {
                        id: 9,
                        label: 'LC',
                        value: 9
                    }, {
                        id: 10,
                        label: 'NDC',
                        value: 10
                    }
                ],
                mapPageNo: 1,
                mapPageSize: 20,
                mapTotalCount: 0,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [],
                tableData: [],
                ids: [],
            };
        },
        created() {
            this.listData();
        },
        methods: {
            onImportSuccess(response) {
                let message = response.message ? response.message : response.exception;
                let types = response.success && response.status === 0 ? 'success' : 'error';
                this.$message({
                    message: message,
                    type: types
                });
            },
            onImportError() {
                this.$message.error('导入出错');
            },
            listData(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.mapPageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.mapPageSize;
                if (this.form.type){
                    data.type = this.form.type;
                }
                if (this.form.mappingType){
                    data.mappingType = this.form.mappingType;
                }
                data.flag = 2;
                let that = this;
                this.$post('/api/sortRelationManage/findSortRelation', data)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            if (res.data.totalCount > 0) {
                                that.mapTotalCount = res.data.totalCount;
                                return that.tableData = res.data.result;
                            }else{
                                that.tableData = [];
                                that.mapTotalCount = 0;
                            }
                        }
                    })
            },
            formatter(row) {
                return row.createTime;
            },
            handleSizeChange(e) {
                this.mapPageSize = e;
                this.listData({ pageSize: e });
            },
            handleCurrentChange(e) {
                this.mapPageNo = e;
                this.listData({ pageNo: e });
            },
            handleSelectionChange(e) {
                for (let i in e) {
                    this.ids.push(e[i].id);
                }
            },
            moveRow(e) {
                let data = JSON.stringify({
                    ids:[e.id]
                });
                let that = this;
                this.$requrestAxios.post('/br/api/sortRelationManage/deleteRelation', data,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (res) {
                        if (res.data.success && res.data.status === 0){
                            that.listData();
                            return that.$message.success(res.data.message);
                        }
                        return that.$message.error(res.data.message);
                    })
            },
            downloadTemplate() {
                let fileName = '分类法映射导入模板' + (new Date()).valueOf();
                this.$message.success('正在下载...请稍后');
                getDownloadFunc('br/api/sortRelationManage/importTemplate', fileName);
            },
            searchFunc() {
                let data = {};
                if (this.form.type) {
                    data.type = this.form.type;
                }
                if (this.form.sortName) {
                    data.sortName = this.form.sortName;
                }
                if (this.form.sortNumber) {
                    data.sortNumber = this.form.sortNumber;
                }
                if (this.form.mappingSortNumber) {
                    data.mappingSortNumber = this.form.mappingSortNumber;
                }
                if (this.form.mappingSortName) {
                    data.mappingSortName = this.form.mappingSortName;
                }
                if (this.form.mappingType) {
                    data.mappingType = this.form.mappingType;
                }
                data.pageNo = 1;
                this.listData(data);
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

<template>
    <div>
        <el-row>
            <el-col :span="24" class="bg-white" style="padding-top:14px">
                <el-form ref="form" :inline="true" :model="form" label-width="110px" style="padding-top: 10px">
                    <el-form-item label="出版社：">
                        <el-input v-model="form.publishers" clearable size="medium" style="width: 150px"></el-input>
                    </el-form-item>
                    <el-form-item label="是否敏感：">
                        <el-select v-model="form.ifSensitive" filterable clearable size="medium"
                                   placeholder="请选择">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出版社号：">
                        <el-input v-model="form.publisherCode" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="国家/地区：">
                        <el-select v-model="form.country" filterable clearable size="medium" placeholder="请选择">
                            <el-option
                                v-for="item in cityData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属集团：">
                        <el-input v-model="form.membershipGroup" placeholder="请填写所属集团"></el-input>
                    </el-form-item>
                    <el-form-item label="出版社类别：">
                        <el-select v-model="form.publisherType" filterable clearable size="medium"
                                   placeholder="请选择">
                            <el-option
                                v-for="item in publisherTypeTable"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="等级：">
                        <el-select v-model="form.level" filterable clearable size="medium" placeholder="请选择">
                            <el-option
                                v-for="item in publishRankOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出版物类别：">
                        <el-select v-model="form.publicationType" filterable clearable size="medium"
                                   placeholder="请选择">
                            <el-option
                                v-for="item in publicationTypeTable"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价格优先级：">
                        <el-select v-model="form.moneyPriority" filterable clearable size="medium"
                                   placeholder="请选择">
                            <el-option
                                v-for="item in reviewLevelOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
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
                                       @click="$router.push({path:'/publishing/add'})">新建
                            </el-button>
                            <el-upload
                                style="display: inline-block;margin-left: 10px;margin-right: 10px"
                                action="/br/api/publisher/import"
                                :headers="{'x-access-token':xAccessToken}"
                                :on-success="onImportSuccess"
                                :on-error="onImportError"
                                :show-file-list="false"
                            >
                                <el-button size="small" type="primary">导入</el-button>
                            </el-upload>
                            <el-button type="primary" size="small" @click="exportFunc">导出</el-button>
                            <el-button type="primary" size="small" @click="deleteFunc">删除</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" style="float:right;" :plain="true" size="small"
                                       @click="downloadTemplate">导入模板下载
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
                            stripe
                        >
                            <el-table-column
                                prop="id"
                                type="selection"
                                sortable
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="number"
                                label="序号">
                            </el-table-column>
                            <el-table-column
                                prop="publisherCode"
                                label="出版社号">
                            </el-table-column>
                            <el-table-column
                                prop="publisherPrefix"
                                label="出版社前缀">
                            </el-table-column>
                            <el-table-column
                                prop="publishers"
                                label="出版社名称">
                            </el-table-column>
                            <el-table-column
                                prop="publisherAlias"
                                label="别名">
                            </el-table-column>
                            <el-table-column
                                prop="country"
                                label="国家/地区">
                            </el-table-column>
                            <el-table-column
                                prop="membershipGroup"
                                label="所属集团">
                            </el-table-column>
                            <el-table-column
                                prop="membershipId"
                                label="集团编号">
                            </el-table-column>
                            <el-table-column
                                prop="publisherType"
                                label="出版社类别">
                            </el-table-column>
                            <el-table-column
                                prop="moneyPriority"
                                label="价格优先级">
                            </el-table-column>
                            <el-table-column
                                prop="level"
                                label="等级"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="publicationType"
                                label="出版物类别">
                            </el-table-column>
                            <el-table-column
                                prop="ifSensitive"
                                label="是否敏感">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.ifSensitive === 1">是</span>
                                    <span v-if="scope.row.ifSensitive === 2">否</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="describes"
                                label="简介/描述"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="maintainer"
                                label="深度维护员"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="updateId"
                                label="最后修改人"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="date"
                                label="修改时间"
                                sortable
                                :formatter="formatter">
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-main>
                <el-footer class="bg-white">
                    <div class="block">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="thisPage"
                            :page-sizes="[20, 40, 60, 80]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="allTotal">
                        </el-pagination>
                    </div>
                </el-footer>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="bg-white" style="margin-top: 10px">
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
                thisPage:1,
                allTotal: 0,
                xAccessToken: localStorage.getItem('token'),
                form: {
                    country: '',
                    ifSensitive: '',
                    level: '',
                    membershipGroup: '',
                    moneyPriority: '',
                    publicationType: '',
                    publisherAlias: '',
                    publisherCode: '',
                    publisherType: '',
                    publishers: ''
                },
                pageSize: 20,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [],
                tableData: [],
                cityData: [],
                publisherTypeTable: [],
                publicationTypeTable: [],
                ids: [],
                reviewLevelOptions: [],
                publishRankOptions: []
            };
        },
        created() {
            this.getList();
            this.getCityList(); //获取城市列表
            this.getPublisherType(); // 获取出版社类别
            this.getPublicationType(); // 获取出版物类别
            this.reviewLevelList();//优先级
            this.publishRankList();//等级
        },
        methods: {
            reviewLevelList() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=priceLevel')
                    .then(function (res) {
                        if (res.success && res.status === 0 && res.data !== null) {
                            return that.reviewLevelOptions = res.data.dictionaryInfoList;
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            publishRankList() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=publisherRank')
                    .then(function (res) {
                        if (res.success && res.status === 0 && res.data !== null) {
                            return that.publishRankOptions = res.data.dictionaryInfoList;
                        }
                    })
            },
            getList(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.thisPage;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                let that = this;
                this.tableData = [];
                this.totalCount = 0;
                this.$post('/api/publisher/queryList', data)
                    .then(function (res) {
                        if (res.success && res.status === 0 && res.data !== null) {
                            that.allTotal = res.data.totalCount;
                            that.tableData = res.data.result;
                        }
                    })
            },
            getCityList() {
                let that = this;
                this.$get('/api/region/findRegions?level=1')
                    .then(function (res) {
                        if (res.success && res.status === 0 && res.data !== null) {
                            that.cityData = res.data;
                        }
                    })
            },
            getPublisherType() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=publisherType')
                    .then(function (res) {
                        if (res.success && res.status === 0 && res.data !== null){
                            that.publisherTypeTable = res.data.dictionaryInfoList;
                        }
                    })
            },
            getPublicationType() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=publicationType')
                    .then(function (res) {
                        if (res.success && res.status === 0 && res.data !== null){
                            that.publicationTypeTable = res.data.dictionaryInfoList;
                        }
                    })
            },
            onImportSuccess(response) {
                let message = response.message ? response.message : response.exception;
                let types = response.success && response.status === 0 ? 'success' : 'error';
                let that = this;
                this.$message({
                    message: message,
                    type: types,
                    onClose: function () {
                        that.getList();
                    }
                });
            },
            onImportError() {
                this.$message.error('导入出错');
            },
            formatter(row) {
                return row.updateTime;
            },
            handleSizeChange(e) {
                this.pageSize = e;
                this.getList({ pageSize: e });
            },
            handleCurrentChange(e) {
                this.thisPage = e;
                this.getList({ pageNo: e });
            },
            handleSelectionChange(e) {
                this.ids = [];
                for (let i in e) {
                    this.ids.push(e[i].id);
                }
            },
            exportFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error('至少选择一个');
                }
                let fileName = '出版社导出' + (new Date()).valueOf();
                let data = this.ids.join(',');
                this.$message.success('正在下载...请稍后');
                getDownloadFunc('br/api/publisher/export?fileName=' + fileName + '&ids=' + data, fileName);
            },
            deleteFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error('至少选择一个');
                }
                let that = this;
                this.$post('/api/publisher/deleteById?id=' + this.ids.join(','))
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.getList();
                                }
                            });
                        }
                    })
            },
            searchFunc() {
                let data = {};
                if (this.form.publishers) {
                    data.publishers = this.form.publishers;
                }
                if (this.form.country) {
                    data.country = this.form.country;
                }
                if (this.form.ifSensitive) {
                    data.ifSensitive = parseInt(this.form.ifSensitive);
                }
                if (this.form.level) {
                    data.level = this.form.level;
                }
                if (this.form.membershipGroup) {
                    data.membershipGroup = this.form.membershipGroup;
                }
                if (this.form.moneyPriority) {
                    data.moneyPriority = this.form.moneyPriority;
                }
                if (this.form.publicationType) {
                    data.publicationType = this.form.publicationType;
                }
                if (this.form.publisherAlias) {
                    data.publisherAlias = this.form.publisherAlias;
                }
                if (this.form.publisherCode) {
                    data.publisherCode = this.form.publisherCode;
                }
                if (this.form.publisherType) {
                    data.publisherType = this.form.publisherType;
                }
                if(this.form.moneyPriority){
                    data.moneyPriority = this.form.moneyPriority;
                }
                this.getList(data);
            },
            editRow(row) {
                this.$router.push({ name: 'publishingAdd', params: row });
            },
            downloadTemplate() {
                let fileName = '出版社导入模板下载' + (new Date()).valueOf();
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

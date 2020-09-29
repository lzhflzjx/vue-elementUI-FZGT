<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button style="width:100%;margin-bottom: 10px"
                           size="medium"
                           type="primary"
                           @click="$router.push({path:'/sensitive/category'})"
                           :plain="true">敏感词分类
                    <i class="el-icon-edit-outline el-icon--right"></i>
                </el-button>
                <el-tree :data="data"
                         v-loading="menuLoading"
                         :props="defaultProps"
                         style="min-height: 729px;"
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
                        <p style="line-height: 30px">搜索条件：</p>
                    </el-col>
                    <el-col :span="2">
                        <el-select v-model="form.sensitiveLevel" class="m-top" size="medium" placeholder="敏感等级">
                            <el-option
                                v-for="item in levelOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <el-select v-model="form.sensitiveSource" class="m-top" size="medium" placeholder="来源">
                            <el-option
                                v-for="item in sourceOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <el-select v-model="form.sensitiveType" class="m-top" size="medium" placeholder="类型">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <el-select v-model="form.sensitiveLanguage" class="m-top" size="medium" placeholder="语种">
                            <el-option
                                v-for="item in languageOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <el-select v-model="form.sensitiveStatus" class="m-top" size="medium" placeholder="状态">
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <el-select v-model="form.sensitiveScope" class="m-top" size="medium" placeholder="检测范围">
                            <el-option
                                v-for="item in checkScope"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <el-select v-model="form.sensitiveGroup" class="m-top" size="medium" placeholder="群组">
                            <el-option
                                v-for="item in groupOptions"
                                :key="item.id"
                                :label="item.groupName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-input size="medium" v-model="form.sensitiveNameQuery" class="m-top"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button
                            size="medium"
                            type="primary"
                            class="m-top"
                            @click="searchFunc"
                        >搜索
                        </el-button>
                    </el-col>
                </el-header>
                <el-main class="bg-white m-top">
                    <el-row style="margin-bottom: 10px">
                        <el-col :span="22">
                            <el-button type="primary"
                                       size="small"
                                       @click="$router.push({path:'/sensitive/add'})">新建
                            </el-button>
                            <el-upload
                                style="display: inline-block;margin-left: 10px;margin-right: 10px"
                                action="http://59.108.111.18:8080/br/api/sensitiveWord/importSensitiveWord"
                                :headers="{'x-access-token':xAccessToken}"
                                :on-success="onUploadSuccess"
                                :on-error="onUploadError"
                                size="medium">
                                <el-button size="small" type="primary">导入</el-button>
                            </el-upload>
                            <el-button type="primary" size="small" @click="exportFunc">导出</el-button>
                            <el-button type="primary" size="small" @click="bindGroup">群组</el-button>
                            <el-button type="primary" size="small" @click="stopFunc">停用</el-button>
                            <el-button type="primary" size="small" @click="deleteFunc">删除</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary"
                                       :plain="true"
                                       @click="downloadTemplate"
                                       size="small"
                                       style="float:right;"
                            >导入模板下载</el-button>
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
                                prop="sensitiveName"
                                label="敏感词">
                            </el-table-column>
                            <el-table-column
                                prop="sensitiveLevel"
                                label="敏感等级">
                            </el-table-column>
                            <el-table-column
                                prop="sensitiveProblem"
                                label="敏感问题">
                            </el-table-column>
                            <el-table-column
                                prop="sensitiveSource"
                                label="来源">
                            </el-table-column>
                            <el-table-column
                                prop="sensitiveLanguage"
                                label="语种">
                            </el-table-column>
                            <el-table-column
                                prop="sensitiveType"
                                label="类型">
                            </el-table-column>
                            <el-table-column
                                prop="state"
                                label="状态">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.state === 1">启用</span>
                                    <span v-if="scope.row.state === 0">停用</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="detectionRange"
                                label="图书检测范围">
                            </el-table-column>
                            <el-table-column
                                label="详细">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="info(scope.row)"
                                        type="text"
                                        size="small">
                                        查看
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
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageTotal">
                    </el-pagination>
                </el-footer>
            </el-col>
        </el-row>
        <el-row :offset="10">
            <el-col :span="24" class="bg-white" style="margin-top: 10px">
                <div style="height: 80px"></div>
            </el-col>
        </el-row>
        <el-dialog title="绑定群组" :visible.sync="groupDialogFormVisible">
            <el-form :model="bindGroupForm">
                <el-form-item label="要绑定的群组" :label-width="formLabelWidth">
                    <el-select v-model="bindGroupForm.groupId" filterable placeholder="请选择群组">
                        <el-option
                            v-for="item in groupOptions"
                            :key="item.id"
                            :label="item.groupName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="groupDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="bindFunc">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { getDownloadFunc, setCategoryMenu } from '../func';

    export default {
        name: 'sensitiveList',
        data() {
            return {
                xAccessToken: localStorage.getItem('token'),
                currentPage: 1,
                loadingData: true,
                menuLoading: true,
                pageTotal: 0,
                resultSize: 100,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                levelOptions: [],
                sourceOptions: [],
                languageOptions: [],
                typeOptions: [],
                statusOptions: [],
                checkScope: [],
                groupOptions: [],
                value: '',
                data: [],
                tableData: [],
                ids: [],
                groupDialogFormVisible: false,
                formLabelWidth: '120px',
                form: {
                    sensitiveLevel: '',
                    sensitiveGroup: '',
                    sensitiveSource: '',
                    sensitiveLanguage: '',
                    sensitiveType: '',
                    sensitiveStatus: '',
                    sensitiveScope: '',
                    sensitiveNameQuery: ''
                },
                bindGroupForm: {
                    groupId: ''
                }
            };
        },
        created() {
            this.list();
            this.leftMenu();
            this.sourceList('sensitiveSite'); //敏感来源列表
            this.languageList('language'); //语种列表
            this.typeList('sensitiveType'); //类型列表
            this.statusList('sensitiveStatus'); // 状态列表
            this.levelList('sensitiveLevel'); // 等级列表
            this.rangeList('checkRange'); // 检测范围
            this.groupList(); // 群组查询
        },
        methods: {
            leftMenu(data = {}) {
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
            list(data = {}) {
                let that = this;
                data.pageNo = this.currentPage;
                data.pageSize = data.pageSize ? data.pageSize : 20;
                this.tableData = [];
                this.pageTotal = 0;
                this.resultSize = 0;
                this.$post('/api/sensitiveWord/sensitiveWordIndex', data)
                    .then(function (res) {
                        that.loadingData = false;
                        if (res.data !== null) {
                            that.tableData = res.data.result;
                            that.pageTotal = res.data.totalCount;
                            that.resultSize = res.data.resultSize;
                        }
                    })
                    .catch(function (error) {
                        that.loadingData = false;
                    });
            },
            levelList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.levelOptions = res.data.dictionaryInfoList;
                    })
            },
            rangeList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.checkScope = res.data.dictionaryInfoList;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            sourceList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.sourceOptions = res.data.dictionaryInfoList;
                    })
            },
            languageList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.languageOptions = res.data.dictionaryInfoList;
                    })
            },
            typeList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.typeOptions = res.data.dictionaryInfoList;
                    })
            },
            statusList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.statusOptions = res.data.dictionaryInfoList;
                    })
            },
            groupList() {
                let that = this;
                let data = {
                    pageNo: 1,
                    pageSize: 20,
                };
                this.$post('/api/sensitiveWordGroup/sensitiveWordGroupIndex', data)
                    .then(function (res) {
                        that.groupOptions = res.data.result;
                    })
            },
            searchFunc() {
                if (!this.form.sensitiveLevel &&
                    !this.form.sensitiveGroup &&
                    !this.form.sensitiveSource &&
                    !this.form.sensitiveLanguage &&
                    !this.form.sensitiveType &&
                    !this.form.sensitiveStatus &&
                    !this.form.sensitiveScope &&
                    !this.form.sensitiveNameQuery) {
                    return this.$message.error('必须选择一个选项');
                }
                let data = {};
                if (this.form.sensitiveLevel) {
                    data.sensitiveLevel = this.form.sensitiveLevel;
                }
                if (this.form.sensitiveGroup) {
                    data.groupId = this.form.sensitiveGroup;
                }
                if (this.form.sensitiveSource) {
                    data.sensitiveSource = this.form.sensitiveSource;
                }
                if (this.form.sensitiveLanguage) {
                    data.sensitiveLanguage = this.form.sensitiveLanguage;
                }
                if (this.form.sensitiveType) {
                    data.sensitiveType = this.form.sensitiveType;
                }
                if (this.form.sensitiveStatus) {
                    data.state = parseInt(this.form.sensitiveStatus);
                }
                if (this.form.sensitiveScope) {
                    data.sensitiveScope = this.form.sensitiveScope;
                }
                if (this.form.sensitiveNameQuery) {
                    data.sensitiveNameQuery = this.form.sensitiveNameQuery;
                }
                if (this.form.sortId) {
                    data.sortId = this.form.sortId;
                }
                this.list(data);
            },
            formatter(row) {
                return row.date;
            },
            downloadTemplate() {
                let fileName = '敏感词导入模板' + (new Date()).valueOf();
                this.$message.success("正在下载...请稍后");
                getDownloadFunc('br/api/sensitiveWord/exportSensitiveWordTemplet',fileName);
            },
            handleNodeClick(data,checked,node) {
                if (checked === true){
                    this.form.sortId = data.id;
                    this.$refs.tree.setCheckedNodes([data]);
                    this.list({sortId: data.id});
                }
            },
            nodeClick(data,checked,node){
                this.$refs.tree.setCheckedNodes([data]);
                this.list({sortId: data.id});
            },
            handleSizeChange(e) {
                this.resultSize = e;
                this.list({ pageSize: e });
            },
            handleCurrentChange(e) {
                this.currentPage = e;
                this.list({ pageNo: e });
            },
            handleSelectionChange(e) {
                this.ids = [];
                for (let i in e) {
                    this.ids.push(e[i].id);
                }
            },
            onUploadSuccess(message) {
                this.$message.success(message);
            },
            onUploadError(error) {
                this.$message.error(error);
            },
            info(e) {
                console.log(e);
                this.$router.push({ name: 'SensitiveInfo', params: e });
            },
            editRow(rows){
                this.$router.push({name:'SensitiveAdd', params: rows})
            },
            exportFunc() {
                if (this.ids.length < 1){
                    return this.$message.error("至少选择一个敏感词");
                }
                let fileName = '敏感词导出' + (new Date()).valueOf();
                let data = this.ids.join(',');
                this.$message.success("正在下载...请稍后");
                getDownloadFunc('br/api/sensitiveWord/exportSensitiveWordTemplet?ids='+data,fileName);
            },
            stopFunc() {
                let that = this;
                if (this.ids.length < 1) {
                    return that.$message.error('至少选择一个敏感词');
                }
                this.$get('/api/sensitiveWord/changeState?state=0&ids=' + this.ids)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.list();
                                }
                            });
                        }
                        return that.$message.error(res.message);
                    })
            },
            deleteFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error('请选择要删的敏感词');
                }
                let that = this;
                this.$get('/api/sensitiveWord/deleteSensitiveWordIndex?ids=' + this.ids)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.list();
                                }
                            });
                        }
                        return that.$message.error(res.message);
                    })
            },
            bindGroup() {
                if (this.ids.length < 1) {
                    return this.$message.error('请选择敏感词');
                }
                this.groupDialogFormVisible = true;
            },
            bindFunc() {
                this.groupDialogFormVisible = false;
                if (!this.bindGroupForm.groupId || this.bindGroupForm.groupId === 0) {
                    return this.$message.error('请选择群组');
                }
                let that = this;
                this.$get('/api/sensitiveWord/addSensitiveWordToGroup?id=' + this.bindGroupForm.groupId + '&ids=' + this.ids)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.list();
                                }
                            });
                        }
                        return that.$message.error(res.message);
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

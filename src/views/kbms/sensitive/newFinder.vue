<template>
    <div>
        <el-header class="bg-white">
            <el-col :span="6">
                <el-input size="medium" v-model="searchKey" class="m-top"></el-input>
            </el-col>
            <el-col :span="4" style="margin-left:20px">
                <el-button size="medium" type="primary" class="m-top" @click="searchFunc">查询</el-button>
            </el-col>
        </el-header>
        <el-main class="bg-white m-top">
            <el-row style="margin-bottom: 10px">
                <el-col :span="20">
                    <el-button type="primary" size="small" @click="confirmSensitive">确认</el-button>
                    <el-button type="primary" size="small" @click="saveAliasFunc">作为别名</el-button>
                    <el-button type="primary" size="small" @click="igone">忽略</el-button>
                    <el-button type="primary" size="small" @click="deleteSensitive">删除</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :default-sort="{prop: 'date', order: 'descending'}"
                    :stripe="true"
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
                        prop="sensitiveName"
                        label="敏感词">
                    </el-table-column>
                    <el-table-column
                        prop="rawWord"
                        label="原词">
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
                        prop="createUser"
                        label="创建用户">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="创建时间"
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
                :current-page="pageNo"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="resultSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </el-footer>
        <el-dialog title="新建" :visible.sync="addFinderForm" width="30%">
            <el-form v-model="addForm">
                <el-form-item label="新建" :label-width="formLabelWidth">
                    <el-input v-model="addForm.sensitiveName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFinderForm = false">取 消</el-button>
                <el-button type="primary" @click="addFinder">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="作为别名" :visible.sync="aliasModelForm" width="30%">
            <el-form v-model="aliasForm">
                <el-form-item label="选择敏感词" :label-width="formLabelWidth">
                    <el-input v-model="aliasForm.alias" :placeholder="aliasForm.sensitive" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="aliasModelForm = false">取 消</el-button>
                <el-button type="primary" @click="saveAlias">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="作为词组" :visible.sync="keyGroupModelForm" width="40%">
            <el-form v-model="keyGroupForm">
                <el-form-item label="选择敏感词" :label-width="formLabelWidth">
                    <el-input v-model="keyGroupForm.name" style="width: 180px"></el-input>
                    <el-select v-model="keyGroupForm.span" style="width: 120px" placeholder="字符间距">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="keyGroupForm.name" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="keyGroupModelForm = false">取 消</el-button>
                <el-button type="primary" @click="keyGroupModelForm = false">保 存</el-button>
            </div>
        </el-dialog>
        <el-row :offset="10">
            <el-col :span="24" class="bg-white" style="margin-top: 10px">
                <div style="height: 80px"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'newFinder',
        data() {
            return {
                pageNo: 1,
                totalCount: 0,
                resultSize: 100,
                addFinderForm: false,
                aliasModelForm: false,
                keyGroupModelForm: false,
                addForm: {
                    sensitiveName: ''
                },
                aliasForm: {
                    alias: '',
                    sensitive: ''
                },
                keyGroupForm: {},
                formLabelWidth: '100px',
                options: [{
                    label: '10px',
                    value: 10
                }, {
                    label: '20px',
                    value: 20
                }],
                tableData: [],
                ids: [],
                searchKey:'',
                finderId: ''
            };
        },
        created() {
            this.getList();
        },
        methods: {
            getList(data = {}) {
                let that = this;
                if (!data.pageNo) {
                    data.pageNo = this.pageNo;
                    data.resultSize = this.resultSize;
                }
                data.pageSize = data.pageSize ? data.pageSize : 100;
                this.totalCount = 0;
                this.tableData = [];
                this.$post('/api/sensitiveNewWord/sensitiveNewWordIndex', data)
                    .then(function (res) {
                        console.log(res);
                        that.totalCount = res.data.totalCount;
                        that.tableData = res.data.result;
                    })
            },
            confirmSensitive(){
                if (this.ids.length < 1){
                    return this.$message.error("请选择敏感词");
                }
                console.log(this.aliasForm.sensitive);
                return this.$router.push({name:'SensitiveAdd',params:{sensitive: this.aliasForm.sensitive, finderId:this.finderId}})
            },
            formatter(row, column) {
                return row.createTime;
            },
            handleSizeChange(e) {
                this.resultSize = e;
                this.getList({resultSize: e})
            },
            handleCurrentChange(e) {
                this.pageNo = e;
                this.getList({pageNo: e})
            },
            handleSelectionChange(e) {
                this.aliasForm.sensitive = e[0].sensitiveName;
                this.finderId = e[0].id;
                for (let i in e) {
                    this.ids.push(e[i].id);
                }
            },
            addFinder(e) {
                let that = this;
                if (!that.addForm.sensitiveName){
                    return that.$message.error("请填写敏感词")
                }
                that.addFinderForm = false;
                this.$post('/api/sensitiveNewWord/insertSensitiveNewWord', this.addForm).then(function (res) {
                    if (res.success){
                        return that.$message({
                            message: res.message,
                            type: 'success',
                            onClose:function () {
                                that.getList();
                            }
                        });
                    }
                    return that.$message.error(res.message)
                })
            },
            saveAliasFunc(){
                if (this.ids.length < 1){
                    return this.$message.error("请选择敏感词")
                }
                this.aliasModelForm = true;
            },
            saveAlias() {
                if (!this.aliasForm.alias || this.aliasForm.alias === undefined || this.aliasForm.alias === '') {
                    return this.$message.error('请填写别名');
                }
                let that = this;
                this.aliasModelForm = false;
                this.$post('/api/sensitiveWord/setSensitiveWordAlias?alias=' + this.aliasForm.sensitive + '&sensitiveWord=' + this.aliasForm.alias)
                    .then(function (res) {
                        if (res.success) {
                            return that.$message.success(res.message);
                        }
                        if (res.success === false) {
                            return that.$message.error(res.message);
                        }

                    })
            },
            igone() {
                let ids = this.ids;
                let that = this;
                this.$get('/api/sensitiveNewWord/updateSensitiveState?ids=' + ids)
                    .then(function (res) {
                        if (res.success) {
                            that.getList();
                            return that.$message.success(res.message);
                        }
                        return that.$message.error(res.message);
                    })
            },
            deleteSensitive() {
                let ids = this.ids;
                let that = this;
                this.$get('/api/sensitiveNewWord/deleteSensitiveNewWordIndex?ids=' + ids)
                    .then(function (res) {
                        if (res.success) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose:function () {
                                    that.$router.go(0)
                                }
                            });
                        }
                        return that.$message.error(res.message);
                    })
            },
            searchFunc(){
                if (!this.searchKey){
                    return this.$message.error("请填写关键词");
                }
                this.getList({sensitiveName: this.searchKey})
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

<template>
    <div>
        <div class="tag-box">
            <div class="search-box font-14">
                <el-row class="screen-box">
                    <el-col class="screen" :span="4">奖项类型：
                        <el-select v-model="form.objectType" class="screen-item" placeholder="请选择">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col class="screen" :span="4">奖项等级：
                        <el-select v-model="form.level" class="screen-item" placeholder="请选择">
                            <el-option
                                v-for="item in levelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <div style="line-height:34px">奖项时间：</div>
                    </el-col>
                    <el-col :span="8">
                        <el-date-picker
                            v-model="value1"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="input" placeholder="请输入内容"></el-input>
                    </el-col>
                    <el-col :push="1" :span="1">
                        <el-button type="primary" size="medium" @click="search">查询</el-button>
                    </el-col>
                </el-row>
            </div>
            <!-- 表格 -->
            <div class="tag-con">
                <el-row class="row">
                    <el-col :span="20">
                        <el-button size="medium"
                                   type="primary"
                                   @click="$router.push({ path: '/awards/add' })">新增</el-button>
                        <el-upload
                            style="display: inline-block;margin-left: 10px;margin-right: 10px"
                            action="http://59.108.111.18:8080/br/api/awardsManage/importFile"
                            :headers="{'x-access-token':xAccessToken}"
                            :on-success="onUploadSuccess"
                            :on-error="onUploadError"
                            size="medium">
                            <el-button size="medium" type="primary">导入</el-button>
                        </el-upload>
                        <el-button size="medium" type="primary" @click="exportFunc">导出</el-button>
                        <el-button size="medium" @click="remove" type="primary">删除</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button size="medium" @click="downloadTemplate">导入模板下载</el-button>
                    </el-col>
                </el-row>
                <!-- 表格 -->
                <el-table
                    ref="multipleTable"
                    :data="awardList"
                    stripe
                    height="300"
                    tooltip-effect="dark"
                    border
                    highlight-current-row
                    style="width: 100%"
                    header-row-class-name="table-head"
                    @row-dblclick="awardsChange"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="奖项名称"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="level"
                        label="奖项等级"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="奖项类型"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="objectType"
                        label="获奖对象类型"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="获奖时间"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="author"
                        label="获奖人/组织"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="refOpus"
                        label="关联作品"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="关联产品"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style="margin-top:30px;"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="currentPage"
                               :page-sizes="[100,200,300,400]"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               hide-on-single-page
                               :total="totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { getDownloadFunc } from '../func';

    export default {
        name: 'tag',
        data() {
            return {
                xAccessToken: localStorage.getItem('token'),
                input3: '',
                select: '',
                input: '',
                value: '',
                value1: '',
                typeOptions: [],
                levelOptions: [],
                tableData: [],
                currentPage: 1,
                dialogFormVisible: false,
                form: {
                    name: '',
                    level:'',
                    type:'',
                    objectType:''
                },
                formLabelWidth: '120px',
                dialogFormVisible1: false,
                totalCount: 0,
                pageSize: 100,
                awardList:[],
                ids: []
            };
        },
        created() {
            this.getAwardList();
            this.getLevelOptions();
            this.getTypeOptions();
        },
        methods: {
            getLevelOptions(){
                let that = this;
                this.$get('/api/dic/selectByCode?code=awardsLevel')
                    .then(function (res) {
                        if (res.status === 0){
                            that.levelOptions = res.data.dictionaryInfoList;
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            getTypeOptions(){
                let that = this;
                this.$get('/api/dic/selectByCode?code=awardsType')
                    .then(function (res) {
                        if (res.status === 0){
                            return that.typeOptions = res.data.dictionaryInfoList;
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            getAwardList(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.currentPage;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                data.type = data.type ? data.type : 1;
                if (this.form.name !== '') {
                    data.name = this.form.name;
                }
                if (this.value1 !== '') {
                    data.beginTime = this.value1[0];
                    data.endTime = this.value1[1];
                }
                this.$post('/api/awardsManage/findAwards',data)
                    .then(res => {
                        if (res.data != null) {
                            this.awardList = res.data.result;
                            this.totalCount = res.data.totalCount;
                        } else {
                            this.awardList = [];
                            this.totalCount = 0;
                        }
                    });
            },
            // 新增
            awardsWorkAdd() {
                this.$router.push({ path: '/awards/works/add' });
            },
            awardsChange(e){
                console.log(e)
            },
            //   表格
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                for (let i in val){
                    this.ids.push(val[i].id)
                }
            },
            // 查看
            handleClick(row) {
                this.$router.push({ path: '/awards/product', query: { awards: JSON.stringify(row) } });
            },
            // 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            onUploadSuccess(response){
                this.$message.success(response.message)
            },
            onUploadError(){
                this.$message.error("导入异常")
            },
            exportFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error("至少选择一个奖项");
                }
                let fileName = "组织奖项库导出"+ (new Date()).valueOf();
                let data = this.ids.join(',');
                this.$message.success("正在下载...请稍后");
                getDownloadFunc('br/api/awardsManage/exportFile?fileName=' + fileName + '&ids='+data,fileName);
            },
            downloadTemplate(){
                let fileName = "组织奖项库模板"+ (new Date()).valueOf();
                this.$message.success("正在下载...请稍后");
                getDownloadFunc('br/api/awardsManage/importTemplate',fileName);
            },
            // 删除
            remove() {
                if (this.ids.length < 1){
                    return this.$message.error("至少选择一个")
                }
                let that = this;
                this.$post('/api/awardsManage/deleteAwards?ids=' + this.ids.join(','))
                    .then(res => {
                        if (res.success && res.status === 0){
                            return this.$message({
                                message: res.message,
                                type: 'success',
                                onClose:function () {
                                    that.getAwardList();
                                }
                            })
                        }
                    }).catch(function (error) {
                    that.$message.error("删除出错");
                    console.log(error)
                })
            },
            search() {
                let data = {};
                if (this.form.name){
                    data.name = this.form.name;
                }
                if (this.form.name){
                    data.name = this.form.name;
                }
                if (this.form.name){
                    data.name = this.form.name;
                }
                if (this.form.name){
                    data.name = this.form.name;
                }
                if (this.form.name){
                    data.name = this.form.name;
                }
                data.pageNo = 1;
                this.getAwardList(data);
            },
        }
    };
</script>
<style lang="scss" scoped>
    .font-14 {
        font-size: 14px;
    }
    .tag-box {
        background: #F1F4F5;
        // padding: 30px;
        .search-box {
            padding: 30px;
            background: #fff;
            span {
                margin-right: 10px;
            }
            .option-box {
                width: 700px;
                margin-top: 20px;
            }
            .screen-box {
                padding-bottom: 20px;
            }
            .screen {
                display: flex;
                align-items: center;
                .screen-item {
                    flex: 1;
                }
            }
        }
        .tag-con {
            margin-top: 30px;
            background: #fff;
            padding: 30px;

            .row {
                padding-bottom: 30px;
            }

            /deep/ .table-head th {
                background: #E5F0F6 !important;
            }
        }

        /deep/ .el-select .el-input {
            width: 130px;
        }

        /deep/ .input-with-select .el-input-group__prepend {
            background-color: #fff;
        }

    }

    .pop-foot {
        display: flex;
        justify-content: space-around;
    }
</style>

<template>
    <div>
        <div class="tag-box">
            <div class="search-box font-14">
                <el-row class="screen-box">
                    <el-form ref="form" :inline="true" v-model="form">
                        <el-form-item label="奖项类型：">
                            <el-select v-model="form.objectType" class="screen-item" placeholder="请选择" size="small">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="奖项等级：">
                            <el-select v-model="form.level" class="screen-item" placeholder="请选择" size="small">
                                <el-option
                                    v-for="item in levelOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="奖项时间：">
                            <el-date-picker
                                v-model="form.beginTime"
                                value-format="yyyy-MM-dd"
                                size="small"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="至"></el-form-item>
                        <el-form-item>
                            <el-date-picker
                                v-model="form.endTime"
                                value-format="yyyy-MM-dd"
                                size="small"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="form.name" placeholder="请输入内容" size="small"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="search" type="primary" size="small">查询</el-button>
                        </el-form-item>

                    </el-form>
                </el-row>

            </div>
            <!-- 表格 -->
            <div class="tag-con">
                <el-row class="row">
                    <el-col :span="22">
                        <el-row>
                            <el-col :span="20">
                                <el-button size="small"
                                           type="primary"
                                           @click="$router.push({ path: '/awards/add' })">新增</el-button>
                                <el-upload
                                    style="display: inline-block;margin-left: 10px;margin-right: 10px"
                                    action="http://59.108.111.18:8080/br/api/awardsManage/importFile"
                                    :headers="{'x-access-token':xAccessToken}"
                                    :on-success="onUploadSuccess"
                                    :on-error="onUploadError"
                                    size="small">
                                    <el-button size="small" type="primary">导入</el-button>
                                </el-upload>
                                <el-button size="small" type="primary" @click="exportFunc">导出</el-button>
                                <el-button size="small" type="primary" @click.native="remove">删除</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="2">
                        <el-button size="small" style="float: right" @click="downloadTemplate">导入模板下载</el-button>
                    </el-col>
                </el-row>
                <!-- 表格 -->
                <el-table
                    ref="multipleTable"
                    :data="awardList"
                    stripe
                    style="width: 100%"
                    header-row-class-name="table-head"
                    @row-dblclick="awardsChange"
                    @selection-change="handleSelectionChange"
                    :page-sizes="[100, 200, 300, 400]"
                >
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
                        prop="author"
                        label="ISBN"
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
                               :page-sizes="[20,40,60,80,100]"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { getDownloadFunc } from '../../func';

    export default {
        name: 'tag',
        data() {
            return {
                xAccessToken: localStorage.getItem('token'),
                dialogFormVisible: false,
                form: {
                    name: '',
                    level:'',
                    type:'',
                    objectType:''
                },
                formLabelWidth: '120px',
                dialogFormVisible1: false,
                awardList: [],
                // 分页
                totalCount: 0,
                currentPage: 1,
                pageSize: 20,
                ids: [],
                levelOptions: [],
                typeOptions:[]
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
                        if (res.status === 0 && res.success){
                            that.levelOptions = res.data.dictionaryInfoList;
                        }
                        return that.$message.error("获取奖项等级列表出错："+res.message);
                    })
                    .catch(function (err) {
                        console.log(err);
                        that.$message.error('请求奖项等级列表出错');
                    });
            },
            getTypeOptions(){
                let that = this;
                this.$get('/api/dic/selectByCode?code=awardsType')
                    .then(function (res) {
                        if (res.status === 0){
                            return that.typeOptions = res.data.dictionaryInfoList;
                        }
                        return that.$message.error("获取奖项类型列表出错："+res.message);
                    })
                    .catch(function (err) {
                        console.log(err);
                        that.$message.error('请求奖项类型列表出错');
                    });
            },
            awardsChange(rows) {
                console.log(rows);
                this.$router.push({ path: '/awards/add', query: { awardsObj: JSON.stringify(rows) } });
            },
            // 查看
            handleClick(row) {
                this.$router.push({ path: '/awards/product', query: { awards: JSON.stringify(row) } });
            },
            //   表格
            handleSelectionChange(val) {
                this.selectList = val;
                for (let i in val){
                    this.ids.push(val[i].id)
                }
            },
            onUploadSuccess(response,file){
                if (response.success && response.status === 0){
                    return this.$message.success(response.message)
                }
                return  this.$message.error(response.message)
            },
            onUploadError(){
                this.$message.error("导入出错")
            },
            // 分页
            handleSizeChange(val) {
                this.pageSize = val;
                this.getAwardList({pageSize: val});
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAwardList({pageNo: val});
            },
            // 查询
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
                if (this.form.beginTime){
                    data.beginTime = this.form.beginTime;
                }
                if (this.form.endTime){
                    data.endTime = this.form.endTime;
                }
                data.pageNo = 1;
                this.getAwardList(data);
            },
            exportFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error("至少选择一个奖项");
                }
                let fileName = "奖项库导出"+ (new Date()).valueOf();
                let data = this.ids.join(',');
                this.$message.success("正在下载...请稍后");
                getDownloadFunc('br/api/awardsManage/exportFile?fileName=' + fileName + '&ids='+data,fileName);
            },
            downloadTemplate(){
                let fileName = "奖项库导出模板"+ (new Date()).valueOf();
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
            // 获取奖项库列表
            getAwardList(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.currentPage;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                data.type = data.type ? data.type : 0;
                if (this.form.name !== '') {
                    data.name = this.form.name;
                }
                this.$post('/api/awardsManage/findAwards',data)
                    .then(res => {
                        if (res.data != null) {
                            res.data.result.forEach(item => {
                                // item.isAwards=item.isAwards==1?'有':'无'
                                // item.isSensitive=item.isSensitive==1?'是':'否'
                            });
                            this.awardList = res.data.result;
                            this.totalCount = res.data.totalCount;
                        } else {
                            this.awardList = [];
                            this.totalCount = 0;
                        }
                    });
            }
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
                margin-top: 10px;
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

<template>
    <div>
        <div class="tag-box">
            <!-- 筛选条件 -->
            <div class="search-box font-14">
                <el-row>
                    <el-form ref="form" :inline="true" v-model="screen">
                        <el-form-item label="作者：">
                            <el-input v-model="screen.author" style="width: 150px" clearable size="medium"
                                      placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="国家/地区：">
                            <el-select @change="countryChange" clearable filterable size="medium" v-model="country"
                                       placeholder="请选择">
                                <el-option v-for="item in countrys" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="州/省：">
                            <el-select @change="provinceChange" clearable filterable size="medium" v-model="province"
                                       placeholder="请选择">
                                <el-option v-for="item in provinces" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="城市：">
                            <el-select size="medium" clearable filterable v-model="city"
                                       placeholder="请选择">
                                <el-option v-for="item in citys" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否敏感：">
                            <el-select size="medium" v-model="screen.isSensitive" clearable
                                       placeholder="请选择">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出生时间：">
                            <el-date-picker
                                v-model="screen.birthBeginYear"
                                type="year"
                                size="medium"
                                format="yyyy"
                                value-format="yyyy"
                                style="width:120px"
                                clearable
                                placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="至"></el-form-item>
                        <el-form-item>
                            <el-date-picker
                                v-model="screen.birthEndYear"
                                type="year"
                                size="medium"
                                format="yyyy"
                                value-format="yyyy"
                                style="width:120px"
                                clearable
                                placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search" size="medium">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <!-- 表格 -->
            <div class="tag-con">
                <el-row class="row">
                    <el-col :span="22">
                        <el-button @click="writerAdd" size="small" type="primary">新增</el-button>
                        <el-button size="small" @click="dialogFormVisible = true" type="primary">作者归一</el-button>
                        <el-button size="small" @click="writerProductShow" type="primary">关联产品</el-button>
                        <el-upload
                            style="display: inline-block;margin-left: 10px;margin-right: 10px"
                            action="http://59.108.111.18:8080/br/api/author/importFile"
                            :headers="{'x-access-token':xAccessToken}"
                            :on-success="onUploadSuccess"
                            :on-error="onUploadError">
                            <el-button size="small" type="primary">导入</el-button>
                        </el-upload>
                        <el-button size="small" type="primary" @click="exportFunc">导出</el-button>
                        <el-button size="small" @click="remove" type="primary">删除</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button size="small" type="primary" :plain="true" @click="downloadTemplate"
                                   style="float:right;">导入模板下载
                        </el-button>
                    </el-col>
                </el-row>
                <!-- 表格 -->
                <el-table
                    ref="multipleTable"
                    :data="writerList"
                    stripe
                    tooltip-effect="dark"
                    border
                    highlight-current-row
                    style="width: 100%"
                    header-row-class-name="table-head"
                    @row-dblclick="writerChange"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="author"
                        label="责任人姓名"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="alias"
                        label="别名"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="coding"
                        label="编码"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="country"
                        label="国家"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="province"
                        label="洲/省"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="city"
                        label="城市"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="birthYear"
                        label="出生年份"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="diedYear"
                        label="去世年份"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="isAwards"
                        label="是否有获奖作品"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="isSensitive"
                        label="是否敏感"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="affiliation"
                        label="从属关系"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="lastModifier"
                        label="最后修改人"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="updateDate"
                        label="修改时间"
                        show-overflow-tooltip>
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
        <!-- 弹框 -->
        <el-dialog title="作者归一" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="form">
                <el-form-item label="选择归一作者:" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer pop-foot">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="writerOne">保存</el-button>
            </div>
        </el-dialog>
        <!-- 关联作品 -->
        <el-dialog width="90%" :title="'作者：'+ selectAuthor" :visible.sync="dialogIs">
            <el-row class="row" style="margin-bottom:30px;">
                <el-button @click="remove_confirm(1)" size="medium" type="primary">确认关联</el-button>
                <el-button @click="remove_confirm(2)" size="medium" type="primary">删除关联</el-button>
            </el-row>
            <el-table
                ref="multipleTable"
                :data="productList"
                stripe
                height="300"
                tooltip-effect="dark"
                border
                highlight-current-row
                style="width: 100%"
                header-row-class-name="table-head"
                @selection-change="handleProSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    type="index"
                    label="序号"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="isbn"
                    label="isbn"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="bookName"
                    label="主书名"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="secondName"
                    label="副书名"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="seriesName"
                    label="丛书名"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="seriesNumber"
                    label="丛书卷号"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="publishers"
                    label="出版社"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="personLiable"
                    label="责任人"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="pubDate"
                    label="出版日期"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="language"
                    label="语种"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="是否已关联"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.status === 0 ? '未关联' : '已关联'}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import { getDownloadFunc } from '../func';

    export default {
        data() {
            return {
                xAccessToken: localStorage.getItem('token'),
                input3: '',
                select: '',
                input: '',
                value: '',
                value1: '',
                options: [{
                    value: '1',
                    label: '是'
                }, {
                    value: '2',
                    label: '否'
                }],
                countrys: [],
                country: '',
                provinces: [],
                province: '',
                citys: [],
                city: '',
                // 查询条件
                screen: {
                    author: '',
                    birthBeginYear: '',
                    birthEndYear: '',
                    affiliation: '',
                    isSensitive: ''
                },
                writerList: [],
                selectList: [],
                ids: [],
                totalCount: 0,
                currentPage: 1,
                pageSize: 20,
                dialogFormVisible: false,
                form: {
                    name: '',
                },
                formLabelWidth: '120px',
                dialogFormVisible1: false,
                formInline: {
                    name: ''
                },
                selectAuthor: '',
                dialogIs: false,
                productList: []
            };
        },
        created() {
            this.getWriterList();
            this.getAddressList({ level: 1, parentId: '' });
        },
        methods: {
            onUploadSuccess(response) {
                let message = response.message;
                if (response.data.length > 0 && !response.success) {
                    message += '：' + response.data[0];
                }
                if (response.success && response.status === 0) {
                    return this.$message.success(response.message);
                }
                return this.$message.error(message);
            },
            onUploadError(response) {
                this.$message.error(response.message);
            },
            // 新增
            writerAdd() {
                this.$router.push({ path: '/author/add' });
            },
            // 删除
            remove() {
                let ids = [];
                this.selectList.forEach(item => {
                    ids.push(item.id);
                });
                this.$post('/api/author/deleteAuthor?ids=' + ids.join(','), { ids: ids.join(',') })
                    .then(res => {
                        this.$message(res.message);
                        this.getWriterList();
                    });
            },
            // 关联产品
            writerProductShow() {
                if (this.selectList.length < 1) {
                    return this.$message.error('请选择一位作者');
                }
                this.selectAuthor = this.selectList[this.selectList.length - 1].author;
                this.dialogIs = true;
                this.getProductList(this.selectAuthor);
            },
            // 作者修改
            writerChange(rows) {
                this.$router.push({ path: '/author/add', query: { writerObj: JSON.stringify(rows) } });
            },
            // 作者归一
            writerOne() {
                if (this.selectList.length === 0) {
                    this.$message('请选择要归一的作者');
                    return false;
                }
                this.dialogFormVisible = false;
                let ids = [];
                this.selectList.forEach(item => {
                    ids.push(item.id);
                });
                let that = this;
                this.$post('/api/author/unification', { author: this.form.name, ids: ids })
                    .then(res => {
                        that.$message({
                            type: 'success',
                            message: res.message,
                            onClose: function () {
                                that.getWriterList();
                            }
                        });
                    });
            },
            //   表格
            handleSelectionChange(val) {
                this.selectList = val;
                for (let i in val) {
                    this.ids.push(val[i].id);
                }
            },
            handleProSelectionChange(val) {
                this.selectList = val;
            },
            // 分页
            handleSizeChange(val) {
                this.pageSize = val;
                this.getWriterList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getWriterList();
            },
            // 查询
            search() {
                this.getWriterList();
            },
            // 国家切换
            countryChange(val) {
                this.getAddressList({ level: 2, parentId: val });
            },
            // 省份切换
            provinceChange(val) {
                this.getAddressList({ level: 3, parentId: val });
            },
            // 获取地区列表
            // data  {level:1,parentId:""}
            getAddressList(data) {
                this.$get('/api/region/findRegions', data)
                    .then(res => {
                        if (data.level === 1) {
                            this.countrys = res.data;
                            this.provinces = [];
                            this.citys = [];
                            if (res.data.length > 0) {
                                this.getAddressList({ level: 2, parentId: res.data[0].id });
                            }
                        } else if (data.level === 2) {
                            this.provinces = res.data;
                            this.citys = [];
                            if (res.data.length > 0) {
                                this.getAddressList({ level: 3, parentId: res.data[0].id });
                            }
                        } else if (data.level === 3) {
                            this.city = '';
                            this.citys = res.data;
                        }
                    });
            },
            // 获取列表
            getWriterList() {
                let data = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                };
                for (const key in this.screen) {
                    if (this.screen[key]) {
                        data[key] = this.screen[key];
                    }
                }
                if (this.country !== '') {
                    data.country = this.countrys.filter(item => item.id === this.country)[0].name;
                }
                if (this.province !== '') {
                    data.province = this.provinces.filter(item => item.id === this.province)[0].name;
                }
                if (this.city !== '') {
                    data.city = this.citys.filter(item => item.id === this.city)[0].name;
                }
                if (data.isSensitive) {
                    data.isSensitive = parseInt(data.isSensitive);
                }
                this.$post('/api/author/selAuthors', data)
                    .then(res => {
                        if (res.data != null) {
                            res.data.result.forEach(item => {
                                item.isAwards = item.isAwards == 1 ? '有' : '无';
                                item.isSensitive = item.isSensitive == 1 ? '是' : '否';
                            });
                            this.writerList = res.data.result;
                            this.totalCount = res.data.totalCount;
                        } else {
                            this.writerList = [];
                            this.totalCount = 0;
                        }
                    });
            },
            exportFunc() {
                if (this.selectList.length < 1) {
                    return this.$message.error('至少选择一个作者');
                }
                let fileName = '作者导出' + (new Date()).valueOf();
                let data = this.ids[0];
                this.$message.success('正在下载...请稍后');
                getDownloadFunc('br/api/author/exportFile?fileName=' + fileName + '&id=' + data, fileName);
            },
            downloadTemplate() {
                let fileName = '作者导入模板导出' + (new Date()).valueOf();
                this.$message.success('正在下载...请稍后');
                getDownloadFunc('br/api/author/importTemplate', fileName);
            },
            remove_confirm(type) {
                if (this.selectList.length < 1) {
                    this.$message.error('请选择作品');
                    return false;
                }
                let list = [];
                for (let i in this.selectList) {
                    list.push({ isbn: this.selectList[i].isbn, personLiable: this.selectAuthor, status: type });
                }
                const gData = JSON.parse(JSON.stringify(list));
                let apiUrl = type === 1 ? '/api/author/addRelevance' : '/api/author/deleteRelevance';
                let that = this;
                this.$post(apiUrl, gData)
                    .then(res => {
                        if (res.success) {
                            that.$message.success(res.message);
                            that.dialogIs = false;
                            that.getWriterList();
                        } else {
                            return that.$message.error(res.message);
                        }
                    })
            },
            getProductList(writer) {
                this.$post('/api/author/selPersonLiable?personLiable=' + writer, { personLiable: writer })
                    .then(res => {
                        if (res.data != null) {
                            res.data.result.forEach(item => {
                                item.isAwards = item.status == 1 ? '是' : '否';
                            });
                            this.productList = res.data.result;
                            this.totalCount = res.data.totalCount;
                        } else {
                            this.productList = [];
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

    .fl {
        float: left;
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

    .lable-width {
        width: 100%;
    }

    .pop-foot {
        display: flex;
        justify-content: space-around;
    }

    .w150 {
        width: 150px;
    }

    .w120 {
        width: 120px;
    }

    .w100 {
        width: 100px;
    }

    .w80 {
        width: 80px;
    }

    .w60 {
        width: 60px;
    }

    .left-tips {
        line-height: 10px;
    }
</style>

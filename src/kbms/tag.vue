<template>
    <div>
        <el-row>
            <div class="tag-box">
                <div class="search-box">
                    <div>
                        <span>拼音索引</span> <span @click="pingying(-1)"
                                                :class="pingyingIndex==-1?'span-active':''">全部</span>
                        <span @click="pingying(index)" :class="pingyingIndex==index?'span-active':''"
                              v-for="(item,index) in list" :key="index">{{item}}</span>
                    </div>
                    <div class="option-box">
                        <el-input placeholder="请输入内容" v-model="screen.name" class="input-with-select">
                            <el-select v-model="screen.status" slot="prepend" placeholder="请选择">
                                <el-option label="启用" value="1"></el-option>
                                <el-option label="停用" value="2"></el-option>
                            </el-select>
                            <el-button @click="search" type="primary" slot="append">搜索</el-button>
                        </el-input>
                    </div>
                </div>
                <div class="tag-con">
                    <el-row style="margin-bottom: 10px">
                        <el-col :span="20">
                            <el-button size="small" @click="addModalIs = true" type="primary">新建</el-button>
                            <el-button size="small" @click="statusChange(2)" type="primary">停用</el-button>
                            <el-button size="small" @click="statusChange(1)" type="primary">启用</el-button>
                            <el-button size="small" type="primary" @click="exportFunc">导出</el-button>
                            <el-button size="small" @click="remove" type="primary">删除</el-button>
                        </el-col>
                    </el-row>
                    <!-- 表格 -->
                    <el-table
                        ref="multipleTable"
                        :data="tagList"
                        stripe
                        tooltip-effect="dark"
                        highlight-current-row
                        style="width: 100%"
                        :header-cell-style="{background:'#e6f0f6',color:'#606266'}"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="标签名称"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="状态"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="creator"
                            label="创建用户"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="createTime"
                            label="创建时间"
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
                                   hide-on-single-page
                                   :total="totalCount">
                    </el-pagination>

                </div>
            </div>
        </el-row>
        <!-- 弹框 -->
        <el-dialog title="新建" :visible.sync="addModalIs" width="20%">
            <el-form :model="form">
                <el-form-item label="新建:" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer pop-foot">
                <el-button @click="addModalIs = false">取 消</el-button>
                <el-button type="primary" @click="tagAdd">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getDownloadFunc } from './func';

    export default {
        name: 'tag',
        data() {
            return {
                list: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
                pingyingIndex: -1,
                tagList: [],
                selectTagList: [],
                // 分页
                totalCount: 0,
                currentPage: 1,
                pageSize: 20,

                addModalIs: false,
                form: {
                    name: '',
                },
                formLabelWidth: '80px',
                // 筛选
                screen: {
                    pinying: '',
                    name: '',
                    status: ''
                },
                ids: []

            };
        },
        created() {
            this.getTagList();
        },
        methods: {
            //   表格
            handleSelectionChange(val) {
                this.selectTagList = val;
                this.ids = [];
                for (let i in val) {
                    this.ids.push(val[i].id);
                }
            },
            // 分页
            handleSizeChange(val) {
                this.pageSize = val;
                this.getTagList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getTagList();
            },
            // 拼音查询
            pingying(index) {
                this.pingyingIndex = index;
                this.screen.pinying = index == -1 ? '' : this.list[index];
                this.getTagList();
            },
            // 搜索
            search() {
                this.getTagList();
            },
            // 新增
            tagAdd() {
                this.$post('/api/tag/add?name=' + this.form.name, { name: this.form.name })
                    .then(res => {
                        this.addModalIs = false;
                        this.$message(res.message);
                        this.form.name = '';
                        this.getTagList();
                    });
            },
            // 状态修改
            statusChange(status) {
                let ids = [];
                this.selectTagList.forEach(item => {
                    ids.push(item.id);
                });
                this.$post('/api/tag/status?ids=' + ids.join(',') + '&status=' + status)
                    .then(res => {
                        this.$message(res.message);
                        this.getTagList();
                    });
            },
            // 删除
            remove() {
                let ids = [];
                this.selectTagList.forEach(item => {
                    ids.push(item.id);
                });
                this.$post('/api/tag/delete?ids=' + ids.join(','), { ids: ids.join(',') })
                    .then(res => {
                        this.$message(res.message);
                        this.getTagList();
                    });
            },
            // 查询
            getTagList() {
                let data = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,

                };
                for (const key in this.screen) {
                    if (this.screen[key]) {
                        data[key] = this.screen[key];
                    }
                }

                this.$post('/api/tag/find', data)
                    .then((res) => {
                        if (res.data != null) {
                            res.data.result.forEach(item => {
                                item.status = item.status == 1 ? '启用' : '停用';
                            });
                            this.tagList = res.data.result;
                            this.totalCount = res.data.totalCount;
                        } else {
                            this.tagList = [];
                            this.totalCount = 0;
                        }

                    });
            },
            exportFunc() {
                if (this.ids.length < 1) {
                    return this.$message.error('至少选择一个');
                }
                let fileName = '标签导出' + (new Date()).valueOf();
                let data = this.ids.join(',');
                this.$message.success('正在下载...请稍后');
                getDownloadFunc('br/api/tag/export?ids=' + data, fileName);
            }
        },
    };
</script>

<style lang="scss" scoped>
    .tag-box {
        background: #F1F4F5;

        .search-box {
            padding: 30px;
            background: #fff;

            span {
                margin-right: 10px;
                cursor: pointer;
                color: #666666;
            }

            .span-active {
                color: #409EFF
            }

            .option-box {
                width: 700px;
                margin-top: 20px;
            }
        }

        .tag-con {
            margin-top: 30px;
            background: #fff;
            padding: 10px;
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

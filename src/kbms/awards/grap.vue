<template>
    <div>
        <div class="tag-box">
            <div class="tag-con">
                <el-row class="row">
                    <el-col :span="21">
                        <el-button size="medium"  type="primary">导入书单</el-button>
                        <el-button @click="dialogFormVisible=true" size="medium" type="primary">确认关联</el-button>
                        <el-button size="medium" type="primary">删除关联</el-button>
                        <el-button size="medium" type="primary">清空</el-button>
                    </el-col>
                    <el-col :span="3"><el-button size="medium">导入模板下载</el-button></el-col>
                </el-row>
                <!-- 表格 -->
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    stripe
                    height="300"
                    tooltip-effect="dark"
                    border
                    highlight-current-row
                    style="width: 100%"
                    header-row-class-name="table-head"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="tag"
                        label="奖项名称"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="checked"
                        label="奖项等级"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="奖项类型"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="获奖对象类型"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="获奖时间"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="获奖人/组织"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="关联作品"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="date"
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
                               :current-page="currentPage4"
                               :page-sizes="[100, 200, 300, 400]"
                               :page-size="100"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="400">
                </el-pagination>

            </div>
        </div>
        <!-- 弹框 -->
        <el-dialog title="确认关联"  :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="选择奖项:" :label-width="formLabelWidth">
                    <el-select v-model="value"  class="screen-item" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer pop-foot">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'tag',
        data(){
            return {
                input3: '',
                select: '',

                input:"",
                value:"",
                value1:"",
                options: [],
                tableData: [],
                currentPage4:2,
                dialogFormVisible:false,
                form: {
                    name: '',
                },
                formLabelWidth: '120px',

                dialogFormVisible1:false
            }
        },
        created() {
        },
        methods: {
            // 新增
            monthlyAdd(){
                this.$router.push({path:"/monthly/add"})
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
            },
            // 查看
            handleClick(row) {
                this.$router.push({path:"/monthly/product"})
            },

            // 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }


        }
    }
</script>

<style lang="scss" scoped>
    .tag-box{
        background: #F1F4F5;
        // padding: 30px;
        .search-box{
            padding: 30px;
            background: #fff;
            span{
                margin-right: 10px;
            }
            .option-box{
                width:700px;
                margin-top: 20px;
            }
            .screen-box{
                padding-bottom: 20px;
            }
            .screen{
                display: flex;
                align-items: center;
                .screen-item{
                    flex: 1;
                }
            }
        }
        .tag-con{
            margin-top: 30px;
            background: #fff;
            padding: 30px;
            .row{
                padding-bottom: 30px;
            }
            /deep/ .table-head th{
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
    .pop-foot{
        display: flex;
        justify-content: space-around;
    }
</style>

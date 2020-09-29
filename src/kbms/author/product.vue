<template>
    <div>
        <!-- 关联作品 -->
        <el-dialog width="90%" title="作者：张三" :visible.sync="dialogIs">
            <el-row class="row" style="margin-bottom:30px;">
                <el-button @click="remove_comfirm(1)" size="medium" type="primary">确认关联</el-button>
                <el-button @click="remove_comfirm(2)" size="medium" type="primary">删除关联</el-button>
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
                @selection-change="handleSelectionChange">
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
                    prop="checked"
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
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                dialogIs: false,
                productList: [],
                selectList: [],
                writer: {}
            };
        },
        created() {

        },
        methods: {
            hide() {
                this.dialogIs = false;
            },
            show(writer) {
                console.log(writer);
                this.writer = writer;
                this.dialogIs = true;
                this.$post('/api/author/selPersonLiable?personLiable=' + writer.author, { personLiable: writer.author })
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
            },
            // 删除   确认
            remove_comfirm(type) {
                if (this.selectList == 0) {
                    this.$message('请选择作品');
                    return false;
                }
                let list = [];
                this.selectList.forEach(item => {
                    list.push({
                        isbn: item.isbn,
                        personLiable: this.writer.author,
                    });
                });
                let data = {
                    relevanceDaoList: list
                };
                this.$post(type == 1 ? '/api/author/addRelevance' : '/api/author/deleteRelevance', data)
                    .then(res => {
                        this.$message(res.message);
                        this.show(this.writer);
                    });
            },
            handleSelectionChange(val) {
                this.selectList = val;
            },
        }
    };
</script>
<style>
</style>

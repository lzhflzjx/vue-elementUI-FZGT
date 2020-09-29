<template>
    <div>
        <el-row :gutter="22">
            <el-col :span="24" class="m-top">
                <el-header class="bg-white" style="padding-top: 10px;height: auto;overflow:hidden;">
                    <el-form :inline="true" :model="form" class="demo-form-inline">
                        <el-form-item label="审核结果">
                            <el-select v-model="form.region" size="small" placeholder="审核结果">
                                <el-option label="审核结果" value="shanghai"></el-option>
                                <el-option label="审核结果" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="刊号">
                            <el-input v-model="form.user" size="small" placeholder="刊号"></el-input>
                        </el-form-item>
                        <el-form-item label="刊名">
                            <el-input v-model="form.user" size="small" placeholder="刊名"></el-input>
                        </el-form-item>
                        <el-form-item label="ISSN">
                            <el-input v-model="form.user" size="small" placeholder="ISSN"></el-input>
                        </el-form-item>
                        <el-form-item label="审读员">
                            <el-input v-model="form.user" size="small" placeholder="审读员"></el-input>
                        </el-form-item>
                        <el-form-item label="敏感报道类型">
                            <el-input v-model="form.user" size="small" placeholder="敏感报道类型"></el-input>
                        </el-form-item>
                        <el-form-item label="一审人员意见">
                            <el-select v-model="form.region" size="small" placeholder="审读人">
                                <el-option label="审读人" value="shanghai"></el-option>
                                <el-option label="审读人" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出版时间">
                            <el-date-picker
                                v-model="form.start_time"
                                type="date"
                                size="small"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="至">
                            <el-date-picker
                                v-model="form.end_time"
                                type="date"
                                size="small"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="审读时间">
                            <el-date-picker
                                v-model="form.start_time"
                                type="date"
                                size="small"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="至">
                            <el-date-picker
                                v-model="form.end_time"
                                type="date"
                                size="small"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="form.user" size="small" placeholder="敏感报道类型"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchFunc">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-header>
                <el-main class="bg-white m-top">
                    <el-row style="margin-bottom: 10px">
                        <el-col :span="22">
                            <el-button type="primary"
                                       size="medium"
                                       @click="$router.push({path:'/pressReading/add'})">单条新增
                            </el-button>
                            <el-button type="primary"
                                       size="medium"
                                       @click="batchDialog = true">批量新增
                            </el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" size="medium">导出</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-table
                            :data="tableData"
                            :header-cell-style="{background:'#e6f0f6',color:'#606266'}"
                            style="width: 100%">
                            <el-table-column
                                prop="date"
                                label="图书中文译名"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="ISBN"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="出版社">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="出版社国家/地区">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="作则">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="出版年代">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="审读结果">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="审读员">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="审读时间">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="敏感报道类型">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="一审人员意见">
                            </el-table-column>
                            <el-table-column
                                label="操作">
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-main>
                <el-footer class="bg-white">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="1"
                        :page-sizes="[100, 200, 300, 400]"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="100">
                    </el-pagination>
                </el-footer>
            </el-col>
        </el-row>
        <el-dialog title="收货地址" :visible.sync="batchDialog">
            <el-form :model="batchForm">
                <el-form-item label="上传附件：" :label-width="formLabelWidth" required>
                    <el-input type="file" v-model="batchForm.name" size="small" style="width: 300px"></el-input>
                    <a href="">批量模板</a>
                </el-form-item>
                <el-form-item label="上传文件说明：" :label-width="formLabelWidth" style="color: #666666">
                    <ol style="margin: 0;margin-left: 10px;padding: 0;color: #A8A8A8">
                        <li style="margin: 0;padding: 0;">请下载批量模板，填写后上传</li>
                        <li style="margin: 0;padding: 0">文件名、内容格式需严格按照已定标准，否则无法正确导入</li>
                    </ol>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="batchDialog = false">取 消</el-button>
                <el-button type="primary" @click="batchDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data(){
            return{
                batchDialog: false,
                formLabelWidth: '120px',
                form:{},
                batchForm:{},
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        created() {

        },
        methods:{
            handleSizeChange(){

            },
            handleCurrentChange(){

            },
            searchFunc(){

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

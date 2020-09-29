<template>
    <div>
        <el-row :gutter="22">
            <el-col :span="24" class="m-top">
                <el-header class="bg-white" style="padding-top: 10px;height: auto;overflow:hidden;">
                    <el-form :inline="true" :model="form" class="demo-form-inline">
                        <el-form-item label="图书中文译名">
                            <el-input v-model="form.user" size="small" placeholder="图书中文译名"></el-input>
                        </el-form-item>
                        <el-form-item label="ISBN">
                            <el-input v-model="form.user" size="small" placeholder="ISBN"></el-input>
                        </el-form-item>
                        <el-form-item label="作者">
                            <el-input v-model="form.user" size="small" placeholder="作者"></el-input>
                        </el-form-item>
                        <el-form-item label="出版社名称">
                            <el-select v-model="form.region" size="small" placeholder="出版社名称">
                                <el-option label="出版社名称" value="shanghai"></el-option>
                                <el-option label="出版社名称" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出版社国家/地区">
                            <el-input v-model="form.user" size="small" placeholder="出版社国家/地区"></el-input>
                        </el-form-item>
                        <el-form-item label="审读人">
                            <el-select v-model="form.region" size="small" placeholder="审读人">
                                <el-option label="审读人" value="shanghai"></el-option>
                                <el-option label="审读人" value="beijing"></el-option>
                            </el-select>
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
                        <el-form-item label="敏感报道类型">
                            <el-select v-model="form.region" size="small" placeholder="敏感报道类型">
                                <el-option label="敏感报道类型" value="shanghai"></el-option>
                                <el-option label="敏感报道类型" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审读结果">
                            <el-select v-model="form.region" size="small" placeholder="审读结果">
                                <el-option label="审读结果" value="shanghai"></el-option>
                                <el-option label="审读结果" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="一审人员意见">
                            <el-select v-model="form.region" size="small" placeholder="一审人员意见">
                                <el-option label="一审人员意见" value="shanghai"></el-option>
                                <el-option label="一审人员意见" value="beijing"></el-option>
                            </el-select>
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
                                       @click="$router.push({path:'/entityReading/add'})">新建
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
    </div>
</template>

<script>
    export default {
        name: 'index',
        data(){
            return{
                form:{},
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

<template>
    <div>
        <div class="tag-box">
            <div class="search-box font-14">
                <el-row class="screen-box">
                    <el-form ref="form" :inline="true" v-model="form">
                        <el-form-item label="书号：">
                            <el-input v-model="form.isbn" clearable size="small" style="width:150px"></el-input>
                        </el-form-item>
                        <el-form-item label="出版社：">
                            <el-input v-model="form.publisher" clearable size="small" style="width:150px"></el-input>
                        </el-form-item>
                        <el-form-item label="奖项名称：">
                            <el-input v-model="form.name" clearable size="small" style="width:150px"></el-input>
                        </el-form-item>
                        <el-form-item label="奖项时间：">
                            <el-date-picker
                                v-model="form.beginTime"
                                value-format="yyyy-MM-dd"
                                size="small"
                                style="width:150px"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="至"></el-form-item>
                        <el-form-item>
                            <el-date-picker
                                v-model="form.endTime"
                                value-format="yyyy-MM-dd"
                                size="small"
                                style="width:150px"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="search" type="primary" size="small">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="search" type="primary" size="small">导出</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="search" type="primary" size="small" :plain="true">清空</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

            </div>
            <!-- 表格 -->
            <div class="tag-con">
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
                        prop="isbn"
                        label="ISBN"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="level"
                        label="主书名"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="奖项名称"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="objectType"
                        label="奖项等级"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="获奖类型"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="author"
                        label="获奖对象类型"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="author"
                        label="获奖时间"
                        show-overflow-tooltip>
                    </el-table-column>
                </el-table>
                <el-pagination style="margin-top:30px;"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="pageNo"
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
export default {
    name: 'checklist',
    data(){
        return{
            form:{},
            pageSize:20,
            pageNo:1,
            totalCount:0,
            awardList:[]
        }
    },
    methods:{
        handleSizeChange(e){
            this.getList({pageSize: e})
        },
        handleCurrentChange(e){
            this.getList({pageNo: e})
        },
        awardsChange(e){

        },
        handleSelectionChange(e){

        },
        search(){

        },
        getList(data = {}){
            data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
            data.pageSize = data.pageSize ? data.pageSize : this.pageSize;

        }
    }
}
</script>

<style lang="scss" scoped>
#checklist{

}
</style>

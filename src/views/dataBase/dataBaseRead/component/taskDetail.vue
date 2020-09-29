<template>
    <div id='taskDetail'>
        <el-card>
            <info ref="info"></info>
        </el-card>
        <el-card class="searchDiv">
            <div>类型：
                <el-checkbox v-model="typeCheckAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="searchQuery.type" @change="handlecheckedTypesChange">
                    <el-checkbox v-for="type in types" :label="type.value" :key="type.value">{{type.name}}</el-checkbox>
                </el-checkbox-group>
            </div>
            <div>是否包含图片：
                <el-radio-group v-model="searchQuery.isHaveImage">
                    <el-radio :label="0">全部</el-radio>
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </div>
            <div>命中关键词数量：
                <el-input size="mini" v-model="searchQuery.start" @keyup.native="searchQuery.start=searchQuery.start.replace(/[^\d]/g,'')"></el-input>
                 至 <el-input size="mini" v-model="searchQuery.end" @blur="checkEnd" @keyup.native="searchQuery.end=searchQuery.end.replace(/[^\d]/g,'')"></el-input>
            </div>
            <div>
                <span>审读员：
                    <el-select v-model="searchQuery.reviewUser" multiple collapse-tags size="small">
                        <el-option
                        v-for="item in reader"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </span>
                <span class="ml20">文字审读结果：
                    <el-select v-model="searchQuery.textReviewResult" size="small">
                        <el-option
                            v-for="obj in textOptions"
                            :key="obj.value"
                            :label="obj.name"
                            :value="obj.value">
                        </el-option>
                    </el-select>
                </span>
                <span class="ml20">图片审读结果：
                    <el-select v-model="searchQuery.imageReviewResult" size="small">
                        <el-option
                            v-for="obj in imgOptions"
                            :key="obj.value"
                            :label="obj.name"
                            :value="obj.value">
                        </el-option>
                    </el-select>
                </span>
                <el-button class="ml20" size="small" type="primary" @click="getList">搜索</el-button>
            </div>
        </el-card>
        <div class="cont">
            <div class="btn">
                <el-checkbox v-model="checkedAll" @change="handleCheckedAll" style="margin-right:10px;">全选</el-checkbox>
                <el-button size="small" type="primary" @click="allocation">文章分配</el-button>
            </div>
            <el-table
                v-loading='loading'
                ref="multipleTable" :data="tableData" border
                size="medium" height="740" style="width:100%;"
                @sort-change='sortChange'
                @row-dblclick='openDetail'
                :row-style="rowClass"
                :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    fixed="left"
                    width="45">
                </el-table-column>
                <el-table-column
                    v-for="item in columnData"
                    :key="item.prop"
                    :width="item.width"
                    :label="item.label"
                    :prop="item.prop"
                    :sortable='item.sortable'>
                    <template slot-scope="scope">
                        <span v-if="item.prop=='type'">{{methods.changeDict(types,scope.row.type)}}</span>
                        <span v-else-if="item.prop=='imageReviewStatus'">{{methods.changeDict(imgOptions,scope.row.imageReviewStatus)}}</span>
                        <span v-else-if="item.prop=='textReviewStatus'">{{methods.changeDict(textOptions,scope.row.textReviewStatus)}}</span>
                        <span v-else-if="item.prop=='imageTotal'">{{scope.row.imageTotal>0?'是':'否'}}</span>
                        <span v-else>{{scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin-top:10px;"
                v-show="tableData.length>0"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchQuery.pageNo"
                :page-sizes="[20,40,60,80,100]"
                :page-size="searchQuery.pageSize"
                layout="total, prev, pager, next,sizes"
                :total="curTotal">
            </el-pagination>
        </div>

        <el-dialog append-to-body title="文章分配" :visible.sync="allocationDialog" width="800px">
            <allocation ref="allocation" :taskData='taskList' :taskTotleNum='curTotal' :checkedAll='checkedAll' :searchParams='searchQuery' @closeDialog='closeDialog'></allocation>
        </el-dialog>

        <el-dialog append-to-body title="文章详情" @close="search()" :visible.sync="detailDialog" width="1200px">
            <bookDetail v-if="detailDialog" ref="bookDetail"></bookDetail>
        </el-dialog>
    </div>
</template>

<script>
import info from './taskInfo'
import allocation from './allocation'
import bookDetail from './bookDetail'
import {mapActions,mapGetters} from 'vuex'
export default {
    data(){
        return {
            loading:false,
            searchQuery:{
                type:[1],
                isHaveImage:1,
                start:'',
                end:'',
                reviewUser:[],
                textReviewResult:1,
                imageReviewResult:1,
                pageNo:1,
                pageSize:20,
            },
            curTotal:0,
            typeCheckAll: false,
            types:[
                {name:'图书',value:1},
                {name:'报刊',value:2},
                {name:'博客',value:3},
                {name:'网络文章',value:4},
                {name:'其他',value:5},
            ],
            textOptions:[
                {value:'',name:'全部'},
                {value:0,name:'待处理'},
                {value:1,name:'通过'},
                {value:2,name:'不通过'},
            ],
            imgOptions:[
                {value:'',name:'全部'},
                {value:0,name:'待处理'},
                {value:1,name:'通过'},
                {value:2,name:'不通过'},
                {value:3,name:'无图片'},
            ],
            tableData:[],
            multipleSelection:[],
            checkedAll:false,
            columnData:[
                {prop:"type",label:"类型",width:""},
                {prop:"publicationName",label:"出版物",width:""},
                {prop:"identity_in_site",label:"ID",width:""},
                {prop:"title",label:"标题",width:""},
                {prop:"imageTotal",label:"是否包含图片",width:""},
                {prop:"hitKeyWordsTotal",label:"关键词数量",width:"",sortable:'custom'},
                {prop:"reviewUserName",label:"审读员",width:""},
                {prop:"imageReviewStatus",label:"图片审读结果",width:""},
                {prop:"textReviewStatus",label:"文字审读结果",width:""},
            ],
            allocationDialog:false,
            detailDialog:false,
            taskList:[]
        }
    },
    components:{
       info,allocation,bookDetail
    },
    computed:{
        ...mapGetters(['reader'])
    },
    methods: {
        ...mapActions(['getReaderList']),
        rowClass({ row, rowIndex }) {
            let isCheck=false
            this.multipleSelection.forEach(item=>{
                if (row.identity_in_site==item.identity_in_site) {
                    isCheck=true
                }
            })
            if (isCheck) {
                return { "background": "#cbe6fb" };
            }
        },
        closeDialog(){
            this.allocationDialog=false;
        },
        checkEnd(){
            if (this.searchQuery.end<=this.searchQuery.start) {
                this.searchQuery.end=''
                this.$message.warning('关键词数量范围后者需大于前者')
            }
        },
        sortChange(column){
            this.searchQuery.sortName=column.prop
            this.searchQuery.sort=column.order=='descending'?'desc':'asc'
            this.getList()
        },
        openDetail(data){
            this.detailDialog=true;
            this.$nextTick(()=>{
                this.$refs.bookDetail.init(data)
            })
        },
        handleSelectionChange(val){
            this.multipleSelection=val;
        },
        allocation(){
            if (this.multipleSelection.length>0) {
                this.taskList=[];
                let existHaveRead=false;
                this.multipleSelection.forEach(item=>{
                    if (item.imageReviewStatus!=0&&item.textReviewStatus!=0) {
                        existHaveRead=true
                    }
                    this.taskList.push(item.identity_in_site)
                })
                if (existHaveRead) {
                    this.$message.warning('已审读的任务不可再分配');
                    return
                }
                this.allocationDialog=true;
                this.$nextTick(()=>{
                    this.$refs.allocation.init()
                })
            }else{
                this.$message.warning('请选择任务');
            }
        },
        handleCheckedAll(data){
            if (this.multipleSelection.length!=this.tableData.length||!data) {
                this.$refs.multipleTable.toggleAllSelection()
            }
        },
        getList(){
            this.searchQuery.pageNo=1;
            this.searchQuery.pageSize=20;
            this.search()
        },
        search(){
            this.loading=true;
            this.$post('/api/databaseCheck/queryInfo',this.searchQuery).then(res=>{
                this.loading=false;
                if (res.data.result&&res.data.result.length>0) {
                    this.tableData=res.data.result
                }else{
                    this.tableData=[];
                }
                this.curTotal=res.data.totalCount
                if (this.checkedAll) {
                    this.$refs.multipleTable.toggleAllSelection()
                }
            }).catch(err=>{
                this.tableData=[];
                this.loading=false;
            })
        },
        init(id){
            this.initData()
            this.$refs.info.getDetail(id);
            this.getReaderList('book');
            this.searchQuery.taskId=id;
            this.getList()
        },
        initData(){
            this.searchQuery.type=[1]
            this.searchQuery.isHaveImage=1
            this.searchQuery.start=''
            this.searchQuery.end=''
            this.searchQuery.reviewUser=[]
            this.searchQuery.textReviewResult=1
            this.searchQuery.imageReviewResult=1
            this.searchQuery.pageNo=1
            this.searchQuery.pageSize=20
            this.checkedAll=false
            this.typeCheckAll=false
        },
        handleCheckAllChange(val) {
            let all=[];
            this.types.forEach(item => {
                all.push(item.value)
            });
            this.searchQuery.type = val ? all : [];
        },
        handlecheckedTypesChange(value) {
            let checkedCount = value.length;
            this.typeCheckAll = checkedCount === this.types.length;
        },
        handleSizeChange(val){
            this.searchQuery.pageSize=val;
            this.search()
        },
        handleCurrentChange(val){
            this.searchQuery.pageNo=val;
            this.search()
        },
    }
}
</script>
<style lang='scss' scoped>
#taskDetail{
    .el-card{
        margin-bottom: 20px;
    }
    .searchDiv{
        line-height:40px;
        .el-checkbox-group{
            display:inline-block;
            margin-left:10px;
        }
        .el-input{
            width: 80px;
        }
        .el-select{
            width: 160px;
        }
        .ml20{
            margin-left: 20px;
        }
    }
    .cont{
        padding:0 10px;
        .btn{
            margin-bottom: 20px;
            padding-left:15px;
        }
    }
}
</style>

<template>
    <div id="sourceData">
        <el-row :gutter="10">
            <el-col :span="4">
                <div class="tree-menu" style="margin: 10px;overflow:hidden;">
                    <el-button size="small" type="primary" style="width:80px" @click="addCategory">分类</el-button>
                    <el-button size="small" :plain="true" class="fr">编辑分类</el-button>
                </div>
                <el-tree :data="data" :props="defaultProps" style="height: 729px;" @node-click="handleNodeClick"></el-tree>
            </el-col>
            <el-col :span="20">
                <el-row class="bg-white search-options-conditions">
                    <el-col :span="3">
                        <p class="search-tips">搜索条件：</p>
                    </el-col>
                    <div class="search-options">
                        <el-col :span="2">
                            <el-select v-model="sensitiveValue" class="search-select fl" size="medium" filterable clearable
                                       placeholder="敏感等级">
                                <el-option
                                    v-for="sen in sensitiveData"
                                    :key="sen.value"
                                    :label="sen.label"
                                    :value="sen.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2">
                            <el-select v-model="sourceValue" class="search-select fl" size="medium" filterable clearable
                                       placeholder="来源">
                                <el-option
                                    v-for="item in sourceData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2">
                            <el-select v-model="typeValue" class="search-select fl" size="medium" filterable clearable
                                       placeholder="类型">
                                <el-option
                                    v-for="item in typeData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2">
                            <el-select v-model="languagesValue" class="search-select fl" size="medium" filterable clearable
                                       placeholder="语种">
                                <el-option
                                    v-for="item in languagesData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2">
                            <el-select v-model="stateValue" class="search-select fl" size="medium" filterable clearable
                                       placeholder="状态">
                                <el-option
                                    v-for="item in stateData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2">
                            <el-select v-model="scopeValue" class="search-select fl" size="medium" filterable clearable
                                       placeholder="检测范围">
                                <el-option
                                    v-for="item in scopeData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2">
                            <el-select v-model="groupValue" class="search-select fl" size="medium" filterable clearable
                                       placeholder="群组">
                                <el-option
                                    v-for="item in groupData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-input v-model="searchInput" size="medium" class="search-input fl"
                                      placeholder="请输入搜索内容"></el-input>
                        </el-col>
                        <el-col :span="2" class="fr">
                            <el-button size="medium" type="primary" class="search-submit">搜索</el-button>
                        </el-col>
                    </div>
                </el-row>
                <el-row class="bg-white">
                    <el-row class="top-menu bg-white" style="margin:10px;overflow:hidden;">
                        <el-col :span="2">
                            <el-button size="small" type="primary" class="top-menu-button fl">新建</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="small" type="primary" class="top-menu-button fl">导入</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="small" type="primary" class="top-menu-button fl">导出</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="small" type="primary" class="top-menu-button fl">群组</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="small" type="primary" class="top-menu-button fl">停用</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="small" type="primary" class="top-menu-button fl">删除</el-button>
                        </el-col>
                        <el-col :span="2" class="fr">
                            <el-button size="small" type="primary" :plain="true">导入检测范围</el-button>
                        </el-col>

                    </el-row>
                    <el-table
                        :data="tableData"
                        tooltip-effect="dark"
                        ref="multipleTable"
                        max-height="720"
                        stripe
                        style="width: 100%;font-size: 12px;height: 100%;">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            prop="key"
                            label="敏感词">
                        </el-table-column>
                        <el-table-column
                            prop="sensitiveLevel"
                            label="敏感等级">
                        </el-table-column>
                        <el-table-column
                            prop="sensitiveQuestion"
                            label="敏感问题">
                        </el-table-column>
                        <el-table-column
                            prop="source"
                            label="来源">
                        </el-table-column>
                        <el-table-column
                            prop="languages"
                            label="语种">
                        </el-table-column>
                        <el-table-column
                            prop="types"
                            label="类型">
                        </el-table-column>
                        <el-table-column
                            prop="state"
                            label="状态">
                        </el-table-column>
                        <el-table-column
                            prop="scopes"
                            label="图书检测范围">
                            <template slot="scope">
                                <!--<span>{{ scope.row }}</span>--> 
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="详细">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <el-row class="bg-white">
                    <el-col :span="24" class="pagination">
                        <el-pagination
                            class="source-pagination"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[100, 200, 300, 400]"
                            :page-size="100"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="400">
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                currentPage:1,
                data: [{
                    id:1,
                    label: '第一个第一层',
                    children: [{
                        id:7,
                        label: '第一个第二层 1-1',
                        children: [{
                            id:8,
                            label: '第一个第三层 1-1-1'
                        }]
                    }]
                }, {
                    id:2,
                    label: '第二个第一层',
                    children: [{
                        id:4,
                        label: '第二个第二层 2-1',
                        children: [{
                            id:9,
                            label: '第二个第三层 2-1-1'
                        }]
                    }, {
                        id:5,
                        label: '第二个第二层 2-2',
                        children: [{
                            id:10,
                            label: '第二个第三层 2-2-1'
                        }]
                    }]
                }, {
                    id:3,
                    label: '第三个第一层',
                    children: [{
                        id:6,
                        label: '第三个第二层 3-1',
                        children: [{
                            id:11,
                            label: '第三个第三层 3-1-1'
                        }]
                    }, {
                        id:13,
                        label: '第三个第二层 3-2',
                        children: [{
                            id:12,
                            label: '第三个第三层 3-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                sensitiveData: [
                    {
                        id: 1,
                        label: '等级1',
                        value: 0
                    }, {
                        id: 2,
                        label: '等级2',
                        value: 1
                    }
                ],
                sourceData: [
                    {
                        id: 1,
                        label: '来源1',
                        value: 0
                    }, {
                        id: 2,
                        label: '来源2',
                        value: 1
                    }
                ],
                typeData: [
                    {
                        id: 1,
                        label: '类型1',
                        value: 0
                    }, {
                        id: 2,
                        label: '类型2',
                        value: 1
                    }
                ],
                languagesData: [
                    {
                        id: 1,
                        label: '语种1',
                        value: 0
                    }, {
                        id: 2,
                        label: '语种2',
                        value: 1
                    }
                ],
                stateData: [
                    {
                        id: 1,
                        label: '状态1',
                        value: 0
                    }, {
                        id: 2,
                        label: '状态2',
                        value: 1
                    }
                ],
                scopeData: [
                    {
                        id: 1,
                        label: '范围1',
                        value: 0
                    }, {
                        id: 2,
                        label: '范围2',
                        value: 1
                    }
                ],
                groupData: [
                    {
                        id: 1,
                        label: '群组1',
                        value: 0
                    }, {
                        id: 2,
                        label: '群组2',
                        value: 1
                    }
                ],
                tableData: [
                    {
                        id: 1,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: 'wiki',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 2,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '百科',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 3,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '知乎',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 4,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '百科',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 1,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: 'wiki',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 2,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '百科',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 3,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '知乎',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 4,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '百科',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 4,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '百科',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 1,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: 'wiki',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 2,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '百科',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 3,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '知乎',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },{
                        id: 4,
                        key: '敏感词',
                        sensitiveLevel: 1,
                        sensitiveQuestion: '涉黄',
                        source: '百科',
                        languages: '中文',
                        types: '类型？',
                        state: '成功',
                        scopes: ['主书名','从书名','副书名','简介']
                    },
                ],
                sensitiveValue: '',
                sourceValue: '',
                typeValue: '',
                languagesValue: '',
                stateValue: '',
                scopeValue: '',
                groupValue: '',
                searchInput: ''
            };
        },
        created(){
            this.leftmenuheight = window.innerHeight +'px';
            console.log(this.leftmenuheight)
        },
        mounted() {
        },
        methods: {
            addCategory(){
                this.$router.push({path:'/sensitiveCategory'})
            },
            handleClick(data){
                console.log(data)
            },
            handleNodeClick(e){
                console.log(e)
            },
            handleSizeChange(){

            },
            handleCurrentChange(){

            }
        },
    };
</script>
<style lang="scss" scoped>
    .fr {
        float: right;
    }

    .fl {
        float: left;
    }

    .bg-white {
        background: #ffffff;
    }
    .search-tips{
        padding-left: 10px;
        color: #333333;
    }
    .search-select{
        height: auto;
        overflow: hidden;
        margin-left:10px;
        margin-right: 10px;
        border: purple;
    }

    .search-input{
        margin-left: 20px;
    }
    .search-options{
        height: auto;
        margin-top: 8px;
    }
    .pagination{
        padding: 10px;
    }
</style>

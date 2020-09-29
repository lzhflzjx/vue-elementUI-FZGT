<template>
    <div>
        <el-row :gutter="10" class="bg-white">
            <el-col :span="5" :offset="1" class="left-menu">
                <el-tabs v-model="activeName" type="border-card" :stretch="true" @tab-click="handleClick"
                         class="left-tab">
                    <el-tab-pane label="业务分类1" name="first" class="left-menu-item">
                        <el-tree
                            :data="oneData"
                            :props="defaultProps"
                            ref="tree"
                            node-key="id"
                            :highlight-current="true"
                            @check-change="handleOneNodeClick"
                            @node-click="oneNodeClick"
                            show-checkbox
                        ></el-tree>
                    </el-tab-pane>
                    <el-tab-pane label="业务分类2" name="second">
                        <el-tree
                            :data="twoData"
                            :props="defaultProps"
                            ref="twotree"
                            node-key="id"
                            :highlight-current="true"
                            @check-change="handleTwoNodeClick"
                            @node-click="twoNodeClick"
                            show-checkbox
                        ></el-tree>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="5" :offset="1" class="border left-menu">
                <el-select v-model="selectCategory" @change="listenChange" placeholder="选择分类" class="right-menu">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        class="right-menu-item"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-tree
                    :data="threeData"
                    :props="defaultProps"
                    ref="threetree"
                    node-key="id"
                    :highlight-current="true"
                    @check-change="handleThreeNodeClick"
                    @node-click="threeNodeClick"
                    show-checkbox
                    :check-strictly="true"
                    :default-checked-keys="disabledCheckedIds"
                ></el-tree>
            </el-col>
            <el-col :span="6" :offset="2" class="mt60">
                <div class="button-box">
                    <el-row class="mt30">
                        <el-button type="primary" size="medium" @click="confirmFunc" :disabled="associated">建立关联</el-button>
                    </el-row>
                    <el-row class="mt30">
                        <el-button type="primary" size="medium" @click="relevanceFunc" :disabled="isDelete">删除关联</el-button>
                    </el-row>
                    <el-row class="mt30">
                        <el-button type="primary" size="medium" @click="$router.push({name:'taxonomyMap'})">&nbsp;&nbsp;映射表&nbsp;&nbsp;</el-button>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
            <el-col :span="24" class="bg-white">
                <div style="height: 80px"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { setCategoryMenu } from '../func';

    export default {
        name: 'zhongtu',
        data() {
            return {
                activeName: 'first',
                oneData: [],
                twoData: [],
                threeData: [],
                options: [
                    {
                        id: 3,
                        label: '业务分类1',
                        value: 3
                    }, {
                        id: 4,
                        label: '业务分类2',
                        value: 4
                    }, {
                        id: 5,
                        label: '中图分类',
                        value: 5
                    }, {
                        id: 6,
                        label: 'Dewey',
                        value: 6
                    }, {
                        id: 7,
                        label: 'BASIC',
                        value: 7
                    }, {
                        id: 8,
                        label: 'BIC',
                        value: 8
                    }, {
                        id: 9,
                        label: 'LC',
                        value: 9
                    }, {
                        id: 10,
                        label: 'NDC',
                        value: 10
                    }
                ],
                selectCategory: 5,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                pageNo: 1,
                pageSize: 100,
                leftCategory: 0,
                rightCategory: 0,
                mappingData: {
                    sortMappingId: '',//映射id
                    type: 3,//基本分类: 3:业务分类1、4:业务分类2、5:中图分类法、6:Dewey、7:BASIC、8:BIC、9:LC、10:NDC
                    sortId: '', //id
                    mappingType: 5, //映射分类: 3:业务分类1、4:业务分类2、5:中图分类法、6:Dewey、7:BASIC、8:BIC、9:LC、10:NDC
                },
                oldThreeData:[],
                disabledCheckedIds:[],
                isDelete: true, //是否可删除,
                deleteId: '',
                associated:true
            };
        },
        created() {
            this.listOneData();
            this.listTwoData();
            this.listThreeData();
        },
        methods: {
            listOneData(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                data.type = 3;
                let that = this;
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.oneData = setCategoryMenu(res.data.result);
                        }
                    })
            },
            listTwoData(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                data.type = 4;
                let that = this;
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.twoData = setCategoryMenu(res.data.result);
                        }
                    })
            },
            listThreeData(data = {}) {
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                data.type = parseInt(this.selectCategory);
                let that = this;
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            that.oldThreeData = setCategoryMenu(res.data.result);
                            return that.threeData = setCategoryMenu(res.data.result);
                        }
                    })
            },
            listenChange(){
                this.listThreeData();
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            handleOneNodeClick(data,checked,node) {
                if (checked === true){
                    this.$refs.tree.setCheckedNodes([data]);
                    this.leftCategory = data.id;
                    this.mappingData.sortId = data.id;
                    this.mappingData.type = 3;
                    this.findSortRelation();
                }
            },
            oneNodeClick(data,checked,node){
                this.$refs.tree.setCheckedNodes([data]);
                this.leftCategory = data.id;
            },
            handleTwoNodeClick(data,checked,node) {
                if (checked === true){
                    this.$refs.twotree.setCheckedNodes([data]);
                    this.leftCategory = data.id;
                    this.mappingData.sortId = data.id;
                    this.mappingData.type = 4;
                    this.findSortRelation();
                }
            },
            twoNodeClick(data,checked,node){
                this.$refs.twotree.setCheckedNodes([data]);
                this.leftCategory = data.id;
            },
            handleThreeNodeClick(data,checked,node) {

                this.rightCategory  = checked ? data.id : '';
                this.associated = this.leftCategory && this.rightCategory ? false : true;
                this.isDelete = this.leftCategory && this.rightCategory && data.flag === 1 ? false : true;
            },
            threeNodeClick(data,checked,node){
                // this.$refs.threetree.setCheckedNodes([data]);
                // this.rightCategory = data.id;
                if (checked.checked === true){
                    this.deleteId = data.id;
                    this.isDelete = true;
                }else{
                    this.deleteId = '';
                    this.isDelete = false;
                }
            },
            confirmFunc(){
                if (!this.leftCategory) {
                    return this.$message.error('请选择分类');
                }
                if (!this.rightCategory) {
                    return this.$message.error('请选择映射分类');
                }
                let data = JSON.stringify([
                    {
                        sortId: this.leftCategory,
                        mappingSortId: this.rightCategory
                    }
                ]);
                let that = this;
                this.$requrestAxios.post('/br/api/sortRelationManage/insertSortRelation', data,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (res) {
                        if (res.data.success && res.data.status === 0) {
                            that.listOneData();
                            that.listTwoData();
                            that.listThreeData();
                            return that.$message.success(res.data.message);
                        }
                        return that.$message.error(res.data.message);
                    })
            },
            relevanceFunc(){
                let data = JSON.stringify({
                    ids:[this.deleteId]
                });
                let that = this;
                this.$requrestAxios.post('/br/api/sortRelationManage/deleteRelation', data,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (res) {
                        if (res.data.success && res.data.status === 0) {
                            that.listOneData();
                            that.listTwoData();
                            that.listThreeData();
                            that.disabledCheckedIds = [];
                            return that.$message.success(res.data.message);
                        }
                        return that.$message.error(res.data.message);
                    })
            },
            findSortRelation() {
                let sortMappingId = this.mappingData.sortMappingId;
                let type = this.mappingData.type;
                let mappingType = this.selectCategory;
                let sortId = this.mappingData.sortId;
                let that = this;
                let apiBaseUrl = '/api/sortManage/sortSynList';
                let apiUrl = '';
                if (this.mappingData.sortMappingId){
                    apiUrl = apiBaseUrl+'?sortMappingId=' + sortMappingId + '&type=' + type + '&sortId=' + sortId + '&mappingType=' + mappingType;
                }else{
                    apiUrl = apiBaseUrl+'?type=' + type + '&sortId=' + sortId + '&mappingType=' + mappingType;
                }
                this.$post(apiUrl)
                    .then(function (res) {
                        let checkedIds = res.data.result;
                        that.disabledCheckedIds = [];
                        if (checkedIds.length > 0){
                            for (let a in checkedIds){
                                if (checkedIds[a].flag === 1){
                                    that.disabledCheckedIds.push(checkedIds[a].id);
                                }
                            }
                        }
                    })
            }
        }
    };
</script>

<style scoped>
    .bg-white {
        background: #ffffff;
        height: auto;
        overflow: hidden;
    }

    .border {
        border: 1px solid #f1f1f1;
    }

    .mt60 {
        margin-top: 60px;
    }
    .mt30 {
        margin-top: 30px;
    }
    .button-box{
        width: 100px;
        height: auto;
        overflow: hidden;
        margin-top: 10%;
        margin-bottom: 2%;
    }
    .left-menu {
        margin-top: 60px;
        margin-bottom: 60px;
    }

    .left-tab {
        padding: 0;
        margin: 0;
    }

    .left-menu-item {
        background: #2d8cf0;
        color: #ffffff;
    }
</style>

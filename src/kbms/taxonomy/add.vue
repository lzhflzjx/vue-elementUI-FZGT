<template>
    <div>
        <el-row>
            <el-button-group style="margin-top: 4px;margin-bottom: 10px">
                <el-button type="primary" :plain="parentTypes === 3 ? false : true" size="medium" @click="checkedTypeFunc(3,'业务分类1')">业务分类1</el-button>
                <el-button type="primary" :plain="parentTypes === 4 ? false : true" size="medium" @click="checkedTypeFunc(4, '业务分类2')">业务分类2</el-button>
                <el-button type="primary" :plain="parentTypes === 5 ? false : true" size="medium" @click="checkedTypeFunc(5, '中图分类')">中图分类</el-button>
                <el-button type="primary" :plain="parentTypes === 6 ? false : true" size="medium" @click="checkedTypeFunc(6, 'Dewey')">Dewey</el-button>
                <el-button type="primary" :plain="parentTypes === 7 ? false : true" size="medium" @click="checkedTypeFunc(7, 'BASIC')">BASIC</el-button>
                <el-button type="primary" :plain="parentTypes === 8 ? false : true" size="medium" @click="checkedTypeFunc(8, 'BIC')">BIC</el-button>
                <el-button type="primary" :plain="parentTypes === 9 ? false : true" size="medium" @click="checkedTypeFunc(9, 'LC')">LC</el-button>
                <el-button type="primary" :plain="parentTypes === 10 ? false : true" size="medium" @click="checkedTypeFunc(10, 'NDC')">NDC</el-button>
            </el-button-group>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button style="width:100%;margin-bottom: 10px" size="medium" type="primary" :plain="true">{{ checkedTypeName }}</el-button>
                <el-tree :data="data"
                         :props="defaultProps"
                         style="height: 729px;"
                         ref="tree"
                         node-key="id"
                         :highlight-current="true"
                         @check-change="handleNodeClick"
                         @node-click="nodeClick"
                         :check-strictly="true"
                ></el-tree>
            </el-col>
            <el-col :span="20" class="bg-white">
                <el-col :span="12" :offset="6" style="margin-top: 20px;">
                    <el-form ref="form" v-model="form" label-width="80px">
                        <el-form-item label="分类名称">
                            <el-input v-model="form.sortName"></el-input>
                        </el-form-item>
                        <el-form-item label="分类号">
                            <el-input v-model="form.sortNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="分类描述">
                            <el-input v-model="form.sortDescribe" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-col :span="12" :offset="6">
                                <el-button size="medium" @click="$router.go(-1)">取消</el-button>
                                <el-button size="medium" type="primary" @click="onSubmit">保存</el-button>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
        </el-row>
        <el-row :offset="10">
            <el-col :span="24" class="bg-white" style="margin-top: 10px">
                <div style="height: 80px"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { setCategoryMenu } from '../func';

    export default {
        name: 'addSensitiveCategory',
        data() {
            return {
                parentTypes:3,
                form: {
                    sortDescribe: "",
                    sortName: "",
                    sortIerarchy: 1,
                    sortNumber: "",
                    parentId: 0
                },
                checkedTypeName:"业务分类1",
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [],
            };
        },
        created(){
            this.leftCategory();
            let paramData = this.$route.params;
            if (JSON.stringify(paramData) !== '{}'){
                this.form = {
                    id: paramData.id,
                    sortDescribe: paramData.sortDescribe,
                    sortName: paramData.sortName,
                    sortIerarchy: paramData.sortIerarchy,
                    sortNumber: paramData.sortNumber,
                    parentId: paramData.parentId
                }
            }
        },
        methods:{
            checkedTypeFunc(type, name){
                this.parentTypes = parseInt(type);
                this.checkedTypeName = name;
                this.leftCategory();
            },
            leftCategory(data = {}){
                data.pageNo = data.pageNo ? data.pageNo : this.pageNo;
                data.pageSize = data.pageSize ? data.pageSize : this.pageSize;
                data.type = this.parentTypes;
                let that = this;
                this.$post('/api/sortManage/findListByPraentId', data).then(function (res) {
                    if (res.success && res.status === 0){
                        return that.data = setCategoryMenu(res.data.result);
                    }
                    return that.$message.error(res.message);
                })
            },
            onSubmit(){
                if (!this.form.sortName){
                    return this.$message.error("请填写分类名称");
                }
                if (!this.form.sortNumber){
                    return this.$message.error("请填写分类号");
                }
                this.form.type = this.parentTypes;
                let that = this;
                let apiUrl = this.form.id ? '/api/sortManage/updateSort' : '/api/sortManage/insertSort';
                this.$post(apiUrl, this.form).then(function (res) {
                    if (res.success && res.status === 0){
                        return that.$message({
                            message: res.message,
                            type: 'success',
                            onClose: function () {
                                if (that.form.id){
                                    return that.$router.go(-1)
                                }
                                that.$router.push({path:'/taxonomy'});
                            }
                        })
                    }
                    return that.$message.error(res.message);
                })
            },
            handleNodeClick(data,checked,node) {
                if (checked === true){
                    this.$refs.tree.setCheckedNodes([data]);
                    this.form.parentId = data.id;
                    this.findLevel(data.id);
                }
            },
            nodeClick(data,checked,node){
                this.$refs.tree.setCheckedNodes([data]);
                this.form.parentId = data.id;
            },
            findLevel(id) {
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].children !== null) {
                        for (let o = 0; o < this.data[i].children.length; o++) {
                            if (this.data[i].children[o].id === id) {
                                this.form.sortIerarchy = 2;
                            }
                            if (this.data[i].children[o].children !== null) {
                                for (let p = 0; p < this.data[i].children[o].children.length; p++) {
                                    if (this.data[i].children[o].children[p].id === id) {
                                        this.form.sortIerarchy = 3;
                                    }
                                }
                            }
                        }
                    }
                }
            },
        }
    };
</script>

<style scoped>
.bg-white{
    background: #ffffff;
}
</style>

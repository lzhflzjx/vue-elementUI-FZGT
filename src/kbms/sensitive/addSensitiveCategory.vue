<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button style="width:100%;margin-bottom: 10px" size="medium" type="primary" :plain="true">敏感词分类
                </el-button>
                <el-tree :data="data"
                         :props="defaultProps"
                         empty-text="暂无数据" style="height: 100%;min-height: 600px"
                         ref="tree"
                         node-key="id"
                         show-checkbox
                         :highlight-current="true"
                         @check-change="handleNodeClick"
                         @node-click="nodeClick"
                         :default-expanded-keys="expanded"
                         :default-checked-keys="[form.parentId]"
                ></el-tree>
            </el-col>
            <el-col :span="20" class="bg-white">
                <el-col :span="12" :offset="6" style="margin-top:10%;min-height: 508px">
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
                                <el-button size="medium" @click="cancels">取消</el-button>
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
                form: {
                    sortName: '',
                    sortNumber: '',
                    sortDescribe: '',
                    parentId: '',
                    sortIerarchy: 1,
                    type: 1,
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [],
                expanded: [],
                selectParentId: ''
            };
        },
        created() {
            let paramData = this.$route.params;
            if (JSON.stringify(paramData) !== '{}') {
                this.form = {
                    id: paramData.id,
                    sortName: paramData.sortName,
                    sortNumber: paramData.sortNumber,
                    sortDescribe: paramData.sortDescribe,
                    parentId: paramData.parentId.toString(),
                    sortIerarchy: paramData.sortIerarchy,
                    type: paramData.type,
                };
            }
            this.categoryList();
        },
        methods: {
            categoryList(data = {}) {
                let that = this;
                data.type = data.type ? data.type : 1;
                data.pageNo = data.pageNo ? data.pageNo : 1;
                data.pageSize = data.pageSize ? data.pageSize : 100;
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        that.menuLoading = false;
                        that.data = setCategoryMenu(res.data.result);
                        let parentId = parseInt(that.form.parentId);
                        for (let i in that.data) {
                            if (that.data[i].id === parentId){
                                that.expanded.push(that.data[i].id);
                            }
                            if (that.data[i].children) {
                                for (let j in that.data[i].children) {
                                    if (that.data[i].children[j].id === parentId){
                                        that.expanded.push(that.data[i].id);
                                        that.expanded.push(that.data[i].children[j].parentId);
                                        if (that.data[i].children[j].children){
                                            for (let y in that.data[i].children[j].children){
                                                that.expanded.push(that.data[i].id);
                                                that.expanded.push(that.data[i].children[j].children[y].parentId);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        that.menuLoading = false;
                    });
            },
            onSubmit() {
                if (!this.form.sortName || this.form.sortName === undefined) {
                    return this.$message.error('请填写分类名称');
                }
                if (!this.form.sortNumber || this.form.sortNumber === undefined) {
                    return this.$message.error('请填写分类号');
                }
                let apiUrl = this.form.id ? '/api/sortManage/updateSort' : '/api/sortManage/insertSort';
                let messages = this.form.id ? '修改中...' : '创建中...';
                const addLoading = this.$loading({
                    lock: true,
                    text: messages,
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let that = this;
                this.$post(apiUrl, this.form)
                    .then(function (res) {
                        addLoading.close();
                        if (res.status !== 0) {
                            return that.$message.error(res.message);
                        }
                        return that.$message({
                            message: res.message,
                            type: 'success',
                            onClose: function () {
                                return that.$router.go(-1);
                            }
                        });
                    })
                    .catch(function (err) {
                        addLoading.close();
                    });
            },
            handleNodeClick(data, checked, node) {
                if (checked === true) {
                    this.$refs.tree.setCheckedNodes([data]);
                    this.form.parentId = data.id;
                    this.form.sortIerarchy = 2;
                }
            },
            nodeClick(data, checked, node) {
                this.$refs.tree.setCheckedNodes([data]);
                this.form.parentId = data.id;
                this.form.sortIerarchy = 2;
            },
            cancels() {
                this.$router.go(-1);
            }
        }
    };
</script>

<style scoped>
    .bg-white {
        background: #ffffff;
    }
</style>

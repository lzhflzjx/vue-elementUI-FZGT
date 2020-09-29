<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button style="width:100%;margin-bottom: 10px" size="medium" type="primary" :plain="true">敏感图片分类</el-button>
                <el-tree :data="data" :props="defaultProps" style="height: 729px;" @node-click="handleNodeClick"></el-tree>
            </el-col>
            <el-col :span="20">
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
                                <el-button size="medium">取消</el-button>
                                <el-button size="medium" type="primary" @click="onSubmit">保存</el-button>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'addSensitiveCategory',
        data() {
            return {
                form: {
                    sortName:'',
                    sortNumber:'',
                    sortDescribe:'',
                    type: 2,
                    sortIerarchy:1,
                    parentId: 0,
                },
                pageNo:1,
                pageSize: 100,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [],
            };
        },
        created(){
            this.category();
        },
        methods:{
            category() {
                let that = this;
                let data = {
                    type: 2,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                };
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        that.menuLoading = false;
                        let menuData = res.data.result;
                        for (let i in menuData) {
                            let menuObj = {
                                id: menuData[i].id,
                                label: menuData[i].sortName,
                                children: []
                            };
                            that.data.push(menuObj);
                        }
                    })
                    .catch(function (error) {
                        that.menuLoading = false;
                    });
            },
            onSubmit(){
                if (!this.form.sortName){
                    return this.$message.error("请天禧分类名称");
                }
                if (!this.form.sortNumber){
                    return this.$message.error("请天禧分类号");
                }
                let that = this;
                this.$post('/api/sortManage/insertSort',this.form).then(function (res) {
                    console.log(res);
                    if (res.success && res.status === 0){
                        return that.$message({
                            type:'success',
                            message: res.message,
                            onClose:function () {
                                that.$router.go(0)
                            }
                        })
                    }
                    return that.$message.error(res.message);
                });
            },
            handleNodeClick(e){
                this.form.parentId = e;
            }
        }
    };
</script>

<style scoped>

</style>

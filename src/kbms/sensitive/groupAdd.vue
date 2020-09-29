<template>
    <div>
        <el-row class="bg-white">
            <el-col :span="6" :offset="9" style="margin-top: 10%;height: 600px">
                <el-form ref="form" v-model="form" label-width="80px">
                    <el-form-item label="群组名称">
                        <el-input v-model="groupName"></el-input>
                    </el-form-item>
                    <el-form-item label="群组说明">
                        <el-input v-model="groupDescribe" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="12" :offset="6">
                            <el-button size="medium" @click="cancels">取消</el-button>
                            <el-button size="medium" type="primary" @click="onSubmit">保存</el-button>
                        </el-col>
                    </el-form-item>
                </el-form>
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
    export default {
        name: 'groupAdd',
        data() {
            return {
                groupName: '',
                groupDescribe:'',
                id: 0,
                form: {}
            }
        },
        created(){
            let editData = this.$route.params;
            if (editData){
                this.groupName = editData.groupName;
                this.groupDescribe = editData.groupDescribe;
                this.id = editData.id;
            }
        },
        methods:{
            onSubmit(){
                if (!this.groupName || this.groupName === ''){
                    this.$message.error("请填写群组名称");
                }
                if (!this.groupDescribe || this.groupDescribe === ''){
                    return this.$message.error("请填写群组说明");
                }
                let data  = {
                    groupName: this.groupName,
                    groupDescribe: this.groupDescribe
                }
                let api = '/api/sensitiveWordGroup/insertSensitiveWordGroup';
                console.log(parseInt(this.id));
                if(this.id && parseInt(this.id) !== 0){
                    data.id = this.id;
                    api = '/api/sensitiveWordGroup/updateSensitiveWordGroup';
                }
                let that = this;
                this.$post(api, data)
                    .then(function (res) {
                        if (res.status === 0){
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.$router.push({path:'/sensitive/groupList'})
                                }
                            });
                        }
                        that.$message.error(res.message)

                    })
            },
            cancels(){
                this.$router.go(-1)
            }
        }
    };
</script>

<style scoped>
    .bg-white{
        background: #ffffff;
    }
</style>

<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="page-top">编辑</div>
            </el-col>
            <el-col :span="24" class="bg-white">
                <el-row>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-col :span="14" class="border-right">
                            <el-row>
                                <el-col :span="16" :offset="4">
                                    <el-image
                                        src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                                        fit="fill"
                                    ></el-image>
                                    <p class="demonstration"><i class="el-icon-delete"></i></p>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="名称" required>
                                <el-input v-model="form.name" size="medium"></el-input>
                            </el-form-item>
                            <el-form-item label="敏感等级" required>
                                <el-select v-model="value" placeholder="请选择">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="类型" required>
                                <el-select v-model="value" placeholder="请选择">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="分类" required>
                                <el-row class="border">
                                    <el-col :span="20" :offset="2" class="pdn bg-blue-small">三级</el-col>
                                    <el-col :span="20" :offset="2" class="pdn br">
                                        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input type="textarea" :rows="4" resize="none"></el-input>
                            </el-form-item>
                            <el-form-item label="来源图书">
                                <label >来自这个图书</label>
                            </el-form-item>
                            <el-form-item>
                                <el-row>
                                    <el-col :span="12"><el-button size="medium">取消</el-button></el-col>
                                    <el-col :span="12">
                                        <el-button type="primary" class="ml-20" size="medium" @click="onSubmit">保存</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'add',
        data() {
            return {
                fits: ['fill', 'fill', 'fill', 'fill', 'fill', 'fill', 'fill', 'fill', 'fill', 'fill', 'fill', 'fill'],
                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                value: ''
            };
        },
        created() {

        },
        methods:{
            handleNodeClick(data) {
                console.log(data);
            },
            onSubmit(){
                console.log(1111)
            }
        }
    };
</script>

<style scoped>
    .bg-white {
        background: #ffffff;
    }

    .page-top {
        background: rgb(225, 239, 254);
        height: 40px;
        line-height: 40px;
        color: rgb(75, 163, 255);
        padding-left: 10px;
    }

    .upload-button {
        width: 90px;
        height: 90px;
        border: 1px dashed #2d8cf0;
        color: #2d8cf0;
        line-height: 90px;
        text-align: center;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        font-size: 2rem;
    }

    .border{
        border: 1px solid #f1f1f1;
    }
    .pdn{
        padding: 0;
        margin: 0;
    }
    .border-right {
        border-right: 1px dashed #2d8cf0;
        padding-right: 20px;
    }

    .bg-white {
        padding: 20px;
    }

    .demonstration {
        text-align: center;
        color: #2d8cf0;
        cursor: pointer;
    }

    .image-box {
        padding: 10px;
        overflow: hidden;
        position: relative;
    }
    .bg-blue {
        width: 100%;
        background: rgb(217, 236, 255);
        padding: 10px;
        color: #409EFF;
    }

    .bg-blue-small{
        width: 100%;
        height: 30px;
        background: rgb(217, 236, 255);
        color: #409EFF;
        /*margin-top:10px;*/
        text-align: center;
        line-height: 30px;
    }
    .ml-20{
        margin-left: 20px;
    }
</style>

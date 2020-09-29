<template>
    <div>
        <div class="con">
            <div class="con-title">编辑/新增</div>
            <el-row class="el-row">
                <!-- 表单 -->
                <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-row>
                        <el-col :push="4" :span="8">
                            <el-form-item label="榜单名称" prop="rankingListName">
                                <el-input v-model="ruleForm.rankingListName"></el-input>
                            </el-form-item>
                            <el-form-item label="信源" prop="site">
                                <el-select v-model="ruleForm.site" placeholder="请选择">
                                    <el-option
                                        v-for="item in valOption[1]"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.name"
                                    ></el-option>
                                </el-select>
                                <!-- <el-input v-model="ruleForm.name"></el-input> -->
                            </el-form-item>
                        </el-col>
                        <el-col :push="4" :span="8">
                            <el-form-item label="发榜时间" prop="collectionTime">
                                <el-date-picker
                                    v-model="ruleForm.collectionTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="date"
                                    placeholder="选择日期"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item label="榜单类型" prop="rankingListCollectionType">
                                <el-select v-model="ruleForm.rankingListCollectionType" placeholder="请选择">
                                    <el-option
                                        v-for="item in valOption[0]"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                                <!-- <el-input v-model="ruleForm.name"></el-input> -->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :push="4" :span="16">
                            <el-form-item label="简介" prop="introduce">
                                <el-input type="textarea" v-model="ruleForm.introduce"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col :push="8" :span="2">
                    <el-button size="medium" @click="$router.go(-1)">取消</el-button>
                </el-col>
                <el-col :push="10" :span="2">
                    <el-button type="primary" size="medium" @click="submitForm('ruleForm')">保存</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: 'tag',
        data() {
            return {
                ruleForm: {
                    collectionTime: null, //采集时间
                    introduce: null, //简介
                    rankingListCollectionType: null, //榜单类型
                    rankingListName: null, //榜单名称
                    site: null, //信源
                    rankingListCreateType: 1 //创建类型
                },
                rules: {
                    rankingListName: [
                        { required: true, message: '请输入榜单名称', trigger: 'blur' }
                        //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
                    ],
                    collectionTime: [
                        { required: true, message: '请输入采集时间', trigger: 'blur' }
                        //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
                    ]
                },
                options: [
                    {
                        value: '选项1',
                        label: '黄金糕'
                    },
                    {
                        value: '选项2',
                        label: '双皮奶'
                    },
                    {
                        value: '选项3',
                        label: '蚵仔煎'
                    },
                    {
                        value: '选项4',
                        label: '龙须面'
                    },
                    {
                        value: '选项5',
                        label: '北京烤鸭'
                    }
                ],
                value: ''
            };
        },
        created() {
            this.init(); //初始化数据
            // 获取字典
            this.getDictList(['rankingListCollectionType', 'exampleSite']);
        },
        computed: {
            ...mapGetters(['rankingListCollectionType', 'exampleSite']),
            valOption() {
                let arr = [
                    // 馆藏数据库类型0
                    this.rankingListCollectionType,
                    // 榜单信源1
                    this.exampleSite
                ];
                return arr;
            }
        },
        methods: {
            ...mapActions(['getDictList']),
            init() {
                if (this.$route.query.id) {
                    //修改榜单信息
                    let detail = sessionStorage.getItem(this.$route.query.id);
                    detail = JSON.parse(detail);
                    this.ruleForm.collectionTime = detail.collectionTime;
                    this.ruleForm.introduce = detail.introduce;
                    this.ruleForm.rankingListCollectionType = detail.rankingListCollectionType == null ? null :
                        detail.rankingListCollectionType.toString();
                    this.ruleForm.rankingListName = detail.rankingListName;
                    this.ruleForm.site = detail.site;
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.$route.query.id) {
                            //修改榜单信息
                            this.ruleForm.id = this.$route.query.id;
                            //  POST /api/rankingList/updateRangingList
                            this.$post('/api/rankingList/updateRangingList', this.ruleForm)
                                .then(res => {
                                    this.$message(res.message);
                                })
                                .catch(res => {
                                });
                        } else {
                            //新增榜单信息
                            //   POST /api/rankingList/insertRangingList
                            this.$post('/api/rankingList/insertRangingList', this.ruleForm)
                                .then(res => {
                                    this.$message(res.message);
                                })
                                .catch(res => {
                                });
                        }
                    } else {
                        return false;
                    }
                });
            },
            //   保存
            save() {
                let params = {
                    collectionTime: '', //采集时间
                    introduce: '', //简介
                    rankingListCollectionType: 0, //榜单类型
                    rankingListName: '11732', //榜单名称
                    site: '' //信源
                };
                //   POST /api/rankingList/insertRangingList
                this.$post('/api/rankingList/findRankingList', params)
                    .then(res => {
                    })
                    .catch(res => {
                    });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .con-title {
        height: 40px;
        background: #e2f0ff;
        line-height: 40px;
        margin-top: 10px;
        color: #439fff;
        padding-left: 30px;
    }

    .el-row {
        background: #fff;
        padding: 30px 20px;
    }

    .from-left {
        padding-right: 50px;
        border-right: 1px dashed #7cbcff;
    }

    .from-right {
        width: 300px;
        height: 200px;
        border: 1px solid #eeeeee;
        margin-left: 30px;
        margin-bottom: 30px;

        .from-title {
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: #e1effe;
        }

        p {
            color: #cccccc;
            padding: 10px;
            box-sizing: border-box;
        }
    }
</style>

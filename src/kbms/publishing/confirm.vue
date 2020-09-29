<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="page-top">确认</div>
            </el-col>
            <el-col :span="24" class="bg-white">
                <el-row>
                    <el-form ref="form" :model="form" label-width="120px">
                        <el-col :span="18" class="border-right">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="出版社名称：" required>
                                        <el-input size="medium" disabled v-model="form.publishers"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="出版社号：" required>
                                        <el-input size="medium" v-model="form.publisherCode"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="序号：">
                                        <el-input size="medium" v-model="form.number"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="价格优先级：">
                                        <el-select v-model="form.moneyPriority" placeholder="请选择">
                                            <el-option
                                                v-for="item in priceLevelOptions"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-col :span="10">
                                        <el-form-item label="出版社前缀：">
                                            <el-input size="medium" v-model="form.publisherPrefix"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="14">
                                        <div v-for="(isbn, isbnIndex) in isbnGroup" :key="isbn.index">
                                            <el-col :span="21">
                                                <el-form-item label="ISBN分隔符：">
                                                    <el-select v-model="form.isbn" filterable clearable size="medium"
                                                               required placeholder="请选择" style="width: 150px">
                                                        <el-option
                                                            v-for="item in isbnData"
                                                            :key="item.index"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="2">
                                                <el-button type="primary"
                                                           :icon="isbn.add ? 'el-icon-plus' : 'el-icon-minus'"
                                                           size="small"
                                                           @click="addIsbnGroup(isbnIndex,isbn.add)"
                                                           style="margin-top:4px"></el-button>
                                            </el-col>
                                        </div>
                                    </el-col>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="所属集团：">
                                        <el-input size="medium" v-model="form.membershipGroup"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="集团编号：">
                                        <el-input size="medium" v-model="form.membershipId"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="国家/地区：" required>
                                        <el-select v-model="form.country" filterable clearable size="medium"
                                                   placeholder="请选择">
                                            <el-option
                                                v-for="item in cityData"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="出版社类别：" required>
                                        <el-select v-model="form.publisherType" filterable clearable size="medium"
                                                   required placeholder="请选择">
                                            <el-option
                                                v-for="item in publisherTypeTable"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="等级：" required>
                                        <el-select v-model="form.level" filterable clearable size="medium" required
                                                   placeholder="请选择">
                                            <el-option
                                                v-for="item in publishRankOptions"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="出版物类别：" required>
                                        <el-select v-model="form.publicationType" filterable clearable size="medium"
                                                   required placeholder="请选择">
                                            <el-option
                                                v-for="item in publicationTypeTable"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否敏感：" required>
                                        <el-select v-model="form.ifSensitive" filterable clearable size="medium"
                                                   required placeholder="请选择">
                                            <el-option label="是" value="1"></el-option>
                                            <el-option label="否" value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="描述：">
                                        <el-input v-model="form.describes" type="textarea" resize="none" :rows="5"
                                                  size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="6">
                            <el-row>
                                <el-col :span="20" :offset="2" class="alias border">
                                    <p class="alias-tips bg-blue pdn">别名</p>
                                    <el-input type="textarea"
                                              v-model="form.publisherAlias"
                                              resize="none"
                                              :rows="5"
                                              placeholder='词之间使用";"分割'
                                              style="border: none"
                                              size="medium"></el-input>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="12" :offset="6">
                                <el-form-item>
                                    <el-button size="medium" @click="$router.go(-1)">取消</el-button>
                                    <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
                                </el-form-item>
                            </el-col>
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
                form: {
                    country: '',
                    describes: '',
                    ifSensitive: '',
                    level: '',
                    membershipGroup: '',
                    membershipId: '',
                    moneyPriority: '',
                    number: '',
                    publicationType: '',
                    publisherAlias: '',
                    publisherCode: '',
                    publisherPrefix: '',
                    publisherType: '',
                    publishers: '',
                },
                cityData: [],
                publisherTypeTable: [],
                publicationTypeTable: [],
                reviewLevelOptions: [],
                priceLevelOptions: [],
                publishRankOptions: [],
                isbnData:[
                    {
                        label:'000-000-0000-00-0',
                        value:'000-000-0000-00-0'
                    },{
                        label:'000-000-00000-0-0',
                        value:'000-000-00000-0-0'
                    }
                ],
                isbnGroup:[
                    {
                        isbn:'',
                        add: true,
                    }
                ]
            };
        },
        created() {
            let paramData = this.$route.params;
            if (JSON.stringify(paramData) !== '{}'){
                this.form.publishers = paramData.publishers;
            }
            this.getCityList(); //获取城市列表
            this.getPublisherType(); // 获取出版社类别
            this.getPublicationType(); // 获取出版物类别
            this.priceLevelList();//价格优先级
            this.publishRankList();//等级
        },
        methods: {
            getCityList() { //国家和地区
                let that = this;
                this.$get('/api/region/findRegions?level=1')
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            that.cityData = res.data;
                        }
                    })
            },
            getPublisherType() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=publisherType')
                    .then(function (res) {
                        if (res.success && res.status === 0){
                            that.publisherTypeTable = res.data.dictionaryInfoList;
                        }
                    });
            },
            getPublicationType() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=publicationType')
                    .then(function (res) {
                        if (res.success && res.status === 0){
                            that.publicationTypeTable = res.data.dictionaryInfoList;
                        }
                    });
            },
            priceLevelList() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=priceLevel')
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.priceLevelOptions = res.data.dictionaryInfoList;
                        }
                    })
            },
            publishRankList() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=publisherRank')
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.publishRankOptions = res.data.dictionaryInfoList;
                        }
                    })
            },
            onSubmit() {
                if (!this.form.publishers) {
                    return this.$message.error('请填写出版社名称');
                }
                if (!this.form.publisherCode) {
                    return this.$message.error('请填写出版社号');
                }
                if (!this.form.country) {
                    return this.$message.error('请选择国家/地区');
                }
                if (!this.form.publisherType) {
                    return this.$message.error('请选择出版社类别');
                }
                if (!this.form.level) {
                    return this.$message.error('请选择等级');
                }
                if (!this.form.publicationType) {
                    return this.$message.error('请选择出版物类别');
                }
                if (!this.form.ifSensitive) {
                    return this.$message.error('请选择是否敏感');
                }
                if (!this.form.publisherAlias) {
                    return this.$message.error('请填写别名');
                }
                let that = this;
                let apiUrl = '/api/publisher/insertNewPublisher';
                this.$post(apiUrl, this.form)
                    .then(function (res) {
                        if (res.success && res.status === 0){
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose:function () {
                                    that.$router.push({path:'/publishing/newfinder'})
                                }
                            })
                        }
                        return that.$message.error(res.message);
                    })
            },
            addIsbnGroup(index,isAdd){
                if (isAdd){
                    return this.isbnGroup.push({isbn:'',add: false})
                }else{
                    return this.isbnGroup.splice(index,1);
                }
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

    .alias{
        overflow: hidden;
        padding: 0;
    }

    .border {
        border: 1px solid #f1f1f1;
    }

    .pdn {
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

    .bg-blue {
        width: 100%;
        background: rgb(217, 236, 255);
        padding: 6px;
        color: #409EFF;
    }
</style>

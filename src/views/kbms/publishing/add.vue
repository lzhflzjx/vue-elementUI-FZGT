<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="page-top">编辑/新增</div>
            </el-col>
            <el-col :span="24" class="bg-white">
                <el-row>
                    <el-button type="primary" :plain="true" style="background: #fff;font-weight: 700">详细</el-button>
                </el-row>
                <el-row>
                    <el-col :span="22" :offset="1" style="margin-top:2%;margin-bottom:2%;">
                        <el-form ref="form" :model="form" label-width="120px">
                            <el-col :span="18" class="border-right">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="出版社名称：" required>
                                            <el-input size="medium" v-model="form.publishers"></el-input>
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
                                        <el-form-item label="价格优先级：" required>
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
                                        <div v-for="(isbn, isbnIndex) in isbnGroup" :key="isbn.index">
                                            <el-col :span="10">
                                                <el-form-item label="出版社前缀：">
                                                    <el-input size="medium"
                                                              v-model="isbnGroup[isbnIndex].publisherPrefix"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="14">
                                                <el-col :span="21">
                                                    <el-form-item label="ISBN分隔符：">
                                                        <el-select v-model="isbnGroup[isbnIndex].puseparator" filterable
                                                                   clearable size="medium"
                                                                   required placeholder="请选择" style="width: 150px">
                                                            <el-option
                                                                v-for="item in puseparatorOpitons"
                                                                :key="item.index"
                                                                :label="item.name"
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
                                            </el-col>
                                        </div>
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
                                                    :value="item.value">
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
                                                    :value="item.value">
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
                                                    :value="item.value">
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
                                    <el-col :span="12">
                                        <el-form-item label="深度维护员：" required>
                                            <el-input size="medium" v-model="form.maintainer" clearable placeholder="深度维护员"></el-input>
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
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="bg-white" style="margin-top: 10px">
                <div style="height: 80px"></div>
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
                    publisherType: '',
                    publishers: '',
                    publisherPrefix: '',
                    publisherPrefixs: [],
                    maintainer:''
                },
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                value: '',
                cityData: [],
                publisherTypeTable: [],
                publicationTypeTable: [],
                reviewLevelOptions: [],
                priceLevelOptions: [],
                publishRankOptions: [],
                puseparatorOpitons: [],
                isbnGroup: [
                    {
                        puseparator: '',
                        publisherPrefix: '',
                        add: true,
                    }
                ]
            };
        },
        created() {
            let paramData = this.$route.params;
            if (JSON.stringify(paramData) !== '{}') {
                this.getPublishInfo(paramData.id);
            }
            this.getCityList(); //获取城市列表
            this.getPublisherType(); // 获取出版社类别
            this.getPublicationType(); // 获取出版物类别
            this.priceLevelList();//价格优先级
            this.publishRankList();//等级
            this.puseparatorList();//等级
        },
        methods: {
            getPublishInfo(id) {
                let that = this;
                this.$post('/api/publisher/selectOne?id=' + id)
                    .then(function (res) {
                        if (res.status === 0 && res.success) {
                            res.data.ifSensitive = res.data.ifSensitive.toString();
                            res.data.country = parseInt(res.data.country); //国家单独处理
                            if (res.data.publisherPrefixs.length > 0) {
                                that.isbnGroup = [];
                                for (let i in res.data.publisherPrefixs) {
                                    let isAdd = i < 1 ? true : false;
                                    res.data.publisherPrefixs[i].add = isAdd;
                                    that.isbnGroup.push(res.data.publisherPrefixs[i]);
                                }
                            }
                            that.form = res.data;
                            console.log(that.form)
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
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
                        if (res.status === 0 && res.success && res.data) {
                            that.publisherTypeTable = res.data.dictionaryInfoList;
                        }
                    })
            },
            getPublicationType() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=publicationType')
                    .then(function (res) {
                        if (res.success && res.data) {
                            that.publicationTypeTable = res.data.dictionaryInfoList;
                        }
                    })
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
                        if (res.status === 0 && res.success) {
                            return that.publishRankOptions = res.data.dictionaryInfoList;
                        }
                    })
            },
            puseparatorList() {
                let that = this;
                this.$get('/api/dic/selectByCode?code=puseparator')
                    .then(function (res) {
                        if (res.status === 0 && res.success && res.data) {
                            return that.puseparatorOpitons = res.data.dictionaryInfoList;
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
                if (!this.form.moneyPriority){
                    return this.$message.error("请选择价格优先级");
                }
                this.form.publisherPrefixs = this.isbnGroup;
                let that = this;
                let apiUrl = this.form.id ? '/api/publisher/updateById' : '/api/publisher/insertPublisher';
                this.$post(apiUrl, this.form)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    that.$router.push({ path: '/publishing' });
                                }
                            });
                        }
                        return that.$message.error(res.message);
                    })
            },
            addIsbnGroup(index, isAdd) {
                if (isAdd) {
                    return this.isbnGroup.push({ puseparator: '', publisherPrefix: '', add: false });
                } else {
                    return this.isbnGroup.splice(index, 1);
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

    .alias {
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

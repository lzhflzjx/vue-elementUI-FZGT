<template>
    <div>
        <el-row class="bg-blue">
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">编辑/新增</div>
            </el-col>
        </el-row>
        <el-row class="bg-white">
            <el-form ref="form" label-width="200px">
                <el-col :span="17" class="br-right">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="敏感词 :" required>
                                <el-input size="medium" v-model="form.sensitiveName" :disabled="sensitiveDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="敏感等级 :" required>
                                <el-select v-model="form.sensitiveLevel" filterable clearable size="medium"
                                           placeholder="请选择敏感等级">
                                    <el-option
                                        v-for="item in levelOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="敏感问题 :" required>
                                <el-input size="medium" v-model="form.sensitiveProblem"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="来源 :" required>
                                <el-select v-model="form.sensitiveSource" filterable clearable size="medium"
                                           placeholder="请选择来源">
                                    <el-option
                                        v-for="item in sourceOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="语种 :" required>
                                <el-select v-model="form.sensitiveLanguage" filterable clearable size="medium"
                                           placeholder="请选择语种">
                                    <el-option
                                        v-for="item in languageOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型 :" required>
                                <el-select v-model="form.sensitiveType" filterable clearable size="medium"
                                           placeholder="请选择类型">
                                    <el-option
                                        v-for="item in typeOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态 :" required>
                                <el-select v-model="form.state" filterable clearable size="medium" placeholder="请选择状态">
                                    <el-option
                                        v-for="item in statusOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="检测范围 :" required>
                                <el-checkbox-group v-model="selectDetectionRange">
                                    <el-checkbox v-for="item in checkScope"
                                                 :key="item.id"
                                                 :label="item.name"
                                                 :value="item.id"
                                                 :checked="item.selecteds"
                                    ></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="描述 :">
                                <el-input v-model="form.sensitiveDescribe" type="textarea" :rows="4"
                                          resize="none"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="百度百科 :">
                                <el-input v-model="form.baiduWiki" type="textarea" :rows="4" resize="none"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="维基百科 :">
                                <el-input v-model="form.wikipedia" type="textarea" :rows="4" resize="none"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="7">
                    <el-row>
                        <el-col :span="20" :offset="2" class="fz">分类 :</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="2" class="bg-blue-small">三级</el-col>
                        <el-col :span="20" :offset="2" class="br" style="height: 200px;overflow-x:auto;">
                            <el-tree :data="data"
                                     ref="tree"
                                     node-key="id"
                                     :props="defaultProps"
                                     :highlight-current="true"
                                     @check-change="handleNodeClick"
                                     @node-click="nodeClick"
                                     show-checkbox
                                     :check-strictly="true"
                                     :default-expanded-keys="expanded"
                                     :default-checked-keys="[form.sortId]"
                            ></el-tree>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="2" class="fz" style="margin-top: 10px;"> 别名 :</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="2">
                            <el-input style="margin-top:10px" type="textarea" :rows="3" resize="none"
                                      v-model="form.alias" placeholder="词之间使用','分割"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="2" class="fz" style="margin-top: 10px;"> 词组/共现词：</el-col>
                    </el-row>
                    <el-row style="margin-top: 10px;">
                        <el-col :span="22" :offset="2">
                            <el-row class="mt10" v-for="(phrase, index) in phrasesGroup" :key="phrase.index">
                                <el-col :span="9">
                                    <el-input size="medium"
                                              v-model="phrasesGroup[index].wordDelimiter"
                                              placeholder="多个词请用','分割"></el-input>
                                </el-col>
                                <el-col :span="6" style="margin-left: 5px">
                                    <el-select v-model="phrasesGroup[index].wordDistance" size="medium"
                                               placeholder="请选择">
                                        <el-option
                                            v-for="item in phraseClass"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="5" style="margin-left: 5px"
                                        v-if="phrasesGroup[index].wordDistance === 4">
                                    <el-input v-model="phrasesGroup[index].intervalValue"
                                              size="medium"
                                              type="number"
                                              placeholder="填写字符间距">
                                    </el-input>
                                </el-col>
                                <el-col :span="2" :offset="1">
                                    <el-button size="medium"
                                               type="primary"
                                               :icon="phrasesGroup[index].isAdd === 0 ? 'el-icon-minus': 'el-icon-plus'"
                                               @click="addPhrase(phrasesGroup[index].isAdd, index)"
                                    ></el-button>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="2" class="fz" style="margin-top: 10px;"> 译文 :</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="2">
                            <el-input style="margin-top:10px" type="textarea" :rows="4" resize="none"
                                      v-model="form.translation" placeholder="译文"></el-input>
                        </el-col>
                    </el-row>
                </el-col>
            </el-form>
        </el-row>
        <el-row class="bg-white">
            <el-col :span="8" :offset="11" style="padding-bottom: 16px">
                <el-col :span="12">
                    <el-button size="medium" @click="$router.go(-1)">取消</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button size="medium" type="primary" @click.native="addKeyword">保存</el-button>
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
        name: 'keyword',
        data() {
            return {
                form: {
                    sensitiveName: '',
                    sensitiveLevel: '',
                    sensitiveProblem: '',
                    sensitiveSource: '',
                    sensitiveLanguage: '',
                    sensitiveType: '',
                    detectionRange: [],
                    sensitiveDescribe: '',
                    baiduWiki: '',
                    alias: '',
                    sortId: 0,
                    state: '',
                    translation: '',
                    wikipedia: '',
                    phrasesGroup: []
                },
                selectTypes:[],
                sensitiveDisabled: false,
                selectDetectionRange:[],
                phraseClass: [
                    {
                        id: 1,
                        name: '同句子',
                        value: 1
                    },
                    {
                        id: 2,
                        name: '同段落',
                        value: 2
                    },
                    {
                        id: 3,
                        name: '全篇',
                        value: 3
                    },
                    {
                        id: 4,
                        name: '字符间隔',
                        value: 4
                    },
                ],
                phrasesGroup: [
                    {
                        wordDelimiter: '',
                        wordDistance: 1,
                        intervalValue: '',
                        isAdd: 1
                    }
                ],
                levelOptions: [],
                sourceOptions: [],
                languageOptions: [],
                typeOptions: [],
                statusOptions: [],
                checkScope: [],
                data: [],
                defaultProps: {
                    id: 'id',
                    children: 'children',
                    label: 'label'
                },
                finderId: '',
                expanded:[]
            };
        },
        created() {
            //编辑功能
            let paramData = this.$route.params;
            if (paramData.id) {
                this.form = {
                    id: paramData.id,
                    sensitiveName: paramData.sensitiveName,
                    sensitiveLevel: paramData.sensitiveLevel,
                    sensitiveProblem: paramData.sensitiveProblem,
                    sensitiveSource: paramData.sensitiveSource,
                    sensitiveLanguage: paramData.sensitiveLanguage,
                    sensitiveType: paramData.sensitiveType,
                    detectionRange: [paramData.detectionRange],
                    sensitiveDescribe: paramData.sensitiveDescribe,
                    baiduWiki: paramData.baiduWiki,
                    alias: paramData.alias,
                    sortId: paramData.sortId.toString(),
                    state: paramData.state.toString(),
                    translation: paramData.translation,
                    wikipedia: paramData.wikipedia,
                    phrasesGroup: []
                };
                this.wordPhrases(paramData.id);
            }
            if (paramData.sensitive && paramData.finderId){
                this.form.sensitiveName = paramData.sensitive;
                this.finderId = paramData.finderId;
                this.sensitiveDisabled = true;
            }
            this.getCategoryList();
            this.sourceList('sensitiveSite'); //敏感来源列表
            this.languageList('language'); //语种列表
            this.typeList('sensitiveType'); //类型列表
            this.statusList('sensitiveStatus'); // 状态列表
            this.levelList('sensitiveLevel'); // 等级列表
            this.rangeList('checkRange'); // 检测范围
        },
        methods: {
            handleNodeClick(data,checked,node) {
                if (checked === true){
                    this.form.sortId = data.id;
                    this.$refs.tree.setCheckedNodes([data]);
                }
            },
            nodeClick(data,checked,node){
                this.form.sortId = data.id;
                this.$refs.tree.setCheckedNodes([data]);
            },
            getCategoryList(data = {}) {
                let that = this;
                data.pageNo = data.pageNo ? data.pageNo : 1;
                data.pageSize = data.pageSize ? data.pageSize : 100;
                data.type = data.type ? data.pageNo : 1;
                this.$post('/api/sortManage/findListByPraentId', data)
                    .then(function (res) {
                        that.menuLoading = false;
                        let menuData = res.data.result;
                        that.data = setCategoryMenu(res.data.result);
                        let parentId = parseInt(that.form.sortId);
                        for (let i in menuData) {
                            if (menuData[i].id === parentId){
                                that.expanded = [menuData[i].id];
                            }
                            if (menuData[i].childList){
                                for (let j in menuData[i].childList){
                                    if (menuData[i].childList[j].id === parentId){
                                        that.expanded.push(menuData[i].childList[j].id);
                                        that.expanded.push(menuData[i].childList[j].parentId);
                                    }
                                    for (let q in menuData[i].childList[j].childList){
                                        if (menuData[i].childList[j].childList[q].id === parentId){
                                            that.expanded.push(menuData[i].childList[j].parentId);
                                            that.expanded.push(menuData[i].childList[j].childList[q].id);
                                            that.expanded.push(parentId);
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
            levelList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.levelOptions = res.data.dictionaryInfoList;
                    })
            },
            rangeList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.checkScope = res.data.dictionaryInfoList;
                        if (that.form.detectionRange){
                            let selectRanges = that.form.detectionRange[0].split(',');
                            for (let j in selectRanges) {
                                for (let i in that.checkScope){
                                    if (selectRanges[j] === that.checkScope[i].name){
                                        that.checkScope[i].selecteds = true;
                                    }
                                }
                            }
                        }
                    })
            },
            sourceList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.sourceOptions = res.data.dictionaryInfoList;
                    })
            },
            languageList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.languageOptions = res.data.dictionaryInfoList;
                    })
            },
            typeList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.typeOptions = res.data.dictionaryInfoList;
                    })
            },
            statusList(type) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=' + type)
                    .then(function (res) {
                        that.statusOptions = res.data.dictionaryInfoList;
                    })
            },
            wordPhrases(id) {
                let that = this;
                this.$get('/api/sensitiveWord/findSensitiveWordPhrases?id=' + id)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            if (res.data.totalCount > 0) {
                                that.form.phrasesGroup = res.data.result;
                                that.phrasesGroup = [];
                                for (let i in res.data.result) {
                                    let addTypes = i === 0 ? 0 : 1;
                                    res.data.result[i].isAdd = addTypes;
                                    that.phrasesGroup.push(res.data.result[i]);
                                }
                            }
                            return;
                        }
                        return that.$message.error(res.message);
                    })
            },
            addPhrase(type, index) {
                if (type === 1) {
                    let tempObj = {
                        wordDelimiter: '',
                        wordDistance: 1,
                        intervalValue: '',
                        isAdd: 0
                    };
                    return this.phrasesGroup.push(tempObj);
                }
                if (type === 0) {
                    this.phrasesGroup.splice(index, 1);
                }
            },
            addKeyword() {
                let that = this;
                if (!this.form.sensitiveName) {
                    return this.$message.error('请填写敏感词');
                }
                if (!this.form.sensitiveLevel) {
                    return this.$message.error('请选择敏感等级');
                }
                if (!this.form.sensitiveProblem) {
                    return this.$message.error('请填写敏感问题');
                }
                if (!this.form.sensitiveSource) {
                    return this.$message.error('请选择来源');
                }
                if (!this.form.sensitiveLanguage) {
                    return this.$message.error('请选择语种');
                }
                if (!this.form.sensitiveType) {
                    return this.$message.error('请选择类型');
                }
                if (!this.form.state) {
                    return this.$message.error('请选择状态');
                }
                if (!this.selectDetectionRange ||
                    this.selectDetectionRange === '' ||
                    this.selectDetectionRange === undefined ||
                    this.selectDetectionRange.length < 1
                ) {
                    return this.$message.error('请选择检测范围');
                }else {
                    this.form.detectionRange = this.selectDetectionRange;
                }
                // if (!this.form.sortId === 0) {
                //     return this.$message.error('请选择分类');
                // }
                // 处理词组 共现词
                for (let i in this.phrasesGroup) {
                    if (this.phrasesGroup[i].intervalValue) {
                        this.phrasesGroup[i].intervalValue = parseInt(this.phrasesGroup[i].intervalValue);
                    }
                }
                this.form.phrasesGroup = this.phrasesGroup;
                //方法共用，所以要对API地址做判断
                let apiUrl = this.form.id ? '/api/sensitiveWord/updateSensitiveWord' : '/api/sensitiveWord/insertSensitiveWord';
                this.form.detectionRange = this.form.detectionRange.join(',');
                this.$post(apiUrl, this.form)
                    .then(function (res) {
                        if (res.success && res.status === 0) {
                            return that.$message({
                                message: res.message,
                                type: 'success',
                                onClose: function () {
                                    if (that.sensitiveDisabled){
                                        that.deleteNewFinder(that.finderId);
                                    }else{
                                        that.$router.push({ path: '/sensitive' });
                                    }
                                }
                            });
                        }
                        return that.$message.error(res.message);
                    })
            },
            deleteNewFinder(id){
                let that = this;
                this.$get('/api/sensitiveNewWord/deleteSensitiveNewWordIndex?ids=' + id)
                    .then(function (res) {
                        if (res.success) {
                            return that.$router.push({ path: '/sensitive' });
                        }
                        return that.$message.error("新发现敏感词："+res.message);
                    })
            }
        }
    };
</script>

<style scoped>
    .br {
        border: 1px solid #f1f1f1;
    }

    .mt10 {
        margin-top: 10px;
    }

    .bg-blue {
        background: rgb(217, 236, 255);
        padding: 10px;
        color: #409EFF;
    }

    .bg-blue-small {
        background: rgb(217, 236, 255);
        padding: 4px;
        color: #409EFF;
        margin-top: 10px;
        text-align: center;
    }

    .br-right {
        border-right: 1px dashed #409EFF;
        padding-right: 20px;
    }

    .bg-white {
        background: #ffffff;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .fz {
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
</style>

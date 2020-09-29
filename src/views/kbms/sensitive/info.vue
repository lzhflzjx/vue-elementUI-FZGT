<template>
    <div>
        <el-row class="bg-white" style="padding: 10px;overflow:hidden;">
            <el-row>
                <div class="top-title">
                    <p class="title-ps">详细</p>
                </div>
            </el-row>
            <el-col :span="16" style="border-right: 1px solid #e2effe;">
                <el-row>
                    <el-col :span="12" class="info-item">
                        <el-col :span="4">
                            <p class="info-name">敏感词：</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="info-content">{{info.sensitiveName}}</p>
                        </el-col>
                    </el-col>
                    <el-col :span="12" class="info-item">
                        <el-col :span="4">
                            <p class="info-name"><span class="req">*</span>敏感等级：</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="info-content">{{info.sensitiveLevel}}</p>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3" class="info-item">
                        <p class="info-name">敏感问题：</p>
                    </el-col>
                    <el-col :span="21" class="info-item">
                        <p class="info-content">{{ info.sensitiveProblem }}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3" class="info-item">
                        <p class="info-name">别名：</p>
                    </el-col>
                    <el-col :span="21" class="info-item">
                        <p class="info-content">{{ info.alias }}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3" class="info-item">
                        <p class="info-name">词组/共现词：</p>
                    </el-col>
                    <el-col :span="21" class="info-item">
                        <p class="info-content">{{ wordPhrasesCon }}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" class="info-item">
                        <el-col :span="3">
                            <p class="info-name">来源：</p>
                        </el-col>
                        <el-col :span="21">
                            <p class="info-content">{{ info.sensitiveSource }}</p>
                        </el-col>
                    </el-col>
                    <el-col :span="12" class="info-item">
                        <el-col :span="3">
                            <p class="info-name">语种：</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="info-content">{{ info.sensitiveLanguage }}</p>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" class="info-item">
                        <el-col :span="3">
                            <p class="info-name">类型：</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="info-content">{{ info.sensitiveType }}</p>
                        </el-col>
                    </el-col>
                    <el-col :span="12" class="info-item">
                        <el-col :span="3">
                            <p class="info-name">状态：</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="info-content">{{ info.state === 1 ? '启用' : '停用'}}</p>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" class="info-item">
                        <p class="info-name">检测范围：</p>
                    </el-col>
                    <el-col :span="22" class="info-item">
                        <el-checkbox v-for="item in checkScope"
                                     :key="item.id"
                                     v-model="tempModel[item.id]"
                                     :label="item.name"
                                     :value="item.id"
                                     :checked="item.selecteds"
                                     class="m-top"
                        ></el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" class="info-item">
                        <p class="info-name">描述：</p>
                    </el-col>
                    <el-col :span="22" class="info-item">
                        <p class="info-content">{{ info.sensitiveDescribe }}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" class="info-item">
                        <p class="info-name">百度百科：</p>
                    </el-col>
                    <el-col :span="22" class="info-item">
                        <p class="info-content">{{ info.baiduWiki }}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" class="info-item">
                        <p class="info-name">维基百科：</p>
                    </el-col>
                    <el-col :span="22" class="info-item">
                        <p class="info-content">{{ info.wikipedia }}</p>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8" style="padding-left: 10px">
                <el-row>
                    <p class="log-title">操作日志:</p>
                </el-row>
                <el-row>
                    <el-table
                        :data="logData"
                        :stripe="true"
                        :header-cell-style="{background:'#e6f0f6',color:'#606266'}"
                        style="width: 100%;border: 1px solid #f1f1f1">
                        <el-table-column
                            prop="operation"
                            label="操作">
                        </el-table-column>
                        <el-table-column
                            prop="create_user"
                            label="用户">
                        </el-table-column>
                        <el-table-column
                            prop="create_time"
                            label="时间">
                        </el-table-column>
                    </el-table>
                </el-row>
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
    export default {
        name: 'info',
        data() {
            return {
                info: {},
                checkScope: [],
                detectionRange: '',
                logData: [],
                tempModel: [],
                wordPhrasesCon:''
            };
        },
        created() {
            let params = this.$route.params;
            if (JSON.stringify(params) == '{}') {
                return this.$message.error('参数错误,请返回重新选择');
            }
            this.rangeList(params);
        },
        methods: {
            getInfo(e, ranges) {
                let that = this;
                let data = {
                    id: e.id
                };
                this.$post('/api/sensitiveWord/sensitiveWordIndex', data)
                    .then(function (res) {
                        console.log(res);
                        if (res.data.result.length > 0) {
                            //敏感词信息
                            that.info = res.data.result[0];
                            let selectRange = res.data.result[0].detectionRange.split(',');
                            for (let j in selectRange) {
                                for (let i in ranges) {
                                    if (selectRange[j] === ranges[i].name) {
                                        ranges[i].selecteds = true;
                                    }
                                }
                            }
                            that.checkScope = ranges;
                            that.logInfo(e.id);
                            that.wordPhrases(e.id);
                        }
                    })
            },
            rangeList(e) {
                let that = this;
                this.$get('/api/dic/selectByCode?code=checkRange')
                    .then(function (res) {
                        that.getInfo(e, res.data.dictionaryInfoList);
                    })
            },
            logInfo(id) {
                let that = this;
                let data = {
                    id: id
                };
                this.$post('/api/sensitiveWord/sensitiveWordLog', data)
                    .then(function (res) {
                        console.log(res);
                        that.logData = res.data.result;
                    })
            },
            wordPhrases(id) {
                let that = this;
                this.$get('/api/sensitiveWord/findSensitiveWordPhrases?id=' + id)
                    .then(function (res) {
                        console.log("敏感词群组",res);
                        if (res.success && res.status === 0 && res.data.totalCount > 0){
                            let tempArr = [];
                            for (let i in res.data.result){
                                tempArr.push(res.data.result[i].wordDelimiter)
                            }
                            that.wordPhrasesCon = tempArr.join(',');
                        }
                    })
            }
        }
    };
</script>

<style scoped>
    .bg-white {
        background: #ffffff;
    }

    .top-title {
        height: 40px;
        background: #e2effe;
    }

    .title-ps {
        color: #2d8cf0;
        line-height: 40px;
        padding-left: 10px;
    }

    .info-item {
        overflow: hidden;
    }

    .info-item .info-name {
        font-size: 14px;
        color: #333333;
        line-height: 38px;
        padding-left: 10px;
    }

    .info-item .info-content {
        min-height: 38px;
        color: #333333;
        border-bottom: 1px dashed #CCCCCC;
        padding-left: 10px;
        padding-right: 10px;
        line-height: 38px;
        font-size: 14px;
    }

    .req {
        color: red;
        line-height: 38px;
    }

    .m-top {
        margin-top: 24px;
    }

    .br-right {
        border-right: #2d8cf0;
    }

    .br-left {
        border-left: 1px solid #2d8cf0;
    }

    .log-title {
        line-height: 30px;
        color: #666666;
        padding-left: 10px;
    }
</style>

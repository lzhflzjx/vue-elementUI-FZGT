<template>
    <div id='bookDetail' v-loading="loading">
        <div class="content">
            <div class="bookInfo">
                <div class="tit">
                    <div>
                        <span @click="$router.push('/bookCheck')" class="back"><i class="el-icon-back"></i><span style="font-size:13px;">返回</span><el-divider direction="vertical"></el-divider></span>
                        <b>图书信息</b>
                        <span v-if="bookData.isLock.value" style="color:red;font-size:13px;margin-left:20px;"><i class="el-icon-lock"></i>锁定</span>
                        <span v-if="bookData.isBlockUp.value" style="color:gray;font-size:13px;"><i class="el-icon-error"></i>停用</span>
                    </div>
                    <div>
                        <el-button @click="changeLock(false)" v-if="bookData.isLock.value&&permission.indexOf('F_BR_LOCK')!=-1" size="mini">解锁</el-button>
                        <el-button @click="changeLock(true)" v-if="!bookData.isLock.value&&permission.indexOf('F_BR_LOCK')!=-1" size="mini">锁定</el-button>
                        <el-button @click="changeBlock(false)" v-if="bookData.isBlockUp.value&&permission.indexOf('F_BR_STOP')!=-1" size="mini">启用</el-button>
                        <el-button @click="changeBlock(true)" v-if="!bookData.isBlockUp.value&&permission.indexOf('F_BR_STOP')!=-1" size="mini">停用</el-button>
                        <el-button @click="allowUpdata=!allowUpdata" v-if="!bookData.isLock.value&&!bookData.isBlockUp.value" size="mini">{{allowUpdata?'完成编辑':'编辑'}}</el-button>
                    </div>
                </div>
                <div class="table">
                    <el-row>
                        <el-col :span="4"><label><b class="red">*</b>ISBN:</label></el-col>
                        <el-col :span="8" class="haveCopy">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.isbn.value"></div>
                            <el-input v-if="allowUpdata" class="inputW" size="mini" v-model="bookData.isbn.value"></el-input>
                            <i title="复制" class="el-icon-document-copy" v-clipboard:copy="bookData.isbn.value"></i>
                        </el-col>
                        <el-col :span="4"><label>ISMN:</label></el-col>
                        <el-col :span="5" class="haveCopy">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.ismn.value"></div>
                            <el-input v-if="allowUpdata" style="width:calc(100% - 15px)" size="mini" v-model="bookData.ismn.value"></el-input><i title="复制" v-if="bookData.ismn.value" class="el-icon-document-copy" v-clipboard:copy="bookData.ismn.value"></i>
                        </el-col>
                        <el-col :span="3"><label><font style="color:red;margin-left:3px;">*</font>为必填项</label></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label><b class="red">*</b>主书名:</label></el-col>
                        <el-col :span="20" class="haveCopy">
                            <div v-if="!allowUpdata" class="siteDiv pl15" v-html="bookData.bookName.value"></div>
                            <el-input v-if="allowUpdata" class="siteDiv" size="mini" v-model="bookData.bookName.value"></el-input><i title="复制" v-if="bookData.bookName.value" class="el-icon-document-copy" v-clipboard:copy="bookData.bookName.value"></i>
                            <el-popover placement="right" width="300" trigger="click">
                                <el-table :data="sourceData" v-loading='sourceLoading' size="mini" :header-cell-style="{background:'#eaf2f7'}">
                                    <el-table-column prop="fieldValue" label="主书名">
                                        <template slot-scope="scope"><span class="sourceName" @click="changeSite(scope.row,bookData.bookName)">{{scope.row.fieldValue}}</span></template>
                                    </el-table-column>
                                    <el-table-column prop="sourceSite" label="渠道"><template slot-scope="scope">{{methods.changeDict(site,scope.row.sourceSite)}}</template></el-table-column>
                                </el-table>
                                <span slot="reference" class="source" @click="getSource('bookName')" v-if="bookData.bookName.site">{{methods.changeDict(site,bookData.bookName.site)}}</span>
                            </el-popover>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>副书名:</label></el-col>
                        <el-col :span="20">
                            <div v-if="!allowUpdata" class="siteDiv pl15" v-html="bookData.secondName.value"></div>
                            <el-input v-if="allowUpdata" class="siteDiv" size="mini" id="secondName" v-model="bookData.secondName.value"></el-input>
                            <el-popover
                                placement="right"
                                width="300"
                                trigger="click">
                                <el-table :data="sourceData" v-loading='sourceLoading' size="mini" :header-cell-style="{background:'#eaf2f7'}">
                                    <el-table-column prop="fieldValue" label="副书名">
                                        <template slot-scope="scope"><span class="sourceName" @click="changeSite(scope.row,bookData.secondName)">{{scope.row.fieldValue}}</span></template>
                                    </el-table-column>
                                    <el-table-column prop="sourceSite" label="渠道"><template slot-scope="scope">{{methods.changeDict(site,scope.row.sourceSite)}}</template></el-table-column>
                                </el-table>
                                <span slot="reference" class="source" @click="getSource('secondName')" v-if="bookData.secondName.site">{{methods.changeDict(site,bookData.secondName.site)}}</span>
                            </el-popover>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>卷册数:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.numberOfVolumes.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.numberOfVolumes.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>版次:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.edition.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.edition.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>文版:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.language.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.language.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>参考人民币价:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.referenceRMBPrice.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.referenceRMBPrice.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>丛书名:</label></el-col>
                        <el-col :span="20">
                            <div v-if="!allowUpdata" class="siteDiv pl15" v-html="bookData.seriesName.value"></div>
                            <el-input v-if="allowUpdata" class="siteDiv" size="mini" id="seriesName" v-model="bookData.seriesName.value"></el-input>
                            <el-popover
                                placement="right"
                                width="300"
                                trigger="click">
                                <el-table :data="sourceData" v-loading='sourceLoading' size="mini" :header-cell-style="{background:'#eaf2f7'}">
                                    <el-table-column prop="fieldValue" label="丛书名">
                                        <template slot-scope="scope"><span class="sourceName" @click="changeSite(scope.row,bookData.seriesName)">{{scope.row.fieldValue}}</span></template>
                                    </el-table-column>
                                    <el-table-column prop="sourceSite" label="渠道"><template slot-scope="scope">{{methods.changeDict(site,scope.row.sourceSite)}}</template></el-table-column>
                                </el-table>
                                <span slot="reference" class="source" @click="getSource('seriesName')" v-if="bookData.seriesName.site">{{methods.changeDict(site,bookData.seriesName.site)}}</span>
                            </el-popover>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>丛书卷号:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.seriesNumber.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.seriesNumber.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>简易译名:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.simpleTranslationName.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.simpleTranslationName.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>中文参考译名:</label></el-col>
                        <el-col :span="20">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.cnName.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.cnName.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>连续出版物编号:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.successionPublicationNumber.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.successionPublicationNumber.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>届次:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.periodTime.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.periodTime.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="marginTop">
                        <el-row v-for="(item,index) in bookData.personLiables.value" :key="index">
                            <el-row>
                                <el-col :span="4"><label>责任人:</label></el-col>
                                <el-col :span="8" class="haveCopy">
                                    <div v-if="!allowUpdata" class="inputW pl15" v-html="item.name"></div>
                                    <el-input v-if="allowUpdata" size="mini" class="inputW" v-model="item.name"></el-input><i title="复制" v-if="item.name" class="el-icon-document-copy" v-clipboard:copy="item.name"></i>
                                </el-col>
                                <el-col :span="4"><label>责任人角色:</label></el-col>
                                <el-col :span="8">
                                    <div v-if="!allowUpdata" class="inputW pl15" v-html="item.role"></div>
                                    <el-input v-if="allowUpdata" size="mini" v-model="item.role"></el-input>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4" class="textareaDiv"><label>责任人简介:</label></el-col>
                                <el-col :span="20" class="textareaDiv">
                                    <div v-if="!allowUpdata" class="about pl15" v-html="item.personLiableIntroduction"></div>
                                    <el-input v-if="allowUpdata" size="mini" type="textarea" :autosize="{ minRows:4,maxRows:4}" v-model="item.personLiableIntroduction"></el-input>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4" class="textareaDiv"><label>责任人简介(中文):</label></el-col>
                                <el-col :span="20" class="textareaDiv">
                                    <div v-if="!allowUpdata" class="about pl15" v-html="item.cnPersonLiableIntroduction"></div>
                                    <el-input v-if="allowUpdata" size="mini" type="textarea" :autosize="{ minRows:4,maxRows:4}" v-model="item.cnPersonLiableIntroduction"></el-input>
                                </el-col>
                            </el-row>
                        </el-row>
                        <el-row class="addBtn" v-if="allowUpdata"><i @click="addPersonLiables" class="el-icon-circle-plus"></i></el-row>
                    </el-row>
                    <el-row class="marginTop">
                        <el-col :span="4"><label>出版社:</label></el-col>
                        <el-col :span="8" class="haveCopy">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.publishers.value"></div>
                            <el-input v-if="allowUpdata" size="mini" class="inputW" v-model="bookData.publishers.value"></el-input><i title="复制" v-if="bookData.publishers.value" class="el-icon-document-copy" v-clipboard:copy="bookData.publishers.value"></i>
                        </el-col>
                        <el-col :span="4"><label>出版社号:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.publisherNumber.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.publisherNumber.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>所属集团:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.membershipGroup.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.membershipGroup.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>所属集团编号:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.membershipGroupNumver.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.membershipGroupNumver.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="marginTop">
                        <el-col :span="4"><label>出版状态:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.publicationStatus.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.publicationStatus.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>出版时间:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.pubDate.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.pubDate.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>发行日期:</label></el-col>
                        <el-col :span="20">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.issueDate.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.issueDate.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="marginTop">
                        <el-col :span="4"><label>载体:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.medium.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.medium.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>装帧:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.binding.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.binding.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>页码:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.pageNumber.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.pageNumber.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>插图:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.illustration.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.illustration.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>开本:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.format.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.format.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>长度:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.lengths.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.lengths.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>宽度:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.width.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.width.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>高度:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.height.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.height.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>尺寸单位:</label></el-col>
                        <el-col :span="20">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.dimensionUnit.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.dimensionUnit.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>重量:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.weight.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.weight.value"></el-input>
                        </el-col>
                        <el-col :span="4"><label>重量单位:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.weightUnit.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.weightUnit.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="marginTop">
                        <el-col :span="4"><label>是否停用:</label></el-col>
                        <el-col :span="8">
                            <el-radio-group :disabled="bookData.isLock.value||bookData.isBlockUp.value||!allowUpdata" v-model="bookData.isBlockUp.value"><el-radio :label="item.value" v-for="item in radioOption" :key="item.value">{{item.label}}</el-radio></el-radio-group>
                        </el-col>
                        <el-col :span="4"><label>停用原因:</label></el-col>
                        <el-col :span="8">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.disableReason.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.disableReason.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>是否会议录:</label></el-col>
                        <el-col :span="8">
                            <el-radio-group :disabled="bookData.isLock.value||bookData.isBlockUp.value||!allowUpdata" v-model="bookData.meetingRecord.value"><el-radio :label="item.value" v-for="item in radioOption" :key="item.value">{{item.label}}</el-radio></el-radio-group>
                        </el-col>
                        <el-col :span="4"><label>是否大套书:</label></el-col>
                        <el-col :span="8">
                            <el-radio-group :disabled="bookData.isLock.value||bookData.isBlockUp.value||!allowUpdata" v-model="bookData.isLargeSetOfBooks.value"><el-radio :label="item.value" v-for="item in radioOption" :key="item.value">{{item.label}}</el-radio></el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <!-- 缺失 -->
                        <el-col :span="4"><label>是否老书重印:</label></el-col>
                        <el-col :span="8">
                            <el-radio-group :disabled="bookData.isLock.value||bookData.isBlockUp.value||!allowUpdata" v-model="bookData.isOldBookReprint.value"><el-radio :label="item.value" v-for="item in radioOption" :key="item.value">{{item.label}}</el-radio></el-radio-group>
                        </el-col>
                        <!-- 缺失 -->
                        <el-col :span="4"><label>是否网络内容:</label></el-col>
                        <el-col :span="8">
                            <el-radio-group :disabled="bookData.isLock.value||bookData.isBlockUp.value||!allowUpdata" v-model="bookData.isNetworkContent.value"><el-radio :label="item.value" v-for="item in radioOption" :key="item.value">{{item.label}}</el-radio></el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>是否儿童书:</label></el-col>
                        <el-col :span="8">
                            <el-radio-group :disabled="bookData.isLock.value||bookData.isBlockUp.value||!allowUpdata" v-model="bookData.isChildrensBook.value"><el-radio :label="item.value" v-for="item in radioOption" :key="item.value">{{item.label}}</el-radio></el-radio-group>
                        </el-col>
                        <el-col :span="4"><label>是否有敏感语料:</label></el-col>
                        <el-col :span="8">
                            <el-radio-group :disabled="bookData.isLock.value||bookData.isBlockUp.value||!allowUpdata" v-model="bookData.isSensitiveCorpora.value"><el-radio :label="item.value" v-for="item in radioOption" :key="item.value">{{item.label}}</el-radio></el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>是否有全文/章节:</label></el-col>
                        <el-col :span="8">
                            <el-radio-group :disabled="bookData.isLock.value||bookData.isBlockUp.value||!allowUpdata" v-model="bookData.isFullText.value"><el-radio :label="item.value" v-for="item in radioOption" :key="item.value">{{item.label}}</el-radio></el-radio-group>
                        </el-col>
                        <el-col :span="4"><label>是否重点推荐:</label></el-col>
                        <el-col :span="8">
                            <el-radio-group :disabled="bookData.isLock.value||bookData.isBlockUp.value||!allowUpdata" v-model="bookData.isHighlyRecommented.value"><el-radio :label="item.value" v-for="item in radioOption" :key="item.value">{{item.label}}</el-radio></el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4"><label>推荐原因:</label></el-col>
                        <el-col :span="20">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.recommendedReason.value"></div>
                            <el-input v-if="allowUpdata" size="mini" v-model="bookData.recommendedReason.value"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4" class="textareaDiv"><label>备注:</label></el-col>
                        <el-col :span="20">
                            <div v-if="!allowUpdata" class="inputW pl15" v-html="bookData.remarks.value"></div>
                            <el-input v-if="allowUpdata" size="mini" type="textarea" :autosize="{ minRows:5,maxRows: 5}" v-model="bookData.remarks.value"></el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="other">
                <div class="pagingDiv">
                    <div class="paging" v-if="$route.query.type!='replenish'&&bookCheckList.indexOf(this.$route.query.isbn)!=-1">
                        <el-button size="mini" @click="prev" :disabled='bookCheckList[0]==$route.query.isbn' icon="el-icon-arrow-left">上一条</el-button>
                        <span v-if="bookCheckList.length>1" class="page">
                            <span class="curPage">{{bookCheckList.indexOf(this.$route.query.isbn)+1}}</span>/{{bookCheckList.length}}
                        </span>
                        <el-button size="mini" @click="next" :disabled='bookCheckList[bookCheckList.length-1]==$route.query.isbn'>下一条<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                    </div>
                </div>
                <el-tabs type="border-card">
                    <el-tab-pane label="图片审读" v-if="$route.query.type!='replenish'">
                        <imgCheck></imgCheck>
                    </el-tab-pane>
                    <el-tab-pane label="文字审读" v-if="$route.query.type!='replenish'">
                        <wordCheck ref="wordCheck"></wordCheck>
                    </el-tab-pane>
                    <el-tab-pane label="辅助查询" v-if="$route.query.type!='replenish'">
                        <assistSearch ref="assistSearch"></assistSearch>
                    </el-tab-pane>
                    <el-tab-pane label="分类">
                        <classification ref="classification" :bookData='bookData' @classification="getbookInfo()"></classification>
                    </el-tab-pane>
                    <el-tab-pane label="价格">
                        <price ref="price" :bookData='bookData'></price>
                    </el-tab-pane>
                    <el-tab-pane label="关联">
                        <relevance ref="relevance"></relevance>
                    </el-tab-pane>
                    <el-tab-pane label="推荐相关">
                        <relatedRecommend ref="relatedRecommend" :bookData='bookData'></relatedRecommend>
                    </el-tab-pane>
                    <el-tab-pane label="简介">
                        <introduction :bookData='bookData'></introduction>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="btns">
            <el-button v-if="!bookData.isLock.value&&!bookData.isBlockUp.value" @click="saveBookInfo" size="small" type="primary">保存</el-button>
            <span v-if="$route.query.type!='replenish'&&bookCheckList.indexOf(this.$route.query.isbn)!=-1">
                <el-button v-if="!bookData.isLock.value&&!bookData.isBlockUp.value" @click="saveBookInfo('下一条')" :disabled='bookCheckList[bookCheckList.length-1]==$route.query.isbn' size="small" type="primary">保存并下一条</el-button>
                <el-button @click="prev" :disabled='bookCheckList[0]==$route.query.isbn' size="small" type="primary">上一条</el-button>
                <el-button @click="next" :disabled='bookCheckList[bookCheckList.length-1]==$route.query.isbn' size="small" type="primary">下一条</el-button>
            </span>
        </div>
    </div>
</template>

<script>
import imgCheck from './components/imgCheck'
import wordCheck from './components/wordCheck'
import assistSearch from './components/assistSearch'
import introduction from './components/introduction'
import classification from './components/classification'
import relevance from './components/relevance'
import relatedRecommend from './components/relatedRecommend'
import price from './components/price'
import {mapActions,mapGetters} from 'vuex'
export default {
    inject:['reload'],
    data(){
        return {
            sourceLoading:false,
            allowUpdata:false,
            siteData:{},
            bookCheckList:JSON.parse(localStorage.getItem('bookCheckList')),
            permission:JSON.parse(localStorage.getItem('userInfo')).permission,
            loading:false,
            bookData:[],
            tabs:['图片审读','文字审读','辅助查询','分类','价格','关联','推荐相关','简介'],
            input:'',
            textarea:'',
            role:1,
            radioVal:0,
            sourceData:[],
            radioOption:[{
                value:true,
                label:'是'
                }, {
                value:false,
                label:'否'
                }, {
                value:null,
                label:'待定'
            }],
            attrList:[
                'isLock','isBlockUp','isbn','ismn','bookName','secondName','numberOfVolumes','edition','language','referenceRMBPrice','seriesName','seriesNumber','simpleTranslationName','cnName',
                'successionPublicationNumber','periodTime','personLiable','personLiableRole','publishers','publisherNumber','membershipGroup','membershipGroupNumver',
                'publicationStatus','pubDate','issueDate','medium','binding','pageNumber','illustration','format','lengths','width','height','dimensionUnit','weight','weightUnit','disableReason','meetingRecord','isLargeSetOfBooks',
                'isChildrensBook','isSensitiveCorpora','isFullText','isHighlyRecommented','recommendedReason','remarks','isOldBookReprint','isNetworkContent','introduction','cnIntroduction','content','cnContent','personLiables',
                'site','currency','price','publishersPrice','rmbReferencePrice','coefficientn','sameIndustryCode','selfNumber','place','stockCount','isAvailable','ingramCount','discount','netPrice','netPriceTerm','favorablePrice','favorablePriceTerm',
                'supplierNo','isPod','isSale','issueState','update','isMail','outIndicator','bookAwardInformation','libraryRecommendationInformat','label','readers'
            ]
        }
    },
    computed:{
        ...mapGetters(['site']),
    },
    components:{
        imgCheck,
        wordCheck,
        assistSearch,
        introduction,
        classification,
        relevance,
        relatedRecommend,
        price
    },
    created(){
        this.getbookInfo()
        this.getDictList(['txtReadResult','imagesManualReadResult','imagesAutoReviewResult','site'])
    },
    methods: {
        ...mapActions(['getDictList']),
        addPersonLiables(){
            this.bookData.personLiables.value.push({})
        },
        changeSite(data,info){
            info.site=data.sourceSite
            info.value=data.fieldValue
        },
        getSource(name){
            this.sourceData=[];
            let params={
                isbn:this.$route.query.isbn,
                columnName:name
            }
            this.sourceLoading=true;
            this.$etlGet('/api/datamerge/dataSwitching',params).then(res=>{
                this.sourceLoading=false;
                if (res.data&&res.data.length>0) {
                    this.sourceData=res.data
                }
            }).catch(err=>{
                this.sourceLoading=false;
            })
        },
        prev(){
            let index=this.bookCheckList.indexOf(this.$route.query.isbn)
            this.$router.push({path:'/bookDetail',query:{isbn:this.bookCheckList[index-1]}})
            this.reload() 
        },
        next(){
            let index=this.bookCheckList.indexOf(this.$route.query.isbn)
            this.$router.push({path:'/bookDetail',query:{isbn:this.bookCheckList[index+1]}})
            this.reload() 
        },
        changeLock(val){
            this.$confirm('确定'+(val?'锁定?':'解锁?'), '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.$get('/api/product/updateIsLock',{isbns:this.$route.query.isbn,isLock:val}).then(res=>{
                if (res.success) {
                    this.$message.success(res.message);
                    this.getbookInfo()
                }else{
                    this.$message.error(res.message);
                }
                })
            })
        },
        changeBlock(val){
            this.$confirm('确定'+(val?'停用?':'启用?'), '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.$get('/api/product/updateIsBlockUp',{isbns:this.$route.query.isbn,isBlockUp:val}).then(res=>{
                if (res.success) {
                    this.$message.success(res.message);
                    this.getbookInfo()
                }else{
                    this.$message.error(res.message);
                }
                })
            })
        },
        saveBookInfo(str){
            let arr=[]
            this.bookData.personLiables.value.forEach(item=>{
                if (item.name||item.role||item.cnPersonLiableIntroduction||item.personLiableIntroduction) {
                    arr.push(item)
                }
            })
            this.bookData.personLiables.value=arr
            this.loading=true;
            if (this.$route.query.type!='replenish') {
                this.$refs.wordCheck.sava();
            }
            this.$refs.classification.saveProductSort();
            this.$refs.relevance.saveRelevance();
            this.$refs.relatedRecommend.save();
            this.$post('/api/product/updateProduct',this.bookData).then(res=>{
                this.loading=false;
                if (res.success) {
                    this.$message.success('保存成功')
                    if (str=='下一条') {
                        this.next();
                    }else{
                        this.reload()
                    }
                } else {
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.loading=false;
            })
        },
        async getbookInfo(){
            this.allowUpdata=false;
            this.loading=true;
           await this.$get('/api/product/findProductIsByIsbnIs',{isbn:this.$route.query.isbn}).then(res=>{
                this.loading=false;
                if (res.data.result&&res.data.result.length>0) {
                    let obj=res.data.result[0];
                    let arr=[];
                    for (const k in obj) {
                        arr.push(k)
                    }
                    this.attrList.forEach(item=>{
                        if (arr.indexOf(item)==-1) {
                            if (item=='personLiables') {
                                obj.personLiables={}
                                obj.personLiables.value=[{}]
                            } else {
                                obj[item]={}
                            }
                        }
                    })
                    this.bookData=obj;
                    this.$nextTick(()=>{
                        let bookName=this.bookData.bookName?this.bookData.bookName.value:'';
                        if (this.$route.query.type!='replenish') {
                            this.$refs.assistSearch.initSearch(bookName);
                        }
                        this.$refs.relevance.initData(this.bookData);
                    })
                }
            }).catch(err=>{
                this.loading=false;
            })
        },
    }
}
</script>
<style lang='scss' scoped>
#bookDetail{
    padding:15px;
    background: #fff;
    min-height:100%;
    border-radius: 5px;
    .content{
        display:flex;
        .bookInfo{
            width: 60%;
            height:100%;
            .tit{
                display:flex;
                justify-content: space-between;
                .back{
                    cursor: pointer;
                    &:hover{
                        color: #409eff;
                    }
                }
            }
            .table{
                margin-top:10px;
                font-size:13px;
                border: solid 1px #e3e3e3;
                border-bottom:none;
                background: #eaf3f9;
                .marginTop{
                    margin-top:10px;
                }
                .el-row{
                    background: #fff;
                    border-bottom: solid 1px #e3e3e3;
                    .textareaDiv{
                        height:82px;
                    }
                    .haveCopy{
                        display:flex;
                        align-items: center;
                    }
                    .el-col{
                        min-height:28px;
                        border-left: solid 1px #e3e3e3;
                        &:first-child{
                            border-left:none;
                        }
                        label{
                            line-height:28px;
                            padding-left:6px;
                        }
                        div{
                            line-height:28px; 
                        }
                        .red{
                            color:red;
                        }
                        .siteDiv{
                            display: inline-block;
                            width:calc(100% - 130px);
                        }
                        .inputW{
                            display: inline-block;
                            width:calc(100% - 50px);
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .about{
                            height:82px;
                            overflow-y: auto;
                        }
                        .pl15{
                            padding-left: 15px;
                        }
                        .source{
                            padding: 2px 5px;
                            border: solid 1px #a1a1a1;
                            border-radius: 67%;
                            font-size: 12px;
                            color: #a1a1a1;
                            margin-left: 3px;
                        }
                        i,span{
                            display:none;
                        }
                        span{
                            cursor: default;
                        }
                        &:hover i,&:hover span{
                            display: inline;
                        }
                    } 
                }
                .addBtn{
                    text-align: right;
                    margin-right: 5px;
                    font-size: 20px;
                    color: #409eff;
                    cursor: pointer;
                }
            }
        }
        .other{
            width: 40%;
            margin-left:10px;
            height:100%;
            .pagingDiv{
                min-height:40px;
                .paging{
                    width: 100%;
                    font-size:14px;
                    color: gray;
                    text-align: right;
                    line-height:40px;
                    .page{
                        color:#c3c3c3;
                        margin:0 5px;
                        .curPage{
                            color: #409eff;
                        }
                    }
                }
            }
            .el-tabs{
                min-height:300px;
            }
        }
    }
    .btns{
        margin:50px 0 30px 0;
        text-align: center;
        .el-button{
            width:100px;
            margin-right:20px;
        }
    }
}
.sourceName{
    cursor:pointer;
    &:hover{
        color: #409eff;
    }
}
</style>

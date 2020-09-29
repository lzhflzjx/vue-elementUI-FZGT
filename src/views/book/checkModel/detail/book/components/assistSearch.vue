<template>
    <div id='assistSearch'>
        <div class="searchDic=v">
            <el-input size="small" style="width:400px;" v-model="searchInput" placeholder="请输入查询内容" @keyup.enter.native='search'></el-input>
            <el-button size="small" type="primary" @click="search">查询</el-button>
        </div>
        <div class="cont">
            <div class="listDiv" v-loading='loading'>
                <div v-for="(item,index) in resultList" class="list">
                    <span class="index">{{index+1}}</span>
                    <div class="rgCont">
                        <div class="tit">
                            <span v-html="item.isShowAll?item.assetPath:(item.assetPath.length>200?item.assetPath.slice(0,200)+'...':item.assetPath)"></span>
                            <span class="showBtn" @click="item.isShowAll=!item.isShowAll" v-if="item.assetPath.length>200" :title="item.isShowAll?'收起':'展开'" :class="item.isShowAll?'iconfont icon-shouqi1':'iconfont icon-zhankai1'"></span>
                        </div>
                        <div class="source">
                            <span v-text="item.source"></span>
                            <span v-text="methods.changeTime(item.createDate)"></span>
                        </div>
                        <a :href="item.location" target="_blank">{{item.location}}</a>
                    </div>
                </div>
                <div class="page" v-if="resultList.length>0">
                    <span class="getMore" @click="handleCurrentChange" v-if="!noMore">点击加载更多</span>
                    <span v-if="noMore">没有更多了</span>
                </div>
                <div class="noData" v-if="noData">未查询到相关信息</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            searchInput:'',
            resultList:[],
            currentPage:1,
            curPageSize:10,
            loading:false,
            noMore:false,
            noData:false,
        }
    },
    methods: {
        initSearch(bookName){
            if (!bookName) {
                return
            }
            this.searchInput=bookName
            this.search()
        },
        search(){
            if (this.searchInput.trim()==='') {
                this.$message.warning('搜索内容不能为空');
                return
            }
            this.resultList=[]
            this.noData=false
            this.noMore=false
            this.getResult()
        },
        getResult(){
            let params={
                keyword:this.searchInput,
                pageNum:this.currentPage,
                pageSize:this.curPageSize
            }
            this.loading=true
            this.$get('/api/product/findFTSByKeyword',params).then(res=>{
                this.loading=false
                if (res.data.result&&res.data.result.length>0) {
                    res.data.result.forEach(item => {
                        item.assetPath=item.assetPath.replace(new RegExp(this.searchInput,'g'),`<span style='color:red;'>${this.searchInput}</span>`)
                        item.isShowAll=false
                        this.resultList.push(item)
                    });
                }else{
                    this.noMore=true
                }
                if (this.resultList.length==0) {
                    this.noData=true
                }
            }).catch(err=>{
                this.loading=false
            })
        },
        handleCurrentChange() {
            this.currentPage++;
            this.getResult()
        }
    }
}
</script>
<style lang='scss' scoped>
#assistSearch{
    .cont{
        max-height:1035px;
        overflow-y: auto;
        font-size: 14px;
        margin-top:15px;
        /deep/ img{
            width: 100%;
            height: auto;
        }
        .noData{
            text-align: center;
            color: #c3c3c3;
            margin-top: 50px;
        }
        .listDiv{
            min-height:200px;
            .list{
                display:flex;
                margin-top: 20px;
                .index{
                display: inline-block;
                width: 25px;
                height: 25px;
                line-height:25px;
                text-align: center;
                color: gray;
                font-size: 13px;
                border: solid 1px gray;
                border-radius: 50%; 
                }
                .rgCont{
                    width: calc(100% - 40px);
                    margin-left: 10px;
                    .tit{
                        .showBtn{
                            color: gray;
                            font-size: 16px;
                            cursor: pointer;
                            &:hover{
                                color: #409eff;
                            }
                        }
                    }
                    .source{
                        margin-top:15px;
                        color: gray;
                        span{
                            margin-right:20px;
                            font-size: 13px;
                        }
                    }
                    a{  
                        color: #179bd5;
                        font-size: 13px;
                        display:block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
            .page{
                font-size: 14px;
                color: #c3c3c3;
                text-align: center;
                margin: 20px 0;
                .getMore{
                    color: #409eff;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>

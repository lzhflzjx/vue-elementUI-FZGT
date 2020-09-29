import axios from 'axios';
const dict = {
    state: {
        readerLoading:false,
        readerList:[],// 审读人树
        reader:[],// 审读人
        reviewLevel:[],// 优先级
        taskSource:[],// 任务来源
        binding: [],// 装帧
        language: [],// 文版
        commonReadResult: [],// 人工和机器审读结果
        // 可售管理的字典
        manualReviewResult: [],// 人工审读结果
        autoReviewResult: [],// 机器审读结果
        manualReviewUser: [],// 文字人工审读人
        imageReadResult: [],// 图片审读结果
        entityReadResult: [],// 实物审读结果
        // ------------------------------
        crawlStatus: [],// 采集状态
        missionSource: [],//采集管理任务来源
        finish: [],//采集完成状态
        // -------------------------------
        imagesAutoReviewResult: [],// 图片机审结果
        imagesManualReadResult: [],// 图片人审结果
        txtReadResult:[],// 文字审读结果
        redReviewLevle:[],//红名单审读等级
        site:[],//图片来源
        ctClassification:[],//中图法
        bisacClassification:[],//BISAC分类
        classification1:[],//业务分类1
        classification2:[],//业务分类2
        imgSensitiveType:[],//图片敏感类型
        //-------------------------------馆藏
        gcLevel: [], //馆藏信息等级
        gcType: [], //馆藏信息类型
        gcCategory: [], //馆藏数据库类型
        taskStuats:[],//数据库任务状态
        resultStuats:[],//数据库结果状态
        // -----------------------------知识库榜单库
        rankingListCollectionType:[], //榜单类型
        exampleSite:[], //榜单类型
        // ---------------------------知识库奖项库
        awardsObjectType: [],//获奖对象类型
        awardsLevel: [],//奖项等级
        awardsType: [],//奖项类型
        // ---------------------------报刊实物审读
        paperReview: [],//审读结果/名单
        paperProblemType: [],//问题类型
        paperReviewOpinion: [],//处理意见

        productClassify: [],//全库字段分类
    },
    actions: {
        // 获取分类数据
        getClassify({state},nameList){
            nameList.forEach(name=>{
                var obj={};
                if (name=='imgSensitiveType') {
                    obj.type='2'
                }
                if (name=='ctClassification') {
                    obj.type='5'
                }
                if (name=='bisacClassification') {
                    obj.type='7'
                }
                if (name =='classification1') {
                    obj.type='3'
                }
                if (name =='classification2') {
                    obj.type='4'
                }
                axios.post('br/api/sortManage/findListByPraentId',obj).then(res=>{
                    state[name]=res.data.data.result
                })
            })
        },
        // 获取字典数据
        getDictList({state},nameList){
            nameList.forEach(name=>{
                var obj={code:name};
                axios.get('br/api/dic/selectByCode',{params:obj}).then(res=>{
                    state[name]=res.data.data?res.data.data.dictionaryInfoList:[]
                })
            })
        },
        // 获取审读人数据
        getReaderList({state},modelType){
            state.readerList=[]
            let obj={}
            if (modelType=='book') {
                obj.permission='F_BR_MG'
                obj.flag=0
            } else if (modelType=='img'){
                obj.permission='F_BI_MG'
                obj.flag=1
            }else{
                obj.permission='F_BR_PRESS'
                obj.flag=2
            }
            state.readerLoading=true
            axios.get('br/api/mission/getUserList',{params:obj}).then(res=>{
                if (res.data.data.result&&res.data.data.result.length>0) {
                    var arr=[]
                    var ids=[]
                    var personList=[]
                    res.data.data.result.forEach(item=>{
                        personList.push({
                            value: item.id,
                            name: item.name 
                        })
                        if (ids.indexOf(item.deptId)==-1) {
                            ids.push(item.deptId)
                            arr.push({
                                id:item.deptId,
                                label:item.deptName,
                                children:[]
                            })
                        }
                        arr.forEach(tree=>{
                            if (tree.id==item.deptId) {
                                tree.children.push({
                                    id:item.id,
                                    label:item.name,
                                    count:item.count
                                })
                            }
                        })
                    }) 
                    state.readerList=arr
                    state.reader=personList
                    state.readerLoading=false
                }
            })
        },
    }
}
export default dict
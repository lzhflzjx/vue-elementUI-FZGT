import axios from 'axios';

// 索引 0
function getReviewUserList(){
    // 获取审读人员
    return axios.get('br/api/mission/getUserList',{
        params:{
            permission:'F_BR_MG',
            flag:0
        }
    })
}
function handlerReviewUserList(res){
    let curResult = {}
    if(res && res.result){
        res.result.forEach(ele => {
            if(ele && ele.id){
                curResult[ele.id] = ele.name
            }
        });
    }
    return curResult;
}

// 索引1
function getEntityReadResult(){
    // 获取实物审读结果
    return axios.get('br/api/dic/selectByCode',{
        params:{
            code:'entityReadResult'
        }
    })
}

function handlerEntityReadResultFuc(res){
    let curResult = {}
    if(res && res.dictionaryInfoList){
        res.dictionaryInfoList.forEach(ele=>{
            if(ele && ele.value){
                curResult[ele.value] = ele.name
            }
        })
    }
    return curResult;
}



// 索引2
function getPublishDic(){
    // 获取出版社
    return axios.post('br/api/publisher/selectPublishDic')
}


function handlerPublisherFuc(res){
    let curResult = {}
    if(res && res.length>0){
        res.forEach(ele=>{
            if(ele && ele.id){
                curResult[ele.id] = ele.publishers
            }
        })
    }
    return curResult;
}

// 索引3
function getSensitiveWord(){
    // 获取问题类型 == 敏感词类型
    return axios.post('br/api/sortManage/findListByPraentId',{type:1})
}


function handlerSensitiveWordFuc(res){
    let curResult = []
    if(res && res.result){
        curResult = res.result;
    }
    return curResult;
}

function handleResultData(res, idx, typeReq){
    let {status, data} = res;
    if(status==200 && data){
        if(data.status==0 && data.success && data.data){
            if(typeReq=='Unchanged'){
                let curResult = [];
                switch (idx){
                    case 0: curResult = data.data.result?data.data.result:[];break;
                    case 1: curResult = data.data.dictionaryInfoList?data.data.dictionaryInfoList:[];break;
                    case 2: curResult = data.data?data.data:[];break;
                    case 3: curResult = data.data.result?data.data.result:[];break;
                    default:console.log("暂无此种处理情况");
                }
                return curResult;
            }else if(typeReq=='Obj'){
                let curResult = {};
                switch (idx){
                    case 0:curResult = handlerReviewUserList(data.data);break; // 审读员
                    case 1:curResult = handlerEntityReadResultFuc(data.data);break; // 实物审读结果 
                    case 2:curResult = handlerPublisherFuc(data.data);break; // 出版社
                    case 3:curResult = handlerSensitiveWordFuc(data.data);break; // 问题类型==敏感词类
                    default:console.log("暂无此种处理情况");
                }
                return curResult;
            }
        }else{
            if(typeReq=='Unchanged'){
                return [];
            }else if(typeReq=='Obj'){
                return {};
            }
        }
    }else{
        if(typeReq=='Unchanged'){
            return [];
        }else if(typeReq=='Obj'){
            return {};
        }
        
    }
}

async function getEntityReadAllDicList(){
    let DicListAll = {
        Obj:[],
        Unchanged:[],
    }
    // typeReq : Obj返回为对象类型 | Unchanged 保持原状
    let results  = await Promise.all([getReviewUserList(), getEntityReadResult(), getPublishDic(), getSensitiveWord()])
    // console.log("======666==============")
    // console.log(results)
    DicListAll.Obj = results.map((curObj, idx)=>{
        return handleResultData(curObj, idx, 'Obj')
    })
    DicListAll.Unchanged = results.map((curObj, idx)=>{
        return handleResultData(curObj, idx, 'Unchanged')
    })
    // console.log(JSON.stringify(DicListAll))
    return DicListAll
}

export default getEntityReadAllDicList
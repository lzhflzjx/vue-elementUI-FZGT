let express=require('express')
let Mock=require('mockjs')

let app=express()

app.use('/data/mockData',function (req,res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.json(Mock.mock({
        'status':200,
        'id|+1':1,
        'name':'@cname'
    }))
})

app.listen('8000',()=>{
    console.log('已连接到8000')
})
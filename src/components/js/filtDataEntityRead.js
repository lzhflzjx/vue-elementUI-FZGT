let filtDataList = [
    {
        label: 'ISBN', // 显示汉字名称
        relation:'and', 
        condition:'equal', //  equal  contain between
        valType:'file', //  file  input date number  tree   %  数字[valOption索引](值为枚举多选) ===  singleSelect(枚举单选)|multipleSelect(枚举多选) 
        val:'', // 绑定值 实际获取值
        name:'isbn', // 字段名称 向服务器传递名称
        type:'String' // 向服务器传递字段名称类型
    },
    {
        label: '书名',
        relation:'and',
        condition:'contain',
        valType:'input',
        val:'',
        name:'bookName',
        type:'String'
    },
    {
        label: '责任人',
        relation:'and',
        condition:'contain',
        valType:'input',
        val:'',
        name:'principal',
        type:'String'
    },
    {
        label: '出版社',
        relation:'and',
        condition:'contain',
        valType:'multipleSelect',
        valTypeIndex:2,
        val:'',
        name:'publisher',
        type:'String'
    },
    {
        label: '审读员',
        relation:'and',
        condition:'contain',
        valType:'multipleSelect',
        valTypeIndex:0,
        val:'',
        name:'reviewUser',
        type:'String'
    },
    {
        label: '审读时间',
        relation:'and',
        condition:'between',
        valType:'date',
        betweenVal:'',
        val:'',
        name:'reviewDate',
        type:'date'
    },
    {
        label: '实物审读结果',
        relation:'and',
        condition:'contain',
        valType:'multipleSelect',
        valTypeIndex:1,
        val:'',
        name:'reviewResult',
        type:'String'
    },
    {
        label: '问题类型',
        relation:'and',
        condition:'equal',
        valType:'tree',
        valTypeIndex:3,
        val:'',
        name:'sensitiveClassification',
        type:'String'
    }
];

let tableHeader = [
    {
        prop:"autoReviewResult",
        label:"机审结果"
    },
    {
        prop:"manuelReviewResult",
        label:"人审结果"
    },
    {
        prop:"entReviewResult",
        label:"实物审读结果"
    },
    {
        prop:"entReviewUser",
        label:"审读员"
    },
    {
        prop:"isbn",
        label:"ISBN",
        width:'160'
    },
    {
        prop:"bookName",
        label:"主书名"
    },
    {
        prop:"secondName",
        label:"副书名"
    },
    {
        prop:"transNameCn",
        label:"中文译名"
    },
    {
        prop:"principal",
        label:"责任人"
    },
    {
        prop:"publisher",
        label:"出版社"
    },
    {
        prop:"lastmodifyTime",
        label:"实审时间",
        width:'200'
    },
    {
        prop:"sensitiveClassification",
        label:"问题类型"
    }
]
let baseInfosHeader = [
    {
        prop:"isbn",
        label:"ISBN",
        row:2
    },
    {
        prop:"transNameCn",
        label:"图书中文译名",
        row:2
    },
    {
        prop:"bookName",
        label:"原版图书名称",
        row:1// 1代表整行布局 2代表左右布局
    },
    {
        prop:"publisher",
        label:"出版社名称",
        row:2
    },
    {
        prop:"publishRegion",
        label:"出版国家/地区",
        row:2
    },
    {
        prop:"author",
        label:"作者",
        row:2
    },
    {
        prop:"publicationYear",
        label:"出版年代",
        row:2
    }
]

let orderListHeaders = [
    {
        prop:"orderTime",
        label:"订购时间"
    },
    {
        prop:"orderNo",
        label:"订单号"
    },
    {
        prop:"orderUser",
        label:"订户"
    },
    {
        prop:"disposeOpinion",
        label:"处理意见"
    },
    {
        prop:"problemPicturePath",
        label:"处理图片"
    },
    {
        prop:"remark",
        label:"备注"
    },
    {
        prop:"disposeUser",
        label:"订单处理人"
    },
    {
        prop:"disposeTime",
        label:"处理时间"
    }
]

export default {filtDataList, tableHeader, baseInfosHeader, orderListHeaders}
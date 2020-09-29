var filtDataList=[
    {
        label: '文版',//0
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:0,
        val:'英文',
        name:'language',
        type:'String'
    },
    {
        label: 'ISBN',//1
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:'file',
        val:'',
        name:'isbn',
        type:'String'
    },
    {
        label: '主书名',//2
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'bookName',
        type:'String'
    },
    {
        label:'业务分类',//3
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'classification1',
        type:'String'
    },
    {
        label: '副书名',//4
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'secondName',
        type:'String'
    },
    {
        label:'中图法',//5
        relation:'and',
        conditionType:1,
        condition:'equal',
        dataType:'tree',
        valType:12,
        val:'',
        name:'ctClassification',
        type:'String'
    },
    {
        label: '丛书名',//6
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'seriesName',
        type:'String'
    },
    {
        label:'BISAC分类',//7
        relation:'and',
        conditionType:1,
        condition:'equal',
        dataType:'tree',
        valType:13,
        val:'',
        name:'bisacClassification',
        type:'String'
    },
    {
        label: '标签',//8
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'label',
        type:'String'
    },
    {
        label: '出版时间',//9
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:'date',
        betweenVal:'',
        val:'',
        name:'pubDate',
        type:'date'
    },
    {
        label:'任务编号',//10
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:'number',
        val:'',
        name:'id',
        type:'digital'
    },
    {
        label:'任务来源',//11
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:2,
        val:'',
        name:'source',
        type:'String'
    },
    {
        label:'数量',//12
        relation:'and',
        conditionType:4,
        condition:'greaterEqual',
        valType:'number',
        val:'',
        secondVal:'',
        name:'count',
        type:'digital'
    },
    {
        label:'优先级',//13
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:1,
        val:'',
        name:'priority',
        type:'digital'
    },
    {
        label:'任务进度',//14
        relation:'and',
        conditionType:4,
        condition:'greaterEqual',
        valType:"%",
        val:'',
        secondVal:'',
        name:'progress',
        type:'digital'
    },
    {
        label:'要求完成时间',//15
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:"date",
        betweenVal:'',
        val:'',
        name:'complete_date',
        type:'date'
    },
    {
        label:'审读人',//16
        relation:'and',
        conditionType:1,
        condition:'equal',
        dataType:'array',
        valType:6,
        val:'',
        name:'userid',
        type:'digital'
    },
    {
        label:'生成时间',//17
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:"date",
        betweenVal:'',
        val:'',
        name:'create_date',
        type:'date'
    },
    {
        label: '状态',//18
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:8,
        val:1,
        name:'missionStatus',
        type:'digital'
    },
    {
        label:'是否主图',//19
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:9,
        val:'',
        name:'imageType',
        type:'String'
    },
    {
        label:'图片来源',//20
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:3,
        val:'',
        name:'site',
        type:'String'
    },
    {
        label:'上传时间',//21
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:'date',
        betweenVal:'',
        val:'',
        name:'update',
        type:'date'
    },
    {
        label:'机审结果',//22
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:5,
        val:'',
        name:'autoReviewResult',
        type:'digital'
    },
    {
        label:'机审时间',//23
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:"date",
        betweenVal:'',
        val:'',
        name:'autoReviewDate',
        type:'date'
    },
    {
        label:'人审结果',//24
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:11,
        val:'',
        name:'manualReviewResult',
        type:'digital'
    },
    {
        label:'人审时间',//25
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:"date",
        betweenVal:'',
        val:'',
        name:'manualReviewDate',
        type:'date'
    },
    {
        label:'敏感类型',//26
        relation:'and',
        conditionType:1,
        condition:'equal',
        dataType:'tree',
        valType:16,
        val:'',
        name:'sensitiveType',
        type:'String'
    },
    {
        label:'批次',//27
        relation:'and',
        conditionType:4,
        condition:'equal',
        valType:'number',
        val:'',
        secondVal:'',
        name:'batch',
        type:'digital'
    },
    {
        label:'审读等级',//28
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:10,
        val:'',
        name:'readLevel',
        type:'String'
    },
    {
        label:'责任人',//29
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'personLiables',
        type:'String'
    },
    {
        label:'责任角色',//30
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'personLiableRole',
        type:'String'
    },
    {
        label:'出版社',//31
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'publishers',
        type:'String'
    },
    {
        label:'人工审读时间',//32
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:"date",
        betweenVal:'',
        val:'',
        name:'update',
        type:'date'
    },
    {
        label:'创建人',//33
        relation:'and',
        conditionType:1,
        condition:'equal',
        dataType:'array',
        valType:6,
        val:'',
        name:'creater',
        type:'String'
    },
    {
        label:'创建时间',//34
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:"date",
        betweenVal:'',
        val:'',
        name:'create_date',
        type:'date'
    },
    {
        label:'修改时间',//35
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:"date",
        betweenVal:'',
        val:'',
        name:'update_date',
        type:'date'
    },
    {
        label: '规则名称',//36
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'ruleName',
        type:'String'
    },
    {
        label:'规则类型',//37
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:7,
        val:'',
        name:'ruleType',
        type:'String'
    },
    {
        label: '全书名',//38
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'bookName',
        type:'String'
    },
    {
        label: '触发采集状态',//39
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:4,
        val:'',
        name:'collectStatus',
        type:'String'
    },
    {
        label: '所属集团',//40
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'membershipGroup',
        type:'String'
    },
    {
        label: '语种',//41
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:0,
        val:'',
        name:'language',
        type:'String'
    },
    {
      label:'审读人',//42
      relation:'and',
      conditionType:1,
      condition:'equal',
      dataType:'array',
      valType:6,
      val:'',
      name:'manualReviewUser',
      type:'String'
    },
    {
      label: 'ISBN',//43
      relation:'and',
      conditionType:1,
      condition:'equal',
      valType:'file',
      val:'',
      name:'sn',
      type:'String'
    },
    {
      label: '序号',//44
      relation:'and',
      conditionType:4,
      condition:'greaterEqual',
      valType:'number',
      val:'',
      secondVal:'',
      name:'number',
      type:'digital'
    },
    {
        label: '主副书名',//45
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'bookName',
        type:'String'
    },
    // 报刊库
    {
        label: '刊号',//46
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'pressNo',
        type:'String'
    },
    {
        label: '刊名',//47
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'name',
        type:'String'
    },
    {
        label: '出版地',//48
        relation: 'and',
        conditionType: 2,
        condition: 'contain',
        valType: 'input',
        val: '',
        name: 'publishLocate',
        type: 'String'
    },
    {
        label: 'ISSN',//49
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'file',
        val: '',
        name: 'issn',
        type: 'String'
    },
    {
        label: '出版社',//50
        relation: 'and',
        conditionType: 2,
        condition: 'contain',
        valType: 'input',
        val: '',
        name: 'publisher',
        type: 'String'
    },
    {
        label: '审读结果',//51
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 18,
        val: '',
        name: 'nameList',
        type: 'String'
    },
    {
        label:'审读员',//52
        relation:'and',
        conditionType:1,
        condition:'equal',
        dataType:'array',
        valType:6,
        val:'',
        name:'reviewUserId',
        type:'digital'
    },
    {
        label:'审读时间',//53
        relation:'and',
        conditionType:3,
        condition:'between',
        valType:"date",
        betweenVal:'',
        val:'',
        name:'reviewDate',
        type:'date'
    },
    {
        label: '审读意见',//54
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 19,
        val: '',
        name: 'reviewOpinion',
        type: 'String'
    },
    {
        label: '刊号',//55
        relation:'and',
        conditionType:1,
        condition:'equal',
        valType:'input',
        val:'',
        name:'paperCode',
        type:'String'
    },
    {
        label: '刊名',//56
        relation:'and',
        conditionType:2,
        condition:'contain',
        valType:'input',
        val:'',
        name:'paperName',
        type:'String'
    },
    {
        label: 'ISSN',//57
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'file',
        val: '',
        name: 'zIssn',
        type: 'String'
    },
];
var conditionOption=[
    [{
        value: 'and',
        label: '并且'
    },{
        value: 'or',
        label: '或者'
    }],
    [{
        value: 'equal',
        label: '等于'
    },{
        value: 'notEqual',
        label: '不等于'
    }],
    [{
        value: 'contain',
        label: '包含'
    },{
        value: 'notContain',
        label: '不包含'
    }],
    [{
        value: 'between',
        label: '介于'
    },{
        value: 'beforeTime',
        label: '时间之前'
    },{
        value: 'afterTime',
        label: '时间之后'
    }],
    [{
        value: 'greaterEqual',
        label: '>='
    },{
        value: 'greater',
        label: '>'
    },{
        value: 'lessThanEqual',
        label: '<='
    },{
        value: 'lessThan',
        label: '<'
    },{
        value: 'equal',
        label: '等于'
    },{
        value: 'notEqual',
        label: '不等于'
    },{
        value: 'between',
        label: '介于'
    }],
];
export default {conditionOption,filtDataList}
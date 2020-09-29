var bookList=[
    {
        label: '基本信息',
        options: [
            {
                label: 'ISBN',
                relation:'and',
                conditionType:1,
                condition:'equal',
                valType:'file',
                val:'',
                name:'isbn',
                type:'String'
            },
            {
                label: 'ISMN',
                relation:'and',
                conditionType:1,
                condition:'equal',
                valType:'input',
                val:'',
                name:'ismn',
                type:'String'
            },
            {
                label: '主副书名',
                relation:'and',
                conditionType:2,
                condition:'contain',
                valType:'input',
                val:'',
                name:'bookName',
                type:'String'
            },
            {
                label: '丛书名',
                relation:'and',
                conditionType:2,
                condition:'contain',
                valType:'input',
                val:'',
                name:'seriesName',
                type:'String'
            },
            {
                label: '载体',
                relation:'and',
                conditionType:1,
                condition:'equal',
                valType:'input',
                val:'',
                name:'medium',
                type:'String'
            },
            {
                label: '装帧',
                relation:'and',
                conditionType:1,
                condition:'equal',
                valType:'input',
                val:'',
                name:'binding',
                type:'String'
            },
            {
                label: '中文参考译名',
                relation:'and',
                conditionType:1,
                condition:'equal',
                valType:'input',
                val:'',
                name:'cnName',
                type:'String'
            },
            {
                label: '出版社',
                relation:'and',
                conditionType:1,
                condition:'equal',
                valType:'input',
                val:'',
                name:'publishers',
                type:'String'
            },
            {
                label: '所属集团',
                relation:'and',
                conditionType:1,
                condition:'equal',
                valType:'input',
                val:'',
                name:'membershipGroup',
                type:'String'
            },
            {
                label:'责任人',
                relation:'and',
                conditionType:2,
                condition:'contain',
                valType:'input',
                val:'',
                name:'personLiables',
                type:'String'
            },
        ]
    },{
        label: '分类',
        options: [
            {
                label:'中图法',
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
                label:'BISAC分类',
                relation:'and',
                conditionType:1,
                condition:'equal',
                dataType:'tree',
                valType:13,
                val:'',
                name:'bisacClassification',
                type:'String'
            },
        ]
    },{
        label: '审读',
        options: [
            {
                label:'机审时间',//23
                conditionType:3,
                condition:'between',
                valType:"date",
                betweenVal:'',
                val:'',
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
        ]
    },{
        label: '价格',
        options: [
            {
                label: '价格',
                relation:'and',
                conditionType:1,
                condition:'equal',
                valType:'input',
                val:'',
                name:'price',
                type:'String'
            },
        ]
    },



    
];

var pressList = [
    {
        label: '期数',//0
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'input',
        val: '',
        name: 'issue',
        type: 'digital',
    },
    {
        label: '状态',//1
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'input',
        val: '',
        name: 'status',
        type: 'String'
    },
    {
        label: '中图分类号',//2
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'input',
        val: '',
        name: 'chClassNo',
        type: 'String'
    },
    {
        label: '文种',//3
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'input',
        val: '',
        name: 'language',
        type: 'String'
    },
    {
        label: '是否核心刊',//4
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 17,
        val: "",
        name: 'isCompendex',
        type: 'String'
    },
    {
        label: '中图币制',//5
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'input',
        val: '',
        name: 'chCurrency',
        type: 'String'
    },
    {
        label: '中图刊价',//6
        relation: 'and',
        conditionType: 4,
        condition: 'between',
        valType: 'number',
        val: '',
        secondVal:'',
        name: 'chPrice',
        type: 'digital'
    },
    {
        label: '创刊年',//7
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'input',
        val: '',
        name: 'creadYear',
        type: 'String'
    },
    {
        label: '编目日期',//8
        relation: 'and',
        conditionType: 3,
        condition: 'between',
        valType: "date",
        betweenVal: '',
        val: '',
        name: 'catalogDate',
        type: 'date'
    },
    {
        label: '是否OA刊',//4
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 17,
        val: "",
        name: 'isOa',
        type: 'String'
    },
    {
        label: '是否需要审读',//4
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 17,
        val: "",
        name: 'isRead',
        type: 'String'
    },
    {
        label: '总署刊分类',//2
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'input',
        val: '',
        name: 'allClass',
        type: 'String'
    },
    {
        label: '影响因子',//2
        relation: 'and',
        conditionType: 1,
        condition: 'equal',
        valType: 'input',
        val: '',
        name: 'impactFactor',
        type: 'String'
    },
]
export default { bookList, pressList}
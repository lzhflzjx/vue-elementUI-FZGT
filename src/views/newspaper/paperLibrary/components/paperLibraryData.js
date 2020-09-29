var basicOption = [
    {
        label: "刊号：",//0
        name: "pressNo",
        input: null,
        logo: "*"
    },
    {
        label: "关联刊号：",//1
        name: "relationPressNo",
        input: null,
        relation: true,
        placeholder: '刊号之间用 ; 分离',
    },
    {
        label: "刊名：",//2
        name: "name",
        input: null,
        logo: "*"
    },
    {
        label: "ISSN：",//3
        name: "issn",
        input: null,
        unEdit: false,
    },
    {
        label: "期数：",//4
        name: "issue",
        input: null
    },
    {
        label: "状态：",//5
        name: "status",
        input: null
    },
    {
        label: "中图分类号：",//6
        name: "chClassNo",
        input: null
    },
    {
        label: "文种：",//7
        name: "language",
        input: null
    },
    {
        label: "是否核心刊：",//8
        name: "isCompendex",
        input: null,
        type: "drop",
        conditionType: 0
    },
    {
        label: "中图币制：",//9
        name: "chCurrency",
        input: null
    },
    {
        label: "中图刊价：",//10
        name: "chPrice",
        input: null
    },
    {
        label: "创刊年：",//11
        name: "creadYear",
        input: null
    },
    {
        label: "编目日期：",//12
        name: "catalogDate",
        input: null,
        type: "date",
    },
    {
        label: "出版社：",//13
        name: "publisher",
        input: null,
        type: "pulisher",
    },
    {
        label: "出版地：",//14
        name: "publishLocate",
        input: null
    },
    {
        label: "原文简介：",//15
        name: "brifIntroduction",
        input: null
    },
    {
        label: "译文简介：",//16
        name: "translatIntroduction",
        input: null
    },
    {
        label: "馆藏年度：",//17
        name: "gcYear",
        input: null
    },
    {
        label: "馆藏卷号：",//18
        name: "gcNumber",
        input: null
    },
    {
        label: "馆藏期次：",//19
        name: "gcPeriod",
        input: null
    },
    {
        label: "馆藏信息：",//20
        name: "gcInfo",
        input: null
    },
    {
        label: "版本：",//21
        name: "edition",
        input: null
    },
    {
        label: "注记：",//22
        name: "note",
        input: null
    },
    {
        label: "编号：",//23
        name: "number",
        input: null
    },
    {
        label: "是否OA刊：",//24
        name: "isOa",
        input: null,
        type: "drop",
        conditionType: 0
    },
    {
        label: "是否有索引：",//25
        name: "isIndex",
        input: null,
        type: "drop",
        conditionType: 0
    },
]
var publisherOption = [
    {
        label: "订购政策：",//0
        name: "orderPolicy",
        input: null
    },
    {
        label: "取消政策：",//1
        name: "cancelPolicy",
        input: null
    },
    {
        label: "催缺政策：",//2
        name: "urgePolicy",
        input: null
    },
]
var issuesOption = [
    {
        label: "每年出版卷数：",//0
        name: "publishCount",
        input: null
    },
    {
        label: "起始卷：",//1
        name: "beginVolume",
        input: null
    },
    {
        label: "起始卷日期：",//2
        name: "beginVolumeDate",
        input: null,
        type: "date",
    },
    {
        label: "出版时间：",//3
        name: "pubDate",
        input: null,
        type: "date",
    },
]
var themeOption = [
    {
        label: "LC代码：",//0
        name: "lcCode",
        input: null
    },
    {
        label: "Marc代码：",//1
        name: "marcCode",
        input: null
    },
    {
        label: "医学主题术语：",//2
        name: "medicineTerm",
        input: null
    },
    {
        label: "主题类别：",//3
        name: "topicTerm",
        input: null
    },
    {
        label: "杜威十进制代码：",//4
        name: "dwCode",
        input: null
    },
    {
        label: "备选格式：",//5
        name: "optionFormat",
        input: null
    },
]
var otherOption = [
    {
        label: "是否需要审读：",//8
        name: "isRead",
        input: null,
        type: "drop",
        conditionType: 0
    },
    {
        label: "总署刊分类：",//1
        name: "allClass",
        input: null
    },
    {
        label: "影响因子：",//2
        name: "impactFactor",
        input: null
    },
    {
        label: "被收录于哪个数据库：",//3
        name: "database",
        input: null
    },
    {
        label: "备注：",//4
        name: "remark",
        input: null
    },
]
var params = {
    pressNo: {
        value: null,//刊号
    },
    relationPressNo: {
        value: null,//关联刊号
    },
    name: {
        value: null,//刊名
    },
    issn: {
        value: null,//ISSN
    },
    issue: {
        value: null,//期数值为数字
    },
    status: {
        value: null,//状态
    },
    chClassNo: {
        value: null,//中图分类号
    },
    language: {
        value: null,//文种
    },
    isCompendex: {
        value: null,//是否核心刊值为布尔类型true/false
    },
    chCurrency: {
        value: null,//中图币制
    },
    chPrice: {
        value: null,//中图刊价值为数字
    },
    creadYear: {
        value: null,//创刊年值为数字
    },
    catalogDate: {
        value: null,//编目日期值为日期格式为yyyy-MM-dd
    },
    publisher: {
        value: null,//出版社
    },
    publishLocate: {
        value: null,//出版地
    },
    brifIntroduction: {
        value: null,//原文简介
    },
    translatIntroduction: {
        value: null,//译文简介
    },
    gcYear: {
        value: null,//馆藏年度
    },
    gcNumber: {
        value: null,//馆藏卷号
    },
    gcPeriod: {
        value: null,//管藏期次
    },
    gcInfo: {
        value: null,//馆藏信息
    },
    edition: {
        value: null,//版本
    },
    note: {
        value: null,//注记
    },
    number: {
        value: null,//编号
    },
    isOa: {
        value: null,//是否OA刊值为布尔类型true/false
    },
    isIndex: {
        value: null,//是否有索引值为布尔类型true/false
    },
    orderPolicy: {
        value: null,//订购政策
    },
    cancelPolicy: {
        value: null,//取消政策
    },
    urgePolicy: {
        value: null,//催缺政策
    },
    publishCount: {
        value: null,//每年出版卷数
    },
    beginVolume: {
        value: null,//起始卷
    },
    beginVolumeDate: {
        value: null,//起始卷日期值为日期格式为yyyy-MM-dd
    },
    pubDate: {
        value: null,//出版时间值为日期格式为yyyy-MM-dd
    },
    lcCode: {
        value: null,//LC代码
    },
    marcCode: {
        value: null,//Marc代码
    },
    medicineTerm: {
        value: null,//医学主题术语
    },
    topicTerm: {
        value: null,//主题类别
    },
    dwCode: {
        value: null,//杜威十进制代码
    },
    optionFormat: {
        value: null,//备选格式
    },
    rate: {
        value: null,//费率值为数组[{'priceExplain':'价格说明','priceType':'价格类型','order':'新订/续订','timeLimit':'期限','numberCopies':'份数','price':'价格','currency':'币制'},{'priceExplain':'价格说明','priceType':'价格类型','order':'新订/续订','timeLimit':'期限','numberCopies':'份数','price':'价格','currency':'币制'}]
    },
    isRead: {
        value: null,//是否需要审读值为布尔类型true/false
    },
    allClass: {
        value: null,//总署刊分类
    },
    impactFactor: {
        value: null,//影响因子
    },
    database: {
        value: null,//被收录于哪个数据库
    },
    remark: {
        value: null,//备注
    },
    sn: {
        value: null,//修改用
    }
};
export default { basicOption, publisherOption, issuesOption, themeOption, otherOption, params }
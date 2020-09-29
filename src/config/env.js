/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 老项目域名地址
 * khglUrl: 客户管理域名地址
 * dicUrl : 字典服务器地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * welUrl :默认欢迎页
 * 
 */


let baseUrl = '';
let iconfontVersion = ['567566_r22zi6t8noas8aor',
// whc
'1451942_2oog8qw3vss', 
// whb
'1560392_nthdxg5oqxj'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
const env = process.env.NODE_ENV
if (env == 'development') {
  baseUrl = ``; // 开发环境地址
} else if (env == 'production') {
  baseUrl = ``; //生产环境地址
} else if (env == 'test') {
  baseUrl = ``; //测试环境地址
}
export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl
}

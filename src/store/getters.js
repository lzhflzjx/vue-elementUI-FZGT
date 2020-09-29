const getters = {
  tag: state => state.tags.tag,
  website:state => state.common.website,
  userInfo: state => state.user.userInfo,
  theme: state => state.common.theme,
  isCollapse: state => state.common.isCollapse,
  isLock: state => state.common.isLock,
  isFullScren: state => state.common.isFullScren,
  lockPasswd: state => state.common.lockPasswd,
  tagList: state => state.tags.tagList,
  tagCurrent: state => state.tags.tagCurrent,
  tagWel: state => state.tags.tagWel,
  token: state => state.user.token,
  roles: state => state.user.roles,
  permission: state => state.user.permission,
  menu: state => state.user.menu,
  menuAll: state => state.user.menuAll,
  errLog: state => state.errLog.errLog,
  // 审读人
  readerList: state => state.dict.readerList,
  // 以下是字典部分
  binding: state => state.dict.binding,
  language: state => state.dict.language,
  reviewLevel: state => state.dict.reviewLevel,
  commonReadResult: state => state.dict.commonReadResult,
  // 可售管理的字典
  manualReviewResult: state => state.dict.manualReviewResult,
  autoReviewResult: state => state.dict.autoReviewResult,
  manualReviewUser: state => state.dict.manualReviewUser,
  imageReadResult: state => state.dict.imageReadResult,
  entityReadResult: state => state.dict.entityReadResult,
  // -----------------------------------------------
  taskSource: state => state.dict.taskSource,
  missionSource: state => state.dict.missionSource,
  finish: state => state.dict.finish,
  // ------------------------------------------------
  reader: state => state.dict.reader,
  crawlStatus: state => state.dict.crawlStatus,
  imagesAutoReviewResult: state => state.dict.imagesAutoReviewResult,
  imagesManualReadResult: state => state.dict.imagesManualReadResult,
  txtReadResult: state => state.dict.txtReadResult,
  redReviewLevle: state => state.dict.redReviewLevle,
  site: state => state.dict.site,
  ctClassification: state => state.dict.ctClassification,
  bisacClassification: state => state.dict.bisacClassification,
  classification1: state => state.dict.classification1,
  classification2: state => state.dict.classification2,
  imgSensitiveType: state => state.dict.imgSensitiveType,
  //-------------馆藏
  gcLevel: state => state.dict.gcLevel,
  gcType: state => state.dict.gcType,
  gcCategory: state => state.dict.gcCategory,
  taskStuats: state => state.dict.taskStuats,
  resultStuats: state => state.dict.resultStuats,
  // --------------------------知识库
  // 1.榜单库
  rankingListCollectionType: state => state.dict.rankingListCollectionType,
  exampleSite: state => state.dict.exampleSite,
  // 2.奖项库
  awardsObjectType: state => state.dict.awardsObjectType,
  awardsLevel: state => state.dict.awardsLevel,
  awardsType: state => state.dict.awardsType,
  //报刊实物审读
  paperReview: state => state.dict.paperReview,
  paperProblemType: state => state.dict.paperProblemType,
  paperReviewOpinion: state => state.dict.paperReviewOpinion,

  productClassify: state => state.dict.productClassify,
}
export default getters

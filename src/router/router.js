import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/page/index/';
import BaseRouter from './_router';

const _import = require('./_import');
Vue.use(VueRouter);
export default new VueRouter({
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop;
            }
            return {
                x: 0,
                y: to.meta.savedPosition || 0
            };
        }
    },
});
export const asyncRouterMap = [
    {
        path: '/',
        component: Layout,
        redirect: '/login',
        children: [
            {
                path: '/index',
                name: '首页',
                component: () => import('@/views/home/index'),
                // meta:{keepAlive:true}
            },
            {
                path: '/initPage',
                name: '初始化页面',
                component: () => import('@/components/initPage')
            },
            // 图书
            {
                path: '/sourceData',
                name: '图书源数据',
                component: () => import('@/views/book/sourceData/index')
            },
            {
                path: '/sourceDetail',
                name: '图书源数据详情',
                component: () => import('@/views/book/sourceData/components/sourceDetail')
            },
            {
                path: '/bookLibrary',
                name: '图书库',
                component: () => import('@/views/book/bookLibrary/index')
            },
            {
                path: '/bookCheck',
                name: '图书审读',
                component: () => import('@/views/book/checkModel/bookCheck'),
            },
            {
                path: '/bookDetail',
                name: '图书审读面板',
                component: () => import('@/views/book/checkModel/detail/book/index'),
            },
            {
                path: '/imgLibrary',
                name: '图片库',
                component: () => import('@/views/book/imgLibrary/index')
            },
            {
                path: '/imgCheck',
                name: '图片审读',
                component: () => import('@/views/book/checkModel/imgCheck')
            },
            {
                path: '/redListManage',
                name: '红名单管理',
                component: () => import('@/views/book/redListManage/index')
            },
            {
                path: '/redListPassword',
                name: '红名单密码管理',
                component: () => import('@/views/systemManage/checkConfig/redListPassword')
            },
            {
                path: '/vendibilityManage',
                name: '可售管理',
                component: () => import('@/views/book/vendibilityManage/index')
            },
            {
                path: '/entityRead',
                name: '实物审读',
                component: () => import('@/views/book/entityRead/index')
            },
            // 报刊
            {
                path: '/newspaper',
                name: '报刊源数据',
                component: () => import('@/views/newspaper/sourceData/index')
            },
            {
                path: '/newspaperDetail',
                name: '报刊源数据详情',
                component: () => import('@/views/newspaper/sourceData/components/sourceDetail')
            },
            {
                path: '/paperLibrary',
                name: '报刊库',
                component: () => import('@/views/newspaper/paperLibrary/index')
            },
            {
                path: '/paperLibraryAdd',
                name: '报刊库新增/编辑',
                component: () => import('@/views/newspaper/paperLibrary/components/paperLibraryAdd')
            },
            {
                path: '/newspaperEntityRead',
                name: '报刊实物审读',
                component: () => import('@/views/newspaper/entityRead/index')
            },
            // 数据库
            {
                path: '/dataBase',
                name: '数据库',
                component: () => import('@/views/dataBase/dataBase/index')
            },
            {
                path: '/dataBaseRead',
                name: '数据库审读',
                component: () => import('@/views/dataBase/dataBaseRead/index')
            },
            // 馆藏
            {
                path: '/information',
                name: '馆藏信息',
                component: () => import('@/views/libraryCollection/information/index')
            },
            {
                path: '/detail',
                name: '馆藏信息详情',
                component: () => import('@/views/libraryCollection/information/components/detail')
            },
            {
                path: '/collectDataBase',
                name: '馆藏数据库',
                component: () => import('@/views/libraryCollection/dataBase/index')
            },
            {
                path: '/library',
                name: '馆藏图书',
                component: () => import('@/views/libraryCollection/library/index')
            },
            {
                path: '/probe',
                name: '馆藏探测',
                component: () => import('@/views/libraryCollection/library/components/probe')
            },
            {
                path: '/pavilion',
                name: '在馆量查询',
                component: () => import('@/views/libraryCollection/library/components/pavilion')
            },
            {
                path: '/press',
                name: '馆藏报刊',
                component: () => import('@/views/libraryCollection/press/index')
            },
            // 知识库
            {
                path: '/sensitiveWord',
                name: 'sensitiveWord',
                component: () => import('@/views/kbms/index'),
            },{
                path: '/sensitive',
                name: 'Sensitive',
                component: () => import('@/views/kbms/sensitive/index'),
            },{
                path: '/sensitive/info',
                name: 'SensitiveInfo',
                component: () => import('@/views/kbms/sensitive/info'),
            },
            {
                path: '/sensitive/sensitiveCategory',
                name: 'sensitiveCategory',
                component: () => import('@/views/kbms/sensitive/addSensitiveCategory')
            }, {
                path: '/sensitive/category',
                name: 'SensitiveCategory',
                component: () => import('@/views/kbms/sensitive/category')
            }, {
                path: '/sensitive/groupAdd',
                name: 'groupAdd',
                component: () => import('@/views/kbms/sensitive/groupAdd')
            }, {
                path: '/sensitive/groupList',
                name: 'groupList',
                component: () => import('@/views/kbms/sensitive/groupList')
            }, {
                path: '/sensitive/newFinder',
                name: 'newFinder',
                component: () => import('@/views/kbms/sensitive/newFinder')
            }, {
                path: '/sensitive/add',
                name: 'SensitiveAdd',
                component: () => import('@/views/kbms/sensitive/add')
            }, {
                path: '/tag',
                name: 'tag',
                component: () => import('@/views/kbms/tag')
            }, {
                path: '/author',
                name: 'author',
                component: () => import('@/views/kbms/author/index')
            }, {
                path: '/author/add',
                name: 'authorAdd',
                component: () => import('@/views/kbms/author/add')
            },  
            {
                path: '/awards',
                name: '奖项库',
                component: () => import('@/views/kbms/awards/index')
            }, 
            {
                path: '/organization',
                name: '获奖组织/人',
                component: () => import('@/views/kbms/awards/components/organization')
            }, 
            {
                path: '/works',
                name: '获奖作品',
                component: () => import('@/views/kbms/awards/components/works')
            }, 
            {
                path: '/checklist',
                name: '获奖清单',
                component: () => import('@/views/kbms/awards/components/checklist')
            }, 
            // {
            //     path: '/awards',
            //     name: 'awards',
            //     component: () => import('@/views/kbms/awards/awards')
            // }, 
            {
                path: '/awards/add',
                name: 'awardsAdd',
                component: () => import('@/views/kbms/awards/awardsAdd')
            }, {
                path: '/awards/works',
                name: 'awardsWorks',
                component: () => import('@/views/kbms/awards/awardWorks')
            }, {
                path: '/awards/works/add',
                name: 'awardsWorksAdd',
                component: () => import('@/views/kbms/awards/awardsAdd')
            },{
                path: '/awards/product',
                name: 'awardsProduct',
                component: () => import('@/views/kbms/awards/product')
            },  {
                path: '/awards/grap',
                name: 'awardsGrap',
                component: () => import('@/views/kbms/awards/grap')
            }, {
                path: '/monthly',
                name: '榜单库',
                component: () => import('@/views/kbms/example/index')
            },
             {
                path: '/monthly/add',
                name: '榜单库新增',
                component: () => import('@/views/kbms/example/add')
            }, 
            {
                path: '/monthly/works',
                name: '上榜作品',
                component: () => import('@/views/kbms/example/info')
            }, 
            {
                path: '/monthly/book',
                name: 'monthlyBook',
                component: () => import('@/views/kbms/example/info')
            },{
                path: '/images',
                name: 'images',
                component: () => import('@/views/kbms/images/index')
            },{
                path: '/images/add',
                name: 'imagesAdd',
                component: () => import('@/views/kbms/images/add')
            },{
                path: '/images/edit',
                name: 'imagesEdit',
                component: () => import('@/views/kbms/images/edit')
            },{
                path: '/images/category',
                name: 'imagesCategory',
                component: () => import('@/views/kbms/images/category')
            },{
                path: '/images/category/add',
                name: 'imagesCategoryAdd',
                component: () => import('@/views/kbms/images/categoryAdd')
            },{
                path: '/taxonomy',
                name: 'taxonomy',
                component: () => import('@/views/kbms/taxonomy/index')
            },{
                path: '/taxonomy/add',
                name: 'taxonomyAdd',
                component: () => import('@/views/kbms/taxonomy/add')
            },{
                path: '/taxonomy/map/business',
                name: 'taxonomyMapBusiness',
                component: () => import('@/views/kbms/taxonomy/business')
            },{
                path: '/taxonomy/map',
                name: 'taxonomyMap',
                component: () => import('@/views/kbms/taxonomy/map')
            },{
                path: '/taxonomy/config',
                name: 'taxonomyConfig',
                component: () => import('@/views/kbms/taxonomy/config')
            },{
                path: '/taxonomy/config/zhongtu',
                name: 'taxonomyConfigZhongtu',
                component: () => import('@/views/kbms/taxonomy/zhongtu')
            },{
                path: '/publishing',
                name: 'publishing',
                component: () => import('@/views/kbms/publishing/index')
            },{
                path: '/publishing/add',
                name: 'publishingAdd',
                component: () => import('@/views/kbms/publishing/add')
            },{
                path: '/publishing/confirm',
                name: 'publishingConfirm',
                component: () => import('@/views/kbms/publishing/confirm')
            },{
                path: '/publishing/newfinder',
                name: 'publishingNewFinder',
                component: () => import('@/views/kbms/publishing/newFinder')
            },
            // 系统管理
            {
                path: '/acquisition',
                name: '采集管理',
                component: () => import('@/views/systemManage/acquisition/index'),
            },
            {
                path: '/mergeRule',
                name: '合并规则',
                component: () => import('@/views/systemManage/mergeRule/index'),
            },
            {
                path: '/mergeRule/mergeDetail',
                name: '合并详情',
                component: () => import('@/views/systemManage/mergeRule/components/mergeDetail.vue')
            },
            {
                path: '/allocatingTaskManage',
                name: '自动分配任务管理',
                component: () => import('@/views/systemManage/checkConfig/taskManage/index')
            },
            {
                path: '/conversion',
                name: '汇率转换管理',
                component: () => import('@/views/systemManage/checkConfig/conversion')
            },
            {
                path: '/dictManage',
                name: '字典管理',
                component: () => import('@/views/systemManage/dictManage/index')
            }
        ]
    }
].concat(BaseRouter);

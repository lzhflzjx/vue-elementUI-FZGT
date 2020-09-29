import request from '@/router/axios'
import { userInfo, tableData } from '@/mock/user'
import { menu, menuAll } from '@/mock/menu'
import { baseUrl } from '@/config/env'
export const loginByUsername = (username, password) => {
    return new Promise((resolve, reject) => {
        resolve({ data: new Date().getTime() });
    })
}

export const getUserInfo = () => {
    return new Promise((resolve, reject) => {
        resolve({ data: userInfo });
    })
}
export const getMenu = (parentId) => {
    return new Promise((resolve, reject) => {
        if (parentId==undefined){
            parentId = localStorage.getItem('curMenuIndex')
        } 
        resolve({ data: menu[parentId] });
    })
}
export const getMenuAll = () => {
    return new Promise((resolve, reject) => {
        resolve({ data: menu[0] });
    })
}

export const getTableData = (page) => {
    return new Promise((resolve, reject) => {
        resolve({ data: tableData });
    })
}
export const logout = () => {
    return new Promise((resolve, reject) => {
        resolve();
    })
}




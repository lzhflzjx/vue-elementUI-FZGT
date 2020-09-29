import axios from 'axios';

const postDownloadFunc = function (url, data, fileName) {
    axios.post(url, data, { responseType: 'blob' })
        .then(res => {
            if (!data) {
                return;
            }
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', fileName + '.xls');
            document.body.appendChild(link);
            link.click();
        });
};
const postDownloadZip = function (url, data, filename) {
    axios.post(url, data, { responseType: 'blob' })
        .then(res => {
            if (!data) {
                return;
            }
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/x-zip-compressed' }));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', filename + '.zip');
            document.body.appendChild(link);
            link.click();
        });
};
const getDownloadFunc = function (url, fileName) {
    axios.get(url, { responseType: 'blob' })
        .then(res => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', fileName + '.xls');
            document.body.appendChild(link);
            link.click();
        });
};

//处理分类数据
const setCategoryMenu = function (obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                //判断obj的子元素是否为object对象，如果是则就递归拷贝
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = setCategoryMenu(obj[key]);
                    objClone[key]['label'] = setCategoryMenu(obj[key]).sortName;
                    objClone[key]['children'] = setCategoryMenu(obj[key]).childList;
                    objClone[key]['disabled'] = setCategoryMenu(obj[key]).flag === 0 ?  false : true;
                    delete objClone[key]['childList'];
                    delete objClone[key]['sortName'];
                } else {
                    //如果不为对象就直接拷贝
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
};

export { postDownloadFunc, getDownloadFunc, setCategoryMenu, postDownloadZip };

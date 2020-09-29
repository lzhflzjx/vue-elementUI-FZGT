export default {
    changeTime(data) {
        if (data == 'null' || !data) {
            return
        }
        let time = new Date(data);
        let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        let seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        return time.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + seconds
    },
    changeDict(dict, value) {
        let str=''
        if (value!=null) {
            let result = []
            let valList=value.toString().split(',')
            valList.forEach(val=>{
                dict.forEach(item => {
                    if (item.value == val) {
                        result.push(item.name)
                    }
                })
            })
            str=result.join('，')
        }
        return str
    },
    // 分类回显
    classification(classfiy, val, Logo) {
        var result = ''
        if (val == undefined) {
            var Echo = []
        } else {
            if (val.substr(0, 1) != "[" && val.substr(val.length - 1, 1) != "]") {
                return val
            }
            if (Logo == "bookCheck") {
                var Echo = val.substring(1, val.length - 1).split("','")
            } else {
                var Echo = val.substring(2, val.length - 2).split("','")
            }
        }
        if (Echo.length > 0) {
            function flatten(arr, newArr) {
                newArr = newArr || []
                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i];
                    if (item["id"]) {
                        newArr.push({
                            id: item["id"],
                            sortName: item["sortName"],
                        })
                        if (item["childList"]) {
                            flatten(item["childList"], newArr)
                        }
                    }
                }
                return newArr
            }
            var flatArr = flatten(classfiy)
            var obj = {};
            Echo.forEach((item, index) => {
                obj["arr" + index] = item.split(",").map(function (currentValue) {
                    flatArr.forEach(item => {
                        if (item.id == currentValue) {
                            currentValue = item.sortName
                        }
                    })
                    return currentValue
                })
            })
            // 9780001016123
            for (var sortName in obj) {
                result += obj[sortName] + ";\n";
            }
        }
        result = result.replace(',', '>')
        if (result == "[];\n") {
            result = ''
        }
        return result
    },
}
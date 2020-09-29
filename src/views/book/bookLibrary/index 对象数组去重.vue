<template>
  <div>
    <el-button @click="ss">ss</el-button>
  </div>
</template>

<script>
export default {
  created() {
    this.ss()
  },
  methods: {
    ss() {
      // Array.prototype.unique = function () {
      //   const tmp = new Map();
      //   return this.filter(item => {
      //     return !tmp.has(item) && tmp.set(item, 1);
      //   })
      // }
      // const arr = [1, 1, '1', '1', 0, 0, '0', '0', undefined, undefined, null, null, NaN, NaN, {}, {}, [], [], /a/, /a/];

      // // Array.prototype.unique = function () {
      // //   const set = new Set(this);
      // //   return Array.from(set);
      // // }
      // Array.prototype.unique = function () {
      //   const newArray = [];
      //   this.forEach(item => {
      //     if (!newArray.includes(item)) {
      //       newArray.push(item);
      //     }
      //   });
      //   return newArray;
      // }

      // console.log('arr')
      // console.log(arr)
      // console.log(arr.unique())

      let objArr = [
        {
          'msg': 'sdfsdf',
          'text': 'sdafasfdasdf'
        },
        {
          'msg': 'sdfsdf',
          'text': 'sdafasfdasdf'
        },
        {
          'msg': 'hello',
          'text': 'world'
        },
        {
          'msg': 'js',
          'text': 'c++'
        }
      ]
      //对象数组的去重
      // function uniqObjInArray(objarray) {
      //   let len = objarray.length;
      //   let tempJson = {

      //   };
      //   let res = [];
      //   for (let i = 0; i < len; i++) {
      //     //取出每一个对象
      //     tempJson[JSON.stringify(objarray[i])] = true;
      //   }
      //   console.log("tempJson is ", tempJson);
      //   let keyItems = Object.keys(tempJson);
      //   for (let j = 0; j < keyItems.length; j++) {
      //     res.push(JSON.parse(keyItems[j]));
      //   }
      //   return res;
      // }
      // let res3 = uniqObjInArray(objArr);
      // console.log("res3 is ", res3);

      // let arr = [2, 3, 3, 3, 2, 4, 2];
      console.log("arr is a instance of arr ", (typeof arr));
      let str = "asdfasdf";
      console.log("str is an instance of Array", str instanceof Array);
      console.log("str is an instance of String ?", (typeof str) === 'string');
      function uniqForBasic(array) {
        let temp = [];
        let index = [];
        let len = array.length;
        for (let i = 0; i < len; i++) {
          for (let j = i + 1; j < len; j++) {
            //如果下一个值等于前一个值重复
            if (array[i] == array[j]) {
              i++;
              j = i;
            }
          }
          temp.push(array[i]);
          index.push(i);
        }
        return temp;
      }
      let res = uniqForBasic(objArr);
      console.log("res is ", res);
    }
  },
}
</script>

<style lang="scss" scoped>
</style>

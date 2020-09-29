
<template>
  <div v-loading="loading">
    <!-- v-loading.fullscreen.lock="loading" -->
    <div class="loadingClick">
      <el-button v-if="!flag" type="primary" @click="renderClass">点击加载分类</el-button>
    </div>
    <!-- <el-button @click="saveProductSort">save</el-button> -->
    <div v-if="flag">
      <div v-for="(obj,i) in sortManageOption" :key="i">
        <div class="dialogCont">
          <div class="head">
            <label>{{obj.label}}:</label>
            <div class="list" style="width:100px">
              <el-cascader :ref="obj.label" v-model="sortManageOption[i].sortManage.value" size="mini" @change="selectSortManage(obj.label)" :placeholder="obj.label" :options="obj.Classification" :visible-change="getClassification" :props="defaultProps" filterable clearable></el-cascader>
              <el-button size="mini" type="primary" plain @click="addAttr(i)">增加</el-button>
            </div>
          </div>
          <div class="arrtCont">
            <div v-for="(item,index) in obj.sortManageList" :key="index" class="list">
              <el-cascader size="mini" v-model="sortManageOption[i].sortManageList[index].value" :placeholder="obj.label" :options="obj.Classification" :props="defaultProps" filterable clearable></el-cascader>
              <el-button size="mini" type="danger" plain @click="delAttr(item,index,i)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(obj,i) in inputOption" :key="i">
        <div class="dialogCont">
          <div class="head">
            <label>{{obj.label}}:</label>
            <div class="list" style="width:100px">
              <el-input v-model="inputOption[i].sortManage.value[0]" :placeholder="obj.label" size="mini" clearable></el-input>
              <!-- <input v-model="inputOption[i].sortManage.value" size="mini" @change="selectSortManage(obj.label)" :placeholder="obj.label" :options="obj.Classification" :visible-change="getClassification" :props="defaultProps" filterable clearable> -->
              <el-button size="mini" type="primary" plain @click="addAttr1(i)">增加</el-button>
            </div>
          </div>
          <div class="arrtCont">
            <div v-for="(item,index) in obj.sortManageList" :key="index" class="list">
              <el-input v-model="inputOption[i].sortManageList[index].value[0]" :placeholder="obj.label" size="mini" clearable></el-input>
              <!-- <el-cascader size="mini" v-model="inputOption[i].sortManageList[index].value" :placeholder="obj.label" :options="obj.Classification" :props="defaultProps" filterable clearable></el-cascader> -->
              <el-button size="mini" type="danger" plain @click="delAttr1(item,index,i)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="label">
        <label>标签:</label>
        <el-input size="mini" v-model="bookData.label.rank"></el-input>
      </div>
    </div>

  </div>
</template>
<script>
import classification from './js/classification.js'
export default {
  data() {
    return {
      flag: false,
      params: {
        isbn: "21312452321",
        amazon: [""],
        bic: [""],
        bisac: [""],
        business1: [""],
        business2: [""],
        ct: [""],
        dewey: [""],
        label: [""],
        lc: [""],
        ndc: [""],
        press: [""],
        thema: [""],
        theme: [""],
        keyword: [""]
      },
      defaultProps: {
        children: "childList",
        label: "sortName",
        value: "id",
        expandTrigger: "hover",
        checkStrictly: true
      },
      sortManageOption: JSON.parse(JSON.stringify(classification.sortManageOption)),
      inputOption: JSON.parse(JSON.stringify(classification.inputOption)),
      sortManageData: {
        sortManage: { name: "", value: [] },
        sortManageList: []
      },
      loading: false,
    };
  },
  props: ['bookData'],
  created() {
    this.initData(this.bookData)
    for (let i = 3; i < 11; i++) {
      this.getSortManage(i + "");
    }
  },
  watch: {
    bookData: function (newVal, oldVal) {
      // this.cData = newVal;  //newVal即是bookData
      this.initData(newVal)
    }
  },
  methods: {
    renderClass() {
      this.loading = true
      var result = {
        time: (callback) => {
          this.timer = setInterval(() => {
            let ss = '加载'
            this.loading = false
            this.flag = true
            callback(ss);
          }, 1500);
        }
      };
      result.time((ss) => {
        if (ss == '加载') {
          clearInterval(this.timer);
        }
      });
      // clearInterval(this.timer);
    },
    // 分类数据回显
    initData(res) {
      let {
        ctClassification, bisacClassification, bicClassification, ndcClassification, deweyClassification,
        lcClassification, amazonClassification, classification1, classification2, pressClassification,
        themaClassification, themeClassification, keywordClassification
      } = res
      var Echo = {};
      Echo["arr" + 0] = ctClassification ? ctClassification.value : [] //中图法
      Echo["arr" + 1] = bisacClassification ? bisacClassification.value : [] //bisac
      Echo["arr" + 2] = bicClassification ? bicClassification.value : [] //bic
      Echo["arr" + 3] = ndcClassification ? ndcClassification.value : [] //ndc
      Echo["arr" + 4] = deweyClassification ? deweyClassification.value : [] //dewey
      Echo["arr" + 5] = lcClassification ? lcClassification.value : [] //lc
      Echo["arr" + 6] = classification1 ? classification1.value : [] //业务分类1
      Echo["arr" + 7] = classification2 ? classification2.value : [] //业务分类2
      let input = {}
      input["arr" + 0] = amazonClassification ? (amazonClassification.valueModel ? amazonClassification.valueModel : amazonClassification.value) : [] //亚马逊
      input["arr" + 1] = pressClassification ? (pressClassification.valueModel ? pressClassification.valueModel : pressClassification.value) : [] //出版社
      input["arr" + 2] = themaClassification ? (themaClassification.valueModel ? themaClassification.valueModel : themaClassification.value) : [] //thema
      input["arr" + 3] = themeClassification ? (themeClassification.valueModel ? themeClassification.valueModel : themeClassification.value) : [] //主题
      input["arr" + 4] = keywordClassification ? (keywordClassification.valueModel ? keywordClassification.valueModel : keywordClassification.value) : [] //关键词
      for (let order = 0; order < 8; order++) {
        if (true) {
          if (Array.isArray(Echo["arr" + order])) {

          } else {
            Echo["arr" + order] = Echo["arr" + order].substring(2, Echo["arr" + order].length - 2).split("','")
          }
          if (Echo["arr" + order].length > 0) {
            var obj = {};
            Echo["arr" + order].forEach((item, index) => {
              obj["arr" + index] = item.split(",").map(Number);
            });
            for (let i = 1; i < Echo["arr" + order].length; i++) {
              this.addAttr(order, obj["arr" + i]);
            }
            this.sortManageOption[order].sortManage.value = obj["arr" + 0];
          }
        } else {
        }
      }
      for (let order = 0; order < 5; order++) {
        if (true) {
          if (Array.isArray(input["arr" + order])) {

          }
          else if (input["arr" + order].substr(0, 1) != "[" && input["arr" + order].substr(input["arr" + order].length - 1, 1) != "]") {
            input["arr" + order] = input["arr" + order].split("','")
          }
          else {
            input["arr" + order] = input["arr" + order].substring(2, input["arr" + order].length - 2).split("','")
          }
          if (input["arr" + order].length > 0) {
            var obj = {};
            input["arr" + order].forEach((item, index) => {
              obj["arr" + index] = item.split(",");
            });
            for (let i = 1; i < input["arr" + order].length; i++) {
              this.addAttr1(order, obj["arr" + i]);
            }
            this.inputOption[order].sortManage.value = obj["arr" + 0];
          }
        } else {
        }
      }
    },
    // 分类数据保存
    async saveProductSort() {
      var params = {};
      for (let order = 0; order < 8; order++) {
        if (this.sortManageOption[order].sortManageList.length == 0) {
          if (this.sortManageOption[order].sortManage.value.length == 0) {
            params["arr" + order] = [];
          } else {
            params["arr" + order] = [
              this.sortManageOption[order].sortManage.value.toString()
            ];
          }
        } else {
          params["arr" + order] = [
            this.sortManageOption[order].sortManage.value.toString()
          ];
          var index = this.sortManageOption[order].sortManageList;
          this.sortManageOption[order].sortManageList.forEach(element => {
            params["arr" + order].push(element.value.toString());
          });
        }
      }
      var input = {}
      for (let order = 0; order < 5; order++) {
        if (this.inputOption[order].sortManageList.length == 0) {
          if (this.inputOption[order].sortManage.value.length == 0) {
            input["arr" + order] = [];
          } else {
            input["arr" + order] = [
              this.inputOption[order].sortManage.value.toString()
            ];
          }
        } else {
          input["arr" + order] = [
            this.inputOption[order].sortManage.value.toString()
          ];
          var index = this.inputOption[order].sortManageList;
          this.inputOption[order].sortManageList.forEach(element => {
            input["arr" + order].push(element.value.toString());
          });
        }
      }
      var searchParams = {
        isbn: this.$route.query.isbn,
        ct: params["arr" + 0],
        bisac: params["arr" + 1],
        bic: params["arr" + 2],
        ndc: params["arr" + 3],
        dewey: params["arr" + 4],
        lc: params["arr" + 5],
        business1: params["arr" + 6],
        business2: params["arr" + 7],
        amazon: input["arr" + 0],
        press: input["arr" + 1],
        thema: input["arr" + 2],
        theme: input["arr" + 3],
        keyword: input["arr" + 4]
      };
      this.loading = true;
      await this.$post("/api/review/person/saveProductSort", searchParams)
        .then(res => {
          if (!res.success) {
            this.$message.error(res.message);
          }
          // this.$emit("getbookInfo");
          this.initData()
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 节点数据变化
    selectSortManage(label) {
      let type;
      let name;
      let ctName = this.$refs['中图法'][0]._data.presentText
      if (ctName != null) {
        // 如果中图法输入框文本值不为空
        return
      }
      if (label == '业务分类1') {
        name = this.$refs['业务分类1'][0].getCheckedNodes()[0].label
        type = 3
        this.getCtcation(type, name)
      }
      if (label == '业务分类2') {
        name = this.$refs['业务分类2'][0].getCheckedNodes()[0].label
        type = 4
        this.getCtcation(type, name)
      }

    },
    getCtcation(type, name) {
      // GET /api/review/person/getProductSort
      this.$get('/api/review/person/getProductSort?type=' + type + '&name=' + name + '')
        .then(res => {
          this.sortManageOption[0].sortManage.value = res.data.split(',').map(Number)

        })
    },
    getClassification() {
    },
    addAttr1(index, value) {
      var obj = { name: "", value: [] };
      if (value) {
        obj.value = value;
      }
      // this.sortManageData.sortManageList.push(obj);
      this.inputOption[index].sortManageList.push(obj);
    },
    delAttr1(item, index, id) {
      this.inputOption[id].sortManageList.splice(index, 1);
    },
    addAttr(index, value) {
      var obj = { name: "", value: "" };
      if (value) {
        obj.value = value;
      }
      // this.sortManageData.sortManageList.push(obj);
      this.sortManageOption[index].sortManageList.push(obj);
    },
    delAttr(item, index, id) {
      this.sortManageOption[id].sortManageList.splice(index, 1);
    },
    // 获取分类数据
    getSortManage(type) {
      var reqParams = { type: type };
      this.$post("/api/sortManage/findListByPraentId", reqParams).then(res => {
        if (res.data.result && res.data.result.length > 0) {
          switch (type) {
            case "3":
              this.sortManageOption[6].Classification = res.data.result;
              break;
            case "4":
              this.sortManageOption[7].Classification = res.data.result;
              break;
            case "5":
              this.sortManageOption[0].Classification = res.data.result;
              break;
            case "6":
              this.sortManageOption[4].Classification = res.data.result;
              break;
            case "7":
              this.sortManageOption[1].Classification = res.data.result;
              break;
            case "8":
              this.sortManageOption[2].Classification = res.data.result;
              break;
            case "9":
              this.sortManageOption[5].Classification = res.data.result;
              break;
            case "10":
              this.sortManageOption[3].Classification = res.data.result;
              break;
            default:
              break;
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.loadingClick {
  margin-left: 40%;
}
.demonstration {
  font-size: 16px;
  vertical-align: middle;
  text-align: right;
}
.dialogCont {
  text-align: right;
  margin-right: 70px;
  .el-input {
    width: 300px;
  }
  .el-cascader {
    width: 300px;
  }
  label {
    padding: 0 20px;
    width: 160px;
    font-size: 14px;
  }
  .el-button {
    margin-left: 20px;
  }
  .head {
    // padding-bottom: 20px;
    // border-bottom: dashed 1px #e3e3e3;
    .list {
      display: inline;
    }
  }
  .arrtCont {
    padding-top: 10px;
    .list {
      margin-bottom: 5px;
      margin-left: 96px;
    }
  }
}
.label {
  text-align: right;
  margin-right: 150px;
  label {
    font-size: 14px;
  }
  .el-input {
    width: 300px;
    margin-left: 25px;
  }
}
</style>
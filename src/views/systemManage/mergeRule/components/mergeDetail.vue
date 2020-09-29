<template>
  <div class="mainBox" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="current-title">{{currentName}}</div>
    <el-table :data="currentData" border style="width: 100%">
      <el-table-column label="信源">
        <template slot-scope="scope">
          <el-select v-model="scope.row.sourceSite">
            <el-option
              v-for="item in optionList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="product_type" label="信源标识"></el-table-column> -->
      <el-table-column label="信源字段">
        <template slot-scope="scope">
          <el-select v-model="scope.row.sourceKey">
            <el-option
              v-for="item in optionsListKey[scope.row.sourceSite]"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="优先级" width="80">
        <template slot-scope="scope">
          <el-input
            v-model.number="scope.row.priority"
            onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
            onafterpaste="value=value.replace(/^(0+)|[^\d]+/g,'')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="规则类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.exprType" @change="scope.row.expr = null">
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="正则">
        <template slot-scope="scope">
          <el-input v-if="scope.row.exprType == 'weight'" v-model="scope.row.expr"></el-input>
          <el-input v-if="scope.row.exprType == 'size'" v-model="scope.row.expr"></el-input>
          <el-input v-if="scope.row.exprType == 'reg'" v-model="scope.row.expr"></el-input>
          <el-select v-if="scope.row.exprType == 'dic'" v-model="scope.row.expr" placeholder="请选择">
            <el-option
              v-for="item in res.result"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="辅助字段">
        <template  slot-scope="scope">
          <el-select v-if="scope.row.exprType == 'weight'" v-model="scope.row.homology" placeholder="请选择">
            <el-option
              v-for="item in optionsListKey[scope.row.sourceSite]"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-select v-if="scope.row.exprType == 'size'" v-model="scope.row.homology" placeholder="请选择">
            <el-option
              v-for="item in optionsListKey[scope.row.sourceSite]"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="辅助字段默认值">
        <template slot-scope="scope">
          <el-input v-if="scope.row.exprType == 'weight'" v-model="scope.row.defaultValue"></el-input>
          <el-input v-if="scope.row.exprType == 'size'" v-model="scope.row.defaultValue"></el-input>
        </template>
      </el-table-column>
      <el-table-column label>
        <template slot="header" slot-scope="scope">
          <el-button type="primary" size="small" @click="action('add')">+</el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="action('del',scope.$index)">-</el-button>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="primary" @click="testEvnet(scope.row)">试一试</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="actionBtnList">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
    </div>

    <el-dialog title="试一试" :visible.sync="dialogTableVisible" :before-close="closeDialog">
      <div class="mergeTestStyle">
        <span>信源:{{this.params.sourceSite}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>信源字段:{{this.params.sourceKey}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span v-if="this.params.exprType==='dic'">规则类型:枚举</span>
        <span v-else-if="this.params.exprType==='reg'">规则类型:正则</span>
        <span v-else-if="this.params.exprType==='='">规则类型:=</span>
        <span v-else-if="this.params.exprType==='weight'">规则类型:重量归一</span>
        <span v-else-if="this.params.exprType==='size'">规则类型:尺寸归一</span>
        <span v-else>规则类型:尚未添加</span>
      </div>
      <el-table :data="mergeTestData">
        <el-table-column property="sn" label="sn" width="150"></el-table-column>
        <el-table-column property="sourceValue" label="sourceValue" width="200"></el-table-column>
        <el-table-column property="tagValue" label="tagValue"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      currentName: null,
      rootData: [],
      currentData: [],
      mergeTestData: [],
      dialogTableVisible: false,
      res: {},
      options: [
        { label: "正则", value: "reg" },
        { label: "=", value: "=" },
        { label: "重量归一", value: "weight" },
        { label: "尺寸归一", value: "size" },
        { label: "枚举", value: "dic" }
      ],
      fullscreenLoading: false,
      optionList: [],
      optionsListKey: {},
      code: "",
      params: {
        sourceSite: "",
        sourceKey: "",
        exprType: ""
      }
    };
  },
  computed: {
    ...mapGetters(["site"]),
    valOption() {
      let arr = [
        // 信源 0
        this.site
      ];
      return arr;
    }
  },
  created() {
    // 获取字典
    this.getDictList(["site"]);
  },
  methods: {
    button(data){
    },
    ...mapActions(["getDictList"]),
    // 获取字典列表
    getDicData() {
      this.$post("/api/dic/list", { code: "" })
        .then(res => {
          this.res = res;
        })
        .catch();
    },
    // 筛选未被删除的数据
    existCurrentData(data) {
      let arr = [];
      data.forEach(item => {
        if (item.status == 0) arr.push(item);
      });
      this.currentData = arr;
    },
    // 获取数据
    getData(id) {
      this.fullscreenLoading = true;
      this.$requrestAxios({
        url: "/etl/config/product/confEtlListIndex",
        method: "post",
        params: {
          productSchemaId: id
        }
      }).then(res => {
        this.fullscreenLoading = false;
        this.rootData = res.data.data.confEtlList;
        var arry = res.data.data.propertyName;

        let options = {};
        arry.forEach(item => {
          options[item.name] = item.children;
        });

        this.optionsListKey = options;
        this.existCurrentData(this.rootData);

        arry.map(x => {
          this.valOption[0].map(k => {
            if (k.value == x.name) {
              this.optionList.push(k);
            }
          });
        });
      });
    },

    // 加減操作
    action(type, index) {
      if (type == "add") {
        let obj = {
          productSchemaId: this.$route.query.id,
          sourceSite: "",
          sourceKey: "",
          priority: "",
          exprType: "=",
          expr: null,
          status: 0
        };
        this.currentData.push(obj);
      }

      if (type == "del") {
        this.currentData[index].status = -1;
        this.existCurrentData(this.currentData);
      }
    },
    // 重置操作
    reset() {
      this.getData(this.$route.query.id);
    },

    // 保存
    save() {
      var arr = [];
      this.currentData.map(function(item) {
        arr.push(item.priority);
      });
      arr = arr.sort();
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == arr[i + 1]) {
          this.$message.warning("优先级不能相同");
          return;
        }
      }
      for (let i = 0; i < this.currentData.length; i++) {
        const priority = this.currentData[i].priority;
        const sourceSite = this.currentData[i].sourceSite;
        const sourceKey = this.currentData[i].sourceKey;
        if (priority == "" || sourceSite == "" || sourceKey == "") {
          this.$message.warning("规则不能为空");
          return;
        }
      }
      let data = {
        productSchemaId:this.$route.query.id,
        confEtlModelList: this.currentData,
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userInfo.name,
        updateUser: JSON.parse(window.localStorage.getItem("userInfo")).userInfo.name,
        createUser: JSON.parse(window.localStorage.getItem("userInfo")).userInfo.name
      };
      this.fullscreenLoading = true;
      this.$requrestAxios({
        url: "/etl/config/product/updateConfEtl",
        method: "post",
        data: data
      }).then(res => {
        this.fullscreenLoading = false;
        let data = res.data;
        if (data.message == "success") this.$message.success("修改成功");
      });
    },
    closeDialog() {
      this.mergeTestData = [];
      this.dialogTableVisible = false;
    },
    // 测试
    testEvnet(data) {
      let params = {
        productSchemaId: data.productSchemaId,
        sourceSite: data.sourceSite,
        sourceKey: data.sourceKey,
        priority: data.priority,
        exprType: data.exprType,
        expr: data.expr
      };
      this.params.sourceSite = data.sourceSite;
      this.params.sourceKey = data.sourceKey;
      this.params.exprType = data.exprType;
      this.$requrestAxios({
        url: "/etl/api/datamerge/giveitTry",
        params: params
      })
        // this.$get("/etl/api/datamerge/giveitTry", {
        //   params: params
        // })
        .then(res => {
          if (res.data.result && res.data.result.length > 0) {
            let data = [];
            res.data.result.forEach(obj => {
              // this.salableOrganType.push(obj.salableOrgan.value);
              // for (const k in obj) {
              //   obj[k] = obj[k].value;
              // }
              data.push(obj);
            });
            this.mergeTestData = data;
          }
        })
        .catch();

      this.dialogTableVisible = true;
    }
  },
  mounted() {
    this.currentName = this.$route.query.name;
    this.getData(this.$route.query.id);
    this.getDicData();
  }
};
</script>

<style lang="scss">
.actionBtnList {
  text-align: center;
  margin: 50px auto;
  .el-button {
    margin: 0px 40px;
  }
}
.mergeTestStyle {
  color: #a1a1a1;
}
</style>
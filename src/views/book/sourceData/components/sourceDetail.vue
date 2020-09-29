<template>
  <div id="soueceDetail">
    <div class="content">
      <span @click="$router.push('/sourceData')" class="back">
        <i class="el-icon-back"></i>
        <span style="font-size:13px;">返回</span>
        <el-divider direction="vertical"></el-divider>
      </span>
      <p v-for="(item,index) in valOption[0]" :key="index" class="source">
        <span v-if="item.value == source">渠道:{{item.name}}</span>
      </p>
      <div class="bookTable">
        <table class="mailTable" cellpadding="0px" cellspacing="0px" style="border-right:solid 1px #e3e3e3;border-bottom:solid 1px #e3e3e3">
          <!-- style="text-align:right" -->
          <tr v-for="index in rowCount" :key="index">
            <td class="column" style="border-left:solid 1px #e3e3e3;border-top:solid 1px #e3e3e3; color:#727878;margin-bottom:5px;line-height:28px;">{{tableData[index-1].name}}：</td>
            <td style="border-left:solid 1px #e3e3e3;border-top:solid 1px #e3e3e3;padding:8px">{{tableData[index-1].value}}</td>
            <!-- <td class="column">{{tableData[index*2-1] !== undefined ? tableData[index*2-1].key : ''}}</td>
            <td>{{tableData[index*2-1] !== undefined ? tableData[index*2-1].value : ''}}</td>-->
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      // styleObject: {},
      s_showByRow: true,
      tableData: [
      ],
      source: ""
    };
  },
  // props: ["tableData", "tableStyle", "showByRow"],
  computed: {
    rowCount: function () {
      return this.tableData.length;
    },
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
    this.getDetail();
    // this.styleObject = this.tableStyle;
    if (this.showByRow !== undefined) {
      this.s_showByRow = this.showByRow;
    }
    // 获取字典
    this.getDictList(["site"]);
  },
  methods: {
    ...mapActions(["getDictList"]),
    // 查看详细信息
    getDetail() {
      this.source = this.$route.query.source;
      if (this.$route.query.sn == undefined) {
        var requestParams = {
          source: this.$route.query.source,
          sn: ""
        };
      } else {
        var requestParams = {
          source: this.$route.query.source,
          sn: this.$route.query.sn
        };
      }
      // this.dialogTableVisible = true;
      // get /api/source/findBySourceAndSn
      this.$get("/api/source/findBySourceAndSn", requestParams)
        .then(res => {
          if (res.data.result && res.data.result.length > 0) {
            let data = [];
            res.data.result[0].properties.forEach(obj => {
              if (obj.name == '责任人数组') {
                return
              }
              obj.name = obj.name.replace(/[ ]/g, "");
              data.push(obj);
            });
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
            //   let keyItems = Object.keys(tempJson);
            //   for (let j = 0; j < keyItems.length; j++) {
            //     res.push(JSON.parse(keyItems[j]));
            //   }
            //   return res;
            // }
            // let newData = uniqObjInArray(data);
            this.tableData = data;
            // this.tableData = data;
          }
        })
        .catch();
    }
  }
};
</script>


<style lang='scss' scoped>
#soueceDetail {
  padding: 15px;
  background: #fff;
  min-height: 100%;
  border-radius: 5px;
  .content {
    .source span {
      margin: 30px 0 0 100px;
      color: #71787e;
      font-size: 20px;
    }
    .back {
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .bookTable {
      margin: 30px 0 0 200px;
      color: #71787e;
      font-size: 16px;
      //   width: 400px;
      //   height: 600px;
      //   background: green;
      // //   position: absolute;
      //   left: 0;
      //   top: 0;
      //   bottom: 0;
      //   right: 0;
      //   margin: auto;
    }
    // 　　.mailTable,
    // .mailTable tr,

    // 　 　　.mailTable tr td {
    //   // border: 1px solid #e6eaee;
    //   width: 300px;
    //   height: 35px;
    //   line-height: 35px;
    //   box-sizing: border-box;
    //   // padding: 0 10px;
    // }
    　　.mailTable tr td .column {
      // background-color: #eff3f6;
      background-color: blue;
      color: #393c3e;
    }
  }
}
</style>
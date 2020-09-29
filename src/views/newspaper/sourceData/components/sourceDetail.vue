<template>
  <div id="soueceDetail">
    <div class="content">
      <span @click="$router.push('/newspaper')" class="back">
        <i class="el-icon-back"></i>
        <span style="font-size:13px;">返回</span>
        <el-divider direction="vertical"></el-divider>
      </span>
      <p v-for="(item,index) in valOption[0]" :key="index" class="source">
        <span v-if="item.value == source">渠道:{{item.name}}</span>
      </p>
      <div class="bookTable">
        <table class="mailTable" cellpadding="0px" cellspacing="0px">
          <!-- style="text-align:right" -->
          <tr v-for="index in rowCount" :key="index">
            <td class="column" style="width:100px;color:#727878;margin-bottom:5px;line-height:28px;">{{tableData[index-1].name}}：</td>
            <td style="padding:8px">{{tableData[index-1].value}}</td>
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
      tableData: [],
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
          ids: [this.$route.query.sn]
        };
      }
      // POST /api/pressData/findBySourceAndIssn
      // this.dialogTableVisible = true;
      this.$post("/api/pressData/findBySourceAndIssn", requestParams)
        .then(res => {
          if (res.data.result && res.data.result.length > 0) {
            let data = [];
            res.data.result[0].properties.forEach(obj => {
              obj.name = obj.name.replace(/[ ]/g, "");
              data.push(obj);
            });
            let EBSCO = []
            let CTdata = []
            data.forEach(element => {
              console.log('element.name')
              console.log(element.name)
              if (element.name == "TitleName") {
                EBSCO.push({
                  name: '刊名',
                  value: element.value,
                })
              }
              if (element.name == "ISSN") {
                EBSCO.push({
                  name: 'ISSN',
                  value: element.value,
                })
              }
              if (element.name == "Status") {
                EBSCO.push({
                  name: '状态',
                  value: element.value,
                })
              }
              if (element.name == "IssuesPerYear") {
                EBSCO.push({
                  name: '期数',
                  value: element.value,
                })
              }
              if (element.name == "Language") {
                EBSCO.push({
                  name: '文种',
                  value: element.value,
                })
              }
              if (element.name == "PublisherName") {
                EBSCO.push({
                  name: '出版社',
                  value: element.value,
                })
              }
              if (element.name == "Country") {
                EBSCO.push({
                  name: '出版地',
                  value: element.value,
                })
              }
              if (element.name == "OpenAccessTitle") {
                EBSCO.push({
                  name: '是否OA刊',
                  value: element.value,
                })
              }
              // -----------------中图
              if (element.name == "核心刊") {
                CTdata.push({
                  name: "是否核心刊",
                  value: element.value,
                })
              }
              if (
                element.name == "刊号" || element.name == "刊名" || element.name == "ISSN" || element.name == "期数"
                || element.name == "状态" || element.name == "中图分类号" || element.name == "文种" || element.name == "刊名"
                || element.name == "创刊年" || element.name == "编目日期" || element.name == "出版地"
              ) {
                CTdata.push({
                  name: element.name,
                  value: element.value,
                })
              }
              if (element.name == "出版者") {
                element.name = '出版社'
              }
              if (element.name == "刊价") {
                CTdata.push({
                  name: "中图币制",
                  value: element.value,
                })
                CTdata.push({
                  name: "中图刊价",
                  value: element.value,
                })
              }
            });
            var arr = ['刊号', '刊名', 'ISSN', '期数', '状态', '中图分类号',
              '文种', '是否核心刊', '中图币制', '中图刊价', '创刊年', '编目日期', '出版社', '出版地', '是否OA刊'];
            var newCTData = [];
            var newEBSCO = [];
            for (var i of arr.keys()) {
              for (var j of CTdata.keys()) {
                if (arr[i] == CTdata[j].name) {
                  newCTData.push(CTdata[j]);
                }
              }
            }
            console.log('EBSCO')
            console.log(EBSCO)
            for (var i of arr.keys()) {
              for (var j of EBSCO.keys()) {
                if (arr[i] == EBSCO[j].name) {
                  newEBSCO.push(EBSCO[j]);
                }
              }
            }
            if (this.$route.query.source == 4) {
              this.tableData = newCTData;
            } else {
              this.tableData = newEBSCO;
            }

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

    　 　　.mailTable tr td {
      border: 1px solid #e3e3e3;
      width: 300px;
      height: 35px;
      line-height: 35px;
      box-sizing: border-box;
      // padding: 0 10px;
    }
    　　.mailTable tr td .column {
      // background-color: #eff3f6;
      background-color: blue;
      color: #393c3e;
    }
  }
}
</style>
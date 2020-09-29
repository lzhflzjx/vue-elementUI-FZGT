<template>
  <div class="home">
    <div class="left">
      <div id="tableTask">
        <div class="tableHeader">
          <span>最新任务统计</span>
          <el-checkbox v-if="isAdmin == true" @change="checkedChange" v-model="checked">仅看本人数据</el-checkbox>
        </div>
        <div class="tableBody">
          <transition name="el-zoom-in-center">
            <div v-show="show2" class="transition-box">
              <el-table :data="tableData" stripe border style="width: 100%" :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}">
                <el-table-column prop="date" width="180"></el-table-column>
                <el-table-column prop="book" label="图书" width="180"></el-table-column>
                <el-table-column prop="press" label="报刊" width="180"></el-table-column>
                <el-table-column prop="database" label="数据库"></el-table-column>
                <el-table-column prop="image" label="图片"></el-table-column>
              </el-table>
            </div>
          </transition>
        </div>
        <div class="tableFooter">注：数字资料代表待完成数量/总数量；【全部】从系统启用或管理员启用日期算，累计数量。</div>
      </div>
      <div id="encharts">
        <p>本月审读员工作量统计</p>
        <div style="width:1000px;height:500px" ref="chart"></div>
      </div>
    </div>
    <div class="right">
      <div id="fastLink">
        <p>快速链接</p>
        <ul>
          <li v-for="item in columnData" :key="item.url">
            <el-link type="primary" @click="selectLink(item.id,item.url,item.type)">{{item.name}}</el-link>
          </li>
        </ul>
      </div>
      <div id="message">
        <p>
          消息( <span class="messageClass">{{messageNumber}} </span> )
          <span @click="isAllRead" class="isRead">全部已读</span>
        </p>
        <div id="scroll">
          <ul>
            <li :class="{ list:item.flag == '2' }" @click="changeValue(item.id,item.type)" v-for="(item,index) in messageData" :key="item.id">
              <span class="content">{{item.content}}</span>
              <span class="createTime">{{item.createTime}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const echarts = require("echarts");
export default {
  data() {
    return {
      show2: true,
      messageNumber: 0,
      readerList: [], //审读员列表
      ratio: [], //完成比例
      series: [], //审读员工作量统计
      isAdmin: false,
      isActive: [-1],
      checked: false,
      columnData: [
        // { name: "数据库列表", url: "dataBase" },
        // { name: "图书库", url: "bookLibrary" },
        // { name: "红名单管理 ", url: "redListManage" },
        // { name: "报刊实物审读", url: "initPage" },
        // { name: "图片库", url: "imgLibrary" }
      ],
      urlName: [
        { name: "数据库列表", url: "数据库" },
        { name: "图书库", url: "图书库" },
        { name: "红名单管理 ", url: "红名单管理" },
        { name: "报刊实物审读", url: "报刊库" },
        { name: "图片库", url: "图片库" }
      ],
      messageData: [
        { name: "消息1", id: "1" },
        { name: "消息2", id: "2" },
        { name: "消息3", id: "3" },
        { name: "消息4", id: "4" },
        { name: "消息5", id: "5" }
      ],
      tableData: [
        {
          date1: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date1: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date1: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date1: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  created() {
    let admin = JSON.parse(window.localStorage.getItem("userInfo")).userInfo
      .roleNames[0];
    if (admin == "超级管理员") {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.statistics();
    this.getCharts();
    this.getLink();
    this.getMessage();
  },
  mounted() {
    // this.initCharts();
  },
  methods: {
    // 消息列表
    // GET /api/homePage/Manage/selectMessage
    getMessage() {
      this.$get("/api/homePage/Manage/selectMessage")
        .then(res => {
          this.messageData = res.data.result;
          this.messageNumber = res.data.totalCount;
        })
        .catch(res => { });
    },
    // 修改链接名字
    changeName(name) {
      this.urlName.forEach(element => {
        if (element.url == name) {
          name = element.name;
        }
      });
      return name;
    },
    // 选择链接
    selectLink(id, url, type) {
      this.$get("/api/homePage/Manage/updateLink", { id: id })
        .then(res => {
          localStorage.setItem("curMenuIndex", type);
          let router = this.$router.resolve({
            path: url
          });
          window.open(router.href, "_blank");
          this.getLink();
        })
        .catch(res => { });
    },
    // 查询链接
    getLink() {
      this.$get("/api/homePage/Manage/selectLink")
        .then(res => {
          this.columnData = res.data.result;
        })
        .then(res => { });
    },
    // 获取审读员工作量统计
    getCharts() {
      // GET /api/homePage/Manage/selectToMonthReaderTask
      this.$get("/api/homePage/Manage/selectToMonthReaderTask")
        .then(res => {
          let arr = res.data.readerCompleteCount;
          let arr1 = arr.map(item => {
            return Object.assign({
              name: "李雪",
              type: "bar",
              stack: "任务汇总",
              barWidth: 70, //设置柱状图大小
              // xAxisIndex: 1,
              yAxisIndex: 0,
              data: item
            });
          });
          let reader = res.data.readerList;
          for (let i = 0; i < reader.length; i++) {
            arr1[i].name = reader[i];
          }
          // reader.unshift("完成比例");
          reader.push("完成比例");
          this.readerList = reader;
          arr1.push({
            name: "完成比例",
            type: "line",
            yAxisIndex: 1,
            data: res.data.ratio
          });
          this.series = arr1;
          this.initCharts();
        })
        .catch(res => { });
    },
    // 是否只看本人
    checkedChange() {
      // this.show2 = !this.show2
      this.show2 = false
      var result = {
        time: (callback) => {
          this.timer = setInterval(() => {
            let ss = '转换'
            this.show2 = true
            callback(ss);
          }, 500);
        }
      };
      result.time((ss) => {
        if (ss == '转换') {
          this.show2 = true
          clearInterval(this.timer);
        }
      });
      if (this.checked == false) {
        this.statistics();
      } else {
        this.statistics("222");
      }
    },
    // 最新任务统计
    statistics(type) {
      let param = type == undefined ? null : type;
      // GET /api/homePage/Manage/selectMissionCount
      this.$get("/api/homePage/Manage/selectMissionCount", { type: param })
        .then(res => {
          let arr = [];
          for (const key in res.data) {
            arr.push(res.data[key]);
          }
          let arr1 = arr.map(item => {
            return Object.assign(item, { date: "123" });
          });
          let days = ["今日", "近7天", "近30天", "全部"];
          for (let i = 0; i < days.length; i++) {
            arr1[i].date = days[i];
          }
          this.tableData = arr1;
        })
        .catch(res => { });
    },
    iniRead() { },
    isAllRead() {
      // for (let i = 0; i < this.messageData.length; i++) {
      //   this.isActive.push(i);
      // }
      this.changeValue(null);
    },
    // 设置消息已读
    changeValue(id, type) {
      // this.isActive.push(index);
      // GET /api/homePage/Manage/updateMessage
      this.$get("/api/homePage/Manage/updateMessage", { ids: id })
        .then(res => {
          this.getMessage();
        })
        .catch(res => { });
      let url = null;
      let index;
      // 跳转页面
      switch (type) {
        case 1:
          url = "/bookCheck";
          index = 1;
          break;
        case 2:
          url = "/imgCheck";
          index = 1;
          break;
        case 3:
          url = "/dataBaseRead";
          index = 3;
          break;
        case 4:
          url = "/initPage";
          this.$message.warning("该模块尚未开发");
          return;
          break;
        default:
          url = null;
          return;
          break;
      }
      localStorage.setItem("curMenuIndex", index);
      let router = this.$router.resolve({
        path: url
      });
      window.open(router.href, "_blank");
    },
    initCharts() {
      let myChart = echarts.init(this.$refs.chart);
      // 绘制图表
      myChart.setOption({
        // color:['#1DD6CF','#ED8DD0',"#ffd84f","#fff"],//标识颜色
        // title: {
        //   text: "本月审读员工作量统计"
        //   // subtext: "纯属虚构"
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#283b56"
            }
          }
        },
        grid: {
          left: "30%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        legend: {
          data: this.readerList,
          // top:'50px',
          bottom: "280px",
          orient: "vertical", //垂直显示
          // y: "bottom", //延Y轴居中
          x: "3%" //居右显示
        },
        toolbox: {
          show: true,
          feature: {
            // dataView: { readOnly: false },
            restore: {
              title: "刷新"
            },
            saveAsImage: {
              title: "下载",
              name: "本月审读员工作量统计"
            }
          }
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: ["图书", "报刊", "数据库", "图片"]
          }
          // {
          //   name: "邮件营销",
          //   type: "bar",
          //   // stack: "任务汇总",
          //   data: [120, 132, 101, 134, 90, 230, 210]
          // },
          // {
          //   type: "category",
          //   boundaryGap: true,
          //   data: ["图书", "报刊", "数据库", "图片"]
          // }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            name: "数量",
            max: 300,
            min: 0
            // boundaryGap: [0.2, 0.2]
          },
          {
            type: "value",
            scale: true,
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: "{value} %"
            },
            name: "完成比例",
            max: 100,
            min: 0
            // boundaryGap: [0.2, 0.2]
          }
        ],
        series: this.series
        // series: [
        //   {
        //     name: "李雪",
        //     type: "bar",
        //     stack: "任务汇总",
        //     barWidth: 70, //设置柱状图大小
        //     // xAxisIndex: 1,
        //     yAxisIndex: 0,
        //     data: [0, 0, 0, 0]
        //   }
        // ]
        //   {
        //     name: "陈晨",
        //     type: "bar",
        //     stack: "任务汇总",
        //     // xAxisIndex: 1,
        //     yAxisIndex: 0,
        //     data: [220, 182, 191, 234]
        //   },
        //   {
        //     name: "王慧",
        //     type: "bar",
        //     stack: "任务汇总",
        //     // xAxisIndex: 1,
        //     yAxisIndex: 0,
        //     data: [150, 232, 201, 154]
        //   },
        //   {
        //     name: "王佳",
        //     type: "bar",
        //     stack: "任务汇总",
        //     // xAxisIndex: 1,
        //     yAxisIndex: 0,
        //     data: [150, 232, 201, 154]
        //   },
        //   {
        //     name: "完成比例",
        //     type: "line",
        //     yAxisIndex: 1,
        //     data: [50, 32, 71, 64]
        //   }
        // ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  width: 100%;
  height: 100%;
  // background: #fff;
  .left {
    flex: 50%;
    #tableTask {
      width: 1000px;
      height: 350px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      background: #fff;
      .tableHeader {
        // font-weight:bold;
        padding-left: 12px;
        background: #dfefff;
        height: 37px;
        line-height: 37px;
        color: #1e69b5;
      }
      .tableBody {
        padding: 12px 12px 20px 12px;
        height: 240px;
      }
      .tableFooter {
        height: 24px;
        line-height: 24px;
        margin-left: 24px;
        color: #999999;
      }
      .el-checkbox {
        margin-left: 690px;
      }
    }
    #encharts {
      width: 1000px;
      margin-top: 40px;
      // padding: 20px 0 10px 24px;
      background: #fff;
      color: #1e69b5;
      p {
        padding: 8px;
        // margin: 0 80px 0 50px;
        background: #dfefff;
      }
    }
  }
  .right {
    width: 45%;
    padding-left: 40px;
    #fastLink {
      width: 700px;
      height: 350px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      // border: 1px solid grey;
      background: #fff;
      color: #1e69b5;
      p {
        // height: 24px;
        // line-height: 24px;
        // font-size: 20px Extra large;
        // font-weight: bold;
        padding: 8px;
        margin: 0;
        background: #dfefff;
      }
      ul li {
        list-style: none;
        margin-top: 20px;
        .el-link {
          font-size: 16px;
        }
      }
    }
    #message {
      width: 700px;
      height: 550px;
      margin-top: 40px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      // border: 1px solid grey;
      background: #fff;
      color: #1e69b5;
      position: relative;
      // overflow: scroll;
      p {
        padding: 8px;
        margin: 0;
        background: #dfefff;
        // position: absolute;
        // position: fixed;
        .messageClass {
          // color: grey;
          color: #1e69b5;
        }
        .isRead {
          font-size: 14px;
          color: #148ae0;
          float: right;
          cursor: pointer;
        }
      }
      #scroll {
        height: 100%;
        background: #fff;
        overflow: scroll;
        ul li {
          list-style: none;
          // color: #148ae0;
          font-size: 24px;
          // display: flex;
          cursor: pointer;
          :hover {
            text-decoration: underline;
          }
          span {
            font-size: 14px;

            // vertical-align: text-bottom;
          }
          .content {
            // float: left;
          }
          .createTime {
            float: right;
            margin-top: 10px;
            margin-right: 20px;
          }
        }
        ul li:before {
          // content: "\2022";◎۞●
          content: "●";
          color: #148ae0;
          font-size: 20px;
          margin-right: 5px;
        }
        ul .list:before {
          // content: "\2022";◎۞●
          content: "●";
          color: #dfefff;
          font-size: 20px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>

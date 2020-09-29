<template>
  <div>
    <div style="width:1000px;height:500px" ref="chart"></div>
  </div>
</template>
<script>
const echarts = require("echarts");
export default {
  data() {
    return {};
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      let myChart = echarts.init(this.$refs.chart);
      // 绘制图表
      myChart.setOption({
        // color:['#1DD6CF','#ED8DD0',"#ffd84f","#fff"],//标识颜色
        title: {
          text: "本月审读员工作量统计"
          // subtext: "纯属虚构"
        },
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
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        legend: {
          data: ["图书", "报刊", "数据库", "图片"],
          //  top: '30%',
          //   left: '50%',
          //   orient: 'vertical',
          orient: "vertical", //垂直显示
          y: "30%", //延Y轴居中
          x: "10%" //居右显示
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
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
          //   // stack: "广告",
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
            max: 2000,
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
        series: [
          {
            name: "图书",
            type: "bar",
            stack: "广告",
            barWidth: 70, //设置柱状图大小
            // xAxisIndex: 1,
            yAxisIndex: 0,
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "报刊",
            type: "bar",
            stack: "广告",
            // xAxisIndex: 1,
            yAxisIndex: 0,
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "数据库",
            type: "bar",
            stack: "广告",
            // xAxisIndex: 1,
            yAxisIndex: 0,
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "图片",
            type: "bar",
            stack: "广告",
            // xAxisIndex: 1,
            yAxisIndex: 0,
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "完成比例",
            type: "line",
            yAxisIndex: 1,
            data: [50, 32, 71, 64, 40, 10, 40]
          }
        ]
      });
    }
  }
};
</script>
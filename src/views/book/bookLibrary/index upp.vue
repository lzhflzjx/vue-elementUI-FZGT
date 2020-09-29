<template>
  <div :class="$options.name">
    <button @click="exportExcel">导出表格</button>
  </div>
</template>

<script>
export default {
  name: "export",
  data() {
    return {
      loading: false
    };
  },
  methods: {
    exportExcel() {
      let sourceOriginAmount = [
        {
          goodsName: "苹果",
          sourceCode: "123"
        },
        {
          goodsName: "香蕉",
          sourceCode: "234"
        }
      ]; // 需要导出的数据，可以动态获取
      this.loading = true; // 设置一个loading，生成Excel需要时间
      import("@/vendor/Export2Excel.js").then(excel => {
        // 导入js模块
        const tHeader = ["编号", "商品名称", "溯源码"]; // 导出excel 的标题
        const filterVal = ["index", "goodsName", "sourceCode"]; // 每个标题对应的字段

        const list = (sourceOriginAmount || []).map((item, key) => {
          // 通过 map 方法遍历，组装数据成上面的格式
          return {
            index: key + 1,
            goodsName: item.goodsName,
            sourceCode: item.key
          };
        });

        if (list) {
          const data = this.formatJson(filterVal, list); // 生成json数据
          excel.export_json_to_excel({
            // 调用excel方法生成表格
            header: tHeader,
            data,
            filename: this.goodsName
          });
        } else {
          alert("暂无无数据");
        }
        this.loading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>
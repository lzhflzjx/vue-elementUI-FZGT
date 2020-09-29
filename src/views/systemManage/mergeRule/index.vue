<template>
  <div id="mergeRule"  v-loading.fullscreen.lock="fullscreenLoading">
    <div class="box-table">
      <el-table
        size="small"
        :data="tableData"
        border
        style="width:100%;"
        @cell-dblclick="cellDblClick"
      >
        <el-table-column prop="column_comment" label="产品字段"></el-table-column>
        <!-- <el-table-column prop="product_type" label="分类"></el-table-column> -->
        <el-table-column prop="data_type" label="类型"></el-table-column>
        <el-table-column prop="countSource" label="来源信源数量"></el-table-column>
        <el-table-column prop="create_user" label="创建人"></el-table-column>
        <el-table-column label="修改时间">
          <template slot-scope="scope">
            <!-- <div v-text="dateFormat(scope.row.create_time)"></div> -->
            {{scope.row.update_time | dateFormat}}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box-card">
      <el-card>
        备注：</br>
        1.列表列出产品全部标准字段，已配置的明显显示，点击标准字段名称，跳转进入配置页面;</br>
        2.数据合并的必须条件是全部标准字段规则配置完成;</br>
        3.已配置的规格可以修改，修改后，新的数据合并按照新规则执行；</br>
      </el-card>
    </div>
  </div>
</template>

<script>
import dataJSon from "./data.json";
export default {
  data() {
    return {
      tableData: [],
      fullscreenLoading: false,
    };
  },
  methods: {
    // 表格双击
    cellDblClick(row, column, event) {
      console.log(row, column, event);
      // alert("双击");
      this.$router.push({
        path: "/mergeRule/mergeDetail",
        query: { id: row.id, name: row.column_comment }
      });
    },

    // 获取数据
    getData() {
      this.fullscreenLoading = true;
      this.$requrestAxios({
        url: "/etl/config/product/productSchemaListIndex",
        method: "post",
        params: {
          productType: "book"
        }
      }).then(res => {
        this.tableData = res.data.data;
        this.fullscreenLoading = false;
      })
    }
  },
  filters: {
    dateFormat:(date) => {
      if(date == null || date == ''){
        return ""
      }else{
        date = new Date(date)
      }
      let format = 'yyyy-MM-dd hh:mm:ss';
      if (date != 'Invalid Date') {
        var o = {
          "M+": date.getMonth() + 1, //month
          "d+": date.getDate(), //day
          "h+": date.getHours(), //hour
          "m+": date.getMinutes(), //minute
          "s+": date.getSeconds(), //second
          "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
          "S": date.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,(date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
              RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
        return format;
      }
      return '';
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
#mergeRule {
  padding: 15px;
  background: #fff;
  min-height: 100%;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
}
.box-table {
  width: calc(100% - 330px);
}
.box-card {
  width: 300px;
  margin-left: 30px;
  font-size: 12px;
  color: #999;
}
</style>
<template>
  <div id="conversion">
    <div class="change">
      汇率转换
    </div>
    <div class="table">
      <el-table :data="tableData" :header-cell-style="{background: '#d5eaf6',color:'#727878', fontSize:'14px'}" @row-dblclick="edit" style="width: 100%">
        <el-table-column prop="code" label="币制" width="180">
        </el-table-column>
        <el-table-column prop="exchangeSystem" label="汇率">
          <!-- <template slot-scope="{scope,$index}">
        <input class="edit-cell" v-if="showEdit[$index]" v-model="scope.exchangeSystem">
        <span v-if="!showEdit[$index]">{{scope.row.exchangeSystem}}</span>
      </template> -->
          <template slot-scope="scope">
            <input type="text" size="small" @change="funcEdit" v-on:keyup="inputTargetValue" v-if="showEdit.indexOf(scope.row.id) != -1" v-model="scope.row.exchangeSystem">
            <span style="cursor:pointer;" v-else type="text" size="small">{{scope.row.exchangeSystem}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

  <script>
export default {
  data() {
    return {
      id: "",//汇率id
      exchangeSystem: "",
      showEdit: [], //显示编辑框
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created() {
    this.getConversion()
  },
  methods: {
    //   获取输入框内容
    inputTargetValue(e) {
      this.exchangeSystem = e.target.value
    },
    edit(row, column, cell, event) {
      this.showEdit = []
      this.showEdit.push(row.id)
      this.id = row.id
      //   this.funcEdit(row.id, row.exchangeSystem)
    },
    // 编辑
    // 修改
    funcEdit() {
      this.$confirm('确定修改该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showEdit = []
        //   POST /api/exchange/updateById
        let params = {
          exchangeSystem: this.exchangeSystem,
          id: this.id
        }
        this.$post('/api/exchange/updateById', params)
          .then(res => {
            this.tableData = res.data.result
            this.getConversion()
          })
          .catch(res => { })
      }).catch(() => {
        this.showEdit = []
        this.getConversion()
        this.$message.info('已取消修改');
      });
    },
    getConversion() {
      // POST /api/exchange/findList
      this.$post('/api/exchange/findList?type=1')
        .then(res => {
          this.tableData = res.data.result
        })
        .catch(res => { })
    }
  },
}
  </script>

<style lang="scss" scoped>
#conversion {
  .change {
    // margin-bottom: 50px;
    font-size: 24px;
  }
  .table {
    margin: 50px;
    // margin-left: 400px;
    // margin-right: 400px;
  }
}
</style>
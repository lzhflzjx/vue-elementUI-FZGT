<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-input v-model="searchName" placeholder="输入姓名搜索" style="width:300px"></el-input>
        <el-input v-model="searchAge" placeholder="输入年龄搜索" style="width:300px"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="search">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="list">
      <el-table-column label="姓名" prop="price"></el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[1, 2,5, 10]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>
<script>
var listJson = {
  list: [
    { price: 'aa', age: 12 },
    { price: 'bb', age: 13 },
    { price: 'cc', age: 14 },
    { price: 'ad', age: 15 },
    { price: 'eaae', age: 16 },
    { price: 'faaf', age: 16 },
    { price: 'hah', age: 17 },
    { price: 'ii', age: 18 },
    { price: 'rar', age: 19 },
    { price: 'dd', age: 10 },
  ]
}
export default {
  data() {
    return {
      list: [],
      data: [],
      limit: 5,
      total: null,
      page: 1,
      searchName: "",
      searchAge: "",
    }
  },
  created() {
    this.pageList()
  },
  methods: {
    pageList() {
      // 发请求拿到数据并暂存全部数据,方便之后操作
      this.data = listJson.list
      this.getList()
    },
    // 处理数据
    getList() {
      // es6过滤得到满足搜索条件的展示数据list
      let list = this.data.filter(
        (item, index) => {
          let price = item.price.includes(this.searchName)
          let age = item.age.toString().includes(this.searchAge)
          return price && age
        }
      )
      // let list = this.data
      this.list = list.filter((item, index) =>
        index < this.page * this.limit && index >= this.limit * (this.page - 1)
      )
      this.total = list.length
    },
    // 当每页数量改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
      this.getList()
    },
    // 当当前页改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val
      this.getList()
    },
    // 搜索过滤数据
    search() {
      this.page = 1
      this.getList()
    }
  },
}
</script>

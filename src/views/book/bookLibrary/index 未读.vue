<template>
  <div style="height: 100vh; background-color: #f6f8fb; min-width: 1440px;">
    <!-- <ai-header></ai-header> -->
    <div style="padding: 24px">
      <div class="notice">
        <div class="notice-top">
          <div class="notice-top-title"><i class="el-icon-arrow-left"></i><span>通知列表</span></div>
          <div class="notice-top-type">
            <div>
              <el-checkbox  v-model="isAll"  @change="checkAll()" style="width: 100%;">全部消息</el-checkbox>
            </div>
            <div>
              <el-checkbox v-model="isRead" @change="checkRead()" style="width: 100%;">已读</el-checkbox>
            </div>
            <div>
              <el-checkbox  v-model="isUnread" @change="checkUnread()" style="width: 100%;">未读</el-checkbox>
            </div>
            <el-button type="primary" :disabled="!tableIds.length>0" size="small" @click="handleRemove">删除</el-button>
          </div>
        </div>
        <div class="notice-content">
          <p class="tips">
            <span>您有{{tipsNumber}}封未读消息</span>
          </p>
          <el-table
            ref="multipleTable"
            :data="tableData"
            @row-click="rowLink"
            tooltip-effect="dark"
            :show-header="showHeader"
            style="width: 100%"
            class="notice-table"
          >
            <el-table-column
              prop="historyIcon"
              label="historyIcon"
              width="30"
            >
              <template slot-scope="scope">
                <img v-show="scope.row.tableId === lastclickNum" :src="historyIcon" alt="" style="width:8px;height:10px;">
              </template>
            </el-table-column>
            <el-table-column
              type="selection"
              align="center"
              width="50"
            >
            </el-table-column>
            <el-table-column
              prop="mailbox"
              label="mailbox"
              width="40">
              <template slot-scope="scope">
                <img v-show="!scope.row.read" :src="mailbox" alt="" style="width:14px;height:8px;">
              </template>
            </el-table-column>
            <el-table-column
              prop="remind"
              label="remind"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="time"
              label="time"
              align="right"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="100"
            layout="prev, pager, next, jumper"
            :total="1000"
            class="notice-pagination">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Header from '@/layouts/components/Header'
export default {
  name: 'notice',
  // components: {
  //   'ai-header': Header
  // },
  data () {
    return {
      isAll: false, // 全选
      isRead: false, // 已读
      isUnread: false, // 未读
      showHeader: false,
      tipsNumber: '', // 未读消息数量
      tipsArr: [],
      removeArr: [],
      tableIds: [], // 记录选中的项
      mailbox: 'http://192.168.1.3:3002/images/notice_mail.png', // 邮箱图片
      historyIcon: 'http://192.168.1.3:3002/images/notice_active.png', // 上一次浏览记录
      lastclickNum: null,
      tableData: [
        {
          tableId: 1,
          remind: '您的dxg服务器即将到期，请及时续费',
          time: '11月27日',
          read: false
        }, {
          tableId: 2,
          remind: '您的dxg服务器即将到期，请及时续费',
          time: '11月27日',
          read: true
        }, {
          tableId: 3,
          remind: '您的dxg服务器即将到期，请及时续费',
          time: '11月27日',
          read: false
        }, {
          tableId: 4,
          remind: '您的dxg服务器即将到期，请及时续费',
          time: '11月27日',
          read: true
        }, {
          tableId: 5,
          remind: '您的dxg服务器即将到期，请及时续费',
          time: '11月27日',
          read: false
        }, {
          tableId: 6,
          remind: '您的dxg服务器即将到期，请及时续费',
          time: '11月27日',
          read: false
        }]
    }
  },
  mounted () {
    // 显示未读数量
    this.initializationNoRead()
    // 获取上一次点击记录
    this.lastclickNum = JSON.parse(localStorage.getItem('arr'))
    console.log(this.lastclickNum)
  },
  methods: {
    // 全选
    checkAll () {
      this.isRead = false // 隐藏已读按钮显示
      this.isUnread = false //隐藏未读按钮显示
      this.tableIds = [] //点击全选时设置默认选中的项为空 确保下面为其赋值
      this.$refs.multipleTable.clearSelection() // element table自带的清空选中方法
      if (this.isAll) { //当全选时
        this.$refs.multipleTable.toggleAllSelection() // 选中当前项，element table自带的选中方法
        this.tableData.map(row => {
          this.tableIds.push(row.tableId) // 将遍历的id放入记录选中项的数组中
          console.log(this.tableIds)
        })
      }
    },
    // 已读
    checkRead () {
      this.isAll = false // 隐藏全选按钮显示
      this.isUnread = false // 隐藏未读按钮显示
      this.tableIds = [] //点击已读时设置默认选中的项为空 确保下面为其赋值
      this.$refs.multipleTable.clearSelection() // element table自带的清空选中方法
      if (this.isRead) { // 当已读时
        this.tableData.map(row => {
          if (row.read) { // 遍历tableData当属性read为true的时候
            this.$refs.multipleTable.toggleRowSelection(row) // 选中当前项，element table自带的选中方法
            this.tableIds.push(row.tableId) // 将遍历的id放入记录选中项的数组中
            console.log(this.tableIds)
          }
        })
      }
    },
    // 未读
    checkUnread () {
      this.isAll = false // 隐藏全选按钮显示
      this.isRead = false // 隐藏已读按钮显示
      this.tableIds = [] // 点击未读时设置默认选中的项为空 确保下面为其赋值
      this.$refs.multipleTable.clearSelection() // element table自带的清空选中方法
      if (this.isUnread) { // 当未读时
        this.tableData.map(row => {
          if (!row.read) { // 遍历tableData当属性read为false的时候
            this.$refs.multipleTable.toggleRowSelection(row) // 选中当前项，element table自带的选中方法
            this.tableIds.push(row.tableId) // 将遍历的id放入记录选中项的数组中
            console.log(this.tableIds)
          }
        })
      }
    },
    // 未读邮箱数量
    initializationNoRead () {
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.tableData[i].read) {
          this.tipsArr.push(i)
          console.log(this.tipsArr.length)
          this.tipsNumber = this.tipsArr.length
        }
      }
    },
    // 删除选中邮箱
    handleRemove () {
      var newDate = []  // 定义新数组存放保留的数值
      this.tableData.forEach((val, index) => {
        if (!(this.tableIds.indexOf(val.tableId) > -1)) {
          newDate.push(val) //筛选出tableIds里面存在的项 并将其进行取反 将符合条件的值加到newDate中（也就是需要保留的值）
          console.log(newDate)
        }
      })
      var result = confirm('确定删除？')
      if (result === true) {
        // 将当前新数组赋值给原数组，数据改变 =》界面改变
        this.tableData = newDate // 将需要保留的项赋值给tableData
        console.log(this.tableData)
        this.tableIds = [] // 配合视图显示按钮不可点击状态
        return true
      } else {
        return false
      }
    },
    rowLink (row, event, column) { //  表格行点击
      this.$router.push({ //向详情页传值
        name: 'notice-detail',
        params: {
          id: row.tableId
        }
      })
    }
  }
}
</script>
<style scoped>
.notice{
  background-color: #fff;
  padding: 32px;
  -webkit-box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
  box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
}
.notice-top-title span{
  margin-left:10px;font-size:16px;
  cursor: pointer;
}
.notice-top-type{
  margin-top: 24px;
  display: flex;
}
.notice-top-type div{
  width:94px;
  height:32px;
  background:rgba(250,250,250,1);
  border:1px solid rgba(216,216,216,1);
  text-align: center;
  line-height: 28px;
  margin-right: 16px
}
.notice-content{
  margin-top: 12px
}
.tips{
  width:100%;
  height:54px;
  border-bottom: 1px solid #eeeeee;
  line-height: 54px;
}
.tips span{
  margin-left: 14px;
  font-size:12px;
  color: #1C91FC
}
.notice-pagination{
  margin-top: 30px;
  text-align: right
}
</style>
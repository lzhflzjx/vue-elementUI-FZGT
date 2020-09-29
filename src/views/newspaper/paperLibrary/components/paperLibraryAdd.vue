<template>
  <div id="soueceDetail">
    <div class="top">
      <span @click="$router.push('/paperLibrary')" class="back">
        <i class="el-icon-back"></i>
        <span style="font-size:13px;">返回</span>
        <el-divider direction="vertical"></el-divider>
      </span>
      <span v-if="this.$route.query.sn">报刊编辑</span>
      <span v-else>单条新增</span>
      <div class="pagingDiv" v-if="paperLibraryList">
        <div class="paging">
          <el-button size="mini" @click="prev" :disabled='paperLibraryList[0]==$route.query.sn' icon="el-icon-arrow-left">上一条</el-button>
          <span v-if="paperLibraryList.length>1" class="page">
            <span class="curPage">{{paperLibraryList.indexOf(this.$route.query.sn)+1}}</span>/{{paperLibraryList.length}}
          </span>
          <el-button size="mini" @click="next" :disabled='paperLibraryList[paperLibraryList.length-1]==$route.query.sn'>下一条<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="title header" @click="isExpand">
        {{isShow?'全部展开':'全部收起'}}
        <i :class="isShow?'icon-shouqi':'icon-zhankai'"></i>
      </div>
      <el-button v-if="this.$route.query.sn || this.$route.query.pressNo" size="medium" @click="edit">{{isEdit}}</el-button>
      <el-button v-else size="medium" type="primary" @click="save">保存</el-button>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item name="0">
          <template slot="title">
            <div class="title">
              <i :title="isFold[0]?'收起':'展开'" :class="isFold[0]?'icon-shouqi':'icon-zhankai'"></i>基本信息
            </div>
          </template>
          <div v-for="(obj,i) in basicOption" :key="i">
            <div class="dialogCont" v-if="obj.type == 'drop'">
              <label>{{obj.label}}</label>
              <el-select v-model="obj.input" @change="funcEdit" :disabled="flag" clearable size="mini" style="width:80%">
                <el-option v-for="obj in valOption[obj.conditionType]" :key="obj.value" :label="obj.name" :value="obj.value"></el-option>
              </el-select>
            </div>
            <div class="dialogCont" v-else-if="obj.type == 'pulisher'">
              <label class="label">{{obj.label}}</label>
              <el-select v-model="obj.input" @change="funcEdit" :disabled="flag" style="width:80%" size="mini" clearable filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="findPulishers">
                <el-option v-for="item in pressOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="dialogCont" v-else-if="obj.type == 'date'">
              <label class="label">{{obj.label}}</label>
              <el-date-picker v-model="obj.input" @change="funcEdit" :readonly="flag" size="mini" style="width:80%" type="date" :value-format="'yyyy-MM-dd'" placeholder="选择日期"></el-date-picker>
            </div>
            <div class="dialogCont" v-else>
              <i>{{obj.logo}}</i>
              <label>{{obj.label}}</label>
              <!-- <span v-if="readOnlyMode" v-text="taskData.paperName"></span> -->
              <!-- v-for="iText in obj.input.split(";")" :key="iText" -->
              <div class="relationNo" v-if="obj.relation"><span v-for="iText in relationNoInput" :key="iText" @click="relationJump(iText)" class="relationText">{{iText}}</span></div>
              <!-- <div v-if="obj.relation" v-text="obj.paperName"  @dblclick.native="relationJump(obj.relation,obj.input)"   style="width:80%" placeholder="请输入内容" clearable></div> -->
              <el-input v-if="!obj.relation" v-model="obj.input" @change="funcEdit" :disabled="obj.unEdit" :readonly="flag" size="mini" style="width:80%" :placeholder="obj.placeholder?obj.placeholder:'请输入内容'" clearable></el-input>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="1">
          <template slot="title">
            <div class="title">
              <i :title="isFold[1]?'收起':'展开'" :class="isFold[1]?'icon-shouqi':'icon-zhankai'"></i>出版商条款与约款
            </div>
          </template>
          <div v-for="(obj,i) in publisherOption" :key="i">
            <div class="dialogCont">
              <label>{{obj.label}}</label>
              <el-input v-model="obj.input" @change="funcEdit" :readonly="flag" size="mini" style="width:80%" placeholder="请输入内容" clearable></el-input>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <div class="title">
              <i :title="isFold[2]?'收起':'展开'" :class="isFold[2]?'icon-shouqi':'icon-zhankai'"></i>刊数
            </div>
          </template>
          <div v-for="(obj,i) in issuesOption" :key="i">
            <div class="dialogCont" v-if="obj.type == 'date'">
              <label class="label">{{obj.label}}</label>
              <el-date-picker v-model="obj.input" @change="funcEdit" :readonly="flag" size="mini" style="width:80%" type="date" :value-format="'yyyy-MM-dd'" placeholder="选择日期"></el-date-picker>
              <!-- <el-date-picker v-model="obj.input" size="mini" style="width:80%" :value-format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
            </div>
            <div class="dialogCont" v-else>
              <label>{{obj.label}}</label>
              <el-input v-model="obj.input" @change="funcEdit" :readonly="flag" size="mini" style="width:80%" placeholder="请输入内容" clearable></el-input>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <div class="title">
              <i :title="isFold[3]?'收起':'展开'" :class="isFold[3]?'icon-shouqi':'icon-zhankai'"></i>主题/分类
            </div>
          </template>
          <div v-for="(obj,i) in themeOption" :key="i">
            <div class="dialogCont">
              <label>{{obj.label}}</label>
              <el-input v-model="obj.input" @change="funcEdit" :readonly="flag" size="mini" style="width:80%" placeholder="请输入内容" clearable></el-input>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            <div class="title">
              <!-- @click="isShow=!isShow" -->
              <!-- <i class="header-icon el-icon-info"></i> -->
              <i :title="isFold[4]?'收起':'展开'" :class="isFold[4]?'icon-shouqi':'icon-zhankai'"></i>费率
            </div>
          </template>
          <el-table :data="tableData" @header-click="addPrice" stripe style="width: 100%">
            <el-table-column prop="priceExplain" label="价格说明"></el-table-column>
            <el-table-column prop="priceType" label="价格类型"></el-table-column>
            <el-table-column prop="order" label="新订/续订"></el-table-column>
            <el-table-column prop="timeLimit" label="期限"></el-table-column>
            <el-table-column prop="numberCopies" label="份数"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="currency" label="币制"></el-table-column>
            <el-table-column prop="renderHeader" v-if="!showAdd" :render-header="renderHeader">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="deletePrice(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <span class="comment" style="float:left;color:red; margin-left:50px;">费率不包含税金</span>
        </el-collapse-item>
        <el-collapse-item name="5">
          <template slot="title">
            <div class="title">
              <i :title="isFold[5]?'收起':'展开'" :class="isFold[5]?'icon-shouqi':'icon-zhankai'"></i>其他
            </div>
          </template>
          <div v-for="(obj,i) in otherOption" :key="i">
            <div class="dialogCont" v-if="obj.type == 'drop'">
              <label>{{obj.label}}</label>
              <el-select v-model="obj.input" @change="funcEdit" :disabled="flag" clearable size="mini" style="width:80%">
                <el-option v-for="obj in valOption[obj.conditionType]" :key="obj.value" :label="obj.name" :value="obj.value"></el-option>
              </el-select>
            </div>
            <div class="dialogCont" v-else>
              <label>{{obj.label}}</label>
              <el-input v-model="obj.input" @change="funcEdit" :readonly="flag" size="mini" style="width:80%" placeholder="请输入内容" clearable></el-input>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 添加价格对话框 -->
    <el-dialog title="新增价格" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="价格说明" prop="priceExplain">
          <el-input v-model="ruleForm.priceExplain"></el-input>
        </el-form-item>
        <el-form-item label="价格类型" prop="priceType">
          <el-input v-model="ruleForm.priceType"></el-input>
        </el-form-item>
        <el-form-item label="新订/续订" prop="order">
          <el-input v-model="ruleForm.order"></el-input>
        </el-form-item>
        <el-form-item label="期限" prop="timeLimit">
          <el-input v-model="ruleForm.timeLimit"></el-input>
        </el-form-item>
        <el-form-item label="份数" prop="numberCopies">
          <el-input v-model="ruleForm.numberCopies"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="ruleForm.price"></el-input>
        </el-form-item>
        <el-form-item label="币制" prop="currency">
          <el-input v-model="ruleForm.currency"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import optionData from "./paperLibraryData.js";
import axios from "axios";
const querystring = require("querystring");
export default {
  inject: ['reload'],
  data() {
    return {
      editParams: {},
      isEdit: "编辑",
      showAdd: false,
      flag: false,//是否编辑
      dialogFormVisible: false, //打开对话框
      relationNoInput: [],//关联刊号组
      // 费率值为数组
      tableData: [
        // {
        //   priceExplain: "价格说明",
        //   priceType: "价格类型",
        //   order: "新订/续订",
        //   timeLimit: "期限",
        //   numberCopies: "份数",
        //   price: "价格",
        //   currency: "币制"
        // },
      ],
      ruleForm: {
        priceExplain: "",
        priceType: "",
        order: "",
        timeLimit: "",
        numberCopies: "",
        price: "",
        currency: ""
      },
      rules: {
        priceExplain: [{ required: true, message: "请输入价格说明", trigger: "blur" }],
        priceType: [{ required: true, message: "请输入价格类型", trigger: "blur" }],
        // order: [{ required: true, message: "请输入新订/续订", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        currency: [{ required: true, message: "请输入币制", trigger: "blur" }],
      },
      valOption: [
        [
          { name: "是", value: true },
          { name: "否", value: false }
        ],
        []
      ],
      states: [],
      list: [],
      pressOptions: [], //出版社列表
      activeNames: ["0", "1", "2", "3", "4", "5"], //折叠判断
      isShow: false, //折叠判断
      isFold: [false, false, false, false, false, false], //折叠判断
      basicOption: JSON.parse(JSON.stringify(optionData.basicOption)), //基本信息
      publisherOption: JSON.parse(JSON.stringify(optionData.publisherOption)), //出版商条款与约款
      issuesOption: JSON.parse(JSON.stringify(optionData.issuesOption)), //刊数
      themeOption: JSON.parse(JSON.stringify(optionData.themeOption)), //主题/分类
      otherOption: JSON.parse(JSON.stringify(optionData.otherOption)), //其他
      params: JSON.parse(JSON.stringify(optionData.params)), //保存传参
      paperLibraryList: JSON.parse(sessionStorage.getItem('paperLibraryList')), //保存传参
    };
  },
  created() {
    this.init()
  },
  methods: {
    prev() {
      let index = this.paperLibraryList.indexOf(this.$route.query.sn)
      this.$router.push({ path: '/paperLibraryAdd', query: { sn: this.paperLibraryList[index - 1] } })
      this.reload()
      // this.init()
    },
    next() {
      let index = this.paperLibraryList.indexOf(this.$route.query.sn)
      this.$router.push({ path: '/paperLibraryAdd', query: { sn: this.paperLibraryList[index + 1] } })
      this.reload()
      // this.init()
    },
    // 关联刊号跳转
    relationJump(pressNo) {
      // if (logo == "relationJump" && pressNo != null) {
      // GET /api/pressLibrary/findPressLibraryByNo
      let router = this.$router.resolve({
        path: "/paperLibraryAdd",
        query: { pressNo: pressNo,sn:this.$route.query.sn }
      });
      window.open(router.href, "_blank");
      this.$get("/api/pressLibrary/findPressLibraryByNo?pressNo=" + pressNo + "")
        .then(res => {

        })
        .catch(res => { })
      // }
    },
    // 删除价格
    deletePrice(index) {
      this.tableData.splice(index, 1)
    },
    // 修改
    funcEdit() {
      if (!this.flag && this.$route.query.sn) {
        this.editConfirm()
      }
      if (!this.flag && this.$route.query.pressNo) {
        this.editConfirm()
      }

    },
    editConfirm() {
      this.$confirm('确定修改该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.modify()
      }).catch(() => {
        this.getLibraryDetail()
        this.$message.info('已取消修改');
      });
    },
    // 初始化
    init() {
      this.relationNoInput = []
      if (this.$route.query.pressNo && this.$route.query.sn) {
        this.flag = true
        this.showAdd = true
        this.basicOption[3].unEdit = true
        this.getPressNoDetail()
      }
      else if (this.$route.query.sn && !this.$route.query.pressNo) {
        this.flag = true
        this.showAdd = true
        this.basicOption[3].unEdit = true
        this.getLibraryDetail()
      }
      else {
        this.basicOption[1].relation = false
      }
    },
    // 获取详情数据sn
    getLibraryDetail() {
      // ?name=天心天地生&age=24
      // GET /api/pressLibrary/findPressLibraryBySn
      this.$get("/api/pressLibrary/findPressLibraryBySn?sn=" + this.$route.query.sn + "")
        .then(res => {
          if (res.data.result.length > 0) {
            this.editParams = res.data.result[0]
            let params = res.data.result[0]
            this.basicOption.forEach(element => {
              for (const key in params) {
                if (key == 'publisher') {

                } else if (key == element.name) {
                  element.input = params[key].value;

                }
              }
            });
            this.publisherOption.forEach(element => {
              for (const key in params) {
                if (key == element.name) {
                  element.input = params[key].value;
                }
              }
            });
            this.issuesOption.forEach(element => {
              for (const key in params) {
                if (key == element.name) {
                  element.input = params[key].value;
                }
              }
            });
            this.themeOption.forEach(element => {
              for (const key in params) {
                if (key == element.name) {
                  element.input = params[key].value;
                }
              }
            });
            this.otherOption.forEach(element => {
              for (const key in params) {
                if (key == element.name) {
                  element.input = params[key].value;
                }
              }
            });
            // if (params["publisher"].value != undefined) {
            //   this.basicOption[13].input = params["publisher"].value.split(',')
            //   let presslength = this.basicOption[13].input.length
            //   if (this.basicOption[13].input[presslength - 1] == "") {
            //     this.basicOption[13].input.pop()
            //   }
            // }
            // 关联刊号
            this.relationNoInput = this.basicOption[1].input.split(";")
            // 出版社
            this.basicOption[13].input = params["publisher"].value.toString()
            let jsonArr = eval(params.rate.value)
            // let data = [];
            // for (var i in jsonArr) {
            //   data.push(jsonArr[i])
            // }
            this.tableData = jsonArr;
          }
        })
        .catch(res => { })
    },
    // 获取详情数据pressNo
    getPressNoDetail() {
      // ?name=天心天地生&age=24
      // GET /api/pressLibrary/findPressLibraryBySn
      this.$get("/api/pressLibrary/findPressLibraryByNo?pressNo=" + this.$route.query.pressNo + "")
        .then(res => {
          if (res.data.result.length > 0) {
            this.editParams = res.data.result[0]
            let params = res.data.result[0]
            this.basicOption.forEach(element => {
              for (const key in params) {
                if (key == element.name) {
                  element.input = params[key].value;
                }
              }
            });
            this.publisherOption.forEach(element => {
              for (const key in params) {
                if (key == element.name) {
                  element.input = params[key].value;
                }
              }
            });
            this.issuesOption.forEach(element => {
              for (const key in params) {
                if (key == element.name) {
                  element.input = params[key].value;
                }
              }
            });
            this.themeOption.forEach(element => {
              for (const key in params) {
                if (key == element.name) {
                  element.input = params[key].value;
                }
              }
            });
            this.otherOption.forEach(element => {
              for (const key in params) {
                if (key == element.name) {
                  element.input = params[key].value;
                }
              }
            });
            // if (params["publisher"].value != undefined) {
            //   this.basicOption[13].input = params["publisher"].value.split(',')
            //   let presslength = this.basicOption[13].input.length
            //   if (this.basicOption[13].input[presslength - 1] == "") {
            //     this.basicOption[13].input.pop()
            //   }
            // }
            // 获取关联刊号
            this.relationNoInput = this.basicOption[1].input.split(";")
            // 出版社
            this.basicOption[13].input = params["publisher"].value.toString()
            let jsonArr = eval(params.rate.value)
            // let data = [];
            // for (var i in jsonArr) {
            //   data.push(jsonArr[i])
            // }
            this.tableData = jsonArr;
          }
        })
        .catch(res => { })
    },
    // 编辑
    edit() {
      this.flag = !this.flag
      this.showAdd = !this.showAdd
      this.basicOption[1].relation = !this.basicOption[1].relation
      if (this.isEdit == "编辑") {
        this.isEdit = "取消编辑"
        // 关联刊号
        this.relationNoInput = this.basicOption[1].input.split(";")
      } else {
        this.isEdit = "编辑"
        // 关联刊号
        this.relationNoInput = this.basicOption[1].input.split(";")
      }
    },
    // 修改
    modify() {
      if (this.basicOption[2].input == "") {
        this.$message.warning("刊名不能为空")
        return
      }
      if (this.basicOption[3].input == "") {
        this.$message.warning("ISSN不能为空")
        return
      }
      this.basicOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.publisherOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.issuesOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.themeOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.otherOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.params.rate.value = JSON.stringify(this.tableData)
      // this.params.rate.value = JSON.stringify(this.tableData)

      // this.params.rate.value = eval("(" + this.tableData + ")")
      let params = JSON.parse(JSON.stringify(this.params))
      for (const key in params) {
        // if (params[key].value == "") {
        //   delete params[key]
        // }
      }
      params.sn.value = this.$route.query.sn
      // POST /api/pressLibrary/savePressLibrary
      this.$post("/api/pressLibrary/savePressLibrary", params)
        .then(res => {
          if (this.$route.query.sn) {
            this.$message.success('修改成功!');
          } else {
            this.$message.success(res.message)
          }
        })
        .catch(res => { });
    },
    save() {
      if (this.basicOption[0].input == null) {
        this.$message.warning("刊号不能为空")
        return
      }
      if (this.basicOption[2].input == null) {
        this.$message.warning("刊名不能为空")
        return
      }
      this.basicOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.publisherOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.issuesOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.themeOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.otherOption.forEach(element => {
        for (const key in this.params) {
          if (key == element.name) {
            this.params[key].value = element.input;
          }
        }
      });
      this.params.rate.value = JSON.stringify(this.tableData)
      let params = JSON.parse(JSON.stringify(this.params))
      for (const key in params) {
        if (params[key].value == null) {
          delete params[key]
        }
      }
      // POST /api/pressLibrary/savePressLibrary
      this.$post("/api/pressLibrary/savePressLibrary", params)
        .then(res => {
          if (this.$route.query.sn) {
            this.$message.success('修改成功!');
          } else {
            this.$message.success(res.message)
          }
        })
        .catch(res => { });
    },
    // 价格
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.tableData.length == 30) {
            this.$message.info("最多允许添加30条!")
            return
          }
          let price = JSON.parse(JSON.stringify(this.ruleForm))
          this.tableData.push(price)
          this.funcEdit()
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    // 价格
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    addPrice(data) {
      if (data.property == "renderHeader") {
        this.dialogFormVisible = true;
        this.ruleForm = {}
      }
    },
    // 渲染表头
    renderHeader() {
      return (
        <div
          class="el-icon-circle-plus"
          style=" font-size:20px;cursor: pointer;"
        ></div>
      );
    },
    //   出版社查询
    findPulishers(query) {
      if (query !== "") {
        this.$post(
          "/api/publisher/findPulishers",
          querystring.stringify({ pulisher: query })
        )
          .then(res => {
            let states = [];
            let list = [];
            res.data.result.forEach(element => {
              states.push(element.publishers);
            });
            list = states.map(item => {
              return { value: `${item}`, label: `${item}` };
            });
            this.pressOptions = list.filter(item => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          })
          .catch(err => { });
      } else {
        this.pressOptions = [];
      }
    },
    isExpand() {
      this.isShow = !this.isShow;
      if (this.isShow == true) {
        this.activeNames = [];
        this.isFold = [true, true, true, true, true, true];
      } else {
        this.activeNames = ["0", "1", "2", "3", "4", "5"];
        this.isFold = [false, false, false, false, false, false];
      }
    },
    handleChange(val) {
      for (let i = 0; i < 6; i++) {
        this.activeNames.indexOf(i.toString()) > -1 ? (this.isFold[i] = false) : (this.isFold[i] = true);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// #148ae0
#soueceDetail {
  padding: 15px;
  background: #fff;
  min-height: 100%;
  border-radius: 5px;
  .top {
    .pagingDiv {
      float: right;
      min-height: 40px;
      .paging {
        width: 100%;
        font-size: 14px;
        color: gray;
        text-align: right;
        line-height: 40px;
        .page {
          color: #c3c3c3;
          margin: 0 5px;
          .curPage {
            color: #409eff;
          }
        }
      }
    }
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
  }
  .content {
    margin-top: 20px;
    /deep/ .el-input.is-disabled .el-input__inner {
      background-color: #fff;
      color: #606266;
    }
    /deep/ .el-collapse-item__header {
      background-color: #dfefff;
    }
    /deep/ .el-icon-arrow-right:before {
      content: "";
    }
    .el-button {
      width: 100px;
    }
    .dialogCont {
      text-align: right;
      margin-right: 870px;
      margin-top: 8px;
      // vertical-align:bottom;
      .relationNo {
        display: inline-block;
        vertical-align: bottom;
        text-align: left;
        width: 80%;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        height: 26px;
        // line-height: 28px;
        .relationText {
          cursor: pointer;
          margin-left: 14px;
          font-size: 12px;
          color: #409eff;
        }
      }
      i {
        font-size: 18px;
        color: red;
        margin-right: 5px;
      }
      label {
        width: 200px;
        margin-right: 10px;
      }
    }
    .header {
      display: inline-block;
      margin-bottom: 10px;
      width: 93%;
    }
    .title {
      margin-top: 10px;
      border-bottom: solid 1px #e6e6e6;
      // border-left: solid 5px #409eff;
      cursor: pointer;
      padding-left: 5px;
      color: #409eff;
      i {
        float: left;
        margin-right: 5px;
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}
</style>

<template>
  <div id="detail">
    <div class="topBar">
      <div v-if="this.$route.query.id">编辑</div>
      <div v-else>新增</div>
    </div>
    <div class="main">
      <!--  -->
      <div class="left">
        <div>
          <label>
            <i>*</i>图书馆:
          </label>
          <el-input
            v-model="params.library"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </div>
        <div>
          <label>
            <i>*</i>信源ID:
          </label>
          <el-input
            v-model="params.siteid"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </div>
        <div>
          <label>
            <i>*</i>敏感问题:
          </label>
          <el-input
            v-model="params.sensitiveproblem"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </div>
        <div>
          <label>
            <i>*</i>等级:
          </label>
          <el-select
            v-model="params.gclevel"
            placeholder="请选择"
            clearable
            size="small"
            style="width:200px"
          >
            <el-option
              v-for="obj in valOption[0]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <label>
            <i>*</i>类型:
          </label>
          <el-select
            v-model="params.gctype"
            placeholder="请选择"
            clearable
            size="small"
            style="width:200px"
          >
            <el-option
              v-for="obj in valOption[1]"
              :key="obj.value"
              :label="obj.name"
              :value="obj.value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <label>
            <i>*</i>国家/地区:
          </label>
          <el-select
            v-model="params.country"
            placeholder="请选择"
            clearable
            size="small"
            style="width:200px"
          >
            <el-option v-for="obj in countrys" :key="obj.id" :label="obj.name" :value="obj.name"></el-option>
          </el-select>
        </div>
        <div>
          <label>
            <i>*</i>所在地:
          </label>
          <el-input
            v-model="params.location"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </div>
        <div>
          <label>所属大学:</label>
          <el-input
            v-model="params.college"
            size="small"
            style="width:200px"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </div>
        <div class="checkbox">
          <el-checkbox v-model="issyl">双一流</el-checkbox>
          <el-checkbox v-model="isnef">985</el-checkbox>
          <el-checkbox v-model="istoo">211</el-checkbox>
        </div>
        <div class="link">
          <label>
            <i>*</i>官网链接：
          </label>
          <el-input
            v-model="params.url"
            size="small"
            style="width:64%"
            placeholder="请输入内容"
            clearable
          ></el-input>
        </div>
        <div class="opinion">
          <label class="labelName">馆藏特色：</label>
          <el-input
            type="textarea"
            v-model="params.feature"
            :autosize="{ minRows:4}"
            style="width:65%;"
            show-word-limit
          ></el-input>
        </div>
        <div class="opinion">
          <label class="labelName">百度百科：</label>
          <el-input
            type="textarea"
            v-model="params.baidupedia"
            :autosize="{ minRows:4}"
            style="width:65%;"
            show-word-limit
          ></el-input>
        </div>
        <div class="opinion">
          <label class="labelName">Wikepedia：</label>
          <el-input
            type="textarea"
            v-model="params.wikipedia"
            :autosize="{ minRows:4}"
            style="width:65%;"
          ></el-input>
        </div>
      </div>
      <div class="right">
        <div class="opinion">
          <label class="labelName">优势科学：</label>
          <el-input
            type="textarea"
            v-model="params.superiority"
            :autosize="{ minRows:4}"
            style="width:calc(100% - 70px);font-size: 13px;margin-top:5px;"
            show-word-limit
          ></el-input>
        </div>
        <div class="opinion">
          <label class="labelName">博士点：&nbsp &nbsp</label>
          <el-input
            type="textarea"
            v-model="params.doctor"
            :autosize="{ minRows:4}"
            style="width:calc(100% - 70px);font-size: 13px;margin-top:5px;"
            show-word-limit
          ></el-input>
        </div>
        <div class="opinion">
          <label class="labelName">硕士点：&nbsp &nbsp</label>
          <el-input
            type="textarea"
            v-model="params.master"
            :autosize="{ minRows:4}"
            style="width:calc(100% - 70px);font-size: 13px;margin-top:5px;"
            show-word-limit
          ></el-input>
        </div>
        <div class="opinion">
          <label class="labelName">博士点究室：</label>
          <el-input
            type="textarea"
            v-model="params.department"
            :autosize="{ minRows:4}"
            style="width:calc(100% - 70px);font-size: 13px;margin-top:5px;"
            show-word-limit
          ></el-input>
        </div>
        <div class="opinion">
          <label class="labelName">Ranking：</label>
          <el-input
            type="textarea"
            v-model="params.ranking"
            :autosize="{ minRows:4}"
            style="width:calc(100% - 70px);font-size: 13px;margin-top:5px;"
            show-word-limit
          ></el-input>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      params: {
        baidupedia: "", //百度百科
        college: "", //所属大学
        country: "", //国家/地区
        countryId: "", //国家/地区 id
        create_date: "", //录入时间
        creater: "", //录入人
        department: "", //重点研究室
        doctor: "", //博士点
        feature: "", //馆藏特色
        gclevel: "", //等级
        gctype: "", //类型
        id: "", //主键id
        isnef: "", //是否985 0：否，1：是
        issyl: "", //是否双一流 0：否，1：是
        istoo: "", //是否211 0：否，1：是
        library: "", //图书馆
        location: "", //所在地
        master: "", //硕士点
        ranking: "", //Ranking
        sensitiveproblem: "", //敏感问题
        siteid: "", //信源ID
        superiority: "", //优势科学
        url: "", //官网链接
        wikipedia: "" //wikipedia
      },
      countrys: [], //国家列表
      options: [],
      value: "",
      issyl: false,
      isnef: false,
      istoo: false,
      lRepeat: false,
      idRepeat: false,
      textarea: "",
      bookData: []
    };
  },
  created() {
    // 获取字典
    this.getDictList(["gcLevel", "gcType"]);
    this.getAddressList({ level: 1, parentId: "" }); //获取国家列表
    this.init(); //初始化数据
  },
  computed: {
    ...mapGetters(["gcLevel", "gcType"]),
    valOption() {
      let arr = [
        // 馆藏信息等级 0
        this.gcLevel,
        // 馆藏信息类型 1
        this.gcType
      ];
      return arr;
    }
  },
  methods: {
    ...mapActions(["getDictList"]),
    init() {
      if (this.$route.query.id) {
        var detail = localStorage.getItem(this.$route.query.id);
        detail = JSON.parse(detail);
        this.params.library = detail.library;
        this.params.siteid = detail.siteid;
        this.params.sensitiveproblem = detail.sensitiveproblem;
        this.params.gclevel = detail.gclevel.toString();
        this.params.gctype = detail.gctype.toString();
        this.params.country = detail.country.toString();
        this.params.location = detail.location;
        this.params.college = detail.college;
        if (detail.istoo == 1) {
          this.istoo = true;
        }
        if (detail.isnef == 1) {
          this.isnef = true;
        }
        if (detail.issyl == 1) {
          this.issyl = true;
        }
        this.params.url = detail.url;
        this.params.feature = detail.feature;
        this.params.baidupedia = detail.baidupedia;
        this.params.wikipedia = detail.wikipedia;
        this.params.department = detail.department;
        this.params.superiority = detail.superiority;
        this.params.master = detail.master;
        this.params.doctor = detail.doctor;
        this.params.ranking = detail.ranking;
      } else {
      }
    },
   async save() {
      if (this.params.library === "") {
        this.$message.warning("请填写图书馆");
        return;
      }
      if (this.params.siteid === "") {
        this.$message.warning("请填写信源id");
        return;
      }
      if (this.params.sensitiveproblem === "") {
        this.$message.warning("请填写敏感问题");
        return;
      }
      if (this.params.gctype === "") {
        this.$message.warning("请填写类型");
        return;
      }
      if (this.params.location === "") {
        this.$message.warning("请填写所在地");
        return;
      }
      if (this.params.gclevel === "") {
        this.$message.warning("请填写等级");
        return;
      }
      if (this.params.country === "") {
        this.$message.warning("请填写国家/地区");
        return;
      }
      if (this.params.url === "") {
        this.$message.warning("请填写官网链接");
        return;
      }
      if (this.issyl) {
        this.params.issyl = "1";
      } else {
        this.params.issyl = "0";
      }
      if (this.isnef) {
        this.params.isnef = "1";
      } else {
        this.params.isnef = "0";
      }
      if (this.istoo) {
        this.params.istoo = "1";
      } else {
        this.params.istoo = "0";
      }
      var id;
      if (this.$route.query.id == undefined) {
        id = "0";
      } else {
        id = this.$route.query.id;
      }
      // 校验图书馆
      var requestParams = {
        name: this.params.library,
        id: id
      };
     await this.$get("/api/library/findByLibrary", requestParams)
        .then(res => {
          let flag = res.data.result.length;
          if (flag == 0) {
            this.lRepeat = false;
            // this.saveLibrary(0);
          } else {
            this.$message.warning("列表中已存在同名图书馆");
            this.lRepeat = true;
            return;
          }
        })
        .catch(res => {});
      if (!this.lRepeat) {
        // 校验信源id
        var requestIDParams = {
          siteId: this.params.siteid,
          id: id
        };
      await  this.$get("/api/library/findBySiteId", requestIDParams)
          .then(res => {
            let flag = res.data.result.length;
            if (flag == 0) {
              this.idRepeat = false;
              // this.saveLibrary(0);
            } else {
              this.$message.warning("列表中已存在相同信源ID");
              this.idRepeat = true;
              return;
            }
          })
          .catch(res => {});
      }

      if (!this.idRepeat && !this.lRepeat) {
        var requestParams = {
          name: this.$route.query.library,
          id: this.$route.query.id
        };
        localStorage.setItem(this.$route.query.id, JSON.stringify(this.params));
        this.saveLibrary(id);
      }
    },
    saveLibrary(id) {
      // POST /api/library/saveLibrary
      this.params.id = id;
      // return
      this.$post("/api/library/saveLibrary", this.params)
        .then(res => {
          this.$message.success("保存成功");
           Cookies.set('need_refresh', 'yes')
        })
        .catch(res => {});
    },
    // 转换国家
    changeCountry(data, type) {
      if (type == null) {
      } else {
        data.forEach(item => {
          if (type == item.id) {
            this.params.country = item.name;
          }
        });
        // return type;
      }
    },
    // 获取国家列表
    // data  {level:1,parentId:""}
    getAddressList(data) {
      this.$get("/api/region/findRegions", data).then(res => {
        if (data.level == 1) {
          this.countrys = res.data;
          if (this.$route.query.id) {
            var detail = localStorage.getItem(this.$route.query.id);
            detail = JSON.parse(detail);
            this.changeCountry(this.countrys, detail.country);
          }
          this.provinces = [];
          this.citys = [];
          if (res.data.length > 0) {
            this.getAddressList({ level: 2, parentId: res.data[0].id });
          }
        } else if (data.level == 2) {
          this.provinces = res.data;
          this.citys = [];
          if (res.data.length > 0) {
            this.getAddressList({ level: 3, parentId: res.data[0].id });
          }
        } else if (data.level == 3) {
          this.citys = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#detail {
  .topBar {
    height: 70px;
    line-height: 70px;
    border-radius: 5px;
    margin-bottom: 20px;
    margin-top: 5px;
    background: #fff;
    padding-left: 20px;
    font-size: 18px;
  }
  .main {
    width: 99%;
    height: 100%;
    border-radius: 5px;
    background: #fff;
    padding: 30px 0px 30px 20px;
    font-size: 18px;
    overflow: hidden;
    .left {
      float: left;
      width: 54%;
      height: 100%;
      font-size: 14px;
      .warning {
        margin: 0;
      }
      div {
        .alert {
          width: 260px;
          margin-left: 90px;
        }
      }
      .link {
        display: block;
      }
      .checkbox {
        margin-left: 80px;
      }
      .opinion {
        display: flex;
        .labelName {
          margin-top: 10px;
        }
      }
      div {
        display: inline-block;
        margin-top: 10px;
      }
      label {
        display: inline-block;
        width: 140px;
        text-align: right;
        margin-right: 10px;
        // color: gray;
        i {
          color: red;
        }
      }
    }
    .right {
      border-left: dashed 1px grey;
      float: left;
      width: 45%;
      height: 100%;
      .opinion {
        margin-bottom: 15px;
        margin-left: 60px;
        .labelName {
          color: #409eff;
          font-size: 15px;
          width: 90px;
        }
      }
    }
  }
  .bottom {
    text-align: center;
    background: #fff;
    height: 80px;
    // margin: 50px auto;
    .el-button + .el-button {
      margin-left: 60px;
    }
  }
}
</style>

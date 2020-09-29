<template>
  <div id="importExcel">
    <!-- <div class="in-file">
      <input type="file" @change="inFile($event)" multiple="multiple" accept=".xlsx, .xls" />
    </div>-->
    <!-- ElementUI上传 -->
    <el-upload
      :auto-upload="false"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-change="elInFile"
      :show-file-list="false"
      ref="upload"
      class="upload-demo"
      accept=".xlsx, .xls"
    >
      <el-button slot="trigger" size="mini" type="primary">导入书单</el-button>
      <!-- <i slot="tip" class="el-upload__tip el-icon-info">只能选取Excel</i> -->
    </el-upload>
  </div>
</template>
<script>
import XLSX from "xlsx"; // npm导入库，命令：npm i xlsx@^0.14.1 -s

export default {
  name: "importExcel",
  data() {
    return {
      // files: null //文件列表
      tableData:[]
    };
  },
  methods: {
    /**
     * input-file调用此函数时，默认传入"$event"
     * @param e {@link Object}：$event事件对象；
     */
    inFile(e) {
      this.files = (e.target || e.srcElement).files; //获取"input-file"的FileList对象
      if (!this.files || !this.files.length) return;
      for (let i = 0, len = this.files.length; i < len; i++)
        this.read(this.files[i]);
    },
    /**
     * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用。
     * @param f {@link Object}：当前上传的文件；
     * @param fs {@link Array}：当前文件列表；
     */
    elInFile(f, fs) {
      this.read(f.raw);
    },
    /**
     * 解析
     * @param f {@link File}
     */
    read(f) {
      let rd = new FileReader();
      rd.onload = e => {
        //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
        let sheets = rd.read2JS();
        for (let name in sheets)
        // console.log(name + " 工作表数据：", sheets[name]);
          this.$emit('func',sheets[name])
        //   ["formulae", "html", "txt", "csv", "dif", "slk", "eth"].forEach(
        //     item => {
        //       console.info("\r\n解析为：" + item);
        //       let sheets = rd.read2(item);
        //       for (let name in sheets)
        //         console.log(name + " 工作表数据：", sheets[name]);
        //         sheets[name]
        //     }
        // );
      };
      rd.readAsBinaryString(f);
    }
  },
  beforeCreate() {
    /**
     * 读取Excel文件，转为{@link Object}对象（自定义函数）
     * @return {@link Object}：workbook，整个文档对象；
     */
    FileReader.prototype.read2workbook = function() {
      let redABS = false; //是否将文件读取为二进制字符串
      let bytes = new Uint8Array(this.result); //无符号整型数组
      if (redABS) {
        // let fix = new TextDecoder(encode || 'UTF-8').decode(bytes);
        let fix = fixdata(bytes);
        let b2a = btoa(fix); //js原生方法：将字符转为base64编码。对应的atob(base64)方法，将base64转字符
        var wb = XLSX.read(b2a, {
          type: "base64"
        });
      } else {
        let len = bytes.byteLength;
        let binarys = new Array(len); //创建定长数组，存储文本
        for (let i = 0; i < len; i++)
          binarys[i] = String.fromCharCode(bytes[i]);
        let binary = binarys.join("");
        var wb = XLSX.read(binary, {
          type: "binary"
        });
      }
      return wb; //workbook
    };
    /**
     * 解析为...格式
     */
    FileReader.prototype.read2 = function(format = "json") {
      let wb = this.read2workbook();
      if (!wb) return null;

      let r = {};
      let formats = [
        "json",
        "formulae",
        "html",
        "txt",
        "csv",
        "dif",
        "slk",
        "eth"
      ]; //可被解析的格式
      format = formats.indexOf(format) == -1 ? "json" : format;
      wb.SheetNames.forEach(name => {
        //遍历每张纸数据
        r[name] = XLSX.utils["sheet_to_" + format](wb.Sheets[name]);
      });
      return r;
    };
    /**
     * 解析为JSON
     * @description: 此解析方式，XLSX将使用表格首行的每列名称，当作sheet数组对象的Key。
     * 故Excel每个工作表格的第一行必须有表头，且名称不可重复。
     */
    FileReader.prototype.read2JS = function() {
      return this.read2();
    };
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function(f) {
      if (!this.onload)
        //如果this未重写onload函数，则创建一个公共处理方式
        this.onload = e => {
          //在this.onload函数中，完成公共处理
          let rs = this.read2workbook();
        };
      this.readAsArrayBuffer(f); //内部会回调this.onload方法
    };

    /**
     * char值转String
     * @param data {@link Array}：char值；
     * @return {@link String}
     */
    // function fixdata(data) {
    //   let w = 1024 << 10; //每次读取1M字节
    //   let len = Math.floor(data.byteLength / w);
    //   let o = new Array(len);
    //   for (var i = 0; i < len; i++)
    //     o[i] = String.fromCharCode.apply(
    //       null,
    //       new Uint8Array(data.slice(i * w, (i + 1) * w))
    //     );
    //   o[i] = String.fromCharCode.apply(null, new Uint8Array(data.slice(i * w)));
    //   return o.join("");
    // }
  }
};
</script>
<style scoped>
.in-file,
.cont h2 {
  text-align: center;
}
</style>
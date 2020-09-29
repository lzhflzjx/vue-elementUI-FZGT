<template>
    <div id='price'>
        <div class="tex">
            <div>该列表仅展示第一优先价格数据</div>
            <span @click="getAllPrice">所有来源价格详情</span>
        </div>
        <el-row>
            <el-col class="tit" :span="6">来源：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.site.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">币制：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.currency.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">价格：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.price.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">出版社价格：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.publishersPrice.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">人民币参考价：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.rmbReferencePrice.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">系数：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.coefficientn.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">同业代号：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.sameIndustryCode.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">发货地：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.place.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">库存数：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.stockCount.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">是否可供可定：</el-col>
            <el-col :span="18">
                <el-select clearable size="mini" v-model="bookData.isAvailable.value">
                    <el-option v-for="(item,index) in options" :key="item.index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">ingram在订数量：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.ingramCount.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">折扣：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.discount.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">净价(特价1)：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.netPrice.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">净价(特价1)条件：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.netPriceTerm.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">优惠价格(特价2)：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.favorablePrice.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">优惠价格(特价2)条件：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.favorablePriceTerm.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">供应商参考号：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.supplierNo.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">是否POD：</el-col>
            <el-col :span="18">
                <el-select clearable size="mini" v-model="bookData.isPod.value">
                    <el-option v-for="(item,index) in options" :key="item.index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">是否限售：</el-col>
            <el-col :span="18">
                <el-select clearable size="mini" v-model="bookData.isSale.value">
                    <el-option v-for="(item,index) in options" :key="item.index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">发行状态：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.issueState.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">更新时间：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.update.value"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">是否可邮寄：</el-col>
            <el-col :span="18">
                <el-select clearable size="mini" v-model="bookData.isMail.value">
                    <el-option v-for="(item,index) in options" :key="item.index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="tit" :span="6">仅缺货指示器：</el-col>
            <el-col :span="18">
                <el-input size="mini" v-model="bookData.outIndicator.value"></el-input>
            </el-col>
        </el-row>
        <el-dialog title="所有价格" :visible.sync="priceDialog" width="1600px">
            <div v-loading='allLoading' class="allPrice">
                <div class="topBtn">
                    <el-button v-if="readOnlyMode" size="medium" type="primary" @click="edit">编辑</el-button>
                    <el-button v-else size="medium" type="primary" @click="save">保存</el-button>
                </div>
                <el-table ref="multipleTable" :data="dataList" stripe border size="small">
                    <el-table-column
                        v-for="item in attrsList"
                        :key="item.prop"
                        :width="item.width"
                        :label="item.label">
                        <template slot-scope="scope">
                            <span>
                                <div v-if="readOnlyMode">
                                    <div v-if="item.type=='select'">{{scope.row.hasOwnProperty(item.prop)?(scope.row[item.prop]?'是':'否'):''}}</div>
                                    <div v-if="item.type!='select'">{{scope.row[item.prop]}}</div>
                                </div>
                                <div v-else>
                                    <el-select clearable v-if="item.type=='select'" placeholder="" size="mini" v-model="scope.row[item.prop]">
                                        <el-option v-for="(item,index) in options" :key="item.index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <el-input v-if="item.type!='select'" size="mini" v-model="scope.row[item.prop]"></el-input>
                                </div>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
       return {
            attrsList:[
                {prop:"site",label:"来源",width:'100'},
                {prop:"currency",label:"币制"},
                {prop:"price",label:"价格"},
                {prop:"publishersPrice",label:"出版社价格"},
                {prop:"rmbReferencePrice",label:"人民币参考价"},
                {prop:"coefficientn",label:"系数"},
                {prop:"sameIndustryCode",label:"同业代号"},
                {prop:"place",label:"发货地"},
                {prop:"stockCount",label:"库存数"},
                {prop:"isAvailable",label:"是否可供可定",type:'select'},
                {prop:"ingramCount",label:"ingram在订数量"},
                {prop:"discount",label:"折扣"},
                {prop:"netPrice",label:"净价(特价1)"},
                {prop:"netPriceTerm",label:"净价(特价1)条件"},
                {prop:"favorablePrice",label:"优惠价格(特价2)"},
                {prop:"favorablePriceTerm",label:"优惠价格(特价2)条件"},
                {prop:"supplierNo",label:"供应商参考号"},
                {prop:"isPod",label:"是否POD",type:'select'},
                {prop:"isSale",label:"是否限售",type:'select'},
                {prop:"issueState",label:"发行状态",width:'100'},
                {prop:"update",label:"更新时间",width:'175'},
                {prop:"isMail",label:"是否可邮寄",type:'select'},
                {prop:"outIndicator",label:"仅缺货指示器"},
            ],
            dataList:[],
            priceDialog:false,
            readOnlyMode:false,
            options:[{label:'是',value:true},{label:'否',value:false}],
            allLoading:false
       }
    },
    props:['bookData'],
    methods: {
        save(){
            this.allLoading=true
            this.$post('/api/product/saveAllPriceInfo',this.dataList).then(res=>{
                this.allLoading=false
                if (res.success) {
                    this.priceDialog=false
                    this.$message.success(res.message)
                } else {
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.allLoading=false
            })
        },
        edit(){
            this.readOnlyMode=false
        },
        getAllPrice(){
            this.priceDialog=true
            this.readOnlyMode=true
            this.dataList=[]
            let form=new FormData();
            form.append('isbn',this.$route.query.isbn)
            this.allLoading=true
            this.$post('/api/product/getAllPriceInfo',form).then(res=>{
                this.allLoading=false
                if (res.data.result&&res.data.result.length>0) {
                    this.dataList=res.data.result
                }
            }).catch(err=>{
                this.allLoading=false
            })
        },
    }
}
</script>
<style lang='scss' scoped>
#price{
    font-size: 14px;
    .tex{
        display: flex;
        justify-content: space-between;
        span{
            color: #409eff;
            margin-right: 20px;
            cursor: pointer;
        }
    }
    .el-row{
        margin-top: 10px;
        .tit{
            text-align: right;
        }
    }
    .addBtn{
        text-align: right;
        margin-right: 5px;
        font-size: 20px;
        color: #409eff;
        cursor: pointer;
    }
}
.allPrice{
    padding-bottom:20px;
    .topBtn{
        text-align: right;
        margin-bottom: 10px;
    }
    /deep/ .el-input__inner{
        padding: 0 10px!important;
    }
}
</style>

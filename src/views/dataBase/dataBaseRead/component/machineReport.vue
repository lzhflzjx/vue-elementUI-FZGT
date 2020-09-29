<template>
    <div id='machineReport'>
        <el-card>
            <info ref="info"></info>
        </el-card>
        <div class="charts">
            <div class="sensitiveDiv">
                <div class="tit">敏感文章数量占比<i v-if="!noSensitiveData" @click="saveSensitive" class="el-icon-download"></i></div>
                <div class="noData" v-if="noSensitiveData">暂无数据</div>
                <div class="chart" v-loading='sensitiveLoading'></div>
            </div>
            <div class="wordDiv">
                <div class="tit">文章关键词命中数量统计<i v-if="!noWordData" @click="saveWord" class="el-icon-download"></i></div>
                <div class="noData" v-if="noWordData">暂无数据</div>
                <div class="chart" v-loading='wordLoading'></div>
            </div>
        </div>
    </div>
</template>

<script>
import info from './taskInfo'
require('echarts/theme/macarons')
export default {
    data(){
        return {
            loading:false,
            sensitiveChart:'',
            wordChart:'',
            sensitiveLoading:false,
            wordLoading:false,
            noSensitiveData:false,
            noWordData:false,
        }
    },
    components:{
       info 
    },
    methods: {
        saveSensitive(){
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = this.sensitiveChart.getDataURL()
            link.setAttribute('download','敏感文章数量占比'+new Date().getTime()+'.png')
            document.body.appendChild(link)
            link.click()
        },
        saveWord(){
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = this.wordChart.getDataURL()
            link.setAttribute('download','文章关键词命中数量统计'+new Date().getTime()+'.png')
            document.body.appendChild(link)
            link.click()
        },
        init(id){
            this.$nextTick(()=>{
                this.$refs.info.getDetail(id)
            })
            this.drawSensitiveChart(id);
            this.drawWordChart(id);
            this.sensitiveChart='';
            this.wordChart='';
        },
        drawSensitiveChart(id){
            this.noSensitiveData=false;
            this.sensitiveLoading=true;
            this.$get('/api/databaseCheck/queryPie',{taskId:id}).then(res=>{
                this.sensitiveLoading=false;
                if (res.data.result&&res.data.result.length>0) {
                    let pieData=[];
                    let nameList=[];
                    res.data.result.forEach(item=>{
                        pieData.push({name:item.sortName,value:item.count})
                        nameList.push(item.sortName)
                    })
                    let option = {
                        tooltip : {
                            trigger: 'item',
                            formatter: "{b} : {c} ({d}%)"
                        },
                        legend: {
                            bottom: 10,
                            left: 'center',
                            data:nameList
                        },
                        series : [
                            {
                                type: 'pie',
                                radius :'70%',
                                center: ['50%', '45%'],
                                selectedMode: 'single',
                                data:pieData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    var myChart = this.$echarts.init(document.querySelector('.sensitiveDiv .chart'));
                    myChart.setOption(option);
                    this.sensitiveChart=myChart;
                } else {
                    this.noSensitiveData=true;
                }
                
            }).catch(err=>{
                this.sensitiveLoading=false;
            })
        },
        drawWordChart(id){
            this.noWordData=false;
            this.wordLoading=true;
            this.$get('/api/databaseCheck/queryCol',{taskId:id}).then(res=>{
                this.wordLoading=false;
                if (res.data) {
                    let barData=[];
                    let nameList=[];
                    for (const k in res.data) {
                        barData.push(res.data[k])
                        nameList.push(k)
                    }
                    let option = {
                        color: ['#3398DB'],
                        grid: {
                            left: '3%',
                            right: '125px',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: nameList,
                                name: '单篇文章关键词数量',
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                name: '文章数量',
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '',
                                type: 'bar',
                                barWidth: '60%',
                                data: barData
                            }
                        ]
                    };
                    var myChart = this.$echarts.init(document.querySelector('.wordDiv .chart'));
                    myChart.setOption(option);
                    this.wordChart=myChart;
                }else{
                    this.noWordData=true;
                }
            }).catch(err=>{
                this.wordLoading=false;
            })
        },
    }
}
</script>
<style lang='scss' scoped>
#machineReport{
    .el-card{
        margin-bottom: 20px;
    }
    .charts{
        display:flex;
        justify-content: space-between;
        .sensitiveDiv,.wordDiv{
            width: 49%;
            .tit{
                background: #e1efff;
                padding: 10px;
                font-weight: bold;
                i{
                    float:right;
                    font-size: 20px;
                    color:#409eff;
                    cursor: pointer;
                }
            }
            .chart{
                height:400px;
            }
            .noData{
                color: #c3c3c3;
                text-align: center;
                margin-top: 100px;
            }
        }
    }
}
</style>

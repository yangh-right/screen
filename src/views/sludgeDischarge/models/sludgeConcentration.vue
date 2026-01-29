<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-04-11 11:48:34
 * @Description:
-->
<template>
  <unit-card cardTitle="污泥含固率" cardType="2" :showTime="false">
    <div class="pool-select" slot="headerRight">
      <radio-button class="btns" @change="lineChange" :options="poolList" v-model="line"></radio-button>
    </div>
    <div class="card-inner">
      <a-spin :spinning="spinning" style="height: 100%; width: 100%">
        <div class="chart">
          <line-chart :options="lineOption" ref="inChart" />
        </div>
      </a-spin>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import RadioButton from '../components/RadioButton.vue';
import { queryPointHistoryData } from '@/api/sludgeDischarge';
import * as echarts from 'echarts';
export default {
  name: 'controlTheory',

  components: {
    RadioButton,
    LineChart: () => import('@/components/chart/Chart.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pointsArr: [],
      lineOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(168, 191, 221, 0.2)',
              width: 'auto'
            }
          },
          borderColor: 'transparent',
          backgroundColor: 'rgba(1, 38, 73, 0.8)', // 背景色
          borderRadius: 4,
          textStyle: {
            color: '#FFF' // 字体颜色
          }
        },
        legend: {
          data: [],
          itemWidth: 16,
          itemHeight: 8,
          right: 0,
          textStyle: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 12
          }
        },
        grid: {
          left: '2%',
          right: '1%',
          top: '16%',
          bottom: '1%',
          height: '80%'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          splitLine: {
            show: false // 显示分割线
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            rotate: 40,
            fontSize: 14,
            margin: 24,
            align: 'center',
            color: '#BAC9E7'
          }
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true, //分割线
              lineStyle: {
                type: [5, 5],
                color: 'rgba(255,255,255,0.2)'
              }
            },
            axisLine: {
              show: false
            },
            name: '',

            nameTextStyle: {
              fontSize: 14,
              color: '#BAC9E7',
              padding: [0, 30, 0, 0]
            },
            axisLabel: {
              fontSize: 14,
              color: '#BAC9E7'
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            smooth: true,

            symbolSize: 0,

            data: [],
            itemStyle: {
              color: '#fff',
              borderColor: '#fff',
              borderWidth: 1,
              normal: {
                lineStyle: {
                  color: '#52c6fe',
                  width: 3 // 折线宽度
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: '#061f45'
                    },
                    {
                      offset: 1,
                      color: '#1d3968'
                    }
                  ])
                }
              }
            },
            markLine: {
              symbol: 'none',
              label: {
                show: true,
                position: 'insideEndTop',
                formatter: '{b}',
                fontSize: 12
              },
              lineStyle: {
                type: 'solid'
              },
              data: [
                {
                  yAxis: 15000,
                  name: '上限值',
                  lineStyle: {
                    color: '#FF8E80'
                  },
                  label: {
                    color: '#FF8E80'
                  }
                },
                {
                  yAxis: 8000,
                  name: '下限值',
                  lineStyle: {
                    color: '#FFCD49'
                  },
                  label: {
                    color: '#FFCD49'
                  }
                }
              ]
            }
          }
        ]
      },
      spinning: true,
      line: 'second_sink_pond_exit',
      poolList: [
        { value: 'second_sink_pond_exit', label: '二沉池出口' },
        { value: 'mud_storage_pond', label: '储泥池' }
      ]
    };
  },
  computed: {},
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.fetchData();
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async fetchData() {
      this.spinning = true;
      let params = {
        waterPlantId: this.waterPlantId,
        configCode: this.line,
        timePeriod: 'HOURS',
        startDateTime: moment().subtract(1, 'day').format('YYYY-MM-DD 08:00:00'),
        endDateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      let { resultData, status } = await queryPointHistoryData(params);
      setTimeout(() => {
        this.spinning = false;
      }, 500);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.pointsArr = resultData;
        this.handlePointChange(this.pointsArr[0]);
      } else {
        this.pointsArr = [];
        let startTime = moment().subtract(1, 'day').format('YYYY-MM-DD 08:00:00');
        let endTime = moment().format('YYYY-MM-DD HH:mm:ss');

        // 获取开始时间和结束时间之间的小时数组
        let hours = [];
        let current = moment(startTime);
        while (current <= moment(endTime)) {
          hours.push(current.format('HH:mm'));
          current.add(1, 'hours');
        }
        this.lineOption.xAxis.data = hours;
      }
    },
    handlePointChange(data) {
      if (!data) return;
      let xData = [];
      let seriesData = [];
      data.dataAndTimeList.forEach(item => {
        xData.push(item.date.slice(11, 16));
        seriesData.push(item.pv);
      });
      let minValue = Math.min(...seriesData);
      this.lineOption.yAxis[0].min = this.line === 'second_sink_pond_exit' ? ( minValue > 1.5 ? 1.5 : minValue) : minValue;
      this.lineOption.yAxis[0].name = '%'
      this.lineOption.xAxis.data = xData;
      this.lineOption.series[0].data = seriesData;
      this.lineOption.series[0].markLine.data[0].yAxis = this.line === 'second_sink_pond_exit' ? 12000 : 15000;
    },
    lineChange() {
      this.fetchData();
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 15px 0px;
  .btns {
    position: absolute;
    top: 1px;
    left: 1px;
  }
  .chart {
    height: 100%;
    width: 100%;
  }
}
/deep/ .ant-spin-container {
  height: 100%;
  width: 100%;
}
/deep/ .ant-spin-blur {
  opacity: 0;
}
</style>

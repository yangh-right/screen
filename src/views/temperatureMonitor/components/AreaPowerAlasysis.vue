<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-25 17:15:59
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="echart-block">
        <line-chart ref="alarmChart" :options="option"> </line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import * as echarts from 'echarts';
import { getEnergyPlaceAnalysis } from '@/api/energyAnalyse';
export default {
  name: 'AreaPowerAlasysis',
  components: {
    lineChart: () => import('@/components/chart/Chart.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    },
    parameter: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      option: {},
      noData: true,
      stationList: [
        {
          statName: '二沉池B',
          powerPv: null
        },
        {
          statName: '出水流量计井',
          powerPv: null
        },
        {
          statName: '加药间',
          powerPv: null
        }
      ]
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  methods: {
    async initData() {
      let params = {
        dateType: 'day',
        deviceIdList: [],
        ratioFlag: true,
        statType: 0,
        startDate: this.parameter.startTime,
        endDate: this.parameter.endTime,
        waterPlantIdList: [this.parameter.waterPlantId]
      };
      const { status, resultData } = await getEnergyPlaceAnalysis(params);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.noData = resultData.every(item => !item.powerPv);
        this.stationList = resultData;
      }
      this.initChart(this.stationList);
    },
    initChart(val) {
      var data1 = val.map(item => item.powerPv);
      let data = val.map(item => item.statName);
      var path = 'path://M1390,595h79l-39,22Z';
      let option = {
        grid: {
          left: 10,
          right: 10,
          top: '16%',
          bottom: '3%',
          height: '80%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          borderColor: 'transparent',
          backgroundColor: 'rgba(0, 16, 35, 0.7)',
          borderRadius: 4,
          textStyle: {
            color: '#A7BAD1',
            align: 'left',
            fontSize: 12
          },
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(168, 191, 221, 0.2)',
              width: 'auto'
            }
          }
        },
        legend: {
          right: 0,
          itemHeight: 2,
          itemWidth: 18,
          data: ['耗电间'],
          itemStyle: {
            color: '#2CF8FF'
          },
          textStyle: {
            color: 'rgba(217,247,255, 1)',
            fontSize: 12
          }
        },
        graphic: [
          {
            type: 'text',
            top: '4%',
            left: '2%',
            style: {
              text: '( kwh )',
              fontSize: 12,
              fill: '#D9F7FF'
            }
          }
        ],
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },

          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          lineStyle: {
            color: 'rgba(108, 128, 151, 1)'
          },
          data: data
        },
        yAxis: {
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          nameTextStyle: {
            align: 'right',
            color: 'transparent',
            padding: [0, 0, 0, 8]
          },
          axisLabel: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          min: 0,
          max: this.noData ? 5 : null,
          type: 'value',
          name: '( kwh )',
          nameLocation: 'end'
        },
        series: [
          {
            name: '耗电间',
            type: 'bar',
            barWidth: 18,
            barGap: '-100%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color: '#16AEBF'
                },
                {
                  offset: 0.5,
                  color: '#09768B'
                },
                {
                  offset: 0.5,
                  color: '#38C2CE'
                },
                {
                  offset: 1,
                  color: '#1A8EA0'
                }
              ])
            },
            tooltip: {
              show: false
            },
            data: data1
          },
          {
            name: '耗电间',
            type: 'pictorialBar',
            symbol: path,
            symbolSize: [18, 6],
            symbolOffset: [0, 0],
            z: 12,
            itemStyle: {
              opacity: 1,
              color: '#2CF8FF'
            },
            symbolPosition: 'end',
            data: data1
          }
        ]
      };
      this.option = option;
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  // height: calc(100% - 34px);
  height: 100%;
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .echart-block {
    width: 100%;
    height: 100%;
    text-align: center;
  }
}
</style>

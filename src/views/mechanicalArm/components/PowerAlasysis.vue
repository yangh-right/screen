<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-12 15:43:01
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="echart-block">
        <line-chart ref="powerChart" :options="option"> </line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import * as echarts from 'echarts';
import { getEnergyData } from '@/api/energyAnalyse';

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
      option: {}
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
        statType: 0,
        deviceIdList: [],
        waterPlantIdList: [this.parameter.waterPlantId],
        startDate: this.parameter.startTime,
        endDate: this.parameter.endTime
      };
      const { status, resultData } = await getEnergyData(params);
      if (status === 'complete') {
        let dataTime = [],
          energyList = [],
          powerPvList = [];
        resultData.forEach(item => {
          dataTime.push(item.date.slice(-2));
          powerPvList.push(item.powerPv);
          energyList.push(item.energy);
        });
        this.initChart(powerPvList, energyList, dataTime);
      }
    },
    initChart(powerPvList, energyList, dataTime) {
      let option = {
        textStyle: {
          color: 'rgba(108, 128, 151, 1)',
          fontSize: 12
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
        legend: [
          {
            right: 100,
            itemWidth: 18,
            data: ['全厂电量'],
            textStyle: {
              color: 'rgba(217,247,255, 1)',
              fontSize: 12
            }
          },
          {
            right: 0,
            itemHeight: 2,
            itemWidth: 18,
            data: ['千吨耗电量'],
            itemStyle: {
              color: '#3CFFA5'
            },
            textStyle: {
              color: 'rgba(217,247,255, 1)',
              fontSize: 12
            }
          }
        ],
        animationEasing: 'backIn',
        animationDuration: 2000,
        grid: {
          left: 10,
          right: 10,
          top: '16%',
          bottom: '3%',
          height: '80%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
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
          data: dataTime
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
            color: '#D9F7FF',
            padding: [0, 8, 0, 0]
          },
          axisLabel: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          type: 'value',
          name: '( kwh )',
          nameLocation: 'end'
        },
        series: [
          {
            type: 'bar',
            name: '全厂电量',
            barWidth: 8,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#E2F1FF' },
                  { offset: 0.7, color: '#98F6FF' },
                  { offset: 1, color: 'rgba(31,158,173,0)' }
                ])
              }
            },
            data: powerPvList
          },
          {
            name: '千吨耗电量',
            type: 'line',
            lineStyle: {
              color: '#FFCA79'
            },
            symbol: 'none',
            data: energyList
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

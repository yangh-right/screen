<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-11-06 18:11:03
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
import { carbonSourceAddedList } from '@/api/energyAnalyse.js';

export default {
  name: 'carbonDosage',
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
        dateType: 'month',
        waterPlantId: this.parameter.waterPlantId,
        startDate: this.parameter.startTime,
        endDate: this.parameter.endTime
      };
      const { status, resultData } = await carbonSourceAddedList(params);
      if (status === 'complete') {
        const data = resultData?.[0]?.medicateEntryTimeDataList || [];
        this.initChart(data);
      }
    },
    initChart(val) {
      let xAxisData = val.map(item => item.dateTime);
      let seriesData = val.map(item => item.realPv);
      let option = {
        grid: {
          left: 10,
          right: 10,
          top: '16%',
          bottom: '3%',
          height: '80%'
        },
        color: ['#BD5DFF', '#36D2FF'],
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
          },
          formatter: function (param) {
            let value = param[0].value ? param[0].value : '--';
            var resultTooltip =
              '<div >' +
              '<div >' +
              param[0].name +
              '</div>' +
              "<div style='padding-top:5px;'>" +
              "<span style='display:inline-block;width:20px;height:3px;background-color:#BD5DFF;'></span>" +
              "<span style=''> " +
              param[0].seriesName +
              ': </span>' +
              "<span style=''>" +
              value +
              '</span>' +
              '</div>' +
              '<div >' +
              '</div>' +
              '</div>';
            return resultTooltip;
          }
        },
        legend: {
          right: 0,
          itemHeight: 2,
          itemWidth: 18,
          data: ['实际投加'],
          textStyle: {
            color: 'rgba(217,247,255, 1)',
            fontSize: 12
          }
        },
        xAxis: [
          {
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
            boundaryGap: false,
            data: xAxisData
          }
        ],
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
          name: 'L/d',
          nameLocation: 'end'
        },
        series: [
          {
            name: '实际投加',
            type: 'line',
            z: 3,
            showSymbol: false,
            smoothMonotone: 'x',
            areaStyle: {
              color: {
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(189,93,255,0.5)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(189,93,255,0.1)'
                  }
                ],
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: 'linear',
                global: false
              }
            },
            smooth: true,
            data: seriesData
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

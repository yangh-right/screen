<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-02 16:10:32
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="echart-block">
        <line-chart ref="alarmChart" :options="option"> </line-chart>
      </div>
    </div>
  </div>
</template>

<script>
import { getEnergyData } from '@/api/energyAnalyse.js';

export default {
  name: 'DevicePowerAlasysis',
  components: {
    lineChart: () => import('@/components/chart/Chart.vue')
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
        waterPlantId: this.parameter.waterPlantId,
        startDate: this.parameter.startTime,
        endDate: this.parameter.endTime
      };
      const { status, resultData } = await getEnergyData(params);
      if (status === 'complete') {
        this.initChart(resultData);
      }
    },
    initChart(val) {
      let xAxisData = val.map(item => item.date.slice(-2));
      let seriesData = val.map(item => item.flowPv);
      let option = {
        grid: {
          left: 10,
          right: 10,
          top: '16%',
          bottom: '3%',
          height: '80%'
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
          },
          formatter: function (param) {
            let value = param[0].value ? param[0].value : '--';
            var resultTooltip =
              '<div >' +
              '<div >' +
              param[0].name +
              '</div>' +
              "<div style='padding-top:5px;'>" +
              "<span style='display:inline-block;width:14px;height:4px;background-color:#36d1fe;'></span>" +
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
          itemHeight: 4,
          itemWidth: 12,
          data: ['污水处理量'],
          itemStyle: {
            color: '#36d1fe'
          },
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
          name: '吨',
          nameLocation: 'end'
        },
        series: [
          {
            name: '污水处理量',
            type: 'line',
            z: 3,
            showSymbol: false,
            smoothMonotone: 'x',
            lineStyle: {
              width: 3,
              color: '#36d1fe'
            },
            areaStyle: {
              normal: {
                color: '#1c599e'
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
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    padding: 0 12px;
    .echart-block {
      width: 100%;
      height: 100%;
      margin-top: 6px;
    }
  }
}
</style>

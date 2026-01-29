<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-02 16:10:57
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="card-inner">
      <div class="echart-block">
        <line-chart ref="powerChart" :options="option"> </line-chart>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import * as echarts from 'echarts';
import { overviewOfCarbonEmissions } from '@/api/energyAnalyse.js';
export default {
  name: 'AreaPowerAlasysis',
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
  computed: {},
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
        queryType: 'month',
        waterPlantId: this.parameter.waterPlantId,
        startTime: this.parameter.startTime + ' 00:00:00',
        endTime: this.parameter.endTime + ' 23:59:59'
      };
      const { status, resultData } = await overviewOfCarbonEmissions(params);
      if (status === 'complete') {
        let entryNumList = [],
          targetValueList = [],
          xDataList = [];
        resultData.forEach(item => {
          if (item.name === '排放总量') {
            entryNumList = item.timeDataVOList.map(it => (it.pv / 1000).toFixed(2));
            xDataList = item.timeDataVOList.map(it => moment(it.date).format('MM/DD'));
          }
          if (item.name === '碳减排量') {
            targetValueList = item.timeDataVOList.map(it => (it.pv / 1000).toFixed(2));
          }
        });
        // let entryNumList = resultData.entryNum.map(item => (item / 1000).toFixed(2));
        // let targetValueList = resultData.targetValue.map(item => (item / 1000).toFixed(2));
        // let xDataList = resultData.xData.map(item => moment(item).format('MM/DD'));
        this.initChart(entryNumList, targetValueList, xDataList);
      }
    },
    initChart(entryNum, targetValue, xData) {
      let option = {
        color: ['rgba(161, 242, 250, 1)', '#98F6FF'],
        textStyle: {
          color: 'rgba(108, 128, 151, 1)',
          fontSize: 12
        },
        tooltip: {
          trigger: 'axis',
          show: true,
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
          },
          formatter: function (params) {
            var str = '<div style="display: flex;flex-direction: column;">';
            params.forEach((item, index) => {
              let unit = 'm³';
              let name = item.seriesName;
              let value = item.value ? item.value : '--';
              let color = item.seriesName === '碳减排量' ? 'rgba(161, 242, 250, 1)' : '#98F6FF';
              str +=
                `<div style="display: flex;width:180px;  align-items: center;"><span style="display:inline-block;  margin-right: 6px;border-radius:2px;width:10px;height:10px;background-color:${color};"></span>` +
                ' ' +
                name +
                '：' +
                value +
                unit +
                '</div>';
            });
            return str + '</div>';
          }
        },
        legend: {
          left: 'center',
          data: ['排放总量', '碳减排量'],
          itemGap: 40,
          itemWidth: 18,
          itemHeight: 10,
          textStyle: {
            color: 'rgba(217,247,255, 1)',
            fontSize: 12
          }
        },
        animationEasing: 'backIn',
        animationDuration: 2000,
        grid: {
          left: 5,
          right: 5,
          top: '18%',
          bottom: '0%'
        },
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
          data: xData
        },
        yAxis: [
          {
            name: 'm³',
            splitNumber: 4,
            splitLine: {
              show: false,
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
            nameLocation: 'end'
          },
          {
            name: '吨',
            position: 'right',
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLabel: {
              color: '#D9F7FF',
              fontWeight: 400,
              fontSize: 14
            },
            type: 'value',
            nameLocation: 'end',
            nameTextStyle: {
              align: 'right',
              color: '#D9F7FF'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '排放总量',
            barWidth: 8,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#E2F1FF' },
                  { offset: 0.2, color: '#98F6FF' },
                  { offset: 1, color: 'rgba(31,158,173,0)' }
                ])
              }
            },
            data: entryNum
          },
          {
            name: '碳减排量',
            type: 'line',
            z: 3,
            showSymbol: false,
            smoothMonotone: 'x',
            yAxisIndex: 1,
            lineStyle: {
              width: 3,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#FFC400' // 0% 处的颜色
                  },
                  {
                    offset: 0.8,
                    color: '#00FFD5' // 100% 处的颜色
                  }
                ]
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(161, 242, 250, .6)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,255,213,0)' // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            smooth: true,
            data: targetValue
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
  .card-inner {
    width: 100%;
    height: calc(100% - 60px);
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
}
</style>

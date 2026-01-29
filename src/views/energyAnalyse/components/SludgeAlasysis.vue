<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-27 13:16:41
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
import { getChemicalSludgeRate } from '@/api/energyAnalyse.js';
export default {
  name: 'SludgeAlasysis',
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
      noData: true,
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
        type: '1',
        waterPlantId: this.parameter.waterPlantId,
        date: this.parameter.startTime
      };
      const { status, resultData } = await getChemicalSludgeRate(params);
      if (status === 'complete') {
        this.noData = resultData?.timeDataList.every(item => !item.sludgePv && !item.historyPointValue);
        this.initChart(resultData.timeDataList);
      }
    },
    initChart(val) {
      let xDataList = val.map(item => item.dateTimeStr);
      let entryNum = val.map(item => item.sludgePv);
      let targetValue = val.map(item => item.historyPointValue);
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
            let value1 = param[1].value ? param[1].value : '--';
            var resultTooltip =
              '<div >' +
              '<div >' +
              param[0].name +
              '</div>' +
              "<div style='padding-top:5px;'>" +
              "<span style='display:inline-block;width:20px;height:6px;background-color:#00E0FF;'></span>" +
              "<span style=''> " +
              param[0].seriesName +
              ': </span>' +
              "<span style=''>" +
              value +
              '</span>' +
              '</div>' +
              '<div >' +
              '</div>' +
              "<div style='padding-top:5px;'>" +
              "<span style='display:inline-block;width:20px;height:3px;background-color:#3CFFA5;'></span>" +
              "<span style=''> " +
              param[1].seriesName +
              ': </span>' +
              "<span style=''>" +
              value1 +
              '</span>' +
              '</div>' +
              '</div>';
            return resultTooltip;
          }
        },
        legend: [
          {
            right: '22%',
            itemHeight: 2,
            itemWidth: 18,
            data: ['累计产量'],
            itemStyle: {
              color: '#00E0FF'
            },
            textStyle: {
              color: 'rgba(217,247,255, 1)',
              fontSize: 12
            }
          },
          {
            right: 0,
            itemHeight: 2,
            itemWidth: 18,
            data: ['污泥产率'],
            itemStyle: {
              color: '#3CFFA5'
            },
            textStyle: {
              color: 'rgba(217,247,255, 1)',
              fontSize: 12
            }
          }
        ],
        graphic: [
          {
            type: 'text',
            top: '4%',
            left: '0%',
            style: {
              text: '吨',
              fontSize: 12,
              fill: '#D9F7FF'
            }
          }
        ],
        xAxis: {
          data: xDataList,
          axisLine: {
            lineStyle: {
              color: 'transparent' //底部边框颜色
            }
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            textStyle: {
              color: '#fff', //底部文字颜色
              fontSize: 12
            }
          }
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
            padding: [0, 8, 0, 0]
          },
          axisLabel: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          min: 0,
          max: this.noData ? 5 : null,
          type: 'value',
          name: '吨',
          nameLocation: 'end'
        },
        series: [
          {
            name: '累计产量',
            type: 'bar',
            padding: 10,
            xAxisIndex: 0,
            label: {
              show: false,
              position: 'right',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
            itemStyle: {
              color: 'transparent'
            },
            barWidth: 18,
            data: entryNum,
            z: 0
          },
          {
            name: '累计产量',
            type: 'pictorialBar',
            symbolRotate: '-75',
            itemStyle: {
              normal: {
                color: '#02ABF4'
              }
            },
            symbolRepeat: 'fixed',
            symbolMargin: -3,
            symbol: 'rect',
            symbolClip: true,
            symbolSize: [4, 16],
            symbolPosition: 'start',
            symbolOffset: [0, 0],
            data: entryNum,
            z: 66,
            tooltip: {
              show: false
            },
            animationEasing: 'elasticOut'
          },
          {
            name: '累计产量',
            type: 'bar',
            barWidth: 18,
            barGap: '-100%',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(65,93,127,0.32)'
            },
            data: entryNum,
            itemStyle: {
              opacity: 0
            },
            tooltip: {
              show: false
            },
            z: -1
          },
          {
            // 分隔
            name: '累计产量',
            type: 'pictorialBar',
            itemStyle: {
              normal: {
                color: '#00E0FF'
              }
            },
            symbolRotate: '90',
            symbolRepeat: false,
            symbolMargin: -3,
            symbol: 'rect',
            symbolClip: true,
            symbolSize: [6, 16],
            symbolPosition: 'end',
            symbolOffset: [0, -6],
            data: entryNum,
            z: 66,
            tooltip: {
              show: false
            },
            animationEasing: 'elasticOut'
          },
          {
            name: '污泥产率',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                color: '#3CFFA5'
              }
            },
            label: {
              show: false,
              position: 'top',
              textStyle: {
                color: '#3CFFA5'
              }
            },
            itemStyle: {
              color: '#FFF',
              borderColor: '#3CFFA5',
              borderWidth: 2
            },
            tooltip: {
              show: true
            },
            data: targetValue,
            z: 99
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

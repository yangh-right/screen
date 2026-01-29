<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:45:11
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="true">
    <div class="card-inner">
      <div class="echart-block">
        <line-chart ref="alarmChart" :options="option"> </line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';
export default {
  name: 'SludgeAlasysis',
  components: {
    lineChart: () => import('@/components/chart/Chart.vue'),
    UnitCard
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      option: {}
    };
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      let option = {
        grid: {
          left: 10,
          right: 10,
          top: '16%',
          bottom: '3%',
          height: '80%'
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
              color: '#2CF8FF',
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
              color: '#2CF8FF',
              fontSize: 12
            }
          }
        ],
        xAxis: {
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.2)', //网格线的颜色
                width: 1,
                type: 'solid'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'transparent' //左边框颜色
              }
            },
            axisLabel: {
              show: true,
              fontSize: 12,
              textStyle: {
                color: '#ADD6FF' //左文字颜色
              }
            }
          }
        ],
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
            data: [20, 80, 100, 40, 34, 90, 60, 20, 80, 100, 40, 34],
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
            data: [20, 80, 100, 40, 34, 90, 60, 20, 80, 100, 40, 34],
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
            data: [20, 80, 100, 40, 34, 90, 60, 20, 80, 100, 40, 34],
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
            data: [20, 80, 100, 40, 34, 90, 60, 20, 80, 100, 40, 34],
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
            data: [55, 35, 62, 55, 97, 64, 44, 66],
            z: 99
          }
        ]
      };

      this.option = option;
    }
  },
  created() {},
  mounted() {
    this.initData();
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 34px);
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

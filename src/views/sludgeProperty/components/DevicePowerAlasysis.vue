<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-12-04 18:43:20
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
import * as echarts from 'echarts';
import UnitCard from './UnitCard';
export default {
  name: 'DevicePowerAlasysis',
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
        legend: {
          right: 0,
          itemHeight: 2,
          itemWidth: 18,
          data: ['关键设备'],
          itemStyle: {
            color: '#8EACFE'
          },
          textStyle: {
            color: '#D9F7FF',
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
            data: ['提升泵', '暖气设备', '排泥泵', '其他']
          }
        ],
        yAxis: {
          splitNumber: 4,
          splitLine: {
            lineStyle: {
              color: 'rgba(57, 68, 81, 1)',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          type: 'value',
          name: 'kwh',
          nameLocation: 'end',
          nameTextStyle: {
            align: 'right',
            padding: [0, 8, 0, 0]
          }
        },
        series: [
          {
            name: '关键设备',
            type: 'line',
            z: 3,
            showSymbol: false,
            smoothMonotone: 'x',
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
                    offset: 1,
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
                      color: 'rgba(255,196,0,0.7)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,255,213,0.1)' // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            smooth: true,
            data: [20, 56, 17, 40]
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

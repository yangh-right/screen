<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-24 15:42:48
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="true">
    <div class="card-inner">
      <div class="echart-block">
        <line-chart ref="powerChart" :options="option"> </line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import * as echarts from 'echarts';
import UnitCard from './UnitCard';
export default {
  name: 'AreaPowerAlasysis',
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
        legend: {
          right: 0,
          itemWidth: 18,
          data: ['累计电耗', '计划电耗', '吨水耗电量'],
          textStyle: {
            color: 'rgba(217,247,255, 1)',
            fontSize: 12
          }
        },
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
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        },
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
          name: '( L )',
          nameLocation: 'end',
          nameTextStyle: {
            align: 'right',
            padding: [0, 8, 0, 0]
          }
        },
        series: [
          {
            type: 'bar',
            name: '累计电耗',
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
            data: [270, 240, 280, 230, 150, 230, 162, 289, 240]
          },
          {
            type: 'bar',
            name: '计划电耗',
            barWidth: 8,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#E2F1FF' },
                  { offset: 0.7, color: '#7CA9FF' },
                  { offset: 1, color: 'rgba(31,158,173,0)' }
                ])
              }
            },
            data: [180, 140, 165, 132, 96, 140, 98, 162, 140]
          },
          {
            name: '吨水耗电量',
            type: 'line',
            lineStyle: {
              color: '#FFCA79'
            },
            symbol: 'none',
            data: [300, 180, 250, 176, 172, 190, 320, 310, 330]
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

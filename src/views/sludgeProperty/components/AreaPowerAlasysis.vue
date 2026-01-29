<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 18:08:54
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
      var data1 = [50, 60, 70, 40, 70];
      var path = 'path://M1390,595h79l-39,22Z';
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
          data: ['耗电间'],
          itemStyle: {
            color: '#2CF8FF'
          },
          textStyle: {
            color: '#D9F7FF',
            fontSize: 12
          }
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
            fontSize: 12
          },
          lineStyle: {
            color: 'rgba(108, 128, 151, 1)'
          },
          data: ['进水区', '生物处理', '出水区', '加药间', '鼓风机房']
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
          name: '( T )',
          nameLocation: 'end',
          nameTextStyle: {
            align: 'right',
            padding: [0, 8, 0, 0]
          }
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
          },
          {
            name: '',
            type: 'pictorialBar',
            itemStyle: {
              normal: {
                opacity: 0.6,
                color: '#6494db'
              }
            },
            symbolSize: ['50%', '100%'],
            symbolRepeat: false,
            symbolMargin: 2,
            tooltip: {
              show: false
            },
            symbol: `image://data:image/png;base64,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`,
            data: [80, 80, 80, 80, 80]
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

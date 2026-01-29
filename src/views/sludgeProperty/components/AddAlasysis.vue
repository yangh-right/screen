<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-24 14:05:35
 * @Description:
-->
<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="echart-block">
        <line-chart ref="alarmChart" :options="option"> </line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import UnitCard from './UnitCard';
import { newTicketLineChart } from '@/api/sludgeProperty.js';

export default {
  name: 'AddAlasysis',
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
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let data = {
        dateType: 'day',
        dateRangeType: 'dayRange',
        dateUnit: 'M',
        startTime: moment().subtract(6, 'days').format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        SysCode: 'water_purification'
      };
      const { status, resultData } = await newTicketLineChart(data);
      let option = {
        legend: [
          {
            right: '22%',
            itemHeight: 8,
            itemWidth: 8,
            data: ['新增工单'],
            itemStyle: {
              color: '#56A4FF'
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
            data: ['办结率'],
            itemStyle: {
              color: '#00EBFF'
            },
            textStyle: {
              color: 'rgba(217,247,255, 1)',
              fontSize: 12
            }
          }
        ],
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
          nameTextStyle: {
            color: '#D9F7FF'
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          axisTick: {
            lineStyle: {
              color: '#384267'
            },
            show: true
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#384267',
              width: 1,
              type: 'dashed'
            },
            show: true
          },
          data: []
        },
        yAxis: [
          {
            nameTextStyle: {
              color: '#D9F7FF'
            },
            axisLabel: {
              color: '#D9F7FF',
              fontWeight: 400,
              fontSize: 14
            },
            axisTick: {
              lineStyle: {
                color: '#384267',
                width: 1
              },
              show: true
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#384267',
                width: 1,
                type: 'dashed'
              },
              show: true
            },
            name: ''
          },
          {
            nameTextStyle: {
              color: '#D9F7FF'
            },
            axisLabel: {
              color: '#D9F7FF',
              fontWeight: 400,
              fontSize: 14
            },
            axisTick: {
              lineStyle: {
                color: '#384267',
                width: 1
              },
              show: true
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#384267',
                width: 1,
                type: 'dashed'
              },
              show: true
            },
            name: ''
          }
        ],
        series: [
          {
            name: '新增工单',
            data: [],
            type: 'bar',
            barMaxWidth: 'auto',
            barWidth: 18,
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                type: 'linear',
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: '#56A4FF'
                  },
                  {
                    offset: 0.5,
                    color: '#073785'
                  },
                  {
                    offset: 0.5,
                    color: '#56A4FF'
                  },
                  {
                    offset: 1,
                    color: '#0C315F'
                  }
                ]
              }
            },
            label: {
              show: false,
              position: 'top',
              color: '#fff'
            }
          },
          {
            name: '新增工单',
            data: [1, 1, 1, 1, 1, 1, 1],
            itemStyle: {
              color: '#98BFFF'
            },
            type: 'pictorialBar',
            barMaxWidth: '20',
            symbol: 'diamond',
            symbolOffset: [0, '50%'],
            symbolSize: [18, 9]
          },
          {
            name: '新增工单',
            data: [],
            itemStyle: {
              color: '#98BFFF'
            },
            type: 'pictorialBar',
            barMaxWidth: '20',
            symbolPosition: 'end',
            symbol: 'diamond',
            symbolOffset: [0, '-50%'],
            symbolSize: [18, 9],
            zlevel: 2
          },
          {
            name: '新增工单',
            data: [],
            itemStyle: {
              color: 'rgba(89,101,121,0.2)'
            },
            type: 'bar',
            barMaxWidth: 'auto',
            barWidth: 18,
            barGap: '-100%',
            zlevel: -1
          },
          {
            name: '新增工单',
            data: [1, 1, 1, 1, 1, 1, 1],
            itemStyle: {
              color: 'rgba(89,101,121,0.6)'
            },
            type: 'pictorialBar',
            barMaxWidth: '20',
            symbol: 'diamond',
            symbolOffset: [0, '50%'],
            symbolSize: [18, 9],
            zlevel: -2
          },
          {
            name: '新增工单',
            data: [],
            itemStyle: {
              color: 'rgba(89,101,121,0.8)'
            },
            type: 'pictorialBar',
            barMaxWidth: '20',
            symbolPosition: 'end',
            symbol: 'diamond',
            symbolOffset: [0, '-50%'],
            symbolSize: [18, 9],
            zlevel: -1
          },
          {
            name: '办结率',
            type: 'line',
            yAxisIndex: 1,
            showAllSymbol: true,
            symbol:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAX1JREFUKFOVkb1rU2EUxn/PTZqWfgm2hQ469NqCk6OrBnQpKU4t/gWODooOpdqgDlpw6Ox/UMHlJmJLIUM3wUXoVHIzVAQrilZtPszNI281xUnwjO85z3N+532UNHxZsAQMAl9HYLk4o5ZtSXK14Zs2s5gjYFtJ6oeC6xLPbXw0wKOls2qW7ags9aqpV2zOIC4BO6qmfmoYK8W6Uas5Xyyqy1/Vf6ukfgDMKKn7FjC+cE7lWsNDjJA//IyCZjzDzQI/5+fUrqS+B0wfN/rrX+37dLfLa8wpIAIOsg4Xr53Xt2D2MY+OBf0Dk/eeVIt6MP9D9SnKiOfndNif+S9BMNHGrgujBRQ4X7zzRKHDWzhB+pB1uBCQTjYkqdcErVKs+4GzOcRY7sfvozvD9EbbfA+5JA3fjYxDDs8EX0qx7vzrW5PU6xIDQbAuuIrZNBy8iXmyCiFmv9zzYC/HbUQesyjYUqXuKxYLwDAmLcU8DsMBKQiyHGsSU/RoRzk2fgEx/M4lbf6H2AAAAABJRU5ErkJggg==',
            symbolSize: 12,
            lineStyle: {
              normal: {
                color: '#00EBFF'
              }
            },
            label: {
              show: false,
              position: 'top',
              textStyle: {
                color: '#00EBFF'
              }
            },
            itemStyle: {
              color: '#FFF',
              borderColor: '#00EBFF',
              borderWidth: 2
            },
            tooltip: {
              show: true
            },
            data: []
          }
        ],
        tooltip: {
          trigger: 'axis',
          show: false
        }
      };
      if (status === 'complete') {
        option.xAxis.data = resultData.xAxis;
        resultData.handleData?.forEach(item => {
          if (item.dataTag === 'newTikcet') {
            option.series[0].data = option.series[2].data = item.yAxis;
            let dataMax = Math.max(...item.yAxis) + 1;
            option.series[3].data = option.series[5].data = [...Array(item.yAxis.length).fill(dataMax)];
          }
          if (item.dataTag === 'finishTikcetRate') option.series[6].data = item.yAxis;
        });
      }
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

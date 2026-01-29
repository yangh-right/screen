<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-26 11:08:01
 * @Description: 稳定出水监控组件
-->
<template>
  <unit-card cardTitle="排泥量" :showTime="false">
    <div class="card-inner">
      <div class="box">
        <line-chart id="inChart" :options="lineOption" ref="inChart" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import * as eCharts from 'echarts';
import { sludgeDischarge, queryPointHistoryData } from '@/api/sludgeDischarge';
export default {
  name: 'ControlPrecision',
  components: {
    LineChart: () => import('@/components/chart/Chart.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
  },

  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      lineOption: {
        tooltip: {
          trigger: 'axis',
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
          }
        },
        legend: {
          show: true,
          data: [],
          itemWidth: 16,
          itemHeight: 8,
          right: 0,
          textStyle: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 12
          }
        },
        grid: {
          left: '10px',
          right: '10px',
          top: '14%',
          bottom: '0px',
          height: '93%'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          splitLine: {
            show: false // 显示分割线
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            rotate: 40,
            fontSize: 14,
            align: 'center',
            margin: 24,
            color: '#BAC9E7'
          }
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true, //分割线
              lineStyle: {
                type: [5, 5],
                color: 'rgba(255,255,255,0.2)'
              }
            },
            axisLine: {
              show: false
            },
            name: '吨',
            nameTextStyle: {
              fontSize: 14,
              color: '#BAC9E7',
              padding: [0, 30, 0, 0]
            },
            axisLabel: {
              fontSize: 14,
              color: '#BAC9E7'
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            smooth: false,
            itemStyle: {
              color: new eCharts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: '#8eb4ff00'
                },
                {
                  offset: 0.6,
                  color: '#4971b6'
                },
                {
                  offset: 1,
                  color: '#62A2FF'
                }
              ])
            },
            data: []
          },
          {
            name: '',
            type: 'bar',
            smooth: false,
            itemStyle: {
              color: new eCharts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: '#68e6ff00'
                },
                {
                  offset: 1,
                  color: '#A2F5FF'
                }
              ])
            },
            data: []
          },
          {
            name: '',
            type: 'bar',

            smooth: false,
            itemStyle: {
              color: new eCharts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: '#54ff5800'
                },
                {
                  offset: 1,
                  color: '#8CFF91'
                }
              ])
            },
            data: []
          }
        ]
      }
    };
  },

  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.fetchData();
        }
      },
      immediate: true
    }
  },

  methods: {
    async fetchData() {
      let params = {
        waterPlantId: this.waterPlantId,
        configCode: 'sludge_discharge',
        timePeriod: 'HOURS',
        startDateTime: moment().subtract(1, 'day').format('YYYY-MM-DD 08:00:00'),
        endDateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      let { resultData, status } = await queryPointHistoryData(params);

      if (status === 'complete') {
        this.handlePointChange(resultData);
      } else {
        let startTime = moment().subtract(1, 'day').format('YYYY-MM-DD 08:00:00');
        let endTime = moment().format('YYYY-MM-DD HH:mm:ss');

        // 获取开始时间和结束时间之间的小时数组
        let hours = [];
        let current = moment(startTime);
        while (current <= moment(endTime)) {
          hours.push(current.format('HH:mm'));
          current.add(1, 'hours');
        }
        this.lineOption.xAxis.data = hours;
      }
    },
    handlePointChange(data) {
      if (!data) return;
      let legendData = [];
      data.map((item, index) => {
        legendData.push(item.pointMemo);
        let xData = [];
        let seriesData = [];
        item.dataAndTimeList.forEach(v => {
          xData.push(v.date.slice(11, 16));
          seriesData.push(v.pv);
        });
        this.lineOption.yAxis[0].name = data[0].unit;
        this.lineOption.xAxis.data = xData;
        this.lineOption.series[index].data = seriesData;
        this.lineOption.series[index].name = data[index].pointMemo;
      });
      this.lineOption.legend.data = legendData;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .card-title {
  .title {
    .text {
      font-size: 20px !important;
    }
  }
}
.card-inner {
  width: 100%;
  height: 100%;
  padding: 17px 12px 0;

  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>

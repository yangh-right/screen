<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-04-11 08:42:32
 * @Description: 稳定出水监控组件
-->
<template>
  <unit-card cardTitle="千吨水药耗" cardType="2" :showTime="false">
    <div class="card-inner">
      <div class="box">
        <line-chart :options="thirdOption"></line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import * as echarts from 'echarts';
import { getCarbonSourceDosingEnergyData } from '@/api/warnPredict';
import { getDissolvedOxygenOption as getOption, colorRgb } from './data';

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
      thirdOption: getOption({ empty: true }),
      poolList: [],
      allData: [],
      currentPoint: '',
      chartOptions: {},
      chartData: [],
      option: {
        color: ['#7da466', '#5BFF72'],
        series: [],
        grid: {
          left: '3%',
          right: '4%',
          top: '15%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          show: true,
          data: [],
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          top: 6,
          right: 6,
          textStyle: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            axisLabel: {
              rotate: 40
            },
            axisLine: {
              show: false,
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            splitLine: {
              show: false
            },
            nameTextStyle: {
              align: 'right'
            }
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 1,
            show: false,
            position: 'right',
            nameTextStyle: {
              align: 'left'
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ]
      }
    };
  },

  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.getThirdData();
        }
      },
      immediate: true
    }
  },

  methods: {
    async getThirdData() {
      if (!this.waterPlantId) return;
      let params = {
        startDateTime: moment()
          .subtract(8, 'days')
          .format('YYYY-MM-DD 00:00:00'),
        endDateTime: moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD 00:00:00'),
        waterPlantId: this.waterPlantId
      };
      const { resultData, status } = (await getCarbonSourceDosingEnergyData(params)) || {};
      let tmpOption = JSON.parse(JSON.stringify(this.option));
      if (status === 'complete') {
        let xData = resultData?.[0]?.timeDataList?.map(data => {
          const dateStr = `${data.dateTimeStr}` || '';
          return dateStr.slice(-5);
        }) || [];
        let series = resultData?.map(item => {
          let yData = item.timeDataList?.map(data => data.historyPointValue);
          return {
            name: item.pointMemo,
            data: yData || [],
            type: 'line',
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRgb('#7da466', 0.5) },
                { offset: 1, color: colorRgb('#7da466', 0.1) }
              ])
            }
          }
        });
        tmpOption.series = series;
        // 设置图例数据
        tmpOption.legend.data = resultData?.map(item => item.pointMemo) || [];
        tmpOption.xAxis[0].data = xData;
        tmpOption.xAxis[0].axisLabel.rotate = 0;
        // 保留左侧Y轴配置
        if (resultData && resultData.length > 0) {
          tmpOption.yAxis[0] = {
            type: 'value',
            splitLine: { show: false },   // ✅ 关掉横线
            name: resultData[0].pointUnit || '',
            nameTextStyle: {
              align: 'right'
            }
          };
        }
        // 右侧Y轴保持0-1范围
        tmpOption.yAxis[1] = {
          type: 'value',
          name: '',
          min: 0,
          max: 1,
          show: false,
          position: 'right',
          nameTextStyle: {
            align: 'left'
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        };
      }
      this.thirdOption = tmpOption;
    },
    lineChange() {
      this.getThirdData()
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 17px 12px 0;

  .box {
    width: 100%;
    height: 100%;
    min-height: 200px;
  }
}
</style>

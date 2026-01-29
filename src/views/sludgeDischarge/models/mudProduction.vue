<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-26 08:45:17
 * @Description: 稳定出水监控组件
-->
<template>
  <unit-card cardTitle="湿污泥含水率" :showTime="false">
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
import { queryPointHistoryData } from '@/api/energyAnalyse';
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
      currentPoint: '1',
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
          left: '0px',
          right: '0px',
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
            margin: 24,
            fontSize: 14,
            align: 'center',
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
            name: '%',
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
            type: 'line',
            smooth: true,
            symbolSize: 12,
            symbol:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAl1JREFUSEu9lk1IVFEUx3/nPmcmTAgN+5jpi4KKQk0JWqWbFgpBGCG0TNCFQmsLIiKo1oEtFGwZDJEEgS7aqKsgNBWjWkRaM5GSEWQ0M7574j1n5Dn5Bfl8y3fuPb97/+fc/73CJr4p1ShzVNg/7PSGmx0sUMn8aZHsRtNlvQET01ruGq6IocFaDiFLAJQFY5hRy5BjeVp9WH6slWdVwOtPur8kSgdKuyp7AAvMAb/yicqASm8zIsxaocdmeXT2iHwtBv0DGE/pCQv3US7lEwwqvHCESdUlgAhlrlIlcFGVRn8BwnMDN2oS8j4IWQHwkysvgQPAkDE8qInL4Hoyjqe10Vq6gAbgixEuBCHLAE8WJ0I3SjPCsFPCteq98nGjInrxiW961F3kMUo9Qr+bo7Mg1zJgNK13xXLTwIhEaN1s8sICfEiOPuC8Gu7VxeWWL6e/gmkttyW88wpqDE0bybLWrvJyDXiFN4uc9LrLB4x91jaEHhEGzySkKZhAVZ1sllOu4U5eZy/steftaJS3IuIGx79J6YBfeKW99qD0ineIcmn6VLmKcL02Id3BCZmMVrmGXoVzRd3xyrG0xWIyGfw/ltJOlIciPInEaZWpWd2XyZAU4bhjaKmOy3Bwwu+cPlNoXk0Wgf7SiFwOxibSWu9akqp8iMVokckZPZYzJAV2GaGlJiGjRYDvChVrAOZLI7I7GBtPaZ1Vkgo/I3Y7AKFLFHqRQ2/TbTloHqRgFcCIs9VW4QFCNzsPErRrA0NspV0XDkuoF04B4sllonSYMK7MFb4S1qVf7Dv/82z5CynFsTQu0JXhAAAAAElFTkSuQmCC',

            data: [],
            itemStyle: {
              color: '#fff',
              borderColor: '#fff',
              borderWidth: 1,
              normal: {
                lineStyle: {
                  color: '#3c82ba',
                  width: 3 // 折线宽度
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new eCharts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: '#06193f'
                    },
                    {
                      offset: 1,
                      color: '#1b3866'
                    }
                  ])
                }
              }
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
          this.fetchData();
        }
      },
      immediate: true
    }
  },

  methods: {
    async fetchData() {
      let startTime = moment().subtract(1, 'day').format('YYYY-MM-DD 08:00:00');
      let endTime = moment().format('YYYY-MM-DD HH:mm:ss');

      const params = {
        startDateTime: startTime,
        endDateTime: endTime,
        timePeriod: 'HOURS',
        waterPlantId: this.waterPlantId,
        configCode: 'wnhsl'
      };
      const { resultData, status } = await queryPointHistoryData(params);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.handlePointChange(resultData[0]);
      }
    },
    handlePointChange(chartData) {
      if (!chartData) return;
      const { dataAndTimeList, cb = 0, gb = 0 } = chartData;
      const timeFormat = 'HH:mm';
      const xData = dataAndTimeList.map(item => moment(item.date).format(timeFormat));

      // 根据时间维度选择使用的数值字段
      const data = dataAndTimeList.map(val => val['pv']);
      this.lineOption.xAxis.data = xData;
      this.lineOption.series[0].data = data;
      let max = Math.floor(Math.max(...data));
      let min = Math.floor(Math.min(...data));
      this.lineOption.yAxis[0].min = min > 20 ? min - 20 : 0;
      this.lineOption.yAxis[0].max = max + 20;
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

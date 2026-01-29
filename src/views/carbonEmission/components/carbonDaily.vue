<!--
 * @Author: wangyr
 * @Date: 2024-07-24 08:32:17
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-30 13:08:16
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div v-for="item in pointsArr" :key="item.carbonEmissionType" class="echart-block">
        <div class="echart-title">{{ item.carbonEmissionTypeName }}</div>
        <div class="echart-box">
          <line-chart ref="powerChart" :options="item.option"> </line-chart>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import UnitCard from './SecordCard.vue';
import { sourceTimeData } from '@/api/carbonEmission.js';

export default {
  name: 'carbonDaily',
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
      pointsArr: [],
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
        dateType: 'hour',
        waterPlantId: this.waterPlantId,
        startDateTime: moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),
        endDateTime: moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
      };
      const { status, resultData } = await sourceTimeData(params);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.pointsArr = resultData.slice(0, 3);
        let dataTime = [];
        resultData[0].carbonEmissionDataList.forEach(item => {
          dataTime.push(item.dataTime.slice(11, 16));
        });

        this.initChart(dataTime);
      }
    },
    initChart(dataTime) {
      let colors = [
        [
          {
            offset: 0,
            color: 'rgba(107, 206, 255, 0.5)'
          },
          {
            offset: 0.99,
            color: 'rgba(0,41,62, 0)'
          }
        ],
        [
          {
            offset: 0,
            color: 'rgba(23,100,255, 0.5)'
          },
          {
            offset: 0.99,
            color: 'rgba(0,22,66, 0)'
          }
        ],
        [
          {
            offset: 0,
            color: 'rgba(0,180,6, 0.5)'
          },
          {
            offset: 0.99,
            color: 'rgba(0,33,3, 0)'
          }
        ]
      ];
      let borderColors = ['#6BCEFF', '#6B9CFF', '#43D25E'];
      this.pointsArr.forEach((item, i) => {
        let option = {
          textStyle: {
            color: 'rgba(108, 128, 151, 1)',
            fontSize: 12
          },
          color: ['rgba(58, 208, 252, 1)', 'rgba(240, 108, 157, 1)', 'rgba(255, 119, 39, 1)', 'rgba(255, 56, 56, 1)'],
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
          legend: [
            {
              right: 0,
              itemHeight: 2,
              itemWidth: 12,
              textStyle: {
                color: 'rgba(217,247,255, 1)',
                fontSize: 12
              }
            }
          ],
          animationEasing: 'backIn',
          animationDuration: 2000,
          grid: {
            left: 28,
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
              color: '#D9F7FF',
              showMaxLabel: true,
              showMinLabel: true
            },
            lineStyle: {
              color: 'rgba(108, 128, 151, 1)'
            },
            boundaryGap: false,
            data: dataTime
          },
          yAxis: {
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLabel: {
              color: '#D9F7FF'
            },
            minInterval: 1,
            type: 'value',
            name: 'tonCO₂',
            nameLocation: 'end',
            nameTextStyle: {
              align: 'right',
              color: '#D9F7FF',
              padding: [0, 8, 0, 0]
            }
          },
          series: [
            {
              type: 'line',
              areaStyle: {
                opacity: 1,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: colors[i]
                }
              },
              showSymbol: false,
              smooth: true,
              data: item.carbonEmissionDataList.map(v => v.value),
              name: item.carbonEmissionTypeName,
              itemStyle: {
                color: borderColors[i],
                borderColor: '#F5FAFF',
                borderWidth: 3
              }
            }
          ]
        };
        item['option'] = option;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 2px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .echart-block {
    width: calc(33.3% - 14px);
    height: 100%;
    position: relative;

    .echart-title {
      width: 100%;
      height: 24px;
      background: url('~@/assets/img/carbonEmission/echart_tilte.png') no-repeat;
      background-size: 100% 100%;
      font-family: Aliba, sans-serif;
      font-weight: 500;
      font-size: 16px;
      color: #e4f1ff;
      letter-spacing: 0;
      padding: 0 0 0 24px;
      box-sizing: border-box;
    }
    .echart-box {
      width: 100%;
      height: calc(100% - 24px);
      position: relative;
    }
  }
}
</style>

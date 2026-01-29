<!--
 * @Author: wangyr
 * @Date: 2024-07-24 08:32:17
 * @LastEditors: wangyr
 * @LastEditTime: 2024-08-17 17:57:55
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="true" :currentDate="currentDate" @handleDate="handleDate">
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
import * as echarts from 'echarts';
import UnitCard from './SecordCard.vue';
import { sourceTimeData } from '@/api/carbonEmission.js';

export default {
  name: 'carbonWeekly',
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
      currentDate: 'day',
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
    handleDate(dateType) {
      this.currentDate = dateType;
      this.initData();
    },
    async initData() {
      let params = {
        dateType: 'day',
        waterPlantId: this.waterPlantId,
        startDateTime:
          this.currentDate === 'day'
            ? moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00')
            : moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00'),
        endDateTime: moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
      };
      const { status, resultData } = await sourceTimeData(params);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.pointsArr = resultData.slice(0, 3);
        let dataTime = [];
        resultData[0].carbonEmissionDataList.forEach(item => {
          dataTime.push(item.timeStr);
        });

        this.initChart(dataTime);
      }
    },
    initChart(dataTime) {
      let colors = [
        [
          { offset: 0, color: '#6BCEFF' },
          { offset: 0.99, color: '#00293E' }
        ],
        [
          { offset: 0, color: '#1764FF' },
          { offset: 0.99, color: '#001642' }
        ],
        [
          { offset: 0, color: '#00B406' },
          { offset: 0.99, color: '#002103' }
        ]
      ];
      let borderColors = ['#6BCEFF', '#6B9CFF', '#43D25E'];
      this.pointsArr.forEach((item, i) => {
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
          legend: [
            {
              right: 0,
              itemHeight: 2,
              itemWidth: 12,
              data: [item.carbonEmissionTypeName],
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
            boundaryGap: true,
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
            nameTextStyle: {
              align: 'right',
              color: '#D9F7FF',
              padding: [0, 8, 0, 0]
            },
            axisLabel: {
              color: '#D9F7FF',
              fontWeight: 400,
              fontSize: 12
            },
            type: 'value',
            name: 'tonCO₂',
            nameLocation: 'end'
          },
          series: [
            {
              type: 'bar',
              name: item.carbonEmissionTypeName,
              barWidth: 8,
              barGap: '20%',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, colors[i])
                },
                borderWidth: 1,
                borderColor: borderColors[i]
              },
              data: item.carbonEmissionDataList.map(v => v.value)
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

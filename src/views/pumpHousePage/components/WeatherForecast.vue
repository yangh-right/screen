<!--
 * @Description:
 * @Author: JianYue
 * @Date: 2023-12-14 09:14:41
 * @LastEditTime: 2024-09-27 11:47:33
 * @LastEditors: wangyr
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="card-inner">
      <div class="chart-btns">
        <div
          v-for="item in pointsArr"
          :key="item.pointName"
          :class="[currentPoint === item.type ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="line-chart">
        <line-chart v-if="currentPoint === 'temperature'" :options="barOption" ref="inChart" />
        <bar-chart v-if="currentPoint === 'windPower'" :options="option" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';
import { getWeather } from '@/api/pumpHousePage.js';
import moment from 'moment';

export default {
  name: 'WeatherForecast',
  components: {
    LineChart: () => import('@/components/chart/Chart.vue'),
    barChart: () => import('@/components/chart/Chart.vue')
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
      currentPoint: 'temperature',
      pointsArr: [
        {
          label: '气温',
          type: 'temperature'
        },
        {
          label: '风力',
          type: 'windPower'
        }
      ],
      barOption: {
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
          data: ['最高温', '最低温'],
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
          left: '3%',
          right: '3%',
          top: '14%',
          bottom: '3%',
          height: '80%'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            fontsize: 2,
            align: 'center',
            color: '#D9F7FF'
          }
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.2)'
              }
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              fontSize: 14,
              color: '#D9F7FF',
              formatter: '{value}°C'
            }
          }
        ],
        series: [
          {
            name: '最高温',
            type: 'line',
            label: {
              show: true, // 显示节点标签
              fontSize: 14,
              color: '#D9F7FF',
              formatter: '{c}°C' // 设置节点标签的格式化函数，添加单位
            },
            data: [],
            lineStyle: {
              width: 3 // 折线宽度
            },
            symbolSize: 8
          },
          {
            name: '最低温',
            type: 'line',
            data: [],
            label: {
              show: true, // 显示节点标签
              fontSize: 14,
              color: '#D9F7FF',
              formatter: '{c}°C' // 设置节点标签的格式化函数，添加单位
            },
            lineStyle: {
              width: 3 // 折线宽度
            },
            symbolSize: 8
          }
        ]
      },
      option: {
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
          data: ['白天', '夜晚'],
          itemWidth: 16,
          itemHeight: 8,
          textStyle: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          top: '14%',
          bottom: '3%',
          height: '80%'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            fontsize: 2,
            align: 'center',
            color: '#D9F7FF'
          }
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.2)'
              }
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              fontWeight: 10,
              fontsize: 5,
              color: '#D9F7FF'
            }
          }
        ],
        series: [
          {
            name: '白天',
            type: 'bar',
            barWidth: '25%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#00FFE8' },
                  { offset: 1, color: '#003A8C' }
                ])
              }
            },
            data: []
          },
          {
            name: '夜晚',
            type: 'bar',
            barWidth: '25%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#6B4815' },
                  { offset: 1, color: '#FDD47C' }
                ])
              }
            },
            data: []
          }
        ]
      },
      weatherList: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      this.weatherList = [];
      const url = '/baiduApi/v1/?district_id=330100&data_type=all&ak=nchkStac8xxU85eqbUNpxkESe491lhQd';
      Promise.allSettled([getWeather(), axios.get(url)]).then(results => {
        console.log('yyy', results);
        results.forEach((result, index) => {
          if (result?.status === 'fulfilled') {
            let data = result.value;
            // 平台天气接口
            if (index === 0 && !!data?.resultData) {
              this.weatherList = data?.resultData?.result?.forecasts || [];
              this.getPlatformData();
            }
            // 百度天气接口
            if (index === 1 && this.weatherList.length === 0) {
              this.weatherList = data.result.forecasts;
              this.getPointData();
            }
          } else {
            console.log(`Promise ${index + 1} rejected`);
          }
        });
      });
    },
    handleChange(item) {
      this.currentPoint = item.type;
    },
    getPlatformData() {
      this.weatherList.forEach(item => {
        let regex = /\d+/;
        let wcDayData = item.wcDay.match(regex);
        let wcDayInt = parseInt(wcDayData[0]);
        let wcNightData = item.wcNight.match(regex);
        let wcNightInt = parseInt(wcNightData[0]);
        let date = moment(item.date).format('M月D日');
        this.barOption.xAxis.data.push(date);
        this.barOption.series[0].data.push(item.high);
        this.barOption.series[1].data.push(item.low);
        this.option.xAxis.data.push(date);
        this.option.series[0].data.push(wcDayInt);
        this.option.series[1].data.push(wcNightInt);
      });
    },
    getPointData() {
      let dateList = [];
      let temperatureListHigh = [];
      let temperatureListLow = [];
      let windList = [];
      let wcNightIntList = [];

      this.weatherList.forEach(item => {
        let regex = /\d+/;
        let wcDayData = item.wc_day.match(regex);
        let wcDayInt = parseInt(wcDayData[0]);
        let wcNightData = item.wc_night.match(regex);
        let wcNightInt = parseInt(wcNightData[0]);
        let date = moment(item.date).format('M月D日');
        dateList.push(date);
        temperatureListHigh.push(item.high);
        temperatureListLow.push(item.low);
        windList.push(wcDayInt);
        wcNightIntList.push(wcNightInt);
      });
      this.barOption.xAxis.data = dateList;
      this.barOption.series[0].data = temperatureListHigh;
      this.barOption.series[1].data = temperatureListLow;
      this.option.xAxis.data = dateList;
      this.option.series[0].data = windList;
      this.option.series[1].data = wcNightIntList;
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px 15px 0;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
    background-size: 100% 100%;

    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }

  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0 12px;
    box-sizing: border-box;

    .tabs {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 8px;
      cursor: pointer;

      .tab {
        height: 24px;
        line-height: 24px;
        margin-right: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 15px;
        background: #f4f6f8;
        color: #666666;
        border-radius: 12px;
        font-size: 14px;
      }

      .active {
        color: #5b8ff9;
        background: #5b8ff91a;
      }
    }

    .chart-btns {
      padding: 8px 12px 0 6px;
      box-sizing: border-box;
      display: flex;

      .point-btn {
        width: calc(25% - 6px);
        height: 34px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;
        line-height: 34px;
        cursor: pointer;
      }

      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }

    .line-chart {
      width: 100%;
      height: 80%;
      margin-top: 24px;

      #alarm_chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

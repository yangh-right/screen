<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-08-21 13:28:05
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="chart-btns">
        <div
          v-for="item in pointsArr"
          :key="item.pointName"
          :class="[currentPoint === item.pointName ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item)"
        >
          {{ item.pointMemo }}
        </div>
      </div>
      <div class="echart-block">
        <line-chart :options="option"></line-chart>
      </div>
    </div>
  </div>
</template>

<script>
import { getOutletWater } from '@/api/mainPage.js';

export default {
  name: 'OutWaterQuality',
  components: {
    LineChart: () => import('@/components/chart/Chart.vue')
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
      cardTitle: '进水水质',
      currentPoint: '',
      option: {},
      pointsArr: []
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initData(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    async initData(id) {
      let { status, resultData } = await getOutletWater(id);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.pointsArr = resultData;
        this.handleChange(this.pointsArr[0]);
      }
    },
    handleChange(item) {
      this.currentPoint = item.pointName;
      this.handleChart(item);
    },
    handleChart(pointData) {
      let { unit, dataAndTimeList = [] } = pointData;
      let data1 = [];
      let data2 = [];
      let xData = [];
      dataAndTimeList.forEach(item => {
        xData.push(item.date.slice(11, 13));
        data1.push(item.pv);
        data2.push(item.simulatePv);
      });
      let option = {
        textStyle: {
          color: 'rgba(108, 128, 151, 1)',
          fontSize: 12
        },
        color: ['rgba(0, 251, 192, 1)', 'rgba(255, 156, 7, 1)', 'rgba(255, 119, 39, 1)', 'rgba(255, 56, 56, 1)'],
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
          itemHeight: 3,
          right: 0,
          data: ['实时', '预测', '厂标', '省标'],
          textStyle: {
            color: 'rgba(217,247,255, 1)',
            fontSize: 12
          }
        },
        animationEasing: 'backIn',
        animationDuration: 2000,
        grid: {
          left: 20,
          right: 30,
          bottom: 17,
          top: 30,
          containLabel: true
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
          boundaryGap: false,
          data: xData
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
            fontSize: 14
          },
          type: 'value',
          name: unit,
          nameLocation: 'end'
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
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(49,212,255,0.7)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(49,212,255,0)'
                  }
                ]
              }
            },
            showSymbol: false,
            smooth: true,
            data: data1,
            name: '实时',
            itemStyle: {
              color: 'rgba(49,212,255,1)',
              borderColor: '#F5FAFF',
              borderWidth: 3
            }
          },
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
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(41,63,170,0.7)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(41,63,170,0)'
                  }
                ]
              }
            },
            showSymbol: false,
            smooth: true,
            data: data2,
            name: '预测',
            itemStyle: {
              color: '#00A3FF',
              borderColor: '#F5FAFF',
              borderWidth: 3
            }
          },
          {
            name: '厂标',
            type: 'line',
            lineStyle: {
              color: '#e8ff61',
              type: 'dashed'
            },
            symbol: 'none',
            data: this.handleLimitVal(pointData.cb || 0)
          },
          {
            name: '省标',
            type: 'line',
            lineStyle: {
              color: '#ba63ff',
              type: 'dashed'
            },
            symbol: 'none',
            data: this.handleLimitVal(pointData.gb || 0)
          }
        ]
      };

      this.option = option;
    },
    handleLimitVal(val) {
      let tempArr = [];
      for (let i = 0; i < 24; i++) {
        tempArr.push(val);
      }
      return tempArr;
    }
  },
  mounted() {}
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
    padding: 15px 12px;
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
  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;

    .chart-btns {
      padding: 4px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .point-btn {
        width: calc(25% - 6px);
        height: 34px;
        line-height: 34px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;
        cursor: pointer;
        padding: 0 6px;
      }
      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .echart-block {
      width: 100%;
      height: calc(100% - 30px);
      margin-top: 6px;

      #alarm_chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

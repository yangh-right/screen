<!--
 * @Description:
 * @Author: JianYue
 * @Date: 2023-12-14 09:14:41
 * @LastEditTime: 2024-06-25 10:35:56
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
          :class="[currentPoint === item.pointName ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item)"
        >
          {{ item.pointMemo }}
        </div>
      </div>
      <div class="line-chart">
        <line-chart :options="barOption" ref="inChart" />
      </div>
    </div>
  </div>
</template>

<script>
import { removalRate } from '@/api/operationPage.js';

const dateList = [
  '0:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '24:00'
];

export default {
  name: 'PowerAnalysis',
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
      currentPoint: '1',
      pointsArr: [],
      barOption: {
        color: ['#F57A13'],
        grid: [
          {
            left: '3%',
            right: '3%',
            top: '18%',
            bottom: '4%'
          }
        ],
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
        xAxis: [
          {
            data: dateList,
            axisLabel: {
              showMaxLabel: true,
              showMinLabel: true,
              color: '#D9F7FF',
              fontWeight: 400
            }
          }
        ],
        yAxis: [
          {
            name: '',
            axisLabel: {
              color: '#D9F7FF',
              fontWeight: 400
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            }
          }
        ],
        series: [
          {
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: [],
            smooth: true
          }
        ]
      }
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
      let { status, resultData } = await removalRate(this.waterPlantId);
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
      let valueList = dataAndTimeList.map(item => item.pv);
      this.barOption.xAxis[0].data = dataAndTimeList.map(item => item.date?.slice(11, 16));
      this.barOption.series[0].data = valueList;
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
      padding: 8px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
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
    }
  }
}
</style>

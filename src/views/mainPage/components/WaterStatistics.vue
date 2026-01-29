<!--
 * @Author: wangyr
 * @Date: 2023-04-21 17:20:07
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-17 09:08:43
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="left-box">
        <div class="echart-block">
          <mult-chart :options="option"></mult-chart>
          <div class="pie-bg">{{ loadRate }}%</div>
        </div>
        <div class="echart-title">负荷率</div>
      </div>
      <div class="right-box">
        <div class="point-tab">
          <div class="point-text">
            <div class="lable">今日污水处理量</div>
            <div class="value">{{ realTimeTraffic }} <span class="unit">m³</span></div>
          </div>
        </div>
        <div class="point-tab">
          <div class="point-text">
            <div class="lable">昨日污水处理量</div>
            <div class="value">{{ yesterdayCumulativeFlow }} <span class="unit">m³</span></div>
          </div>
        </div>
        <div class="point-tab">
          <div class="point-text">
            <div class="lable">上月污水处理量</div>
            <div class="value">{{ dailyCumulativeFlow }} <span class="unit">m³</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { waterStatistics } from '@/api/mainPage.js';

export default {
  name: 'WaterStatistics',
  components: {
    multChart: () => import('@/components/chart/Chart.vue')
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
      option: {},
      loadRate: 0,
      dailyCumulativeFlow: 0,
      realTimeTraffic: 0,
      yesterdayCumulativeFlow: 0
    };
  },
  computed: {},
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.init();
        }
      }
    }
  },
  methods: {
    async init() {
      let { resultData, status } = await waterStatistics(this.waterPlantId);
      if (status === 'complete') {
        this.loadRate = parseFloat(resultData?.loadRate).toFixed(1);
        this.realTimeTraffic = resultData?.todayFlowPv;
        this.yesterdayCumulativeFlow = resultData?.yesterdayFlowPv;
        this.dailyCumulativeFlow = resultData?.lastMonthFlowPv;
      }
      this.option = {
        series: [
          {
            name: '内部进度条',
            type: 'gauge',
            radius: '86%',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              distance: -14,
              color: '#A3D5EF',
              fontSize: 10
            },
            itemStyle: {
              color: '#ffffff'
            },
            pointer: {
              show: false
            },
            animationDuration: 4000,
            zlevel: 16
          },
          {
            name: '',
            zlevel: 12,
            type: 'pie',
            radius: ['62%', '82%'],
            avoidLabelOverlap: false,
            startAngle: 245,
            center: ['50%', '50%'],
            hoverAnimation: false,
            label: {
              show: false
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.loadRate,
                name: '今日检查进度',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: '	rgba(108,146,140,1.000)'
                    },
                    {
                      offset: 0.7,
                      color: 'rgba(255, 222, 109, 1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(235,104,33,1.000)'
                    }
                  ])
                }
              },
              {
                value: 100 - this.loadRate,
                name: '未检查',
                itemStyle: {
                  color: 'transparent'
                }
              },
              {
                value: 16,
                name: '',
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            type: 'gauge',
            radius: '83%',
            zlevel: 10,
            center: ['50%', '50%'],
            splitNumber: 12,
            progress: {
              show: false
            },
            pointer: {
              icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
              length: '70%',
              width: 6,
              offsetCenter: ['5%', '-30%'],
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(235,104,33,0.1)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(235,104,33,1.000)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            anchor: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              show: false
            },
            data: [
              {
                value: this.loadRate
              }
            ]
          }
        ]
      };
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
    overflow: auto;
    padding: 0 12px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    .left-box {
      width: calc(100% - 210px);
      height: 100%;
      background: url('~@/assets/img/hz/d-pie.png') no-repeat;
      background-size: 100% 100%;
      position: relative;
      .echart-block {
        width: 100%;
        height: calc(100% - 8px);
        margin-top: 7px;
        position: relative;
        .pie-bg {
          width: 84px;
          font-weight: 700;
          text-align: center;
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -42px;
          margin-top: -28px;
          font-family: Oswald-Bold, sans-serif;
          font-size: 26px;
          background-image: linear-gradient(to bottom, #ffffff, #ffffff, #58c0ff);
          -webkit-background-clip: text;
          color: transparent;
        }
      }
      .echart-title {
        width: 158px;
        height: 34px;
        font-family: Aliba, sans-serif;
        text-align: center;
        line-height: 34px;
        margin: 0 auto;
        font-weight: 600;
        font-size: 14px;
        color: #d9f7ff;
        position: absolute;
        bottom: 0px;
        left: 50%;
        margin-left: -79px;
      }
    }
    .right-box {
      flex: 0 0 190px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .point-tab {
        height: 56px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/hz/b-points.png') no-repeat;
        padding-left: 65px;
        box-sizing: border-box;
        .point-text {
          text-align: left;
          .lable {
            font-family: Aliba, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #d9f7ff;
          }
          .value {
            font-family: Oswald-Bold, sans-serif;
            font-weight: 700;
            font-size: 18px;
            line-height: 1;
            background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
            -webkit-background-clip: text;
            color: transparent;
          }
          .unit {
            font-size: 14px;
            color: #d9f7ff;
          }
        }
      }
    }
  }
  /deep/ .wpg-spin-container {
    height: 100%;
  }
}
</style>

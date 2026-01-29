<!--
 * @Author: wangyr
 * @Date: 2023-05-13 15:14:48
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-15 18:12:04
 * @Description:
-->
<template>
  <div class="water-quality">
    <model-title :title="'水质合格率'" />
    <div class="content">
      <div class="ico-left"></div>
      <div class="ico-right"></div>
      <div class="content-chart">
        <car-chart :options="option"></car-chart>
        <div class="bg-chart">
          <div class="status">{{ qualityInfo }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import moment from 'moment';
import { fontChart } from '@common/js/tool/echartPxToRem.js';
import { getWaterQuality } from '@/api/mainPage';
export default {
  name: 'WaterQuality',
  computed: {
    qualityInfo() {
      const q = this.quality;
      if (q < 32) {
        return '差';
      } else if (q >= 32 && q < 49) {
        return '中';
      } else if (q >= 49 && q < 67) {
        return '良';
      } else {
        return '优';
      }
    }
  },
  components: {
    CarChart: () => import('@/components/chart/Chart.vue')
  },
  props: {},
  data() {
    return {
      option: {},
      quality: 0
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        let day = moment().format('YYYY-MM-DD');
        const { success, resultData } = await getWaterQuality(day);
        if (success) {
          this.quality = Number(resultData.ratio);
          this.drawGauge();
        }
      } catch (error) {
        console.log(error);
      }
    },
    drawGauge() {
      const color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: '#FF4402' // 0% 处的颜色
        },
        {
          offset: 0.38,
          color: '#BEE050' // 100% 处的颜色
        },
        {
          offset: 0.56,
          color: '#2DFF7A' // 100% 处的颜色
        },
        {
          offset: 0.76,
          color: '#35A8D4' // 100% 处的颜色
        },
        {
          offset: 1,
          color: '#3D81FF' // 100% 处的颜色
        }
      ]);
      const pointColor = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        {
          offset: 0,
          color: '#16CEB9' // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#3D81FF' // 100% 处的颜色
        }
      ]);
      const colorSet = [[1, color]];
      let that = this;
      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          show: false,
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: fontChart(30),
                color: colorSet
              }
            },
            pointer: {
              show: true,
              length: '80%',
              width: fontChart(4),
              // offsetCenter: [0, '-55%'],
              itemStyle: {
                color: pointColor
              }
            },
            axisTick: {
              distance: fontChart(-30),
              length: 6,
              lineStyle: {
                color: '#fff',
                width: 1
              }
            },
            radius: '88%',
            splitLine: {
              distance: fontChart(-30),
              length: 10,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            detail: {
              show: false
            },
            axisLabel: {
              color: '#fff',
              distance: 32,
              fontSize: 12
            },
            data: [
              {
                value: this.quality
              }
            ]
          }
        ]
      };

      this.option = option;
    }
  }
};
</script>

<style lang="less" scoped>
.water-quality {
  .content {
    display: flex;
    flex-grow: 1;
    padding: 0 18px;
    box-sizing: border-box;
    background: url(~@assets/img/quality.png) no-repeat;
    background-size: 100% 100%;
    position: relative;

    .ico-left {
      width: 37px;
      height: 37px;
      background: url(~@assets/img/right.png) no-repeat;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -19.5px;
    }
    .ico-right {
      width: 37px;
      height: 37px;
      background: url(~@assets/img/left.png) no-repeat;
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -19.5px;
    }
    .content-chart {
      width: 100%;
      height: 100%;
      position: relative;

      .bg-chart {
        width: 210px;
        height: 162px;
        background: url(~@assets/img/biao.png) no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 96px;
        top: 6px;

        .status {
          width: 83px;
          height: 82px;
          line-height: 82px;
          background: url(~@assets/img/chart_circle.png) no-repeat;
          position: absolute;
          top: 57px;
          left: 63px;
          font-family: PingFangSC, sans-serif;
          font-weight: 500;
          font-size: 32px;
          color: #def0fd;
          letter-spacing: 0;
          text-align: center;
        }
      }
    }
  }
}
</style>

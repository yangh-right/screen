/**
 * @version: 1.0.1
 * @Author: wang kai
 * @Date: 2020-07-14 16:15:59
 * @LastEditors: wang kai
 * @LastEditTime: 2020-12-21 17:32:08
 * @Description: 仪表盘图
 * @Update: 更新内容
 */
<template>
    <div class="chart" :id="myChartId"></div>
</template>

<script>
import '../common/chartTheme/dark';
// import { mergeObject } from '../common/js/tool/mergeObject';
let echarts = require('echarts/lib/echarts'); // 引入基本模板
require('echarts/lib/chart/gauge'); // 引入仪表盘图组件
require('echarts/lib/component/tooltip'); // 引入提示框
export default {
  name: 'GaugeChart',
  data() {
    return {
      baseOption: {
        title: {
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          //提示框组件
          trigger: 'item',
          formatter: (param) => {
            return `${param.name} ${param.value}`;
          }
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: 34,
          top: 20,
          containLabel: true
        },
        series: [
          {
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '100%',
            min: 0,
            startAngle: 180,
            endAngle: 0,
            axisLabel: {
              show: false
            },
            axisTick: {
              show: true,
              splitNumber: 3,
              lineStyle: {
                color: 'auto',
                opacity: 0.3,
                width: 1
                // length:10
              },
              length: 6
            },
            splitLine: {
              show: true,
              length: 18,
              lineStyle: {
                color: 'auto',
                opacity: 0.3,
                width: 1
              }
            },
            detail: {
              show: false
            },
            data: [],
            pointer: {
              show: true,
              length: '66%',
              radius: '20%',
              width: 6 //指针粗细
            }
          }
        ]
      }
    };
  },
  props: {
    chartId: {
      type: String,
      // require: true,
      defalut: ''
    },
    option: {
      // 图表配置项
      type: Object,
      require: true,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    myChartId() {
      return this.chartId ? this.chartId : this.randomStr(10);
    },
    myChart() {
      return echarts.init(document.getElementById(this.myChartId), 'dark');
    }
  },
  watch: {
    option: {
      handler() {
        this.drawChart();
      },
      deep: true
    }
  },
  methods: {
    drawChart() {
      if (this.myChart) {
        this.myChart.clear();
        // this.myChart.setOption(mergeObject({ ...this.baseOption }, this.option));
        this.myChart.setOption(this.option);
        this.resize();
      }
    },
    resize() {
      this.$nextTick(() => {
        this.myChart.resize();
      });
    },
    // 随机字符串
    randomStr(len) {
      const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
      const maxPos = $chars.length;
      let pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawChart();
    });
  },
  beforeDestroy() {
    /* 销毁组件 */
    if (this.myChart) this.myChart.dispose();
  }
};
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>

/**
* @Date: 2019/11/5 17:04
* @Version: 0.0.1
* @Author: passerby
* @Description: 折线图组件
* @Update: 调整组件 by hyq 2020/1/2 9:55
*/

<template>
    <div class="chart" :id="chartId" v-resize="resize"></div>
</template>

<script>
import * as echarts from 'echarts';
import { RadarChart } from 'echarts/charts';
// 引入提示框，标题 Component
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  RadarComponent
} from 'echarts/components';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  RadarChart,
  LegendComponent,
  RadarComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent
]);

import tools from '@common/js/tool/tools.js'; // 引入工具类

export default {
  name: "RadarChart",
  data() {
    return {
      baseOption: {
        tooltip: {          //提示框组件
          trigger: 'item', //触发类型
          axisPointer: {   //坐标轴指示器配置项
            type: 'cross'
          }
        },
        legend: {
          itemWidth: 6,
          itemHeight: 6,
          itemGap: 20,
          icon: 'circle',
          bottom: 15,
          padding: 0,
          left: 'center'
        },
        radar: [{
          indicator: [],
          radius: '70%',          //雷达图半径
          center: ['50%', '45%']  //雷达图圆心位置
        }],
        series: [
          // {
          //   name: '',
          //   type: 'radar',
          //   data: []
          // }
        ]
      }
    };
  },
  computed: {
    // 图表初始化
    // eslint-disable-next-line vue/return-in-computed-property
    myChart() {
      if (document.getElementById(this.chartId)) {
        if (this.darkTheme === 'dark' || !this.darkTheme) {
          return echarts.init(document.getElementById(this.chartId), this.darkTheme);
        }
        if (this.lightTheme === 'light' || !this.lightTheme) {
          return echarts.init(document.getElementById(this.chartId), this.lightTheme);
        }
      }
    }
  },
  props: {
    chartId: { // 图表id
      type: String,
      require: true,
      default: () => {
        return '';
      }
    },
    option: { // 图表配置项
      type: Object,
      require: true,
      default: () => {
        return {};
      }
    },
    darkTheme: { // 深色主题颜色配置
      type: String,
      require: true,
      default: () => {
        return 'dark';
      }
    },
    lightTheme: { // 浅色主题颜色配置
      type: String,
      require: true,
      default: () => {
        return 'light';
      }
    }
  },
  watch: {
    option: {
      handler: function () {
        this.drawLine();
      },
      deep: true
    }
  },
  methods: {
    // 渲染图表
    drawLine() {
      if (this.myChart) {
        this.myChart.clear();
        // tools.deepObjectMerge 改成 Object.assign
        this.myChart.setOption(Object.assign(this.baseOption, this.option));
        this.resize();
      }
    },
    // resize
    resize() {
      this.$nextTick(() => {
        this.myChart.resize();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  beforeDestroy() {
    /* 销毁组件 */
    if (this.myChart) this.myChart.dispose();
  }
};
</script>

<style scoped>
    .chart {
        width: 100%;
        height: 100%;
    }
</style>

/** * @version: 1.0.1 * @Author: kk * @Date: 2021-10-22 11:42:52 * @LastEditors: kk * @LastEditTime: 2021-12-14 14:58:41
* @Description: 内容描述 * @Update: 更新内容 */
<template>
  <div class="chart-box">
    <div class="chart-item" v-el-resize="Dresize" :id="myChartId" :key="myChartId"></div>
  </div>
</template>

<script>
import echarts, { color } from './utils/echarts';
import hat from 'hat';
import { deepObjectMerge, Debounce } from './utils/util';
const baseOption = {
  color,
  tooltip: {
    //提示框组件
    trigger: 'axis', //触发类型axis为坐标轴触发
    axisPointer: {
      //坐标轴指示器配置
      type: 'shadow'
    },
    confine: true
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '0%',
    containLabel: true
  }
};
export default {
  name: 'Chart',
  data() {
    // 实际方法中设置防抖，保证多个图表同时存在，也能对应去触发
    this.Dresize = Debounce(this.resize, 500);
    return {};
  },
  props: {
    chartId: {
      type: String,
      defalut: ''
    },
    options: {
      // 图表配置项
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    myChartId() {
      return this.chartId || hat(32);
    },
    myChart() {
      return echarts.init(document.getElementById(this.myChartId));
    }
  },
  watch: {
    options: {
      handler() {
        this.drawChart();
      },
      deep: true
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
  },
  methods: {
    drawChart() {
      if (this.myChart) {
        this.myChart.setOption(
          deepObjectMerge(
            {
              ...JSON.parse(JSON.stringify(baseOption))
            },
            this.options
          ),
          true // 添加第二个参数true，完全覆盖旧的配置
        );
        this.resize();
      }
    },
    resize() {
      this.$nextTick(() => {
        if (this.myChart) this.myChart.resize();
      });
    },
    // 添加refresh方法
    refresh() {
      this.$nextTick(() => {
        if (this.myChart) {
          this.myChart.clear();
          this.drawChart();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.chart-box {
  width: 100%;
  height: 100%;

  .chart-item {
    width: 100%;
    height: 100%;
  }
}
</style>

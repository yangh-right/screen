/*
 * @Author: wangyr
 * @Date: 2023-08-30 17:06:12
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-08-30 17:20:10
 * @Description:
 */
import * as echarts from 'echarts';

export const chartsMixins = {
  props: {
    chartId: {
      // 图表id
      type: String,
      require: true,
      default: () => {
        return `chart${
          (Math.random() * 10000000).toString(16).substr(0, 4) +
          '-' +
          new Date().getTime() +
          '-' +
          Math.random().toString().substr(2, 5)
        }`;
      }
    },
    options: {
      // 图表配置项
      type: Object,
      require: true,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      myChart: null,
      theme: 'light'
    };
  },
  computed: {},
  watch: {
    options: {
      handler: function () {
        this.drawLine();
      },
      deep: true
    }
  },
  mounted() {
    this.init();
  },
  beforeDestory() {
    this.dispose();
  },
  activated() {
    this.init();
  },
  deactivated() {
    this.dispose();
  },
  methods: {
    initChart() {
      this.dispose();
      this.$nextTick(() => {
        this.init();
      });
    },
    init() {
      if (!this.myChart) {
        if (this.$refs.chart) {
          this.myChart = echarts.init(this.$refs.chart, this.theme);
          this.drawLine();
        }
      }
    },
    dispose() {
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
        clearInterval(this.$el.__vueSetInterval__);
      }
    }
  }
};

<template>
  <div class="chart-container">
    <div :id="chartId" class="chart" :ref="chartId"></div>
    <!-- 底座背景 -->
    <slot></slot>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl';
import tools from '@common/js/tool/tools.js';
import { getPie3D, getParametricEquation } from './charts'; // 工具类js

export default {
  name: 'PieChart',
  data() {
    return {
      myChart: null,
      chartOptions: {},
      baseOption: {
        legend: {
          itemWidth: 6,
          itemHeight: 6,
          itemGap: 20,
          icon: 'circle',
          bottom: 15,
          left: 'center'
        },
        title: {
          text: '',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
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
        xAxis3D: { min: -1, max: 1 },
        yAxis3D: { min: -1, max: 1 },
        zAxis3D: { min: -1, max: 1 },
        series: []
      },
      mapCurrentIndex: 0,
      setIntervalTimer: null,
      isSet: false
    };
  },
  props: {
    // 配置项
    option: {
      type: Object,
      default: () => {}
    },
    chartId: {
      type: String,
      default: 'chart'
    },
    /** 总数 */
    total: {
      type: Number,
      default: 0
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    chartView: {
      type: Object,
      default: () => {
        return {
          internalDiameterRatio: 0.8, // 透明的空心占比
          distance: 240, // 视角到主体的距离
          alpha: 28, // 旋转角度
          pieHeight: 18, //立体的高度
          opacity: 0.8 // 饼或者环的透明度
        };
      }
    }
  },
  mounted() {
    this.chartLoaded = true;
  },
  methods: {
    // 图表绘制
    drawLine() {
      if (this.myChart) this.myChart.clear();
      this.myChart = echarts.init(this.$refs[this.chartId]);
      let _option = tools.deepObjectMerge({}, this.option);
      if (this.option.data) {
        // 传入数据生成 chartOptions, 构建3d饼状图, 参数工具文件已经备注的很详细
        const { grid3D, series, tooltip } = getPie3D(this.option.data, this.chartView);
        tooltip.show = this.showTooltip;
        _option = { ..._option, grid3D, series, tooltip };
        this.chartOptions = tools.deepObjectMerge(this.baseOption, _option);
        this.myChart.setOption(this.chartOptions);
        this.resize();
        this.bindListen(this.myChart);
      }
    },

    refreshTitle(text) {
      if (!this.chartOptions.title) {
        this.chartOptions.title = {};
      }
      this.chartOptions.title.text = text;
      this.myChart.setOption(this.chartOptions);
    },

    resize() {
      this.$nextTick(() => {
        // if (this.myChart) this.myChart.resize();
      });
    },

    // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
    // optionName是防止有多个图表进行定向option传递，单个图表可以不传，默认是opiton
    bindListen(myChart, optionName = 'chartOptions') {
      let hoveredIndex = '';
      let that = this;
      let isSet = this.isSet;

      // 监听 click 事件，处理点击并发送数据
      myChart.on('click', params => {
        if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
          // 确保option和data存在
          if (!that.option || !that.option.data) {
            return;
          }

          // 找到点击的扇形数据
          let clickData = that.option.data.find(d => d.name === params.seriesName);
          if (clickData) {
            // 触发自定义事件将数据传递出去
            that.$emit('handleClick', { name: params.seriesName, value: clickData.value });
          }
        }
      });

      // 监听 mouseover，近似实现高亮（放大）效果
      myChart.on('mouseover', params => {
        // 准备重新渲染扇形所需的参数
        isSet = false;
        clearInterval(that.setIntervalTimer);

        // 确保数据和对象存在
        if (
          !that[optionName].series ||
          !that[optionName].series[that.mapCurrentIndex] ||
          !that[optionName].series[that.mapCurrentIndex].pieData
        ) {
          return;
        }

        // 取消高亮
        let oneRatio = that[optionName].series[that.mapCurrentIndex].pieData.startRatio;
        let twoRatio = that[optionName].series[that.mapCurrentIndex].pieData.endRatio;
        let t = that[optionName].series[that.mapCurrentIndex].pieStatus.k;
        that[optionName].series[that.mapCurrentIndex].parametricEquation = getParametricEquation(
          oneRatio,
          twoRatio,
          false,
          false,
          t,
          that.chartView.pieHeight * 1.2
        );
        that[optionName].series[that.mapCurrentIndex].pieStatus.hovered = false;

        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        // 如果触发 mouseover 的扇形当前已高亮，则不做操作
        if (hoveredIndex === params.seriesIndex) {
          // 否则进行高亮及必要的取消高亮操作
        } else {
          // 如果当前有高亮的扇形，取消其高亮状态（对 chartOptions 更新）
          if (hoveredIndex !== '') {
            // 从 chartOptions.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
            isSelected = that[optionName].series[hoveredIndex].pieStatus.selected;
            isHovered = false;
            startRatio = that[optionName].series[hoveredIndex].pieData.startRatio;
            endRatio = that[optionName].series[hoveredIndex].pieData.endRatio;
            k = that[optionName].series[hoveredIndex].pieStatus.k;
            // 对当前点击的扇形，执行取消高亮操作（对 chartOptions 更新）
            that[optionName].series[hoveredIndex].parametricEquation = getParametricEquation(
              startRatio,
              endRatio,
              isSelected,
              isHovered,
              k,
              that.chartView.pieHeight // that[optionName].series[hoveredIndex].pieData.value
            );
            that[optionName].series[hoveredIndex].pieStatus.hovered = isHovered;
            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = '';
          }
          // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 chartOptions 更新）
          if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
            // 从 chartOptions.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            isSelected = that[optionName].series[params.seriesIndex].pieStatus.selected;
            isHovered = true;
            startRatio = that[optionName].series[params.seriesIndex].pieData.startRatio;
            endRatio = that[optionName].series[params.seriesIndex].pieData.endRatio;
            k = that[optionName].series[params.seriesIndex].pieStatus.k;
            // 对当前点击的扇形，执行高亮操作（对 chartOptions 更新）
            that[optionName].series[params.seriesIndex].parametricEquation = getParametricEquation(
              startRatio,
              endRatio,
              isSelected,
              isHovered,
              k,
              that.chartView.pieHeight * 1.2 //  that[optionName].series[params.seriesIndex].pieData.value + 60
            );
            that[optionName].series[params.seriesIndex].pieStatus.hovered = isHovered;
            // 记录上次高亮的扇形对应的系列号 seriesIndex
            hoveredIndex = params.seriesIndex;
          }
          // 使用更新后的 option，渲染图表
          let alarmNum = that.option.data.find(d => d.name === params.seriesName).value;
          myChart.setOption(that[optionName]);
          that.$emit('hover', { name: params.seriesName, value: alarmNum });
        }
      });
      // 修正取消高亮失败的 bug
      myChart.on('globalout', () => {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;

        if (
          hoveredIndex !== '' &&
          that[optionName].series &&
          that[optionName].series[hoveredIndex] &&
          that[optionName].series[hoveredIndex].pieData
        ) {
          // 从 chartOptions.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = that[optionName].series[hoveredIndex].pieStatus.selected;
          isHovered = false;
          k = that[optionName].series[hoveredIndex].pieStatus.k;
          startRatio = that[optionName].series[hoveredIndex].pieData.startRatio;
          endRatio = that[optionName].series[hoveredIndex].pieData.endRatio;
          // 对当前点击的扇形，执行取消高亮操作（对 chartOptions 更新）
          that[optionName].series[hoveredIndex].parametricEquation = getParametricEquation(
            startRatio,
            endRatio,
            isSelected,
            isHovered,
            k,
            that.chartView.pieHeight // that[optionName].series[hoveredIndex].pieData.value
          );
          that[optionName].series[hoveredIndex].pieStatus.hovered = isHovered;
          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = '';

          // 确保title对象存在
          if (!that[optionName].title) {
            that[optionName].title = {};
          }
          that[optionName].title.text = ['{per|' + that.total + '}'];
          that.$emit('hover', '');
        }
        // 使用更新后的 option，渲染图表
        myChart.setOption(that[optionName]);
        if (!isSet) {
          that.setIntervalTimer = setTimeout(chartHover, 2000);
          isSet = true;
        }
      });

      // 自动循环选中
      var chartHover = function () {
        if (!that.option.data || that.option.data.length === 0) {
          return;
        }

        var dataLen = that.option.data.length;
        that.mapPrevIndex = that.mapCurrentIndex;
        that.mapCurrentIndex = (that.mapCurrentIndex + 1) % dataLen;

        // 取消高亮
        if (that[optionName].series[that.mapPrevIndex] && that[optionName].series[that.mapPrevIndex].pieData) {
          let oneRatio = that[optionName].series[that.mapPrevIndex].pieData.startRatio;
          let twoRatio = that[optionName].series[that.mapPrevIndex].pieData.endRatio;
          let t = that[optionName].series[that.mapPrevIndex].pieStatus.k;
          that[optionName].series[that.mapPrevIndex].parametricEquation = getParametricEquation(
            oneRatio,
            twoRatio,
            false,
            false,
            t,
            that.chartView.pieHeight * 1.2
          );
          that[optionName].series[that.mapPrevIndex].pieStatus.hovered = false;
        }

        if (that[optionName].series[that.mapCurrentIndex] && that[optionName].series[that.mapCurrentIndex].pieData) {
          let startRatio = that[optionName].series[that.mapCurrentIndex].pieData.startRatio;
          let endRatio = that[optionName].series[that.mapCurrentIndex].pieData.endRatio;
          let k = that[optionName].series[that.mapCurrentIndex].pieStatus.k;
          // 对当前点击的扇形，执行高亮操作（对 chartOptions 更新）
          that[optionName].series[that.mapCurrentIndex].parametricEquation = getParametricEquation(
            startRatio,
            endRatio,
            false,
            true,
            k,
            that.chartView.pieHeight * 1.2
          );
          that[optionName].series[that.mapCurrentIndex].pieStatus.hovered = true;
          // 记录上次高亮的扇形对应的系列号 seriesIndex
          hoveredIndex = that.mapCurrentIndex;

          myChart.setOption(that[optionName]);
          // 使用更新后的 option，渲染图表
          let seriesName = that.option.data[that.mapCurrentIndex].name;
          let alarmNum = that.option.data[that.mapCurrentIndex].value;
          that.$emit('hover', { name: seriesName, value: alarmNum });
        }
      };

      // that.setIntervalTimer = setInterval(chartHover, 2000);
    }
  }
};
</script>

<style lang="less" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 0;

  .chart {
    width: 100%;
    height: 100%;
    top: -30px;
  }
}

@keyframes rotate {
  0% {
    transform: rotateZ(0deg); /*从0度开始*/
  }
  100% {
    transform: rotateZ(360deg); /*360度结束*/
  }
}
</style>

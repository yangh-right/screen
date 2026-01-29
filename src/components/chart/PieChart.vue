<template>
  <div :id="chartId" class="chart" ref="chart" v-resize="resize"></div>
</template>

<script>
import { deepObjectMerge } from './utils/util'; // 引入工具类
import { chartsMixins } from './utils/mixins';

export default {
  name: 'PieChart',
  mixins: [chartsMixins],
  props: {
    defaultHighlight: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      baseOption: {
        title: {
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: param => {
            return `${param.marker}${param.name} ${param.value} ${param.percent}%`;
          }
        },
        grid: [
          {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          }
        ],
        legend: {
          itemWidth: 6,
          itemHeight: 6,
          itemGap: 20,
          icon: 'circle',
          bottom: 15,
          padding: 0,
          left: 'center'
        },
        series: []
      }
    };
  },
  methods: {
    /**
     * 渲染图表
     */
    drawLine() {
      if (this.myChart) {
        this.myChart.clear();
        if (this.options.legendClick) {
          this.myChart.off('legendselectchanged');
          this.myChart.on('legendselectchanged', params => {
            this.$emit('legendSelect', params);
          });
        }
        this.myChart.setOption(deepObjectMerge(this.baseOption, this.options));
        this.myChart.on('click', params => {
          this.$emit('click', params);
        });
        this.resize();
        if (this.defaultHighlight) {
          this.myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 });
          // 当鼠标移入时，如果不是第一项，则把当前项置为选中，如果是第一项，则设置第一项为当前项
          this.myChart.on('mouseover', e => {
            this.myChart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: 0 });
            if (e.dataIndex !== this.index) {
              this.myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: this.index
              });
            }
            if (e.dataIndex === 0) {
              this.myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: e.dataIndex
              });
            }
          });

          //当鼠标离开时，把当前项置为选中
          this.myChart.on('mouseout', e => {
            this.index = e.dataIndex;
            this.myChart.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: e.dataIndex
            });
          });
        }
      }
    },
    resize() {
      this.$nextTick(() => {
        if (this.myChart) this.myChart.resize();
      });
    }
  }
};
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>

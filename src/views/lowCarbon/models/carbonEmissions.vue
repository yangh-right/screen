<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-26 11:08:01
 * @Description: 稳定出水监控组件
-->
<template>
  <unit-card cardTitle="精细化核算碳排量" :showTime="false">
    <div class="card-inner">
      <div class="box">
        <line-chart id="inChart" :options="lineOption" ref="inChart" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import * as eCharts from 'echarts';
export default {
  name: 'carbonEmissions',
  components: {
    LineChart: () => import('@/components/chart/Chart.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
  },

  props: {
    waterPlantId: {
      type: String,
      default: ''
    },
    carbonEmissions: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      lineOption: {
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
        legend: {
          show: true,
          data: [],
          itemWidth: 8,
          itemHeight: 8,
          right: 0,
          textStyle: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 12
          }
        },
        grid: {
          left: '10px',
          right: '10px',
          top: '14%',
          bottom: '0px',
          height: '93%'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          splitLine: {
            show: false // 显示分割线
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            rotate: 40,
            fontSize: 14,
            align: 'center',
            margin: 24,
            color: '#BAC9E7'
          }
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true, //分割线
              lineStyle: {
                type: [5, 5],
                color: 'rgba(255,255,255,0.2)'
              }
            },
            axisLine: {
              show: false
            },
            name: 'tCO₂',
            nameTextStyle: {
              fontSize: 14,
              color: '#BAC9E7',
              padding: [0, 30, 0, 0]
            },
            axisLabel: {
              fontSize: 14,
              color: '#BAC9E7'
            }
          }
        ],
        series: []
      }
    };
  },

  watch: {
    carbonEmissions: {
      handler(val) {
        if (Object.keys(val).length) {
          this.handlePointChange(val);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 处理图表数据
    handlePointChange(data) {
      // 确保数据存在
      if (!data || !data.detailData || !data.detailData.length) return;

      const { detailData } = data;

      // 定义渐变色数组
      const gradientColors = [
        {
          start: '#05368fbf',
          end: '#1E9CFF'
        },
        {
          start: '#026269bf',
          end: '#3AF6FC'
        },
        {
          start: '#282187bf',
          end: '#B55FFE'
        }
      ];

      // 收集所有日期
      let xData = [];
      // 处理图表系列数据
      const seriesData = [];
      const legendData = [];

      detailData.forEach((item, index) => {
        if (index == 0) {
          xData = item.dataList.map(item => item.date);
        }
        // 提取名称作为图例
        legendData.push(item.name);
        seriesData.push({
          name: item.name,
          type: 'bar',
          barWidth: '12',
          smooth: false,
          itemStyle: {
            color: new eCharts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: gradientColors[index].start
              },
              {
                offset: 1,
                color: gradientColors[index].end
              }
            ])
          },
          data: item.dataList.map(item => item.value)
        });
      });

      // 更新图表配置
      this.lineOption.xAxis.data = xData;
      this.lineOption.legend.data = legendData;
      this.lineOption.series = seriesData;

      // 刷新图表
      this.$nextTick(() => {
        if (this.$refs.inChart) {
          this.$refs.inChart.refresh();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
:deep(.card-title) {
  .title {
    .text {
      font-size: 20px !important;
    }
  }
}
.card-inner {
  width: 100%;
  height: 100%;
  padding: 17px 12px 0;

  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>

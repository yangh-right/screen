<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-11 14:18:55
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="echart-block">
        <bar-chart :options="option"></bar-chart>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { queryMaterialsAmount } from '@/api/mainPage.js';

export default {
  name: 'DigitalAssets',
  components: {
    BarChart: () => import('@/components/chart/Chart.vue')
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
      option: {
        title: {
          show: false
        },
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
          left: 'right',
          top: 'top',
          itemWidth: 12,
          itemHeight: 8,
          textStyle: {
            color: 'rgba(217,247,255, 1)',
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '2%',
          top: '12%'
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          data: []
        },
        series: [
          {
            showBackground: true,
            backgroundStyle: {
              color: '#121d3640'
            },
            name: '存量',
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#006E73' },
                { offset: 1, color: '#7AFFFF' }
              ])
            },
            data: []
          },
          {
            showBackground: true,
            backgroundStyle: {
              color: '#121d3640'
            },
            name: '预警值',
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#0048EF' },
                { offset: 1, color: '#539BFF' }
              ])
            },
            data: []
          }
        ]
      }
    };
  },
  watch: {},
  methods: {
    async initData() {
      this.option.yAxis.data = [];
      this.option.series[0].data = [];
      this.option.series[1].data = [];
      const { status, resultData } = await queryMaterialsAmount();
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        resultData.forEach(item => {
          this.option.yAxis.data.push(item.materielTypeName);
          this.option.series[0].data.push(item.existingQuantity);
          this.option.series[1].data.push(item.minInventory);
        });
      } else {
        let tempArray = [
          {
            existingQuantity: 0,
            materielTypeId: 9,
            materielTypeName: '应急物资',
            minInventory: 0
          },
          {
            existingQuantity: 0,
            materielTypeId: 10,
            materielTypeName: '防汛物资',
            minInventory: 0
          },
          {
            existingQuantity: 0,
            materielTypeId: 13,
            materielTypeName: '化学药剂',
            minInventory: 0
          }
        ];
        tempArray.forEach(item => {
          this.option.yAxis.data.push(item.materielTypeName);
          this.option.series[0].data.push(item.existingQuantity);
          this.option.series[1].data.push(item.minInventory);
        });
      }
    }
  },
  mounted() {
    this.initData();
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
    height: calc(100% - 65px);
    position: relative;
    .echart-block {
      width: 100%;
      height: 100%;
      margin-top: 6px;
    }
  }
}
</style>

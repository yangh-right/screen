<!--
 * @Author: yuan wenyu
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-09-05 17:10:06
 * @LastEditors: wangyr
 * @Description:故障分析
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="card-inner">
        <div class="echart-block">
          <pie-chart ref="alarmChart" :options="option"> </pie-chart>
        </div>
        <div class="points-list">
          <div v-for="(item, i) in pointsArr" :key="item.name" class="point-tab">
            <div class="label">
              <span class="ico-react" :style="{ background: colorList[i] }"></span>{{ item.name }}
            </div>
            <div class="value">{{ item.percent }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statisticsAnalysis } from '@/api/materialManage.js';

const colorList = ['#60b3ff', '#13abf7', '#24eacb', '#a983fc', '#fdd07c'];
export default {
  name: 'FailureAnalysis',
  components: {
    PieChart: () => import('@/components/chart/PieChart.vue')
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
      colorList,
      pointsArr: [],
      option: {}
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const { status, resultData } = await statisticsAnalysis();
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.pointsArr = resultData.map((item, i) => {
          return {
            name: item.materielTypeName,
            value: item.materialCount,
            percent: item.percent,
            itemStyle: this.colorList[i]
          };
        });
      } else {
        this.pointsArr = [
          {
            name: '传感器',
            value: 0,
            percent: '0',
            itemStyle: '#60b3ff'
          },
          {
            name: '实验室物资',
            value: 0,
            percent: '0',
            itemStyle: '#13abf7'
          },
          {
            name: '备品备件',
            value: 0,
            percent: '0',
            itemStyle: '#24eacb'
          }
        ];
      }
      let option = {
        tooltip: {
          textStyle: {
            color: '#FFF'
          },
          backgroundColor: 'rgba(1,38,73,0.8)',
          trigger: 'item',
          confine: true
        },
        legend: {
          show: false
        },
        series: [
          {
            type: 'pie',
            radius: ['44%', '56%'],
            roseType: false,
            avoidLabelOverlap: true,
            label: {
              show: false
            },
            itemStyle: {
              borderRadius: 0,
              borderColor: 'rgba(17, 62, 124, 1)',
              borderWidth: 4
            },
            labelLine: {
              show: false
            },
            data: this.pointsArr
          }
        ]
      };
      this.option = option;
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
  }
  /deep/ .wpg-spin-container {
    height: 100%;
  }
}
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .echart-block {
    width: 232px;
    height: 232px;
    text-align: center;
    background: url('~@/assets/img/materialManage/pie_bg.png') no-repeat center;
    background-size: 100% 100%;

    .label-wrap {
      position: absolute;
    }
  }

  .points-list {
    width: 50%;
    height: 100%;
    padding-left: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .point-tab {
      width: 100%;
      height: 22px;
      background-image: linear-gradient(90deg, #0072ce33 0%, #006dce0d 48%, #0065ce36 100%);
      margin-top: 8px;
      padding: 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 2px;

      .label {
        width: 140px;
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #d9f7ff;
        text-align: left;

        .ico-react {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 1.76px;
          margin-right: 6px;
        }
      }

      .value {
        width: 53px;
        font-size: 14px;
        font-weight: 700;
        background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
        -webkit-background-clip: text;
        color: transparent;

        .unit {
          font-family: Aliba, sans-serif;
          color: #ffffffff;
          font-size: 14px;
          line-height: 0;
          letter-spacing: 0;
        }
      }
    }
  }
}
</style>

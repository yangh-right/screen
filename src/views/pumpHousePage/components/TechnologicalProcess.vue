<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-11-04 13:42:22
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-header">
      <div class="content-title">
        <div class="title">{{ title }}</div>
      </div>
      <div class="chart-btns">
        <div
          v-for="item in pointsArr"
          :key="item.value"
          :class="[currentPoint === item.value ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item)"
        >
          {{ item.pointMemo }}
        </div>
      </div>
    </div>
    <div class="content-spin">
      <a-select
        v-model="lineCode"
        v-if="lineList.length > 0"
        dropdownClassName="select__list"
        class="select__block"
        @change="handleLine"
      >
        <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
        <a-select-option v-for="item in lineList" :key="item.dictValue" :value="item.dictValue">{{
          item.dictName
        }}</a-select-option>
      </a-select>
      <div class="echart-block">
        <line-chart :options="option"></line-chart>
      </div>
    </div>
  </div>
</template>

<script>
import { processAnalysis } from '@/api/pumpHousePage.js';
import { sysDictListByCode } from '@/api/deviceManager.js';

export default {
  name: 'TechnologicalProcess',
  components: {
    LineChart: () => import('@/components/chart/Chart.vue')
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
      cardTitle: '进水水质',
      lineCode: '0',
      currentPoint: '',
      option: {
        textStyle: {
          color: 'rgba(108, 128, 151, 1)',
          fontSize: 12
        },
        color: ['rgba(0, 251, 192, 1)', 'rgba(255, 156, 7, 1)', 'rgba(255, 119, 39, 1)', 'rgba(255, 56, 56, 1)'],
        tooltip: {
          trigger: 'axis',
          borderColor: 'transparent',
          backgroundColor: 'rgba(0, 16, 35, 0.7)',
          borderRadius: 4,
          textStyle: {
            color: '#A7BAD1',
            align: 'left',
            fontSize: 12
          },
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(168, 191, 221, 0.2)',
              width: 'auto'
            }
          }
        },
        legend: {
          itemHeight: 3,
          right: 0,
          textStyle: {
            color: 'rgba(217,247,255, 1)',
            fontSize: 12
          }
        },
        animationEasing: 'backIn',
        animationDuration: 2000,
        grid: {
          left: 20,
          right: 30,
          bottom: 12,
          top: 30,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          lineStyle: {
            color: 'rgba(108, 128, 151, 1)'
          },
          boundaryGap: false,
          data: []
        },
        yAxis: {
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          axisLabel: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          type: 'value',
          name: '',
          nameTextStyle: {
            color: '#D9F7FF',
            fontSize: 14,
            fontSizeWeight: 400
          }
        },
        series: [
          {
            type: 'line',
            areaStyle: {
              opacity: 1,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(49,212,255,0.7)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(49,212,255,0)'
                  }
                ]
              }
            },
            showSymbol: false,
            smooth: true,
            data: [],
            name: 'COD',
            itemStyle: {
              color: 'rgba(49,212,255,1)',
              borderColor: '#F5FAFF',
              borderWidth: 3
            }
          }
        ]
      },
      lineList: [],
      pointsArr: []
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.getLineDict(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    getLineDict() {
      sysDictListByCode('purification_line').then(res => {
        if (res.status === 'complete') {
          this.lineList = res.resultData;
          this.lineCode = this.lineList[0]?.dictValue || '';

          // 获取线段
          this.initData();
        }
      });
    },
    async initData() {
      let params = {
        waterPlantId: this.waterPlantId,
        line: this.lineCode
      };
      this.pointsArr = [];
      const { status, resultData } = await processAnalysis(params);
      if (status === 'complete') {
        for (let key in resultData) {
          this.pointsArr.push({
            pointMemo: key,
            value: key,
            data: resultData[key]
          });
        }
        this.handleChange(this.pointsArr[0]);
      }
    },
    handleLine(val) {
      this.lineCode = val;
      this.initData();
    },
    handleChange(item) {
      this.currentPoint = item.value;
      this.handleChart(item);
    },
    handleChart(item) {
      this.option.xAxis.data = item.data.xList;
      this.option.series[0].data = item.data.yList;
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(71, 116, 203, 0.2);

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-title {
    width: 50%;
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
  .chart-btns {
    width: 50%;
    padding: 8px 12px 0 22px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: relative;
    .point-btn {
      width: calc(25% - 6px);
      height: 34px;
      background: url('~@/assets/img/hz/ac-point.png') no-repeat;
      background-size: 100% 100%;
      font-family: Aliba, sans-serif;
      font-weight: 500;
      font-size: 18px;
      color: #9fcfff;
      text-align: center;
      margin-right: 8px;
      line-height: 34px;
      cursor: pointer;
    }
    .active-btn {
      background: url('~@/assets/img/hz/b-point.png') no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
    }
  }
  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;

    .echart-block {
      width: 100%;
      height: calc(100% - 10px);
      margin-top: 6px;

      #alarm_chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}
/deep/ .select__block {
  background: url('~@/assets/img/hz/ac-point.png') no-repeat;
  background-size: 100% 100%;
  width: 124px;
  height: 28px;
  position: absolute;
  top: -10px;
  left: 20px;
  z-index: 10;

  .ant-select-selection {
    background: transparent;
    border: none;
  }

  .ant-select-selection__rendered {
    height: 28px;
    line-height: 28px;
    text-align: center;
    .ant-select-selection-selected-value {
      float: unset;
      font-family: SourceHanSansCN-Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
    }
  }
}
</style>
<style lang="less">
.select__list {
  .ant-select-dropdown-menu {
    background: #042d53;
    background-size: 100% 100%;
    padding: 0;
    .ant-select-dropdown-menu-item {
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      color: #7aaed4;
    }
    .ant-select-dropdown-menu-item:hover {
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      box-shadow: inset 20px 0 20px 20px #005cad;
    }
  }
}
</style>

<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-24 18:26:18
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="chart-btns">
        <a-button
          v-for="item in pointList"
          :key="item.value"
          :class="[currentPoint === item.value ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item)"
        >
          {{ item.label }}
        </a-button>
      </div>
      <div class="echart-block">
        <div id="inter_tn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { inflowModelHistoryData } from '@/api/warnPredict';
import { genChart, lineOption } from '../model/chart';
import moment from 'moment';
export default {
  name: 'interTn',
  props: {
    title: {
      type: String,
      default: ''
    },
    alarmInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      date: [moment().startOf('day'), moment()],
      pointList: [],
      pointsArr: [],
      currentPoint: ''
    };
  },
  watch: {
    alarmInfo: {
      handler(val) {
        this.date = [moment(val.startTime).subtract(12, 'hours'), moment(val.startTime).add(12, 'hours')];
        this.getData();
      },
      immediate: true
    }
  },
  methods: {
    handleChange(item) {
      this.currentPoint = item.value;
      this.updataData(item.option);
    },
    updataData(option) {
      let { unit, data, xData } = option;
      let opt = lineOption(unit, data, xData);
      genChart('inter_tn', opt, false);
    },
    async getData() {
      if (this.alarmInfo.pumpHouseId) {
        let params = {
          waterPlantId: this.alarmInfo.pumpHouseId,
          startTime: this.date?.[0].format('YYYY-MM-DD HH:mm:ss') || '',
          endTime: this.date?.[1].format('YYYY-MM-DD HH:mm:ss') || ''
        };
        const { resultData, status } = await inflowModelHistoryData(params);
        if (status === 'complete') {
          this.pointList =
            resultData?.map(item => {
              let xData = item.timeDataList?.map(data => data.dateTimeStr);
              let yData = item.timeDataList?.map(data => data.historyPointValue);
              return {
                value: item.pointName,
                label: item.pointMemo,
                option: {
                  unit: item.pointUnit,
                  data: [
                    {
                      name: item.pointMemo,
                      data: yData
                    }
                  ],
                  xData
                }
              };
            }) || [];
        }
        this.handleChange(this.pointList[0]);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 50% !important;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px;
    height: 24px;
    background: url('~@/assets/img/hz/predict-stitle.png') no-repeat;
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
    height: calc(100% - 30px);
    position: relative;
    .echart-block {
      width: 100%;
      height: calc(100% - 38px);

      #inter_tn {
        width: 100%;
        height: 100%;
      }
    }
    .chart-btns {
      padding: 4px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .point-btn {
        width: auto;
        height: 34px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;
      }
      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
  }
}
</style>

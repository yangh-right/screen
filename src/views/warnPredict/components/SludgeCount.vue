<!--
 * @Author: yuan wenyu
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-06-25 15:12:37
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
          <line-chart ref="alarmChart" :options="option"> </line-chart>
        </div>
        <div class="bg">
          <div class="bg__item" v-for="item in dataList" :key="item.name"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { processOption } from '../model/chart';
import { solutionResult } from '@/api/warnPredict.js';

const colorList = [
  '#00EBFF',
  '#24EACD',
  '#FFD17C',
  '#9FBEF1',
  '#1BC1D7',
  '#0A8CFF',
  '#12C06E',
  '#FEC019',
  '#DF3434',
  '#BD3EEB',
  '#6a5acd'
];
import moment from 'moment';
export default {
  name: 'FailureAnalysis',
  components: {
    lineChart: () => import('@/components/chart/Chart.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    },
    solutionVal: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataList: [],
      curDataIndex: 1,
      cardTitle: '能耗分析',
      dateTime: moment(),
      monthFormat: 'YYYY-MM',
      colorList,
      currentPoint: 'in',
      currentDate: 'year',
      pointsArr: [
        {
          name: '未提交',
          value: 23
        },
        {
          name: '已入库',
          value: 30
        },
        {
          name: '审核未通过',
          value: 20
        },
        {
          name: '已作废',
          value: 3
        }
      ],
      option: {}
    };
  },
  computed: {},
  watch: {
    solutionVal: {
      handler(val) {
        this.initData(val);
      }
    }
  },
  methods: {
    async initData(val) {
      this.dataList = [];
      let data = {
        solutionId: val,
        line: '1',
        showType: '1'
      };
      const { success, resultData } = await solutionResult(data);
      if (success) {
        let firstKey = Object.keys(resultData.outputResult)[0];
        let val = resultData.outputResult[firstKey];
        for (let key in val) {
          this.dataList.push({
            name: key,
            value: val[key].yList.pop()
          });
        }
      }
      this.option = processOption(this.dataList);
    },
    handleChange(item) {
      this.currentPoint = item.type;
    },
    handleDate(item) {
      this.currentDate = item.type;
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
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .echart-block {
    width: 100%;
    height: 271px;
    z-index: 1;
    text-align: center;
    background-size: 271px 100%;

    .label-wrap {
      position: absolute;
    }
  }
  .bg {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 242px;
    left: 84px;
    top: 20px;
    z-index: 0;
    height: 100%;

    &__item {
      height: 22px;
      width: 100%;
      background: url('~@/assets/img/warnPredict/panel3.png') no-repeat;
      background-size: 100% 100%;
      margin-bottom: 23px;
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
        width: 70px;
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

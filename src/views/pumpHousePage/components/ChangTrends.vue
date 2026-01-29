<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="chart-btns">
      <div
        v-for="item in operatingData"
        :key="item.pointName"
        :class="[currentPoint === item.pointName ? 'active-btn' : '', 'point-btn']"
        size="small"
        @click="handleChange(item)"
      >
        {{ item.pointMemo }}
      </div>
    </div>
    <div class="content-spin">
      <div class="echart-block">
        <div id="alarm_out"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { genChart, mutiLineOption } from '../model/chart';
import { getAppHistoryData, running_parameter } from '@/api/pumpHousePage.js';

export default {
  name: 'ChangTrends',
  components: {},
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
      cardTitle: '能耗分析',
      dateTime: moment(),
      monthFormat: 'YYYY-MM',
      colors: ['#FF8C41', '#43F9C9', '#25C969', '#2EB1FF', '#4CEEF7'],
      currentPoint: '',
      currentDate: 'year',
      operateType: '',
      operatingData: [],
      pointsArr: [],
      pointsType: [
        {
          label: '进水',
          type: 'in'
        },
        {
          label: '出水',
          type: 'out'
        }
      ],
      datesType: [
        {
          label: '年',
          type: 'year'
        },
        {
          label: '月',
          type: 'month'
        }
      ]
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  methods: {
    async initData() {
      this.operateType = '';
      const pointsList = await running_parameter('outFlow');
      if (pointsList?.resultData?.pointConfigRels != null) {
        this.operatingData = pointsList?.resultData?.pointConfigRels || [];
        if (this.operatingData[0]) {
          this.operateType = this.operatingData[0].pointName;
        }
      }
      this.handleChange(this.operatingData[0]);
    },
    async handleChange(item) {
      this.currentPoint = item.pointName;
      let parmas = {
        startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        pointName: this.currentPoint,
        queryType: 'day',
        waterPlantId: this.waterPlantId
      };
      const { status, resultData } = await getAppHistoryData(parmas);
      this.pointsArr = [];
      let unit = '';
      let xData = [];
      let yData = [];
      if (status === 'complete') {
        this.pointsArr = resultData;
        this.pointsArr.forEach((item, i) => {
          if (i === 0) {
            unit = item.unit;
            xData = item.dataAndTimeList.map(v => {
              return moment(v.date).format('HH');
            });
          }
          yData.push({
            name: item.deviceName,
            data: item.dataAndTimeList.map(v => v.pv)
          });
        });
      }
      let opt = mutiLineOption(unit, yData, xData);
      genChart('alarm_out', opt, true);
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
  .chart-btns {
    padding: 8px 12px 0 22px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
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
    padding: 8px;
    height: calc(100% - 50px);
    position: relative;

    .chart-btns {
      padding: 8px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
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
      }
      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .echart-block {
      width: 100%;
      height: 100%;

      #alarm_out {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

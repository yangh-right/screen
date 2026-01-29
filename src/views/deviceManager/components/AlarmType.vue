<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-header">
      <div class="chart-btns">
        <a-button
          v-for="item in pointsType"
          :key="item.type"
          :class="[currentPoint === item.type ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item)"
        >
          {{ item.label }}
        </a-button>
      </div>
      <div class="date-btns">
        <a-button
          v-for="item in datesType"
          :key="item.type"
          :class="[currentDate === item.type ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleDate(item)"
        >
          {{ item.label }}
        </a-button>
      </div>
      <div class="date-box">
        <a-month-picker class="date-bg" v-model="dateTime" :allowClear="false" :format="monthFormat">
          <template #suffixIcon>
            <div class="i-drop"></div>
          </template>
        </a-month-picker>
      </div>
    </div>

    <div class="card-inner">
      <div class="echart-block">
        <pie-chart ref="alarmChart" :options="option"> </pie-chart>
      </div>
      <div class="points-list">
        <div v-for="(item, i) in pointsArr" :key="item.label" class="point-tab">
          <div class="label"><span class="ico-react" :style="{ background: colors[i] }"></span>{{ item.label }}</div>
          <div class="value">{{ item.value }} <span class="unit">kwh/m³</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'AlarmType',
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
      cardTitle: '能耗分析',
      dateTime: moment(),
      monthFormat: 'YYYY-MM',
      colors: ['#FF8C41', '#43F9C9', '#25C969', '#2EB1FF', '#4CEEF7'],
      currentPoint: 'in',
      currentDate: 'year',
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
      ],
      pointsArr: [
        {
          label: '风机',
          value: 0.35,
          unit: 'kwh/m³',
          percent: '36.46'
        },
        {
          label: '提升泵',
          value: 0.17,
          unit: 'kwh/m³',
          percent: '17.71'
        },
        {
          label: '回流泵',
          value: 0.16,
          unit: 'kwh/m³',
          percent: '16.67'
        },
        {
          label: '排泥泵',
          value: 0.13,
          unit: 'kwh/m³',
          percent: '13.54'
        },
        {
          label: '其他',
          value: 0.15,
          unit: 'kwh/m³',
          percent: '15.62'
        }
      ],
      option: {}
    };
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      let option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: false
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            roseType: false,
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center',
              formatter: '{name|{d}}{unit|%}\n{value|{b}}',
              rich: {
                name: { fontSize: 22, color: '#13E0FF', fontWeight: 600 },
                unit: { fontSize: 12, color: '#13E0FF' },
                value: { fontSize: 12, color: '#B2DFFF' }
              }
            },
            emphasis: {
              label: {
                show: true,
                color: '#13E0FF',
                fontSize: 22,
                fontWeight: 600
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 0.35, name: '风机' },
              { value: 0.17, name: '提升泵' },
              { value: 0.16, name: '回流泵' },
              { value: 0.13, name: '排泥泵' },
              { value: 0.15, name: '其他' }
            ]
          }
        ]
      };
      this.option = option;
    },
    handleChange(item) {
      this.currentPoint = item.type;
    },
    handleDate(item) {
      this.currentDate = item.type;
    }
  },
  created() {},
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
    padding: 15px 12px 15px 0;
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
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .chart-btns {
      width: calc(40% - 6px);
      padding: 8px 12px 0 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
    }
    .date-btns {
      width: calc(60% - 6px);
      padding: 8px 8px 0 12px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
    }
    .date-box {
      padding: 8px 12px 0 0;
      box-sizing: border-box;
    }
    .point-btn {
      width: calc(50% - 6px);
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
    .date-bg {
      /deep/ input {
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-size: 18px;
        color: #9fcfff;
      }
      .i-drop {
        width: 24px;
        height: 24px;
        background: url('~@/assets/img/hz/d-dropdown.png') no-repeat;
        background-size: 100% 100%;
        margin-top: -11px;
      }
    }
  }

  .card-inner {
    width: 100%;
    height: calc(100% - 40px);
    position: relative;
    padding: 0 12px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .echart-block {
      width: 47%;
      height: 100%;
      text-align: center;
      background: url('~@/assets/img/hz/p-chart.png') no-repeat;
      background-size: 100% 100%;
    }
    .points-list {
      width: 51%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .point-tab {
        width: 200px;
        height: 34px;
        background: url('~@/assets/img/hz/pie-point.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 6px;
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
          width: 90px;
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
}
</style>

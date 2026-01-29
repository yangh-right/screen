<template>
  <unit-card :cardTitle="title" :showTime="true">
    <div class="card-inner">
      <div class="points-list">
        <div v-for="item in pointsArr" :key="item.name" class="point-tab">
          <div class="value">{{ item.value }}{{ item.unit }}</div>
          <div class="info">
            <div class="yoy-box">
              <span class="repaire-label">同比</span><span class="repaire-num">27%</span><span class="arrow-up"></span>
            </div>
            <div class="pop-box">
              <span class="repaire-label">环比</span><span class="repaire-num">0.2%</span
              ><span class="arrow-down"></span>
            </div>
          </div>
          <div class="label">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';

export default {
  name: 'DeviceRepaire',
  components: {
    UnitCard
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
      pointsArr: [
        {
          name: '设备维修工单数',
          value: 56,
          yoy: '27',
          qoq: '0.2',
          unit: ''
        },
        {
          name: '维修工单完成数',
          value: 72,
          yoy: '27',
          qoq: '0.2',
          unit: ''
        },
        {
          name: '维修工单平均处理时长',
          value: 178,
          yoy: '27',
          qoq: '0.2',
          unit: ''
        },
        {
          name: '维修工单完成比例 ',
          value: 99,
          yoy: '27',
          qoq: '0.2',
          unit: '%'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    initData() {}
  },
  created() {},
  mounted() {
    this.initData();
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 34px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .points-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 6px;
    box-sizing: border-box;

    .point-tab {
      width: calc(50% - 3px);
      height: 97px;
      background: url('~@/assets/img/hz/repaire-info.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;

      .value {
        background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
        -webkit-background-clip: text;
        color: transparent;
        font-size: 18px;
        font-weight: 400;
        text-shadow: 0 2px 4px #32c5ffa8;
        padding-top: 6px;
      }

      .info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        .yoy-box,
        .pop-box {
          width: calc(50% - 2px);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .repaire-num {
          font-family: MiSans-Bold, sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
        }
        .repaire-label {
          font-family: MiSans-Medium, sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #88afe0;
          letter-spacing: 0;
          text-align: center;
          margin-right: 3px;
        }
        .arrow-up {
          display: inline-block;
          width: 11px;
          height: 17px;
          background: url('~@/assets/img/hz/arrow-up.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 3px;
          vertical-align: text-top;
        }
        .arrow-down {
          display: inline-block;
          width: 11px;
          height: 17px;
          background: url('~@/assets/img/hz/arrow-down.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 3px;
          vertical-align: text-top;
        }
      }

      .label {
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 14px;
        margin-top: 8px;
        opacity: 0.6;
        color: #88afe0;
      }
    }
  }
}
</style>

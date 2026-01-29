<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="kpi-box">
        <div class="points-list">
          <div v-for="item in pointsArr" :key="item.name" class="point-tab">
            <div class="value">
              {{ item.value }} <span class="unit">{{ item.unit }}</span>
            </div>
            <div class="label">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';

export default {
  name: 'KpiAlasysis',
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
          name: '设备完好率',
          value: 122,
          unit: '%'
        },
        {
          name: '设备在线率',
          value: 64,
          unit: '%'
        },
        {
          name: '设备故障率',
          value: 24,
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
  height: 100%;
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .kpi-box {
    width: 427px;
    height: 221px;
    background: url('~@/assets/img/hz/kpi-bg.png') no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 27px;

    .points-list {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;

      .point-tab {
        width: 120px;
        height: 100%;
        padding-top: 100px;
        box-sizing: border-box;
        text-align: center;

        .value {
          font-family: Oswald-Bold, sans-serif;
          background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
          -webkit-background-clip: text;
          color: transparent;
          font-size: 24px;
          font-weight: 500;

          .unit {
            font-family: Aliba, sans-serif;
            color: #ffffff;
            font-size: 16px;
            font-weight: 500;
          }
        }

        .label {
          font-family: Aliba, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #d9f7ff;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>

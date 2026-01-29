<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="echart-block">
        <div id="pie-block"></div>
      </div>
      <div class="points-list">
        <div v-for="(item, i) in pointsArr" :key="item.name" class="point-tab">
          <div class="label"><span class="ico-react" :style="{ background: colors[i] }"></span>{{ item.name }}</div>
          <div class="value">
            {{ item.value }} <span class="unit">{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';
import { drawPie, genChart } from '../model/chart';

export default {
  name: 'DeviceType',
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
      colors: ['#00FFFF', '#37CC6E', '#F7931E', '#FFFF00', '#99D8FF', '#3cb9b4', '#11bbd7'],
      pointsArr: [
        {
          name: 'A类设备',
          value: 122,
          unit: '个'
        },
        {
          name: 'B类设备',
          value: 64,
          unit: '个'
        },
        {
          name: 'C类设备',
          value: 24,
          unit: '个'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      let opt = drawPie(this.pointsArr);
      genChart('pie-block', opt, false);
    }
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

  .echart-block {
    width: 252px;
    height: 185px;
    text-align: center;
    background: url('~@/assets/img/hz/d-flower.png') no-repeat;
    background-size: 100% 100%;

    #pie-block {
      width: 100%;
      height: 100%;
    }
  }
  .points-list {
    width: 162px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .point-tab {
      width: 100%;
      height: 34px;
      background-image: linear-gradient(90deg, #0072ce33 0%, #006dce0d 48%, #0065ce36 100%);
      margin-top: 6px;
      padding: 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 2px;

      .label {
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

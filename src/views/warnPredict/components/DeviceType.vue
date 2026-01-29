<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="echart-block">
        <div id="pie-block1"></div>
        <pie-chart ref="alarmChart" :options="option"> </pie-chart>
      </div>
      <div class="points-list">
        <div v-for="(item, i) in pointsArr" :key="item.name" class="point-tab">
          <div class="label">
            <div class="outer">
              <div class="ico-react" :style="{ background: colors[i] }"></div>
            </div>
            <div>{{ item.name }}</div>
          </div>
          <div class="value">
            {{ item.value }} <span class="unit">{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { drawPie, genChart } from '../model/chart';
import { AlarmTypeAnalysis } from '@/api/warnPredict';
export default {
  name: 'DeviceType',
  components: {
    PieChart: () => import('@/components/chart/PieChart.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
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
      option: {},
      colors: ['rgb(68, 170, 255)', 'rgb(102, 255, 237)', 'rgb(38, 224, 115)', 'rgb(136, 114, 253)'],
      pointsArr: []
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
      const { success, resultData } = await AlarmTypeAnalysis();
      if (success) {
        this.pointsArr = resultData.alarmTypeDataList.map(item => {
          return {
            name: item.typeName,
            value: item.count,
            unit: '个'
          };
        });
      }
      let opt = drawPie(this.pointsArr, this.colors);
      this.option = opt;
    }
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
    padding-top: 10px;
    width: 162px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .point-tab {
      position: relative;
      width: 100%;
      height: 34px;
      //  background-image: linear-gradient(90deg, #0072ce33 0%, #006dce0d 48%, #0065ce36 100%);
      margin-top: 20px;
      padding: 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 2px;

      .label {
        display: flex;
        align-items: center;
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #d9f7ff;
        text-align: left;
        .outer {
          position: relative;
          margin-right: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #3d5793;
          width: 16px;
          height: 16px;
        }
        .outer::after {
          position: absolute;
          bottom: -8px;
          left: 7px;
          width: 2px;
          height: 8px;
          background: #3d5793;
          content: '';
        }
        .ico-react {
          width: 8px;
          height: 8px;
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
    .point-tab::after {
      position: absolute;
      bottom: 0px;
      left: 16px;
      width: 150px;
      height: 2px;
      background: #3d5793;
      content: '';
    }
  }
}
</style>

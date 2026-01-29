<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="echart-block">
        <div id="pie-block1"></div>
        <pie-chart ref="alarmChart" :options="option"> </pie-chart>
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
import { drawPie, genChart } from '../model/chart';
import { doingTicketTypeRatio } from '@/api/sludgeProperty.js';

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
      colors: [
        'rgb(68, 170, 255)',
        'rgb(102, 255, 237)',
        'rgb(38, 224, 115)',
        'rgb(136, 114, 253)',
        'rgb(253,104,101)'
      ],
      pointsArr: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    async initData() {
      const { status, resultData } = await doingTicketTypeRatio();
      if (status === 'complete') {
        for (let i = 0; i < 4; i++) {
          this.pointsArr.push({
            name: resultData[i].children[0].name || '--',
            value: resultData[i].value,
            unit: '个'
          });
        }
        let sum = 0;
        for (let i = 2; i < resultData.length; i++) {
          sum += resultData[i].value;
        }
        this.pointsArr.push({
          name: '其他',
          value: sum,
          unit: '个'
        });
      }
      let opt = drawPie(this.pointsArr, this.colors);
      this.option = opt;
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.initData();
    }, 100);
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
        width: 70%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

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

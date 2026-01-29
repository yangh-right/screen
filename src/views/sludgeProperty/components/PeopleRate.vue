<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="uv_content-legend">
        <div class="water-bar" v-for="(item, index) in data" :key="index">
          <div class="pump-name">
            <span :class="['ico-water', 'ico-water' + (index + 1)]">0{{ index + 1 }}</span
            >{{ item.name }}
          </div>
          <div class="bar-bg">
            <div
              :class="['bar-process', index === 0 ? 'bar-win' : 'bar-fail']"
              :style="{ width: item.pre + '%' }"
            ></div>
          </div>
          <div class="bar-text">
            <span class="bar-num">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';
import { currentPersonnelDealRankingList } from '@/api/sludgeProperty';

export default {
  name: 'PeopleRate',
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
      color: ['#39ACFF', '#66E1DF', '#8F49E5', '#FFC97A', '#4E45F3'],
      data: [
        {
          name: '',
          value: 0,
          unit: '%',
          imgUrl: require('@/assets/img/react1.png')
        },
        {
          name: '',
          value: 0,
          unit: '%',
          imgUrl: require('@/assets/img/react2.png')
        },
        {
          name: '',
          value: 0,
          unit: '%',
          imgUrl: require('@/assets/img/react3.png')
        },
        {
          name: '',
          value: 0,
          unit: '%',
          imgUrl: require('@/assets/img/react4.png')
        },
        {
          name: '',
          value: 0,
          unit: '%',
          imgUrl: require('@/assets/img/react4.png')
        }
      ],
      isShow: false,
      originData: []
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const { status, resultData } = await currentPersonnelDealRankingList();
      if (status === 'complete') {
        this.data.forEach((val, i) => {
          val.name = resultData[i].xaxis;
          val.value = resultData[i].yaxis;
        });
      }
      let list = this.data.map(v => {
        if (v.value) return v.value;
        else return 0;
      });
      let max = Math.max.apply(null, list);
      this.data = this.data.map((item, i) => {
        return {
          pre: max ? (item.value * 100) / max : 0,
          ...item
        };
      });
      this.originData = JSON.parse(JSON.stringify(this.data));
    }
  },
  created() {}
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
  justify-content: center;
  align-items: flex-start;
  .uv_content-legend {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;

    .water-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(12, 71, 125, 0.3);
      margin-top: 10px;

      &:nth-child(2n + 1) {
        background: url(~@assets/img/hz/bar-odd.png) no-repeat;
        background-size: 100% 100%;
      }
      &:nth-child(2n) {
        background: url(~@assets/img/hz/bar-even.png) no-repeat;
        background-size: 100% 100%;
      }

      .pump-name {
        width: 120px;
        font-family: AlibabaPuHuiTi_2_65_Medium, sans-serif;
        font-weight: 500;
        font-size: 16px;
        color: #d9f7ff;
        letter-spacing: 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .ico-water {
          width: 35px;
          height: 38px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ico-water1 {
          background: url(~@assets/img/hz/react1.png) no-repeat;
          font-weight: 400;
          font-size: 16px;
          color: rgba(255, 210, 0, 1);
        }
        .ico-water2 {
          background: url(~@assets/img/hz/react2.png) no-repeat;
          font-weight: 400;
          font-size: 16px;
          color: rgba(37, 234, 255, 1);
        }
        .ico-water3 {
          background: url(~@assets/img/hz/react3.png) no-repeat;
          font-weight: 400;
          font-size: 16px;
          color: rgba(46, 255, 127, 1);
        }
        .ico-water4,
        .ico-water5 {
          background: url(~@assets/img/hz/react4.png) no-repeat;
          font-weight: 400;
          font-size: 16px;
          color: rgba(48, 150, 243, 1);
        }
      }
      .bar-bg {
        width: 200px;
        height: 10px;
        background: #0792f81a;
        position: relative;

        .bar-process {
          height: 8px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .bar-win {
          background-image: linear-gradient(90deg, #673d083d 2%, #ffb01fe8 85%);
        }
        .bar-fail {
          background-image: linear-gradient(90deg, #08506703 9%, #1fdbffe8 85%);
        }
        .bar-win::after {
          content: '';
          width: 32px;
          height: 38px;
          // background: url(~@assets/img/ico_end1.png) no-repeat;
          position: absolute;
          top: -23px;
          right: -16px;
        }
        .bar-fail::after {
          content: '';
          width: 32px;
          height: 38px;
          // background: url(~@assets/img/ico_end2.png) no-repeat;
          position: absolute;
          top: -23px;
          right: -16px;
        }
      }
      .bar-text {
        width: 70px;
        height: 40px;
        background-size: 100% 100%;
        padding: 0px 6px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .bar-num {
          font-family: Bebas, sans-serif;
          line-height: 40px;
          font-size: 17px;
          color: #d5f3ff;
          letter-spacing: 0;
        }
      }
    }
  }
}
</style>

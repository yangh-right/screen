<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <unit-card cardTitle="预测结论">
    <div class="card-inner">
      <div class="misc">
        <div class="name">计划排泥量</div>
        <div class="value">
          <div class="num">{{ miscData }}</div>
          <div class="unit">吨</div>
        </div>
      </div>
      <div class="yield">
        <div class="icons">
          <img
            v-for="item in yieldData"
            :key="item.icon + 'icon'"
            class="icon"
            alt=""
            :src="require(`@/assets/img/smartForecast/${item.icon}.png`)"
          />
        </div>
        <div class="card">
          <div class="card__item" v-for="item in yieldData" :key="item.icon">
            <div class="title" v-html="item.text"></div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { featureStr } from '@/utils/util';
import { predictionConclusion } from '@/api/smartProduct';
import { sludgeDischargePlan } from '@/api/sludgeDischarge';
export default {
  name: 'result',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      miscData: '--',
      yieldData: [
        { text: '进水水量未来', icon: 'inYield' },
        { text: '出水水量未来', icon: 'outYield' },
        { text: '明日', icon: 'rain' }
      ]
    };
  },
  computed: {},
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initData();
          this.fetchData();
        }
      },
      immediate: true
    }
  },
  methods: {
    async initData() {
      let params = { waterPlantId: this.waterPlantId, hour: 24 };
      const { resultData, status } = await predictionConclusion(params);
      if (status === 'complete') {
        let inflowNormalConclusion = resultData?.inflowNormalConclusion || '';
        let normalConclusion = resultData?.normalConclusion || '';
        let abnormalConclusion = resultData?.abnormalConclusion || '';
        let weatherWarning = resultData?.weatherWarning || '';

        let reg = /[1-9]\d*\.?\d*小时/g;
        let reg1 =
          /(晴|多云|阴|阵雨|雷阵雨|雷阵雨伴有冰雹|雨夹雪|小雨|中雨|特大暴雨|大暴雨|大雨|暴雨|阵雪|小雪|中雪|大雪|暴雪|雾|冻雨)/g;

        this.yieldData[0].text = featureStr(inflowNormalConclusion, reg) || '进水水量未来';
        this.yieldData[1].text =
          featureStr(
            normalConclusion && abnormalConclusion
              ? normalConclusion + ',' + abnormalConclusion
              : normalConclusion + abnormalConclusion,
            reg
          ) || '出水水量未来';
        this.yieldData[2].text = featureStr(weatherWarning, reg1) || '明日';
      }
    },
    async fetchData() {
      let { resultData, status, errorMessage } = await sludgeDischargePlan({
        waterPlantId: this.waterPlantId
      });
      if (status === 'complete') {
        this.miscData = resultData?.planSludgeNumToday ?? 0;
      } else {
        console.log(errorMessage);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 8px 0px;
  .misc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    padding: 0 12px 0 70px;
    margin-bottom: 10px;
    background: url('~@/assets/img/smartForecast/result-misc.png') no-repeat;
    background-size: 100% 100%;
    .name {
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #cee6ff;
      letter-spacing: 0;
    }
    .value {
      display: flex;
      align-items: center;
      .num {
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 24px;
        color: #eff4ff;
        letter-spacing: 0;
        text-align: center;
      }
      .unit {
        margin-left: 5px;
        font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
        font-weight: 700;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
  .yield {
    height: 230px;
    display: flex;
    align-items: center;
    .icons {
      background: url('~@/assets/img/smartForecast/result-icon-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 51px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin-right: 10px;
      .icon {
        width: 28px;
        height: 28px;
      }
    }
    .card {
      flex: 1;
      height: 100%;

      &__item {
        background: url('~@/assets/img/smartForecast/result-card.png') no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 70px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        padding: 0 21px;
        &:nth-last-child(1) {
          margin-bottom: 0;
        }

        .title {
          font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
        }
      }
    }
  }
}
</style>

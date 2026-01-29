<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <unit-card cardTitle="阀门控制精度" cardType="3" :showTime="false">
    <div class="card-inner">
      <div class="box">
        <div class="box__item" v-for="pool in dataList" :key="pool.poolName">
          <div class="position">{{ pool.poolName }}</div>
          <div class="data">
            <div class="data__item" v-for="(data, index) in pool.data" :key="data.pointName">
              <div class="point"><gradientShadowText :text="index + 1 + '控制点'"></gradientShadowText></div>
              <div class="name">阀门开度</div>
              <div class="value">{{ data.Stroke_Act }}</div>
              <div class="split"></div>
              <div class="name">曝气流量</div>
              <div class="value">{{ data.Air_Flow }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import uuid from '@/utils/uuid';
import { getRealDataByPointConfigCode } from '@/api/smartProduct';
import { processPointsData, POINTS_CONFIG, POINTS_LIST, getValue } from './data';
import gradientShadowText from '@/components/gradientShadowText';
export default {
  name: 'valvePrecision',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
    gradientShadowText
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pointsList: POINTS_LIST,
      pointsData: [],
      dataList: [
        {
          poolName: '南池',
          data: [
            {
              Stroke_Act: '--%',
              Air_Flow: '--m³/min'
            },
            {
              Stroke_Act: '--%',
              Air_Flow: '--m³/min'
            },
            {
              Stroke_Act: '--%',
              Air_Flow: '--m³/min'
            },
            {
              Stroke_Act: '--%',
              Air_Flow: '--m³/min'
            }
          ]
        },
        {
          poolName: '北池',
          data: [
            {
              Stroke_Act: '--%',
              Air_Flow: '--m³/min'
            },
            {
              Stroke_Act: '--%',
              Air_Flow: '--m³/min'
            },
            {
              Stroke_Act: '--%',
              Air_Flow: '--m³/min'
            },
            {
              Stroke_Act: '--%',
              Air_Flow: '--m³/min'
            }
          ]
        }
      ]
    };
  },

  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true
    }
  },
  created() {},

  methods: {
    initData() {
      this.fetchData();
    },
    async fetchData() {
      if (!this.waterPlantId) return;
      try {
        const results = await this.batchApiCall(this.pointsList, async item => {
          let params = {
            configCode: item.code,
            pumpHouseId: this.waterPlantId
          };
          const res = await getRealDataByPointConfigCode(params);
          return {
            error: false,
            group: item.group,
            ...res,
            ...params
          };
        });

        this.pointsData = results.filter(item => !item.error);
        // this.pointsData = infoData;
        this.handlePointsData();
      } catch (error) {
        this.$message.error('数据加载失败');
        console.error('数据获取失败:', error);
      }
    },
    handlePointsData() {
      this.dataList[0].data = processPointsData(this.getPointsByGroup(POINTS_CONFIG.SOUTH));
      this.dataList[1].data = processPointsData(this.getPointsByGroup(POINTS_CONFIG.NORTH));
      this.dataList = { ...this.dataList };
    },
    async batchApiCall(items, apiCallFn) {
      if (this.loading) return [];
      try {
        this.loading = true;
        const promises = items.map(async item => {
          try {
            return await apiCallFn(item);
          } catch (error) {
            console.error(`处理 ${item.name} 失败:`, error);
            return {
              group: item.group,
              error: true,
              code: uuid()
            };
          }
        });

        return await Promise.all(promises);
      } finally {
        this.loading = false;
      }
    },
    getPointsByGroup(group) {
      return this.pointsData.filter(item => item?.group === group) || [];
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  margin-top: 18px;
  .box {
    height: calc(100% - 18px);
    display: flex;
    &__item {
      flex: 1;
      overflow: hidden;
      display: flex;
      align-items: center;
      &:nth-child(1) {
        margin-right: 30px;
      }
      &:nth-child(2) {
        margin-right: 12px;
      }
      .position {
        display: flex;
        justify-content: center;
        align-items: center;
        writing-mode: vertical-rl;
        height: 100%;
        width: 70px;
        margin-right: 12px;
        font-family: YouSheBiaoTiHei, sans-serif;
        font-size: 18px;
        color: #eff5ff;
        letter-spacing: 0;
        background: url('~@/assets/img/smartProduct/pool.png') no-repeat;
        background-size: 100% 100%;
      }
      .data {
        padding: 13px 6px 20px;
        width: calc(100% - 82px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: url('~@/assets/img/smartProduct/valve-bg.png') no-repeat;
        background-size: 100% 100%;
        &__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          .point {
            width: 104px;
            height: 28px;
            border-radius: 3px 0 0 5px;
            line-height: 28px;
            text-align: center;
            margin-bottom: 18px;
            background: url('~@/assets/img/smartProduct/control-point.png') no-repeat;
            background-size: 100% 100%;
            /deep/.gradient-shadow {
              .text {
                font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
                font-weight: 700;
                letter-spacing: 0;
                font-size: 14px;
                text-shadow: 0 2px 2px #000000ab;
              }
              .text:before {
                /*覆盖文字的颜色*/
                letter-spacing: 0;
                color: #76a1f7;
                -webkit-mask: linear-gradient(to top, #76a1f7 28%, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 79%);
              }
            }
          }
          .name {
            font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #d1e0ff;
            letter-spacing: 0;
            margin-bottom: 4px;
          }
          .value {
            font-family: MiSans-Bold, sans-serif;
            font-weight: 700;
            font-size: 16px;
            color: #eff5ff;
            letter-spacing: 0;
            text-align: center;
          }
          .split {
            width: 100px;
            height: 1px;
            background: url('~@/assets/img/smartProduct/split.png') no-repeat;
            background-size: 100% 100%;
            margin: 15px 0;
          }
        }
      }
    }
  }
}
</style>

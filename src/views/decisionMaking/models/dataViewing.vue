<template>
  <unit-card cardTitle="数据查看" cardType="7">
    <div class="water-quality-dashboard">
      <div class="nav-tabs">
        <div
          v-for="tab in tabsData"
          :key="tab.key"
          :class="['ant-tabs-tab', { 'ant-tabs-tab-active': activeTab === tab.key }]"
          @click="handleTabClick(tab.key)"
        >
          {{ tab.name }}
        </div>
      </div>

      <div class="indicators-grid">
        <div class="indicator-card" v-for="(indicator, index) in indicators" :key="index">
          <div class="value">
            {{ indicator.pointValue }} <span class="unit">{{ indicator.pointUnit }}</span>
          </div>
          <div class="water-effect"></div>
          <div class="parameter">
            {{ indicator.pointMemo }}
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getRealDataByPointConfigCode } from '@/api/smartProduct';

export default {
  name: 'dataViewing',
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
      tabsData: [
        { name: '进水水质', key: 'inflow' },
        { name: '出水水质', key: 'outflow' },
        { name: '进水水量', key: 'base_InstantaneousFlow' },
        { name: '生化池(北池)', key: 'biocycle_tank_n' },
        { name: '生化池(南池)', key: 'biocycle_tank' }
      ],
      activeTab: 'inflow',
      indicators: [
        { name: 'COD', value: 184 },
        { name: 'SS', value: 184 },
        { name: 'NH3-N', value: 184 },
        { name: 'TN', value: 184 },
        { name: 'TP', value: 184 },
        { name: 'PH', value: 184 }
      ]
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.fetchData();
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchData() {
      if (!this.waterPlantId) return;
      let params = {
        configCode: this.activeTab,
        pumpHouseId: this.waterPlantId
      };
      try {
        const { status, resultData } = await getRealDataByPointConfigCode(params);
        if (status === 'complete') {
          this.indicators = [...(resultData || [])];
        }
      } catch (error) {
        console.error('数据获取失败:', error);
      }
    },
    handleTabClick(key) {
      this.activeTab = key;
      this.fetchData();
    }
  }
};
</script>

<style lang="less" scoped>
.water-quality-dashboard {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 10px 12px 0 12px;
  box-sizing: border-box;

  .nav-tabs {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;

    .ant-tabs-tab {
      width: 86px;
      height: 28px;
      line-height: 28px;
      background: url('~@/assets/img/summaryOverview/fir_unchecked.png') no-repeat;
      background-size: 100% 100%;
      border: none;
      margin-right: 0px;
      padding: 0 2px;
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #90a6bd;
      letter-spacing: 0;
      text-align: center;
      cursor: pointer;

      &.ant-tabs-tab-active {
        background: url('~@/assets/img/summaryOverview/fir_selected.png') no-repeat;
        background-size: 100% 100%;
        font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
        font-weight: 600;
        font-size: 14px;
        color: #d9ecff;
        letter-spacing: 0;
        text-align: center;
      }
    }
  }

  .indicators-grid {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    height: calc(100% - 28px);
    overflow-y: auto;
    .indicator-card {
      width: calc(33.33% - 10px);
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      margin-bottom: 18px;

      .value {
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #d9ecff;
        letter-spacing: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .unit {
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #d9ecff;
          letter-spacing: 0;
        }
      }

      .water-effect {
        width: 117px;
        height: 53px;
        background: url('~@/assets/img/summaryOverview/fir_base.png') no-repeat;
        background-size: 100% 100%;
      }

      .parameter {
        width: 100px;
        height: 22px;
        font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #d9ecff;
        letter-spacing: 0;
        text-align: center;
        background: url('~@/assets/img/summaryOverview/fir_text.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 6px;
      }
    }
  }
}
</style>

<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="item" v-for="(item, index) in tableData" :key="index">
        <div class="icons"></div>
        <div class="right">
          <div class="name">{{ item.pointMemo }}</div>
          <div class="value">{{ item.pointValue }}</div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getRealDataByPointConfigCode } from '@/api/energyAnalyse';
export default {
  name: 'temperatureAlarm',
  components: {
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
      url: '',
      isAudio: false,
      activeDeviceTimer: null,
      tableData: []
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
          this.startIntervalTimer();
        }
      }
    }
  },
  deactivated() {
    this.clearIntervalTimer();
  },
  beforeDestroy() {
    this.clearIntervalTimer();
  },

  methods: {
    // 开启记时器
    startIntervalTimer() {
      this.clearIntervalTimer();
      // 表格测点数据查询
      this.activeDeviceTimer = setInterval(() => {
        if (this.waterPlantId) this.initData();
      }, 20 * 1000);
    },

    // 清除定时器
    clearIntervalTimer() {
      if (this.activeDeviceTimer) {
        clearInterval(this.activeDeviceTimer);
      }
    },

    async initData() {
      let params = {
        pumpHouseId: this.waterPlantId,
        configCode: 'jxb-realData',
        type: 0
      };
      const res = await getRealDataByPointConfigCode(params);
      if (res.status === 'complete' && Array.isArray(res.resultData)) {
        this.tableData = res.resultData.map(item => {
          return {
            ...item,
            pointValue: item.pointValue.toFixed(2)
          };
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 20px);
  position: relative;
  padding: 4px 6px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  .item {
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    width: 32%;
    height: 47px;
    margin-bottom: 15px;
    margin-right: 4px;
    .icons {
      width: 10px;
      height: 40px;
      background: url('~@/assets/img/real_data_tip.png') no-repeat;
      background-size: 100% 100%;
    }
    .right {
      width: calc(100% - 24px);
      margin-left: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .name {
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #d9f7ff;
        letter-spacing: 0;
      }
      .value {
        margin-top: 4px;
        font-weight: 600;
        font-size: 18px;
        color: #e0f2ff;
        letter-spacing: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="table-block">
        <div class="table-head">
          <div class="num">序号</div>
          <div class="station">站点</div>
          <div class="remark">设备</div>
          <div class="remark">温度(˚C)</div>
          <div class="time">时间</div>
          <div class="point">监测点</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="num">{{ i + 1 }}</div>
            <div class="station">{{ item.stationName }}</div>
            <div class="remark">{{ item.deviceName }}</div>
            <div class="opertion">{{ item.temperature }}</div>
            <div class="time">{{ item.time }}</div>
            <div class="point">{{ item.pointName }}</div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getTemperatureMeasurementPage } from '@/api/energyAnalyse';
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
      tableData: []
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  methods: {
    async initData() {
      let params = {
        waterPlantId: this.waterPlantId,
        stationName: '',
        page: {
          size: 9999,
          current: 1
        }
      };
      const res = await getTemperatureMeasurementPage(params);
      if (res.status === 'complete') {
        this.tableData = res.resultData.records || [];
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
  padding: 0 4px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .table-block {
    width: 100%;
    height: 100%;
    padding-top: 6px;
    box-sizing: border-box;
    div {
      font-family: PingFangSC, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #b2dfff;
      letter-spacing: 0;
    }

    .table-head {
      height: 34px;
      display: flex;
      align-items: center;
      background: url('~@/assets/img/warnPredict/alarm_header.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
      font-size: 14px;

      div {
        background: url('~@/assets/img/warnPredict/arrow-bottom.png') no-repeat;
        background-size: 9px 6px;
        background-position: bottom center;
        padding: 0 !important;
        text-align: center;
        height: 100%;
        line-height: 34px;
      }
      .num {
        flex: 0.5;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .station {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }
      .time {
        flex: 1.5;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }
      .point {
        flex: 1.5;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }
      .remark {
        flex: 1.2;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .opertion {
        flex: 1.5;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .table-body {
      width: 100%;
      height: calc(100% - 34px);
      overflow: auto;

      .table-tr {
        height: 36px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/hz/table-de.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 4px;
        .num {
          flex: 0.6;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .station {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .point {
          flex: 1.5;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .time {
          flex: 1.5;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .remark {
          flex: 1.2;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .opertion {
          flex: 1.5;
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: #ff4a28;
        }
      }
    }
  }
}
</style>

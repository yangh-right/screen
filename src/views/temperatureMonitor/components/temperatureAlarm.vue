<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="table-block">
        <div class="table-head">
          <div class="img-info">设备名称</div>
          <div class="remark">报警值</div>
          <div class="opertion">时间</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="img-info">{{ item.deviceName }}</div>
            <div class="remark">{{ item.temperature }}℃</div>
            <div class="opertion">
              {{ item.time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getTemperatureAlarm } from '@/api/pumpHousePage';
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
        page: {
          current: 1,
          size: 9999
        }
      };
      const res = await getTemperatureAlarm(params);
      if (res.status === 'complete') {
        this.tableData = res.resultData;
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
  padding: 0 12px;
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
      .img-info {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .remark {
        flex: 1;
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
        .img-info {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .remark {
          flex: 1;
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
        }
      }
    }
  }
}
</style>

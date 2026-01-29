<!--
 * @Description:
 * @version:
 * @Author: fengtaotao
 * @Date: 2025-01-07 13:55:52
 * @LastEditors: wangyr
 * @LastEditTime: 2025-02-13 15:19:00
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div v-if="tableData.length === 0">
        <div class="table-head">
          <div class="img-info">报警名称</div>
          <div class="opertion">报警时间</div>
        </div>
      </div>
      <div v-for="(item, index) in tableData" class="item" :key="index">
        <div class="name">{{ item.alarmName }}</div>
        <div class="right">
          <!-- <div class="icons"></div> -->
          <div class="status">{{ item.startTime }}</div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getAlarmPage } from '@/api/warnPredict.js';
import moment from 'moment';
export default {
  name: 'temperatureRanking',
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
        stationIds: [this.waterPlantId],
        pageSize: 99999999,
        // startTime: moment().format('YYYY-MM')+'-01',
        startTime: '2024-10-01',
        endTime: moment().format('YYYY-MM-DD'),
        orderBy: 'startTime',
        alarmStatus: '1',
        alarmTypeCodes: [
          'water_purification_上料急停按钮报警',
          'water_purification_变频器报警',
          'water_purification_安全门报警'
        ]
      };
      this.tableData = [];
      const res = await getAlarmPage(params);
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
  height: calc(100% - 10px);
  position: relative;
  padding: 4px 12px 2px 2px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: auto;
  // justify-content: space-between;
  .table-head {
    height: 34px;
    display: flex;
    align-items: center;
    color: #b2dfff;
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
    .time {
      flex: 2;
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
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // flex-direction: column;
    margin-bottom: 17px;
    padding: 0 32px;
    background: url('~@/assets/img/alarm_bg.png') no-repeat;
    background-size: 100% 100%;
    .name {
      display: flex;
      align-items: center;
      height: 32px;
      font-family: PingFangSC-Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #d9f7ff;
      letter-spacing: 0;
    }
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      .icons {
        margin-right: 4px;
        height: 20px;
        width: 20px;
        background: url('~@/assets/img/alarm_status.png') no-repeat;
        background-size: 100% 100%;
      }
      .status {
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #d9f7ff;
        letter-spacing: 0;
      }
    }
  }
}
</style>

<!--
 * @Author: wangyr
 * @Date: 2023-05-30 19:52:35
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-10 14:20:52
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="card-inner">
      <div class="table-box">
        <div class="table-head">
          <div class="index">序号</div>
          <div class="target">报警名称</div>
          <div class="timePeriod">报警值</div>
          <div class="time">报警时间</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="index">{{ i + 1 }}</div>
            <div :class="true ? 'target color-red' : 'target color-green'">{{ item.alarmName }}</div>
            <div class="timePeriod">{{ item.startData }}{{ item.pointUnit }}</div>
            <div class="time">{{ item.startTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { alarmHandlerData } from '@/api/warnPredict';

export default {
  name: 'RealAlarm',
  components: {},
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
          this.initEarlyWarnData();
        }
      }
    }
  },
  methods: {
    async initEarlyWarnData() {
      this.data = [];
      this.isLoading = true;
      let param = {
        alarmTypeCode: 'water_purification_huanjing',
        alarmLevels: ['1', '2', '3', '4'],
        stationIds: [this.waterPlantId],
        currentPage: 1,
        pageSize: 999
      };
      let { status, resultData } = await alarmHandlerData(param);
      if (status === 'complete') {
        this.tableData = resultData.records || [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px 15px 0;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0 12px;
    box-sizing: border-box;

    .table-box {
      width: 100%;
      height: 100%;

      .table-head {
        height: 34px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/warnPredict/alarm_header.png') no-repeat;
        background-size: 100% 100%;

        div {
          line-height: 34px;
          font-family: PingFangSC, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #b2dfff;
          letter-spacing: 0;
          background: url('~@/assets/img/warnPredict/arrow-bottom.png') no-repeat;
          background-size: 9px 6px;
          background-position: bottom center;
          padding: 0 !important;
          text-align: center;
        }
        .index {
          flex-basis: 40px;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .target {
          flex-basis: 120px;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .time {
          flex-grow: 1;
          text-indent: 30px;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .timePeriod {
          flex-grow: 1;
          text-indent: 30px;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .table-body {
        width: 100%;
        height: calc(100% - 64px);
        overflow: auto;
        text-align: center;
        font-weight: 500;
      }
      .table-tr {
        height: 31px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/hz/alarm-row.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 4px;

        .index {
          flex-basis: 38px;
          font-family: Oswald-Bold, sans-serif;
          text-align: center;
          font-size: 12px;
          color: #ffffff;
        }

        .target {
          flex-basis: 120px;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .color-red {
          color: #ff4d4f;
        }
        .color-green {
          color: #00e676;
        }
        .time {
          flex-grow: 1;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 700;
        }
        .timePeriod {
          flex-grow: 1;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
        }
      }
    }
  }
}
</style>

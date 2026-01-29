<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-05 16:00:52
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="table-block">
        <dv-scroll-board :config="config" ref="scrollBoard" style="width: 100%; height: 197px"></dv-scroll-board>
      </div>
    </div>
  </div>
</template>

<script>
import { genChart, mutiLineOption } from '../model/chart';
import { getAlarmPage } from '@/api/warnPredict.js';

export default {
  name: 'InWaterQuality',
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
      cardTitle: '进水水质',
      currentPoint: 'jsc_COD',
      config: {
        header: ['设备名称', '运行时间', '预警控制值', '报警名称'],
        data: [],
        columnWidth: [150, 80, 100, 150],
        rowNum: 4,
        headerHeight: 30,
        align: ['center', 'center', 'center', 'left']
      }
    };
  },
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let data = {
        alarmTypeCode: 'water_purification_running_time_yujing',
        status: '1',
        pageSize: 999999
      };
      const res = await getAlarmPage(data);
      if (res.status === 'complete') {
        res.resultData.records.forEach(item => {
          this.config.data.push([item.deviceName, item.lastTime, item.maxData, item.alarmName]);
        });
      }
      this.$refs['scrollBoard'].updateRows(this.config.data);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.dv-scroll-board .rows .row-item {
  .ceil:nth-child(2) {
    color: #ff7272;
  }
  .ceil:nth-child(4) {
    padding-left: 18px !important;
    background: url('~@/assets/img/warnPredict/alarm.png') no-repeat;
    background-size: 16px 16px;
    background-position: left;
  }
}
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px;
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
  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;

    .chart-btns {
      padding: 8px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      position: absolute;
      top: -45px;
      right: -20px;
      justify-content: space-between;
      .point-btn {
        width: calc(25% - 6px);
        height: 34px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;
      }
      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .table-block {
      width: 100%;
      height: 177px;
      padding-top: 6px;
      overflow: hidden;
      box-sizing: border-box;

      /deep/.dv-scroll-board .header {
        font-size: 14px !important;
        height: 33px;
        background: url('~@/assets/img/hz/table-header.png') no-repeat;
        background-size: 100% 100%;
        background-color: transparent !important;
      }
      /deep/.dv-scroll-board .header .header-item {
        padding: 0 !important;
        text-align: center;
      }
      /deep/.dv-scroll-board .rows .row-item {
        height: 30px !important;
        line-height: 30px !important;
        margin-top: 4px;
        background: url('~@/assets/img/hz/table-de.png') no-repeat;
        background-size: 100% 100%;
        background-color: transparent !important;
      }
      /deep/.dv-scroll-board .rows .ceil {
        // padding: 0 !important;
      }
      /deep/.dv-scroll-board .rows .index {
        display: inline-block;
        width: 27px;
        height: 27px;
        background: url('~@/assets/img/hz/first.png') no-repeat;
        background-size: 100% 100%;
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 14px;
        color: #f5faff;
        text-align: center;
        background-color: transparent !important;
      }
    }
  }
}
</style>

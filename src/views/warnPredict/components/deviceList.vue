<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-14 09:26:02
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="table-block" id="deviceList">
        <dv-scroll-board
          :config="config"
          ref="scrollBoard"
          style="width: 100%; height: 476px"
          @click="handleCellClick"
        ></dv-scroll-board>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { alarmHandlerData } from '@/api/warnPredict.js';

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
      dataList: [],
      config: {
        header: ['序号', '预警名称', '预警状态'],
        data: [],
        columnWidth: [60, 180, 120],
        waitTime: 10000,
        rowNum: 13,
        headerHeight: 30,
        align: ['center', 'center', 'center']
      }
    };
  },
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    handleCellClick(cellData) {
      let rowIndex = cellData.rowIndex;
      let record = this.dataList[rowIndex];
      this.$emit('cell-click', record.alarmHandlerDataId);

      this.$nextTick(() => {
        this.handleCellStyle(rowIndex);
      });
    },
    async initData() {
      let data = {
        alarmTypeCode: 'water_purification_zjjc',
        ruleType: '3',
        currentPage: 1,
        pageSize: 9999,
        endTime: moment().format('YYYY-MM-DD') + ' 23:59:59',
        startTime: moment().subtract(3, 'month').format('YYYY-MM-DD') + ' 00:00:00'
      };
      const res = await alarmHandlerData(data);
      if (res.status === 'complete') {
        this.dataList = res.resultData.records;
        res.resultData.records.forEach((item, i) => {
          this.config.data.push([
            i + 1,
            item.alarmName,
            item.alarmStatus === 0
              ? '<span class="alarm-off">已结束</span>'
              : '<span class="alarm-online">预警中</span>'
          ]);
        });
      }
      this.$refs['scrollBoard'].updateRows(this.config.data);
      this.$emit('cell-click', this.dataList[0].alarmHandlerDataId);
      this.$nextTick(() => {
        this.handleCellStyle();
      });
    },
    handleCellStyle(idx = 0) {
      let elements = document.querySelectorAll('#deviceList .row-item');
      elements.forEach((el, i) => {
        if (i === idx) {
          el.classList.add('row-item-select');
        } else {
          el.classList.remove('row-item-select');
        }
      });
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
    padding: 15px 12px;
    height: 24px;
    background: url('~@/assets/img/hz/predict-stitle.png') no-repeat;
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
    height: calc(100% - 30px);
    position: relative;
    .table-block {
      width: 100%;
      height: 476px;
      padding-top: 6px;
      overflow: hidden;
      box-sizing: border-box;

      /deep/.dv-scroll-board .header {
        font-size: 14px !important;
        height: 33px;
        background: url('~@/assets/img/warnPredict/alarm_header.png') no-repeat;
        background-size: 100% 100%;
        background-color: transparent !important;
      }
      /deep/.dv-scroll-board .header .header-item {
        background: url('~@/assets/img/warnPredict/arrow-bottom.png') no-repeat;
        background-size: 9px 6px;
        background-position: bottom center;
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
      /deep/.dv-scroll-board .rows .row-item-select {
        height: 30px !important;
        line-height: 30px !important;
        margin-top: 4px;
        background: url('~@/assets/img/hz/table-de-select.png') no-repeat;
        background-size: 100% 100%;
        background-color: transparent !important;
      }
      /deep/.alarm-off {
        display: block;
        color: #aaa9a9;
        background: url('~@/assets/img/warnPredict/history_alarm.png') no-repeat;
        background-size: 18px 18px;
        background-position: left;
      }
      /deep/.alarm-online {
        display: block;
        color: #ff7272;
        background: url('~@/assets/img/warnPredict/in_alarm.png') no-repeat;
        background-size: 18px 18px;
        background-position: left;
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

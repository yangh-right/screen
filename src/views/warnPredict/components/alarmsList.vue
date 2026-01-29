<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-11 13:39:32
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <a-select :value="dataSelect" dropdownClassName="select__list" class="select__block" @change="handleDate">
      <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
      <a-select-option value="thirty">近3天</a-select-option>
      <a-select-option value="seven">近1天</a-select-option>
    </a-select>
    <div class="card-inner">
      <div class="table-block">
        <dv-scroll-board :config="config" ref="scrollBoard" style="width: 100%; height: 197px"></dv-scroll-board>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { alarmHandlerData } from '@/api/warnPredict.js';

export default {
  name: 'alarmsList',
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
      pointsArr: [],
      dataSelect: 'thirty',
      config: {
        header: ['报警类型', '报警名称', '报警状态', '报警等级', '开始时间', '结束时间'],
        data: [],
        columnWidth: [120, 200, 120, 100, 150, 190],
        rowNum: 7,
        headerHeight: 30,
        align: ['center', 'center', 'center', 'center', 'center', 'left']
      },
      dataVal: {
        seven: [moment().subtract(1, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        thirty: [moment().subtract(3, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    handleDate(val) {
      this.dataSelect = val;
      this.initData();
    },
    async initData() {
      let paramsData = this.dataVal[this.dataSelect];
      let params = {
        stationIds: [this.waterPlantId],
        pageSize: 99999999,
        startTime: paramsData[0],
        endTime: paramsData[1],
        orderBy: 'startTime'
      };
      let arr = ['一', '二', '三', '四'];
      const { status, resultData } = await alarmHandlerData(params);
      if (status === 'complete') {
        this.config.data = resultData.records.map(item => [
          item.alarmTypeName,
          item.alarmName,
          item.alarmStatus === 0 ? '<span class="alarm-off">已结束</span>' : '<span class="alarm-online">报警中</span>',
          `${arr[item.alarmLevel - 1]}级`,
          moment(item.startTime).format('HH:mm:ss'),
          item.endTime ? moment(item.endTime).format('HH:mm:ss') : '正在报警中'
        ]);
        this.$refs['scrollBoard'].updateRows(this.config.data);
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .select__block {
  background: url('~@/assets/img/hz/ac-point.png') no-repeat;
  background-size: 100% 100%;
  margin-left: 12px;
  width: 124px;
  height: 28px;

  margin-right: 12px;

  .ant-select-selection {
    background: transparent;
    border: none;
  }

  .ant-select-selection__rendered {
    height: 28px;
    line-height: 28px;
    text-align: center;
    .ant-select-selection-selected-value {
      float: unset;
      font-family: SourceHanSansCN-Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
    }
  }
}
.card-inner {
  margin-left: 8px;
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  // padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .table-block {
    width: 100%;
    height: 255px;
    padding-top: 6px;
    box-sizing: border-box;
    /deep/ .dv-scroll-board {
      height: 230px !important;
      overflow-x: auto;
      overflow-y: hidden;
    }

    /deep/.dv-scroll-board .header {
      width: 580px;
      height: 36px;
      background: url('~@/assets/img/warnPredict/alarm_header.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
      font-size: 14px;
    }
    /deep/.dv-scroll-board .header .header-item {
      background: url('~@/assets/img/warnPredict/arrow-bottom.png') no-repeat;
      background-size: 9px 6px;
      background-position: bottom center;
      padding: 0 !important;
      text-align: center;
    }
    /deep/.dv-scroll-board .rows {
      width: 580px;
    }
    /deep/.dv-scroll-board .rows .row-item {
      margin-top: 4px;
      background: url('~@/assets/img/hz/table-de.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
    }
    /deep/.dv-scroll-board .rows .ceil {
      padding: 0px;
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
    /deep/.dv-scroll-board .rows .ceil:nth-child(2) {
      font-size: 12px;
      text-align: center;
      white-space: normal;
    }
    /deep/.dv-scroll-board .rows .ceil:nth-child(3) {
      margin-left: 6px;
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
    /deep/.dv-scroll-board .rows .ceil:nth-child(5) {
      font-size: 12px;
      text-align: center;
    }
    /deep/.dv-scroll-board .rows .ceil:nth-child(6) {
      font-size: 12px;
      text-align: center;
      white-space: normal;
      // line-height: 1.2 !important;
    }
    /deep/.dv-scroll-board .rows .ceil:nth-child(7) {
      font-size: 12px;
      text-align: center;
      white-space: normal;
      line-height: 1.2 !important;
    }
  }
  /deep/.process-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .process-bg {
      width: 86px;
      height: 4px;
      border-radius: 4px;
      margin-right: 12px;
      background: #28406c;
      position: relative;
      overflow: hidden;

      .process-pre {
        width: 50%;
        height: 4px;
        background-image: linear-gradient(90deg, #33d3ff 0%, #3388ff 98%);
        border-radius: 4.2px;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .process-num {
      font-family: MiSans-Medium, sans-serif;
      font-weight: 500;
      font-size: 14px;
      color: #f5faff;
      letter-spacing: 0;
    }
  }
}
</style>
<style lang="less">
.select__list {
  .ant-select-dropdown-menu {
    background: #042d53;
    background-size: 100% 100%;
    padding: 0;
    .ant-select-dropdown-menu-item {
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      color: #7aaed4;
    }
    .ant-select-dropdown-menu-item:hover {
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      box-shadow: inset 20px 0 20px 20px #005cad;
    }
  }
}
</style>

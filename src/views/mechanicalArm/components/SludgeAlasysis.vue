<template>
  <unit-card :cardTitle="title" :showTime="false">
    <a-select :value="dataSelect" dropdownClassName="select__list" class="select__block" @change="handleDate">
      <a-icon slot="suffixIcon" style="font-size: 14px; color: #6ca6f5" type="caret-down" />
      <a-select-option value="echarts">分析图</a-select-option>
      <a-select-option value="details">详情</a-select-option>
    </a-select>
    <div class="card-inner">
      <div v-show="dataSelect === 'details'" class="table-block">
        <div class="table-head">
          <div class="img-info">序号</div>
          <div class="time">时间</div>
          <div class="opertion">回放</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="img-info">{{ i + 1 }}</div>
            <div class="time">{{ item.startTime || '' }}</div>
            <div class="opertion" @click="openVideo(item)">查看</div>
          </div>
        </div>
      </div>
      <div v-show="dataSelect === 'echarts'" class="echart-block">
        <div id="sludge_out"></div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { genChart, mutiLineOption } from '../model/chart';
import { getAlarmPage } from '@/api/warnPredict.js';
import { queryPointHistoryData } from '@/api/energyAnalyse.js';

export default {
  name: 'SludgeAlasysis',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  inject: ['openVideoModal'],
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
      dataSelect: 'echarts',
      tableData: [],
      chartData: [],
      dateRange: {
        start: moment().format('YYYY-MM-01'),
        end: moment().format('YYYY-MM-DD')
      }
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
          this.initChartData();
        }
      }
    }
  },
  methods: {
    handleDate(val) {
      this.dataSelect = val;
      const actions = {
        echarts: this.initChartData,
        details: this.initData
      };
      actions[val]?.();
    },
    async initData() {
      const params = {
        stationIds: [this.waterPlantId],
        pageSize: 99999999,
        startTime: this.dateRange.start,
        endTime: this.dateRange.end,
        orderBy: 'startTime',
        alarmTypeCodes: ['water_purification_ql']
      };

      try {
        const res = await getAlarmPage(params);
        this.tableData = res.status === 'complete' ? res.resultData.records || [] : [];
      } catch (error) {
        console.error('获取数据失败:', error);
        this.tableData = [];
      }
    },
    openVideo(data) {
      this.openVideoModal(data.startTime);
    },
    async initChartData() {
      const params = {
        waterPlantId: this.waterPlantId,
        configCode: 'jxb-ql',
        startDateTime: this.dateRange.start,
        endDateTime: this.dateRange.end,
        timePeriod: 'Days'
      };

      try {
        const res = await queryPointHistoryData(params);
        if (res.status === 'complete' && res.resultData) {
          const chartData = res.resultData;
          const unit = chartData[0]?.unit || '';
          const xData = chartData[0]?.dataAndTimeList.map(v => moment(v.date).format('DD')) || [];
          const yData = chartData.map(item => ({
            name: item.pointMemo,
            data: item.dataAndTimeList.map(v => v.pv)
          }));

          genChart('sludge_out', mutiLineOption(unit, yData, xData), true);
        }
      } catch (error) {
        console.error('获取图表数据失败:', error);
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
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
    }
  }
}
.card-inner {
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding: 0 4px;
  box-sizing: border-box;
  display: flex;
  .table-block {
    width: 100%;
    height: 100%;
    padding-top: 6px;
    box-sizing: border-box;
    margin-top: -15px;
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
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
          .image {
            cursor: pointer;
            width: 32px;
          }
        }
        .time {
          flex: 2;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .opertion {
          flex: 1;
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-family: AlibabaPuHuiTi_2_65_Medium, sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #2efffe;
          text-align: left;
          cursor: pointer;
        }
      }
    }
  }
  .echart-block {
    width: 100%;
    height: 100%;
    #sludge_out {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

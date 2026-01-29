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
          <div class="remark">报警名称</div>
          <div class="remark">时间</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="img-info">{{ i + 1 }}</div>
            <div class="remark">{{ item.alarmName }}</div>
            <div class="remark">{{ item.startTime || '' }}</div>
          </div>
        </div>
      </div>
      <div v-show="dataSelect === 'echarts'" class="echart-block">
        <div id="carbon_out"></div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { genChart, mutiLineOption } from '../model/chart';
import { getAlarmPage } from '@/api/warnPredict.js';
import { queryPointHistoryData } from '@/api/energyAnalyse.js';
import moment from 'moment';
export default {
  name: 'carbonDosage',
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
      dataSelect: 'echarts',
      tableData: [],
      chartData: []
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
      if (val === 'echarts') {
        this.initChartData();
      }
      if (val === 'details') {
        this.initData();
      }
    },
    async initData() {
      let params = {
        stationIds: [this.waterPlantId],
        pageSize: 99999999,
        startTime: moment().format('YYYY-MM') + '-01',
        endTime: moment().format('YYYY-MM-DD'),
        orderBy: 'startTime',
        alarmTypeCodes: ['water_purification_码垛料框缺料报警']
      };
      const res = await getAlarmPage(params);
      if (res.status === 'complete') {
        this.tableData = res.resultData.records || [];
      }
    },
    async initChartData() {
      let params = {
        waterPlantId: this.waterPlantId,
        configCode: 'jxb-qlbj',
        startDateTime: moment().format('YYYY-MM') + '-01',
        endDateTime: moment().format('YYYY-MM-DD'),
        timePeriod: 'Days'
      };
      this.chartData = [];
      let unit = '';
      let xData = [];
      let yData = [];
      const res = await queryPointHistoryData(params);
      if (res.status === 'complete') {
        this.chartData = res.resultData || [];
        this.chartData.forEach((item, i) => {
          if (i === 0) {
            unit = item.unit;
            xData = item.dataAndTimeList.map(v => {
              return moment(v.date).format('DD');
            });
          }
          yData.push({
            name: item.pointMemo,
            data: item.dataAndTimeList.map(v => v.pv)
          });
        });
      }
      let opt = mutiLineOption(unit, yData, xData);
      genChart('carbon_out', opt, true);
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
        flex: 0.8;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .remark {
        flex: 1.5;
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
          flex: 0.8;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .remark {
          flex: 1.5;
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
          color: #0de647;
        }
      }
    }
  }
  .echart-block {
    width: 100%;
    height: 100%;
    #carbon_out {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<template>
  <unit-card :cardTitle="title">
    <div class="content-spin">
      <div class="table-block">
        <dv-scroll-board :config="config" ref="scrollBoard" style="width: 100%; height: 260px"></dv-scroll-board>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import UnitCard from './UnitCard';
import { ticketAnalysisReport } from '@/api/sludgeProperty.js';

export default {
  name: 'OrderTable',
  components: {
    UnitCard
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
      cardTitle: '进水水质',
      currentPoint: 'jsc_COD',
      config: {
        header: [
          '时间',
          '工单总数',
          '已完结工单',
          '废止工单',
          '超时流程',
          '超时节点',
          '延期次数',
          '转派次数',
          '退回次数',
          '挂起次数'
        ],
        data: [],
        columnWidth: [140, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90],
        rowNum: 5,
        headerHeight: 36,
        index: false,
        align: [
          'center',
          'center',
          'center',
          'center',
          'center',
          'center',
          'center',
          'center',
          'center',
          'center',
          'center'
        ]
      }
    };
  },
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData(item) {
      let data = {
        typeList: [],
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
        dateType: 'day',
        page: {
          current: 1,
          size: 999999
        },
        SysCode: 'water_purification'
      };
      const { status, resultData } = await ticketAnalysisReport(data);
      if (status === 'complete') {
        resultData.records?.forEach(item => {
          this.config.data.push([
            item.date,
            item.addTicket,
            item.doneTicket,
            item.closeTicket,
            item.timeoutTicket,
            item.timeoutStep,
            item.delayTicket,
            item.assignTicket,
            item.returnTicket,
            item.hangTicket
          ]);
        });
        this.$refs['scrollBoard'].updateRows(this.config.data);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content-spin {
  width: 100%;
  height: calc(100% - 50px);
  position: relative;

  .table-block {
    width: 100%;
    height: 260px;
    padding-top: 6px;
    box-sizing: border-box;

    /deep/.dv-scroll-board .header {
      height: 33px;
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
    /deep/.dv-scroll-board .rows .row-item {
      height: 36px !important;
      line-height: 36px !important;
      margin-top: 8px;
      background: url('~@/assets/img/hz/table-de.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
    }
    /deep/.dv-scroll-board .rows .ceil {
      padding: 0 !important;
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
</style>

<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-25 16:16:09
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="table-block">
        <dv-scroll-board :config="config" ref="scrollBoard"></dv-scroll-board>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { baseAnalysis, basic } from '@/api/deviceManager.js';

export default {
  name: 'DeviceStatus',
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
      deviceObj: {
        createTicket: '设备保养工单数',
        finishTicket: '保养工单完成数',
        finishTicketRate: '计划保养工单完成比例',
        waitAcceptDuration: '保养工单平均等待时长'
      },
      config: {
        data: [],
        columnWidth: [150, 60, 105, 105],
        rowNum: 5,
        headerHeight: 30,
        align: ['center', 'center', 'center', 'center']
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let data = {
        dateType: 'day',
        dateRangeType: 'dayRange',
        dateUnit: 'M',
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        typeList: ['zhjs-sbby']
      };
      const { status, resultData } = await baseAnalysis(data);
      if (status === 'complete') {
        resultData.forEach(item => {
          item.name = this.deviceObj[item.countsType];
          if (item.countsType === 'finishTicketRate') item.unit = '%';
          if (item.name) this.pointsArr.push(item);
        });
      }
      const res = await basic(data);
      if (res.status === 'complete') {
        let val = res.resultData.waitAcceptDuration;
        this.pointsArr.push({
          chainComparison: val.TlastCycleRate,
          counts: val.nowCycl,
          countsType: 'waitAcceptDuration',
          yearOnYear: val.lastYearRate,
          name: '维修工单平均等待时长 ',
          unit: 'min'
        });
      }
      this.pointsArr.forEach(item => {
        this.config.data.push([
          item.name,
          `<span class="repaire-num">${item.counts || 0}</span><span class="repaire-label">${item.unit || '个'}</span>`,
          `<span class="repaire-label">同比</span><span class="repaire-num">${
            item.yearOnYear || 0
          }</span><span class="arrow-up"></span>`,
          `<span class="repaire-label">环比</span><span class="repaire-num">${
            item.chainComparison || 0
          }</span><span class="arrow-down"></span>`
        ]);
      });
      this.$refs['scrollBoard'].updateRows(this.config.data);
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 16px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .table-block {
    width: 100%;
    height: 230px;
    padding-top: 12px;
    box-sizing: border-box;

    /deep/.dv-scroll-board .header .header-item {
      padding: 0 !important;
    }
    /deep/.dv-scroll-board .rows .row-item {
      height: 42px !important;
      line-height: 42px !important;
      margin-bottom: 12px;
      background: url('~@/assets/img/hz/repaire-row.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
    }
    /deep/.dv-scroll-board .rows .ceil {
      padding: 0 !important;
    }
    /deep/.dv-scroll-board .rows .index {
    }
  }
  /deep/.repaire-num {
    font-family: MiSans-Medium, sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
  }
  /deep/.repaire-label {
    font-family: MiSans-Medium, sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #88afe0;
    letter-spacing: 0;
    text-align: center;
    margin-right: 3px;
  }
  /deep/.arrow-up {
    display: inline-block;
    width: 11px;
    height: 17px;
    background: url('~@/assets/img/hz/arrow-up.png') no-repeat;
    background-size: 100% 100%;
    margin-left: 3px;
    vertical-align: text-top;
  }
  /deep/.arrow-down {
    display: inline-block;
    width: 11px;
    height: 17px;
    background: url('~@/assets/img/hz/arrow-down.png') no-repeat;
    background-size: 100% 100%;
    margin-left: 3px;
    vertical-align: text-top;
  }
}
</style>

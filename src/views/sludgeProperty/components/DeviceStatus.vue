<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 10:42:28
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="true">
    <div class="card-inner">
      <div class="table-block">
        <dv-scroll-board :config="config" style="width: 100%; height: 196px"></dv-scroll-board>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';

export default {
  name: 'DeviceStatus',
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
      pointsArr: [],
      config: {
        data: [
          [
            '计划保养工单数',
            '<span class="repaire-num">20</span><span class="repaire-label">个</span>',
            `<span class="repaire-label">同比</span><span class="repaire-num">27%</span><span class="arrow-up"></span>`,
            `<span class="repaire-label">环比</span><span class="repaire-num">0.2%</span><span class="arrow-down"></span>`
          ],
          [
            '临时保养工单数',
            '<span class="repaire-num">20</span><span class="repaire-label">个</span>',
            `<span class="repaire-label">同比</span><span class="repaire-num">27%</span><span class="arrow-up"></span>`,
            `<span class="repaire-label">环比</span><span class="repaire-num">0.2%</span><span class="arrow-down"></span>`
          ],
          [
            '保养工单完成数',
            '<span class="repaire-num">20</span><span class="repaire-label">个</span>',
            `<span class="repaire-label">同比</span><span class="repaire-num">27%</span><span class="arrow-up"></span>`,
            `<span class="repaire-label">环比</span><span class="repaire-num">0.2%</span><span class="arrow-down"></span>`
          ],
          [
            '计划保养工单完成比例',
            '<span class="repaire-num">90</span><span class="repaire-label">%</span>',
            `<span class="repaire-label">同比</span><span class="repaire-num">27%</span><span class="arrow-up"></span>`,
            `<span class="repaire-label">环比</span><span class="repaire-num">0.2%</span><span class="arrow-down"></span>`
          ],
          [
            '保养工单平均处理时长',
            '<span class="repaire-num">90</span><span class="repaire-label">%</span>',
            `<span class="repaire-label">同比</span><span class="repaire-num">27%</span><span class="arrow-up"></span>`,
            `<span class="repaire-label">环比</span><span class="repaire-num">0.2%</span><span class="arrow-down"></span>`
          ]
        ],
        columnWidth: [140, 60, 100, 100],
        rowNum: 5,
        headerHeight: 30,
        align: ['center', 'center', 'center', 'center']
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    initData() {}
  },
  created() {},
  mounted() {
    this.initData();
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 34px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .table-block {
    width: 100%;
    height: 218px;
    padding-top: 6px;
    box-sizing: border-box;

    /deep/.dv-scroll-board .header .header-item {
      padding: 0 !important;
    }
    /deep/.dv-scroll-board .rows .row-item {
      height: 30px !important;
      line-height: 30px !important;
      margin-top: 9px;
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
    font-family: MiSans-Bold, sans-serif;
    font-weight: 700;
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

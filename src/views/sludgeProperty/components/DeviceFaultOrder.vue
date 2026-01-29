<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="true">
    <div class="card-inner">
      <div class="table-block">
        <dv-scroll-board :config="config" style="width: 100%; height: 197px"></dv-scroll-board>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';

export default {
  name: 'DeviceFaultOrder',
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
        header: ['设备名称', '故障次数', '维检进度'],
        data: [
          [
            '更换驱动电机',
            '2023',
            `<div class="process-box">
              <div class="process-bg">
                <div class="process-pre"></div>
              </div>
              <div class="process-num">52%</div>
            </div>`
          ],
          [
            '更换驱动电机',
            '2023',
            `<div class="process-box">
              <div class="process-bg">
                <div class="process-pre"></div>
              </div>
              <div class="process-num">52%</div>
            </div>`
          ],
          [
            '更换驱动电机',
            '2023',
            `<div class="process-box">
              <div class="process-bg">
                <div class="process-pre"></div>
              </div>
              <div class="process-num">52%</div>
            </div>`
          ],
          [
            '更换驱动电机',
            '2023',
            `<div class="process-box">
              <div class="process-bg">
                <div class="process-pre"></div>
              </div>
              <div class="process-num">52%</div>
            </div>`
          ]
        ],
        columnWidth: [70, 120, 100, 150],
        rowNum: 5,
        headerHeight: 30,
        index: true,
        indexHeader: '排行',
        align: ['center', 'center', 'center', 'left']
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

    /deep/.dv-scroll-board .header {
      height: 33px;
      background: url('~@/assets/img/hz/table-header.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
    }
    /deep/.dv-scroll-board .header .header-item {
      padding: 0 !important;
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

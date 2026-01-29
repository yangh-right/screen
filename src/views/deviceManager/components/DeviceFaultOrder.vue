<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-11 15:18:41
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
import { deviceOperation } from '@/api/deviceManager.js';
import moment from 'moment';

export default {
  name: 'DeviceFaultOrder',
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
      config: {
        header: ['设备名称', '持续时长', '持续时长'],
        data: [],
        columnWidth: [70, 120, 100, 150],
        rowNum: 6,
        headerHeight: 30,
        index: true,
        indexHeader: '排行',
        align: ['center', 'center', 'center', 'left']
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
        queryType: 'month',
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        waterPlantId: this.waterPlantId
      };
      const { status, resultData } = await deviceOperation(data);
      if (status === 'complete') {
        resultData?.forEach(item => {
          let radio = item.radio || 0;
          this.config.data.push([
            item.deviceName,
            `${item.duration}h`,
            `<div class="process-box">
              <div class="process-bg">
                <div class="process-pre"></div>
              </div>
              <div class="process-num">${radio}%</div>
            </div>`
          ]);
        });
        this.$refs['scrollBoard'].updateRows(this.config.data);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 18px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .table-block {
    width: 100%;
    height: 100%;
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

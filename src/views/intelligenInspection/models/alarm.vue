<!--
 * @Author: wangyr
 * @Date: 2023-05-30 19:52:35
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-10 18:46:18
 * @Description:
-->
<template>
  <unit-card cardTitle="预警管理">
    <div class="card-inner">
      <div class="table-box">
        <div class="table-head">
          <div class="index col">序号</div>
          <div class="reality col">预警类型</div>
          <div class="target col">预警状态</div>
          <div class="time col">预警时间</div>
        </div>
        <div class="table-body">
          <div @click="selectAlarm(item)" v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="index col">
              <span class="num">{{ i + 1 }}</span>
              <img class="tip" src="~@/assets/img/smartForecast/tip.png" alt="" />
            </div>
            <div class="reality col">{{ item.alarmName }}</div>
            <div class="target col">
              <div :class="['label', 'label-' + item.alarmStatus]">
                {{ item.alarmStatus === 0 ? '已结束' : item.alarmStatus === 1 ? '预警中' : '' }}
              </div>
            </div>
            <div class="time col">{{ item.startTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { alarmHandlerData, alarmDetailInfo } from '@/api/smartProduct';
export default {
  name: 'alarm',
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
      alarmId: '',
      scrollTimer: null,
      scrollDirection: 'down',
      tableData: [],
      alarmDetail: {}
    };
  },
  computed: {},
  watch: {
    alarmId: {
      handler(val) {
        this.getAlarmDetail();
      },
      immediate: true
    }
  },
  mounted() {
    this.initData();
  },
  activated() {
    this.scrollFun();
  },
  methods: {
    selectAlarm(row) {
      this.alarmId = row.alarmHandlerDataId;
      this.$emit('alarmIdChange', this.alarmId);
    },
    async getAlarmDetail() {
      if (!this.alarmId) {
        this.alarmDetail = {};
        this.$emit('alarmChange', this.alarmDetail);
        return false;
      }
      const { resultData, status } = await alarmDetailInfo(this.alarmId);
      if (status === 'complete') {
        this.alarmDetail = resultData;
        this.$emit('alarmChange', this.alarmDetail);
      }
    },
    async initData() {
      let params = {
        pageSize: 5,
        currentPage: 1,
        alarmTypeCode: 'water_purification_zjjc',
        ruleType: '3'
      };
      let { status, resultData } = await alarmHandlerData(params);
      if (status === 'complete') {
        this.tableData = resultData?.records || [];
        this.alarmId = this.tableData[0]?.alarmHandlerDataId || '';
        this.$emit('alarmIdChange', this.alarmId);
        // 表格内容滚动
        setTimeout(() => {
          this.scrollFun();
        }, 1000);
      }
    },
    // 自动滚动
    scrollFun() {
      if (this.tableData.length <= 9) {
        return false;
      }
      // 如果定时器存在
      if (this.scrollTimer) {
        // 则先清除
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
      this.scrollTimer = setInterval(() => {
        const scrollHeight = document.querySelectorAll(`.table-box .table-body`)[0].scrollHeight;
        const clientHeight = document.querySelectorAll(`.table-box .table-body`)[0].clientHeight;
        if (clientHeight === 0) {
          return false;
        }
        const scroll = scrollHeight - clientHeight;
        const scrollTop = document.querySelectorAll(`.table-box .table-body`)[0].scrollTop;
        // 向下滚动
        if (this.scrollDirection === 'down') {
          // 滚动速度
          const temp = scrollTop + 2;
          document.querySelectorAll(`.table-box .table-body`)[0].scrollTop = temp; // 滚动
          // 距离顶部高度  大于等于 滚动长度
          if (scroll <= temp) {
            clearInterval(this.scrollTimer);
            this.scrollTimer = null;
            document.querySelectorAll(`.table-box .table-body`)[0].scrollTop = 0;
            this.initData(this.waterPlantId);
          }
        }
      }, 300);
    },
    // 停止滚动
    pauseScroll() {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
    }
  },
  deactivated() {
    this.pauseScroll();
  },
  beforeDestroy() {
    this.pauseScroll();
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;

  .table-box {
    width: 100%;
    height: 100%;
    .col {
      text-align: left;
      padding-left: 23px;
    }
    .table-head {
      height: 50px;
      display: flex;
      align-items: center;
      .col {
        font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #cfdfff;
        letter-spacing: 0;
      }
      .index {
        flex-basis: 52px;
        overflow: hidden;
        visibility: hidden;
        white-space: nowrap;
        position: relative;
        text-overflow: ellipsis;
      }
      .reality {
        flex-basis: 130px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .target {
        flex-basis: 110px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .table-body {
      width: 100%;
      height: calc(100% - 34px);
      overflow: auto;
    }
    .table-tr {
      height: 30px;
      display: flex;
      align-items: center;
      background: url('~@/assets/img/smartForecast/row.png') 52px no-repeat;
      background-size: 88% 100%;
      margin-bottom: 24px;
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #e6e5f8;
      letter-spacing: 0;
      &:nth-last-child(1) {
        margin-bottom: 0px;
      }
      .index {
        flex-basis: 52px;
        font-family: Oswald-Bold, sans-serif;
        font-size: 14px;
        position: relative;
        color: #ffffff;
        .num {
          position: relative;
          left: -17px;
        }
        .tip {
          position: absolute;
          width: 24px;
          right: 3px;
          top: 0px;
        }
      }
      .reality {
        flex-basis: 130px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .target {
        flex-basis: 90px;
        .label {
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #c6d9e4;
          letter-spacing: 0;
          text-align: center;
          line-height: 19.5px;
          width: 57px;
          height: 20px;
          background-image: linear-gradient(90deg, #575e64 0%, #26282a 100%);
          border-radius: 0 0 4.67px 4.67px;
          &.label-0 {
            background: url('~@/assets/img/smartForecast/finish.png') no-repeat;
            background-size: 100% 100%;
          }
          &.label-1 {
            background: url('~@/assets/img/smartForecast/alarm.png') no-repeat;
            background-size: 100% 100%;
            color: #ffe6e4;
          }
        }
      }
      .time {
        flex-shrink: 0;
        flex-grow: 1;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

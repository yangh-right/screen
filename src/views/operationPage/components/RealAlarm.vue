<!--
 * @Author: wangyr
 * @Date: 2023-05-30 19:52:35
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-10 18:46:18
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="card-inner">
      <div class="table-box">
        <div class="table-head">
          <div class="index">序号</div>
          <div class="reality">报警名称</div>
          <div class="target">报警值</div>
          <div class="time">时间</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="index">{{ i + 1 }}</div>
            <div class="reality">{{ item.alarmName }}</div>
            <div class="target">{{ `${item.startData ? item.startData : ''}${item.pointUnit}` }}</div>
            <a-tooltip placement="top">
              <div class="time">{{ item.startTime }}</div>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { alarmInfo } from '@/api/operationPage.js';

export default {
  name: 'RealAlarm',
  components: {},
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
      scrollTimer: null,
      scrollDirection: 'down',
      tableData: []
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.initData();
  },
  activated() {
    this.scrollFun();
  },
  methods: {
    async initData() {
      let { status, resultData } = await alarmInfo(this.waterPlantId);
      if (status === 'complete') {
        this.tableData = resultData.records.map(v => {
          return {
            ...v,
            startTime: moment(v.startTime).format('YYYY-MM-DD')
          };
        });
        // 表格内容滚动
        setTimeout(() => {
          this.scrollFun();
        }, 1000);
      }
    },
    // 自动滚动
    scrollFun() {
      if (this.tableData.length <= 5) {
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
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px 15px 0;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
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
  .card-inner {
    width: 100%;
    height: 78%;
    position: relative;
    padding: 0 12px;
    box-sizing: border-box;

    .table-box {
      width: 100%;
      height: 100%;

      .table-head {
        height: 34px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/hz/alarm-bg.png') no-repeat;
        background-size: 100% 100%;

        div {
          font-family: PingFangSC, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #b2dfff;
          letter-spacing: 0;
        }
        .index {
          flex-basis: 38px;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .reality {
          flex-basis: 160px;
          text-indent: 36px;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .target {
          flex-basis: 106px;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .time {
          flex-grow: 1;
          text-indent: 30px;
          text-align: left;
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
        height: 31px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/hz/alarm-row.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 4px;

        .index {
          flex-basis: 50px;
          font-family: Oswald-Bold, sans-serif;
          font-size: 12px;
          text-align: center;
          color: #ffffff;
        }
        .reality {
          flex-basis: 250px;
          color: #ffffffff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .target {
          flex-basis: 130px;
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
        }
        .time {
          flex-shrink: 0;
          flex-grow: 1;
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>

<!--
 * @Author: wangyr
 * @Date: 2023-05-30 19:52:35
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-08-18 14:55:19
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
          <div class="reality">报警类型</div>
          <div class="target">报警值</div>
          <div class="time">时间</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="index">{{ i + 1 }}</div>
            <div class="reality">{{ item.device }} | {{ item.name }}</div>
            <div class="target">{{ item.alarmVal }}</div>
            <div class="time">{{ item.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      tableData: [
        {
          isAlarm: true,
          status: '活动中',
          name: 'DO预警',
          device: '提升泵',
          alarmVal: '2',
          time: '06-01 07:50'
        },
        {
          isAlarm: true,
          status: '活动中',
          name: '生化出水硝态氮',
          device: '风机',
          alarmVal: '9.55',
          time: '06-01 07:31'
        },
        {
          isAlarm: true,
          status: '活动中',
          name: 'DO预警',
          device: '提升泵',
          alarmVal: '1.48',
          time: '06-01 06:30'
        },
        {
          isAlarm: false,
          status: '已结束',
          name: '生化出水硝态氮	',
          device: '回流泵',
          alarmVal: '9.5',
          time: '06-01 04:49'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
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
    height: 100%;
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
          flex-basis: 38px;
          font-family: Oswald-Bold, sans-serif;
          font-size: 12px;
          color: #ffffff;
        }
        .reality {
          flex-basis: 160px;
          color: #ffffffff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0;
          text-align: center;
        }

        .target {
          flex-basis: 106px;
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
        }
        .time {
          flex-grow: 1;
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: left;
        }
      }
    }
  }
}
</style>

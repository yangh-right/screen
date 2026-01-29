<!--
 * @Author: your name
 * @Date: 2022-03-24 22:48:27
 * @LastEditTime: 2022-10-25 08:57:58
 * @LastEditors: 史磊
 * @Description: 报警面板
 * @FilePath: \ergongscreen\src\views\utils\alarmModule.vue
-->
<template>
  <!-- 报警模块 -->
  <div class="alarm" v-if="hasData">
    <div class="alarm_panel" v-if="show">
      <div class="alarm_panel-title">
        <span>{{ getTitle(data[0]) }}</span>
        <i @click="hideAlarm"></i>
      </div>
      <div class="alarm_panel-content">
        <span>
          <em>报警类型：</em>
          <em>{{ data[0].alarmTypeName }}</em>
        </span>
        <span>
          <em>报警值：</em>
          <em>{{ data[0].startData + data[0].pointUnit }}</em>
        </span>
        <span>
          <em>报警时间：</em>
          <em>{{ data[0].startTime }}</em>
        </span>
      </div>
    </div>
    <div class="alarm_panel" v-if="show">
      <div class="alarm_panel-title">
        <span>{{ getTitle(data[1]) }}</span>
        <i @click="hideAlarm"></i>
      </div>
      <div class="alarm_panel-content">
        <span>
          <em>报警类型：</em>
          <em>{{ data[1].alarmTypeName }}</em>
        </span>
        <span>
          <em>报警值：</em>
          <em>{{ data[1].startData + data[1].pointUnit }}</em>
        </span>
        <span>
          <em>报警时间：</em>
          <em>{{ data[1].startTime }}</em>
        </span>
      </div>
    </div>
    <i v-show="!show" @click="show = true"></i>
  </div>
</template>

<script>
import { getAlarmPage } from '@/api/operation';
export default {
  name: 'AlarmModule',
  data() {
    return {
      hasData: false,
      show: true,
      os: { color: 'red' },
      data: [
        {
          alarmLevel: 0,
          alarmTypeName: '',
          pointUnit: '',
          pumpName: '',
          startData: ''
        },
        {
          alarmLevel: 0,
          alarmTypeName: '',
          pointUnit: '',
          pumpName: '',
          startData: ''
        }
      ]
    };
  },
  watch: {},
  mounted() {
    this.timer = setInterval(this.init, 4000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {},
  methods: {
    /**
     * @LastEditors : 史磊
     * @description: get alarm module title
     * @logic : invert number to string;
     * @param {Object} data
     * @return {String} title
     */
    getTitle(data) {
      let alarmLevel = ['', '一级报警', '二级报警', '三级报警', '四级报警'];
      return `${data.pumpName} ${alarmLevel[data.alarmLevel]}`;
    },
    /**
     * @LastEditors : 史磊
     * @description: get alarm list and give to data
     * @logic :use async to get data
     * @return {Array} data is object array
     */
    async init() {
      let {
        resultData: { records },
        success
      } = await getAlarmPage();
      if (success) {
        if (!records.length) {
          return;
        }
        if (!records[1]) {
          records[1] = records[0];
        }
        this.hasData = true;
        this.data = [].concat(records);
      }
    },
    /**
     * @LastEditors : 史磊
     * @description: when click icon hide , hide alarm panel
     * @logic :  when click icon hide , set show false;
     * @return void
     */
    hideAlarm() {
      this.show = false;
    }
  }
};
</script>

<style lang="less" scoped>
.alarm {
  position: fixed;
  top: 13%;
  right: 26%;
  width: 273px;
  height: 137px;
  overflow: hidden;
  z-index: 9;

  > i {
    width: 16px;
    height: 16px;
    background: url(~@/assets/img/error-fill.png) no-repeat 0 0 /100%;
  }

  // 底部导航
  .alarm_panel {
    position: relative;
    width: 273px;
    height: 137px;
    margin-bottom: 10px;
    align-items: flex-end;
    display: flex;
    background: url(~@/assets/img/alarm_panel.png) no-repeat 0 0 /100%;
    flex-direction: column;

    .alarm_panel-title {
      display: flex;
      width: 100%;
      height: 36px;
      margin-bottom: 3px;
      padding: 0 8px 0 45px;
      align-items: center;
      justify-content: flex-end;
      font-weight: 500;
      font-size: 16px;
      color: #f5faff;
      letter-spacing: 0;

      span {
        display: flex;
        flex-grow: 1;
      }

      i {
        width: 16px;
        height: 16px;
      }
    }

    .alarm_panel-content {
      display: flex;
      flex-grow: 1;
      padding: 11px 20px 15px;
      width: 100%;
      flex-direction: column;
      font-size: 14px;
      color: #a7bad1;
      letter-spacing: 0;

      span {
        display: flex;
        height: 20px;
        width: 100%;
        margin-bottom: 6px;
        justify-content: space-between;

        em:nth-child(1) {
          width: 70px;
          text-align: right;
        }

        em:nth-child(2) {
          flex-grow: 1;
          padding-left: 6px;
          text-align: left;
          color: #f5faff;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      span:last-child {
        margin: 0;
      }

      span:nth-child(1) {
        em:nth-child(2) {
          color: #ff3838;
        }
      }

      em {
        font-style: normal;
      }
    }
  }

  i {
    position: absolute;
    top: 10px;
    right: 8px;
    width: 16px;
    height: 16px;
  }

  .alarm_panel {
    animation: roll 24s linear 0.5s infinite forwards;
  }
}
@keyframes roll {
  0% {
    bottom: 0;
  }
  42.5% {
    bottom: 0;
  }
  50% {
    bottom: 147px;
  }
  92.5% {
    bottom: 147px;
  }
  100% {
    bottom: 294px;
  }
}
</style>

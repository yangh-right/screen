<!--
 * @Author: your name
 * @Date: 2022-01-12 11:02:19
 * @LastEditTime: 2023-08-28 09:48:07
 * @LastEditors: Do not edit
 * @Description: 时间组件
 * @FilePath: \ergongscreen\src\views\mainPage\module\timeModule.vue
-->
<template>
  <div class="timeModule">
    <span>{{ time }}</span>
    <span>{{ week }}</span>
    <span>{{ date }}</span>
  </div>
</template>

<script>
//定义函数，将一位数"1"转为两位数"01"
const weekTrans = {
  0: '星期日',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六'
};
import { playNextVoice, getWsUrl } from '@/views/utils/common';
import store from '@/vuex/index';
import moment from 'moment';
export default {
  name: 'TimeModule',
  data() {
    return {
      canPlayAudio: true, //while true,play sound
      oS: { fontSize: '14px', color: '#ffffff' },
      date: '',
      week: '',
      time: '',
      webSocket: null, //socket object
      timer: null //timer interval pointer
    };
  },
  watch: {
    canPlayAudio: {
      handler: function (val) {
        if (!val) {
          window.speechSynthesis.cancel();
        }
      }
    }
  },
  mounted() {
    // get default time and show in view update every 1s
    this.tikTok();
    this.timer = setInterval(this.tikTok, 1000);
    //connect websocket and keep live
    this.createWebSocket();
  },
  // when page closed clear timer and websocket
  beforeDestroy() {
    clearInterval(this.timer);
    this.webSocket.close();
  },
  methods: {
    /* 建立websocket连接 */
    initSocket() {
      if (this.webSocket) return false;
      let wsUrl = getWsUrl();
      let that = this;
      this.webSocket = new WebSocket(wsUrl);
      this.webSocket.onopen = this.webSocketOnOpen;
      this.webSocket.onclose = this.webSocketOnClose;
      this.webSocket.onmessage = this.webSocketOnMessage;
      this.webSocket.onerror = this.webSocketOnError;
      // 心跳检测
      this.heartCheck = {
        timeout: 3000, // 每隔三秒发送心跳
        severTimeout: 5000, // 服务端超时时间
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
          clearTimeout(this.timeoutObj);
          clearTimeout(this.serverTimeoutObj);
          this.start();
        },
        start: function () {
          let self = this;
          self.timeoutObj = setInterval(() => {
            try {
              that.webSocket.send('4217881208479382851');
            } catch (e) {
              that.webSocket && that.webSocket.close();
            }
          }, self.timeout);
        }
      };
    },

    // 建立连接成功后的状态
    webSocketOnOpen() {
      // 心跳检测重置
      this.heartCheck.start();
    },
    // 获取到后台消息的事件，操作数据的代码在onmessage中书写
    webSocketOnMessage(res) {
      // 心跳检测重置
      this.heartCheck.reset();
      if (res.data) {
        let _data = JSON.parse(res.data);
        let sounds = [];
        if (_data.news) {
          //console.log('有新的ws推送');
          let dataAlarm;
          _data.count.forEach(item => {
            if (item.clientKey === '3') {
              dataAlarm = item.info.records;
            }
          });
          if (dataAlarm.length) {
            dataAlarm.forEach(item => {
              // 判断推送的报警消息来自于二供平台
              let oJson;
              try {
                oJson = JSON.parse(item.originalJson);
              } catch (error) {
                // keep
              }
              // if is new alarm msg and has msg value and come from secondary_water_supply product
              if (item.isNew && oJson && oJson.productCode === 'secondary_water_supply') {
                item.title = oJson.alarmName;
                //console.log('有新的报警消息');
                sounds.push({
                  id: item.id,
                  str: item.content
                    .replace(/#[a-z0-9]{6}/g, '')
                    .match(/[0-9\u4e00-\u9fa5]/g)
                    .join('')
                });
                // 语音播报
                if (this.canPlayAudio) {
                  playNextVoice(sounds);
                }
              }
            });
          }
        }
      }
    },
    // 关闭连接
    webSocketOnClose() {
      this.reconnect();
    },
    // 连接失败的事件
    webSocketOnError() {
      this.reconnect();
    },
    /* 创建连接 */
    createWebSocket() {
      try {
        this.initSocket();
      } catch (e) {
        this.reconnect();
      }
    },
    /* 重连 */
    reconnect() {
      if (this.lockReconnect) {
        return;
      }
      this.lockReconnect = true;
      // console.log('进行重连.....');
      // 没连接上会一直重连，设置延迟避免请求过多
      this.wsTimer && clearTimeout(this.wsTimer);
      this.wsTimer = setTimeout(() => {
        this.createWebSocket();
        this.lockReconnect = false;
      }, 4000);
    },
    /**
     * @LastEditors : 史磊
     * @description: logout button handler
     * @logic :when click logout use store to log out
     * @return void
     */
    loginOut() {
      store.commit('account/setLogout');
    },
    /**
     * @LastEditors : 史磊
     * @description: get date
     * @logic :get date Object and resemble
     * @return void
     */
    tikTok() {
      const day = moment();
      this.date = day.format('YYYY.MM.DD');
      this.week = weekTrans[day.day()];
      this.time = day.format('HH:mm:ss');
    }
  }
};
</script>

<style lang="less" scoped>
.timeModule {
  position: absolute;
  top: 17px;
  right: 114px;
  z-index: 9999;
  align-items: center;
  display: none;

  i.anticon-poweroff {
    margin-right: 13px;
  }

  i.off,
  i.on {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-size: 100%;
  }

  .off {
    background: url('~@assets/img/volume_off.png') no-repeat;
  }

  .on {
    background: url('~@assets/img/volume_on.png') no-repeat;
  }

  span {
    display: inline-block;
    margin-right: 26px;
    font-weight: 500;
    font-family: YouSheBiaoTiHei, sans-serif;
    font-size: 22px;
    color: #ffffff;
    text-shadow: 0 2px 4px #32c5ffa3;
  }
}
</style>

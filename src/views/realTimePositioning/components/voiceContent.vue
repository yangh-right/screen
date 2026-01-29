<template>
  <div class="mainVideoModal">
    <div class="title">
      <span class="text">广播内容</span>
      <a-icon class="ico-close" type="close" style="font-size: 16px; color: #fff" @click="closeModal" />
    </div>
    <div class="main-device-box">
      <div class="chat-box">
        <div class="chat-content" v-for="(item, index) in chatList" :key="index">
          <div v-if="item.sendUserName !== 'NJBBT009'" class="fr-chat">
            <div class="head"></div>
            <div class="content">
              <div class="cont-top">
                <span class="name">{{ item.sendUserName }}</span>
                <span class="time">{{ item.time }}</span>
              </div>
              <div class="cont-bot" @click="handleListenBar(item)">
                <span class="voice">
                  <voice-animate :isAnimate="item.isAnimate" :colSpan="8"></voice-animate>
                </span>
                <span class="record">{{ item.length }}"</span>
              </div>
              <div v-if="item.text" class="voice-text">{{ item.text }}</div>
            </div>
          </div>
          <div v-if="item.sendUserName === 'NJBBT009'" class="my-chat">
            <div class="content">
              <div class="cont-top">
                <span class="time">{{ item.time }}</span>
                <span class="name">{{ item.sendUserName }}</span>
              </div>
              <div class="cont-bot" @click="handleListenBar(item)">
                <span class="record">{{ item.length }}"</span>
                <span class="voice"><voice-animate :isAnimate="item.isAnimate" :colSpan="8"></voice-animate></span>
              </div>
              <div v-if="item.text" class="voice-text">{{ item.text }}</div>
            </div>
            <div class="head"></div>
          </div>
        </div>
      </div>
      <div class="chat-bottom">
        <a-textarea class="txt-input" v-model="sayText" placeholder="请输入文字" :auto-size="false" />
        <div v-show="showTxt" class="txt-con">
          <div @click="startRecording" class="send-btn">录制</div>
          <div @click="textToVoice" class="send-btn">发送文字</div>
        </div>
        <div v-show="showVoice" class="voice-con">
          <div class="voice-box">
            <div class="rhythm">
              <div class="rhythm-box">
                <voice-animate :colSpan="5" :isAnimate="isListening"></voice-animate>
              </div>
              <div class="voice-time">0:00</div>
            </div>
            <div :class="[isListening ? 'voice-online' : 'voice-off', 'voice-img']" @click="stopRecording"></div>
            <div class="voice-btns">
              <div @click="playRecording" class="voice-btn">试听</div>
              <div @click="handleCancel" class="voice-btn">取消</div>
            </div>
          </div>
          <div @click="handleRecording" class="send-btn">发送语音</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';
import voiceAnimate from './voiceAnimate.vue';
import { getRecordList, broadcastToCat, uploadVideo } from '@/api/realTimePositioning.js';
export default {
  name: 'voiceContent',
  components: { voiceAnimate },
  props: {
    tokenLogin: {
      type: String,
      default: ''
    },
    personInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chatList: [],
      sayText: '',
      showTxt: true,
      showVoice: false,
      isListening: false,
      audio: null,
      activePlayer: null,
      webSocketUrl: 'wss://mg.baibutonget.com/wss',
      webSocket: null,
      timeoutObj: null,
      timeout: 58 * 1000,
      lockReconnect: false, // 避免重复连接
      heartCheck: null,
      wsTimer: null,
      record: {},
      recordInstance: null
    };
  },
  computed: {},
  watch: {
    personInfo: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (Object.keys(newVal).length) {
          this.initData();
        }
      }
    }
  },
  created() {
    this.initSocket();
  },
  methods: {
    initSocket() {
      if (this.webSocket) return false;
      this.webSocket = new WebSocket(this.webSocketUrl);
      this.webSocket.onopen = this.webSocketOnOpen;
      this.webSocket.onclose = this.webSocketOnClose;
      this.webSocket.onmessage = this.webSocketOnMessage;
      this.webSocket.onerror = this.webSocketOnError;

      let that = this;
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
              that.sendMessage({ act: 'ma_get_active_devices' });
            } catch (e) {
              that.webSocket && that.webSocket.close();
            }
          }, self.timeout);
        }
      };
    },
    // 建立连接成功后的状态
    webSocketOnOpen() {
      // 管理员登录
      this.sendMessage({ act: 'ma_login', user_name: 'NJBBT009', access_token: this.tokenLogin });
      // 心跳检测重置
      this.heartCheck.start();
    },
    // 关闭连接
    webSocketOnClose() {
      this.reconnect();
    },
    // 连接失败的事件
    webSocketOnError(res) {
      this.reconnect();
    },
    // 心跳检测重置
    webSocketOnMessage(res) {
      this.heartCheck.reset();
      if (res.data) {
        let _data = JSON.parse(res.data);
        if (_data.cmd === 'ma_sending_message') {
          this.$message.success(_data.msg);
          this.sayText = '';
          this.initData();
        }
      }
    },
    /* 重连 */
    reconnect() {
      if (this.lockReconnect) {
        return;
      }
      this.lockReconnect = true;
      // 没连接上会一直重连，设置延迟避免请求过多
      this.wsTimer && clearTimeout(this.wsTimer);
      this.wsTimer = setTimeout(() => {
        this.createWebSocket();
        this.lockReconnect = false;
      }, 4000);
    },
    /* 创建连接 */
    createWebSocket() {
      try {
        this.initSocket();
      } catch (e) {
        this.reconnect();
      }
    },
    async initData() {
      let params = {
        adminId: '16011',
        userId: this.personInfo.userId,
        pageSize: 9999,
        token: this.tokenLogin
      };
      const { success, resultData } = await getRecordList(params);
      if (success) {
        this.chatList = resultData.map(item => {
          let time = moment.unix(item.sendTime).format('YYYY-MM-DD HH:mm:ss');
          return {
            time,
            isAnimate: false,
            ...item
          };
        });
      }
    },
    handleListenBar(item) {
      if (this.activePlayer === item) {
        item.isAnimate = true;
        this.activePlayer = item;
        this.voicePrompt(item);
      } else {
        this.activePlayer && (this.activePlayer.isAnimate = false);
        if (this.audio) {
          !this.audio.paused && this.audio.pause();
          this.audio = null;
        }
        item.isAnimate = true;
        this.activePlayer = item;
        this.voicePrompt(item);
      }
    },
    // 语音播放报警
    voicePrompt(data) {
      this.isplaying = true;
      if (!this.audio) {
        this.audio = new Audio(data.url);
        if (this.audio && this.audio.paused) {
          this.audio.play();
        }
        // 先播放
        this.audio.addEventListener(
          'ended',
          () => {
            data.isAnimate = false;
            this.audio = null;
          },
          false
        );
        this.audio.addEventListener('error', function () {
          this.audio = null;
          console.log('音频播放发生错误');
        });
      } else {
        // 暂停播放
        if (!this.audio.paused) {
          this.audio.pause();
          data.isAnimate = false;
        } else {
          this.audio.play();
          data.isAnimate = true;
        }
      }
    },
    // 文字转语音
    async textToVoice() {
      let params = {
        content: this.sayText,
        token: this.tokenLogin
      };
      const { success, resultData } = await broadcastToCat(params);
      if (success) {
        let params = {
          act: 'ma_sending_message',
          message: resultData?.message,
          user_id: this.personInfo.userId
        };
        this.sendMessage(params);
      } else {
        this.$message.error('发送失败！');
      }
    },
    //发送消息 @params {name: params, type: Obejct}
    sendMessage(params) {
      let str = JSON.stringify(params);
      try {
        if (this.webSocket.readyState == 1) {
          this.webSocket.send(str);
        } else {
          console.log(this.webSocket.readyState);
        }
      } catch (error) {
        console.log(error);
      }
    },
    startRecording() {
      this.showTxt = false;
      this.showVoice = true;
      this.isListening = true;
      // 开始录音
      this.recordInstance = Recorder({
        type: 'mp3',
        sampleRate: 16000,
        bitRate: 16
      });
      //打开录音，获得权限
      this.recordInstance.open(
        () => {
          this.recordInstance.start();
        },
        (msg, isUserNotAllow) => {
          //用户拒绝了录音权限，或者浏览器不支持录音
          console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg);
        }
      );
    },
    stopRecording() {
      this.isListening = false;
      try {
        if (!this.recordInstance) {
          console.error('未打开录音');
          return;
        }
        this.recordInstance.stop((blob, duration) => {
          if (blob) {
            this.record.recBlob = blob;
          }
          this.recordInstance.close();
          this.recordInstance = null;
        });
      } catch (err) {
        console.error('结束录音出错：' + err);
        this.recordInstance.close();
        this.recordInstance = null;
      }
    },
    playRecording() {
      this.isListening = true;
      if (!this.record?.recBlob) return this.$message.info('请先结束录制语音!');
      const audioUrl = URL.createObjectURL(this.record.recBlob);
      const audio = new Audio();
      audio.src = audioUrl;
      audio.play();
      // 播放结束
      audio.addEventListener(
        'ended',
        () => {
          this.isListening = false;
        },
        false
      );
    },
    // 上传语音
    async handleRecording() {
      if (!this.record?.recBlob) return this.$message.info('请先录制语音!');
      let file = new File([this.record.recBlob], 'voice.mp3', { type: 'audio/mp3' });
      const formData = new FormData();
      formData.append('file', file);
      let params = {
        token: this.tokenLogin,
        FileName: 'recording',
        content: formData
      };
      const { success, resultData } = await uploadVideo(params);
      if (success) {
        let params = {
          act: 'ma_sending_message',
          message: resultData?.url,
          user_id: this.personInfo.userId
        };
        this.sendMessage(params);
      } else {
        this.$message.error('发送失败！');
      }
    },
    handleCancel() {
      this.showTxt = true;
      this.showVoice = false;
      this.audioChunks = [];
      this.record = {};
      if (this.recordInstance) {
        this.recordInstance.close();
        this.recordInstance = null;
      }
    },
    closeModal() {
      this.$emit('closeVoice');
    }
  },
  beforeDestroy() {
    if (this.webSocket) this.webSocket.close();
    if (this.recordInstance) {
      this.recordInstance.close();
      this.recordInstance = null;
    }
  }
};
</script>

<style lang="less" scoped>
.mainVideoModal {
  position: fixed;
  top: 15%;
  transform: translateX(-50%);
  left: 50%;
  width: 552px;
  height: 674px;
  z-index: 1000;
  border-radius: 4px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.5);
  background: url('~@/assets/img/position/radio-bg.png') no-repeat;
  background-size: 100% 100%;
  .title {
    display: flex;
    align-items: center;
    padding: 0 6px 0 12px;
    height: 52px !important;
    background: url('~@/assets/img/position/decoration.png') no-repeat center bottom;
    justify-content: center;
    .text {
      line-height: normal;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #4bb4e5, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
    .ico-close {
      display: inline-block;
      width: 28px;
      height: 28px;
      position: absolute;
      right: 12px;
      top: 12px;
    }
  }
  .main-device-box {
    width: 100%;
    height: calc(100% - 52px);
    .chat-box {
      width: 100%;
      height: calc(100% - 124px);
      padding: 10px;
      position: relative;
      overflow: auto;
      .chat-content {
        margin: 0px 0;

        .my-chat {
          width: 62%;
          margin-left: 38%;
          padding: 6px 0;
          display: flex;
          justify-content: space-between;
          .cont-top {
            justify-content: flex-end !important;
          }
          .voice {
            width: 270px;
            height: 42px;
            background: url('~@/assets/img/position/radio-r.png') no-repeat;
            background-size: 100% 100%;
            position: relative;
            padding: 10px 12px 6px;
          }
          .voice-text {
            text-align: right;
          }
        }
        .fr-chat {
          width: 55%;
          padding: 6px 4px;
          display: flex;
          justify-content: flex-start;

          .voice {
            width: 270px;
            height: 42px;
            background: url('~@/assets/img/position/radio-l.png') no-repeat;
            background-size: 100% 100%;
            position: relative;
            padding: 10px 18px 6px;
          }
        }
        .voice-text {
          font-family: PingFangSC, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #d9f7ff;
          margin: 4px 4px 0 0;
        }
        .head {
          width: 32px;
          height: 32px;
          background: #1352ac;
          border-radius: 50%;
          margin-right: 4px;
          flex-shrink: 0;
        }
        .content {
          display: flex;
          flex-direction: column;
          .cont-top {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .name {
              line-height: 24px;
              font-family: PingFangSC, sans-serif;
              font-weight: 400;
              font-size: 14px;
              color: #d9f7ff;
              margin: 0 4px;
            }
            .time {
              font-family: PingFangSC, sans-serif;
              font-weight: 400;
              font-size: 12px;
              color: #a2adbc;
              margin: 0 4px;
            }
          }
          .cont-bot {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 4px;
            cursor: pointer;
            .record {
              font-family: Aliba, sans-serif;
              font-weight: 500;
              font-size: 14px;
              color: #d9f7ff;
              margin: 0 4px;
            }
          }
        }
      }
    }

    .chat-bottom {
      height: 124px;
      border-top: 1px solid #105bc4;
      padding: 12px;
      box-sizing: border-box;

      .txt-input {
        width: 100%;
        height: calc(100% - 40px);
        font-size: 14px;
        color: #f7faff;
        border: none !important;
        resize: none;
      }
      .txt-con {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 8px;
      }
      .voice-con {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 8px;
      }
      .voice-box {
        width: 398px;
        height: 32px;
        background: #10458e;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        box-sizing: border-box;
        .rhythm {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .rhythm-box {
            width: 140px;
          }
          .voice-time {
            font-family: PingFangSC-Regular, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #f7faff;
            margin-left: 12px;
          }
        }
        .voice-img {
          width: 22px;
          height: 22px;
          cursor: pointer;
          &.voice-online {
            background: url('~@/assets/img/position/v-online.png') no-repeat;
            background-size: 100% 100%;
          }
          &.voice-off {
            background: url('~@/assets/img/position/v-off.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        .voice-btns {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .voice-btn {
            font-family: PingFangSC, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #f7faff;
            text-align: center;
            margin: 0 12px;
          }
        }
      }
      .send-btn {
        width: 86px;
        height: 32px;
        line-height: 32px;
        background-image: linear-gradient(180deg, #019cd9 0%, #004ab1 100%);
        border-radius: 4px;
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #f7faff;
        text-align: center;
        margin-right: 18px;
        cursor: pointer;
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>

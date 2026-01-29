<template>
  <div class="talkfixed">
    <VueDragResize :isActive="isActive" :isResizable="false" :isDraggable="true" :w="98" :h="95" :x="x" :y="y" :z="9999"
      @clicked="isActive = true" @dragstop="isActive = false">
      <div :class="{ chatElve: true }" @dblclick="visible = true"></div>
      <a-modal v-model="visible" :footer="null" width="1020">
        <div class="iframeBox">
          <div class="ai-chat-center">
            <div class="title">
              <span>你好，我是AI厂长</span><img src="@/assets/symbol.png" />
            </div>
            <div class="second-title">尊敬的用户，欢迎踏上智慧之旅，AI厂长给将为您指引方向。</div>
            <div class="chat-box" ref="chatContainer" id="scroll-to-bottom">
              <div class="prompt-hint">您可以试着问我</div>
              <div class="prompt-content">
                <div class="prompt-content-list" v-for="(item, index) in promptList" :key="index">
                  <img src="@/assets/point.png" style="width: 5px;height: 5px;" />
                  <span style="display: flex; gap: 10px;">{{ item }}</span>
                  <a-button type="link" :disabled="request_flag" @click="goSearch(item)"
                    class="supply-float-right">提问</a-button>
                </div>
              </div>
              <div style="text-align: center;">
                {{ currentTime }}
              </div>
              <div class="chat-content" v-for="(item, index) in chatList" :key="'chat-' + index">
                <div v-if="item.label === 'my'" class="my-chat">{{ item.value }}</div>
                <div v-if="item.label === 'fr'" class="fr-chat">{{ item.value }}</div>
                <div v-if="item.label === 'tm'" class="fr-chat">{{ timeFormat(item.value) }}</div>
              </div>
            </div>
            <div class="search">
              <a-textarea style="border-radius: 12px;height: 120px;width: 100%; resize: none;" v-model="keyword"
                @pressEnter="!request_flag && goSearch(keyword)" placeholder="和AI厂长聊天" />
              <img src="@/assets/send.png" @click="!request_flag && goSearch(keyword)"
                :class="{ disabled: request_flag }" />
            </div>
          </div>
        </div>
      </a-modal>
    </VueDragResize>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
// import { getSysParamByCode } from '@/api/mainPage';
import VueDragResize from 'vue-drag-resize';
import moment from 'moment';
import { accessToken } from '@wpg/framework-vue';
import storage from '@/common/js/tool/storage';

export default {
  name: 'chatbots',
  components: { VueDragResize },
  data() {
    return {
      svgPreviewUrl: '',
      isActive: false,
      visible: false,
      keyword: '',
      currentTime: moment().format('HH:mm:ss'),
      promptList: ['污水厂出水总磷偏高是啥原因', '污水厂出水总氮偏高是啥原因', '污水厂氨氮偏高是啥原因'],
      chatList: [
        {
          label: 'fr',
          value: '你好，我是AI厂长，欢迎咨询污水知识!'
        }
      ],
      request_flag: false
    };
  },
  computed: {
    ...mapState('resize', ['wScale', 'hScale', 'scale']),
    ...mapState('video', ['hideVideo']),
    x() {
      return 1818;
    },
    y() {
      return 1072;
    }
  },
  watch: {
    chatList(val) {
      if (val) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    visible(val) {
      if (val) {
        this.currentTime = moment().format('HH:mm:ss');
      }
      this.setHideVideo(val);
    }
  },
  beforeDestroy() {
    this.setHideVideo(false);
  },
  methods: {
    ...mapMutations('video', ['setHideVideo']),
    async sendAiMessageStream(data, onChunk) {
      let user = JSON.parse(storage.get('user_info'));
      let token = user.accessToken.replace('Bearer ', '');
      try {
        this.request_flag = true;
        const response = await fetch('https://zhjs.ykqjsw.com/main/purificationApi/ai/sendMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('Streaming not supported in this environment');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        console.log('-----event start', new Date());
        while (this.request_flag) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            if (trimmedLine === 'event: close') {
              this.request_flag = false;
              break;
            }
            try {
              const jsonData = JSON.parse(trimmedLine);
              onChunk(jsonData);
            } catch (e) {
              console.warn('解析 JSON 失败:', trimmedLine, e);
            }
          }
        }

        if (buffer.trim()) {
          try {
            const jsonData = JSON.parse(buffer.trim());
            onChunk(jsonData);
          } catch (e) {
            console.warn('解析最后一行 JSON 失败:', buffer, e);
          }
        }
        this.request_flag = false;
      } catch (error) {
        console.log('....', error);
        this.request_flag = false;
      }
    },
    async goSearch(params) {
      if (this.request_flag) {
        return;
      }
      if (params === '') {
        return;
      }
      this.chatList.push({
        label: 'my',
        value: params
      });
      try {
        let requestParams = this.chatList.map(chatData => {
          return {
            'content': chatData.value,
            'role': chatData.label === 'fr' ? 'assistant' : 'user'
          }
        });
        this.keyword = '';
        this.chatList.push({
          label: 'fr',
          value: '思考中...'
        });
        const lastIndex = this.chatList.length - 1;
        this.request_flag = true;
        await this.sendAiMessageStream(requestParams, (chunkData) => {
          const { message, done } = chunkData;
          if (message && message.content) {
            if (this.chatList[lastIndex].value === '思考中...') {
              this.chatList[lastIndex].value = '';
            }
            this.$set(this.chatList, lastIndex, {
              ...this.chatList[lastIndex],
              value: this.chatList[lastIndex].value + chunkData.message.content
            });
          }
          if (done) {
            console.log('完整响应内容:', this.chatList[lastIndex].value);
            this.request_flag = false;
          }
        });
      } catch (e) {
        console.log(e);
        const lastIndex = this.chatList.length - 1;
        if (this.chatList[lastIndex].value === '思考中...') {
          this.chatList[lastIndex].value = '抱歉，没有找到相关内容';
        }
        this.request_flag = false;
      }
    },
    scrollToBottom() {
      let scroll_to_bottom = document.getElementById('scroll-to-bottom');
      if (scroll_to_bottom) {
        scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
      }
    },
    timeFormat(time) {
      const today = new Date().getTime();
      const sub = today - time;
      const day = 1000 * 60 * 60 * 24;
      const timeDate = new Date(time);
      const currentYear = new Date().getFullYear();
      const getYear = new Date(time).getFullYear();
      const HHmm = `${this.formatTime2('hh', timeDate)}:${this.formatTime2('mm', timeDate)}`;
      const showWeekDay = this.isShowWeekDay(sub, timeDate.getDay());
      if (currentYear > getYear) {
        return `${this.formatTime2('yyyy年MM月dd日', timeDate)} ${this.todayTimeFormat(
          timeDate.getHours()
        )} ${this.formatTime2('hh:mm', timeDate)}`;
      } else if (showWeekDay) {
        return `${this.weekFormat(timeDate.getDay())} ${HHmm}`;
      } else if (sub > day && sub < day * 2) {
        return `昨天 ${HHmm}`;
      } else if (sub <= day) {
        return HHmm;
      } else {
        return `${this.formatTime2('MM月dd日', timeDate)} ${this.todayTimeFormat(
          timeDate.getHours()
        )} ${this.formatTime2('hh:mm', timeDate)}`;
      }
    },
    isShowWeekDay(sub, weekDay) {
      const currentWeekDay = new Date().getDay();
      const dayTime = 1000 * 60 * 60 * 24;
      if (sub >= dayTime * 2 && weekDay !== 0 && sub <= dayTime * currentWeekDay) {
        return true;
      } else {
        return false;
      }
    },
    todayTimeFormat(e) {
      if (e >= 0 && e < 7) {
        return '凌晨';
      } else if (e >= 7 && e < 11) {
        return '上午';
      } else if (e >= 11 && e < 13) {
        return '中午';
      } else if (e >= 13 && e < 18) {
        return '下午';
      } else if (e >= 18 && e < 24) {
        return '晚上';
      } else {
        return '';
      }
    },
    weekFormat(e, prefix = '周') {
      switch (e) {
        case 0:
          return prefix + '日';
        case 1:
          return prefix + '一';
        case 2:
          return prefix + '二';
        case 3:
          return prefix + '三';
        case 4:
          return prefix + '四';
        case 5:
          return prefix + '五';
        case 6:
          return prefix + '六';
        default:
          return '';
      }
    },
    formatTime2(fmt, timestamp) {
      var date = new Date(timestamp);
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
          );
        }
      }
      return fmt;
    }
  }
};
</script>
<style lang="less" scoped>
/* 滚动条优化 */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: rgba(7, 79, 142, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: linear-gradient(180deg, #6ce8ff 0%, #3a90ec 100%);
  box-shadow: 0 0 5px rgba(108, 232, 255, 0.5);
}

.talkfixed {
  color: #333;
  z-index: 9999;

  .chatElve {
    width: 98px;
    height: 85px;
    background-image: url('../../assets/img/smartProduct/fir_Chatbots.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100%;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    filter: drop-shadow(0 0 10px rgba(108, 232, 255, 0.4));

    &:hover {
      transform: scale(1.1) rotate(5deg);
      filter: drop-shadow(0 0 20px rgba(108, 232, 255, 0.8));
    }
  }
}

/deep/.ant-modal-mask {
  backdrop-filter: blur(4px);
  background-color: rgba(0, 8, 20, 0.6) !important;
}

/deep/.ant-modal-body {
  padding: 0px;
}

/deep/.ant-modal-content {
  background: #04152d url('../../assets/background.png') no-repeat;
  background-size: 100% 100%;
  height: 802px;
  width: 1020px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid rgba(108, 232, 255, 0.4);
  box-shadow: 0 0 40px rgba(108, 232, 255, 0.15), inset 0 0 20px rgba(108, 232, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, transparent 50%, rgba(108, 232, 255, 0.1) 50%);
    pointer-events: none;
  }

  .ant-modal-close {
    color: #6ce8ff;
    top: 10px;
    right: 10px;

    &:hover {
      color: #fff;
      transform: rotate(90deg);
      transition: all 0.3s;
    }
  }

  .ant-modal-body {
    width: 100%;
    height: 100%;
  }

  .iframeBox {
    width: 100%;
    height: 100%;
  }
}

.ai-chat-center {
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 10% 10%, rgba(108, 232, 255, 0.1), transparent 40%);

  .title {
    height: 48px;
    margin-bottom: 2px;
    display: flex;
    align-items: center;

    span {
      font-family: 'AlibabaPuHuiTi_2_85_Bold', sans-serif;
      font-weight: 700;
      font-size: 32px;
      background: linear-gradient(180deg, #05c5ff 0%, #1890ff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 10px rgba(24, 144, 255, 0.4));
      letter-spacing: 2px;
    }

    img {
      height: 28px;
      margin-left: 15px;
      filter: drop-shadow(0 0 10px rgba(108, 232, 255, 0.8));
    }
  }

  .second-title {
    font-family: 'PingFangSC-Regular', sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #4da8ff;
    margin-bottom: 30px;
    letter-spacing: 1px;
    padding-left: 4px;
    position: relative;
    font-weight: 500;

    &::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 4px;
      background: #1890ff;
      border-radius: 50%;
      box-shadow: 0 0 8px #1890ff;
    }
  }

  .chat-box {
    width: 100%;
    flex: 1;
    border-radius: 12px;
    padding: 24px;
    overflow-y: auto;
    overflow-x: hidden;
    background: rgba(8, 30, 60, 0.5);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(108, 232, 255, 0.15);
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.4);

    .prompt-hint {
      font-size: 16px;
      color: rgba(108, 232, 255, 0.8);
      margin: 10px 0;
      display: flex;
      align-items: center;
      font-weight: bold;

      &::before {
        content: '';
        width: 12px;
        height: 12px;
        background: url('../../assets/point.png') no-repeat center;
        background-size: contain;
        margin-right: 8px;
      }
    }

    .prompt-content {
      width: 100%;
      margin: 0 0 30px 0;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .prompt-content-list {
        flex: 1;
        min-width: 280px;
        padding: 10px;
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, rgba(108, 232, 255, 0.05) 0%, rgba(108, 232, 255, 0.15) 100%);
        border: 1px solid rgba(108, 232, 255, 0.2);
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transform: rotate(45deg);
          transition: all 0.5s;
        }

        &:hover {
          background: rgba(108, 232, 255, 0.25);
          border-color: rgba(108, 232, 255, 0.6);
          box-shadow: 0 0 20px rgba(108, 232, 255, 0.2), inset 0 0 10px rgba(108, 232, 255, 0.1);
          transform: translateY(-2px);

          &::after {
            left: 100%;
          }
        }

        img {
          display: none;
          /* 隐藏旧的点 */
        }

        span {
          font-size: 15px;
          color: #ffffff;
          flex: 1;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .ant-btn {
          height: 30px;
          line-height: 28px;
          padding: 0 16px;
          background: linear-gradient(90deg, #1890ff, #00d2ff);
          border: none;
          color: #fff;
          border-radius: 6px;
          font-size: 13px;
          margin-left: 15px;
          box-shadow: 0 4px 10px rgba(0, 150, 255, 0.3);
          transition: all 0.3s;

          &:hover {
            box-shadow: 0 6px 15px rgba(0, 150, 255, 0.5);
            filter: brightness(1.2);
          }
        }
      }
    }

    .chat-content {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      animation: messageFadeIn 0.5s ease-out;

      .my-chat {
        align-self: flex-end;
        max-width: 80%;
        background: linear-gradient(135deg, #0050b3 0%, #1890ff 100%);
        padding: 8px;
        font-size: 14px;
        color: #ffffff;
        border-radius: 18px 18px 2px 18px;
        box-shadow: 0 8px 16px rgba(0, 80, 179, 0.3);
        line-height: 1.6;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .fr-chat {
        align-self: flex-start;
        max-width: 85%;
        background: rgba(10, 35, 70, 0.85);
        border: 1px solid rgba(108, 232, 255, 0.4);
        border-left: 4px solid #1890ff;
        padding: 8px;
        color: #ffffff;
        font-size: 14px;
        border-radius: 2px 18px 18px 18px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-all;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .search {
    width: 100%;
    margin-top: 24px;
    position: relative;
    padding: 4px;
    background: linear-gradient(135deg, rgba(108, 232, 255, 0.3), transparent 20%, transparent 80%, rgba(108, 232, 255, 0.3));
    border-radius: 14px;

    /deep/.ant-input {
      background: rgba(4, 20, 45, 0.9) !important;
      border: 1px solid rgba(108, 232, 255, 0.2) !important;
      color: #fff !important;
      font-size: 16px;
      padding: 10px;
      border-radius: 12px !important;
      transition: all 0.4s;
      height: 120px !important;

      &::placeholder {
        color: rgba(108, 232, 255, 0.4);
      }

      &:focus {
        border-color: rgba(108, 232, 255, 0.8) !important;
        box-shadow: 0 0 20px rgba(108, 232, 255, 0.3) !important;
        background: rgba(6, 25, 60, 1) !important;
      }
    }

    img {
      position: absolute;
      right: 25px;
      bottom: 25px;
      width: 44px;
      height: 44px;
      object-fit: contain;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      filter: drop-shadow(0 0 8px rgba(108, 232, 255, 0.4));

      &:hover:not(.disabled) {
        transform: scale(1.15) rotate(-10deg);
        filter: drop-shadow(0 0 15px rgba(108, 232, 255, 0.8));
      }

      &.disabled {
        opacity: 0.2;
        cursor: not-allowed;
        filter: grayscale(1);
      }
    }
  }
}

@keyframes messageFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

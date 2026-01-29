<template>
  <a-modal :visible="visible" :footer="null" width="80%" :destroyOnClose="true" @cancel="handleCancel">
    <div class="chat-container">
      <!-- 头部信息 -->
      <header class="chat-header">
        <div class="title">
          <span>你好，我是智慧水宝宝</span>
          <img src="@/assets/img/summaryOverview/symbol.png" alt="symbol" />
        </div>
        <div class="second-title">尊敬的用户，欢迎踏上智慧之旅，智慧水宝宝将为您指引方向。</div>
      </header>

      <!-- 聊天内容区 -->
      <div class="chat-box" ref="chatContainer" id="scroll-to-bottom">
        <!-- 提示问题列表 -->
        <div class="prompt-section">
          <img src="@/assets/img/summaryOverview/prompt-title.png" alt="prompt" />
          <div class="prompt-content">
            <div
              v-for="(item, index) in promptList"
              :key="index"
              class="prompt-content-list"
              @click="handlePromptClick(item.title)"
            >
              <div class="question-item-title">{{ item.title }}</div>
              <div class="question-item-content">
                <div v-for="(content, idx) in item.content" :key="idx" class="question-item-content-item">
                  {{ content.text }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 时间显示 -->
        <div class="time-box">{{ currentTime }}</div>
        <div v-resize="resize" class="chat-box-content">
          <!-- 聊天记录 -->
          <div v-for="(item, index) in chatList" :key="index" class="chat-content">
            <div v-if="item.label === 'my'" :class="['my-chat', 'chat-message']">
              {{ item.label === 'tm' ? timeFormat(item.value) : item.value }}
            </div>
            <div v-else :class="['fr-chat', 'chat-message']">
              <vue-typed-js
                :strings="[item.label === 'tm' ? timeFormat(item.value) : item.value]"
                :shuffle="false"
                cursorChar=""
                @onComplete="onComplete(index)"
                :typeSpeed="14"
                :loop="false"
                :loopCount="1"
                :startDelay="500"
                :showCursor="true"
                :contentType="'html'"
              >
                <div class="typing"></div>
              </vue-typed-js>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入框区域 -->
      <div class="search">
        <a-input
          v-model="keyword"
          class="search-input"
          placeholder="请输入您的问题"
          @keyup.enter="handleSearch"
          :maxLength="200"
        />
        <img src="@/assets/img/summaryOverview/fir_post.png" @click="handleSearch" alt="发送" />
      </div>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment';
import { debounce } from 'throttle-debounce';
import { getSysParamByCode } from '@/api/mainPage';
import { searchFile } from '@/api/smartProduct';
import { WEEK_MAP } from './constants';

export default {
  name: 'Chatbots',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      keyword: '',
      currentTime: moment().format('HH:mm:ss'),
      chatList: [],
      environment: '2', // 1: 广州, 2: 永康
      promptList: [
        // {
        //   title: '处理效率下降',
        //   content: [
        //     {
        //       text: '近期监测数据显示，COD去除率从原先的85%下降至72%，导致出水COD浓度超出排放标准10%。',
        //       type: 'text'
        //     },
        //     {
        //       text: '总氮去除率由90%下降到75%，导致出水中总氮浓度增加了25%。',
        //       type: 'text'
        //     }
        //   ]
        // },
        {
          title: '设备故障频发',
          content: [
            {
              text: '在过去的一个月中，泵类设备故障发生了8次，导致污水处理流程中断平均每次2小时。',
              type: 'text'
            },
            {
              text: '搅拌器设备故障导致生化池内污泥混合不均匀，影响了污泥的沉降性能，发生了3次故障。',
              type: 'text'
            }
          ]
        },
        {
          title: '污泥产量增加',
          content: [
            {
              text: '最近三个月，污泥产量增长了30%，由原先每天50吨增加到65吨，增加了污泥处理成本和处理难度。',
              type: 'text'
            }
          ]
        },
        {
          title: '能耗上升',
          content: [
            {
              text: '由于设备老化，曝气系统的能耗比去年同期增加了20%，每天额外消耗电能约500千瓦时。',
              type: 'text'
            }
          ]
        },
        {
          title: '出水水质不达标',
          content: [
            {
              text: '近两周内，出水中的悬浮物SS浓度连续超标，平均浓度达到40mg/L，超出排放标准（20mg/L）一倍。',
              type: 'text'
            },
            {
              text: '氨氮浓度在高峰时段达到10mg/L，超出排放标准（5mg/L）一倍。',
              type: 'text'
            }
          ]
        },
        {
          title: '噪音和气味投诉增加',
          content: [
            {
              text: '由于污泥处理区域的操作不当，导致周边居民对噪音和臭气的投诉增加了40%。',
              type: 'text'
            }
          ]
        }
      ]
    };
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(this.scrollToBottom);
      }
    },
    chatList: {
      handler() {
        this.$nextTick(this.scrollToBottom);
      },
      deep: true
    }
  },

  created() {
    this.getEnvironment();
    // 使用防抖优化搜索
    this.debouncedSearch = debounce(300, this.goSearch);
  },

  methods: {
    onComplete(index) {
      this.chatList[index].completeRender = true;
      if (this.chatList[index + 1]) {
        this.$set(this.chatList[index + 1], 'startRender', true);
      }
    },
    resize() {
      if (!this.chatList.filter(item => item.label === 'fr').every(item => item.completeRender)) {
        this.$nextTick(() => {
          let solutionWrapper = document.querySelector('.chat-box');
          solutionWrapper?.scrollTo({ top: solutionWrapper.scrollHeight, behavior: 'smooth' });
        });
      }
    },
    async getEnvironment() {
      try {
        const { resultData } = await getSysParamByCode('environment');
        this.environment = resultData === '1' ? '1' : '2';
      } catch (error) {
        console.error('获取环境配置失败:', error);
      }
    },

    handleSearch() {
      if (!this.keyword.trim()) return;
      this.debouncedSearch(this.keyword);
    },

    async goSearch(keyword) {
      this.addMessage('my', keyword);
      try {
        const encodedKeyword = encodeURIComponent(keyword);
        const { resultData } = await searchFile(encodedKeyword);

        const response = resultData?.length > 0 ? resultData[0].remark : '抱歉，没有找到相关内容';

        this.addMessage('fr', response);
        this.keyword = '';
      } catch (error) {
        console.error('搜索失败:', error);
        this.addMessage('fr', '抱歉，系统出现错误，请稍后重试');
      }
    },

    addMessage(label, value) {
      this.chatList.push({ label, value, completeRender: false });
    },

    handleCancel() {
      this.$emit('update:visible', false);
    },

    handlePromptClick(title) {
      this.keyword = title;
      this.handleSearch();
    },

    scrollToBottom() {
      const container = document.getElementById('scroll-to-bottom');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    timeFormat(time) {
      const today = new Date().getTime();
      const timeDate = new Date(time);
      const currentYear = new Date().getFullYear();
      const messageYear = timeDate.getFullYear();
      const HHmm = this.formatTime2('hh:mm', timeDate);

      // 判断是否是今年
      if (currentYear > messageYear) {
        return this.formatFullDate(timeDate);
      }

      // 计算时间差
      const dayDiff = Math.floor((today - time) / (1000 * 60 * 60 * 24));

      if (dayDiff === 0) {
        return HHmm;
      } else if (dayDiff === 1) {
        return `昨天 ${HHmm}`;
      } else if (this.isWithinCurrentWeek(dayDiff, timeDate.getDay())) {
        return `${this.weekFormat(timeDate.getDay())} ${HHmm}`;
      } else {
        return this.formatShortDate(timeDate);
      }
    },

    isWithinCurrentWeek(dayDiff, weekDay) {
      const currentWeekDay = new Date().getDay();
      return dayDiff >= 2 && weekDay !== 0 && dayDiff <= currentWeekDay;
    },

    weekFormat(day, prefix = '周') {
      return prefix + (WEEK_MAP[day] || '');
    },

    formatTime2(fmt, date) {
      let o = {
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
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
      return fmt;
    }
  }
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #acc3e8;
  width: 2px;
}

/deep/.ant-modal-body {
  padding: 14px 0 0 0;
}

/deep/.ant-btn {
  height: 24px;
  color: #8db5f7;
  border-color: #fff;
  border-radius: 18px;
}

/deep/.ant-modal-content {
  background: url('~@/assets/img/summaryOverview/smart_ai_bg.png');
  background-repeat: no-repeat;
  padding: 16px;
  height: 662px;
  background-size: cover;
  min-width: 1100px;
  max-width: 1587px;
  margin: 0 auto;

  .title {
    height: 33px;
    margin-bottom: 8px;

    span {
      font-family: AlibabaPuHuiTi_2_75_SemiBold, sans-serif;
      font-weight: 600;
      font-size: 24px;
      color: #bddeff;
    }

    img {
      margin: 0 0 18px 8px;
    }
  }

  .second-title {
    width: 392px;
    height: 20px;
    font-family: PingFangSC-Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #5290c6;
    margin-bottom: 18px;
  }

  .time-box {
    font-family: PingFangSC-Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #e9e9e9;
    text-align: center;
  }

  .chat-box {
    width: 100%;
    height: 492px;
    padding: 13px 18px 0 16px;
    overflow-y: scroll;
    background: #02102982;
    box-shadow: inset 0 1px 2px 0 #26a8d3;
    border-radius: 6px;

    .prompt-content {
      width: 100%;
      margin: 16px 0;
      display: flex;
      justify-content: flex-start;
      align-content: center;
      flex-wrap: wrap;

      .prompt-content-list {
        width: calc(32.33% - 10px);
        margin-top: 20px;
        margin-left: 12px;
        padding: 8px;
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        background: #062444ab;
        border-radius: 6px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .question-item-title {
          width: 148px;
          height: 28px;
          background: url('~@/assets/img/summaryOverview/fir_rectangle_s.png') no-repeat;
          background-size: 100% 100%;
          font-family: PingFangSC, sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #ddeeff;
          text-align: center;
          line-height: 28px;
          position: absolute;
          top: -14px;
          left: 0;
        }
        .question-item-content-item {
          padding-left: 14px;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 6px;
            width: 4px;
            height: 4px;
            background: #26a8d3;
            border-radius: 50%;
          }
          font-family: Aliba, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #acc6f2;
          margin-top: 8px;
        }
      }
    }

    .chat-content {
      margin: 6px 0;

      .my-chat {
        width: 55%;
        background: #4285f4;
        margin-left: 45%;
        padding: 12px;
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        border-radius: 8px 8px 0 8px;
      }

      .fr-chat {
        width: 55%;
        background: #062444ab;
        padding: 12px;
        color: #acc6f2;
        font-size: 14px;
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        border-radius: 8px 8px 0 0;
      }
    }
  }

  .search {
    width: 100%;
    margin-top: 18px;
    display: flex;
    align-items: center;

    .search-input {
      width: 100%;
      height: 28px;
      background: #1c54936b;
      border-radius: 16px;
      border: 1px solid #2d6aa6;
      color: #e9e9e9;
    }

    img {
      margin-left: 14px;
      width: 28px;
      height: 28px;
      cursor: pointer;
    }
  }
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-message {
  padding: 12px;
  border-radius: 8px;
  margin: 6px 0;
  max-width: 55%;
  word-break: break-word;
}
</style>

<template>
  <div class="content-spin">
    <div class="table-block">
      <div class="table-head">
        <div class="img-info">图片</div>
        <div class="index">姓名</div>
        <div class="reality">在线状态</div>
        <div class="opertion">操作</div>
      </div>
      <div class="table-body">
        <div v-for="(item, i) in tableData" :key="i" class="table-tr">
          <div class="img-info">
            <img class="file-item" :src="item.userImg" />
          </div>
          <div class="index">{{ item.userName }}</div>
          <div :class="[item.online == '0' ? 'off' : 'online', 'person-box']">
            <div class="person-ico"></div>
            <div class="person-status">{{ item.online == '0' ? '离线' : '在线' }}</div>
          </div>
          <div class="opertion">
            <div @click="viewTrajectory(item)" class="person-line">视频播放</div>
            <div @click="videoPlayback(item)" class="person-line">回放</div>
            <div @click="viewVoice(item)" class="person-line">广播</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 视频回放列表 -->
    <personnel-video-list
      v-if="videoBackVisiable"
      :tokenLogin="tokenLogin"
      :personInfo="personInfo"
      @closeModal="closeModal"
    ></personnel-video-list>
    <!-- 广播内容 -->
    <voice-content
      v-if="voiceContentVisible"
      :tokenLogin="tokenLogin"
      :personInfo="personInfo"
      @closeVoice="closeVoice"
    ></voice-content>
  </div>
</template>

<script>
import { getGroupUserList } from '@/api/realTimePositioning.js';
import personnelVideoList from './personnelVideoList.vue';
import voiceContent from './voiceContent.vue';

export default {
  name: 'safetyHat',
  components: { personnelVideoList, voiceContent },
  props: {
    title: {
      type: String,
      default: ''
    },
    tokenLogin: {
      type: String,
      default: ''
    },
    haveNoDeviceOnLine: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPoint: 'jsc_COD',
      tableData: [],
      personInfo: {},
      videoBackVisiable: false,
      voiceContentVisible: false
    };
  },
  watch: {
    tokenLogin: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.initData();
        }
      },
      immediate: true
    }
  },
  methods: {
    async initData() {
      let params = {
        adminId: '16011',
        gId: '22754',
        token: this.tokenLogin
      };
      const { success, resultData } = await getGroupUserList(params);
      if (success) {
        this.tableData = resultData || [];
      }
    },
    videoPlayback(data) {
      this.personInfo = data;
      this.videoBackVisiable = true;
    },
    viewVoice(data) {
      if (this.haveNoDeviceOnLine) return this.$message.info('设备不在线，请稍后再试');
      this.personInfo = data;
      this.voiceContentVisible = true;
    },
    // 关闭回放和广播窗口
    closeVoice() {
      this.personInfo = {};
      this.voiceContentVisible = false;
    },
    closeModal() {
      this.personInfo = {};
      this.videoBackVisiable = false;
    },
    viewTrajectory(data) {
      if (this.haveNoDeviceOnLine) return this.$message.info('设备不在线，请稍后再试');
      this.$emit('playVideo');
      this.personInfo = data;
    }
  }
};
</script>

<style lang="less" scoped>
.content-spin {
  width: 100%;
  height: calc(100% - 50px);
  position: relative;

  .table-block {
    width: 100%;
    height: 880px;
    padding-top: 6px;
    box-sizing: border-box;
    div {
      font-family: PingFangSC, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #b2dfff;
      letter-spacing: 0;
    }

    .table-head {
      height: 34px;
      display: flex;
      align-items: center;
      background: url('~@/assets/img/warnPredict/alarm_header.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
      font-size: 14px;

      div {
        background: url('~@/assets/img/warnPredict/arrow-bottom.png') no-repeat;
        background-size: 9px 6px;
        background-position: bottom center;
        padding: 0 !important;
        text-align: center;
        height: 100%;
        line-height: 34px;
      }
      .img-info {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .index {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .reality {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .opertion {
        flex: 2;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .table-body {
      width: 100%;
      height: calc(100% - 34px);
      overflow: auto;

      .file-item {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }

      .table-tr {
        height: 36px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/hz/table-de.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 4px;
        .img-info {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .index {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .person-box {
          flex: 1;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          .person-ico {
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
          .person-status {
            font-family: PingFangSC-Medium, sans-serif;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: 0;
          }
          &.off {
            .person-ico {
              background: url('~@/assets/img/position/person_off.png') no-repeat;
              background-size: 100% 100%;
            }
            .person-status {
              color: #bdc3c6;
            }
          }
          &.online {
            .person-ico {
              background: url('~@/assets/img/position/person_online.png') no-repeat;
              background-size: 100% 100%;
            }
            .person-status {
              color: #17e91d;
            }
          }
        }
        .opertion {
          flex: 2;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .person-line {
            flex: 1;
            text-align: center;
            color: #2efffe;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

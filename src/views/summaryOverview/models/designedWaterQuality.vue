<!--
 * @Author: wangyr
 * @Date: 2023-05-30 19:52:35
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-04-09 15:24:42
 * @Description:
-->
<template>
  <unit-card cardTitle="设计水质" cardType="5">
    <div class="card-inner">
      <div
        class="video-box"
        @dblclick="toggleFullscreen"
        @mouseenter="showControl = true"
        @mouseleave="showControl = false"
      >
        <video
          ref="videoPlayer"
          class="video-player"
          :src="require('@/assets/img/summaryOverview/fir_video.mp4')"
          loop
          muted
          autoplay
          @play="isPlaying = true"
          @pause="isPlaying = false"
        ></video>
        <div class="play-control" v-show="!isPlaying || showControl" @click="togglePlay">
          <img :src="isPlaying ? playSrc : pauseSrc" :alt="isPlaying ? '暂停' : '播放'" class="control-icon" />
        </div>
      </div>
      <div class="table-box">
        <div class="table-head">
          <div class="index col">序号</div>
          <div class="reality col">设计进水</div>
          <div class="target col">浙江省标</div>
          <div class="time col">一级A标准</div>
          <div class="standard col">本项目标准</div>
        </div>
        <div class="table-body">
          <div @click="selectAlarm(item)" v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="index col">
              <span class="num">{{ item.parameter }}(mg/L)</span>
            </div>
            <div class="reality col">{{ item.inflow }}</div>
            <div class="target col">{{ item.outflow }}</div>
            <div class="time col">{{ item.secondary }}</div>
            <div class="standard col">{{ item.standard }}</div>
          </div>
        </div>
      </div>
    </div>
    <videoBigger :visible.sync="dialogVisible" :videoSrc="videoSrc" @close="closeDialog"></videoBigger>
  </unit-card>
</template>

<script>
import videoBigger from '@/components/videoBigger';
export default {
  name: 'designedWaterQuality',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
    videoBigger
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showControl: false,
      isPlaying: false,
      dialogVisible: false, // 新增弹窗状态
      videoSrc: require('@/assets/img/summaryOverview/fir_video.mp4'),
      pauseSrc: require('@/assets/img/summaryOverview/fir_pause.png'),
      playSrc: require('@/assets/img/summaryOverview/fir_start.png'),
      tableData: [
        {
          parameter: 'COD',
          inflow: '≤320',
          outflow: '≤30',
          secondary: '≤50',
          standard: '≤40',
          isHighlighted: true
        },
        {
          parameter: 'BOD₅',
          inflow: '≤160',
          outflow: '--',
          secondary: '≤10',
          standard: '≤10',
          isHighlighted: true
        },
        {
          parameter: 'NH₃-N',
          inflow: '≤35',
          outflow: '≤1.5(3)',
          secondary: '≤5(8)',
          standard: '≤2(4)',
          isHighlighted: true
        },
        {
          parameter: 'TN',
          inflow: '≤45',
          outflow: '≤10(12)',
          secondary: '≤15',
          standard: '≤12(15)',
          isHighlighted: true
        },
        {
          parameter: 'TP',
          inflow: '≤4',
          outflow: '≤0.3',
          secondary: '≤0.5',
          standard: '≤0.3',
          isHighlighted: true
        },
        {
          parameter: 'SS',
          inflow: '≤100',
          outflow: '--',
          secondary: '≤10',
          standard: '≤10',
          isHighlighted: true
        }
      ]
    };
  },
  computed: {},
  methods: {
    togglePlay() {
      const video = this.$refs.videoPlayer;
      if (video) {
        if (video.paused) {
          video.play();
          this.isPlaying = true;
        } else {
          video.pause();
          this.isPlaying = false;
        }
      }
    },
    toggleFullscreen() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.$refs.videoPlayer.pause();
      this.isPlaying = false;
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;

  .video-box {
    width: 290px;
    height: 200px;
    margin-right: 20px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    background: url('~@/assets/img/summaryOverview/fir_videobox.png') no-repeat;
    background-size: 100% 100%;
    padding: 8px;

    .video-player {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .play-control {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      background: rgba(0, 146, 246, 0.2);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;
      opacity: 0;
      animation: fadeIn 0.3s forwards;

      &:hover {
        background: rgba(0, 146, 246, 0.4);
      }

      .control-icon {
        width: 50px;
        height: 50px;
      }
    }
  }

  .table-box {
    flex: 1;
    height: 100%;
    .col {
      padding-left: 12px;
      text-align: left;
    }
    .table-head {
      height: 32px;
      display: flex;
      align-items: center;
      .col {
        text-align: left;
        font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #cfdfff;
        letter-spacing: 0;
      }
      .index {
        flex-grow: 1;
        overflow: hidden;
        visibility: hidden;
        white-space: nowrap;
        position: relative;
        text-overflow: ellipsis;
      }
      .reality {
        flex-basis: 86px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .target {
        flex-basis: 86px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        flex-basis: 86px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .standard {
        flex-basis: 94px;
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
      height: 24px;
      display: flex;
      align-items: center;
      background: url('~@/assets/img/summaryOverview/fir_form.png') no-repeat top right;
      background-size: 82% 100%;
      margin-bottom: 8px;
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 12px;
      color: #e6e5f8;
      letter-spacing: 0;
      .index {
        flex-grow: 1;
        font-family: Oswald-Bold, sans-serif;
        font-size: 12px;
        position: relative;
        color: #e6e5f7;
        text-align: left;
        padding-left: 32px;
        .num {
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          position: relative;
          left: -17px;
        }
        .tip {
          position: absolute;
          width: 24px;
          right: 3px;
          top: -3px;
        }
      }
      .reality {
        flex-basis: 82px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .target {
        flex-basis: 86px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        flex-basis: 86px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .standard {
        padding-right: 27px;
        flex-basis: 90px;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>

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
      <div class="video-box" @dblclick="toggleFullscreen" @mouseenter="showControl = true"
        @mouseleave="showControl = false">
        <video ref="videoPlayer" class="video-player" :src="require('@/assets/img/summaryOverview/fir_video.mp4')" loop
          muted autoplay @play="isPlaying = true" @pause="isPlaying = false"></video>
        <div class="play-control" v-show="!isPlaying || showControl" @click="togglePlay">
          <img :src="isPlaying ? playSrc : pauseSrc" :alt="isPlaying ? '暂停' : '播放'" class="control-icon" />
        </div>
      </div>
      <div class="table-box">
        <div class="table-head">
          <div class="label-space"></div>
          <div class="col">设计进水</div>
          <div class="col">设计出水</div>
          <div class="col">二沉淀池出水</div>
          <div class="col">三类标准</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-row">
            <div class="param-label">{{ item.parameter }}</div>
            <div class="values-bg">
              <div class="col">{{ item.inflow }}</div>
              <div class="col">{{ item.outflow }}</div>
              <div class="col">{{ item.secondary }}</div>
              <div class="col standard-val">{{ item.standard }}</div>
            </div>
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
          parameter: 'COD(mg/L)',
          inflow: '400',
          outflow: '≤30',
          secondary: '≤50',
          standard: '≤20'
        },
        {
          parameter: 'BOD(mg/L)',
          inflow: '150',
          outflow: '≤6',
          secondary: '≤6',
          standard: '≤4'
        },
        {
          parameter: 'SS(mg/L)',
          inflow: '55',
          outflow: '≤10',
          secondary: '≤15',
          standard: '≤5'
        },
        {
          parameter: 'TN(mg/L)',
          inflow: '45',
          outflow: '≤10(12)',
          secondary: '≤15',
          standard: '≤10'
        },
        {
          parameter: 'NH(mg/L)',
          inflow: '400',
          outflow: '≤1.0(1.5)',
          secondary: '≤1.0(1.5)',
          standard: '≤1.0(1.5)'
        },
        {
          parameter: 'TP(mg/L)',
          inflow: '5',
          outflow: '≤0.3',
          secondary: '≤1',
          standard: '≤0.2'
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
  padding: 10px 20px;

  .video-box {
    width: 290px;
    height: 200px;
    margin-right: 15px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    background: url('~@/assets/lightimg/int/video.png') no-repeat;
    background-size: 100% 100%;
    padding: 10px;

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
      width: 60px;
      height: 60px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;

      .control-icon {
        width: 100%;
        height: 100%;
      }
    }
  }

  .table-box {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    .table-head {
      display: flex;
      align-items: center;
      height: 30px;
      margin-bottom: 8px;

      .label-space {
        width: 120px;
      }

      .col {
        flex: 1;
        text-align: center;
        font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
        font-weight: 400;
        font-size: 13px;
        color: #e4f0f6;
        white-space: nowrap;
        padding: 0 2px;
      }
    }

    .table-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .table-row {
      display: flex;
      align-items: center;
      height: 32px;

      .param-label {
        width: 100px;
        font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
        font-weight: 500;
        font-size: 15px;
        color: #e4f0f6;
        text-align: right;
        padding-right: 8px;
      }

      .values-bg {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        background: url('~@/assets/lightimg/int/table.png') no-repeat;
        background-size: 100% 100%;
        padding: 0 4px;

        .col {
          flex: 1;
          text-align: center;
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 15px;
          color: #e4f0f6;
          white-space: nowrap;

          &.standard-val {
            color: #ff4d4d;
          }
        }
      }
    }
  }
}
</style>

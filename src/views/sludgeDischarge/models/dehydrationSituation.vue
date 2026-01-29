<!--
 * @Description:
 * @version:
 * @Author: fengtaotao
 * @Date: 2025-01-07 13:55:52
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-26 10:53:46
-->
<template>
  <unit-card cardTitle="脱水情况" :showTime="false">
    <div class="card-inner">
      <c-select
        v-model="lineCode"
        style="width: 190px"
        placeholder="视频选择"
        dropdownClassName="select__list"
        class="select__block"
        @dropdownVisibleChange="change"
      >
        <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
        <a-select-option v-for="item in lineList" :key="item.videoId" :value="item.videoId">{{
          item.videoName
        }}</a-select-option>
      </c-select>
      <div class="video">
        <video-player
          v-if="showVideo && lineCode"
          route="smartSafe"
          playType="1"
          :playerId="'safePlayer'"
          :video-box-id="`safePlayWndd`"
          type="3"
          :videoNo="curVideo.videoId"
          :videoCode="curVideo.videoId"
        ></video-player>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { getVideoList } from '@/api/mainPage.js';
import cSelect from '@/components/antDesign/cSelect.vue';
import videoPlayer from '@/views/video/videoPlayer';
export default {
  name: 'temperatureAlarm',
  components: {
    videoPlayer,
    cSelect,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      playUrl: '',
      showVideo: true,
      lineCode: '',
      lineList: [],
      curVideo: {},
      showPanel: true,
      queryTime: [moment().subtract(2, 'day'), moment()],
      tableData: []
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getPumpList(val);
        }
      }
    },
    lineCode: {
      handler(val) {
        if (val) {
          this.curVideo = this.lineList.find(item => item.videoId === val);
        }
      },
      immediate: true
    }
  },
  methods: {
    change() {
      this.showVideo = !this.showVideo;
    },
    async getPumpList(id) {
      const { status, resultData } = await getVideoList(id);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        // 机械臂videoid = f6243706258842c6affc1b983c055909
        this.lineList = resultData.filter(item => item.videoId === 'f6243706258842c6affc1b983c055909');
        if (this.lineList.length > 0) {
          this.curVideo = this.lineList[0];
          this.lineCode = this.lineList[0].videoId;
        }
      } else {
        this.lineList = [];
        this.lineCode = '';
        this.curVideo = {};
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 4px);
  position: relative;
  padding: 0px 4px 0px 2px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .video {
    position: absolute;
    top: 40px;
    left: 0px;
    width: 100%;
    height: calc(100% - 10px);
  }
}
</style>

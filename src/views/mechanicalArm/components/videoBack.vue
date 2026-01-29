<!--
 * @Description:
 * @version:
 * @Author: fengtaotao
 * @Date: 2025-01-07 13:55:52
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-01-10 09:32:57
-->
<template>
  <div class="card-inner">
    <a-select
      v-model="lineCode"
      placeholder="视频选择"
      dropdownClassName="select__list"
      class="select__block"
      @dropdownVisibleChange="change"
    >
      <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
      <a-select-option v-for="item in lineList" :key="item.monitorId" :value="item.monitorId">{{
        item.placeName
      }}</a-select-option>
    </a-select>
    <div class="video">
      <video-player
        v-if="showVideo"
        :showPlugin="showPanel"
        route="securityManagement"
        playType="2"
        playMode="2"
        :playerId="'player' + new Date().getTime()"
        :video-box-id="`playWndd${new Date().getTime()}`"
        type="3"
        :query-time="queryTime"
        :videoNo="lineCode"
        :videoCode="lineCode"
      ></video-player>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { getVideoByPlaceId } from '@/api/energyAnalyse';
import videoPlayer from '@/views/video/videoPlayer';
export default {
  name: 'temperatureAlarm',
  components: {
    videoPlayer
  },
  props: {
    queryTime: {
      type: Array,
      required: true,
      default: () => []
    },
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
      showVideo: true,
      lineCode: undefined,
      lineList: [],
      showPanel: true,
      tableData: []
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  methods: {
    change() {
      this.showVideo = !this.showVideo;
    },
    async initData() {
      let params = ['1843467504643604481'];
      const res = await getVideoByPlaceId(params);
      if (res.status === 'complete') {
        this.lineList = res.resultData;
        this.lineCode = res.resultData?.[0].monitorId;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  // padding: 0px 4px 0px 2px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  /deep/ .select__block {
    background: url('~@/assets/img/hz/ac-point.png') no-repeat;
    background-size: 100% 100%;
    width: 124px;
    height: 28px;
    position: absolute;
    top: 2px;
    left: 4px;
    z-index: 10;

    .ant-select-selection {
      background: transparent;
      border: none;
    }

    .ant-select-selection__rendered {
      height: 28px;
      line-height: 28px;
      text-align: center;
      .ant-select-selection-selected-value {
        float: unset;
        font-family: SourceHanSansCN-Regular, sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
      }
      .ant-select-selection__placeholder {
        margin-left: 12px;
      }
    }
  }
  .video {
    margin-top: 40px;
    width: 100%;
  }
}
</style>
<style lang="less">
.select__list {
  .ant-select-dropdown-menu {
    background: #042d53;
    background-size: 100% 100%;
    padding: 0;
    .ant-select-dropdown-menu-item {
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      color: #7aaed4;
    }
    .ant-select-dropdown-menu-item:hover {
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      box-shadow: inset 20px 0 20px 20px #005cad;
    }
  }
}
</style>

<!--
 * @Description:
 * @version:
 * @Author: fengtaotao
 * @Date: 2025-01-07 13:55:52
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-01-08 09:49:32
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
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
        <isc-video v-if="showVideo && playUrl" :play-url="playUrl" :timeout="1 * 1000" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { getVideoByPlaceId } from '@/api/energyAnalyse';
import { getISCHlsNoParse } from '@/api/mainPage.js';
import IscVideo from '@/components/IscVideo/index.vue';
export default {
  name: 'temperatureAlarm',
  components: {
    IscVideo,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
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
      playUrl: '',
      showVideo: true,
      lineCode: undefined,
      lineList: [],
      item: {
        videoId: '2414d1448fa24bd6be10ff21bba2a1c8',
        videoName: '河南省肿瘤医院生活供水2#摄像头',
        videoType: '3',
        videoTypeName: '海康isc'
      },
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
          this.initData();
        }
      }
    },
    lineCode: {
      handler(val) {
        if (val) {
          this.getVideoUrl();
        }
      },
      immediate: true
    }
  },
  methods: {
    change() {
      this.showVideo = !this.showVideo;
    },
    async getVideoUrl() {
      const isHttps = window.location.protocol === 'https:';
      let res = await getISCHlsNoParse(this.lineCode, isHttps ? 'wss' : 'ws');
      let { status, resultData, errorMessage } = res;
      if (status === 'complete') {
        this.playUrl = resultData || '';
      }
    },
    async initData() {
      let params = ['1843467504643604481'];
      const res = await getVideoByPlaceId(params);
      if (res.status === 'complete') {
        this.lineList = res.resultData || [];
        this.lineCode = res.resultData?.[0]?.monitorId;
        this.getVideoUrl();
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

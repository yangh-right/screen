<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-06-15 20:35:37
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2024-06-18 09:00:02
 * @Description: 
-->
<template>
  <div class="smart-forecast">
    <con-layout :config="config">
      <template #videoSurveillance1>
        <video-surveillance :waterPlantId="waterPlantId"
          currentVideoId="91011992a739429299fc624e6d1cea13"></video-surveillance>
      </template>
      <template #videoSurveillance2>
        <video-surveillance :waterPlantId="waterPlantId"
          currentVideoId="59f801d2799b49a2962835ac05a0866c"></video-surveillance>
      </template>
      <template #videoSurveillance3>
        <video-surveillance :waterPlantId="waterPlantId"
          currentVideoId="78fea372b81e4aa886d1d2cc8790de48"></video-surveillance>
      </template>
      <template #videoSurveillance4>
        <video-surveillance :waterPlantId="waterPlantId"
          currentVideoId="3d41a15ff3e54da896de50ff27129a2c"></video-surveillance>
      </template>
      <template #decision>
        <decision :alarmInfo="alarmInfo" :tableData="tableData" @selectAlarm="selectAlarm"></decision>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { alarmDetailInfo, alarmHandlerData, getAlarmImage } from '@/api/smartProduct';

import ConLayout from '@/components/ConLayout/ConLayout';
import decision from './models/decision';
import videoSurveillance from './models/videoSurveillance';
export default {
  name: 'intelligenInspection',
  components: {
    ConLayout,
    decision,
    videoSurveillance
  },

  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  data() {
    return {
      alarmId: '',
      alarmInfo: {},
      tableData: [],
      config: {
        class: ['supply-flex-col'],
        children: [
          {
            class: ['supply-flex-1', 'supply-overflow-hidden'],
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['videoSurveillance1']
              },
              {
                class: ['supply-flex-1'],
                slots: ['videoSurveillance2']
              },
              {
                class: ['supply-flex-1'],
                slots: ['videoSurveillance3']
              },
              {
                class: ['supply-flex-1'],
                slots: ['videoSurveillance4']
              }
            ]
          },
          {
            style: { height: '650px' },
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['decision']
              }
            ]
          }
        ]
      }
    };
  },

  mounted() {
    this.initData();
  },

  methods: {
    // 格式化日期时间
    formatDateTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    selectAlarm(row) {
      this.alarmId = row.alarmHandlerDataId;
      this.getAlarmDetail();
    },
    async getAlarmDetail() {
      if (!this.alarmId) {
        this.alarmInfo = {};
        return false;
      }
      // 这里的 resultData 包含图片等信息
      const { resultData, status } = await getAlarmImage(this.alarmId);
      if (status === 'complete') {
        this.alarmInfo = resultData;
      }
    },
    async initData() {
      // 动态获取时间
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startTime = this.formatDateTime(today);
      const endTime = this.formatDateTime(now);

      let params = {
        "confirmStatus": "",
        "orgIds": [],
        "alarmTypeCodes": [
          "water_purification_safety_helm",
          "water_purification_confined_space",
          "water_purification_grille_machine",
          "water_purification_run_spill_drip_leak"
        ],
        "alarmLevels": [
          "1",
          "2",
          "3",
          "4"
        ],
        "keyWord": "",
        "stationIds": [
          "allCheck",
          "1932771122805809153"
        ],
        "startTime": startTime,
        "endTime": endTime,
        "currentPage": 1,
        "pageSize": 20
      }
      let { status, resultData } = await alarmHandlerData(params);
      if (status === 'complete') {
        this.tableData = resultData?.records || [];
        this.alarmId = this.tableData[0]?.alarmHandlerDataId || '';
        this.getAlarmDetail();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.smart-forecast {
  width: 100%;
  height: 100%;

  /deep/ .margin-right {
    margin-right: 18px;
  }
}
</style>

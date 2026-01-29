<!--
 * @Author: wangyr
 * @Date: 2023-03-17 08:50:37
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-09 11:24:35
 * @Description:
-->
<template>
  <div class="mapCmp">
    <div class="mapCmp-main">
      <!-- 全屏地图 -->
      <personnelTrack
        :stationData="stationData"
        :personLine="personLine"
        @viewTracks="viewTracks"
        @progress-change="handleProgressChange"
        ref="boxMap"
      ></personnelTrack>
    </div>
    <div class="top-selsect" v-if="checkDate">
      <div>
        <span>搜索{{ entityName }}行为轨迹</span>
        <a-range-picker
          dropdownClassName="date__select"
          :allowClear="false"
          class="date-pick"
          v-model="rangeTime"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm:ss"
          style="width: 550px; height: 40px"
          :placeholder="['开始时间', '结束时间']"
          @ok="handleLocationHistory"
        >
        </a-range-picker>
      </div>
      <a-icon type="close" style="color: #9bc4ff; font-size: 36px" @click="removeTracks" />
    </div>
    <div v-if="personLine.length > 0" class="bottom-play">
      <div class="play-control" @click="togglePlay">
        <img :src="isPlaying ? playSrc : pauseSrc" :alt="isPlaying ? '暂停' : '播放'" class="control-icon" />
      </div>
      <a-slider :value="progress" @change="handleProgressChange" class="progress-slider" :tooltipVisible="false" />
    </div>
    <div class="left-panel">
      <safe-manage :tokenLogin="tokenLogin" :stationData="stationData" @viewTrajectory="viewTrajectory"></safe-manage>
    </div>
  </div>
</template>

<script>
import { personLocationLogin, personLocationHistory, personLocationSnapshot } from '@/api/realTimePositioning';
import safeManage from './components/safeManage';
import personnelTrack from './modules/personnelTrack.vue';
export default {
  name: 'realTimePositioning',
  components: { personnelTrack, safeManage },
  data() {
    return {
      isPlaying: false,
      pauseSrc: require('@/assets/img/summaryOverview/fir_pause.png'),
      playSrc: require('@/assets/img/summaryOverview/fir_start.png'),
      tokenLogin: '', //对接登录token
      markerLayer: [], // 标注
      stationData: [],
      rangeTime: null,
      checkDate: false, //是否显示时间选择器
      entityIds: '', //查询运动轨迹得人员id
      entityName: '', //查询人员的名字
      viewList: [],
      personLine: [],
      progress: 0,
      duration: 100,
      timer: null
    };
  },
  created() {
    this.getStation();
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    togglePlay() {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.$refs.boxMap.startAnimation(); // 开始动画
      } else {
        this.isPlaying = false;
        this.$refs.boxMap.stopAnimation(); // 暂停动画
      }
    },
    handleProgressChange(value) {
      this.progress = value;
    },
    async getStation() {
      let params = {
        username: 'root',
        code: '$2a$10$bfoevE.vdhiDroQvBz3UXekkv.r/zTTmraW4xtXcSLTbvW1JvaVqS'
      };
      // 获取站点信息
      const { success, resultData } = await personLocationLogin(params);
      if (success) {
        this.tokenLogin = resultData;
        this.getLocationSnapshot();
      }
    },
    //获取定位人员信息
    async getLocationSnapshot() {
      let token = this.tokenLogin;
      const { success, resultData } = await personLocationSnapshot(token);
      if (success) {
        this.stationData = resultData.data;
      }
    },
    viewTrajectory(data) {
      this.checkDate = true;
      this.rangeTime = null;
      this.entityIds = data.entityId;
      this.entityName = data.entityName;
    },
    //获取人员轨迹
    async handleLocationHistory() {
      // 暂停动画
      this.isPlaying = false;
      this.$refs.boxMap.stopAnimation();

      let params = {
        token: this.tokenLogin,
        startTime: this.rangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: this.rangeTime[1].format('YYYY-MM-DD HH:mm:ss'),
        entityIds: this.entityIds
      };
      const { success, resultData } = await personLocationHistory(params);
      if (success) {
        let result = [];
        let data = resultData.data;
        for (let key in data) {
          data[key].forEach(item => {
            if (item.x != 0 && item.y != 0) {
              result.push({ x: item.x, y: item.y });
            }
          });
        }
        this.personLine = result;
      }
    },
    viewTracks(data) {
      this.checkDate = true;
      this.rangeTime = null;
      this.entityIds = data.entityId;
      this.entityName = data.entityName;
    },
    removeTracks() {
      this.checkDate = false;
      this.rangeTime = null;
      this.entityIds = '';
      this.entityName = '';
      this.personLine = [];
    }
  }
};
</script>
<style lang="less" scoped>
.bottom-play {
  position: absolute;
  bottom: 12px;
  left: 332px;
  z-index: 99;
  background: rgba(0, 14, 36, 0.5);
  padding: 8px 12px;
  border-radius: 4px;
  width: 74%;
  height: 56px;
  box-shadow: 0 0 4px rgba(0, 67, 185, 0.4);
  display: flex;
  align-items: center;

  .play-control {
    width: 32px;
    height: 32px;
    background: rgba(0, 146, 246, 0.2);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
    z-index: 1001;
    margin-right: 12px;

    &:hover {
      background: rgba(0, 146, 246, 0.4);
    }

    .control-icon {
      width: 32px;
      height: 32px;
    }
  }
  .progress-slider {
    flex: 1;
  }
  /deep/.ant-slider-track {
    background-color: #1890ff;
    height: 4px;
  }
  /deep/.ant-slider-rail {
    background-color: #e1e1e1;
    height: 4px;
  }
}
/deep/.ant-input {
  background: rgba(8, 55, 112, 0.8);
  height: 38px;
  border: 1px solid #096dd9;
}
/deep/.ant-calendar-range .ant-calendar-body {
  border: 1px solid #096dd9;
}
/deep/.ant-calendar-range .ant-calendar-selected-start-date .ant-calendar-date,
.ant-calendar-range .ant-calendar-selected-end-date .ant-calendar-date {
  background: #bae7ff !important;
}
/deep/.ant-calendar-range-right .ant-calendar-time-picker-inner {
  border-left: 1px solid #096dd9;
}
/deep/.ant-calendar-range.ant-calendar-time .ant-calendar-time-picker-combobox {
  display: inline-block;
  height: 100%;
  background: rgba(8, 55, 112, 0.8);
  border-top: 1px solid #096dd9;
}
/deep/ .date__select {
  .ant-calendar-picker-input {
    color: #d9ecff;
    background: #00295294;
    border-radius: 2px;
    border-color: #d9ecff75;
    outline: 1px solid #085299 !important;
  }
}
.mapCmp {
  width: 100%;
  height: 100%;
  position: relative;

  &-main {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;

    .spinStyle {
      width: 100%;
      height: 100%;
      background-color: #02263e !important;
      z-index: 7;
      position: absolute;
      left: 0px;
      top: 0px;

      /deep/.ant-spin-container {
        width: 100%;
        height: 100%;
      }
      /deep/.ant-spin {
        top: 30%;
      }
      /deep/.ant-spin-dot {
        font-size: 40px;
        margin-top: 30%;
      }
    }

    .map-container {
      background-image: none !important;
    }
  }
  .left-panel {
    width: 340px;
    height: calc(100% - 68px);
    position: absolute;
    top: 0;
    left: 0px;
    z-index: 12;
  }
  .top-selsect {
    z-index: 999;
    position: absolute;
    width: 62%;
    height: 55px;
    padding: 0 12px;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url('~@/assets/img/person_info_bg.png') no-repeat;
    background-size: 100% 100%;
    span {
      font-weight: 600;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
    .date-pick {
      /deep/ input {
        font-family: Aliba, sans-serif;
        font-size: 18px;
        color: #9fcfff;
      }
      .i-drop {
        width: 24px;
        height: 24px;
        background: url('~@/assets/img/hz/d-dropdown.png') no-repeat;
        background-size: 100% 100%;
        margin-top: -11px;
      }
    }
  }
}
</style>
<style lang="less">
@import '@/assets/style/component.less';
</style>

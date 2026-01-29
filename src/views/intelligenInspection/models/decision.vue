<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-05-07 15:58:05
 * @LastEditors: wangyr
 * @LastEditTime: 2026-01-26 08:46:00
 * @Description: 报警详情 - 左侧报警列表，右侧图片展示
-->
<template>
  <unit-card cardTitle="报警详情" cardType="3">
    <div class="decision-container">
      <!-- 左侧：报警详情列表 -->
      <div class="alarm-list-section">
        <div class="list-header">
          <div class="header-item" style="width: 10%">序号</div>
          <div class="header-item" style="width: 15%">报警类型</div>
          <div class="header-item" style="width: 20%">报警名称</div>
          <div class="header-item" style="width: 15%">报警状态</div>
          <div class="header-item" style="width: 25%">报警时间</div>
        </div>
        <div class="list-body">
          <div class="alarm-item" v-for="(item, index) in tableData" :key="index"
            :class="{ 'active': selectedIndex === index }" @click="selectAlarm(index, item)">
            <div class="item-cell" style="width: 10%">{{ index + 1 }}</div>
            <div class="item-cell" style="width: 15%">
              <span class="alarm-type">{{ item.alarmTypeName }}</span>
            </div>
            <div class="item-cell" style="width: 20%" :title="item.alarmName">{{ item.alarmName }}</div>
            <div class="item-cell" style="width: 15%">
              <div :class="['label', 'label-' + item.alarmStatus]">
                {{ item.alarmStatus === 0 ? '已结束' : item.alarmStatus === 1 ? '预警中' : '' }}
              </div>
            </div>
            <div class="item-cell" style="width: 25%">{{ item.startTime }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧：图片展示区 -->
      <div class="image-section">
        <div class="image-wrapper">
          <img :src="currentImage" alt="监控图片" class="monitor-image" />
          <div class="image-info">
            <div class="info-item">
              <span class="label">位置：</span>
              <span class="value">{{ currentLocation }}</span>
            </div>
            <div class="info-item">
              <span class="label">时间：</span>
              <span class="value">{{ currentTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  props: {
    alarmInfo: {
      type: Object,
      default: () => ({})
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedIndex: 0
    };
  },
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  computed: {
    currentImage() {
      // 从 alarmInfo 中获取图片，优先从 fileIdUrlVOS 获取
      return this.alarmInfo?.fileIdUrlVOS?.[0]?.imageUrl || this.alarmInfo?.alarmImg || '';
    },
    currentLocation() {
      // 优先显示具体设备名称，兜底显示场站地址
      return this.alarmInfo?.industryDeviceName || this.alarmInfo?.stationAddress || this.alarmInfo?.alarmAddress || '';
    },
    currentTime() {
      return this.alarmInfo?.createTime || this.alarmInfo?.startTime || '';
    }
  },
  methods: {
    selectAlarm(index, item) {
      this.selectedIndex = index;
      this.$emit('selectAlarm', item);
    }
  }
};
</script>

<style lang="less" scoped>
.decision-container {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 16px;
  padding: 12px 0;
}

// 左侧报警列表
.alarm-list-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(6, 19, 39, 0.4);
  border: 1px solid rgba(42, 130, 228, 0.3);
  border-radius: 4px;
  overflow: hidden;

  .list-header {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 12px;
    background: rgba(42, 130, 228, 0.15);
    border-bottom: 1px solid rgba(42, 130, 228, 0.3);

    .header-item {
      font-size: 14px;
      color: #6ce8ff;
      font-weight: 500;
      text-align: center;
    }
  }

  .list-body {
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(42, 130, 228, 0.3);
      border-radius: 3px;
    }

    .alarm-item {
      display: flex;
      align-items: center;
      height: 45px;
      padding: 0 12px;
      border-bottom: 1px solid rgba(42, 130, 228, 0.1);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: rgba(42, 130, 228, 0.1);
      }

      &.active {
        background: rgba(42, 130, 228, 0.2);
        border-left: 3px solid #6ce8ff;
      }

      .item-cell {
        font-size: 13px;
        color: #aec8ef;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .alarm-type {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 2px;
        font-size: 12px;

        &.type-1 {
          background: rgba(255, 159, 28, 0.15);
          color: #ff9f1c;
          border: 1px solid rgba(255, 159, 28, 0.3);
        }

        &.type-2 {
          background: rgba(255, 71, 87, 0.15);
          color: #ff4757;
          border: 1px solid rgba(255, 71, 87, 0.3);
        }

        &.type-3 {
          background: rgba(108, 232, 255, 0.15);
          color: #6ce8ff;
          border: 1px solid rgba(108, 232, 255, 0.3);
        }
      }

      .status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 2px;
        font-size: 12px;

        &.status-1 {
          background: rgba(255, 71, 87, 0.15);
          color: #ff4757;
          border: 1px solid rgba(255, 71, 87, 0.3);
        }

        &.status-2 {
          background: rgba(255, 159, 28, 0.15);
          color: #ff9f1c;
          border: 1px solid rgba(255, 71, 87, 0.3);
        }

        &.status-3 {
          background: rgba(46, 213, 115, 0.15);
          color: #2ed573;
          border: 1px solid rgba(46, 213, 115, 0.3);
        }
      }

      .label {
        font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #c6d9e4;
        letter-spacing: 0;
        text-align: center;
        line-height: 19.5px;
        width: 57px;
        height: 20px;
        background-image: linear-gradient(90deg, #575e64 0%, #26282a 100%);
        border-radius: 0 0 4.67px 4.67px;
        margin: 0 auto;

        &.label-0 {
          background: url('~@/assets/img/smartForecast/finish.png') no-repeat;
          background-size: 100% 100%;
        }

        &.label-1 {
          background: url('~@/assets/img/smartForecast/alarm.png') no-repeat;
          background-size: 100% 100%;
          color: #ffe6e4;
        }
      }

      .operation-btn {
        color: #6ce8ff;
        cursor: pointer;
        font-size: 12px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// 右侧图片展示
.image-section {
  width: 45%;
  display: flex;
  flex-direction: column;
  background: rgba(6, 19, 39, 0.4);
  border: 1px solid rgba(42, 130, 228, 0.3);
  border-radius: 4px;
  padding: 12px;

  .image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .monitor-image {
      width: 100%;
      height: 90%;
      object-fit: cover;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(42, 130, 228, 0.2);
    }

    .image-info {
      margin-top: 12px;
      padding: 10px;
      background: rgba(42, 130, 228, 0.1);
      border-radius: 4px;
      display: flex;
      gap: 20px;

      .info-item {
        display: flex;
        align-items: center;

        .label {
          font-size: 13px;
          color: #6ce8ff;
          margin-right: 8px;
        }

        .value {
          font-size: 13px;
          color: #aec8ef;
        }
      }
    }
  }
}
</style>

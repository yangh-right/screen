<template>
  <unit-card cardTitle="人员手环" cardType="1">
    <div class="card-inner">
      <div class="table-block">
        <div class="table-head">
          <div class="index col">序号</div>
          <div class="reality col">姓名</div>
          <div class="target col">在线状态</div>
          <div class="time col">操作</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in sortedItems" :key="i" class="table-tr">
            <div class="index col">
              <span class="num">{{ i + 1 }}</span>
              <img class="tip" src="~@/assets/img/smartForecast/tip.png" alt="" />
            </div>
            <div class="reality col">{{ item.entityName || '' }}</div>
            <div class="target col">
              <div :class="['person-ico', item.online ? 'online' : 'off']"></div>
            </div>
            <div @click="viewTrajectory(item)" class="person-line col">查看轨迹</div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { personLocationCard } from '@/api/realTimePositioning.js';
export default {
  name: 'personnelWrist',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    tokenLogin: {
      type: String,
      default: ''
    },
    stationData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentPoint: 'jsc_COD',
      tableData: []
    };
  },
  computed: {
    sortedItems() {
      return this.tableData.slice().sort((a, b) => {
        return a.entityName.localeCompare(b.entityName, 'zh-Hans-CN', { sensitivity: 'accent' });
      });
    }
  },
  watch: {
    // tokenLogin: {
    //   handler(newVal, oldVal) {
    //     if (newVal) {
    //       this.initData();
    //     }
    //   },
    //   immediate: true
    // },
    stationData: {
      handler(newVal) {
        if (newVal.length > 0) {
          this.handleData(newVal);
        }
      },
      immediate: true
    }
  },
  methods: {
    handleData(data) {
      this.tableData = data.map(item => ({
        ...item
      }));
    },
    async initData() {
      try {
        const { success, resultData } = await personLocationCard(this.tokenLogin);
        if (success && resultData?.data) {
          // 过滤掉没有eamEntity的数据，并确保数据结构完整
          this.tableData = resultData.data
            .filter(item => item?.eamEntity?.entityName)
            .map(item => ({
              ...item,
              entityName: item.eamEntity.entityName, // 确保entityName存在
              online: !!item.online, // 确保online是布尔值
              lastUpdateTime: item.lastUpdateTime || '-'
            }));
        } else {
          this.tableData = [];
        }
      } catch (error) {
        console.error('获取人员定位卡数据出错:', error);
      }
    },
    viewTrajectory(data) {
      this.$emit('viewTrajectory', data);
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;

  .table-block {
    width: 100%;
    height: 100%;
    padding-top: 6px;
    box-sizing: border-box;
    div {
      font-family: PingFangSC, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #b2dfff;
      letter-spacing: 0;
    }

    .col {
      text-align: left;
      padding-left: 28px;
    }
    .table-head {
      height: 33px;
      display: flex;
      align-items: center;
      .col {
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #cfdfff;
        letter-spacing: 0;
      }
      .index {
        flex-basis: 52px;
        overflow: hidden;
        visibility: hidden;
        white-space: nowrap;
        position: relative;
        text-overflow: ellipsis;
      }
      .reality {
        flex-basis: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .target {
        flex-basis: 90px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        flex-grow: 1;
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
      background: url('~@/assets/img/smartForecast/row.png') 52px no-repeat;
      background-size: 88% 100%;
      margin-bottom: 10px;
      font-family: Aliba, sans-serif;
      font-weight: 400;
      font-size: 12px;
      color: #e6e5f8;
      letter-spacing: 0;
      .index {
        flex-basis: 52px;
        font-family: Oswald-Bold, sans-serif;
        font-size: 12px;
        position: relative;
        color: #ffffff;
        .num {
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
        flex-basis: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .target {
        flex-basis: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 16px;

        .person-ico {
          width: 39px;
          height: 19px;
          &.online {
            background: url('~@/assets/img/summaryOverview/fir_online.png') no-repeat;
            background-size: 100% 100%;
          }
          &.off {
            background: url('~@/assets/img/summaryOverview/fir_offline.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }

      .person-line {
        flex-shrink: 0;
        flex-grow: 1;
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #24ffea;
        letter-spacing: 0;
        padding-left: 16px;
        cursor: pointer;
      }
    }
  }
}
</style>

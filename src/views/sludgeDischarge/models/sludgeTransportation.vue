<!--
 * @Author: wangyr
 * @Date: 2023-05-30 19:52:35
 * @LastEditors: wangyr
 * @LastEditgrossTime: 2024-09-10 18:46:18
 * @Description:
-->
<template>
  <unit-card cardTitle="污泥外运">
    <div class="card-inner">
      <div class="table-box">
        <div class="table-head">
          <div class="index col">序号</div>
          <div class="licensePlate col">车牌号</div>
          <div class="reality col">外运污泥量(吨)</div>
          <div class="grossTime col">时间</div>
        </div>
        <div class="table-body">
          <div @click="selectAlarm(item)" v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="index col">
              <span class="num">{{ i + 1 }}</span>
            </div>
            <div class="licensePlate col">{{ item.licensePlate }}</div>
            <div class="reality col">{{ item.netWeight }}</div>
            <div class="grossTime col">{{ item.grossTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { sludgeRecordInfoList } from '@/api/sludgeDischarge';
export default {
  name: 'designedWaterQuality',
  components: {
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
      tableData: []
    };
  },
  computed: {},
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.fetchData();
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchData() {
      let { resultData, status, errorMessage } = await sludgeRecordInfoList({
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        startTime: moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00'),
        waterPlantId: this.waterPlantId
      });
      if (status === 'complete') {
        this.tableData = resultData;
      } else {
        console.log(errorMessage);
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
  display: flex;
  align-items: center;

  .table-box {
    flex: 1;
    height: 100%;
    .col {
      text-align: center;
      padding-left: 12px;
    }
    .table-head {
      height: 32px;
      display: flex;
      align-items: center;
      .col {
        font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #cfdfff;
        letter-spacing: 0;
      }
      .index {
        flex-basis: 60px;
        overflow: hidden;
        visibility: hidden;
        white-space: nowrap;
        position: relative;
        text-overflow: ellipsis;
      }
      .licensePlate {
        flex-basis: 86px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .reality {
        flex-basis: 160px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .grossTime {
        flex-basis: 140px;
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
      background: url('~@/assets/img/sludgeDischarge/table_bg.png') no-repeat;
      background-size: 94% 100%;
      background-position: 28px 0;
      margin-bottom: 12px;
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 12px;
      color: #e6e5f8;
      letter-spacing: 0;
      .index {
        flex-basis: 60px;
        font-family: Oswald-Bold, sans-serif;
        font-size: 12px;
        position: relative;
        color: #e6e5f7;
        text-align: left;
        padding-left: 32px;
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
      .licensePlate {
        flex-basis: 86px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .reality {
        flex-basis: 160px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .grossTime {
        flex-basis: 140px;
        text-align: center;
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

<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="table-block">
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="img-info">{{ item.stationName }}{{ item.deviceName }}{{ item.pointName }}</div>
            <div class="opertion">
              <span class="enery-txt">{{ item.temperature }}</span
              >˚C
            </div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getTemperatureMeasurementPage } from '@/api/energyAnalyse';
export default {
  name: 'temperatureRanking',
  components: {
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
    async initData() {
      let data = {
        waterPlantId: this.waterPlantId,
        stationName: '',
        page: {
          size: 9999,
          current: 1
        }
      };
      this.tableData = [];
      const res = await getTemperatureMeasurementPage(data);
      if (res.status === 'complete') {
        let tempData = res.resultData.records.length > 5 ? res.resultData.records.slice(0, 5) : res.resultData.records;
        this.tableData = tempData.sort((a, b) => b.temperature - a.temperature);
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
  padding: 4px 12px 2px 2px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .table-block {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: url('~@/assets/img/ranking-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: flex-end;
    div {
      font-family: PingFangSC, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #fff4f8ff;
      letter-spacing: 0;
    }
    .table-body {
      width: 100%;
      height: 100%;
      overflow: auto;
      .table-tr {
        height: 36px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/hz/table-de.png') no-repeat;
        background-size: 100% 100%;
        margin-bottom: 18px;
        padding-left: 60px;
        &:last-child {
          margin-bottom: 0;
        }
        .img-info {
          flex: 3.4;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
        }
        .opertion {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-left: 2px;
          .enery-txt {
            font-family: MiSans-Bold, sans-serif;
            font-size: 14px;
            color: #ffffff;
            text-align: right;
            text-shadow: 0 2px 6px #32c5ffa3;
          }
        }
      }
    }
  }
}
</style>

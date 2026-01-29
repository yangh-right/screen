<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="table-block">
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="img-info">{{ item.locationName }}</div>
            <div class="opertion">
              <span class="enery-txt">{{ item.totalEnergy }}</span
              >kwh
            </div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { isNumber } from 'lodash-es';
import { getEnergyStatisticalAnalysis } from '@/api/energyAnalyse';
export default {
  name: 'energyRanking',
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
      baseTableData: [],
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
        queryType: 'day',
        currentPage: 1,
        pageSize: 9999,
        total: 0,
        startTime: moment().subtract(8, 'days').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      };
      this.tableData = [];
      const res = await getEnergyStatisticalAnalysis(data);
      if (res.status === 'complete') {
        this.baseTableData = res.resultData;
        this.dealData();
      }
    },
    dealData() {
      let data = JSON.parse(JSON.stringify(this.baseTableData));
      if (data.length === 0) return;
      this.dealTableData(data);
    },
    // 表格数据
    dealTableData(data) {
      let arr = [];
      data.forEach(d => {
        d.detailList.forEach((p, i) => {
          arr.push(this.setColValues(p, d, i));
        });
      });
      let areaNames = [];
      let areaTotalEnery = [];
      arr.forEach(item => {
        if (!areaNames.includes(item.locationName)) {
          areaNames.push(item.locationName);
          areaTotalEnery.push(item);
        }
      });
      let tempData = areaTotalEnery.length > 5 ? areaTotalEnery.slice(0, 5) : areaTotalEnery;
      this.tableData = tempData.sort((a, b) => b.totalEnergy - a.totalEnergy);
    },
    // 列数据
    setColValues(data, d, i) {
      let { locationName, totalEnergy } = d;
      let { name, startValue, endValue, totalValue } = data;
      return {
        locationName,
        name,
        startValue,
        endValue,
        totalValue: isNumber(totalValue) ? Math.abs(totalValue) : '--',
        totalEnergy: isNumber(totalEnergy) ? Math.abs(totalEnergy) : '--'
      };
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
    background: url('~@/assets/img/emperature-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: flex-end;
    div {
      font-family: PingFangSC, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #d9f7ff;
      letter-spacing: 0;
    }
    .table-body {
      width: 50%;
      height: 100%;
      overflow: auto;
      .table-tr {
        height: 36px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/hz/table-de.png') no-repeat;
        background-size: 100% 100%;
        margin-bottom: 18px;
        &:last-child {
          margin-bottom: 0;
        }
        .img-info {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
        .opertion {
          flex: 1;
          display: flex;
          justify-content: space-around;
          align-items: center;
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

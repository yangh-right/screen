<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-05-07 15:58:05
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-11 16:19:12
 * @Description:
-->
<template>
  <unit-card :cardTitle="handlePointName(pointName) + '曲线'" cardType="3">
    <c-select
      slot="headerRight"
      size="small"
      ref="structureSelect"
      @change="selectPoint"
      mode="multiple"
      :maxTagTextLength="6"
      :maxTagCount="3"
      v-model="curPoints"
      class="select-wrapper"
    >
      <a-select-option :title="item.name" v-for="item in pointList" :key="item.name" :value="item.name">{{
        item.name
      }}</a-select-option>
    </c-select>
    <div class="warn-diagnosis">
      <div class="point-wrapper">
        <a-spin :spinning="spinning" class="chart">
          <line-chart ref="lineChart" :options="option"></line-chart>
        </a-spin>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';

import { getHistoryData } from '@/api/energyAnalyse';
import { getPointStandardList } from '@/api/warnPredict';
import { genPointOption, handlePointName } from './config';
import UnitCard from '@/components/UnitCard.vue';
import LineChart from '@/components/chart/Chart.vue';
import cSelect from '@/components/antDesign/cSelect.vue';
export default {
  props: {
    alarmInfo: {
      type: Object,
      default: () => ({})
    },
    pointName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      spinning: false,
      curPoints: [],
      pointList: [],
      isSelectHover: false,
      option: genPointOption(),
      date: [moment().startOf('day'), moment().endOf('day')]
    };
  },

  components: { UnitCard, LineChart, cSelect },
  computed: {
    title() {
      return '进水' + (this.alarmInfo.pointName || '');
    }
  },
  watch: {
    alarmInfo: {
      handler(val) {
        this.curPoints = [];
        this.date = [
          moment(this.alarmInfo.startTime).subtract(12, 'hours').startOf('day'),
          moment(this.alarmInfo.startTime).add(12, 'hours').endOf('day')
        ];
        this.getData();
      },
      immediate: true
    }
  },
  methods: {
    handlePointName,
    mouseenter() {
      this.isSelectHover = true;
      this.visible = true;
    },
    mouseout() {
      this.isSelectHover = false;
      setTimeout(() => {
        if (!this.isSelectHover) {
          this.visible = false;
        }
      }, 100);
    },
    visibleChange(val) {
      if (val) {
        this.visible = true;
      } else {
        setTimeout(() => {
          if (!this.isSelectHover) {
            this.visible = false;
          }
        }, 100);
      }
    },
    selectPoint() {
      let series = this.pointList.filter(item => this.curPoints.includes(item.name));
      this.option.series = series;
      this.option.legend.data = series.map(item => item.legend);
      if (this.option.legend.data?.length > 6) {
        this.option.grid[0].top = '80px';
      } else if (this.option.legend.data?.length > 3) {
        this.option.grid[0].top = '60px';
      } else {
        this.option.grid[0].top = '40px';
      }
    },
    async getData() {
      if (this.alarmInfo.pumpHouseId && this.alarmInfo.expertDecisionType) {
        // 获取设备id
        const devicePointsMap = {};
        let conditionExpressionValue = this.alarmInfo.expertProcessControl?.conditionExpressionValue;
        conditionExpressionValue = conditionExpressionValue ? JSON.parse(conditionExpressionValue) : {};
        Object.keys(conditionExpressionValue).forEach(key => {
          if (key.includes('_p') && conditionExpressionValue[key].includes('_')) {
            let data = conditionExpressionValue[key].split('_');
            if (!devicePointsMap[data[0]]) {
              devicePointsMap[data[0]] = [];
            }
            devicePointsMap[data[0]].push(data[1]);
          }
        });
        let deviceIds = Object.keys(devicePointsMap);
        this.spinning = true;
        let params1 = {
          waterPlantId: this.alarmInfo.pumpHouseId,
          queryType: 'day',
          pointName: this.pointName,
          startTime: this.date?.[0].format('YYYY-MM-DD HH:mm:ss') || '',
          endTime: this.date?.[1].format('YYYY-MM-DD HH:mm:ss') || ''
        };
        let params2 = {
          waterPlantId: this.alarmInfo.pumpHouseId,
          pointName: this.pointName,
          typeList: [3, 4]
        };
        let res = await Promise.allSettled([getHistoryData(params1), getPointStandardList(params2)]);
        this.spinning = false;
        this.getStructureData(res[0].value || {}, deviceIds);
        let newPoints = this.pointList.filter(item => this.curPoints.includes(item.name));
        let avDevices = this.pointList?.filter(item => deviceIds.includes(item.deviceId));
        this.curPoints = newPoints.length
          ? newPoints.map(item => item.name)
          : avDevices.length
          ? [avDevices?.[0]?.name]
          : [];

        this.selectPoint();
      }
    },
    async getStructureData(res, deviceIds) {
      const { resultData, status } = res;
      if (status === 'complete') {
        this.pointList = [];
        this.option.xAxis[0].axisLabel.formatter = value => {
          return value?.slice(11, 13) ?? value;
        };
        let avDevices = resultData?.filter(item => deviceIds.includes(item.deviceId));
        let chartItem = avDevices.length ? avDevices[0] : resultData?.[0] || {};
        this.option.xAxis[0].data = chartItem?.dataAndTimeList?.map(item => item.date) || [];
        this.option.yAxis[0].name = chartItem?.unit;
        resultData?.forEach(item => {
          this.pointList.push({
            name: item.deviceName,
            deviceId: item.deviceId,
            type: 'line',
            legend: { icon: 'rect', name: item.deviceName },
            smooth: true,
            data: item.dataAndTimeList?.map(item => item.pv)
          });
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.select-wrapper {
  width: 190px;
  height: 32px;
}
/deep/.card-title__right {
  position: absolute;
  right: 12px !important;
}
.point-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .chart {
    flex: 1;
    overflow: hidden;
  }
}
.warn-diagnosis {
  width: 100%;
  height: 100%;
  position: relative;
  .btn {
    width: 282px !important;
    z-index: 10;
    position: absolute;
    right: 16px;
    top: 10px;
  }
}
/deep/ .ant-spin-container {
  height: 100%;
}
</style>

<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-25 15:04:17
 * @Description:
-->
<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="alarm">
        <div class="alarm__item" v-for="(item, index) in dataList" :key="item.title">
          <div class="alarm__block">
            <img class="alarm__icon" :src="item.icon" />
            <div class="alarm__content">
              <img src="@/assets/img/warnPredict/today_alarm.png" />
              <div class="title">{{ item.title }}</div>
              <div class="value">{{ item.value }}</div>
            </div>
          </div>
          <div class="divider" v-if="dataList.length !== index + 1">
            <img class="divider__icon" :src="require('@/assets/img/warnPredict/arrow.png')" />
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment, { months } from 'moment';
import { alarmCommonIdCount } from '@/api/warnPredict.js';
export default {
  name: 'alarmSituation',
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
      dataList: [
        { icon: require('@/assets/img/warnPredict/warn_total.png'), title: '报警总数(个)', value: 0 },
        { icon: require('@/assets/img/warnPredict/warning.png'), title: '报警中(个)', value: 0 },
        { icon: require('@/assets/img/warnPredict/warned.png'), title: '已结束(个)', value: 0 }
      ]
    };
  },
  computed: {},
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
      let params = {
        confirmStatus: '',
        orgIds: [],
        alarmTypeCode: '',
        alarmLevels: ['1', '2', '3', '4'],
        keyWord: '',
        stationIds: ['allCheck', this.waterPlantId],
        startTime: moment().startOf('day').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        currentPage: 1,
        pageSize: 20,
        alarmSortType: 'org'
      };
      let params1 = {
        ...params,
        status: 1
      };
      let params0 = {
        ...params,
        status: 0
      };
      await Promise.all([alarmCommonIdCount(params0), alarmCommonIdCount(params1)]).then(res => {
        let data0 = res[0];
        let data1 = res[1];
        if (data0.success) {
          this.dataList[2].value = data0.resultData?.reduce((total, item) => total + item.count, 0);
        }
        if (data1.success) {
          this.dataList[1].value = data1.resultData?.reduce((total, item) => total + item.count, 0);
        }
        this.dataList[0].value = this.dataList[1].value + this.dataList[2].value;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 34px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;

  .alarm {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    &__item {
      display: flex;
      align-items: center;

      .alarm__block {
        display: flex;
        align-items: center;

        .alarm__icon {
          width: 70px;
          margin-right: 12px;
        }

        .alarm__content {
          position: relative;
          display: flex;
          flex-direction: column;
          img {
            max-width: 130%;
            position: absolute;
            top: 6px;
            left: -18px;
          }
          .title {
            z-index: 100;
            font-weight: 500;
            font-size: 16px;
            color: #e9faff;
            letter-spacing: 0;
            text-shadow: -3px 4px 1px #00355c80;
          }

          .value {
            font-weight: 600;
            font-size: 20px;
            margin-top: 4px;
            color: #ffffff;
            text-shadow: 0 2px 6px #32c5ffa3;
          }
        }
      }

      .divider {
        margin-left: 70px;
        margin-right: 29px;

        &__icon {
          width: 50px;
        }
      }
    }
  }
}
</style>

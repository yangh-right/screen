<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2024-11-19 13:36:30
 * @Description:
-->
<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="material">
        <div class="material__item" v-for="item in dataList" :key="item.name">
          <img class="icon" :src="item.icon" />
          <div class="name">{{ item.materielName || '--' }}</div>
          <div class="content">
            <div class="content__name">药剂桶存量预警</div>
            <div class="content__value">
              <div class="list">
                <div class="list__name">存量剩余：</div>
                <div class="list__value" style="color: #ff7272">{{ `${item.existingQuantity || 0}${item.unit || ''}` }}</div>
              </div>
              <div class="list">
                <div class="list__name">预计使用：</div>
                <div class="list__value" style="color: #00ff0b">{{ item.usageDays || 0 }}天</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { materialAlarmList } from '@/api/warnPredict';
export default {
  name: 'alarmSituation',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iconList: [
        require('@/assets/img/warnPredict/CH3COONa.png'),
        require('@/assets/img/warnPredict/pac.png'),
        require('@/assets/img/warnPredict/hclo.png')
      ],
      dataList: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const { status, resultData } = await materialAlarmList();
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        let tempArr = resultData.length > 3 ? resultData.slice(0, 3) : resultData;
        this.dataList = tempArr.map((item, index) => {
          return {
            ...item,
            icon: this.iconList[index]
          };
        });
      } else {
        this.dataList = [
          {
            estimatedProcurementDate: '2024-09-08',
            existingQuantity: '--',
            id: 12,
            lastProcureDate: null,
            materielName: '次氯酸钠',
            materielNo: 'sodium_hypochlorite',
            materielTypeId: 13,
            materielTypeName: '化学药剂',
            minInventory: 10,
            specification: '112',
            stockAlarm: 0,
            unit: '千克',
            usageDays: '--',
            icon: './img/CH3COONa.d550aa56.png'
          },
          {
            estimatedProcurementDate: '2024-09-05',
            existingQuantity: '--',
            id: 13,
            lastProcureDate: '2024-09-05 00:00:00',
            materielName: '除磷剂',
            materielNo: 'phosphorus_removal_agent',
            materielTypeId: 13,
            materielTypeName: '化学药剂',
            minInventory: 15,
            specification: '101',
            stockAlarm: 0,
            unit: '千克',
            usageDays: '--',
            icon: './img/pac.0216392f.png'
          },
          {
            estimatedProcurementDate: '2024-09-05',
            existingQuantity: '--',
            id: 10,
            lastProcureDate: null,
            materielName: '乙酸钠',
            materielNo: 'sodium_acetate',
            materielTypeId: 13,
            materielTypeName: '化学药剂',
            minInventory: 2,
            specification: 'kr33',
            stockAlarm: 0,
            unit: '千克',
            usageDays: '--',
            icon: './img/hclo.02d6a5eb.png'
          }
        ];
      }
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

  .material {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon {
        width: 68px;
      }

      .name {
        font-weight: 500;
        font-size: 14px;
        color: #d9f7ff;
      }

      .content {
        width: 130px;
        padding: 5px 8px;
        background: url('~@/assets/img/warnPredict/text_panel.png') no-repeat;
        background-size: 100% 100%;

        &__name {
          font-weight: 500;
          text-align: center;
          font-size: 12px;
          color: #d9f7ff;
          margin-bottom: 7px;
        }

        &__value {
          .list {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 19px;

            &__name {
              font-weight: 400;
              font-size: 12px;
              color: #d9f7ff;
            }

            &__value {
              flex: 1;
              font-weight: 500;
              font-size: 14px;
              letter-spacing: 0;
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>

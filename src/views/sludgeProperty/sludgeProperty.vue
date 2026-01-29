<template>
  <div class="main-page">
    <div class="center-side-wrap">
      <div class="paramBox">
        <div v-for="item in cardList" :key="item.key" :class="[item.colSpan === 1 ? 'row-box' : 'row-secord']">
          <add-alasysis v-if="item.key === 'cAddAlasysis'" :title="item.cardName"></add-alasysis>
          <order-alasysis v-if="item.key === 'orderAlasysis'" :title="item.cardName"></order-alasysis>
          <kpi-indicator v-if="item.key === 'KpiIndicator'" :title="item.cardName"></kpi-indicator>
          <people-rate v-if="item.key === 'peopleRate'" :title="item.cardName"></people-rate>
          <order-table v-if="item.key === 'orderAlasysis'" :title="item.cardName"></order-table>
          <order-creater v-if="item.key === 'orderCreater'" :title="item.cardName"></order-creater>
          <punctuality v-if="item.key === 'punctuality'" :title="item.cardName"></punctuality>
          <order-better v-if="item.key === 'orderBetter'" :title="item.cardName"></order-better>
          <order-type v-if="item.key === 'orderType'" :title="item.cardName"></order-type>
          <order-finish v-if="item.key === 'orderFinish'" :title="item.cardName"></order-finish>
        </div>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import AddAlasysis from './components/AddAlasysis.vue';
import OrderAlasysis from './components/OrderAlasysis.vue';
import KpiIndicator from './components/KpiIndicator.vue';
import PeopleRate from './components/PeopleRate.vue';
import OrderTable from './components/OrderTable.vue';
import OrderCreater from './components/OrderCreater.vue';
import Punctuality from './components/Punctuality.vue';
import OrderBetter from './components/OrderBetter.vue';
import OrderType from './components/OrderType.vue';
import OrderFinish from './components/OrderFinish.vue';

export default {
  name: 'sludgeProperty',
  components: {
    AddAlasysis,
    OrderAlasysis,
    KpiIndicator,
    PeopleRate,
    OrderTable,
    OrderCreater,
    Punctuality,
    OrderBetter,
    OrderType,
    OrderFinish
  },
  data() {
    return {
      cardList: [
        {
          key: 'cAddAlasysis',
          cardName: '新增工单趋势分析',
          colSpan: 1
        },
        {
          key: 'orderAlasysis',
          cardName: '工单分析',
          colSpan: 2
        },
        {
          key: 'KpiIndicator',
          cardName: '执行力KPI指标',
          colSpan: 1
        },
        {
          key: 'peopleRate',
          cardName: '当前人员正在处理工单排名',
          colSpan: 1
        },
        {
          key: 'orderTable',
          cardName: '工单分析',
          colSpan: 2
        },
        {
          key: 'orderCreater',
          cardName: '当日工单创建办结趋势',
          colSpan: 1
        },
        {
          key: 'punctuality',
          cardName: '人员超时率前十名',
          colSpan: 1
        },
        {
          key: 'orderBetter',
          cardName: '工单优先级占比',
          colSpan: 1
        },
        {
          key: 'orderType',
          cardName: '工单类型占比',
          colSpan: 1
        },
        {
          key: 'orderFinish',
          cardName: '近30日每日工单办结趋势',
          colSpan: 1
        }
      ]
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showStage = true;
    });
  },
  mounted() {},
  methods: {},
  beforeRouteLeave(to, from, next) {
    this.showStage = false;
    setTimeout(() => {
      next();
    }, 800);
  }
};
</script>

<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/hz/screen-bg.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: 0;
  left: 0;

  .center-side-wrap {
    height: calc(100% - 98px);
    position: absolute;
    left: -10px;
    top: 90px;
    padding: 0 6px 11px 26px;
    box-sizing: border-box;
    z-index: 3;

    .paramBox {
      width: 100%;
      height: 100%;
      background: url('~@/assets/img/hz/property-bg.png') no-repeat;
      background-size: 100% 100%;
      padding: 10px 20px 10px 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;

      .row-box {
        width: calc(25% - 15px);
        height: calc(33.3% - 14px);
        background: url('~@/assets/img/hz/card-bg.png') no-repeat;
        background-size: 100% 100%;
      }
      .row-secord {
        width: calc(50% - 15px);
        height: calc(33.3% - 14px);
        background: url('~@/assets/img/hz/card-bg.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    background-image: radial-gradient(rgba(128, 174, 255, 0) 0, rgba(1, 9, 23, 0.6) 65%, rgba(1, 9, 23, 0.57) 100%);
  }
}
</style>

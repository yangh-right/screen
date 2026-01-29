<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-29 13:35:08
 * @Description:
-->
<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="card-mg"></div>
      <div class="card-cont">
        <div v-for="(item, i) in cardList" :key="item.sourceTypeName" :class="['card-item', 'card' + (i + 1)]">
          <div class="card-left">
            <div class="item-img"></div>
            <div class="item-title">{{ item.sourceTypeName }}</div>
          </div>
          <div class="card-right">
            <div class="percent">
              <div class="inner" :style="{ width: item.percent + '%', height: '6px' }"></div>
              <div
                class="split"
                :style="{
                  width: '5px',
                  height: '12px',
                  position: 'absolute',
                  left: item.percent + '%',
                  background: item.color
                }"
              ></div>
            </div>
            <div class="count">{{ item.typeValue }}</div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import UnitCard from './UnitCard';
export default {
  name: 'carbonRanking',
  components: {
    UnitCard
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    },
    sourceTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      option: {}
    };
  },
  computed: {
    cardList() {
      return this.sourceTypeList.map((v, i) => {
        if (i === 0) {
          v['color'] = '#7DE8EE';
          v['percent'] = 85;
        } else {
          v['color'] = '#2990FF';
          v['percent'] = 75;
        }
        return v;
      });
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .card-mg {
    width: 130px;
    height: 100%;
    background: url('~@/assets/img/carbonEmission/ranking-bg.png') no-repeat;
    background-size: 90% 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9;
  }
  .card-cont {
    width: calc(100% - 50px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: absolute;
    left: 45px;
    top: 0;
    z-index: 9;
    padding: 10px 0;

    .card-item {
      width: 100%;
      height: 32px;

      .card-left {
        width: 120px;
        height: 32px;
        float: left;
        display: flex;
        align-items: center;

        .item-title {
          font-family: Aliba, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #d9f7ff;
          letter-spacing: 0;
        }
      }
      .card-right {
        width: 230px;
        height: 26px;
        float: right;
        border: 1px solid #ecf2ff1a;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/carbonEmission/ph_bg.png') no-repeat;
        background-size: 100% 100%;

        .percent {
          position: relative;
          width: calc(100% - 50px);
          height: 26px;
          display: flex;
          align-items: center;
        }
        .count {
          font-family: MiSans-Regular, sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #f3f7ff;
          letter-spacing: 0;
        }
      }
      .inner {
        background-image: linear-gradient(270deg, #8bbff8 0%, #539dee00 100%);
      }
      &.card1 {
        position: relative;
        padding-left: 2px;
        .item-img {
          width: 32px;
          height: 32px;
          background: url('~@/assets/img/carbonEmission/ranking-icon1.png') no-repeat;
          background-size: 100% 100%;
          margin-right: 22px;
        }
        .inner {
          background-image: linear-gradient(270deg, #8bf6f8 0%, #53eaee00 100%) !important;
        }
      }
      &.card2 {
        position: relative;
        padding-left: 33px;
        .item-img {
          width: 32px;
          height: 32px;
          background: url('~@/assets/img/carbonEmission/ranking-icon2.png') no-repeat;
          background-size: 100% 100%;
          margin-right: 27px;
        }
      }
      &.card3 {
        position: relative;
        padding-left: 44px;
        .item-img {
          width: 32px;
          height: 32px;
          background: url('~@/assets/img/carbonEmission/ranking-icon3.png') no-repeat;
          background-size: 100% 100%;
          margin-right: 20px;
        }
      }
      &.card4 {
        position: relative;
        padding-left: 27px;
        .item-img {
          width: 32px;
          height: 32px;
          background: url('~@/assets/img/carbonEmission/ranking-icon4.png') no-repeat;
          background-size: 100% 100%;
          margin-right: 20px;
        }
      }
      &.card5 {
        position: relative;
        padding-left: 0px;
        .item-img {
          width: 32px;
          height: 32px;
          background: url('~@/assets/img/carbonEmission/ranking-icon5.png') no-repeat;
          background-size: 100% 100%;
          margin-right: 22px;
        }
      }
    }
  }
}
</style>

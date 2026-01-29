<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <unit-card cardTitle="控制原理" cardType="2" :showTime="false">
    <div class="card-inner">
      <div class="label">
        <div class="label__item" v-for="item in theoryData.left" :key="item">
          <span class="text">{{ item }}</span>
        </div>
      </div>
      <div class="center"></div>
      <div class="label">
        <div class="label__item" v-for="item in theoryData.right" :key="item">
          <span class="text">{{ item }}</span>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  name: 'controlTheory',
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
      theoryData: {
        left: ['氨氮优化控制系统', '硝氮优化控制系统', '溶解氧/曝气量 设定'],
        right: ['鼓风机优化控制', '空气调节阀', '管压/风量']
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {}
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 29px 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  .center {
    width: 277px;
    height: 100%;
    background: url('~@/assets/img/smartProduct/theory-center.png') no-repeat;
    background-size: 100% 100%;
  }
  .label {
    flex: 1;
    max-width: 229px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    &__item {
      width: 100%;
      height: 60px;
      text-align: center;
      background: url('~@/assets/img/smartProduct/theory1.png') no-repeat;
      background-size: 100% 100%;
      .text {
        position: relative;
        top: 3px;
        left: -7px;
        font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
        font-weight: 700;
        line-height: 60px;
        font-size: 16px;
        color: #e5ebf7;
        letter-spacing: 0;
      }
    }
    &:nth-last-child(1) {
      .label__item {
        background: url('~@/assets/img/smartProduct/theory2.png') no-repeat;
        background-size: 100% 100%;
        .text {
          left: 2px;
        }
      }
    }
  }
}
</style>

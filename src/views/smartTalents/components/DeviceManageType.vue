<!--
 * @Author: yuan wenyu
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2025-03-25 09:57:35
 * @LastEditors: fengtaotao
 * @Description:故障分析
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="top">
        <span class="test-res">测试结果</span>
        <div v-for="item in data" :key="item.name" class="item">
          <span class="value" :style="item.nameStyle">{{ item.value }}人</span>
          <span class="name" :style="item.valueStyle">{{ item.name }}</span>
        </div>
      </div>
      <div class="list">
        <div v-for="item in list" :key="item.label" class="list-item">
          <div class="title">{{ item.label }}</div>
          <div class="content-item">
            <div>{{ item.value1 }}</div>
            <div class="value1">{{ item.value2 }}</div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  name: 'DeviceManageType',
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
      data: [
        {
          name: 'S支持者',
          nameStyle: {
            top: '43%',
            left: '3%'
          },
          value: 3,
          valueStyle: {
            top: '60%',
            left: '0%'
          }
        },
        {
          name: 'C思考者',
          value: 5,
          nameStyle: {
            top: '7%',
            left: '22%'
          },
          valueStyle: {
            top: '25%',
            left: '20%'
          }
        },
        {
          name: 'D指挥者',
          value: 2,
          nameStyle: {
            top: '4%',
            right: '19%'
          },
          valueStyle: {
            top: '20%',
            right: '16%'
          }
        },
        {
          name: 'I影响者',
          value: 4,
          nameStyle: {
            top: '39%',
            right: '4%'
          },
          valueStyle: {
            top: '56%',
            right: '1%'
          }
        }
      ],
      list: [
        {
          label: 'D指挥者',
          value1: 'Dominant/Drive',
          value2: '外向 行动者 乐观'
        },
        {
          label: 'I影响者',
          value1: 'Influencing/Inspiring',
          value2: '外向 多言 乐观'
        },
        {
          label: 'C思考者',
          value1: 'correct/Compliant',
          value2: '内向 旁观者 悲观'
        },
        {
          label: 'S支持者',
          value1: 'Stable/Steady',
          value2: '内向 思考者 悲观'
        }
      ],
      option: {}
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 18px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .top {
    position: relative;
    margin-top: 48px;
    width: 381px;
    height: 299px;
    background: url('~@/assets/img/smartTalents/renge.png') no-repeat center;
    background-size: 100% 100%;
    .test-res {
      position: absolute;
      top: 46%;
      left: 42%;
      font-family: AlibabaPuHuiTiM, sans-serif;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
    }
    .item {
      .value {
        position: absolute;
        font-family: AlibabaPuHuiTiM, sans-serif;
        font-size: 24px;
        color: #ebf4fd;
        text-align: center;
        letter-spacing: 1px;
        text-shadow: 0 3px 6px #00396ecc;
      }
      .name {
        position: absolute;
        font-family: AlibabaPuHuiTiM, sans-serif;
        font-size: 16px;
        color: #bfd5ff;
        letter-spacing: 1px;
        text-align: center;
        text-shadow: 0 0 2px #072c8980;
      }
    }
  }
  .list {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: row;
    .list-item {
      width: 188px;
      height: 110px;
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 188px;
      height: 49px;
      font-family: AlibabaPuHuiTiM, sans-serif;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      background: url('~@/assets/img/smartTalents/rg_title.png') no-repeat center;
      background-size: 100% 100%;
    }
    .content-item {
      margin-top: 1px;
      padding-top: 10px;
      width: 183px;
      height: 80px;
      font-family: AlibabaPuHuiTi-Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #bfd5ff;
      letter-spacing: 0;
      text-align: center;
      background: url('~@/assets/img/smartTalents/rg_content.png') no-repeat center;
      background-size: 100% 100%;
      .value1 {
        margin-top: 3px;
      }
    }
  }
}
</style>

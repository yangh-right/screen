<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:53
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-08-28 14:58:52
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="card-inner">
        <div v-for="(item, i) in deviceArr" :key="item.label" class="divice-tab">
          <div :class="['device-img']">
            <a-progress
              :width="92"
              :strokeWidth="8"
              type="circle"
              :stroke-color="{
                '0%': item.color1,
                '100%': item.color2
              }"
              trailColor="#1c569d"
              :percent="item.value"
            >
              <template #format="percent">
                <span :class="['value', 'bg-color' + (i + 1)]">{{ percent }}</span
                ><br />
                <span :class="['unit', 'bg-color' + (i + 1)]">分</span>
              </template>
            </a-progress>
          </div>
          <div class="device-info">
            <div class="label">
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DigitalSecurity',
  components: {},
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
      cardTitle: '设备管理',
      deviceArr: [
        {
          label: '设备安全评价',
          color1: '#FFE733',
          color2: '#D79321',
          value: 67
        },
        {
          label: '环境安全评价',
          color1: '#48F1D6',
          color2: '#4DA3FE',
          value: 87
        },
        {
          label: '人员安全评价',
          color1: '#48F192',
          color2: '#4DFED2',
          value: 97
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px 15px 0;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .card-inner {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    padding: 0 12px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .divice-tab {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 0 0 33%;
      height: 164px;

      .device-img {
        width: 118px;
        height: 118px;
        margin-bottom: 6px;
        background: url('~@/assets/img/hz/s-circle.png') no-repeat;
        background-size: 100% 100%;
        padding: 13px;
        box-sizing: border-box;

        .value {
          font-family: Impact, sans-serif;
          font-size: 24px;
          letter-spacing: 0;
          text-align: center;
        }
        .unit {
          font-family: PingFangSC-SNaNpxibold, sans-serif;

          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0;
          text-align: center;
        }
        .bg-color1 {
          background-image: linear-gradient(to bottom, #ffe733, #d79321);
          -webkit-background-clip: text;
          color: transparent;
        }
        .bg-color2 {
          background-image: linear-gradient(to bottom, #48f1d6, #4da3fe);
          -webkit-background-clip: text;
          color: transparent;
        }
        .bg-color3 {
          background-image: linear-gradient(to bottom, #48f192, #4dfed2);
          -webkit-background-clip: text;
          color: transparent;
        }
      }
      .device-info {
        .label {
          background-image: linear-gradient(to bottom, #c2f5ff, #ffffff);
          -webkit-background-clip: text;
          color: transparent;
          font-family: MicrosoftYaHei, sans-serif;
          font-size: 14px;
          font-size: 600;
        }
      }
    }
  }
}
</style>

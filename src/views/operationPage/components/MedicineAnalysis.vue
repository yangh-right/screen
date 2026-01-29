<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:53
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-17 13:27:34
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
          <div :class="['device-img', 'img' + (i + 1)]"></div>
          <div class="device-info">
            <div class="value">{{ item.value }}</div>
            <div class="label">{{ item.label }}</div>
            <div class="target">{{ item.target }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MedicineAnalysis',
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
          label: '乙酸钠',
          value: 67.94,
          target: 35.46
        },
        {
          label: '聚丙烯酰胺',
          value: 65.61,
          target: 46.65
        },
        {
          label: '聚合氯化铝',
          value: 56.4,
          target: 26.91
        },
        {
          label: '次氯酸钠',
          value: 14.2,
          target: 79.59
        }
      ]
    };
  }
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
    // overflow: auto;

    .divice-tab {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 0 0 92px;
      height: 164px;
      background: url('~@/assets/img/hz/p-bg.png') no-repeat;
      background-size: 100% 100%;
      margin: 16px 0;

      .device-img {
        width: 35px;
        height: 30px;
        margin-bottom: 20px;
      }
      .img1 {
        background: url('~@/assets/img/hz/p-nac.png') no-repeat;
      }
      .img2 {
        background: url('~@/assets/img/hz/p-pam.png') no-repeat;
      }
      .img3 {
        background: url('~@/assets/img/hz/p-pac.png') no-repeat;
      }
      .img4 {
        background: url('~@/assets/img/hz/p-ch3.png') no-repeat;
      }

      .device-info {
        .value {
          font-weight: 700;
          margin-top: 2px;
          font-family: Oswald-Bold, sans-serif;
          font-size: 18px;
          color: #ffffff;
          text-shadow: 0 2px 4px #32c5ffb8;
        }
        .label {
          color: #d3edff;
          background: url('~@/assets/img/hz/d-title.png') no-repeat left top;
          font-family: MicrosoftYaHei, sans-serif;
          font-size: 14px;
        }
        .target {
          font-family: Oswald-Bold, sans-serif;
          font-weight: 700;
          font-size: 14px;
          background-image: linear-gradient(to bottom, #fffffe, #ffad52);
          -webkit-background-clip: text;
          color: transparent;
          text-shadow: 0 2px 4px #573f09;
        }
      }
    }
  }
}
</style>

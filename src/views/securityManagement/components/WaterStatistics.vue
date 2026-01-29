<!--
 * @Author: wangyr
 * @Date: 2023-04-21 17:20:07
 * @LastEditors: wangyr
 * @LastEditTime: 2024-08-17 18:20:32
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="left-box">
        <img src="~@/assets/img/hz/card-level6.png" alt="" />
        <div class="text">空气质量</div>
      </div>
      <div class="right-box">
        <div class="top-box">
          <div class="tittle">AOI</div>
          <div class="value">300</div>
        </div>
        <div class="bottom-box">
          <div class="tittle">首要污染物</div>
          <div class="value">FM2.5</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WaterStatistics',
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
      isLoading: false
    };
  },
  computed: {},
  watch: {
    waterPlantId(val) {
      if (val) {
        // this.getPointList();
      }
    }
  },
  methods: {
    async getPointList() {
      // this.isLoading = true;
      // let { resultData, status } = await getSludgePumpData(this.waterPlantId);
      // this.isLoading = false;
      // if (status === 'complete') {
      //   this.data = resultData;
      // }
    }
  },
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
    padding: 15px 12px;
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
  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
    padding: 0 12px;
    margin-top: 8px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    .left-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 170px;
      height: 100%;
      background: url('~@/assets/img/hz/card-level0.png') no-repeat;
      position: relative;
      flex: 0 0 auto;
      img {
        margin-top: 30px;
      }
      .text {
        margin-top: 12px;
        height: 25px;
        font-family: AlibabaPuHuiTi_2_65_Medium, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #ffffff;
        text-align: left;
        opacity: 0.8;
      }
    }
    .right-box {
      width: 260px;
      height: 90%;
      margin: 6px 0 0 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top-box {
        width: 250px;
        height: 92px;
        padding: 15px 0 0 120px;
        background: url('~@/assets/img/hz/card-level7.png') no-repeat;
      }
      .bottom-box {
        width: 250px;
        height: 92px;
        padding: 15px 0 0 120px;
        background: url('~@/assets/img/hz/card-level8.png') no-repeat;
      }

      .tittle {
        height: 22px;
        font-family: AlibabaPuHuiTi_2_65_Medium, sans-serif;
        font-weight: 500;
        font-size: 16px;
        color: #ffffff;
        margin-bottom: 6px;
        opacity: 0.6;
      }
      .value {
        height: 32px;
        font-weight: 500;
        font-size: 24.2px;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 31.17px;
      }
    }
  }
  /deep/ .wpg-spin-container {
    height: 100%;
  }
}
</style>

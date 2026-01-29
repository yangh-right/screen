<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:53
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-08-16 14:07:09
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="card-inner">
        <a-row type="flex" :warp="true" align="middle">
          <a-col v-for="(item, i) in deviceArr" :key="item.label" :span="8">
            <div class="divice-tab">
              <div :class="['device-img', 'img' + (i + 1)]"></div>
              <div class="device-info">
                <div class="label">{{ item.label }}</div>
                <div class="value">{{ item.value }} <span class="unit">台</span></div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceManage',
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
          label: '在线个数',
          value: 0
        },
        {
          label: '离线个数',
          value: 0
        },
        {
          label: '正常个数',
          value: 0
        },
        {
          label: '故障个数',
          value: 0
        },
        {
          label: '停机个数',
          value: 0
        },
        {
          label: '维修个数',
          value: 6
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
  .card-inner {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    padding: 0 12px;
    box-sizing: border-box;

    .divice-tab {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 16px 0;

      .device-img {
        width: 43px;
        height: 48px;
        margin-right: 1px;
      }
      .img1 {
        background: url('~@/assets/img/hz/d-online.png') no-repeat;
      }
      .img2 {
        background: url('~@/assets/img/hz/d-off.png') no-repeat;
      }
      .img3 {
        background: url('~@/assets/img/hz/d-normal.png') no-repeat;
      }
      .img4 {
        background: url('~@/assets/img/hz/d-error.png') no-repeat;
      }
      .img5 {
        background: url('~@/assets/img/hz/d-stop.png') no-repeat;
      }
      .img6 {
        background: url('~@/assets/img/hz/d-repair.png') no-repeat;
      }

      .device-info {
        .label {
          width: 83px;
          height: 22px;
          font-family: PingFangSC, sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #d3edff;
          letter-spacing: 0;
          text-indent: 10px;
          background: url('~@/assets/img/hz/d-title.png') no-repeat left bottom;
        }
        .value {
          width: 83px;
          height: 24px;
          line-height: 24px;
          font-weight: 700;
          font-size: 22px;
          color: #effcfe;
          letter-spacing: 0;
          text-indent: 10px;
          background: url('~@/assets/img/hz/d-val.png') no-repeat left center;
          margin-top: 2px;

          .unit {
            font-weight: 600;
            font-size: 14px;
            color: #bed6ff;
            letter-spacing: 0;
          }
        }
      }
    }
  }
}
</style>

<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-25 09:26:01
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div v-for="item in labelsData" :key="item.index">
        <div :class="'label' + item.index">
          <div class="label__line">
            <div class="label__line--left">
              <div class="point"></div>
            </div>
          </div>
          <div class="label__name">{{ item.title }}预计可用</div>
          <div class="label__detail">
            <div class="days">{{ item.alarmTime }}天</div>
            <div class="date">
              <span>（采购日期：</span>
              <span>{{ item.alarmDate }}）</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pac">
        <img src="@/assets/img/materialManage/pac.png" />
      </div>
      <div class="ch3">
        <img src="@/assets/img/materialManage/ch3.png" />
      </div>
      <div class="nac">
        <img src="@/assets/img/materialManage/nac.png" />
      </div>
      <div class="medicine">
        <img src="@/assets/img/materialManage/medicine.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { getMaterialAlarm } from '@api/materialManage.js';
export default {
  name: 'MedicamentForecast',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labelsData: []
    };
  },
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const { success, resultData } = await getMaterialAlarm();
      if (success && Array.isArray(resultData)) {
        let tempArr = resultData.length > 3 ? resultData.slice(0, 3) : resultData;
        this.labelsData = tempArr.map((item, i) => {
          return {
            index: i + 1,
            title: item.materielName || '--',
            alarmTime: item.usageDays || '--',
            alarmDate: item.estimatedProcurementDate || 'XXXX-XX-XX'
          };
        });
      }
    }
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
    position: relative;
    .medicine {
      position: absolute;
      bottom: 40px;
      left: 180px;
    }
    .pac {
      position: absolute;
      top: 32px;
      left: 190px;
    }
    .ch3 {
      position: absolute;
      bottom: 10px;
      left: 85px;
    }
    .nac {
      position: absolute;
      bottom: 10px;
      right: 105px;
    }

    .label1 {
      position: absolute;
      right: 25px;
      top: 5px;

      .label__line {
        position: absolute;
        top: 20px;
        right: 70px;

        &--left {
          position: relative;
          width: 94px;
          height: 2px;
          background-color: #66bcfb70;
          .point {
            position: absolute;
            left: 90px;
            top: -4px;
            width: 10px;
            height: 10px;
            background: #9ce3ff;
            border-radius: 10px;
          }
          &::before {
            position: relative;
            display: inline-block;
            width: 43px;
            top: -15px;
            height: 2px;
            content: '';
            background-color: #66bcfb70;
            transform: rotate(121deg);
            transform-origin: left bottom;
          }
        }
      }
      .label__name {
        position: absolute;
        top: -10px;
        left: -160px;
        width: 115px;
        color: #9ce3ff;
      }
      .label__detail {
        position: absolute;
        top: 30px;
        left: -160px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 130px;
        height: 60px;

        .days {
          margin-top: -20px;
          width: 40px;
          font-size: 16px;
          font-weight: 700;
          color: #9ce3ff;
          letter-spacing: 0.25px;
          text-shadow: 0 0 4px #dbe7ff99;
        }
        .date {
          font-weight: 400;
          font-size: 12px;
          color: #5b7ca0;
          letter-spacing: 0;
        }
      }
    }

    .label2 {
      position: absolute;
      left: -42px;
      top: 100px;

      .label__line {
        position: absolute;
        right: -140px;
        top: 50px;

        &--left {
          position: relative;
          width: 90px;
          height: 2px;
          background-color: #66bcfb70;
          .point {
            position: absolute;
            left: -5px;
            top: -4px;
            width: 10px;
            height: 10px;
            background: #9ce3ff;
            border-radius: 10px;
          }
          &::before {
            position: relative;
            display: inline-block;
            width: 43px;
            top: 20px;
            left: 114px;
            height: 2px;
            transform: rotate(-121deg);
            content: '';
            background-color: #66bcfb70;

            transform-origin: left bottom;
          }
        }
      }
      .label__name {
        position: absolute;
        top: 20px;
        left: 50px;
        width: 115px;
        color: #9ce3ff;
      }
      .label__detail {
        position: absolute;
        top: 82px;
        left: 52px;
        display: flex;
        flex-direction: column;
        width: 90px;
        height: 60px;

        .days {
          margin-top: -20px;
          width: 40px;
          font-size: 16px;
          color: #9ce3ff;
          font-weight: 700;
          letter-spacing: 0.25px;
          text-shadow: 0 0 4px #dbe7ff99;
        }
        .date {
          margin-top: 4px;
          font-weight: 400;
          font-size: 12px;
          color: #5b7ca0;
          letter-spacing: 0;
        }
      }
    }
    .label3 {
      position: absolute;
      right: -44px;
      bottom: 130px;

      .label__line {
        position: absolute;
        top: 9px;
        right: 65px;

        &--left {
          position: relative;
          width: 94px;
          height: 2px;
          background-color: #66bcfb70;
          .point {
            position: absolute;
            left: 90px;
            top: -4px;
            width: 10px;
            height: 10px;
            background: #9ce3ff;
            border-radius: 10px;
          }
          &::before {
            position: relative;
            display: inline-block;
            width: 43px;
            top: -15px;
            height: 2px;
            content: '';
            background-color: #66bcfb70;
            transform: rotate(121deg);
            transform-origin: left bottom;
          }
        }
      }
      .label__name {
        position: absolute;
        top: -18px;
        left: -160px;
        width: 115px;
        color: #9ce3ff;
      }
      .label__detail {
        position: absolute;
        top: 30px;
        left: -160px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 130px;
        height: 35px;

        .days {
          margin-top: -20px;
          width: 40px;
          font-size: 16px;
          color: #9ce3ff;
          font-weight: 700;
          letter-spacing: 0.25px;
          text-shadow: 0 0 4px #dbe7ff99;
        }
        .date {
          font-weight: 400;
          font-size: 12px;
          color: #5b7ca0;
          letter-spacing: 0;
        }
      }
    }
  }
}
</style>

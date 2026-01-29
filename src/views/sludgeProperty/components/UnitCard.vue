<!--
 * @Author: wangyr
 * @Date: 2023-05-30 13:40:08
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 10:18:20
 * @Description:
-->
<template>
  <div class="container">
    <div class="card-title">
      <div class="title">{{ cardTitle }}</div>
    </div>
    <div class="card-content">
      <div v-if="showTime" class="content-header">
        <div class="date-btns">
          <div class="date-box">
            <a-month-picker
              class="date-bg"
              v-model="dateTime"
              :allowClear="false"
              :format="monthFormat"
              placeholder="选择日期"
            >
              <template #suffixIcon>
                <div class="i-drop"></div>
              </template>
            </a-month-picker>
          </div>
          <a-button
            v-for="item in datesType"
            :key="item.type"
            :class="[currentDate === item.type ? 'active-btn' : '', 'point-btn']"
            size="small"
            @click="handleDate(item)"
          >
            {{ item.label }}
          </a-button>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'UnitCard',
  props: {
    cardTitle: {
      type: String,
      default: ''
    },
    showTime: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      dateTime: moment(),
      monthFormat: 'YYYY-MM',
      currentDate: 'day',
      datesType: [
        {
          label: '日',
          type: 'day'
        },

        {
          label: '月',
          type: 'month'
        },
        {
          label: '年',
          type: 'year'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleDate(item) {
      this.currentDate = item.type;
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;

  .card-title {
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
  .card-content {
    width: 100%;
    height: calc(100% - 47px);
    position: relative;

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .date-btns {
        width: 100%;
        padding: 6px 10px 0 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
      }
      .date-box {
        width: 124px;
        margin-right: 8px;
      }
      .point-btn {
        width: 94px;
        height: 28px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;

        &:last-child {
          margin-right: 0px;
        }
      }
      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }

      .date-bg {
        /deep/ input {
          background: url('~@/assets/img/hz/ac-point.png') no-repeat;
          background-size: 100% 100%;
          font-family: Aliba, sans-serif;
          font-size: 18px;
          color: #9fcfff;
        }
        .i-drop {
          width: 24px;
          height: 24px;
          background: url('~@/assets/img/hz/d-dropdown.png') no-repeat;
          background-size: 100% 100%;
          margin-top: -11px;
        }
      }
    }
  }
}
</style>

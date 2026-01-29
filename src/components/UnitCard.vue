<!--
 * @Author: wangyr
 * @Date: 2023-05-30 13:40:08
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-12-05 15:52:11
 * @Description:
-->
<template>
  <div class="container">
    <div class="card-title" :class="[layoutFlag ? 'card-titles' : '', 'card-title' + cardType]">
      <div class="title"><gradientShadowText :text="cardTitle"></gradientShadowText></div>
      <a-icon v-if="showCloseBtn" type="close" style="font-size: 20px; margin-top: 10px; color: #fff" @click="close" />
      <div class="card-title__right">
        <slot name="headerRight"></slot>
      </div>
    </div>
    <div class="card-content">
      <div v-if="showTime" class="content-header" :class="layoutFlag ? 'card-headers' : ''">
        <div class="date-btns">
          <div class="date-box">
            <a-date-picker
              v-if="currentDate === 'day'"
              dropdownClassName="date__select"
              :allowClear="false"
              class="date-bg"
              v-model="dateTime"
            >
              <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
            </a-date-picker>
            <a-month-picker
              class="date-bg"
              v-model="dateTime"
              v-if="currentDate === 'month'"
              :allowClear="false"
              dropdownClassName="date__select"
              :format="monthFormat"
              placeholder="选择日期"
            >
              <template #suffixIcon>
                <div class="i-drop"></div>
              </template>
            </a-month-picker>
            <a-date-picker
              v-if="currentDate === 'year'"
              v-model="dateTime"
              mode="year"
              valueFormat="yyyy"
              dropdownClassName="date__select"
              :allowClear="false"
              class="date-bg"
              format="yyyy"
              :open="isopen"
              @openChange="openChange"
              @panelChange="
                value => {
                  dateTime = value;
                  isopen = false;
                }
              "
            >
              <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
            </a-date-picker>
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
import gradientShadowText from '@/components/gradientShadowText';

export default {
  name: 'UnitCard',
  props: {
    cardTitle: {
      type: String,
      default: ''
    },
    showCloseBtn: {
      type: Boolean,
      default: false
    },
    cardType: {
      type: String,
      default: '1'
    },
    showTime: {
      type: Boolean,
      default: false
    },
    layoutFlag: {
      type: Boolean,
      default: false
    }
  },
  components: { gradientShadowText },
  data() {
    return {
      isopen: false,
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
    close() {
      this.$emit('close');
    },
    handleDate(item) {
      this.currentDate = item.type;
    },
    openChange(status) {
      if (status) {
        this.isopen = true;
      } else {
        this.isopen = false;
      }
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
  .card-titles {
    width: 50%;
  }

  .card-title {
    position: relative;
    z-index: 9999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1px 0px 2px 24px;
    height: 32px;
    background: url('~@/assets/img/hz/card-title1.png') no-repeat;
    background-size: 100% 100%;
    &.card-title1 {
      background: url('~@/assets/img/hz/card-title1.png') no-repeat;
      background-size: 100% 100%;
    }
    &.card-title2 {
      background: url('~@/assets/img/hz/card-title2.png') no-repeat;
      background-size: 100% 100%;
    }
    &.card-title3 {
      background: url('~@/assets/img/hz/card-title3.png') no-repeat;
      background-size: 100% 100%;
    }
    &.card-title4 {
      background: url('~@/assets/img/smartProduct/subtitle1862.png') no-repeat;
      background-size: 100% 100%;
    }
    &.card-title5 {
      background: url('~@/assets/img/summaryOverview/fir_subtitle784.png') no-repeat;
      background-size: 100% 100%;
    }
    &.card-title6 {
      background: url('~@/assets/img/summaryOverview/fir_subtitle1072.png') no-repeat;
      background-size: 100% 100%;
    }
    &.card-title7 {
      background: url('~@/assets/img/summaryOverview/fir_subheadline320.png') no-repeat;
      background-size: 100% 100%;
    }
    &__right {
      position: absolute;
      right: 43px;
      z-index: 9999;
    }
    .title {
      margin-left: 20px;
      /deep/.gradient-shadow {
        .text {
          font-size: 22px;
          text-shadow: 2px 2px 2px #011529;
        }
        .text:before {
          /*覆盖文字的颜色*/
          color: #76a1f7;
          -webkit-mask: linear-gradient(to top, #76a1f7 28%, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 79%);
        }
      }
    }
  }
  .card-content {
    width: 100%;
    height: calc(100% - 32px);
    position: relative;
    .card-headers {
      width: 50%;
      position: absolute;
      right: -10px;
      top: -40px;
    }
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
        width: 160px;
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
<style lang="less">
.date__select {
  .ant-calendar {
    background: rgba(8, 55, 112, 0.8);
    border: none;
    .ant-calendar-month-select,
    .ant-calendar-year-select {
      color: #fff;
    }
    .ant-calendar-date {
      color: #fff;
    }

    .ant-calendar-table {
      color: #fff;
    }

    .ant-calendar-input,
    .ant-calendar-header,
    .ant-calendar-month-panel {
      background: rgba(8, 55, 112, 0.9);
      color: #fff;
    }
    // .ant-calendar-panel,.ant-calendar-date-panel{
    //         background: rgba(8, 55, 112, 1);
    // }
    .ant-calendar-month-panel-header,
    .ant-calendar-year-panel-header,
    .ant-calendar-year-panel,
    .ant-calendar-decade-panel,
    .ant-calendar-decade-panel-header {
      background: rgba(8, 55, 112, 1);
      color: #fff;
    }
    .ant-calendar-month-panel-month,
    .ant-calendar-decade-panel-decade,
    .ant-calendar-year-panel-year,
    .ant-calendar-month-panel-year-select,
    .ant-calendar-year-panel-decade-select {
      color: #d9f7ff;
    }
    .ant-calendar-header a:hover {
      background: #40a9ff;
    }
  }
}
</style>

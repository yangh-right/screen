<!--
 * @Author: wangyr
 * @Date: 2023-05-30 13:40:08
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-30 11:11:00
 * @Description:
-->
<template>
  <div class="container">
    <div class="card-title">
      <div class="title">{{ cardTitle }}</div>
      <div v-if="showTime" class="content-header">
        <div class="date-btns">
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
    </div>
    <div class="card-content">
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
    currentDate: {
      type: String,
      default: 'day'
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
      datesType: [
        {
          label: '周',
          type: 'day'
        },

        {
          label: '月',
          type: 'month'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleDate(item) {
      this.$emit('handleDate', item.type);
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
    background: url('~@/assets/img/carbonEmission/model_hd.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
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
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;

    .date-btns {
      width: 100%;
      padding: 6px 0px 0 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
    }
    .point-btn {
      width: 94px;
      height: 34px !important;
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
  }
  .card-content {
    width: 100%;
    height: calc(100% - 47px);
    position: relative;
  }
}
</style>

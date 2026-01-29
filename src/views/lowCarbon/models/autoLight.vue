<!--
 * @Author: wangyr
 * @Date: 2023-05-30 19:52:35
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-10 18:46:18
 * @Description:
-->
<template>
  <unit-card cardTitle="自动照明">
    <div class="card-inner">
      <div class="table-box">
        <div class="table-head">
          <div :style="{ flexBasis: item.width }" class="col" v-for="item in columns" :key="item.dataIndex + 'title'">
            {{ item.title }}
          </div>
        </div>

        <div class="table-body">
          <c-split v-if="tableData.length" class="split"></c-split>
          <div
            @click="selectAlarm(item)"
            v-for="(item, i) in tableData"
            :key="i"
            :class="['table-tr', item.isDanger ? 'table-tr--alarm' : '']"
          >
            <div
              :style="{ flexBasis: col.width }"
              :class="['col', col.dataIndex === 'temp' ? 'temp' : '']"
              v-for="col in columns"
              :key="col.dataIndex"
            >
              <span :title="item[col.dataIndex]">{{ item[col.dataIndex] }}</span>
            </div>
            <c-split class="split row-split"></c-split>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import cSplit from '@/components/split';
import moment from 'moment';
import { getPlanConfigPage } from '@/api/smartProduct';
export default {
  name: 'autoLight',
  components: {
    cSplit,
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
      alarmId: '',
      columns: [
        {
          dataIndex: 'index',
          title: '序号',
          width: '60px'
        },
        {
          dataIndex: 'planName',
          title: '计划名称',
          width: '121px'
        },
        {
          dataIndex: 'startTime',
          title: '计划开始时间',
          width: '183px'
        },
        {
          dataIndex: 'endTime',
          title: '计划结束时间',
          width: '183px'
        },
        {
          dataIndex: 'userName',
          title: '负责人',
          width: '100px'
        }
      ],
      scrollTimer: null,
      scrollDirection: 'down',
      tableData: [],
      alarmDetail: {}
    };
  },
  computed: {},
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true
    }
  },
  activated() {
    this.scrollFun();
  },
  methods: {
    selectAlarm(row) {},
    async initData() {
      let params = {
        page: {
          current: 1,
          size: 10000
        },
        planType: '6'
      };
      let { status, resultData } = await getPlanConfigPage(params);
      if (status === 'complete') {
        this.tableData = resultData?.records || [];
        this.tableData.forEach((v, i) => {
          v.index = i + 1;
          v.startTime = moment(v.startTime).format('YYYY-MM-DD 20:00');
          v.endTime = moment(v.endTime).format('YYYY-MM-DD 23:00');
        });
        // 表格内容滚动
        setTimeout(() => {
          this.scrollFun();
        }, 1000);
      }
    },
    // 自动滚动
    scrollFun() {
      if (this.tableData.length <= 6) {
        return false;
      }
      // 如果定时器存在
      if (this.scrollTimer) {
        // 则先清除
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
      this.scrollTimer = setInterval(() => {
        const scrollHeight = document.querySelectorAll(`.table-box .table-body`)[0].scrollHeight;
        const clientHeight = document.querySelectorAll(`.table-box .table-body`)[0].clientHeight;
        if (clientHeight === 0) {
          return false;
        }
        const scroll = scrollHeight - clientHeight;
        const scrollTop = document.querySelectorAll(`.table-box .table-body`)[0].scrollTop;
        // 向下滚动
        if (this.scrollDirection === 'down') {
          // 滚动速度
          const temp = scrollTop + 2;
          document.querySelectorAll(`.table-box .table-body`)[0].scrollTop = temp; // 滚动
          // 距离顶部高度  大于等于 滚动长度
          if (scroll <= temp) {
            clearInterval(this.scrollTimer);
            this.scrollTimer = null;
            document.querySelectorAll(`.table-box .table-body`)[0].scrollTop = 0;
            this.initData(this.waterPlantId);
          }
        }
      }, 300);
    },
    // 停止滚动
    pauseScroll() {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
    }
  },
  deactivated() {
    this.pauseScroll();
  },
  beforeDestroy() {
    this.pauseScroll();
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px 0;
  .table-box {
    overflow: hidden;
    width: 100%;
    height: 100%;

    .col {
      text-align: left;
      padding-left: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .table-head {
      height: 40px;
      display: flex;
      align-items: center;
      font-family: AlibabaPuHuiTiM, sans-serif;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
    }
    .split {
      &.row-split {
        position: absolute;
        bottom: 0;
      }
    }
    .table-body {
      width: 100%;
      height: calc(100% - 40px);
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0px;
      }
    }
    .table-tr {
      height: 40px;
      display: flex;
      font-family: AlibabaPuHuiTi-Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #bfd5ff;
      letter-spacing: 0;
      line-height: 40px;
      position: relative;
      &--alarm {
        background: url('~@/assets/img/smartSafe/row-temp.png') no-repeat;
        background-size: 100% 100%;
        .temp {
          color: #ff5a5a;
        }
      }
    }
  }
}
</style>

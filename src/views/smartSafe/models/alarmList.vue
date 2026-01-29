<!--
 * @Author: wangyr
 * @Date: 2023-05-30 19:52:35
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-10 18:46:18
 * @Description:
-->
<template>
  <unit-card cardTitle="门禁记录">
    <div class="card-inner">
      <div class="table-box">
        <div class="table-head">
          <div :style="{ flexBasis: item.width }" class="col" v-for="item in columns" :key="item.dataIndex + 'title'">
            {{ item.title }}
          </div>
        </div>
        <div class="table-body">
          <c-split v-if="tableData.length" class="split"></c-split>
          <div v-for="(item, i) in tableData" :key="i" :class="['table-tr']">
            <div
              :style="{ flexBasis: col.width }"
              :class="['col', col.dataIndex === 'temp' ? 'temp' : '']"
              v-for="col in columns"
              :key="col.dataIndex"
            >
              <span>{{ item[col.dataIndex] }}</span>
            </div>
            <c-split class="split row-split"></c-split>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import cSplit from '@/components/split';
import { getAccessRecord } from '@/api/smartProduct';
export default {
  name: 'alarmList',
  components: {
    cSplit,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns: [
        {
          dataIndex: 'index',
          title: '序号',
          width: '60px'
        },
        {
          title: '门禁名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          ellipsis: true,
          width: '160px'
        },
        {
          title: '操作动作',
          dataIndex: 'opName',
          key: 'opName',
          ellipsis: true,
          width: '120px'
        },
        {
          title: '结果',
          dataIndex: 'opResultName',
          key: 'opResultName',
          ellipsis: true,
          width: '70px'
        },
        {
          title: '操作时间',
          dataIndex: 'opTime',
          key: 'opTime',
          ellipsis: true,
          width: '150px'
        }
      ],
      scrollTimer: null,
      scrollDirection: 'down',
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 20
      }
    };
  },
  computed: {},
  watch: {},
  async created() {
    await this.initData();
  },
  activated() {
    this.scrollFun();
  },
  methods: {
    async initData() {
      const params = {
        ...this.page,
        productCode: 'water_purification',
        startTime: moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59')
      };
      let { status, resultData } = await getAccessRecord(params);
      if (status === 'complete') {
        this.tableData = resultData.map((item, index) => {
          return {
            ...item,
            opTime: moment(item.opTime).format('YYYY-MM-DD HH:mm'),
            index: index + 1
          };
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
            this.initData();
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
  display: flex;

  .table-box {
    flex: 1;
    overflow: hidden;
    width: 100%;
    height: 100%;
    .col {
      text-align: left;
      padding-left: 8px;
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

      &--seleced {
        background: url('~@/assets/img/smartSafe/row-alarm.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>

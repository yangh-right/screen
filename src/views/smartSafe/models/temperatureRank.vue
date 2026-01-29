<!--
 * @Author: wangyr
 * @Date: 2023-05-30 19:52:35
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-08 17:09:14
 * @Description:
-->
<template>
  <unit-card cardTitle="危化品管理">
    <div class="card-inner">
      <div class="table-box">
        <div class="table-head">
          <div :style="{ flexBasis: item.width }" class="col" v-for="item in columns" :key="item.dataIndex + 'title'">
            {{ item.title }}
          </div>
        </div>
        <div class="table-body">
          <c-split v-if="tableData.length" class="split"></c-split>
          <div v-for="(item, i) in tableData" :key="i" :class="['table-tr', !i ? 'table-tr--alarm' : '']">
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
import cSplit from '@/components/split';
import { hazardousChemicalsPage, wasteLiquidsCount } from '@/api/smartProduct';
export default {
  name: 'temperatureRank',
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
          width: '100px'
        },
        {
          dataIndex: 'type',
          title: '类型',
          width: '320px'
        },
        {
          dataIndex: 'count',
          title: '数量',
          width: '170px'
        }
      ],
      tableData: []
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
  methods: {
    // 初始化数据
    async initData() {
      const promises = [hazardousChemicalsPage({ page: { current: 1, size: 10000 } }), wasteLiquidsCount({})];
      let res = await Promise.allSettled(promises);
      this.tableData = [];
      res.forEach((item, i) => {
        if (!i) {
          let count = item?.value?.resultData?.total;
          this.tableData.push({
            index: '01',
            type: '危险药剂',
            count: count ? `${count}种` : ''
          });
        } else {
          let records = item?.value?.resultData || [];
          let tempData = records.length > 5 ? records.slice(0, 5) : records;
          tempData.forEach((data, index) => {
            this.tableData.push({
              index: index < 8 ? `0${index + 2}` : index + 2,
              type: data.key,
              count: data.value ? `${data.value}种` : ''
            });
          });
        }
      });
    }
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
      padding-left: 20px;
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

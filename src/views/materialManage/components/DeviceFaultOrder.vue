<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-10 16:24:11
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="chart-btns">
        <div
          v-for="item in pointsArr"
          :key="item.materielId"
          :class="[currentPoint === item.materielId ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item.materielId)"
        >
          {{ item.materielName }}
        </div>
      </div>
      <div class="table-block">
        <dv-scroll-board :config="config" ref="scrollBoard" style="width: 100%; height: 197px"></dv-scroll-board>
      </div>
    </div>
  </div>
</template>

<script>
import { getTopMaterialType, getMaterielList } from '@/api/materialManage';
export default {
  name: 'InWaterQuality',
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
      cardTitle: '进水水质',
      currentPoint: 'jsc_COD',
      config: {
        waitTime: 200000,
        header: ['名称', '规格', '材质', '单位', '类别', '所属仓库', '仓库编号', '安全库存', '货架号'],
        data: [],
        rowNum: 5,
        headerHeight: 30,
        index: true,
        indexHeader: '序号',
        align: ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center']
      },
      pointsArr: []
    };
  },
  watch: {},
  methods: {
    async initData() {
      const { success, resultData } = await getTopMaterialType();
      if (success && Array.isArray(resultData) && resultData.length > 0) {
        this.pointsArr = resultData?.map(item => {
          return {
            materielName: item.materielTypeName,
            materielId: item.materielTypeNo
          };
        });
        this.currentPoint = this.pointsArr[0].materielId;
        this.handleChart(this.currentPoint);
      }
    },
    handleChange(val) {
      this.currentPoint = val;
      this.handleChart(val);
    },
    async handleChart(pointData) {
      let data = {
        materielTypeNo: pointData,
        subTypeTree: true
      };
      const { success, resultData } = await getMaterielList(data);
      if (success) {
        this.config.data = resultData.records?.map(item => {
          return [
            item.materielName,
            item.specification,
            item.stuff,
            item.unit,
            item.materielTypeName,
            item.depotName,
            item.depotNo,
            item.minInventory,
            item.shelfNo
          ];
        });
        this.$refs['scrollBoard'].updateRows(this.config.data);
      }
    }
  },
  mounted() {
    this.initData();
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(18, 61, 132, 0.4);
  left: 3px;

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

    .chart-btns {
      padding: 8px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      position: absolute;
      top: -45px;
      right: -20px;
      justify-content: flex-end;
      width: 70%;

      .point-btn {
        height: 34px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;
        line-height: 34px;
        cursor: pointer;
        padding: 0 8px;
      }

      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }

    .table-block {
      width: 100%;
      height: 214px;
      padding: 6px 12px 0;
      box-sizing: border-box;
      background: linear-gradient(180deg, rgb(3 43 87 / 86%) 36%, rgb(117 167 233 / 15%) 100%);

      /deep/.dv-scroll-board .header {
        height: 33px;
        background-size: 100% 100%;
        background-color: transparent !important;
      }

      /deep/.dv-scroll-board .header .header-item {
        padding: 0 !important;
        color: #d9f7ff;
        flex: 1 0 auto;
        width: 10.3% !important;
      }

      /deep/.dv-scroll-board .rows .row-item {
        height: 30px !important;
        line-height: 30px !important;
        margin-top: 4px;
        background: linear-gradient(90deg, rgb(13 66 122 / 69%) 36%, rgb(58 97 153 / 11%) 100%);
        background-size: 100% 100%;
        background-color: transparent !important;
      }

      /deep/.dv-scroll-board .rows .ceil {
        flex: 1 0 auto;
        padding: 0 !important;
        color: #d9f7ff;
        width: 10.3% !important;
      }

      /deep/.dv-scroll-board .rows .index {
        display: inline-block;
        width: 27px;
        height: 25px;
        line-height: 25px;
        box-shadow: 12.5px 12.5px 10px rgba(0, 0, 0, 0.035), 100px 100px 80px rgba(0, 0, 0, 0.07);
        background: linear-gradient(40deg, rgb(32 103 182 / 86%) 36%, rgb(102 150 214 / 15%) 100%);
        background-size: 100% 100%;
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 14px;
        color: #f5faff;
        text-align: center;
        background-color: transparent !important;
      }
    }
  }
}
</style>

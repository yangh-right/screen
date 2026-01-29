<!--
 * @Description:
 * @version:
 * @Author: fengtaotao
 * @Date: 2023-05-23 14:29:38
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-25 09:28:05
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <a-spin :spinning="loading" class="spin">
      <div v-if="pointsArr.length > 0" class="card-wrapper">
        <div
          v-for="item in pointsArr"
          :key="item.pointMemo"
          :style="{
            'background-image': `url(` + bgImgObj[item.pointName] + `)`,
            'background-size': '100% 100%'
          }"
          class="card-item"
        >
          <div class="card-content">
            <div class="point-box">
              <div class="point-name">纳什系数</div>
              <div class="point-val">{{ item.nSE }}</div>
            </div>
            <div class="point-box">
              <div class="point-name">精度要求</div>
              <div class="point-val">>{{ item.accuracy }}</div>
            </div>
          </div>
        </div>
      </div>
      <a-empty v-else class="empty" :description="false"></a-empty>
    </a-spin>
  </div>
</template>
<script>
export default {
  name: 'ModuleEstimate',
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
  components: {},
  data() {
    return {
      loading: false,
      currentParams: '',
      bgImgObj: {
        jsc_ad: require('@/assets/img/hz/jsc_ad.png'),
        jsc_COD: require('@/assets/img/hz/jsc_COD.png'),
        jsc_SS: require('@/assets/img/hz/jsc_SS.png'),
        jsc_TN: require('@/assets/img/hz/jsc_TN.png'),
        jsc_TP: require('@/assets/img/hz/jsc_TP.png'),
        jsc_come: require('@/assets/img/hz/jsc_come.png')
      },
      pointsArr: [
        {
          accuracy: '0.5',
          dataList: [],
          deviceId: '20230828011',
          nSE: '0.95',
          pointMemo: '进水',
          pointName: 'jsc_come',
          unit: 'mg/L'
        },
        {
          accuracy: '0.5',
          dataList: [],
          deviceId: '20230828011',
          nSE: '0.95',
          pointMemo: 'COD',
          pointName: 'jsc_COD',
          unit: 'mg/L'
        },
        // {
        //   accuracy: '0.5',
        //   dataList: [],
        //   deviceId: '20230828011',
        //   nSE: '0.49',
        //   pointMemo: 'BOD',
        //   pointName: 'BOD',
        //   unit: 'mg/L'
        // },
        {
          accuracy: '0.5',
          dataList: [],
          deviceId: '20230828011',
          nSE: '0.95',
          pointMemo: 'NH3-N',
          pointName: 'jsc_ad',
          unit: 'mg/L'
        },
        {
          accuracy: '0.5',
          dataList: [],
          deviceId: '20230828011',
          nSE: '0.96',
          pointMemo: 'TN',
          pointName: 'jsc_TN',
          unit: 'mg/L'
        },
        {
          accuracy: '0.5',
          dataList: [],
          deviceId: '20230828011',
          nSE: '0.96',
          pointMemo: 'TP',
          pointName: 'jsc_TP',
          unit: 'mg/L'
        },
        {
          accuracy: '0.5',
          dataList: [],
          deviceId: '20230828011',
          nSE: '0.96',
          pointMemo: 'SS',
          pointName: 'jsc_SS',
          unit: 'mg/L'
        }
      ]
    };
  },
  watch: {},
  methods: {}
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
  .spin {
    height: calc(100% - 50px);
  }
  .card-wrapper {
    height: 100%;
    padding: 12px 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-flow: wrap;
    overflow: auto;
    .card-item {
      width: calc(50% - 8px);
      height: 60px;
      padding: 8px 12px 8px 70px;
      box-sizing: border-box;
      .card-content {
        display: flex;
        justify-content: space-between;

        .point-box {
          .point-name {
            font-family: PingFangSC, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #93a4b8;
            letter-spacing: 0.3px;
            line-height: 20px;
          }
          .point-val {
            font-family: MiSans-DNaNpxibold, sans-serif;
            font-weight: 600;
            font-size: 16px;
            color: #ffffff;
            text-shadow: 0 0 6px #005aff;
          }
        }
      }
    }
  }
  /deep/ .ant-spin-container {
    height: 100%;
  }
  .empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

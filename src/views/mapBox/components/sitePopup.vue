<!--
 * @Author: limz
 * @Date: 2022-07-12 16:07:21
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-25 13:26:01
 * @Description: popup
-->
<template>
  <div v-if="site.isShow" class="site-popup">
    <div :class="['site-popup-inner']">
      <div class="flow-name">
        <div class="pump-name pump-station">
          {{ site.dsStationCoordinateVO.stationName ? site.dsStationCoordinateVO.stationName : '--' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SitePopup',
  computed: {},
  data() {
    return {
      pointInfo: [
        {
          title: '管网压力',
          dataIndex: 'PipePressure',
          unit: 'MPa'
        },
        {
          title: '电池电压',
          dataIndex: 'BatteryVoltage',
          unit: 'V'
        },
        {
          title: '信号强度',
          dataIndex: 'SignalStrength',
          unit: 'dbm'
        }
      ],
      flowArr: [
        {
          title: '瞬时流量',
          dataIndex: 'OutletInstantaneousFlow',
          unit: 'm³'
        },
        {
          title: '出口压力',
          dataIndex: 'OutletPressure',
          unit: 'MPa'
        }
      ],
      powerArr: [
        {
          title: '累计流量',
          dataIndex: 'CumulativeFlow',
          unit: 'm³'
        },
        {
          title: '瞬时流量',
          dataIndex: 'InstantaneousFlow',
          unit: 'm³'
        }
      ]
    };
  },
  mounted() {
    // console.log('ggg', this.site);
  }
};
</script>

<style lang="less" scoped>
.site-popup {
  cursor: pointer;

  &-inner {
    position: relative;
    border-radius: 4px;
    .flow-name {
      width: 230px;
      text-align: center;
      margin-right: 0;
      margin-left: -22%;
      margin-top: 20px;
      padding: 0 0 12px 0;
      box-sizing: border-box;
      position: relative;
      padding-bottom: 80px;

      .pump-name {
        min-width: 140px;
        height: 75px;
        line-height: 66px;
        padding: 0 30px;
        box-sizing: border-box;
        text-align: center;
        background: url(~@assets/img/blu-name.png) no-repeat;
        background-size: 100% 100%;
        font-family: PingFangSC-Medium, sans-serif;
        font-weight: 500;
        font-size: 14px;
        color: #f5faff;
        letter-spacing: 0;
        position: absolute;
        left: 50px;
        bottom: -6px;
      }
      .pump-station {
        background: url(~@assets/img/pup-name.png) no-repeat;
        background-size: 100% 100%;
      }
      .core-station {
        background: url(~@assets/img/gray-name.png) no-repeat;
        background-size: 100% 100%;
      }
      .power-name {
        width: 180px;
        height: 32px;
        line-height: 32px;
        padding: 0 16px;
        box-sizing: border-box;
        text-align: center;
        background: url(~@assets/img/pump_name.png) no-repeat;
        background-size: 100% 100%;
        font-family: PingFangSC-Medium, sans-serif;
        font-weight: 500;
        font-size: 14px;
        color: #f5faff;
        letter-spacing: 0;
        position: absolute;
        left: 29px;
        bottom: 25px;
      }

      .point-title {
        height: 30px;
        line-height: 38px;
        font-family: PingFangSC-Medium, sans-serif;
        font-weight: 500;
        padding-left: 20px;
        box-sizing: border-box;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: left;
        background: url(~@assets/img/point_ti.png) no-repeat;
        background-size: 100% 100%;
      }
      .point-row {
        width: 100%;
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: url(~@assets/img/point_ct.png) no-repeat;
        background-size: 100% 100%;
        padding: 0 8px 0 8px;
        box-sizing: border-box;

        .point-name {
          width: 80px;
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 12px;
          color: #a7b2ce;
          letter-spacing: 0.89px;
          text-align: left;
        }
        .ponit-val {
          font-family: Bebas, sans-serif;
          font-size: 12px;
          color: #ffffff;
          letter-spacing: 0.89px;
          text-align: right;
        }
        .unit {
          width: auto;
          display: inline-block;
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 12px;
          color: #a7b2ce;
          letter-spacing: 0;
          font-style: normal;
          margin-left: 4px;
        }
      }

      .point-row:last-of-type {
        padding-bottom: 12px;
        box-sizing: border-box;
        height: 44px;
        background: url(~@assets/img/point_bt.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>

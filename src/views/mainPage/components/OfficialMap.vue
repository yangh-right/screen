<template>
  <div class="map-box" ref="map-box">
    <!-- 百度地图 -->
    <BaiduMap ref="bmap" :key="0" :dataSource="siteData" :siteType="siteType" :MapKey="MapKey" :gxFlag="gxFlag" />
  </div>
</template>

<script>
import BaiduMap from './map/baiduMap.vue';

// 加压泵站
let ic_pump_normal = require('@/assets/img/hz/station.png');
let ic_station_normal = require('@/assets/img/station_bg.png');

// 压力监测点
let ic_pressure_normal = require('@/assets/img/hz/station.png');
// 流量监测点
let ic_flow_normal = require('@/assets/img/hz/station.png');

export default {
  name: 'MainMap',
  components: {
    BaiduMap
  },
  props: {
    MapKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      siteType: ['1', '2', '3', '4'],
      siteData: [
        {
          // stationName: '监测点03',
          dsStationCoordinateVO: {
            addr: '陕西省榆林市神木市G338',
            areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
            areaName: '神木杨伙盘',
            bd09: '110.490073,39.01201',
            bsAreaId: 2566,
            bsCityId: 316,
            bsProvinceId: 27,
            delFlag: 0,
            dsStationProductParamsVOList: [
              {
                areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
                areaName: '神木杨伙盘',
                dsStationTypeId: '1632292317329100801',
                dsStationTypeName: '加压泵站',
                expendJson: null,
                productCode: 'secondary_water_supply',
                productName: '智慧供水'
              }
            ],
            dsStationTypeId: '1632292317329100801',
            gcj02: null,
            id: '1634111266324746242',
            labelId: null,
            level: null,
            longi: 120.12290361213249,
            lati: 30.388702941196662,
            orderIndex: 1,
            orgId: '3d8402af48557b90d759e76c1f9b0323',
            orgName: '神木杨伙盘',
            productCode: 'secondary_water_supply',
            remark: null,
            shorthand: 'hycejz',
            stationCode: '2303000301',
            stationName: '永康污水厂',
            stationTypeName: '加压泵站',
            tenantId: '4163079cf6729cfd9c6dad3467009995',
            wgs84: null,
            xy: null
          },
          isShowPopup: false,
          isShow: true,
          name: 1,
          isShifting: false,
          longi: 120.1952752469831,
          lati: 30.395794931926403,
          lnglat: [30.388702941196662, 120.12290361213249],
          stationType: '3',
          pointInfo: {
            出口压力: '1.73 Mpa',
            '1#水池液位': '4.87 m',
            '2#水池液位': '4.86 m',
            出口瞬时流量: '181.55 m³/h',
            出口累计流量: '1234733.75 m³',
            累计有功总电能: '306810.0 kWh'
          }
        },
        {
          // stationName: '监测点03',
          dsStationCoordinateVO: {
            addr: '陕西省榆林市神木市G338',
            areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
            areaName: '神木杨伙盘',
            bd09: '110.490073,39.01201',
            bsAreaId: 2566,
            bsCityId: 316,
            bsProvinceId: 27,
            delFlag: 0,
            dsStationProductParamsVOList: [
              {
                areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
                areaName: '神木杨伙盘',
                dsStationTypeId: '1632292317329100801',
                dsStationTypeName: '加压泵站',
                expendJson: null,
                productCode: 'secondary_water_supply',
                productName: '智慧供水'
              }
            ],
            dsStationTypeId: '1632292317329100801',
            gcj02: null,
            id: '1634111266324746242',
            labelId: null,
            level: null,
            longi: 120.18616256,
            lati: 30.40210702,
            orderIndex: 1,
            orgId: '3d8402af48557b90d759e76c1f9b0323',
            orgName: '神木杨伙盘',
            productCode: 'secondary_water_supply',
            remark: null,
            shorthand: 'hycejz',
            stationCode: '2303000301',
            stationName: '崇贤污水厂',
            stationTypeName: '加压泵站',
            tenantId: '4163079cf6729cfd9c6dad3467009995',
            wgs84: null,
            xy: null
          },
          name: 2,
          isShow: true,
          isShifting: false,
          longi: 120.16104771300135,
          lati: 30.42229963793815,
          lnglat: [30.40210702, 120.18616256],
          stationType: '3',
          pointInfo: {
            出口压力: '1.73 Mpa',
            '1#水池液位': '4.87 m',
            '2#水池液位': '4.86 m',
            出口瞬时流量: '181.55 m³/h',
            出口累计流量: '1234733.75 m³',
            累计有功总电能: '306810.0 kWh'
          }
        },
        {
          // stationName: '监测点03',
          dsStationCoordinateVO: {
            addr: '陕西省榆林市神木市G338',
            areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
            areaName: '神木杨伙盘',
            bd09: '110.490073,39.01201',
            bsAreaId: 2566,
            bsCityId: 316,
            bsProvinceId: 27,
            delFlag: 0,
            dsStationProductParamsVOList: [
              {
                areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
                areaName: '神木杨伙盘',
                dsStationTypeId: '1632292317329100801',
                dsStationTypeName: '加压泵站',
                expendJson: null,
                productCode: 'secondary_water_supply',
                productName: '智慧供水'
              }
            ],
            dsStationTypeId: '1632292317329100801',
            gcj02: null,
            id: '1634111266324746242',
            labelId: null,
            level: null,
            longi: 120.17673621,
            lati: 30.36515744,
            orderIndex: 1,
            orgId: '3d8402af48557b90d759e76c1f9b0323',
            orgName: '神木杨伙盘',
            productCode: 'secondary_water_supply',
            remark: null,
            shorthand: 'hycejz',
            stationCode: '2303000301',
            stationName: '杭钢泵站',
            stationTypeName: '加压泵站',
            tenantId: '4163079cf6729cfd9c6dad3467009995',
            wgs84: null,
            xy: null
          },
          name: 0,
          isShow: true,
          isShifting: false,
          longi: 120.17653842225103,
          lati: 30.372891560207535,
          lnglat: [30.36515744, 120.17673621],
          stationType: '3',
          pointInfo: {
            出口压力: '1.73 Mpa',
            '1#水池液位': '4.87 m',
            '2#水池液位': '4.86 m',
            出口瞬时流量: '181.55 m³/h',
            出口累计流量: '1234733.75 m³',
            累计有功总电能: '306810.0 kWh'
          }
        },
        {
          // stationName: '监测点03',
          dsStationCoordinateVO: {
            addr: '陕西省榆林市神木市G338',
            areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
            areaName: '神木杨伙盘',
            bd09: '110.490073,39.01201',
            bsAreaId: 2566,
            bsCityId: 316,
            bsProvinceId: 27,
            delFlag: 0,
            dsStationProductParamsVOList: [
              {
                areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
                areaName: '神木杨伙盘',
                dsStationTypeId: '1632292317329100801',
                dsStationTypeName: '加压泵站',
                expendJson: null,
                productCode: 'secondary_water_supply',
                productName: '智慧供水'
              }
            ],
            dsStationTypeId: '1632292317329100801',
            gcj02: null,
            id: '1634111266324746242',
            labelId: null,
            level: null,
            longi: 120.14605089,
            lati: 30.35251152,
            orderIndex: 1,
            orgId: '3d8402af48557b90d759e76c1f9b0323',
            orgName: '神木杨伙盘',
            productCode: 'secondary_water_supply',
            remark: null,
            shorthand: 'hycejz',
            stationCode: '2303000301',
            stationName: '3-4号泵站',
            stationTypeName: '加压泵站',
            tenantId: '4163079cf6729cfd9c6dad3467009995',
            wgs84: null,
            xy: null
          },
          name: 0,
          isShow: true,
          isShifting: false,
          longi: 120.13374370847016,
          lati: 30.366799208760817,
          lnglat: [30.35251152, 120.14605089],
          stationType: '3',
          pointInfo: {
            出口压力: '1.73 Mpa',
            '1#水池液位': '4.87 m',
            '2#水池液位': '4.86 m',
            出口瞬时流量: '181.55 m³/h',
            出口累计流量: '1234733.75 m³',
            累计有功总电能: '306810.0 kWh'
          }
        },
        {
          // stationName: '监测点03',
          dsStationCoordinateVO: {
            addr: '陕西省榆林市神木市G338',
            areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
            areaName: '神木杨伙盘',
            bd09: '110.490073,39.01201',
            bsAreaId: 2566,
            bsCityId: 316,
            bsProvinceId: 27,
            delFlag: 0,
            dsStationProductParamsVOList: [
              {
                areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
                areaName: '神木杨伙盘',
                dsStationTypeId: '1632292317329100801',
                dsStationTypeName: '加压泵站',
                expendJson: null,
                productCode: 'secondary_water_supply',
                productName: '智慧供水'
              }
            ],
            dsStationTypeId: '1632292317329100801',
            gcj02: null,
            id: '1634111266324746242',
            labelId: null,
            level: null,
            longi: 120.15968412,
            lati: 30.33276935,
            orderIndex: 1,
            orgId: '3d8402af48557b90d759e76c1f9b0323',
            orgName: '神木杨伙盘',
            productCode: 'secondary_water_supply',
            remark: null,
            shorthand: 'hycejz',
            stationCode: '2303000301',
            stationName: '3-5号泵站',
            stationTypeName: '加压泵站',
            tenantId: '4163079cf6729cfd9c6dad3467009995',
            wgs84: null,
            xy: null
          },
          name: 0,
          isShow: true,
          isShifting: false,
          longi: 120.15353613706353,
          lati: 30.330867233891123,
          lnglat: [30.33276935, 120.15968412],
          stationType: '3',
          pointInfo: {
            出口压力: '1.73 Mpa',
            '1#水池液位': '4.87 m',
            '2#水池液位': '4.86 m',
            出口瞬时流量: '181.55 m³/h',
            出口累计流量: '1234733.75 m³',
            累计有功总电能: '306810.0 kWh'
          }
        },
        {
          // stationName: '监测点03',
          dsStationCoordinateVO: {
            addr: '陕西省榆林市神木市G338',
            areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
            areaName: '神木杨伙盘',
            bd09: '110.490073,39.01201',
            bsAreaId: 2566,
            bsCityId: 316,
            bsProvinceId: 27,
            delFlag: 0,
            dsStationProductParamsVOList: [
              {
                areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
                areaName: '神木杨伙盘',
                dsStationTypeId: '1632292317329100801',
                dsStationTypeName: '加压泵站',
                expendJson: null,
                productCode: 'secondary_water_supply',
                productName: '智慧供水'
              }
            ],
            dsStationTypeId: '1632292317329100801',
            gcj02: null,
            id: '1634111266324746242',
            labelId: null,
            level: null,
            longi: 120.17922694,
            lati: 30.33792145,
            orderIndex: 1,
            orgId: '3d8402af48557b90d759e76c1f9b0323',
            orgName: '神木杨伙盘',
            productCode: 'secondary_water_supply',
            remark: null,
            shorthand: 'hycejz',
            stationCode: '2303000301',
            stationName: '北景园泵站',
            stationTypeName: '加压泵站',
            tenantId: '4163079cf6729cfd9c6dad3467009995',
            wgs84: null,
            xy: null
          },
          name: 0,
          isShow: true,
          isShifting: false,
          longi: 120.17450037820315,
          lati: 30.331937985213756,
          lnglat: [30.33792145, 120.17922694],
          stationType: '3',
          pointInfo: {
            出口压力: '1.73 Mpa',
            '1#水池液位': '4.87 m',
            '2#水池液位': '4.86 m',
            出口瞬时流量: '181.55 m³/h',
            出口累计流量: '1234733.75 m³',
            累计有功总电能: '306810.0 kWh'
          }
        },
        {
          // stationName: '监测点03',
          dsStationCoordinateVO: {
            addr: '陕西省榆林市神木市G338',
            areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
            areaName: '神木杨伙盘',
            bd09: '110.490073,39.01201',
            bsAreaId: 2566,
            bsCityId: 316,
            bsProvinceId: 27,
            delFlag: 0,
            dsStationProductParamsVOList: [
              {
                areaId: '14a3c1781a6505aa0b3a5caa7e0ec532',
                areaName: '神木杨伙盘',
                dsStationTypeId: '1632292317329100801',
                dsStationTypeName: '加压泵站',
                expendJson: null,
                productCode: 'secondary_water_supply',
                productName: '智慧供水'
              }
            ],
            dsStationTypeId: '1632292317329100801',
            gcj02: null,
            id: '1634111266324746242',
            labelId: null,
            level: null,
            longi: 120.22986608196061,
            lati: 30.353655564674973,
            orderIndex: 1,
            orgId: '3d8402af48557b90d759e76c1f9b0323',
            orgName: '神木杨伙盘',
            productCode: 'secondary_water_supply',
            remark: null,
            shorthand: 'hycejz',
            stationCode: '2303000301',
            stationName: '临丁路泵站',
            stationTypeName: '加压泵站',
            tenantId: '4163079cf6729cfd9c6dad3467009995',
            wgs84: null,
            xy: null
          },
          name: 0,
          isShow: true,
          isShifting: false,
          longi: 120.22986608196061,
          lati: 30.353655564674973,
          lnglat: [30.35439137, 120.23604994],
          stationType: '3',
          pointInfo: {
            出口压力: '1.73 Mpa',
            '1#水池液位': '4.87 m',
            '2#水池液位': '4.86 m',
            出口瞬时流量: '181.55 m³/h',
            出口累计流量: '1234733.75 m³',
            累计有功总电能: '306810.0 kWh'
          }
        }
      ],
      gxFlag: false
    };
  },
  created() {
    this.siteData.forEach((site, index) => {
      site.icon = this.setSiteTypeIcon(site);
    });
  },
  methods: {
    // 设置地图icon
    setSiteTypeIcon(site) {
      let siteIcon = '';
      if (site.stationType === '1') {
        // 压力监测点
        siteIcon = ic_pressure_normal;
      } else if (site.stationType === '2') {
        // 流量监测点
        siteIcon = ic_flow_normal;
      } else if (site.stationType === '3') {
        // 加压泵站
        siteIcon = ic_station_normal;
      } else if (site.stationType === '4') {
        // 供电泵站
        siteIcon = ic_pump_normal;
      }
      return siteIcon;
    }
  }
};
</script>

<style lang="less" scoped>
.map-box {
  height: 100%;
  width: 100%;
}
</style>

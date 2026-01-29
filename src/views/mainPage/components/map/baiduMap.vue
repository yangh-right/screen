<!--
 * @Author: wangyr
 * @Date: 2023-03-17 08:50:37
 * @LastEditors: wangyr
 * @LastEditTime: 2024-08-21 10:35:46
 * @Description:
-->
<template>
  <div class="mapCmp">
    <div class="mapCmp-main">
      <!-- 全屏地图 -->
      <a-spin v-if="spinning" size="large" class="spinStyle"></a-spin>
      <div id="mapContain" class="map-container" ref="allmap"></div>
    </div>
  </div>
</template>

<script>
import loadBMap from '@/common/js/tool/BMap.js';
import mapStyleJson from '@/common/js/config/mapStyleJson.js';
import bmapLibs from 'bmap-libs';
import { GB, AddPopup } from './tools';
import geojson from './geojson.js';
let arrow1 = require('@/assets/img/flow-arr1.png');
let arrow2 = require('@/assets/img/flow-arr2.png');
let arrow3 = require('@/assets/img/flow-arr3.png');
let arrow4 = require('@/assets/img/flow-arr4.png');
let arrow5 = require('@/assets/img/flow-arr5.png');
let ic_station_normal = require('@/assets/img/station_bg.png');
let ic_station_normal1 = require('@/assets/img/station_bg1.png');
let ic_station_normal2 = require('@/assets/img/station_bg2.png');
export default {
  name: 'BaiduMap',
  components: {},
  props: {
    MapKey: {
      type: String,
      default: ''
    },
    dataSource: {
      // 地图所需的站点数据
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },
    gxFlag: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      }
    },
    isShowPopup: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    // 站点图例
    siteType: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      newMap: null,
      view: null,
      iconList: [ic_station_normal, ic_station_normal1, ic_station_normal2],
      lineLayer: null,
      markerLayer: [], // 标注
      fillLayers: [], // 管线
      multiPolyline: [],
      arrows: [arrow1, arrow1, arrow2, arrow5, arrow4, arrow3, arrow4],
      spinning: true,
      timer1: null,
      timer2: null
    };
  },
  computed: {},
  watch: {
    // MapKey: {
    //   handler(val) {
    //     if (val) {
    //       this.toInitMap(val);
    //     }
    //   }
    // },
    dataSource: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.timer1 = null;
          this.timer1 = setTimeout(() => {
            this.toAddStation();
          }, 100);
        }
      },
      immediate: true
    }
  },
  methods: {
    // 初始化地图
    toInitMap(ak) {
      loadBMap(ak, 'webgl').then(() => {
        this.$refs.allmap.style.height = '100%';
        this.newMap = new BMapGL.Map(this.$refs.allmap, {
          enableMapClick: false,
          poiText: true
        });
        // 监听地图加载完成事件
        this.newMap.addEventListener('tilesloaded', () => {
          this.spinning = false;
        });
        // 个性化地图
        this.newMap.setMapStyleV2({
          styleJson: mapStyleJson
        });
        let pointLongiAndLati = new BMapGL.Point(120.18923537, 30.39730649);
        this.newMap.centerAndZoom(pointLongiAndLati);
        this.newMap.setZoom(13.6);
        // 初始化地图实例
        this.newMap.enableScrollWheelZoom(true);
        // 构建地图之前 清除之前的图层；
        this.newMap && this.newMap.clearOverlays();
        // 绘制分区
        this.toAddDrawZone();
        // 百度地图库加载完毕后初始化
        bmapLibs();
      });
    },
    // 加载地图瓦片
    toAddDrawZone() {
      // 绘制区域
      let bgColors = ['#48c9b0', '#f5ec9e', '#F8E71C', '#4A90E2', '#9013FE', '#9B9B9B', '#BD10E0'];

      geojson.hzjs['features'].forEach((area, i) => {
        let pointArray = area.geometry['coordinates'][0].map(item => {
          return new BMapGL.Point(item[0], item[1]);
        });
        var ply = new BMapGL.Polygon(pointArray, {
          fillColor: '#00AEFF',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#00C5FF'
        }); // 建立多边形覆盖物
        this.newMap.addOverlay(ply);
        pointArray = pointArray.concat(ply.getPath());
      });

      // 绘制线段
      let strokeColors = ['#F33EFF','#F33EFF','#04FF95','#FFAD20','#04FF95','#F33EFF','#04FF95']
      geojson.gx[0].features.forEach((item, i) => {
        let points = item.geometry.coordinates;
        var polyline = new BMapGL.Polyline(
          points.map(p => new BMapGL.Point(p[0], p[1])),
          {
            sequence: true,
            // strokeTexture: {
            //   url: this.arrows[i],
            //   width: 8, // 图片的宽度
            //   height: 64 // 图片的高度
            // },
            strokeColor: strokeColors[i],
            strokeStyle: 'dashed',
            strokeWeight: 5,
            strokeOpacity: 1
          }
        );
        this.newMap.addOverlay(polyline);
      });
    },
    // 加载所需的
    toAddStation() {
      // 加载之前清除站点;
      if (this.markerLayer) {
        this.markerLayer.forEach(marker => {
          this.newMap.removeOverlay(marker);
        });
      }
      this.markerLayer = [];
      this.newMap &&
        this.dataSource &&
        this.dataSource.forEach((item, index) => {
          if (item.stationType === '3') {
            // 加压泵站
            item.icon = this.iconList[item.name];
          }
          this.addMarker(item);
        });
    },
    addLineStation() {
      // 加载之前清除站点;
      if (this.fillLayers) {
        this.fillLayers.forEach(marker => {
          this.newMap.removeOverlay(marker);
        });
      }
      this.fillLayers = [];
    },
    // 创建标注和弹框
    addMarker(site) {
      const point = new BMapGL.Point(site.longi, site.lati);
      const div = document.createElement('div');
      const img = document.createElement('img');
      div.style.width = '52px';
      div.style.height = '64px';
      div.className = `site_siteGroup${site.stationType}`;
      img.src = site.icon;
      img.style['-webkit-user-drag'] = 'none'; // 禁止拖拽
      div.appendChild(img);

      const marker = new BMapGLLib.Marker(point, div, {
        zIndex: 6,
        offset: new BMapGL.Size(0, 20)
      });
      marker.data = {
        type: site.stationType,
        idDevice: site.pointInfo,
        siteGroup: site.stationType
      };
      // 创建popup
      let popupEl = AddPopup(GB.sitePopupConstructor, { site }, this);

      const popup = new BMapGLLib.Popup(popupEl, {
        zIndex: 8,
        offset: new BMapGL.Size(40, 30),
        visible: true
      });
      popup.data = {
        site: site
      };

      // marker.on('click', e => {
      //   if (marker.isPopupOpen()) {
      //     marker.closePopup();
      //   } else {
      //     marker.openPopup();
      //   }
      // });
      // 或者绑定到marker使用
      marker.bindPopup(popup);
      this.markerLayer.push(marker);
      this.newMap.addOverlay(marker);
    }
  },
  mounted() {
    this.toInitMap('von6gavZwV5cKgkppBVYjSkIWad9BwA2');
    this.timer2 = null;
    this.timer2 = setTimeout(() => {
      this.addLineStation();
    }, 200);
  },
  beforeDestroy() {
    this.newMap.removeEventListener('tilesloaded');
    this.newMap.destroy();
    this.timer1 && clearTimeout(this.timer1);
    this.timer2 && clearTimeout(this.timer2);
  }
};
</script>

<style lang="less" scoped>
.mapCmp {
  height: 100%;
  position: relative;

  &-main {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;

    .spinStyle {
      width: 100%;
      height: 100%;
      background-color: #02263e !important;
      z-index: 7;
      position: absolute;
      left: 0px;
      top: 0px;

      /deep/.ant-spin-container {
        width: 100%;
        height: 100%;
      }

      /deep/.ant-spin {
        top: 30%;
      }

      /deep/.ant-spin-dot {
        font-size: 40px;
        margin-top: 30%;
      }
    }

    .map-container {
      background-image: none !important;
    }
  }

  &-map {
    height: 100%;
  }

  &-cover {
    position: relative;
    z-index: 2;
    height: 100%;
    margin: 0px 59px;
    pointer-events: none;
  }
}
</style>

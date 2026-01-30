<!--
 * @Author: wangyr
 * @Date: 2024-07-08 13:32:15
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-08 17:20:49
 * @Description:
-->
<template>
  <div class="map-container">
    <a-spin v-if="spinning" size="large" class="spinStyle"></a-spin>
    <mapbox-map v-if="shouldRenderMap" v-bind="mapProps" @initialize="onInitialize" />
    <div v-show="false" class="scene-legend">
      <div class="legend">
        <div class="header"><div class="--title">图例</div></div>
        <div class="main">
          <div class="leftname"><span>规划中</span><i class="ico-lengend ico-line"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import storage from '@/common/js/tool/storage';
import { mapActions, mapState } from 'vuex';
import '@wpg/map-vue/mapbox/index.css';
import { MapboxMap } from '@wpg/map-vue/mapbox';
import mapboxgl from '@wpg/mapbox-gl';
import { createDefer } from '@/common/js/tool/tools.js';
import { parseLngLat, dealSameSites } from '@/common/js/tool/util.js';
import { hzjs } from './components/geojson.js';
import { GB, AddPopup, bd09towgs84 } from './components/tools';
import { SITE_LIST } from './config/sites';

const MAP_CONFIG = {
  AREA_COLORS: {
    fill: ['#088', '#FFD700', '#0f8', '#80f', '#f80', '#08f'],
    stroke: ['#F33EFF', '#F33EFF', '#04FF95', '#FFAD20', '#04FF95', '#F33EFF', '#04FF95']
  },
  DEFAULT_CENTER: [120.096682, 28.976899],
  DEFAULT_ZOOM: 11,
  MIN_ZOOM: 5,
  MAX_ZOOM: 20
};

export default {
  name: 'MapBox',
  components: {
    MapboxMap
  },
  props: {
    areaInfo: {
      type: Object,
      default: () => ({})
    },
    currentMapZoom: {
      type: Number,
      required: true,
      default: MAP_CONFIG.DEFAULT_ZOOM 
    },
    currentMapCenter: {
      type: Array,
      required: false,
      validator: (value) => {
        return value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number';
      },
      default: () => MAP_CONFIG.DEFAULT_CENTER 
    }
  },
  data() {
    return {
      map: null,
      shouldRenderMap: false,
      spinning: true,
      mapInitialized: false,
      canvasSource: null,
      animationFrameId: null,
      dashArraySequence: [0, 4, 8],
      animationStep: 0,
      defaultMapProps: {
        baseURL:
          process.env.NODE_ENV === 'production' ? `${window.location.origin}/main` : 'http://172.168.10.138:8877/main',
        token: '',
        theme: 'SUPPLY_WATER_SCREEN',
        controls: {
          coordinate: false,
          scale: false,
          layers: false,
          zoom: false,
          restore: false
        },
        controlsPosition: 'bottomright',
        mapOptions: {
          minZoom: MAP_CONFIG.MIN_ZOOM,
          maxZoom: MAP_CONFIG.MAX_ZOOM,
          preferCanvas: true
        }
      },
      mapZoom: this.currentMapZoom,
      mapZoomInit: false,
      mapCenter: this.currentMapCenter,
      token: '',
      mapLoadedDefer: null,
      siteList: SITE_LIST,
      popupObj: {},
      isShowPopup: false,
      areaMarkers: []
    };
  },
  computed: {
    mapProps() {
      return {
        ...this.defaultMapProps,
        token: this.token,
        baseURL: this.defaultMapProps.baseURL
      };
    }
  },
  watch: {
    token: {
      immediate: true,
      handler(newToken) {
        if (newToken) {
          this.initializeMap();
        }
      }
    }
  },
  created() {
    this.initToken();
    this.initializeDefers();
  },
  beforeDestroy() {
    this.cleanup();
  },
  methods: {
    // 初始化相关方法
    initToken() {
      const userInfo = JSON.parse(storage.get('user_info'));
      if (userInfo) {
        this.token = userInfo.accessToken;
      }
    },
    initializeMap() {
      this.shouldRenderMap = true;
      this.spinning = true;
    },
    async onInitialize(map) {
      try {
        this.map = map;
        this.mapLoadedDefer.resolve();

        await this.waitForStyleLoad();
        await this.loadCustomMarkers();
        this.initMap();
        this.addStation();

        this.spinning = false;
        this.mapInitialized = true;
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    },
    async waitForStyleLoad() {
      if (!this.map.isStyleLoaded()) {
        await new Promise(resolve => this.map.once('style.load', resolve));
      }
    },

    // 地图事件处理
    handleMapEvent() {
      const events = {
        zoom: this.debounce(this.handleMapZoom, 100),
        error: e => {
          console.error('Map error:', e);
        }
      };

      Object.entries(events).forEach(([event, handler]) => {
        this.map.on(event, handler);
      });
    },
    handleMapZoom() {
      this.mapZoom = this.map.getZoom();
      if (!this.mapZoomInit) {
        this.drawWholeZone();
        this.mapZoomInit = true;
      }
    },

    // 站点相关方法
    async addStation() {
      this.removeExistingStationLayer();
      const geojsonData = this.createStationGeoJSON();
      this.addStationSource(geojsonData);
      this.addStationLayer();
      await this.$nextTick();
      this.handlePopup();
    },
    removeExistingStationLayer() {
      ['stations'].forEach(id => {
        if (this.map.getLayer(id)) {
          this.map.removeLayer(id);
        }
        if (this.map.getSource(id)) {
          this.map.removeSource(id);
        }
      });
    },
    createStationGeoJSON() {
      return {
        type: 'FeatureCollection',
        features: this.siteList.map(site => {
          const [wgs_lon, wgs_lat] = [site.dsStationCoordinateVO.longi, site.dsStationCoordinateVO.lati];
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [wgs_lon, wgs_lat]
            },
            properties: {
              id: site.dsStationCoordinateVO.id,
              name: site.dsStationCoordinateVO.stationName,
              status: this.getStationStatus(site.stationType)
            }
          };
        })
      };
    },
    getStationStatus(type) {
      const statusMap = {
        1: 'active',
        2: 'offline',
        3: 'normal'
      };
      return statusMap[type] || 'normal';
    },
    addStationSource(geojsonData) {
      this.map.addSource('stations', {
        type: 'geojson',
        data: geojsonData
      });
    },
    addStationLayer() {
      this.map.addLayer({
        id: 'stations',
        type: 'symbol',
        source: 'stations',
        layout: {
          'icon-image': [
            'match',
            ['get', 'status'],
            'active',
            'active-marker',
            'offline',
            'offline-marker',
            'normal-marker'
          ],
          'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 16, 1],
          'icon-allow-overlap': true
        }
      });
    },

    // 清理方法
    cleanup() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      if (this.map) {
        if (this.map.getLayer('jiujiang-lines-background')) {
          this.map.removeLayer('jiujiang-lines-background');
        }
        if (this.map.getLayer('jiujiang-lines')) {
          this.map.removeLayer('jiujiang-lines');
        }
        if (this.map.getSource('jiujiang-lines')) {
          this.map.removeSource('jiujiang-lines');
        }
        this.map.remove();
        this.map = null;
      }
      this.shouldRenderMap = false;
      this.mapInitialized = false;
    },

    initializeDefers() {
      this.mapLoadedDefer = createDefer();

      Promise.all([this.mapLoadedDefer]).then(() => {
        this.initMap();
      });
    },

    async loadCustomMarkers() {
      const staticPath = process.env.NODE_ENV === 'production' ? '/waterPurificationBigPage' : '';
      const markerConfigs = [
        ['normal-marker', 'station_bg.png'],
        ['active-marker', 'station_bg1.png'],
        ['offline-marker', 'station_bg2.png']
      ];

      const loadImage = ([name, file]) => {
        if (this.map.hasImage(name)) return Promise.resolve();

        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 104;
            canvas.height = 128;
            ctx.drawImage(img, 0, 0, 104, 128);
            this.map.addImage(name, ctx.getImageData(0, 0, 104, 128));
            resolve();
          };
          img.onerror = reject;
          img.src = `${staticPath}/static/oneMap/${file}`;
        });
      };

      await Promise.all(markerConfigs.map(loadImage));
    },

    initMap() {
      this.handleMapEvent();
      this.handleMapZoom(); // 直接调用一次确保初始状态正确
    },
    setMapView() {},
    drawWholeZone() {
      const areaColors = ['#088', '#FFD700', '#0f8', '#80f', '#f80', '#08f'];
      // 批量处理区域图层
      areaColors.forEach((color, index) => {
        // 先移除已存在的图层和数据源
        const areaLayerId = `jiujiang-area${index + 1}`;
        const borderLayerId = `jiujiang-area-border${index + 1}`; // 边框图层ID
        // 移除已存在的图层
        [areaLayerId, borderLayerId].forEach(id => {
          if (this.map.getLayer(id)) {
            this.map.removeLayer(id);
          }
        });
        // 移除数据源
        if (this.map.getSource(areaLayerId)) {
          this.map.removeSource(areaLayerId);
        }

        const convertedFeature = this.convertCoordinates([hzjs.features[index]])[0];
        // 添加数据源
        this.map.addSource(areaLayerId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [convertedFeature]
          }
        });
        // 添加填充图层
        this.map.addLayer({
          id: areaLayerId,
          type: 'fill',
          source: areaLayerId,
          paint: {
            'fill-color': color,
            'fill-opacity': 0.3
          }
        });
        // 添加边框图层
        this.map.addLayer({
          id: borderLayerId,
          type: 'line',
          source: areaLayerId, // 使用相同的数据源
          paint: {
            'line-color': color,
            'line-width': 2,
            'line-opacity': 0.8,
            'line-dasharray': [2, 2]
          }
        });
      });
      setTimeout(() => {
        // 平移到稍微偏移的位置（向西南方向偏移）
        this.map.easeTo({
          center: this.currentMapCenter, // [center.lng - 0.003, center.lat - 0.003],
          zoom: this.currentMapZoom,
          duration: 2000, // 动画持续2秒
          easing: t => t * (2 - t) // 使用缓动函数使动画更平滑
        });
      }, 800);
    },
    handlePopup() {
      this.isShowPopup = !this.isShowPopup;
      this.siteList.forEach(site => {
        let feature = site.dsStationCoordinateVO;
        if (this.isShowPopup) {
          this.popupObj[feature.id] && this.popupObj[feature.id].remove();
          this.popupObj[feature.id] = this.genSitePopup(feature);
        } else {
          this.popupObj[feature.id] && this.popupObj[feature.id].remove();
          this.popupObj[feature.id] = null;
        }
      });
    },
    genSitePopup(site) {
      let originSite = this.siteList.find(v => v.dsStationCoordinateVO.id === site.id);
      const props = {
        site: {
          isShow: true,
          ...originSite
        }
      };
      // 获取原始坐标
      const bd_lon = originSite.dsStationCoordinateVO.longi;
      const bd_lat = originSite.dsStationCoordinateVO.lati;

      // 转换为WGS84坐标
      const latLng = [bd_lon, bd_lat];
      const popup = this.addPopup(latLng, {}, GB.sitePopupConstructor, props);
      return popup;
    },
    addPopup(latLng, popupConfig, PopupCtor, popupProps) {
      let that = this;
      let popup = new mapboxgl.Popup({
        zIndex: 8,
        closeButton: false,
        closeOnClick: false,
        offset: [35, -5]
      });
      const instance = new PopupCtor({
        parent: this,
        data() {
          return {
            ...popupProps
          };
        },
        methods: {}
      });

      const el = instance.$mount().$el;
      popup.setDOMContent(el).setLngLat(latLng).addTo(this.map);
      return popup;
    },
    convertCoordinates(features) {
      return features.map(feature => {
        if (!feature || !feature.geometry || !feature.geometry.coordinates) {
          console.warn('Invalid feature:', feature);
          return feature;
        }

        const coords = feature.geometry.coordinates;
        try {
          return {
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: Array.isArray(coords[0])
                ? coords.map(ring =>
                    Array.isArray(ring[0])
                      ? ring.map(coord => bd09towgs84(coord[0], coord[1]))
                      : bd09towgs84(ring[0], ring[1])
                  )
                : bd09towgs84(coords[0], coords[1])
            }
          };
        } catch (error) {
          console.error('Coordinate conversion error:', error);
          return feature;
        }
      });
    },
    // 添加防抖函数
    debounce(fn, delay) {
      let timer = null;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }
  }
};
</script>

<style lang="less" scoped>
.scene-legend {
  position: absolute;
  right: 10px;
  bottom: 2px;
  z-index: 14;
  .legend {
    position: relative;
    z-index: 12;
    width: 138px;
    margin-right: 0;
    overflow: hidden;
    pointer-events: auto;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    padding-left: 20px;
    background: url('~@/assets/img/summaryOverview/fir_top.png') no-repeat;
    background-size: 100% 100%;
    .--title {
      color: #e3f5ff;
      font-size: 18px;
      font-family: Aliba, sans-serif;
    }
  }
  .main {
    position: relative;
    padding: 0 12px 10px;
    height: 68px;

    &::before {
      position: absolute;
      top: 0;
      bottom: 24px;
      left: 0;
      z-index: -1;
      width: 100%;
      background: url('~@/assets/img/summaryOverview/fir_mid.png') no-repeat;
      background-repeat: repeat-y;
      background-size: 100% 100%;
      content: '';
    }
    .leftname {
      display: flex;
      align-items: center;
      line-height: 44px;
      justify-content: space-between;
      span {
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #e6f4ff;
        letter-spacing: 0;
      }
    }
    .ico-line {
      display: inline-block;
      width: 22px;
      height: 3px;
      border-top: 3px dashed #f33eff;
      margin-left: 15px;
    }
  }
}
::v-deep .mapboxgl-popup-close-button,
::v-deep .mapboxgl-popup-tip {
  display: none;
}

::v-deep .mapboxgl-popup-content {
  background: unset;
}

::v-deep .mapboxgl-canvas-container {
  filter: brightness(1.5);
}

::v-deep .area-label-marker {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  user-select: none;
  transform: scale(1.2);
  text-align: center;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;

  .spinStyle {
    width: 100%;
    height: 100%;
    background-color: #02263e !important;
    z-index: 7;
    position: absolute;
    left: 0;
    top: 0;

    ::v-deep {
      .ant-spin-container {
        width: 100%;
        height: 100%;
      }

      .ant-spin {
        top: 30%;
      }

      .ant-spin-dot {
        font-size: 40px;
        margin-top: 30%;
      }
    }
  }
}

::v-deep .custom-popup {
  .mapboxgl-popup-content {
    background: transparent;
    border: none;
    padding: 0;
    box-shadow: none;
  }

  .mapboxgl-popup-tip {
    display: none;
  }
}
</style>

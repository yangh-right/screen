/*
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2023-09-09 16:31:00
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-14 09:40:55
 * @Description:
 */
import Vue from 'vue';
import SitePopup from './sitePopup.vue';
import safetyPopup from './safetyPopup.vue';

export const GB = {
  sitePopupConstructor: Vue.extend(SitePopup),
  safetyPopupConstructor: Vue.extend(safetyPopup)
};

export function AddPopup(PopupCtor, popupProps, that) {
  const instance = new PopupCtor({
    parent: that,
    data() {
      return {
        ...popupProps
      };
    },
    mounted() {
      this.$on('viewTracks', (entityId, entityName) => {
        that.checkDate = true;
        that.rangeTime = null;
        that.entityIds = entityId;
        that.entityName = entityName;
        that.clearMark();
      });
    },
    methods: {}
  });
  const el = instance.$mount().$el;
  return el;
}

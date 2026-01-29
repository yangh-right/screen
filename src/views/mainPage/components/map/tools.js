/*
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2023-09-09 16:31:00
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2023-09-11 09:33:16
 * @Description: 
 */
import Vue from 'vue';
import SitePopup from './sitePopup.vue';
import SiteMarker from './siteMarker.vue';

export const GB = {
  sitePopupConstructor: Vue.extend(SitePopup),
  siteMarkerConstructor: Vue.extend(SiteMarker)
};

export function AddPopup(PopupCtor, popupProps, that) {
  const instance = new PopupCtor({
    parent: that,
    data() {
      return {
        ...popupProps
      };
    },
    methods: {}
  });
  const el = instance.$mount().$el;
  return el;
}


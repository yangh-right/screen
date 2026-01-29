let szUserAgent = navigator.userAgent.toLowerCase();
if (szUserAgent.includes('chrome')) {
  let aScript = [];
  const publicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ ?? '';
  aScript = publicPath ? `${publicPath}video/hkH5/h5player.min.js` : './video/hkH5/h5player.min.js';
  let head = document.getElementsByTagName('head').item(0);
  let oScript = null;
  oScript = document.createElement('script');
  oScript.type = 'text/javascript';
  oScript.defer = true;
  oScript.src = aScript;
  head.appendChild(oScript);
}

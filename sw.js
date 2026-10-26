/* 直式加減小達人 — 離線快取。更新 App 時請把版本號加一。 */
var CACHE='column-v4';
var FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./fonts/pixel.woff2',
  './voice/silence.mp3','./voice/dad/ok1.mp3','./voice/dad/ok2.mp3','./voice/dad/ok3.mp3','./voice/dad/try1.mp3','./voice/dad/try2.mp3'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;var u=new URL(e.request.url);if(u.origin!==location.origin)return;
  if(/\.cfg$/.test(u.pathname))return; /* 設定檔一律走網路 */
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(function(r){var cp=r.clone();caches.open(CACHE).then(function(c){c.put('./index.html',cp)});return r}).catch(function(){return caches.match('./index.html')}));return}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||fetch(e.request).then(function(x){if(x.ok){var cp=x.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp)})}return x})}))});

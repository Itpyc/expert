var cacheName = "spine-expert-cache";
var filesToCache = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/controllers.js',
  '/js/services.js',
  '/lib/ionic/js/ionic.bundle.js',
  '/js/highcharts-ng.js',
  '/js/highcharts.src.js',
  '/cordova.js',
  '/lib/socket.io.js',
  '/lib/ionic/css/ionic.css',
  '/css/component.css',
  '/css/webchat.css',
  '/css/style.css',
  '/lib/ionic/fonts/ionicons.eot',
  '/lib/ionic/fonts/ionicons.svg',
  '/lib/ionic/fonts/ionicons.ttf',
  '/lib/ionic/fonts/ionicons.woff',


  '/manifest.json',
  '/templates/tabs.html',
  '/templates/tab-home.html',
  '/templates/tab-settings.html',
  '/templates/tab-office.html',
  '/templates/tab-msg.html',
  '/templates/record.html',
  '/templates/login.html',
  '/templates/appointment.html',
  '/templates/chat-detail.html',
  '/templates/teachOnline.html',
  '/templates/news/wenzhen.html',
  '/templates/news/zixun.html',

  '/templates/onlineEdu/eduHistory.html',
  '/templates/onlineEdu/eduPaper.html',
  '/templates/onlineEdu/eduRecord.html',
  '/templates/onlineEdu/eduVideoBrodcast.html',

  '/templates/settings/aboutUs.html',
  '/templates/settings/feedback.html',
  '/templates/settings/help.html',
  '/templates/settings/jifen.html',
  '/templates/settings/patientManage.html',
  '/templates/settings/personInfo.html',
  '/templates/settings/sysSetting.html',

  '/img/doctor.png',
  '/img/chaxunjilu.png',
  '/img/bingrenxinxi.png',
  '/img/add.png',
  '/img/ben.png',
  '/img/doctor1.png',
  '/img/doctor2.png',
  '/img/doctorImg.png',
  '/img/huizhen.png',
  '/img/ionic.png',
  '/img/logo.png',
  '/img/max.png',
  '/img/mike.png',
  '/img/phone.png',
  '/img/status.png',
  '/img/video.png',
  '/img/wenzhen.png',
  '/img/yuyue.png',
  '/img/zaixianpeixun.png',
  '/img/zaixianzixun.png',
  '/img/zhiliaojingli.png',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    }));
})
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request.url).then(function (response) {
      return response || fetch(event.request);
    })
  )
});

self.addEventListener('push', function (event) {

});

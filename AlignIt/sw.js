
// var GHPATH = '/AlignIt';
/// var WPATH = 'https://nanoimaging.de/AlignIt'

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v2';
const RUNTIME = 'runtime';

// The files to make available for offline use. make sure to add 
// others to this list
// var URLS = [    
//   `${GHPATH}/`,
//   `${GHPATH}/index.html`,
//   `${GHPATH}/css/style.css`,
//   `${GHPATH}/js/alignit.js`
// ]

const filesToCache = [
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/alignit.js',
  'js/components.js',
  'js/lasershaders.mjs',
  'js/lens.js',
  'img/icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.2/dat.gui.min.js',
  'https://cdn.babylonjs.com/earcut.min.js',
  'https://cdn.babylonjs.com/babylon.js',
  'https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js',
  'https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js',
  'https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js',
  'https://cdn.babylonjs.com/loaders/babylonjs.loaders.js',
  'https://cdn.babylonjs.com/gui/babylon.gui.min.js',
  'music/Be+Jammin\'+-+320bit.mp3',
  'music/Emotional+Balad+-+320bit.mp3',
  'music/forest-with-small-river-birds-and-nature-field-recording-6735.mp3',
  'music/Melodic+Overflow+-+320bit.mp3',
  'music/Now+We+Ride+-+320bit.mp3',
  'music/The+Sad+Piano+Background+Song+-+320bit.mp3',
  'narrations/lvl1t1.m4a',
  'narrations/lvl1t2.m4a',
  'narrations/lvl1t3.m4a',
  'narrations/lvl1t4.m4a',
  'narrations/lvl1t5.m4a',
  'narrations/lvl1t6.m4a',
  'narrations/lvl2t1.m4a',
  'narrations/lvl2t2.m4a',
  'narrations/lvl2t3.m4a',
  'narrations/lvl2t4.m4a',
  'narrations/lvl2t5.m4a',
  'narrations/lvl2t6.m4a',
  'narrations/lvl2t7.m4a',
  'sound/interface-button-154180.mp3',
  'sound/running-gear-6403.mp3',
  'sound/stone_sliding-54021.mp3',
  'sound/switch-150130.mp3',
  'sound/switchbigpowerwav-14710.mp3',
  'textures/floor.png',
  'textures/forest.env',
  'textures/forest.hdr',
  'textures/metallic-with-scratches-stains.jpg',
  'textures/mr.jpg',
  'textures/reflectivity.png',
  'textures/room.env',
  'textures/room.hdr',
  'textures/satara.env',
  'favicon.ico',
  'lvl_1.json',
  'lvl_2.json',
  'lvl_3.json',
  'lvl_4.json',
  'lvl_5.json',
  'lvl_6.json',
  'lvl_7.json',
  'lvl_8.json',
  'lvl_9.json',
  'lvl_10.json',
  'lvl_11.json',
  'lvl_12.json'
];


// From https://googlechrome.github.io/samples/service-worker/basic/

// const PRECACHE_URLS = [
//   "index.html", "js/babylon.js", "js/babylon.glTFFileLoader.js", "js/babylon.gui.min.js", "js/pep.min.js", "js/applecrushervr.js",
//   "textures/environment.dds", "textures/flare.png", "images/LogoApplesCrusher300transparent.png", "css/main.css",
//   "assets/ApplesCrusherBackground.glb.manifest", "assets/Apple.glb.manifest", "assets/AppleCrushed.wav", "assets/RunningForGlory.mp3",
//   "manifest.json", "assets/186950__readeonly__toy-cannon-shot.wav", "assets/bananapistolwithammo.glb.manifest", "assets/lasersaber.glb.manifest"
// ];


// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
      caches.open(PRECACHE)
          .then(cache => cache.addAll(filesToCache))
          .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
      caches.keys().then(cacheNames => {
          return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
          return Promise.all(cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete);
          }));
      }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
          caches.match(event.request, {ignoreSearch: true}).then(cachedResponse => {
              if (cachedResponse) {
                  return cachedResponse;
              }

              return caches.open(RUNTIME).then(cache => {
                  return fetch(event.request).then(response => {
                      // Put a copy of the response in the runtime cache.
                      return cache.put(event.request, response.clone()).then(() => {
                          return response;
                      });
                  });
              });
          })
      );
  }
});
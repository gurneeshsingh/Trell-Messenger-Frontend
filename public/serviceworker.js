// define a cache name and urlstoload , cache name defined the cachse storage of the browser

const CACHE_NAME = 'trell_storage_1';
const urlsToCache = [ '/index.html', '/offline.html', '/assets/internet.jpeg', '/assets/robot.gif', '/assets/loginimage.svg', '/assets/hellocat.svg', '/assets/groupadd.svg', '/assets/groupsettings.svg', '/assets/trell.jpeg', '/assets/chatbackground2.jpg', '/assets/empty.svg'];

const self = this;

// above variable means these files will be cached by the browser

// a service worker file has three things to follow  install SW , listin to SW, activate to SW

// install SW
self.addEventListener('install', (event) => {
    // open the cache and add the urls to the cache
    event.waitUntil(
        // below line returns a promise
        caches.open(CACHE_NAME).then((cache) => {
            console.log('caching assets');
            return cache.addAll(urlsToCache)
        })
    )
    self.skipWaiting()
});

// listin SW
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // match the caches and fetch the requests, returns promise
        caches.match(event.request).then((cacheres) => {
            // return fetch of the request , this can fail as well so match the offline html page to the cache
            return cacheres || fetch(event.request)
                .catch(() => {
                    return caches.match('/offline.html')
                })
        })
    )
});




// activate the SW
self.addEventListener('activate', (event) => {

    event.waitUntil(
        // in the cahces keys check if our whilelist includes something that is not in our chche name and delete that from our cache name
        caches.keys().then((keys) => {
            return Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        })
    )


})




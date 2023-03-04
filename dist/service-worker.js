var cacheName = "afterschoolsclasses-v1";
var cacheFiles = [
    "index.html",
    //"lessons.js",
    "images/art_icon.png",
    "images/biology_icon.png",
    "images/business_icon.png",
    "images/chemistry_icon.png",
    "images/cooking_icon.png",
    "images/geography_icon.png",
    "images/history_icon.png",
    "images/math_icon.png",
    "images/photography_icon.png",
    "images/physics_icon.png",
    "images/spanish_icon.png",
    "images/zoology_icon.png"
];


self.addEventListener("install", function (e) {
    console.log("[Service Workder] Install");
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[Service Worker] Caching all the files");
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener("fetch", function (e) {
    e.respondwith(
        caches.match(e.request).then(function (cachedFile) {
            //download the file if it is not in the cache 
            if (cachedFile) {
                console.log(" [Service Worker] Resource fetched from the cache for: " + e.request.url);

                return cachedFile;

            } else {
                return fetch(e.request).then(function (response) {
                    return caches.open(cacheName).then(function (cache) {
                        //add the new file to the cache
                        cache.put(e.request, response.clone());
                        console.log("[Service Worker] Resource fetched and saved in the cache for:" + e.request.url);

                        return response;
                    });
                });
            }
        })
    );
});
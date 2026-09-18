/* Mini Vestaboard v3.2.2 offline shell cache */

var CACHE_NAME = "mini-vestaboard-shell-v3.2.2";


var CORE_FILES = [

  "index.html",

  "styles.css",

  "config.js",

  "app.js",

  "media/vintage-tv-frame.png"

];


function scopedUrl(path) {

  return new URL(
    path,
    self.registration.scope
  ).toString();

}


function normalizedRequest(request) {

  var url =
    new URL(
      request.url
    );


  url.search = "";


  return new Request(
    url.toString(),
    {
      method: "GET"
    }
  );

}


self.addEventListener(
  "install",
  function(event) {

    event.waitUntil(

      caches
        .open(
          CACHE_NAME
        )

        .then(
          function(cache) {

            return Promise.all(

              CORE_FILES.map(
                function(path) {

                  var request =
                    new Request(
                      scopedUrl(path),
                      {
                        cache: "reload"
                      }
                    );


                  return fetch(request)

                    .then(
                      function(response) {

                        if(
                          response &&
                          response.ok
                        ){

                          return cache.put(
                            normalizedRequest(
                              request
                            ),
                            response.clone()
                          );

                        }

                      }
                    )

                    .catch(
                      function() {

                        /*
                          A missing optional asset must
                          not prevent installation.
                        */

                      }
                    );

                }
              )

            );

          }
        )

        .then(
          function() {

            return self.skipWaiting();

          }
        )

    );

  }
);


self.addEventListener(
  "activate",
  function(event) {

    event.waitUntil(

      caches
        .keys()

        .then(
          function(keys) {

            return Promise.all(

              keys.map(
                function(key) {

                  if(
                    key.indexOf(
                      "mini-vestaboard-shell-"
                    ) === 0 &&

                    key !==
                    CACHE_NAME
                  ){

                    return caches.delete(
                      key
                    );

                  }

                }
              )

            );

          }
        )

        .then(
          function() {

            return self.clients.claim();

          }
        )

    );

  }
);


self.addEventListener(
  "fetch",
  function(event) {

    var request =
      event.request;


    if(
      request.method !==
      "GET"
    ){

      return;

    }


    var url =
      new URL(
        request.url
      );


    var scope =
      new URL(
        self.registration.scope
      );


    if(
      url.origin !==
      scope.origin ||

      url.pathname.indexOf(
        scope.pathname
      ) !== 0
    ){

      return;

    }


    var relativePath =
      url.pathname.slice(
        scope.pathname.length
      );


    if(
      !relativePath
    ){

      relativePath =
        "index.html";

    }


    var isNavigation =
      request.mode ===
      "navigate";


    var isCore =
      CORE_FILES.indexOf(
        relativePath
      ) >= 0;


    /*
      Do not intercept MP4/MP3 streaming.

      Browsers handle byte-range media requests
      more reliably themselves.

      This cache is specifically for the app shell
      and the TV cabinet image.
    */

    if(
      !isNavigation &&
      !isCore
    ){

      return;

    }


    event.respondWith(

      fetch(request)

        .then(
          function(response) {

            if(
              response &&
              response.ok
            ){

              var copy =
                response.clone();


              caches
                .open(
                  CACHE_NAME
                )

                .then(
                  function(cache) {

                    cache.put(
                      normalizedRequest(
                        request
                      ),
                      copy
                    );

                  }
                );

            }


            return response;

          }
        )

        .catch(
          function() {

            return caches
              .match(
                normalizedRequest(
                  request
                )
              )

              .then(
                function(cached) {

                  if(
                    cached
                  ){

                    return cached;

                  }


                  if(
                    isNavigation
                  ){

                    return caches.match(

                      normalizedRequest(

                        new Request(
                          scopedUrl(
                            "index.html"
                          )
                        )

                      )

                    );

                  }


                  return Response.error();

                }
              );

          }
        )

    );

  }
);
(function(){

  "use strict";


  var BUILD_VERSION = "3.2.0";

  var BUILD_TOKEN = "20260918-v32";

  var CONFIG_LOADED =
    !!window.SMART_DISPLAY_CONFIG;


  var DEFAULT_CONFIG = {

    appVersion:BUILD_VERSION,

    displayName:"HOME TV",

    timezone:"America/New_York",

    weather:{
      enabled:true,
      latitude:40.7128,
      longitude:-74.0060,
      locationName:"New York",
      temperatureUnit:"fahrenheit",
      refreshMinutes:20,
      ambientEffects:true
    },

    calendar:{
      enabled:true,
      source:"manual",
      googleCalendarId:"",
      googleCalendarApiKey:"",
      refreshMinutes:15,
      maxVisibleEvents:3,
      events:[]
    },

    sound:{
      enabledByDefault:false,
      hourlyChime:true,
      morningChimeHour:8,
      eveningChimeHour:19,
      quietStartHour:23,
      quietEndHour:7
    },

    audio:{
      mode:"cinema",
      fadeMs:900,
      filmVolume:.72
    },

    quietDisplay:{
      enabled:true,
      screen:"video",
      brightness:.42
    },

    daytimeMusic:{
      enabled:true,
      volume:.10,
      shuffle:true,
      tracks:[
        "media/piano-nostalgic-old.mp3",
        "media/piano-gentle-cinematic.mp3",
        "media/piano-nostalgic-slow.mp3"
      ]
    },

    rotation:{
      enabled:true,
      secondsPerScreen:35,
      screens:[
        "home",
        "weather",
        "calendar",
        "video"
      ]
    },

    screensaver:{

      enabled:true,

      collection:"vintage",

      showLabel:true,

      transitionMs:650,

      mediaSeconds:28,

      playlists:{

        vintage:[

          "media/fall-cartoon-painted-leaves.mp4",

          "media/fall-cartoon-sunshine-morning.mp4",

          "media/fall-cartoon-pumpkins.mp4"

        ]
      },

      mediaTitles:{

        "media/fall-cartoon-painted-leaves.mp4":
          "Jack Frost · Painted Leaves",

        "media/fall-cartoon-sunshine-morning.mp4":
          "The Sunshine Makers · Morning",

        "media/fall-cartoon-pumpkins.mp4":
          "Jack Frost · Pumpkin Patch"

      },

      timeOfDay:{

        enabled:true,

        morning:[
          "media/fall-cartoon-sunshine-morning.mp4",
          "media/fall-cartoon-painted-leaves.mp4",
          "media/fall-cartoon-pumpkins.mp4"
        ],

        afternoon:[
          "media/fall-cartoon-painted-leaves.mp4",
          "media/fall-cartoon-sunshine-morning.mp4",
          "media/fall-cartoon-pumpkins.mp4"
        ],

        evening:[
          "media/fall-cartoon-pumpkins.mp4",
          "media/fall-cartoon-painted-leaves.mp4",
          "media/fall-cartoon-sunshine-morning.mp4"
        ],

        night:[
          "media/fall-cartoon-pumpkins.mp4",
          "media/fall-cartoon-sunshine-morning.mp4",
          "media/fall-cartoon-painted-leaves.mp4"
        ]
      }
    },

    tvFrame:{
      enabled:true,
      image:"media/vintage-tv-frame.png"
    },

    crt:{
      scanlines:true,
      scanlineOpacity:.16,
      glass:true,
      glassOpacity:.24,
      flicker:true,
      flickerOpacity:.055,
      glow:.13
    },

    kiosk:{
      autoHideControlsSeconds:8,
      longPressMs:650,
      requestLandscapeOnFullscreen:true,
      manualHoldSeconds:90
    },

    recovery:{
      enabled:true,
      watchdogSeconds:20,
      mediaStallSeconds:15,
      reloadAfterConsecutiveFailures:8
    }

  };


  function isObject(v){

    return (
      v &&
      typeof v === "object" &&
      !Array.isArray(v)
    );

  }


  function merge(base,extra){

    var out={};

    var k;

    for(k in base){

      if(
        Object.prototype.hasOwnProperty.call(
          base,
          k
        )
      ){

        out[k]=
          isObject(base[k])
          ? merge(base[k],{})
          : Array.isArray(base[k])
          ? base[k].slice()
          : base[k];

      }

    }

    if(!isObject(extra)){
      return out;
    }

    for(k in extra){

      if(
        Object.prototype.hasOwnProperty.call(
          extra,
          k
        )
      ){

        out[k]=
          isObject(extra[k]) &&
          isObject(out[k])
          ? merge(
              out[k],
              extra[k]
            )
          : Array.isArray(extra[k])
          ? extra[k].slice()
          : extra[k];

      }

    }

    return out;

  }


  var CFG =
    merge(
      DEFAULT_CONFIG,
      window.SMART_DISPLAY_CONFIG || {}
    );


  var $ =
    function(id){
      return document.getElementById(id);
    };


  var pages =
    Array.prototype.slice.call(
      document.querySelectorAll(
        ".page"
      )
    );


  document.documentElement
    .style
    .setProperty(
      "--media-transition",
      String(
        CFG.screensaver.transitionMs ||
        650
      ) + "ms"
    );


  var state = {

    page:"home",

    weather:null,

    events:[],

    rotationIndex:0,

    videoIndex:0,

    videoPlaylist:[],

    playlistKey:"",

    activeVideo:"A",

    currentMedia:"",

    preloadedMedia:"",

    soundUnlocked:false,

    lastChimeKey:"",

    quietMode:null,

    musicIndex:0,

    musicPlaylist:[],

    mediaTimer:null,

    mediaFailures:0,

    lastMediaProgressAt:
      Date.now(),

    lastMediaTime:-1,

    weatherUpdatedAt:0,

    calendarUpdatedAt:0,

    controlsTimer:null,

    longPressTimer:null,

    manualHoldUntil:0,

    audioModeOverride:"",

    musicFadeTimer:null,

    frameOverride:null

  };


  var quotes=[

    "Small steps, repeated daily, become big changes.",

    "Make today useful.",

    "You do not need perfect conditions to make progress.",

    "A calm start can still lead to a powerful day.",

    "Focus on what moves the day forward.",

    "Consistency beats intensity when intensity cannot last.",

    "Do one thing today that tomorrow will thank you for.",

    "Keep the goal visible and the next step simple.",

    "You can reset the day at any hour.",

    "Progress counts even when it looks ordinary.",

    "Protect your energy. Spend it on what matters.",

    "Finish strong, then let the day go."

  ];


  function cfg(
    path,
    fallback
  ){

    var cur=CFG;

    var i;

    for(
      i=0;
      i<path.length;
      i++
    ){

      if(
        cur==null ||
        typeof cur[path[i]]==="undefined"
      ){

        return fallback;

      }

      cur=
        cur[
          path[i]
        ];

    }

    return cur;

  }


  function cacheAsset(src){

    if(!src){
      return src;
    }

    var sep =
      src.indexOf("?")>=0
      ? "&"
      : "?";

    return (
      src +
      sep +
      "v=" +
      encodeURIComponent(
        CFG.appVersion ||
        BUILD_TOKEN
      )
    );

  }


  function partsInZone(date){

    date =
      date ||
      new Date();

    var parts =
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            CFG.timezone,

          hour:"numeric",

          minute:"2-digit",

          second:"2-digit",

          hour12:true,

          weekday:"long",

          month:"long",

          day:"numeric",

          year:"numeric"
        }
      )
      .formatToParts(date);

    var o={};

    parts.forEach(
      function(p){

        o[p.type]=p.value;

      }
    );

    return o;

  }


  function hourInZone(date){

    date =
      date ||
      new Date();

    return Number(
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            CFG.timezone,

          hour:"2-digit",

          hourCycle:"h23"
        }
      )
      .format(date)
    );

  }


  function formatTime(date){

    return new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          CFG.timezone,

        hour:"numeric",

        minute:"2-digit"
      }
    )
    .format(date);

  }


  function formatDate(date){

    return new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          CFG.timezone,

        weekday:"short",

        month:"short",

        day:"numeric"
      }
    )
    .format(date);

  }


  function dayKey(date){

    date =
      date ||
      new Date();

    return new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          CFG.timezone,

        year:"numeric",

        month:"2-digit",

        day:"2-digit"
      }
    )
    .format(date);

  }


  function quoteForToday(){

    var key =
      dayKey()
      .replace(
        /\D/g,
        ""
      );

    var n=0;

    var i;

    for(
      i=0;
      i<key.length;
      i++
    ){

      n +=
        Number(
          key.charAt(i)
        );

    }

    return (
      quotes[
        n %
        quotes.length
      ]
    );

  }


  function daypartKey(hour){

    if(hour<5){
      return "night";
    }

    if(hour<12){
      return "morning";
    }

    if(hour<17){
      return "afternoon";
    }

    if(hour<21){
      return "evening";
    }

    return "night";

  }


  function daypartInfo(hour){

    var key =
      daypartKey(hour);

    if(
      key==="night"
    ){

      return {
        label:"Wind down",
        msg:"The day is almost done.",
        sub:"Slow things down. Tomorrow gets a fresh start."
      };

    }

    if(
      key==="morning"
    ){

      return {
        label:"Good morning",
        msg:"A new day is here.",
        sub:quoteForToday()
      };

    }

    if(
      key==="afternoon"
    ){

      return {
        label:"Good afternoon",
        msg:"Keep the momentum going.",
        sub:quoteForToday()
      };

    }

    return {
      label:"Good evening",
      msg:"Ease into the evening.",
      sub:"Wrap up what matters. Let the rest wait."
    };

  }


  function updateConnection(){

    var online =
      navigator.onLine !== false;

    $("syncDot")
      .classList
      .toggle(
        "online",
        online
      );

    $("syncLabel")
      .textContent =
        online
        ? "ONLINE"
        : "OFFLINE";

  }


  window.addEventListener(
    "online",
    function(){

      updateConnection();

      fetchWeather();

      fetchCalendar();

      if(
        state.mediaFailures &&
        state.page==="video"
      ){

        playCurrentMedia(true);

      }

    }
  );


  window.addEventListener(
    "offline",
    updateConnection
  );


  updateConnection();


  function setViewportHeight(){

    document
      .documentElement
      .style
      .setProperty(
        "--app-height",
        window.innerHeight +
        "px"
      );

  }


  setViewportHeight();


  window.addEventListener(
    "resize",
    setViewportHeight
  );


  window.addEventListener(
    "orientationchange",
    function(){

      setTimeout(
        setViewportHeight,
        150
      );

    }
  );


  function isQuietHour(hour){

    var s =
      Number(
        cfg(
          [
            "sound",
            "quietStartHour"
          ],
          23
        )
      );

    var e =
      Number(
        cfg(
          [
            "sound",
            "quietEndHour"
          ],
          7
        )
      );

    if(s===e){
      return false;
    }

    return (
      s<e
      ? (
          hour>=s &&
          hour<e
        )
      : (
          hour>=s ||
          hour<e
        )
    );

  }


  function smartContext(
    fallback
  ){

    var w =
      state.weather;

    if(!w){
      return fallback;
    }

    if(
      w.precipProb>=60
    ){

      return (
        "Rain is likely today — " +
        "an umbrella may be worth grabbing."
      );

    }

    if(
      w.temp<=35
    ){

      return (
        "It is cold outside — " +
        "bundle up before heading out."
      );

    }

    if(
      w.temp>=88
    ){

      return (
        "It is a hot one — " +
        "keep water nearby."
      );

    }

    if(
      w.code===0 &&
      hourInZone()<17
    ){

      return (
        "Clear skies today. " +
        fallback
      );

    }

    return fallback;

  }


  function showPage(name){

    if(!name){
      return;
    }

    var changed =
      name !==
      state.page;

    state.page=name;


    pages.forEach(
      function(p){

        p.classList.toggle(
          "active",
          p.getAttribute(
            "data-page"
          )===name
        );

      }
    );


    var night =
      cfg(
        [
          "quietDisplay",
          "enabled"
        ],
        true
      ) !== false &&
      isQuietHour(
        hourInZone()
      );


    $("footerRight")
      .textContent =
        night
        ? "NIGHT MODE"
        : name==="video"
        ? "SCENE"
        : "AUTO";


    $("controlStatus")
      .textContent =
        night
        ? "NIGHT"
        : name.toUpperCase();


    if(
      name==="video"
    ){

      playCurrentMedia(false);

    }else{

      pauseMedia();

    }


    reconcileAudio();


    if(changed){

      scheduleControlsIdle();

    }

  }


  function choosePage(force){

    if(
      cfg(
        [
          "quietDisplay",
          "enabled"
        ],
        true
      ) !== false &&
      isQuietHour(
        hourInZone()
      )
    ){

      showPage(
        cfg(
          [
            "quietDisplay",
            "screen"
          ],
          "video"
        )
      );

      return;

    }


    var screens =
      cfg(
        [
          "rotation",
          "enabled"
        ],
        true
      )
      ? cfg(
          [
            "rotation",
            "screens"
          ],
          ["home"]
        )
      : ["home"];


    if(
      !cfg(
        [
          "screensaver",
          "enabled"
        ],
        true
      )
    ){

      screens =
        screens.filter(
          function(n){

            return n!=="video";

          }
        );

    }


    if(
      force ||
      screens.indexOf(
        state.page
      )<0
    ){

      state.rotationIndex=0;

    }else{

      state.rotationIndex =
        (
          state.rotationIndex +
          1
        ) %
        screens.length;

    }


    showPage(
      screens[
        state.rotationIndex
      ] ||
      "home"
    );

  }


  function updateClock(){

    var p =
      partsInZone();

    var info =
      daypartInfo(
        hourInZone()
      );


    $("clock")
      .textContent =
        p.hour +
        ":" +
        p.minute;


    $("ampm")
      .textContent =
        p.dayPeriod ||
        "";


    $("date")
      .textContent =
        p.weekday +
        ", " +
        p.month +
        " " +
        p.day;


    $("daypart")
      .textContent =
        info.label;


    $("mainMessage")
      .textContent =
        info.msg;


    $("contextMessage")
      .textContent =
        smartContext(
          info.sub
        );


    applyDayNightMode();

    maybeChime();

    refreshPlaylist(false);

  }


  var WMO={

    0:["Clear","☀"],

    1:["Mostly clear","🌤"],

    2:["Partly cloudy","⛅"],

    3:["Overcast","☁"],

    45:["Fog","🌫"],

    48:["Rime fog","🌫"],

    51:["Light drizzle","🌦"],

    53:["Drizzle","🌦"],

    55:["Heavy drizzle","🌧"],

    61:["Light rain","🌧"],

    63:["Rain","🌧"],

    65:["Heavy rain","🌧"],

    71:["Light snow","🌨"],

    73:["Snow","🌨"],

    75:["Heavy snow","❄"],

    77:["Snow grains","❄"],

    80:["Rain showers","🌦"],

    81:["Rain showers","🌧"],

    82:["Heavy showers","⛈"],

    85:["Snow showers","🌨"],

    86:["Heavy snow showers","❄"],

    95:["Thunderstorm","⛈"],

    96:["Thunderstorm + hail","⛈"],

    99:["Thunderstorm + hail","⛈"]

  };


  function weatherClass(code){

    if(
      [45,48]
      .indexOf(code)>=0
    ){
      return "weather-fog";
    }

    if(
      [
        71,73,75,
        77,85,86
      ]
      .indexOf(code)>=0
    ){
      return "weather-snow";
    }

    if(
      [
        51,53,55,
        61,63,65,
        80,81,82,
        95,96,99
      ]
      .indexOf(code)>=0
    ){
      return "weather-rain";
    }

    if(
      [0,1]
      .indexOf(code)>=0
    ){
      return "weather-clear";
    }

    return "";

  }


  function applyWeatherEffect(code){

    [
      "weather-rain",
      "weather-snow",
      "weather-fog",
      "weather-clear"
    ]
    .forEach(
      function(c){

        document
          .body
          .classList
          .remove(c);

      }
    );


    if(
      cfg(
        [
          "weather",
          "ambientEffects"
        ],
        true
      ) !== false
    ){

      var c =
        weatherClass(code);

      if(c){

        document
          .body
          .classList
          .add(c);

      }

    }

  }


  async function fetchWeather(){

    if(
      !cfg(
        [
          "weather",
          "enabled"
        ],
        true
      )
    ){
      return;
    }


    var w =
      CFG.weather;


    var params =
      new URLSearchParams({

        latitude:
          w.latitude,

        longitude:
          w.longitude,

        current:
          "temperature_2m,apparent_temperature,weather_code,is_day",

        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",

        temperature_unit:
          w.temperatureUnit ||
          "fahrenheit",

        timezone:
          CFG.timezone ||
          "auto",

        forecast_days:"3"

      });


    try{

      var r =
        await fetch(
          "https://api.open-meteo.com/v1/forecast?" +
          params.toString(),
          {
            cache:"no-store"
          }
        );


      if(!r.ok){

        throw new Error(
          "Weather HTTP " +
          r.status
        );

      }


      var data =
        await r.json();


      state.weather={

        temp:
          Math.round(
            data.current
              .temperature_2m
          ),

        feels:
          Math.round(
            data.current
              .apparent_temperature
          ),

        code:
          data.current
            .weather_code,

        hi:
          Math.round(
            data.daily
              .temperature_2m_max[0]
          ),

        lo:
          Math.round(
            data.daily
              .temperature_2m_min[0]
          ),

        precipProb:
          Math.round(
            data.daily
              .precipitation_probability_max[0] ||
            0
          ),

        cachedAt:
          Date.now()

      };


      state.weatherUpdatedAt =
        Date.now();


      try{

        localStorage.setItem(
          "smartDisplayWeather",
          JSON.stringify(
            state.weather
          )
        );

      }catch(e){}


      renderWeather();


      $("footerLeft")
        .textContent =
          "Weather " +
          formatTime(
            new Date()
          );


    }catch(e){

      console.warn(e);


      if(
        state.weather
      ){

        renderWeather();

        $("footerLeft")
          .textContent =
            "Cached weather";

      }else{

        $("weatherDesc")
          .textContent =
            "Weather unavailable";

      }

    }

  }


  function renderWeather(){

    var w =
      state.weather;

    if(!w){
      return;
    }


    var entry =
      WMO[w.code] ||
      [
        "Current conditions",
        ""
      ];


    $("weatherLocation")
      .textContent =
        cfg(
          [
            "weather",
            "locationName"
          ],
          "Weather"
        );


    $("weatherTemp")
      .textContent =
        w.temp +
        "°";


    $("weatherDesc")
      .textContent =
        (
          entry[1] +
          " " +
          entry[0]
        )
        .trim();


    $("feelsLike")
      .textContent =
        w.feels +
        "°";


    $("hiLow")
      .textContent =
        w.hi +
        "° / " +
        w.lo +
        "°";


    $("rainChance")
      .textContent =
        w.precipProb +
        "%";


    applyWeatherEffect(
      w.code
    );

  }


  async function fetchCalendar(){

    if(
      !cfg(
        [
          "calendar",
          "enabled"
        ],
        true
      )
    ){
      return;
    }


    var events=[];


    try{

      if(
        CFG.calendar.source ===
          "google-public" &&

        CFG.calendar
          .googleCalendarId &&

        CFG.calendar
          .googleCalendarApiKey
      ){

        var now =
          new Date()
          .toISOString();


        var url =
          "https://www.googleapis.com/calendar/v3/calendars/" +
          encodeURIComponent(
            CFG.calendar
              .googleCalendarId
          ) +
          "/events?singleEvents=true&orderBy=startTime&maxResults=10&timeMin=" +
          encodeURIComponent(now) +
          "&key=" +
          encodeURIComponent(
            CFG.calendar
              .googleCalendarApiKey
          );


        var r =
          await fetch(
            url,
            {
              cache:"no-store"
            }
          );


        if(!r.ok){

          throw new Error(
            "Calendar HTTP " +
            r.status
          );

        }


        var data =
          await r.json();


        events =
          (
            data.items ||
            []
          )
          .map(
            function(e){

              return {

                title:
                  e.summary ||
                  "Untitled event",

                start:
                  e.start &&
                  (
                    e.start.dateTime ||
                    e.start.date
                  )

              };

            }
          );


      }else{

        events =
          Array.isArray(
            CFG.calendar.events
          )
          ? CFG.calendar.events
          : [];

      }


      state.events =
        events

        .filter(
          function(e){

            return (
              e.start &&
              new Date(
                e.start
              )
              .getTime() >=
              Date.now() -
              3600000
            );

          }
        )

        .sort(
          function(a,b){

            return (
              new Date(
                a.start
              ) -
              new Date(
                b.start
              )
            );

          }
        );


      state.calendarUpdatedAt =
        Date.now();


      renderCalendar();


    }catch(e){

      console.warn(e);


      $("eventList")
        .innerHTML =
          '<div class="event-empty">' +
          'Calendar unavailable' +
          '</div>';

    }

  }


  function renderCalendar(){

    var list =
      $("eventList");


    list.innerHTML="";


    var max =
      Number(
        cfg(
          [
            "calendar",
            "maxVisibleEvents"
          ],
          3
        )
      );


    var events =
      state.events
        .slice(
          0,
          max
        );


    if(
      !events.length
    ){

      list.innerHTML =
        '<div class="event-empty">' +
        'Nothing scheduled' +
        '</div>';

      return;

    }


    events.forEach(
      function(e){

        var row =
          document
            .createElement(
              "div"
            );


        row.className =
          "event";


        var d =
          new Date(
            e.start
          );


        row.innerHTML =

          '<div class="event-time">' +

          escapeHtml(
            formatDate(d)
          ) +

          '<br>' +

          escapeHtml(
            formatTime(d)
          ) +

          '</div>' +

          '<div class="event-title">' +

          escapeHtml(
            e.title ||
            "Untitled event"
          ) +

          '</div>';


        list.appendChild(
          row
        );

      }
    );

  }


  function escapeHtml(s){

    return String(s)
      .replace(
        /[&<>"']/g,
        function(c){

          return {

            "&":"&amp;",

            "<":"&lt;",

            ">":"&gt;",

            '"':"&quot;",

            "'":"&#039;"

          }[c];

        }
      );

  }


  function buildMusicPlaylist(){

    state.musicPlaylist =
      (
        cfg(
          [
            "daytimeMusic",
            "tracks"
          ],
          []
        ) ||
        []
      )
      .filter(Boolean)
      .slice();


    if(
      cfg(
        [
          "daytimeMusic",
          "shuffle"
        ],
        true
      )
    ){

      for(
        var i =
          state.musicPlaylist.length-1;

        i>0;

        i--
      ){

        var j =
          Math.floor(
            Math.random() *
            (
              i+1
            )
          );


        var t =
          state.musicPlaylist[i];


        state.musicPlaylist[i] =
          state.musicPlaylist[j];


        state.musicPlaylist[j] =
          t;

      }

    }

  }


  function audioEnabled(){

    return (
      state.soundUnlocked
    );

  }


  function currentAudioMode(){

    return (
      state.audioModeOverride ||
      String(
        cfg(
          [
            "audio",
            "mode"
          ],
          "cinema"
        )
      )
      .toLowerCase()
    );

  }


  function updateAudioModeButton(){

    var mode =
      currentAudioMode();


    var labels={

      cinema:"Original Film",

      music:"Music",

      silent:"Silent"

    };


    $("audioModeButton")
      .textContent =
        "Audio: " +
        (
          labels[mode] ||
          mode
        );

  }


  function fadeMusicTo(
    target,
    onDone
  ){

    var player =
      $("jazzPlayer");


    target =
      Math.max(
        0,
        Math.min(
          1,
          target
        )
      );


    if(
      state.musicFadeTimer
    ){

      clearInterval(
        state.musicFadeTimer
      );

    }


    var start =
      Number(
        player.volume ||
        0
      );


    var ms =
      Math.max(
        100,
        Number(
          cfg(
            [
              "audio",
              "fadeMs"
            ],
            900
          )
        )
      );


    var beg =
      Date.now();


    state.musicFadeTimer =
      setInterval(
        function(){

          var p =
            Math.min(
              1,
              (
                Date.now() -
                beg
              ) /
              ms
            );


          player.volume =
            start +
            (
              target -
              start
            ) *
            p;


          if(
            p>=1
          ){

            clearInterval(
              state.musicFadeTimer
            );


            state.musicFadeTimer =
              null;


            player.volume =
              target;


            if(onDone){
              onDone();
            }

          }

        },
        40
      );

  }


  function reconcileMusic(
    shouldPlay
  ){

    var player =
      $("jazzPlayer");


    if(
      !shouldPlay ||
      !state.musicPlaylist.length
    ){

      fadeMusicTo(
        0,
        function(){

          player.pause();

        }
      );

      return;

    }


    var src =
      cacheAsset(
        state.musicPlaylist[
          state.musicIndex %
          state.musicPlaylist.length
        ]
      );


    if(
      player.getAttribute(
        "data-source"
      ) !== src
    ){

      player.setAttribute(
        "data-source",
        src
      );

      player.src=src;

    }


    var desired =
      Math.max(
        0,
        Math.min(
          1,
          Number(
            cfg(
              [
                "daytimeMusic",
                "volume"
              ],
              .10
            )
          )
        )
      );


    if(
      player.paused &&
      !player.getAttribute(
        "data-blocked"
      )
    ){

      player.volume=0;


      player.setAttribute(
        "data-blocked",
        "pending"
      );


      var promise =
        player.play();


      if(
        promise &&
        promise.then
      ){

        promise
          .then(
            function(){

              player.removeAttribute(
                "data-blocked"
              );

              fadeMusicTo(
                desired
              );

            }
          )
          .catch(
            function(){

              player.setAttribute(
                "data-blocked",
                "true"
              );

              updateSoundButton(
                "Tap to retry sound"
              );

            }
          );

      }

    }else if(
      !player.paused
    ){

      fadeMusicTo(
        desired
      );

    }

  }


  function shouldPlayFilmAudio(){

    return (

      audioEnabled() &&

      !isQuietHour(
        hourInZone()
      ) &&

      currentAudioMode() ===
        "cinema" &&

      state.page ===
        "video"

    );

  }


  function syncFilmAudio(){

    var allow =
      shouldPlayFilmAudio();


    var active =
      currentVideo();


    var other =
      inactiveVideo();


    var vol =
      Math.max(
        0,
        Math.min(
          1,
          Number(
            cfg(
              [
                "audio",
                "filmVolume"
              ],
              .72
            )
          )
        )
      );


    [
      active,
      other
    ]
    .forEach(
      function(v){

        v.volume=vol;

        v.muted=true;

      }
    );


    if(
      active &&
      active.classList.contains(
        "visible"
      )
    ){

      active.muted =
        !allow;

    }

  }


  function prepareFilmAudio(
    target
  ){

    var allow =
      shouldPlayFilmAudio();


    target.volume =
      Math.max(
        0,
        Math.min(
          1,
          Number(
            cfg(
              [
                "audio",
                "filmVolume"
              ],
              .72
            )
          )
        )
      );


    target.muted =
      !allow;


    var other =
      target ===
      $("videoA")
      ? $("videoB")
      : $("videoA");


    other.muted=true;

  }


  function reconcileAudio(){

    var quiet =
      isQuietHour(
        hourInZone()
      );


    var mode =
      currentAudioMode();


    var enabled =
      audioEnabled();


    if(
      !enabled ||
      quiet ||
      mode==="silent"
    ){

      reconcileMusic(false);

      syncFilmAudio();

      updateAudioModeButton();

      return;

    }


    if(
      mode==="cinema"
    ){

      reconcileMusic(
        state.page!=="video" &&
        cfg(
          [
            "daytimeMusic",
            "enabled"
          ],
          true
        )
      );

    }else{

      reconcileMusic(
        cfg(
          [
            "daytimeMusic",
            "enabled"
          ],
          true
        )
      );

    }


    syncFilmAudio();

    updateAudioModeButton();

  }


  $("jazzPlayer")
    .addEventListener(
      "ended",
      function(){

        if(
          !state.musicPlaylist.length
        ){
          return;
        }


        state.musicIndex =
          (
            state.musicIndex +
            1
          ) %
          state.musicPlaylist.length;


        $("jazzPlayer")
          .removeAttribute(
            "data-source"
          );


        reconcileAudio();

      }
    );


  function tone(
    freq,
    duration,
    volume
  ){

    if(
      !audioEnabled() ||
      isQuietHour(
        hourInZone()
      ) ||
      currentAudioMode() ===
        "silent"
    ){
      return;
    }


    var Ctx =
      window.AudioContext ||
      window.webkitAudioContext;


    if(!Ctx){
      return;
    }


    var ctx =
      window.__smartAudio ||
      (
        window.__smartAudio =
        new Ctx()
      );


    if(
      ctx.state ===
      "suspended"
    ){

      ctx.resume()
        .catch(
          function(){}
        );

    }


    var osc =
      ctx.createOscillator();


    var gain =
      ctx.createGain();


    osc.type =
      "sine";


    osc.frequency.value =
      freq;


    gain.gain
      .setValueAtTime(
        volume,
        ctx.currentTime
      );


    gain.gain
      .exponentialRampToValueAtTime(
        .001,
        ctx.currentTime +
        duration
      );


    osc.connect(gain);

    gain.connect(
      ctx.destination
    );


    osc.start();

    osc.stop(
      ctx.currentTime +
      duration
    );

  }


  function chime(kind){

    if(
      kind==="morning"
    ){

      tone(
        523,
        .18,
        .03
      );

      setTimeout(
        function(){

          tone(
            659,
            .18,
            .03
          );

        },
        180
      );

      setTimeout(
        function(){

          tone(
            784,
            .28,
            .03
          );

        },
        360
      );


    }else if(
      kind==="evening"
    ){

      tone(
        784,
        .18,
        .025
      );

      setTimeout(
        function(){

          tone(
            659,
            .18,
            .025
          );

        },
        180
      );

      setTimeout(
        function(){

          tone(
            523,
            .3,
            .025
          );

        },
        360
      );


    }else{

      tone(
        660,
        .18,
        .035
      );

      setTimeout(
        function(){

          tone(
            880,
            .22,
            .03
          );

        },
        180
      );

    }

  }


  function maybeChime(){

    if(
      !cfg(
        [
          "sound",
          "hourlyChime"
        ],
        true
      ) ||
      !audioEnabled() ||
      currentAudioMode() ===
        "silent"
    ){
      return;
    }


    var p =
      partsInZone();


    var hour =
      hourInZone();


    if(
      isQuietHour(hour)
    ){
      return;
    }


    var key =
      dayKey() +
      "-" +
      hour;


    if(
      p.minute==="00" &&
      key!==state.lastChimeKey
    ){

      state.lastChimeKey =
        key;


      if(
        hour ===
        Number(
          cfg(
            [
              "sound",
              "morningChimeHour"
            ],
            8
          )
        )
      ){

        chime(
          "morning"
        );

      }else if(
        hour ===
        Number(
          cfg(
            [
              "sound",
              "eveningChimeHour"
            ],
            19
          )
        )
      ){

        chime(
          "evening"
        );

      }else{

        chime(
          "hourly"
        );

      }

    }

  }


  function updateSoundButton(text){

    $("soundButton")
      .textContent =
        text ||
        (
          state.soundUnlocked
          ? "Sound on"
          : "Enable sound"
        );

  }


  $("soundButton")
    .addEventListener(
      "click",
      function(){

        state.soundUnlocked =
          $("jazzPlayer")
            .getAttribute(
              "data-blocked"
            ) === "true"
          ? true
          : !state.soundUnlocked;


        $("jazzPlayer")
          .removeAttribute(
            "data-blocked"
          );


        updateSoundButton();


        reconcileAudio();


        var active =
          currentVideo();


        if(
          state.soundUnlocked &&
          state.page === "video" &&
          active &&
          active.paused
        ){

          active.play()
            .catch(
              function(){}
            );

        }


        scheduleControlsIdle();

      }
    );


  $("audioModeButton")
    .addEventListener(
      "click",
      function(){

        var order=[

          "cinema",

          "music",

          "silent"

        ];


        var now =
          currentAudioMode();


        var idx =
          order.indexOf(now);


        state.audioModeOverride =
          order[
            (
              idx+1
            ) %
            order.length
          ];


        try{

          localStorage.setItem(
            "miniVestaboardAudioMode",
            state.audioModeOverride
          );

        }catch(e){}


        reconcileAudio();


        scheduleControlsIdle();

      }
    );


  try{

    var savedMode =
      localStorage.getItem(
        "miniVestaboardAudioMode"
      );


    if(
      savedMode &&
      [
        "cinema",
        "music",
        "silent"
      ]
      .indexOf(
        savedMode
      ) >= 0
    ){

      state.audioModeOverride =
        savedMode;

    }

  }catch(e){}


  updateAudioModeButton();


  function applyDayNightMode(){

    var quiet =
      cfg(
        [
          "quietDisplay",
          "enabled"
        ],
        true
      ) !== false &&

      isQuietHour(
        hourInZone()
      );


    document.body
      .classList
      .toggle(
        "quiet-mode",
        quiet
      );


    document
      .documentElement
      .style
      .setProperty(
        "--brightness",
        String(
          quiet
          ? Math.max(
              .15,
              Math.min(
                1,
                Number(
                  cfg(
                    [
                      "quietDisplay",
                      "brightness"
                    ],
                    .42
                  )
                )
              )
            )
          : 1
        )
      );


    if(
      state.quietMode !==
      quiet
    ){

      state.quietMode =
        quiet;


      if(quiet){

        showPage(
          cfg(
            [
              "quietDisplay",
              "screen"
            ],
            "video"
          )
        );

      }else{

        choosePage(true);

      }

    }


    reconcileAudio();

  }


  function frameEnabled(){

    if(
      state.frameOverride !==
      null
    ){

      return (
        state.frameOverride
      );

    }


    return (
      cfg(
        [
          "tvFrame",
          "enabled"
        ],
        true
      ) !== false
    );

  }


  function updateFrameButton(){

    $("frameButton")
      .textContent =
        "TV Frame: " +
        (
          frameEnabled()
          ? "On"
          : "Off"
        );

  }


  function applyVisualSettings(){

    var shell =
      $("vintageTvShell");


    var frame =
      $("tvFrameOverlay");


    if(frame){

      var src =
        cfg(
          [
            "tvFrame",
            "image"
          ],
          "media/vintage-tv-frame.png"
        );


      if(
        src &&
        frame.getAttribute(
          "data-source"
        ) !== src
      ){

        frame.setAttribute(
          "data-source",
          src
        );


        frame.src =
          cacheAsset(src);

      }

    }


    if(shell){

      shell.classList.toggle(
        "frame-off",
        !frameEnabled()
      );

    }


    document.body
      .classList
      .toggle(
        "crt-scanlines-off",
        cfg(
          [
            "crt",
            "scanlines"
          ],
          true
        ) === false
      );


    document.body
      .classList
      .toggle(
        "crt-glass-off",
        cfg(
          [
            "crt",
            "glass"
          ],
          true
        ) === false
      );


    document.body
      .classList
      .toggle(
        "crt-flicker-off",
        cfg(
          [
            "crt",
            "flicker"
          ],
          true
        ) === false
      );


    document.documentElement
      .style
      .setProperty(
        "--crt-scanline-opacity",
        String(
          cfg(
            [
              "crt",
              "scanlineOpacity"
            ],
            .16
          )
        )
      );


    document.documentElement
      .style
      .setProperty(
        "--crt-glass-opacity",
        String(
          cfg(
            [
              "crt",
              "glassOpacity"
            ],
            .24
          )
        )
      );


    document.documentElement
      .style
      .setProperty(
        "--crt-flicker-opacity",
        String(
          cfg(
            [
              "crt",
              "flickerOpacity"
            ],
            .055
          )
        )
      );


    document.documentElement
      .style
      .setProperty(
        "--crt-glow",
        String(
          cfg(
            [
              "crt",
              "glow"
            ],
            .13
          )
        )
      );


    updateFrameButton();

  }


  $("frameButton")
    .addEventListener(
      "click",
      function(){

        state.frameOverride =
          !frameEnabled();


        try{

          localStorage.setItem(
            "miniVestaboardTvFrame",
            state.frameOverride
            ? "on"
            : "off"
          );

        }catch(e){}


        applyVisualSettings();


        scheduleControlsIdle();

      }
    );


  try{

    var savedFrame =
      localStorage.getItem(
        "miniVestaboardTvFrame"
      );


    if(
      savedFrame==="on"
    ){

      state.frameOverride=true;

    }else if(
      savedFrame==="off"
    ){

      state.frameOverride=false;

    }

  }catch(e){}


  function playlistForNow(){

    var td =
      cfg(
        [
          "screensaver",
          "timeOfDay"
        ],
        {}
      );


    var key =
      daypartKey(
        hourInZone()
      );


    var list=[];


    if(
      td &&
      td.enabled !== false &&
      Array.isArray(
        td[key]
      ) &&
      td[key].length
    ){

      list =
        td[key];

    }


    if(
      !list.length
    ){

      var collection =
        cfg(
          [
            "screensaver",
            "collection"
          ],
          "vintage"
        );


      var sets =
        cfg(
          [
            "screensaver",
            "playlists"
          ],
          {}
        );


      list =
        sets &&
        Array.isArray(
          sets[
            collection
          ]
        )
        ? sets[
            collection
          ]
        : [];

    }


    if(
      !list.length
    ){

      list =
        DEFAULT_CONFIG
          .screensaver
          .playlists
          .vintage;

    }


    return {

      key:key,

      list:
        list
          .filter(Boolean)
          .slice()

    };

  }


  function refreshPlaylist(
    force
  ){

    var p =
      playlistForNow();


    if(
      !force &&
      state.playlistKey ===
        p.key &&
      state.videoPlaylist.length
    ){
      return;
    }


    state.playlistKey =
      p.key;


    state.videoPlaylist =
      p.list;


    state.videoIndex=0;


    $("videoLabel")
      .textContent =
        p.key +
        " · vintage";


    $("videoLabel")
      .classList
      .toggle(
        "hidden",
        cfg(
          [
            "screensaver",
            "showLabel"
          ],
          true
        ) === false
      );


    if(
      state.page ===
      "video"
    ){

      playCurrentMedia(true);

    }

  }


  function currentVideo(){

    return (
      state.activeVideo ===
      "A"
      ? $("videoA")
      : $("videoB")
    );

  }


  function inactiveVideo(){

    return (
      state.activeVideo ===
      "A"
      ? $("videoB")
      : $("videoA")
    );

  }


  function isImage(src){

    return (
      /\.(png|jpe?g|webp|gif)(\?.*)?$/i
      .test(
        src ||
        ""
      )
    );

  }


  function clearMediaTimer(){

    if(
      state.mediaTimer
    ){

      clearTimeout(
        state.mediaTimer
      );

      state.mediaTimer =
        null;

    }

  }


  function pauseMedia(){

    clearMediaTimer();

    $("videoA").pause();

    $("videoB").pause();

  }


  function showMediaError(text){

    $("videoEmpty")
      .textContent =
        text;


    $("videoEmpty")
      .classList
      .remove(
        "hidden"
      );

  }


  function hideMediaError(){

    $("videoEmpty")
      .classList
      .add(
        "hidden"
      );

  }


  function markMediaProgress(
    video
  ){

    if(
      video.currentTime !==
      state.lastMediaTime
    ){

      state.lastMediaTime =
        video.currentTime;


      state.lastMediaProgressAt =
        Date.now();


      state.mediaFailures=0;

    }

  }


  function attachVideoEvents(v){

    v.addEventListener(
      "timeupdate",
      function(){

        if(
          v.classList.contains(
            "visible"
          )
        ){

          markMediaProgress(v);

        }

      }
    );


    v.addEventListener(
      "error",
      function(){

        if(
          v.classList.contains(
            "visible"
          )
        ){

          state.mediaFailures++;


          showMediaError(
            "This clip could not play. Trying the next one…"
          );


          setTimeout(
            nextMedia,
            800
          );

        }

      }
    );


    v.addEventListener(
      "ended",
      function(){

        if(
          v.classList.contains(
            "visible"
          )
        ){

          nextMedia();

        }

      }
    );

  }


  attachVideoEvents(
    $("videoA")
  );


  attachVideoEvents(
    $("videoB")
  );


  function preloadNext(){

    if(
      state.videoPlaylist.length<2
    ){
      return;
    }


    var next =
      state.videoPlaylist[
        (
          state.videoIndex +
          1
        ) %
        state.videoPlaylist.length
      ];


    if(
      isImage(next)
    ){
      return;
    }


    var v =
      inactiveVideo();


    var url =
      cacheAsset(next);


    if(
      v.getAttribute(
        "data-source"
      ) !== next
    ){

      v.setAttribute(
        "data-source",
        next
      );


      v.src =
        url;


      v.load();


      state.preloadedMedia =
        next;

    }

  }


  function finishVideoStart(
    target,
    active
  ){

    hideMediaError();


    target.classList
      .add(
        "visible"
      );


    if(
      target !== active
    ){

      active.muted=true;


      active.classList
        .remove(
          "visible"
        );


      setTimeout(
        function(){

          active.pause();

        },
        Number(
          cfg(
            [
              "screensaver",
              "transitionMs"
            ],
            650
          )
        ) +
        80
      );


      state.activeVideo =
        target.id ===
          "videoA"
        ? "A"
        : "B";

    }


    syncFilmAudio();

    preloadNext();

  }


  function mediaStartFailed(
    src,
    error
  ){

    console.warn(
      "Media play failed",
      src,
      error
    );


    state.mediaFailures++;


    showMediaError(
      "Media could not start. Tap Next media or System status."
    );

  }


  function playCurrentMedia(force){

    if(
      state.page !==
      "video"
    ){
      return;
    }


    clearMediaTimer();


    refreshPlaylist(false);


    if(
      !state.videoPlaylist.length
    ){

      showMediaError(
        CONFIG_LOADED
        ? "No media is listed in config.js."
        : "config.js did not load. Running built-in fallback media list."
      );

      return;

    }


    var src =
      state.videoPlaylist[
        state.videoIndex %
        state.videoPlaylist.length
      ];


    state.currentMedia =
      src;


    state.lastMediaProgressAt =
      Date.now();


    state.lastMediaTime=-1;


    var titles =
      cfg(
        [
          "screensaver",
          "mediaTitles"
        ],
        {}
      );


    $("videoLabel")
      .textContent =
        (
          titles &&
          titles[src]
        )
        ? titles[src]
        : (
            state.playlistKey +
            " · vintage"
          );


    if(
      isImage(src)
    ){

      var img =
        $("imageLayer");


      $("videoA").pause();

      $("videoB").pause();


      $("videoA")
        .classList
        .remove(
          "visible"
        );


      $("videoB")
        .classList
        .remove(
          "visible"
        );


      img.classList
        .remove(
          "hidden-media"
        );


      img.src =
        cacheAsset(src);


      requestAnimationFrame(
        function(){

          img.classList
            .add(
              "visible"
            );

        }
      );


      hideMediaError();


      state.mediaTimer =
        setTimeout(
          nextMedia,
          Number(
            cfg(
              [
                "screensaver",
                "mediaSeconds"
              ],
              28
            )
          ) *
          1000
        );


      return;

    }


    $("imageLayer")
      .classList
      .remove(
        "visible"
      );


    $("imageLayer")
      .classList
      .add(
        "hidden-media"
      );


    var active =
      currentVideo();


    var next =
      inactiveVideo();


    var url =
      cacheAsset(src);


    var target =
      active;


    if(
      force ||
      active.getAttribute(
        "data-source"
      ) !== src
    ){

      if(
        next.getAttribute(
          "data-source"
        ) === src
      ){

        target=next;

      }else{

        target=next;


        target.setAttribute(
          "data-source",
          src
        );


        target.src =
          url;


        target.load();

      }

    }


    prepareFilmAudio(
      target
    );


    target.playsInline =
      true;


    var promise =
      target.play();


    if(
      promise &&
      promise.then
    ){

      promise
        .then(
          function(){

            finishVideoStart(
              target,
              active
            );

          }
        )
        .catch(
          function(e){

            /*
              Some browsers allow autoplay only while muted.

              If original film audio is blocked,
              start the picture muted and let
              the Sound button unlock it.
            */

            if(
              !target.muted
            ){

              target.muted=true;


              var retry =
                target.play();


              if(
                retry &&
                retry.then
              ){

                retry
                  .then(
                    function(){

                      finishVideoStart(
                        target,
                        active
                      );


                      updateSoundButton(
                        "Tap for film sound"
                      );

                    }
                  )
                  .catch(
                    function(e2){

                      mediaStartFailed(
                        src,
                        e2
                      );

                    }
                  );


              }else{

                finishVideoStart(
                  target,
                  active
                );

              }


            }else{

              mediaStartFailed(
                src,
                e
              );

            }

          }
        );


    }else{

      finishVideoStart(
        target,
        active
      );

    }

  }


  function nextMedia(){

    if(
      !state.videoPlaylist.length
    ){
      return;
    }


    clearMediaTimer();


    state.videoIndex =
      (
        state.videoIndex +
        1
      ) %
      state.videoPlaylist.length;


    playCurrentMedia(true);


    updateHealth();

  }


  $("nextMediaButton")
    .addEventListener(
      "click",
      function(){

        startManualHold();


        if(
          state.page !==
          "video"
        ){

          showPage(
            "video"
          );

        }


        nextMedia();


        scheduleControlsIdle();

      }
    );


  function startManualHold(){

    var sec =
      Math.max(
        0,
        Number(
          cfg(
            [
              "kiosk",
              "manualHoldSeconds"
            ],
            90
          )
        )
      );


    state.manualHoldUntil =
      Date.now() +
      sec *
      1000;

  }


  function rotationTick(){

    if(
      Date.now() <
      state.manualHoldUntil
    ){
      return;
    }


    choosePage(false);

  }


  function fullscreenActive(){

    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement
    );

  }


  function updateFullscreenButton(){

    $("fullscreenButton")
      .textContent =
        fullscreenActive()
        ? "Exit fullscreen"
        : "Fullscreen";

  }


  async function toggleFullscreen(){

    try{

      if(
        fullscreenActive()
      ){

        var exit =
          document.exitFullscreen ||
          document.webkitExitFullscreen;


        if(exit){

          await exit.call(
            document
          );

        }


      }else{

        var root =
          document.documentElement;


        var request =
          root.requestFullscreen ||
          root.webkitRequestFullscreen;


        if(request){

          await request.call(
            root
          );

        }


        if(
          cfg(
            [
              "kiosk",
              "requestLandscapeOnFullscreen"
            ],
            true
          ) &&
          screen.orientation &&
          screen.orientation.lock
        ){

          try{

            await screen.orientation
              .lock(
                "landscape"
              );

          }catch(e){}

        }

      }

    }catch(e){

      console.warn(
        "Fullscreen blocked",
        e
      );

    }


    updateFullscreenButton();

    setViewportHeight();

    scheduleControlsIdle();

  }


  $("fullscreenButton")
    .addEventListener(
      "click",
      toggleFullscreen
    );


  document.addEventListener(
    "fullscreenchange",
    updateFullscreenButton
  );


  document.addEventListener(
    "webkitfullscreenchange",
    updateFullscreenButton
  );


  updateFullscreenButton();


  var controlPanel =
    $("controlPanel");


  var controlToggle =
    $("controlToggle");


  function setControlsOpen(open){

    controlPanel
      .classList
      .toggle(
        "open",
        open
      );


    controlToggle
      .setAttribute(
        "aria-expanded",
        open
        ? "true"
        : "false"
      );


    controlToggle
      .textContent =
        open
        ? "×"
        : "☰";


    controlToggle
      .classList
      .remove(
        "idle"
      );


    if(open){

      scheduleControlsIdle();

    }

  }


  function scheduleControlsIdle(){

    if(
      state.controlsTimer
    ){

      clearTimeout(
        state.controlsTimer
      );

    }


    var sec =
      Number(
        cfg(
          [
            "kiosk",
            "autoHideControlsSeconds"
          ],
          8
        )
      );


    state.controlsTimer =
      setTimeout(
        function(){

          setControlsOpen(
            false
          );


          controlToggle
            .classList
            .add(
              "idle"
            );

        },
        Math.max(
          3,
          sec
        ) *
        1000
      );

  }


  controlToggle
    .addEventListener(
      "click",
      function(e){

        e.stopPropagation();


        setControlsOpen(
          !controlPanel
            .classList
            .contains(
              "open"
            )
        );

      }
    );


  controlPanel
    .addEventListener(
      "click",
      function(e){

        e.stopPropagation();

        scheduleControlsIdle();

      }
    );


  document.addEventListener(
    "pointerdown",
    function(e){

      controlToggle
        .classList
        .remove(
          "idle"
        );


      if(
        controlPanel
          .classList
          .contains(
            "open"
          ) &&
        !controlPanel
          .contains(
            e.target
          ) &&
        e.target !==
        controlToggle
      ){

        setControlsOpen(
          false
        );

      }


      scheduleControlsIdle();

    }
  );


  document
    .querySelectorAll(
      "[data-go]"
    )
    .forEach(
      function(btn){

        btn.addEventListener(
          "click",
          function(){

            var name =
              btn.getAttribute(
                "data-go"
              );


            var screens =
              cfg(
                [
                  "rotation",
                  "screens"
                ],
                [
                  "home",
                  "weather",
                  "calendar",
                  "video"
                ]
              );


            var idx =
              screens.indexOf(
                name
              );


            if(idx>=0){

              state.rotationIndex =
                idx;

            }


            startManualHold();

            showPage(name);

            setControlsOpen(
              false
            );

          }
        );

      }
    );


  $("nextScreenButton")
    .addEventListener(
      "click",
      function(){

        startManualHold();

        choosePage(false);

        setControlsOpen(false);

      }
    );


  document.addEventListener(
    "pointerdown",
    function(){

      clearTimeout(
        state.longPressTimer
      );


      state.longPressTimer =
        setTimeout(
          function(){

            setControlsOpen(true);

          },
          Number(
            cfg(
              [
                "kiosk",
                "longPressMs"
              ],
              650
            )
          )
        );

    }
  );


  document.addEventListener(
    "pointerup",
    function(){

      clearTimeout(
        state.longPressTimer
      );

    }
  );


  document.addEventListener(
    "pointercancel",
    function(){

      clearTimeout(
        state.longPressTimer
      );

    }
  );


  function healthRows(){

    var active =
      currentVideo();


    var canMp4 =
      document
        .createElement(
          "video"
        )
        .canPlayType(
          'video/mp4; codecs="avc1.42E01E"'
        ) ||
      "unknown";


    return [

      [
        "Build",
        BUILD_VERSION
      ],

      [
        "Config",
        CONFIG_LOADED
        ? "Loaded external config.js"
        : "Fallback config active"
      ],

      [
        "Config version",
        CFG.appVersion ||
        "not set"
      ],

      [
        "Connection",
        navigator.onLine !== false
        ? "Online"
        : "Offline"
      ],

      [
        "Current screen",
        state.page
      ],

      [
        "Playlist",
        state.playlistKey +
        " · " +
        state.videoPlaylist.length +
        " items"
      ],

      [
        "Current media",
        state.currentMedia ||
        "none"
      ],

      [
        "Media failures",
        String(
          state.mediaFailures
        )
      ],

      [
        "H.264 support",
        canMp4
      ],

      [
        "Video ready state",
        String(
          active.readyState
        ) +
        " / network " +
        String(
          active.networkState
        )
      ],

      [
        "Audio mode",
        currentAudioMode()
      ],

      [
        "Film audio",
        active.muted
        ? "muted"
        : "original soundtrack on"
      ],

      [
        "Music",
        state.soundUnlocked
        ? (
            $("jazzPlayer").paused
            ? "unlocked / paused"
            : "playing"
          )
        : "locked"
      ],

      [
        "TV frame",
        frameEnabled()
        ? "on"
        : "off"
      ],

      [
        "Manual hold",
        Date.now() <
        state.manualHoldUntil
        ? Math.ceil(
            (
              state.manualHoldUntil -
              Date.now()
            ) /
            1000
          ) +
          "s remaining"
        : "off"
      ],

      [
        "Weather updated",
        state.weatherUpdatedAt
        ? new Date(
            state.weatherUpdatedAt
          )
          .toLocaleTimeString()
        : "not yet"
      ],

      [
        "Calendar updated",
        state.calendarUpdatedAt
        ? new Date(
            state.calendarUpdatedAt
          )
          .toLocaleTimeString()
        : "not yet"
      ],

      [
        "Viewport",
        window.innerWidth +
        " × " +
        window.innerHeight
      ],

      [
        "User agent",
        navigator.userAgent
      ]

    ];

  }


  function updateHealth(){

    var grid =
      $("healthGrid");


    if(!grid){
      return;
    }


    grid.innerHTML="";


    healthRows()
      .forEach(
        function(r){

          var dt =
            document
              .createElement(
                "dt"
              );


          var dd =
            document
              .createElement(
                "dd"
              );


          dt.textContent =
            r[0];


          dd.textContent =
            r[1];


          grid.appendChild(
            dt
          );


          grid.appendChild(
            dd
          );

        }
      );

  }


  function openHealth(){

    updateHealth();


    $("healthPanel")
      .classList
      .add(
        "open"
      );


    setControlsOpen(
      false
    );

  }


  function closeHealth(){

    $("healthPanel")
      .classList
      .remove(
        "open"
      );

  }


  $("healthButton")
    .addEventListener(
      "click",
      openHealth
    );


  $("healthClose")
    .addEventListener(
      "click",
      closeHealth
    );


  $("healthPanel")
    .addEventListener(
      "click",
      function(e){

        if(
          e.target ===
          $("healthPanel")
        ){

          closeHealth();

        }

      }
    );


  $("retryMediaButton")
    .addEventListener(
      "click",
      function(){

        state.mediaFailures=0;

        refreshPlaylist(true);

        showPage("video");

        playCurrentMedia(true);

        updateHealth();

      }
    );


  $("reloadButton")
    .addEventListener(
      "click",
      function(){

        location.reload();

      }
    );


  function watchdog(){

    if(
      !cfg(
        [
          "recovery",
          "enabled"
        ],
        true
      ) ||
      document.hidden
    ){
      return;
    }


    if(
      state.page==="video" &&
      state.currentMedia &&
      !isImage(
        state.currentMedia
      )
    ){

      var active =
        currentVideo();


      var stall =
        Number(
          cfg(
            [
              "recovery",
              "mediaStallSeconds"
            ],
            15
          )
        ) *
        1000;


      if(
        !active.paused &&
        Date.now() -
        state.lastMediaProgressAt >
        stall
      ){

        state.mediaFailures++;


        console.warn(
          "Watchdog: stalled media, advancing"
        );


        nextMedia();

      }

    }


    if(
      state.mediaFailures >=
      Number(
        cfg(
          [
            "recovery",
            "reloadAfterConsecutiveFailures"
          ],
          8
        )
      )
    ){

      console.warn(
        "Watchdog: repeated media failures, reloading"
      );


      location.reload();

    }


    updateHealth();

  }


  function burnInShift(){

    var x =
      Math.floor(
        Math.random() *
        5
      ) -
      2;


    var y =
      Math.floor(
        Math.random() *
        5
      ) -
      2;


    $("screen")
      .style
      .transform =
        "translate(" +
        x +
        "px," +
        y +
        "px)";

  }


  $("displayName")
    .textContent =
      CFG.displayName ||
      "HOME TV";


  $("footerLeft")
    .textContent =
      "Mini Vestaboard v" +
      (
        CFG.appVersion ||
        BUILD_VERSION
      );


  updateSoundButton();

  updateAudioModeButton();


  try{

    var cached =
      JSON.parse(
        localStorage.getItem(
          "smartDisplayWeather"
        ) ||
        "null"
      );


    if(
      cached &&
      Date.now() -
      Number(
        cached.cachedAt ||
        0
      ) <
      6 *
      60 *
      60 *
      1000
    ){

      state.weather =
        cached;


      renderWeather();

    }

  }catch(e){}


  buildMusicPlaylist();

  applyVisualSettings();

  refreshPlaylist(true);

  renderCalendar();

  updateClock();

  fetchWeather();

  fetchCalendar();

  reconcileAudio();

  scheduleControlsIdle();


  setInterval(
    updateClock,
    1000
  );


  setInterval(
    rotationTick,
    Number(
      cfg(
        [
          "rotation",
          "secondsPerScreen"
        ],
        35
      )
    ) *
    1000
  );


  setInterval(
    fetchWeather,
    Number(
      cfg(
        [
          "weather",
          "refreshMinutes"
        ],
        20
      )
    ) *
    60000
  );


  setInterval(
    fetchCalendar,
    Number(
      cfg(
        [
          "calendar",
          "refreshMinutes"
        ],
        15
      )
    ) *
    60000
  );


  setInterval(
    burnInShift,
    5 *
    60000
  );


  setInterval(
    watchdog,
    Number(
      cfg(
        [
          "recovery",
          "watchdogSeconds"
        ],
        20
      )
    ) *
    1000
  );

})();
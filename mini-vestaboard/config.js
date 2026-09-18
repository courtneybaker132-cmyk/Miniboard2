// Mini Vestaboard v3.2 configuration
// Main settings live here. The HTML, CSS and app logic are now separate files.

window.SMART_DISPLAY_CONFIG = {

  appVersion: "3.2.2",

  displayName: "HOME TV",

  timezone: "America/New_York",


  weather: {

    enabled: true,

    latitude: 40.7128,

    longitude: -74.0060,

    locationName: "New York",

    temperatureUnit: "fahrenheit",

    refreshMinutes: 20,

    ambientEffects: true
  },


  calendar: {

    enabled: true,

    source: "manual",

    googleCalendarId: "",

    googleCalendarApiKey: "",

    refreshMinutes: 15,

    maxVisibleEvents: 3,

    events: [

      // {
      //   title: "Dinner reservation",
      //   start: "2026-09-18T19:00:00-04:00"
      // }

    ]
  },


  sound: {

    enabledByDefault: false,

    hourlyChime: true,

    morningChimeHour: 8,

    eveningChimeHour: 19,

    quietStartHour: 23,

    quietEndHour: 7
  },


  // cinema = piano on info screens + ORIGINAL soundtrack on films
  // music  = piano continues everywhere; film soundtrack stays muted
  // silent = no background music and film soundtrack stays muted

  audio: {

    mode: "cinema",

    fadeMs: 900,

    filmVolume: 0.72
  },


  quietDisplay: {

    enabled: true,

    screen: "video",

    brightness: 0.42
  },


  daytimeMusic: {

    enabled: true,

    volume: 0.10,

    shuffle: true,

    tracks: [

      "media/piano-nostalgic-old.mp3",

      "media/piano-gentle-cinematic.mp3",

      "media/piano-nostalgic-slow.mp3"

    ]
  },


  rotation: {

    enabled: true,

    secondsPerScreen: 35,

    screens: [

      "home",

      "weather",

      "calendar",

      "video"

    ]
  },


  screensaver: {

    enabled: true,

    collection: "vintage",

    showLabel: true,

    transitionMs: 650,

    mediaSeconds: 28,


    playlists: {

      vintage: [

        "media/fall-cartoon-painted-leaves.mp4",

        "media/fall-cartoon-sunshine-morning.mp4",

        "media/fall-cartoon-pumpkins.mp4"

      ]
    },


    mediaTitles: {

      "media/fall-cartoon-painted-leaves.mp4":
        "Jack Frost · Painted Leaves",

      "media/fall-cartoon-sunshine-morning.mp4":
        "The Sunshine Makers · Morning",

      "media/fall-cartoon-pumpkins.mp4":
        "Jack Frost · Pumpkin Patch"

    },


    timeOfDay: {

      enabled: true,


      morning: [

        "media/fall-cartoon-sunshine-morning.mp4",

        "media/fall-cartoon-painted-leaves.mp4",

        "media/fall-cartoon-pumpkins.mp4"

      ],


      afternoon: [

        "media/fall-cartoon-painted-leaves.mp4",

        "media/fall-cartoon-sunshine-morning.mp4",

        "media/fall-cartoon-pumpkins.mp4"

      ],


      evening: [

        "media/fall-cartoon-pumpkins.mp4",

        "media/fall-cartoon-painted-leaves.mp4",

        "media/fall-cartoon-sunshine-morning.mp4"

      ],


      night: [

        "media/fall-cartoon-pumpkins.mp4",

        "media/fall-cartoon-sunshine-morning.mp4",

        "media/fall-cartoon-painted-leaves.mp4"

      ]
    }
  },


  tvFrame: {

    enabled: true,

    image: "media/vintage-tv-frame.png"
  },


  crt: {

    scanlines: true,

    scanlineOpacity: 0.16,

    glass: true,

    glassOpacity: 0.24,

    flicker: true,

    flickerOpacity: 0.055,

    glow: 0.13
  },


  kiosk: {

    autoHideControlsSeconds: 8,

    longPressMs: 650,

    requestLandscapeOnFullscreen: true,

    manualHoldSeconds: 90
  },


  recovery: {

    enabled: true,

    watchdogSeconds: 20,

    mediaStallSeconds: 15,

    reloadAfterConsecutiveFailures: 8
  }

};
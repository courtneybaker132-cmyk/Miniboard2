// Mini Vestaboard v3.2 configuration
// Main settings live here.
// The HTML, CSS and app logic are now separate files.

window.SMART_DISPLAY_CONFIG = {

  appVersion: "3.2.0",

  displayName: "HOME TV",

  timezone: "America/New_York",


  // =========================================================
  // WEATHER
  // =========================================================

  weather: {

    enabled: true,

    latitude: 40.7128,

    longitude: -74.0060,

    locationName: "New York",

    temperatureUnit: "fahrenheit",

    refreshMinutes: 20,

    ambientEffects: true
  },


  // =========================================================
  // CALENDAR
  // =========================================================

  calendar: {

    enabled: true,

    source: "manual",

    googleCalendarId: "",

    googleCalendarApiKey: "",

    refreshMinutes: 15,

    maxVisibleEvents: 3,

    events: [

      // Example:
      //
      // {
      //   title: "Dinner reservation",
      //   start: "2026-09-18T19:00:00-04:00"
      // }

    ]
  },


  // =========================================================
  // GENERAL SOUND
  // =========================================================

  sound: {

    enabledByDefault: false,

    hourlyChime: true,

    morningChimeHour: 8,

    eveningChimeHour: 19,

    quietStartHour: 23,

    quietEndHour: 7
  },


  // =========================================================
  // AUDIO MODE
  // =========================================================
  //
  // cinema
  //   Piano plays on Home / Weather / Calendar.
  //   Original cartoon soundtrack plays on film screen.
  //
  // music
  //   Piano continues on all screens.
  //   Cartoon soundtrack is muted.
  //
  // silent
  //   No background audio.
  //

  audio: {

    mode: "cinema",

    fadeMs: 900,

    // Volume of original cartoon soundtrack
    filmVolume: 0.72
  },


  // =========================================================
  // NIGHT MODE
  // =========================================================

  quietDisplay: {

    enabled: true,

    screen: "video",

    brightness: 0.42
  },


  // =========================================================
  // BACKGROUND PIANO
  // =========================================================

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


  // =========================================================
  // SCREEN ROTATION
  // =========================================================

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


  // =========================================================
  // VINTAGE FILMS
  // =========================================================

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


  // =========================================================
  // VINTAGE TV CABINET
  // =========================================================

  tvFrame: {

    enabled: true,

    image: "media/vintage-tv-frame.png"
  },


  // =========================================================
  // CRT EFFECTS
  // =========================================================
  //
  // These are intentionally subtle.
  //
  // You can change these later without touching CSS.
  //

  crt: {

    scanlines: true,

    scanlineOpacity: 0.16,

    glass: true,

    glassOpacity: 0.24,

    flicker: true,

    flickerOpacity: 0.055,

    glow: 0.13
  },


  // =========================================================
  // FIRE TABLET / KIOSK
  // =========================================================

  kiosk: {

    autoHideControlsSeconds: 8,

    longPressMs: 650,

    requestLandscapeOnFullscreen: true,

    manualHoldSeconds: 90
  },


  // =========================================================
  // AUTO RECOVERY
  // =========================================================

  recovery: {

    enabled: true,

    watchdogSeconds: 20,

    mediaStallSeconds: 15,

    reloadAfterConsecutiveFailures: 8
  }

};
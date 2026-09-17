// Mini Vestaboard v3.1 configuration
// Safe to edit. Keep the surrounding braces/commas intact.

window.SMART_DISPLAY_CONFIG = {
  appVersion: "3.1.0",
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
    source: "manual", // "manual" or "google-public"
    googleCalendarId: "",
    googleCalendarApiKey: "",
    refreshMinutes: 15,
    maxVisibleEvents: 3,

    events: [
      // Example:
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

  /*
    AUDIO MODES

    "cinema"
      Music plays on Home / Weather / Calendar.
      Music fades away when a vintage film starts.
      Soft projector ambience replaces it.

    "music"
      Music continues on every screen.

    "silent"
      Background music and film ambience stay off.
  */

  audio: {
    mode: "cinema",

    fadeMs: 900,

    filmAmbience: {
      enabled: true,

      // Keep this subtle.
      volume: 0.018,

      humFrequency: 54,

      crackle: true
    }
  },

  /*
    NIGHT MODE
    11 PM → 7 AM
  */

  quietDisplay: {
    enabled: true,
    screen: "video",
    brightness: 0.42
  },

  /*
    BACKGROUND MUSIC

    These tracks play only on the information screens
    when Cinema mode is enabled.

    They automatically fade out when a cartoon begins.
  */

  daytimeMusic: {
    enabled: true,

    // Lower volume works much better for an ambient display.
    volume: 0.10,

    shuffle: true,

    tracks: [
      "media/piano-nostalgic-old.mp3",
      "media/piano-gentle-cinematic.mp3",
      "media/piano-nostalgic-slow.mp3"
    ]
  },

  /*
    SCREEN ROTATION
  */

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

  /*
    VINTAGE FILMS
  */

  screensaver: {
    enabled: true,

    collection: "vintage",

    showLabel: true,

    // Smooth crossfade between videos.
    transitionMs: 650,

    // Approximate display duration.
    mediaSeconds: 28,

    playlists: {
      vintage: [
        "media/fall-cartoon-painted-leaves.mp4",
        "media/fall-cartoon-sunshine-morning.mp4",
        "media/fall-cartoon-pumpkins.mp4"
      ]
    },

    /*
      Friendly titles shown instead of filenames.
    */

    mediaTitles: {
      "media/fall-cartoon-painted-leaves.mp4":
        "Jack Frost · Painted Leaves",

      "media/fall-cartoon-sunshine-morning.mp4":
        "The Sunshine Makers · Morning",

      "media/fall-cartoon-pumpkins.mp4":
        "Jack Frost · Pumpkin Patch"
    },

    /*
      TIME-OF-DAY PLAYLIST ORDER

      Same three films, but their starting order changes
      depending on the time.
    */

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

  /*
    FIRE TABLET / KIOSK SETTINGS
  */

  kiosk: {
    // Hide the menu after inactivity.
    autoHideControlsSeconds: 8,

    // Long press anywhere to bring controls back.
    longPressMs: 650,

    // Attempt landscape orientation in fullscreen.
    requestLandscapeOnFullscreen: true,

    // If you manually choose a screen,
    // stay there before auto rotation resumes.
    manualHoldSeconds: 90
  },

  /*
    AUTOMATIC RECOVERY

    Helps the Fire tablet recover if a video freezes
    or the browser has been running for a long time.
  */

  recovery: {
    enabled: true,

    watchdogSeconds: 20,

    mediaStallSeconds: 15,

    reloadAfterConsecutiveFailures: 8
  }
};
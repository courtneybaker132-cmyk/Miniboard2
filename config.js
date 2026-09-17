// Mini Vestaboard v3 configuration
// Safe to edit. Keep the surrounding braces/commas intact.

window.SMART_DISPLAY_CONFIG = {
  appVersion: "3.0.0",
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
      // { title: "Dinner reservation", start: "2026-09-18T19:00:00-04:00" }
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

  quietDisplay: {
    enabled: true,
    screen: "video",
    brightness: 0.42
  },

  daytimeMusic: {
    enabled: true,
    volume: 0.18,
    shuffle: true,
    tracks: [
      "media/jazz-sunny-cafe.mp3",
      "media/jazz-study-session.mp3",
      "media/jazz-lounge-evening.mp3",
      "media/jazz-rainy-night.mp3"
    ]
  },

  rotation: {
    enabled: true,
    secondsPerScreen: 35,
    screens: ["home", "weather", "calendar", "video"]
  },

  screensaver: {
    enabled: true,
    collection: "vintage",
    showLabel: true,
    transitionMs: 650,
    mediaSeconds: 28,

    // Primary vintage cartoon playlist.
    playlists: {
      vintage: [
        "media/fall-cartoon-painted-leaves.mp4",
        "media/fall-cartoon-sunshine-morning.mp4",
        "media/fall-cartoon-pumpkins.mp4"
      ]
    },

    // The same cartoons play in different orders depending on time of day.
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

  kiosk: {
    autoHideControlsSeconds: 8,
    longPressMs: 650,
    requestLandscapeOnFullscreen: true
  },

  recovery: {
    enabled: true,
    watchdogSeconds: 20,
    mediaStallSeconds: 15,
    reloadAfterConsecutiveFailures: 8
  }
};
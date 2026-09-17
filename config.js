// Smart Display v2 configuration
// Edit only the values in this file when you want to customize the display.

window.SMART_DISPLAY_CONFIG = {
  displayName: "HOME TV",
  timezone: "America/New_York",

  // Weather: defaults to New York City. Change these if the display moves.
  weather: {
    enabled: true,
    latitude: 40.7128,
    longitude: -74.0060,
    locationName: "New York",
    temperatureUnit: "fahrenheit",
    refreshMinutes: 20
  },

  // Calendar:
  // "manual" works immediately using the events below.
  // "google-public" uses a PUBLIC Google Calendar and a Google Calendar API key.
  calendar: {
    enabled: true,
    source: "manual", // "manual" or "google-public"
    googleCalendarId: "",
    googleCalendarApiKey: "",
    refreshMinutes: 15,
    events: [
      // Example:
      // { title: "Dinner reservation", start: "2026-09-13T19:00:00-04:00" }
    ]
  },

  // Sound settings for music and hourly chimes.
  sound: {
    enabledByDefault: false,
    hourlyChime: true,
    morningChimeHour: 8,
    eveningChimeHour: 19,
    quietStartHour: 23,
    quietEndHour: 7
  },

  // During quiet hours, keep only the seasonal scene visible at lower brightness.
  quietDisplay: {
    enabled: true,
    screen: "video",
    brightness: 0.42
  },

  // Add local MP3 or M4A files here.
  // Music plays only outside quiet hours and starts after sound is enabled.
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

  // Automatic screen rotation.
  rotation: {
    enabled: true,
    secondsPerScreen: 35,
    screens: ["home", "weather", "calendar", "video"]
  },

  // Screensaver. "seasonal" changes automatically by month.
  // You can also choose "vintage", "games", or "mix" for video playlists.
  screensaver: {
    enabled: true,
    collection: "seasonal",
    season: "auto", // "auto", "fall", "winter", "spring", or "summer"
    showLabel: true,
    motionEffects: true,

    seasonal: {
      fall: [
        "media/fall-vintage-dog.png",
        "media/fall-cartoon-painted-leaves.mp4",
        "media/fall-misty-lake.mp4",
        "media/fall-cartoon-sunshine-morning.mp4",
        "media/fall-window-view.mp4",
        "media/fall-cartoon-pumpkins.mp4",
        "media/fall-maple-branches.mp4",
        "media/fall-pavement-leaves.mp4"
      ],

      winter: [],
      spring: [],
      summer: []
    },

    playlists: {
      vintage: [
        "media/fall-cartoon-painted-leaves.mp4",
        "media/fall-cartoon-sunshine-morning.mp4",
        "media/fall-cartoon-pumpkins.mp4"
      ],

      games: [
        // "media/retro-gameplay-1.mp4",
        // "media/retro-gameplay-2.mp4"
      ]
    }
  }
};
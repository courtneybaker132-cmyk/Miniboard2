window.SMART_DISPLAY_CONFIG = {
  displayName: "HOME TV",
  timezone: "America/New_York",

  weather: {
    enabled: true,
    latitude: 40.7128,
    longitude: -74.0060,
    locationName: "New York",
    temperatureUnit: "fahrenheit",
    refreshMinutes: 20
  },

  calendar: {
    enabled: true,
    source: "manual",
    googleCalendarId: "",
    googleCalendarApiKey: "",
    refreshMinutes: 15,
    events: [
      // Add events like this:
      // {
      //   title: "Dinner reservation",
      //   start: "2026-10-03T19:00:00-04:00"
      // }
    ]
  },

  sound: {
    enabledByDefault: false,
    tileFlip: true,
    tileFlipVolume: 0.035,
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
    collection: "seasonal",

    // "auto", "fall", "winter", "spring", or "summer"
    season: "auto",

    showLabel: true,
    motionEffects: true,

    seasonal: {
      fall: [
        "media/fall-vintage-dog.png",
        "media/fall-misty-lake.mp4",
        "media/fall-window-view.mp4",
        "media/fall-maple-branches.mp4",
        "media/fall-pavement-leaves.mp4"
      ],
      winter: [],
      spring: [],
      summer: []
    },

    playlists: {
      vintage: [],
      games: []
    }
  }
};
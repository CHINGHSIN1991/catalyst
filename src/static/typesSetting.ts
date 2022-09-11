type PersonalSettings = {
  userName: string
  mode: "LIGHT_MODE"|"DARK_MODE"|"CYBERPUNK",
  weatherOptions: {
    tempScale: string
  },
  languageOptions:{
    language: string
  },
  timerOptions :{
    default: number
  },
  screenTool: {
    isOn: boolean
    position: "LEFT_TOP" | "LEFT_MIDDLE" | "LEFT_BOTTOM" | "RIGHT_TOP" | "RIGHT_MIDDLE" | "RIGHT_BOTTOM"
    size: "SMALL" | "MIDDLE" | "LARGE"
  }
}
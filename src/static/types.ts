export type userInfo = {
  name: string,
  email: string,
  id: string,
  authToken: string,
}

export type isEditOn = {
  isEditOn: boolean
}

export type currentComparison = { index: number, current: number; };

export type appliedComparison = { index: number, applied: number; };

export type bol = { bol: boolean; };

type role = {
  email: string, displayName: string, self: boolean;
};

export type timeNode = { dateTime: string, timeZone: string; };
export type timeDay = { date: string; };

export type calendarItem  = {
  colorId?: string;
  created?: string;
  creator?: role;
  end: timeNode | timeDay;
  etag?: string;
  evenType: string;
  htmlLink?: string;
  iCalUID: string;
  id?: string;
  kind?: string;
  organizer?: role;
  reminders?: { useDefault: boolean; };
  sequence?: 0;
  start: timeNode | timeDay;
  status?: string;
  summary: string;
  updated?: string;
  visibility?: 'public' | 'private',
}

export type tempEvent = {
  summary: string,
  isAllDay: boolean,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  visibility: 'public' | 'private',
  colorId: string,
}

export type shortcut = {
  id?: number,
  logo?: string,
  name: string,
  url: string,
};

export type background = {
  id: string,
  url: string,
  smallUrl: string,
  user: string,
  profile: string,
  downloadLink: string,
} 

export type backgroundSetting = {
  bgSetting:{
    lastUpdate: string,
    current: {
      setting: number,
      slice: number,
    },
  },  
  backgroundList: background[][]
}

export type optionSetting = {
  isMilitary: boolean,
  isCelsius: boolean,
  isMenuShow: boolean,
  idCalendarColorful: boolean,
  isPrivateShow: boolean,
  isDarkMode: boolean,
  isPageToolShow: boolean,
  pronounce: string,
}

export type tempMemo = {
  memo: string;
  color: string;
};

export type memo = {
  id: string,
  memo: string,
  color: string,
  position: { x: number, y: number; },
  createTime: number,
  createAt?: { title: string, url: string; },
};

export type todo = {
  workContent: string;
  isDone?: boolean;
  id: number;
  isSetAlert: boolean;
  alertDate?: string;
  alertTime?: string;
  alertSend?: boolean;
}

export type unsplashData = {
  id: string,
  created_at: Date,
  updated_at: Date,
  promoted_at: null|Date,
  width: number,
  height: number,
  color: string,
  blur_hash: string,
  description: string|null,
  alt_description: string|null,
  urls: {
      raw: string,
      full: string,
      regular: string,
      small: string,
      thumb: string,
      small_s3: string,
  },
  links: {
      self: string,
      html: string,
      download: string,
      download_location: string,
  },
  likes: number,
  liked_by_user: boolean,
  current_user_collections: string[],
  sponsorship: {
      impression_urls: string[],
      tagline: string,
      tagline_url: string,
      sponsor: {
          id: string,
          updated_at: Date,
          username: string,
          name: string|null,
          first_name: string|null,
          last_name: string|null,
          twitter_username: string|null,
          portfolio_url: string,
          bio: string,
          location: string|null,
          links: {
              self: string,
              html: string,
              photos: string,
              likes: string,
              portfolio: string,
              following: string,
              followers: string,
          },
          profile_image: {
              small: string
              medium: string
              large: string
          },
          instagram_username: string,
          total_collections: number,
          total_likes: number,
          total_photos: number,
          accepted_tos: boolean
          for_hire: boolean
          social: {
              instagram_username: string|null,
              portfolio_url: string|null,
              twitter_username: string|null,
              paypal_email: string|null
          }
      }
  },
  topic_submissions: {},
  user: {
      id: string,
      updated_at: Date,
      username: string,
      name: string,
      first_name: string,
      last_name: string|null,
      twitter_username: string|null,
      portfolio_url: string,
      bio: string|null
      location: string|null,
      links: {
          self: string,
          html: string,
          photos: string,
          likes: string,
          portfolio: string,
          following: string,
          followers: string,
      },
      profile_image: {
          small: string,
          medium: string,
          large: string,
      },
      instagram_username: string,
      total_collections: number,
      total_likes: number,
      total_photos: number
      accepted_tos: boolean,
      for_hire: string,
      social: {
          instagram_username: string|null,
          portfolio_url: string|null,
          twitter_username: string|null,
          paypal_email: string|null,
      }
  }
}

export type openWeatherData = {
    coord: {
      lon: number,
      lat: number,
    };
    weather: [
      {
        id: number,
        main: string,
        description: string,
        icon: string,
      }
    ],
    base: string,
    main: {
      temp: number,
      feels_like: number,
      temp_min: number,
      temp_max: number,
      pressure: number,
      humidity: number,
      sea_level: number,
      grnd_level: number;
    },
    visibility: number,
    wind: {
      speed: number,
      deg: number,
      gust: number;
    },
    rain: {
      "1h": number;
    },
    clouds: {
      "all": number;
    },
    dt: number,
    sys: {
      type: number,
      id: number,
      country: string,
      sunrise: number,
      sunset: number,
    },
    timezone: number,
    id: number,
    name: string,
    cod: number,
  }

  export type calendarColor = {
    name:string,
    code:string,
    monoCode:string,
    colorId:string,
  }

  export type scheme = {
    theme:{
      accentColor: string,
      accentColorSecondary: string,
      accentText: string,
      primary: string,
      secondary: string,
      tertiary: string,
      fourthly: string,
      primaryOpacity: string,
      primarySemiopaque: string,
      primaryHover: string,
      inversePrimary: string,
      inverseSecondary: string,
      panelBackground: string,
      panelBorder: string,
    }    
  }

  export type inspirationNote = {
    id: number,
    logo: string,
    note: string,
    title: string,
    url: string,
  }

  export type centralPanel = {
    centralPanel: 'Pomodoro'|'Weather'
  }

  type delEvent = (item:calendarItem)=>void
  type clearAll = ()=>void
  type replaceFirstImage = (image:background, collection:number)=>void
  type deleteTag = (deletedTag:string)=>void

  export type alertState = {
    title: string,
    message?: string,
    function?: delEvent|clearAll|replaceFirstImage|deleteTag,
  }

  export type timeData = timeNode | timeDay
  export type timeKey = 'start' | 'end'

  export type setNumberState = (state: number) => void
  type timeDisplay = {
    minutes: string,
    seconds: string,
  }
  export type setTimeDisplay = (timeDisplay:timeDisplay)=>void
  type stateValue = {value: number}
  export type setPomoAlertTime = (value:stateValue)=>void
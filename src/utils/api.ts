export async function fetchWeatherData(lat:number,lon:number) :Promise<any>{
  console.log(lat)
  console.log(lon)
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`)
  if(!res.ok) {
    throw new Error('something wrong')
  }
  const data = await res.json()
  return data
}

export async function getLocationKey(lat:number,lon:number) :Promise<any>{
  console.log(lat)
  console.log(lon)
  const res = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.ACCU_WEATHER_API_KEY}&q=${lat},${lon}`)
  if(!res.ok) {
    throw new Error('something wrong')
  }
  const data = await res.json()
  return data
}

export async function fetchAccuWeatherData(locationKey: string) :Promise<any>{
  const res = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${process.env.ACCU_WEATHER_API_KEY}&metric=true`)
  if(!res.ok) {
    throw new Error('something wrong')
  }
  const data = await res.json()
  return data
}

export async function fetchCalendarData(id: string, dayStart: Date, dayEnd: Date, token: string){
  const headers = new Headers({
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  });
  const queryParams = { headers };
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${id}/events?timeMin=${dayStart.toISOString()}&timeMax=${dayEnd.toISOString()}`, queryParams)
  if(! res.ok) {
    throw new Error ('can not get data')
  }
  const data = await res.json()
  return data
}

export async function getBackgroundImg(query?: string) {
  const page = Math.floor(Math.random()*100);
  if(query){
    console.log(query);
    const res = await fetch(`https://api.unsplash.com/photos/?client_id=${process.env.UNSPLASH_API_KEY}&query=${query}&page=${page}`)
    if(! res.ok) {
      throw new Error ('can not get image')
    }
    const data = await res.json()
    return data
  } else {
    console.log('no query');
    const res = await fetch(`https://api.unsplash.com/photos/?client_id=${process.env.UNSPLASH_API_KEY}&page=${page}`)
    if(! res.ok) {
      throw new Error ('can not get image')
    }
    const data = await res.json()
    return data
  }
  
}
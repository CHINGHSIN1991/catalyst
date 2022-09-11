
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
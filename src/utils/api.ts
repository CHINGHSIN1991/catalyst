
export async function fetchWeatherData(lat:number,lon:number) :Promise<any>{
  const res = await fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`)
  if(!res.ok) {
    throw new Error('something wrong')
  }
  const data = await res.json()
  return data
}
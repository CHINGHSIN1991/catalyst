
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
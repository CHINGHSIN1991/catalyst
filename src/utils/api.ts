import { userInfo, tempEvent } from "../static/types"
import { v4 as uuidv4 } from 'uuid';

export async function fetchWeatherData(lat:number,lon:number) :Promise<any>{
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

export async function postNewEvent(userInfo: userInfo, tempEvent: tempEvent) {
    let requestBody = {
      iCalUID: uuidv4(),
      summary: tempEvent.summary,
      visibility: tempEvent.visibility,
      colorId: tempEvent.colorId,
      start: {},
      end: {},
    }
    if(tempEvent.isAllDay) {
      requestBody.start = {date: tempEvent.startDate}
      requestBody.end = {date: tempEvent.endDate} 
    } else {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      requestBody.start = {
        dateTime: (new Date(`${tempEvent.startDate} ${tempEvent.startTime}`)).toISOString(),
        timeZone
      }
      requestBody.end = {
        dateTime: (new Date(`${tempEvent.endDate} ${tempEvent.endTime}`)).toISOString(),
        timeZone
      }
    }
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${userInfo.email}/events/import`, {
      headers: new Headers({
        'Authorization': 'Bearer ' + userInfo.authToken,
        'Content-Type': 'application/json'
      }),
      method: "POST",
      body: JSON.stringify(requestBody)
    })
    if(! res.ok) {
      throw new Error ('post fail')
    }
    const data = await res.json()
    return data
}

export async function getBackgroundImg(query?: string) {
  const page = Math.floor(Math.random()*100);
  if(query){
    // console.log(query);
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
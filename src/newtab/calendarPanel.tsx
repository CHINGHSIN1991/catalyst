import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { useScript } from '../hooks/useScript';
import { PanelBasicSetting } from './styleSetting';

const CalendarWrapper = styled(PanelBasicSetting)`
  /* border: solid 1px;   */
`

declare const googlApis: any
declare const googleGsiClient: any

export const CalendarPanel: React.FC<{}> = () => {
  const CLIENT_ID = process.env.CALENDAR_CLIENT_ID;
  const API_KEY = process.env.CALENDAR_API_KEY;
  console.log(API_KEY);
  // const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  // const SCOPES = 'https://www.googleapis.com/auth/calendar';

  // const [tokenClient, setTokenClinet] = useState('');
  // const [gapiInited, setGapiInited] = useState(false);
  // const [gisInited, setGisInited] = useState(false);

  const googlApisStatus = useScript("https://apis.google.com/js/api.js");
  const googleGsiClientStatus = useScript("https://accounts.google.com/gsi/client");
  // /**
  //    * Callback after api.js is loaded.
  //    */
  // function gapiLoaded() {
  //   gapi.load('client', intializeGapiClient);
  // }

  // /**
  //  * Callback after the API client is loaded. Loads the
  //  * discovery doc to initialize the API.
  //  */
  // async function intializeGapiClient() {
  //   await gapi.client.init({
  //     apiKey: API_KEY,
  //     discoveryDocs: [DISCOVERY_DOC],
  //   });
  //   setGapiInited(true);
  //   maybeEnableButtons();
  // }

  // /**
  //    * Callback after Google Identity Services are loaded.
  //    */
  // function gisLoaded() {
  //   tokenClient = google.accounts.oauth2.initTokenClient({
  //     client_id: CLIENT_ID,
  //     scope: SCOPES,
  //     callback: '', // defined later
  //   });
  //   gisInited = true;
  //   maybeEnableButtons();
  // }

  // /**
  //    * Enables user interaction after all libraries are loaded.
  //    */
  // function maybeEnableButtons() {
  //   if (gapiInited && gisInited) {
  //     document.getElementById('authorize_button').style.visibility = 'visible';
  //   }
  // }

  // /**
  //    *  Sign in the user upon button click.
  //    */
  // function handleAuthClick() {
  //   tokenClient.callback = async (resp) => {
  //     if (resp.error !== undefined) {
  //       throw (resp);
  //     }
  //     document.getElementById('signout_button').style.visibility = 'visible';
  //     document.getElementById('authorize_button').innerText = 'Refresh';
  //     await listUpcomingEvents();
  //   };

  //   if (gapi.client.getToken() === null) {
  //     // Prompt the user to select a Google Account and ask for consent to share their data
  //     // when establishing a new session.
  //     tokenClient.requestAccessToken({ prompt: 'consent' });
  //   } else {
  //     // Skip display of account chooser and consent dialog for an existing session.
  //     tokenClient.requestAccessToken({ prompt: '' });
  //   }
  // }

  // /**
  //    *  Sign out the user upon button click.
  //    */
  // function handleSignoutClick() {
  //   const token = gapi.client.getToken();
  //   if (token !== null) {
  //     google.accounts.oauth2.revoke(token.access_token);
  //     gapi.client.setToken('');
  //     document.getElementById('content').innerText = '';
  //     document.getElementById('authorize_button').innerText = 'Authorize';
  //     document.getElementById('signout_button').style.visibility = 'hidden';
  //   }
  // }

  // /**
  //    * Print the summary and start datetime/date of the next ten events in
  //    * the authorized user's calendar. If no events are found an
  //    * appropriate message is printed.
  //    */
  // async function listUpcomingEvents() {
  //   let response;
  //   try {
  //     const request = {
  //       'calendarId': 'primary',
  //       'timeMin': (new Date()).toISOString(),
  //       'showDeleted': false,
  //       'singleEvents': true,
  //       'maxResults': 10,
  //       'orderBy': 'startTime',
  //     };
  //     response = await gapi.client.calendar.events.list(request);
  //   } catch (err) {
  //     document.getElementById('content').innerText = err.message;
  //     return;
  //   }

  //   const events = response.result.items;
  //   if (!events || events.length == 0) {
  //     document.getElementById('content').innerText = 'No events found.';
  //     return;
  //   }
  //   // Flatten to string to display
  //   const output = events.reduce(
  //     (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
  //     'Events:\n');
  //   document.getElementById('content').innerText = output;
  // }

  useEffect(() => {
    if (typeof googlApis !== 'undefined') {
      console.log(googlApis)
    }
  }, [googlApisStatus])

  useEffect(() => {
    if (typeof googleGsiClient !== 'undefined') {
      console.log(googleGsiClient)
    }
  }, [googleGsiClientStatus])

  return (
    <CalendarWrapper>
      <p>Google Calendar API Quickstart</p>
      {/* <button id="authorize_button" onClick={handleAuthClick}>Authorize</button>
      <button id="signout_button" onClick={handleSignoutClick}>Sign Out</button> */}
      <button id="authorize_button" onClick={() => console.log("authorize_button")}>Authorize</button>
      <button id="signout_button" onClick={() => console.log("signout_button")}>Sign Out</button>
    </CalendarWrapper >
  );
}


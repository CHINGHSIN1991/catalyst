import React from 'react';
import ReactDOM from 'react-dom/client'

const test = <img src="tempLogo.png" alt="" />

const rootElement = document.createElement('div')
document.body.appendChild(rootElement)
const root = ReactDOM.createRoot(rootElement);

root.render(test)

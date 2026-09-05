import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import './custom-theme.css';
import {AppStateProvider} from './context/AppState.jsx';
import {ReferralProvider} from './context/ReferralEngine.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><AppStateProvider><ReferralProvider><App/></ReferralProvider></AppStateProvider></BrowserRouter></React.StrictMode>);

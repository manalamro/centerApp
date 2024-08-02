import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './hooks/useAuth'; // Import your AuthProvider component
import App from './App'; // Import your root App component
import {disableReactDevTools} from '@fvilers/disable-react-devtools'
const rootElement = document.getElementById('root');

// Use createRoot to render your application
const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  /*</React.StrictMode>*/
);

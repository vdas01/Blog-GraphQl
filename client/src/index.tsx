import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {ApolloProvider} from "@apollo/client"
import {ApolloClient,InMemoryCache} from "@apollo/client/core"
import {Provider} from "react-redux"
import { store } from './store';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const client = new ApolloClient({uri:"http://localhost:5000/graphql",cache:new InMemoryCache()})
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <ApolloProvider client={client}>
    <BrowserRouter>

       <App />
    </BrowserRouter>
    </ApolloProvider>
    </Provider>
  </React.StrictMode>
);


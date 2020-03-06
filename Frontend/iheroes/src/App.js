import React from 'react';
import './App.css';
import './assets/css/Login.css'
import './assets/css/Heroes.css'
import './assets/css/Occurrences.css'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';

import Reducers from './reducers/Reducers'
import ReduxToastr from 'react-redux-toastr'
import Manager from './components/inicial/Manager'

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(Reducers,devTools)


function App() {
  return (
    <Provider store={store}>

      <ReduxToastr
      timeOut={4000}
      newestOnTop={false}
      preventDuplicates
      position="top-left"
      getState={(state) => state.toastr} // This is the default
      transitionIn="fadeIn"
      transitionOut="fadeOut"
      progressBar
      closeOnToastrClick/>

      <Manager/>

    </Provider>
      
  );
}

export default App;

import './App.css';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Login, Signup }  from './ClientAuth';
import Main from './Main';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
            <Route path='/savory/login' exact>
              <Login></Login>
            </Route>
            <Route path='/savory/signup' exact>
              <Signup></Signup>
            </Route>
            <Route path='/savory/main' exact>
              <Main></Main>
            </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

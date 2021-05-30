import logo from './logo.svg';
import './App.css';
import './form/AppForm';
import InputForm from './form/AppForm';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <p>
            Detekcja i korekcja błędów w transmisji danych
          </p>
        </header>
        <main>
          <InputForm/>
        </main>
      </div>
  );
}

export default App;

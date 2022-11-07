import logo from './logo.svg';
import './App.css';
// import { getAccountInfo } from './ftx.rest';
import { useRef, useState } from 'react';
import { getAccountInfo } from './binance.rest';

const _checkPing = () => {
  const now = Date.now();
  return getAccountInfo().then(() => Date.now() - now);
};

function App() {
  const [iteration, setIteration] = useState(0);
  const data = useRef([]);

  const checkPing = () => {
    const doExperiment = () => _checkPing()
      .then(value => data.current.push(value))
      .then(() => setIteration(i => i + 1));

    const intervalId = setInterval(doExperiment, 1000);

    setTimeout(() => clearInterval(intervalId), 10000);
  };

  const avg = Math.floor(data.current.reduce((acc, val) => acc + val, 0) / data.current.length);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={checkPing}>одно нажатие = 10 попыток</button>
        <div>попыток: {iteration}</div>
        <div>средний пинг: {isNaN(avg) ? '-' : avg}ms</div>
      </header>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';

import pokeApi from './api';

const STATUS = {
  START: 'START',
  PLAYING: 'PLAYING',
  END: 'END'
};

const MAX_ATTEMPTS = 5;

const App = () => {
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState(STATUS.START);
  const [buffer, setBuffer] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleStart = async () => {
    const randomPokemon = await pokeApi.random();
    setPokemon(randomPokemon);
    setStatus(STATUS.PLAYING);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { pokemon: guess } = event.target;
    if (guess.value.trim().toLowerCase() === pokemon.name) {
      setStatus(STATUS.END);
      setAttempts(0);
      alert('Correct!');
    } else {
      setAttempts((prev) => prev + 1);
    }
    setBuffer('');
  };

  useEffect(() => {
    const fetchPokemon = async () => {
      const randomPokemon = await pokeApi.random();
      setPokemon(randomPokemon);
      setAttempts(0);
    };
    if (attempts === MAX_ATTEMPTS) {
      fetchPokemon();
    }
  }, [attempts]);

  return (
    <main>
      <div className="container">
        <div className="forest" />
        <div className="nes-container with-title is-dark is-centered is-rounded">
          <div className="nes-container is-centered is-rounded">
            <p className="title">Poke Guess</p>
          </div>
        </div>
        {status !== STATUS.START && (
          <div className="arena">
            <img alt="pokemon" className={`pokemon ${status === STATUS.PLAYING ? 'hidden' : ''}`} src={pokemon.image} />
            {status === STATUS.PLAYING && (
              <form className="nes-container is-white is-centered is-rounded form" onSubmit={handleSubmit}>
                <input
                  autoFocus
                  className="nes-input"
                  name="pokemon"
                  type="text"
                  value={buffer}
                  onChange={(e) => setBuffer(e.target.value)}
                />
                <button className="nes-btn is-primary">Submit</button>
              </form>
            )}
          </div>
        )}
        {status !== STATUS.PLAYING && (
          <button className="nes-btn is-primary play" onClick={handleStart}>
            {status === STATUS.START ? 'Start' : 'Play again'}
          </button>
        )}
      </div>
    </main>
  );
};

export default App;

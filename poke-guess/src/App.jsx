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
      {status !== STATUS.PLAYING && (
        <div>
          <button onClick={handleStart}> {status === STATUS.START ? 'Start' : 'Play again'}</button>
        </div>
      )}
      {status !== STATUS.START && (
        <div>
          <img
            src={pokemon.image}
            style={{
              filter: status === STATUS.PLAYING ? 'brightness(0) invert(1)' : 'none'
            }}
          />
          {status === STATUS.PLAYING && (
            <form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
              onSubmit={handleSubmit}
            >
              <input autoFocus name="pokemon" type="text" value={buffer} onChange={(e) => setBuffer(e.target.value)} />
              <button
                style={{
                  margin: 'auto'
                }}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      )}
    </main>
  );
};

export default App;

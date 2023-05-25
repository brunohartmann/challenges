import { useState } from 'react';

import pokeApi from './api';

const STATUS = {
  START: 'START',
  PLAYING: 'PLAYING',
  END: 'END'
};

const App = () => {
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState(STATUS.START);
  const [buffer, setBuffer] = useState('');

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
      alert('Correct!');
    }
    setBuffer('');
  };

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

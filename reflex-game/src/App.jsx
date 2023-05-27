import { useEffect, useState } from 'react';

const STATUS = {
  INITIAL: 'initial',
  PLAYING: 'playing',
  FINISHED: 'finished'
};
const TARGET_SIZE = 48;
const DIFFICULTY = 0.05;

const getRandomPosition = () => ({ x: Math.random() * 100, y: Math.random() * 100 });

const getScale = (score) => 1 - score * DIFFICULTY;

function App() {
  const [status, setStatus] = useState(STATUS.INITIAL);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(getRandomPosition());
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval = 0;
    if (status === STATUS.INITIAL) {
      clearInterval(interval);
      setTimer(0);
      setScore(0);
      setPosition(getRandomPosition());
    }
    if (status === STATUS.PLAYING) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 100);
    }

    return () => clearInterval(interval);
  }, [status]);

  const handleTargetClick = () => {
    setScore((prev) => prev + 1);
    if (score < 10) {
      setPosition(getRandomPosition);
    } else {
      setScore(0);
      setStatus(STATUS.FINISHED);
    }
  };

  const size = Math.ceil(TARGET_SIZE * getScale(score));

  return (
    <main>
      <header>
        <h1>{Math.round(timer * 10) / 100} segundos</h1>
      </header>
      <section
        className="area"
        style={{
          marginRight: size,
          marginBottom: size
        }}
      >
        {status === STATUS.PLAYING && (
          <figure
            onClick={handleTargetClick}
            style={{
              transform: `scale(${getScale(score)})`,
              top: `${position.y}%`,
              left: `${position.x}%`
            }}
            className="target"
          />
        )}
      </section>
      <footer>
        {status === STATUS.INITIAL && <button onClick={() => setStatus(STATUS.PLAYING)}>Jugar</button>}
        {status === STATUS.PLAYING && <button onClick={() => setStatus(STATUS.FINISHED)}>Terminar</button>}
        {status === STATUS.FINISHED && <button onClick={() => setStatus(STATUS.INITIAL)}>Reset</button>}
      </footer>
    </main>
  );
}

export default App;

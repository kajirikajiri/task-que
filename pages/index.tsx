import type { NextPage } from 'next'
import React, { useEffect } from 'react'
import {nanoid} from "nanoid"

type CounterState = {
  id: string
}

const Home: NextPage = () => {
  const [counters, setCounters] = React.useState<CounterState[]>([ ])
  useEffect(()=> {
    setCounters([{
      id: nanoid(),
    }])
  }, [])
  const handleTimePassed = () => {
    setCounters([
      ...counters,
      {
        id: nanoid(),
      }
    ])
  }
  return <>{
    counters.map(counter => <Counter increase={randomInt(1, 10)} id={counter.id} key={counter.id} onTimePassed={handleTimePassed} />)
  }</>
}

export default Home

type Counter = {
  id: string
  time?: number;
  onTimePassed: () => void
  increase: number
}

const Counter = (props: Counter) => {
  const [progress, setProgress] = React.useState(0)
  const handleIncrement = (progress: number) => {
    if (progress > 8) {
      props.onTimePassed()
      return progress - 9
    }
    return progress + props.increase
  }

  useInterval(() => {
    setProgress(handleIncrement)
  }, 1000)
  
  const handleClick = () => setProgress(handleIncrement)
  
  return (
    <button onClick={handleClick}>
      <div style={{minWidth: 200}}>
        progress:{progress}<br/>
        id:{props.id}
      </div>
    </button>
  )
}

function useInterval(callback: () => void, delay: number) {
  const savedCallback = React.useRef(callback);

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function randomInt(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

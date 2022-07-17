import type { NextPage } from 'next'
import React, { useEffect } from 'react'
import {nanoid} from "nanoid"

type CounterState = {
  id: string
  increase: number
  progress: number
  threhold: number
}

const Home: NextPage = () => {
  const [counters, setCounters] = React.useState<CounterState[]>([ ])
  useEffect(()=> {
    setCounters([{
      id: nanoid(),
      increase: randomInt(1, 10),
      progress: 0,
      threhold: randomInt(100, 300),
    }])
  }, [])
  const handleIncrementThrehold = (id: string) => {
    setCounters(counters.map(counter => {
      if (counter.id === id) {
        return {
          ...counter,
          threhold: counter.threhold + 1,
        }
      }
      return counter
    }
    ))
  }
  const hadnleDecrementThrehold = (id: string) => {
    setCounters(counters.map(counter => {
      if (counter.id === id) {
        return {
          ...counter,
          threhold: counter.threhold - 1,
        }
      }
      return counter
    }
    ))
  }
  const handleIncrementIncrease = (id: string) => {
    setCounters(counters.map(counter => {
      if (counter.id === id) {
        return {
          ...counter,
          increase: counter.increase + 1,
        }
      }
      return counter
    }))
  }
  const handleDecrementIncrease = (id: string) => {
    setCounters(counters.map(counter => {
      if (counter.id === id) {
        return {
          ...counter,
          increase: counter.increase - 1,
        }
      }
      return counter
    }))
  }
  const handleIncrementProgress = (id: string) => {
    const newCounters = (()=>{
      const counter = counters.find(c=>c.id === id)
      if (counter === undefined) throw Error('Counter not found')
      counter.progress = counter.progress + counter.increase
      if (counter.progress > counter.threhold) {
        counter.progress = counter.progress - counter.threhold
        return [
          ...counters,
          {
            id: nanoid(),
            increase: randomInt(1, 10),
            progress: 0,
            threhold: randomInt(100, 300),
          }
        ]
      } else {
        return [...counters]
      }
    })()
    setCounters(newCounters)
  }

  const handleDecrementProgress = (id: string) => {
    setCounters(counters.map(counter => {
      if (counter.id === id) {
        const newProgress = counter.progress - counter.increase
        if (newProgress < 0) {
          return {
            ...counter,
            progress: 0,
          }
        } else {
          return {
            ...counter,
            progress: newProgress,
          }
        }
      }
      return counter
    }))
  }
  const handleDelete = (id: string) => {
    if (counters.length > 1) {
      setCounters(counters.filter(counter => counter.id !== id))
    }
  }
  const handleDuplicate = (id: string) => {
    const counter = counters.find(c=>c.id === id)
    if (counter === undefined) throw Error('Counter not found')
    setCounters([
      ...counters,
      {
        id: nanoid(),
        increase: counter.increase,
        progress: counter.progress,
        threhold: counter.threhold,
      }
    ])
  }
  return <>{
    counters.map(counter => <Counter onDuplicate={handleDuplicate} handleIncrementThrehold={handleIncrementThrehold} hadnleDecrementThrehold={hadnleDecrementThrehold} handleDecrementIncrease={handleDecrementIncrease} handleIncrementIncrease={handleIncrementIncrease} threhold={counter.threhold} handleIncrementProgress={handleIncrementProgress} handleDecrementProgress={handleDecrementProgress} progress={counter.progress} increase={counter.increase} id={counter.id} key={counter.id} onDelete={handleDelete} />)
  }</>
}

export default Home

type Counter = {
  id: string
  progress: number
  increase: number
  threhold: number
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  handleIncrementProgress: (id: string) => void
  handleDecrementProgress: (id: string) => void
  handleIncrementIncrease: (id: string) => void
  handleDecrementIncrease: (id: string) => void
  handleIncrementThrehold: (id: string) => void
  hadnleDecrementThrehold: (id: string) => void
}

const Counter = (props: Counter) => {
  useInterval(() => {
    props.handleIncrementProgress(props.id)
  }, 1000)
  
  const handleClickIncrementProgress = () => {
    props.handleIncrementProgress(props.id)
  }
  
  const handleClickDecrementProgress = () => {
    props.handleDecrementProgress(props.id)
  }
  
  const handleClickIncrementIncrease = () => {
    props.handleIncrementIncrease(props.id)
  }
  
  const handleClickDecrementIncrease = () => {
    props.handleDecrementIncrease(props.id)
  }
  
  const handleClickIncrementThrehold = () => {
    props.handleIncrementThrehold(props.id)
  }

  const handleClickDecrementThrehold = () => {
    props.hadnleDecrementThrehold(props.id)
  }

  const handleClickDelete = () => {
    props.onDelete(props.id)
  }
  
  const handleDuplicate = () => {
    props.onDuplicate(props.id)
  }
  
  return (
    <div style={{border: "1px solid black", display: 'inline-block', minWidth: 300, padding: 8}}>
      id:{props.id}<br />
      progress:<button onClick={handleClickIncrementProgress}>+</button><button onClick={handleClickDecrementProgress}>-</button>{props.progress}<br />
      increase:<button onClick={handleClickIncrementIncrease}>+</button><button onClick={handleClickDecrementIncrease}>-</button>{props.increase}<br/>
      threhold:<button onClick={handleClickIncrementThrehold}>+</button><button onClick={handleClickDecrementThrehold}>-</button>{props.threhold}<br/>
      <button onClick={handleClickDelete}>X</button><button onClick={handleDuplicate}>+</button>
    </div>
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

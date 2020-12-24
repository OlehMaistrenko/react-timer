import React, { useState } from "react";
import { Observable } from "rxjs";

function Timer() {
  const [lastTime, setLastTime] = useState(1);
  const [time, setTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [subscr, setSubscr] = useState(0);
  const [lastClick, setLastClick] = useState(0);

  const timer = new Observable((observer) => {
    let counter = lastTime;
    const intervalId = setInterval(() => {
      observer.next(counter++);
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  });
  const startTimer = () => {
    if (!isOn) {
      setIsOn(true);
      setSubscr(timer.subscribe({ next: setTime }));
    } else {
      setIsOn(false);
      subscr.unsubscribe();
      setTime(0);
      setLastTime(1);
    }
  };

  const pauseTimer = () => {
    if (isOn && Date.now() - lastClick < 300) {
      setIsOn(false);
      subscr.unsubscribe();
      setLastTime(time);
    } else {
      setLastClick(Date.now());
    }
  };
  function resetTimer() {
    setIsOn(true);
    setTime(0);
    setLastTime(1);
    console.log(subscr.closed + "  " + lastTime);
    if (subscr.closed === false) {
      subscr.unsubscribe();
    }
    setSubscr(timer.subscribe({ next: setTime }));
  }

  function sToTime(s) {
    let seconds = Math.floor((s / 10) % 60),
      minutes = Math.floor((s / 600) % 60),
      hours = Math.floor((s / (60 * 600)) % 24);
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds;
  }

  return (
    <div>
      <h3>timer: {sToTime(time)}</h3>
      <button onClick={() => startTimer()}>{isOn ? "Stop" : "Start"}</button>
      <button onClick={() => pauseTimer()}>Pause</button>
      <button onClick={() => resetTimer()}>Reset</button>
    </div>
  );
}

export default Timer;

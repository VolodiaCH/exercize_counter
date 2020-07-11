import React, { useEffect, useState } from 'react';

const getTimeLeft = (date_1, date_2) => {
    // get total seconds between the times
    let delta = Math.abs(date_2 - date_1) / 1000;

    // calculate (and subtract) whole days
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    let seconds = Math.floor(delta % 60);

    return { days, hours, minutes, seconds }
}

const getUTC = date => new Date(date.getTime() + date.getTimezoneOffset() * 60000);

const getMessage = endTime => {
    const now = getUTC(new Date());
    const finish_time = new Date(endTime);

    let time_left = getTimeLeft(now, finish_time);

    // if time runed out display 00:00:00
    if (now >= finish_time) return "00:00:00";

    const hours = time_left.hours.toString().length === 1 ? "0" + time_left.hours.toString() : time_left.hours.toString();
    const minutes = time_left.minutes.toString().length === 1 ? "0" + time_left.minutes.toString() : time_left.minutes.toString();
    const seconds = time_left.seconds.toString().length === 1 ? "0" + time_left.seconds.toString() : time_left.seconds.toString();

    const days = `${time_left.days}`;
    const time = `${hours}:${minutes}:${seconds}`

    return days === "0" ? time : days + " " + time;
}

const Timer = props => {
    var [message, setMessage] = useState(getMessage(props.endTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(m => getMessage(props.endTime))
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h5>
                Time left: {message}
            </h5>
        </div>
    );
}

export default Timer;
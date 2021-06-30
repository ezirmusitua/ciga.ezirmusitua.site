import Head from "next/head";
import { useEffect, useRef, useState } from "react";
function _force_2(val: number) {
    let out = "";
    if (val < 10) {
        out = "0" + val;
    } else {
        out = val.toString();
    }
    return out;
}
function format(dt: Date) {
    const hours = _force_2(dt.getHours());
    const minutes = _force_2(dt.getMinutes());
    const seconds = _force_2(dt.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}
function get_current() {
    const now = new Date();
    return format(now);
}

function useInterval(callback, delay) {
    const savedCallback = useRef();
    useEffect(() => {
        savedCallback.current = callback;
    });
    useEffect(() => {
        function tick() {
            if (savedCallback && savedCallback.current) {
                // @ts-ignore must have
                savedCallback.current();
            }
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

class CigretteTime {
    _start: Date = new Date();
    _end: Date = null;

    constructor(_start?: string, _end?: string) {
        if (_start) this._start = new Date(_start);
        if (_end) this._end = new Date(_end);
    }

    toggle_end() {
        this._end = new Date();
    }

    get start() {
        return format(this._start);
    }

    get end() {
        return format(this._end);
    }

    get delta() {
        let out = "";
        const _delta_seconds =
            (this._end.getTime() - this._start.getTime()) / 1000;
        console.log(_delta_seconds / 1000);
        const hours = Math.floor(_delta_seconds / 3600);
        if (hours) {
            out += " " + hours + "h";
        }
        const minutes = Math.floor((_delta_seconds % 3600) / 60);
        if (minutes) {
            out += " " + minutes + "min";
        }
        return out;
    }

    toString() {
        return JSON.stringify({ _start: this._start, _end: this._end });
    }
}

export default function Home() {
    const [_time, set_time] = useState(get_current());
    const [_breaking, set_breaking] = useState(null);
    const [_records, set_records] = useState([]);
    useEffect(() => {
        const saved = localStorage.getItem("cigarette_times");
        if (saved) {
            set_records(
                JSON.parse(saved).map(
                    ({ _start, _end }) => new CigretteTime(_start, _end),
                ),
            );
        }
    }, []);

    const toggle_breaking = () => {
        if (!_breaking) {
            set_breaking(new CigretteTime());
        } else {
            _breaking.toggle_end();
            const new_records = [..._records, _breaking];
            localStorage.setItem(
                "cigarette_times",
                JSON.stringify(new_records),
            );
            set_records(new_records);
            set_breaking(null);
        }
    };

    useInterval(() => {
        set_time(get_current());
    }, 1000);

    return (
        <div
            style={{
                backgroundColor: "#232323",
                width: "100%",
                height: "100vh",
            }}
        >
            <Head>
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                ></link>
                <link rel="preconnect" href="https://fonts.gstatic.com"></link>
                <link
                    href="https://fonts.googleapis.com/css2?family=Anonymous+Pro&display=swap"
                    rel="stylesheet"
                ></link>
                <meta
                    name="baidu-site-verification"
                    content="code-iUQSJx8hDn"
                ></meta>
            </Head>
            <main
                style={{
                    height: "100vh",
                    backgroundColor: "transparent",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        borderRadius: 16,
                        background: "#232323",
                        boxShadow:
                            "-8px -8px 24px #272727, 8px 8px 24px #2c2c2c",
                        padding: "12px 64px",
                    }}
                >
                    <p
                        style={{
                            userSelect: "none",
                            margin: 0,
                            color: "#cfcfcf",
                            fontSize: 180,
                            textShadow: "0px 1px 4px #bcbcbc",
                            fontFamily: "'Anonymous Pro', sans-serif",
                        }}
                    >
                        {_time}
                    </p>
                </div>

                <div
                    style={{
                        marginTop: "24px",
                        display: "flex",
                        flexDirection: "column",
                        width: 640,
                        maxHeight: 320,
                        overflowY: "auto",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: 48,
                            backgroundColor: "#272727",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                        onClick={toggle_breaking}
                    >
                        <span style={{ opacity: 80 }}>⏰</span>
                    </div>
                    {_records.map((item: any, i) => (
                        <div
                            key={i}
                            style={{
                                padding: "8px 16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <p style={{ color: "#bcbcbc" }}>🚬</p>
                            <p style={{ color: "#bcbcbc" }}>*{item.start}</p>
                            <p style={{ color: "#bcbcbc" }}>#{item.end}</p>
                            <p style={{ color: "#bcbcbc" }}>
                                -&gt;{item.delta}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

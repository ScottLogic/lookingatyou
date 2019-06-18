import React, { useState, ReactNode, useEffect } from 'react';
import './ConfigMenu.css';

interface IConfigMenuProps {
    width: string,
    timerLength: number,
    children: ReactNode
}

export function ConfigMenu(props: IConfigMenuProps) {
    const [leftPosition, setLeftPosition] = useState("0px");
    const [isUnderMouse, setIsUnderMouse] = useState(false);
    const [timeout, setTimeout] = useState(window.setTimeout(() => { }, 0));
    useEffect(() => {
        function show() {
            clearInterval(timeout);
            if (!isUnderMouse)
                setTimeout(window.setTimeout(() => setLeftPosition("-" + props.width), props.timerLength));
            setLeftPosition("0px");
        }
        window.addEventListener("mousemove", show);
        return (() => window.removeEventListener("mousemove", show));
    })
    return (
        <div
            style={{ width: props.width, left: leftPosition }}
            className={"ConfigMenu"}
            onMouseMove={() => { setIsUnderMouse(true) }}
            onMouseLeave={() => { setIsUnderMouse(false) }}
        > <h1>Config</h1>
            {props.children}
        </div>
    );
}
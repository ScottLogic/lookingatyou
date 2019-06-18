import React, {useState, useEffect} from 'react';
import './ConfigMenu.css';

interface IConfigMenuProps {
    width: string,
    timerLength: number,
    children: React.ReactNode
}

export function ConfigMenu(props: IConfigMenuProps) {
    const [leftPosition, setLeftPosition] = useState("0px");
    const [isUnderMouse, setIsUnderMouse] = useState(false);
    const [hideTimeout, setHideTimeout] = useState();
    useEffect(() => {
        function show() {
            clearInterval(hideTimeout);
            setLeftPosition("0px");
            if (!isUnderMouse)
                setHideTimeout(window.setTimeout(() => setLeftPosition("-" + props.width), props.timerLength));
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
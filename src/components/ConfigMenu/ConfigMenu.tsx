import React, {useState, useEffect} from 'react';
import './ConfigMenu.css';
import { TextBoxMenuItem, CheckBoxMenuItem } from './MenuItem'

interface IConfigMenuProps {
    width: string,
    timerLength: number,
    children: React.ReactNode
}
interface IConfigMenuState {
    leftPosition: string
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
export function Example() {
    return (
        <ConfigMenu width="14em" timerLength={1000}>
            <TextBoxMenuItem name="textbox" onInputChange={((text: string) => alert("Text: " + text))}/>
            <CheckBoxMenuItem name="checkbox" onInputChange={((checked: boolean) => alert("Checked: " + checked))}/>
        </ConfigMenu>
    );
}
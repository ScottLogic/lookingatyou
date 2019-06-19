import React, { ReactNode } from 'react';

interface IMenuItemProps {
    name: string
}

interface ITextBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (text: string): void },
    default: string
}
export function TextBoxMenuItem(props: ITextBoxMenuItemProps) {
    var textbox = <input type="textbox" defaultValue={localStorage.getItem(props.name) || props.default} onChange={(event) => {
        localStorage.setItem(props.name, event.target.value);
        props.onInputChange(event.target.value);
    }}></input>;
    return <InputMenuItemDiv name={props.name}>{textbox}</InputMenuItemDiv>
}

interface ICheckBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (checked: boolean): void },
    default: boolean
}
export function CheckBoxMenuItem(props: ICheckBoxMenuItemProps) {
    var checkbox = <input type="checkbox" defaultChecked={localStorage.getItem(props.name) != null ? localStorage.getItem(props.name) === "true" : props.default} onChange={(event) => {
        localStorage.setItem(props.name, event.target.checked.toString());
        props.onInputChange(event.target.checked);
    }}></input>;
    return <InputMenuItemDiv name={props.name}>{checkbox}</InputMenuItemDiv>
}

interface IColorMenuItemProps extends IMenuItemProps {
    onInputChange: { (color : string) : void},
    default: string
}
export function ColorMenuItem(props : IColorMenuItemProps) {
    var colorpicker = <input type="color" defaultValue={localStorage.getItem(props.name) || props.default} onChange={(event) => {
        localStorage.setItem(props.name, event.target.value.toString());
        props.onInputChange(event.target.value);
    }}></input>;
    return <InputMenuItemDiv name={props.name}>{colorpicker}</InputMenuItemDiv>
}

function InputMenuItemDiv(props: { name: string, children: ReactNode }) {
    return (
        <div>
            <label>{props.name}</label>
            {props.children}
        </div>
    );
}


export class CanvasMenuItem extends React.Component<IMenuItemProps> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    constructor(props: IMenuItemProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }
    render() {
        return (
            <div>
                <label>{this.props.name}</label>
                <br />
                <canvas ref={this.canvasRef} />
            </div>
        )
    }
    drawImage(image: CanvasImageSource, bbox?: { x: number, y: number, width: number, height: number }) {
        var ctx: CanvasRenderingContext2D | null = this.canvasRef.current!.getContext('2d');
        if (ctx != null) {
            ctx.drawImage(image, 0, 0);
            if (bbox !== undefined) {
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = "red";
                ctx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
                ctx.stroke();
            }
        }
    }
}
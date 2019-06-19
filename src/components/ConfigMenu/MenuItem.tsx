import React, { ReactNode } from 'react';

interface IMenuItemProps {
    name: string
}

interface ITextBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (text: string): void },
    default: string
}
export function TextBoxMenuItem(props: ITextBoxMenuItemProps) {
    return (
        <InputMenuItemDiv name={props.name}>
            <input type="textbox" defaultValue={props.default} onChange={(event) => { props.onInputChange(event.target.value) }}></input>
        </InputMenuItemDiv>
    )
}

interface ICheckBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (checked: boolean): void },
    default: boolean
}
export function CheckBoxMenuItem(props: ICheckBoxMenuItemProps) {
    return (
        <InputMenuItemDiv name={props.name}>
            <input type="checkbox" defaultChecked={props.default} onChange={(event) => { props.onInputChange(event.target.checked) }}></input>
        </InputMenuItemDiv>
    )
}

interface IColorMenuItemProps extends IMenuItemProps {
    onInputChange: { (color: string): void },
    default: string
}
export function ColorMenuItem(props: IColorMenuItemProps) {
    return (
        <InputMenuItemDiv name={props.name}>
            <input type="color" defaultValue={props.default} onChange={(event) => { props.onInputChange(event.target.value) }}></input>
        </InputMenuItemDiv>
    )
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
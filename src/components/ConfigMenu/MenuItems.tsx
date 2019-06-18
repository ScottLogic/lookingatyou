import React from 'react';

interface IMenuItemProps {
    name: string
}
interface IMenuItemState {

}

interface ITextBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (text: string): void },
    default: string
}
export class TextBoxMenuItem extends React.Component<ITextBoxMenuItemProps> {
    render() {
        var textbox = <input
            type="textbox"
            defaultValue={this.props.default}
            onChange={(event) => this.props.onInputChange(event.target.value)}>
        </input> as unknown as HTMLInputElement;
        return <InputMenuItemDiv name={this.props.name} input={textbox} />
    }
}

interface ICheckBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (checked: boolean): void },
    default: boolean
}
export class CheckBoxMenuItem extends React.Component<ICheckBoxMenuItemProps> {
    render() {
        var checkbox = <input
            type="checkbox"
            defaultChecked={this.props.default}
            onChange={(event) => this.props.onInputChange(event.target.checked)}>
        </input> as unknown as HTMLInputElement;
        return <InputMenuItemDiv name={this.props.name} input={checkbox} />
    }
}

class InputMenuItemDiv extends React.Component<{ name: string, input: HTMLInputElement }> {
    render() {
        return (
            <div>
                <label>{this.props.name}</label>
                {this.props.input}
            </div>
        ) as unknown as HTMLDivElement;
    }
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
        var ctx : CanvasRenderingContext2D | null = this.canvasRef.current!.getContext('2d');
        if (ctx != null) {
            ctx.drawImage(image, 0, 0);
            if (bbox !== undefined) {
                ctx.beginPath();
                ctx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
                ctx.stroke();
            }
        }
    }
}

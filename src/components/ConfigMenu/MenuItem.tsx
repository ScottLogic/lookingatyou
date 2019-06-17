import React from 'react';

interface IMenuItemProps {
    name: string
}
interface IMenuItemState {

}

interface ITextBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (text: string): void }
}
export class TextBoxMenuItem extends React.Component<ITextBoxMenuItemProps> {
    render() {
        var textbox = <input type="textbox" onChange={(event) => this.props.onInputChange(event.target.value)}></input> as unknown as HTMLInputElement;
        return <InputMenuItemDiv name={this.props.name} input={textbox} />
    }
}

interface ICheckBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (checked: boolean): void }
}
export class CheckBoxMenuItem extends React.Component<ICheckBoxMenuItemProps> {
    render() {
        var checkbox = <input type="checkbox" onChange={(event) => this.props.onInputChange(event.target.checked)}></input> as unknown as HTMLInputElement;
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
    private ctx: CanvasRenderingContext2D;
    private canvasWidth: number;
    private canvasHeight: number;
    constructor(props: IMenuItemProps) {
        super(props);
        this.canvasRef = React.createRef();
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
    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext('2d')
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = "red";
        this.canvasWidth = this.canvasRef.current.width;
        this.canvasHeight = this.canvasRef.current.height;
    }
    drawImage(image : CanvasImageSource, bbox: { x: number, y: number, width: number, height: number }) {
        this.ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
        if (bbox !== undefined) {
            this.ctx.beginPath();
            this.ctx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
            this.ctx.stroke();
        }
    }
}

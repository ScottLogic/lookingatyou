/* tslint:disable:jsx-no-lambda */

import React from 'react';
interface ICanvasMenuItemProps {
    name: string;
}
export default class CanvasMenuItem extends React.Component<
    ICanvasMenuItemProps
    > {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    constructor(props: ICanvasMenuItemProps) {
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
        );
    }
    drawImage(
        image: CanvasImageSource,
        bbox?: { x: number; y: number; width: number; height: number },
    ) {
        const ctx: CanvasRenderingContext2D | null = this.canvasRef.current!.getContext(
            '2d',
        );
        if (ctx != null) {
            ctx.drawImage(image, 0, 0);
            if (bbox !== undefined) {
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                ctx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
                ctx.stroke();
            }
        }
    }
}

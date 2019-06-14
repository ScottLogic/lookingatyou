import React from 'react';
import { select } from 'd3-selection';


interface IEyeProps {
    class: string,
    width: number,
    height: number,
    scleraColor: string,
    irisColor: string,
    pupilColor: string,
}

interface IEyeState {
    x_pos: number,
    y_pos: number,
    width: number,
    height: number,
    scleraSize: number,
    irisSize: number,
    pupilSize: number,
}

export default class Eye extends React.Component<IEyeProps, IEyeState> {
    svg: any;
    constructor(props: IEyeProps) {
        super(props);

        this.state = {
            // x and y pos to be used in moving the eyes
            x_pos: 0,
            y_pos: 0,
            width: this.props.width,
            height: this.props.height,
            scleraSize: 4,
            irisSize: 8,
            pupilSize: 16,
        }
    }

    componentWillReceiveProps() {
        this.setState({
            width: this.props.width
        })
        this.renderEye();
    }

    componentDidMount() {
        this.renderEye();
    }

    renderEye() {
        // clean the svg
        this.svg.selectAll('*').remove();

        // set the svg size
        let svg = this.svg
            .attr("width", this.props.width)
            .attr("height", this.props.height)
            .append("g")
            .attr("transform", "translate(" + (this.props.width / 2) + "," + (this.props.height / 2) + ")")

        // create sclera
        svg.append("circle")
            .attr("class", this.props.class + "Sclera")
            .attr("r", this.props.width / this.state.scleraSize)
            .style("fill", this.props.scleraColor)
        var inner = svg.append("g").attr("class", "inner");
        // create iris
        inner.append("circle")
            .attr("class", this.props.class + "Iris")
            .attr("r", this.props.width / this.state.irisSize)
            .style("fill", this.props.irisColor)
        // create pupil
        inner.append("circle")
            .attr("class", this.props.class + "Pupil")
            .attr("r", this.props.width / this.state.pupilSize)
            .style("fill", this.props.pupilColor)
        this.svg = svg;
    }

    render() {
        return (
            <svg
                className={this.props.class}
                ref={element => this.svg = select(element)}
            />
        )
    }
}
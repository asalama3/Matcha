import React            from 'react'

import './carousel.css'

export default class Carousel extends React.Component {
    state = {
        margin: 0,
    }
    
    _iterval = null

    drawSRC = () => this.props.src.map((el, key) =>
        <div
            key={key}
            className="images"
            style={{
                backgroundImage: `url('http://localhost:8080/public/${this.props.username}/${el.name}')`,
                width: '200px',
                height: '200px',
            }}
        />
    )

    updateMargin = () => {
        const { length } = this.props.src
        const { margin } = this.state
        const newMargin = (margin + 200) % (length * 200)
        this.setState({ margin: newMargin })
    }

    componentDidMount() {
        this._interval = setInterval(this.updateMargin, 3000);
    }

    componentWillUnmount() {
        clearInterval(this._interval)
    }
    
    stopInterval = () => {
        clearInterval(this._interval)
    }

    startInterval = () => {
        this._interval = setInterval(this.updateMargin, 3000)
    }

    prevImage = () => {
        const { margin } = this.state
        const { length } = this.props.src
        let newMargin;
        if (margin === 0) {
            newMargin = 200 * (length - 1)
        } else {
            newMargin = margin - 200
        }
        this.setState({ margin: newMargin })
    }

    render() {
        const { margin } = this.state
        return (
            <div className="carouselAndControls" onMouseEnter={this.stopInterval} onMouseLeave={this.startInterval}>
                <button onClick={this.prevImage}><i className="fa fa-arrow-left" aria-hidden="true"/></button>
                <div className="carousel">
                    <div className="container" style={{ marginLeft: `-${margin}px` }}>
                        {this.drawSRC()}
                    </div>
                </div>
                <button onClick={this.updateMargin}><i className="fa fa-arrow-right" aria-hidden="true"/></button>
            </div>
        )
    }
}
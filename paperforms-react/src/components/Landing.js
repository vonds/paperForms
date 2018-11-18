import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Landing extends Component {
    render() {
        const { title, subtitle } = this.props
        return (
            <div className="center jumbotron text-center">
                <h4>{subtitle}</h4>
                <h3 className="mb-3">{title}</h3>
                <button className="btn btn-lg btn-light">Sign-up</button>

            </div>
        )
    }
}

Landing.protoTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
}

export default Landing
import React, {Component} from 'react';
import GoogleMap from './googleMap';
import Marker from './googleMap';
import Geosuggest from 'react-geosuggest';
import shallowCompare from 'react-addons-shallow-compare';


class DoodlesMap extends Component {
    state = {
        center: null,
        marker: null,
        directions: null
    };

    componentWillMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                marker: {
                    position: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                }
            });
        });
    }

    renderYouAreHereMarker() {
        return (
            <Marker
                position={this.state.center}
                // icon="../../img/you-are-here.png"
            />
        )
    }

    render() {
        if (!this.state.center) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <div>
                <GoogleMap
                    center={this.state.center}
                    zoom={15}
                >
                    {this.renderYouAreHereMarker()}
                    <Marker
                        position={{lat: 41.317334, lng: -72.922989}}
                        // icon="../../img/marker.png"
                        // info="Hola"
                    />
                    <Marker
                        position={{lat: 41.309848, lng: -72.938234}}
                        // icon="../../img/marker.png"
                        // info="Epi"
                    />
                </GoogleMap>
            </div>
        );
    }
}

export {DoodlesMap};

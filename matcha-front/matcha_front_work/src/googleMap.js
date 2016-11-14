import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {google} from 'google-map-react';
import Geosuggest from 'react-geosuggest';
import shallowCompare from 'react-addons-shallow-compare';


const Marker = React.createClass({
    componentDidMount: function() {
        console.log("Marker on mount");
    },
    render: function() {
        return false;
    }
});


const GoogleMap = React.createClass({
    componentDidMount: function() {
        var mapOptions = {
            center: this.createLatLng(this.props.center),
            zoom: this.props.zoom || 14
        };

        var map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions);

        //Render all the markers (children of this component)
        React.Children.map(this.props.children, (child) => {
                var markerOptions = {
                position: this.createLatLng(child.props.position),
                title: child.props.title || "",
                animation: google.maps.Animation.DROP,
                icon: child.props.icon || null,
                map: map,
                autocomplete:new google.maps.places.AutocompleteService()
            };

            var marker = new google.maps.Marker(markerOptions);

            if(child.props.info) {
                var infowindow = new google.maps.InfoWindow({
                    content: child.props.info
                });

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            }
        });

        var input = this.refs.search;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        this.setState({map});
    },
    createLatLng: function(element) {
        return new google.maps.LatLng(element.lat, element.lng);
    },
    render: function() {
        return (
            <div className="map">
                <input ref="search"/>
            </div>
        )
    }
});

export {GoogleMap, Marker};

/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'hw-react-components';
import { DynamicMapStyle } from '../../utils/constants';
import CloseButtonIcon from '../../assets/images/close.svg';
import './styles/search-map.sass';

export default class SearchMap extends Component {
  static blockName = 'hwui-Map';

  static propTypes = {
    results: PropTypes.array,
    lat: PropTypes.string,
    lng: PropTypes.string,
    tipContent: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    results: [],
    lat: 0,
    lng: 0,
    tipContent: () => '',
    onClose: () => false,
  };

  componentDidMount() {
    this.google = google;
    this.standardMarkerIcon = {
      url: 'assets/images/map-pin.svg',
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 26),
    };

    this.highlightedMarkerIcon = {
      url: 'assets/images/map-pin-hover.svg',
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 26),
    };

    this.gmap = new google.maps.Map(this.resultMap, {
      scrollwheel: false,
      center: this.mapCenter,
      zoom: 12,
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
      },
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: DynamicMapStyle,
    });

    this.myLocationMarker = new google.maps.Marker({
      map: this.gmap,
      position: this.mapCenter,
      icon: {
        url: 'assets/images/icon_map-dot.png',
        size: new google.maps.Size(36, 36),
        scaledSize: new google.maps.Size(18, 18),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(9, 9),
      },
    });

    const window = new google.maps.InfoWindow();
    this.markers.forEach(marker => {
      const gMarker = new google.maps.Marker(marker.marker);
      const content = document.createElement('div');
      content.innerHTML = marker.content;
      content.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
      gMarker.addListener('click', () => {
        window.setContent(content);
        window.open(this.gmap, gMarker);
      });

      gMarker.addListener('mouseout', () => {
        gMarker.setIcon(this.standardMarkerIcon);
      });

      gMarker.addListener('mouseover', () => {
        gMarker.setIcon(this.highlightedMarkerIcon);
      });
    });

  }

  get markers() {
    const { results } = this.props;
    const result = {};
    results.forEach(office => {
      if (office.geoLocation) {
        const { x, y } = office.geoLocation[0];
        const { physicians = [] } = result[`${x}${y}`] || {};
        result[`${x}${y}`] = {
          marker: {
            map: this.gmap,
            position: {
              lat: Number(x),
              lng: Number(y),
            },
            icon: this.standardMarkerIcon,
          },
          physicians: [
            ...physicians,
            office,
          ],
          content: this.props.tipContent({ physicians: [...physicians, office] }),
        };
      } else {
        result[office] = '';
      }
    });

    return Object.keys(result).map(marker => result[marker]);
  }

  get mapCenter() {
    const { lat, lng } = this.props;
    return {
      lat: Number(lat),
      lng: Number(lng),
    };
  }

  get map() {
    return (
      <div className={`${SearchMap.blockName}`}>
        <div className={`${SearchMap.blockName}__title`}>
          <span>Search Results</span>
          {' '}
          <Button onClick={this.props.onClose} size="sm"><img src={CloseButtonIcon} alt="close button" /></Button>
        </div>
        <div className={`${SearchMap.blockName}__map`} ref={node => this.resultMap = node} />
        <Button onClick={this.props.onClose} modifier="info" size="md">
          <i className="fa fa-list" />
          {' '}
          List View
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.map}
      </div>
    );
  }
}

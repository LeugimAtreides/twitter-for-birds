/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';

export default class VideoPlayer extends Component {
  propTypes = {
    service: PropTypes.oneOf(['youtube', 'vimeo', 'dailymotion']).isRequired,
    video: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  };

  static urlMap = new Map([
    ['youtube', 'https://www.youtube.com/embed/'],
    ['vimeo', 'https://player.vimeo.com/video/'],
    ['dailymotion', 'https://www.dailymotion.com/embed/video/'],
  ]);

  IdFromVideoString(vString) {
    const urlArr = vString.split('/');
    const idString = urlArr[urlArr.length - 1];
    const queryParams = qs.extract(vString);

    return (queryParams && qs.parse(queryParams).v) || idString || '';
  }

  render() {
    const {
      title, service, video, ...htmlTags
    } = this.props;
    const src = `${VideoPlayer.urlMap.get(service)}${this.IdFromVideoString(video)}`;

    return (
      <iframe
        src={src}
        title={title}
        height="250"
        width="420"
        frameBorder="0"
        webkitAllowFullScreengit
        mozallowfullscreen
        allowFullScreen
        {...htmlTags}
      />
    );
  }
}

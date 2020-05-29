/* eslint-disable */
import React from 'react';
import { StaticMapStyle } from '../../utils/constants';
import LoaderAnimation from '../Loader/Loader';

type mapData = {
  data: string,
  meta: {
    loading: boolean,
    error: boolean
  }
}

type MapPreviewProps = {
  blockName: string,
  previewImage: mapData,
  clickHandler(): boolean
}

const MapPreview: React.FC<MapPreviewProps> = ({
  blockName = 'hwui-MapPreview',
  previewImage = {
    data: '',
    meta: {
      loading: false,
      error: false
    }
  },
  clickHandler = () => false
}) => {

  const CTA = () => {
    return (
      <div className={`${blockName}__cta`}>
        <a role="button" tabIndex={-1} onClick={clickHandler}>
          <img alt="Map" src={`${previewImage.data}${StaticMapStyle}`} />
          <h3>View Map</h3>
          <i className="fa fa-expand" />
        </a>
      </div>
    );
  }

  const Loading = () => {
    return (
      <div className={`${blockName}__loader`}>
        <LoaderAnimation fixed />
      </div>
    );
  }

  const callToAction = () => {
    const { meta } = previewImage;
    return meta.loading ? <Loading /> : <CTA />
  }

  return (
    <div className={`${blockName}`}>
      {callToAction()}
    </div>
  );
}

export default MapPreview

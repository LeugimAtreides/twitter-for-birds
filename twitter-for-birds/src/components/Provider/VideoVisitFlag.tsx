import React from 'react';
import { Tooltip } from 'hw-react-components';
import './provider-profile.sass';

type VideoVisitFlagProps = {
  videoVisits: boolean,
  blockName?: string
}

// eslint-disable-next-line react/prop-types
const VideoVisitFlag: React.FC<VideoVisitFlagProps> = ({ videoVisits, blockName = 'hwui-ProviderProfile__Provider-Stats--videoVisits' }) => {
  const info = 'A video visit allows you to virtually talk to your doctor online. Please call your provider to schedule your video visit.';
  return (videoVisits
    ? (
      <div className={`${blockName}`}>
        <i className="fa fa-video" />
        {' '}
        Offers
        {' '}
        <b>video visits</b>
        {' '}
        <Tooltip title="Scheduling a Video Visit" copy={info}>?</Tooltip>
      </div>
    )
    : null
  );
};

export default VideoVisitFlag;

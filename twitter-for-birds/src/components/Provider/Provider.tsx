/* eslint-disable */
import React from 'react';
import './provider-profile.sass';
import { useHistory } from "react-router-dom";
import { Button } from 'hw-react-components'
import NewPatientFlag from "./NewPatientFlag";
import VideoVisitFlag from './VideoVisitFlag';
import AvailabilityFlag from './AvailabilityFlag';
import Rating from './Rating';
import { formatPhoneNumber } from '../../utils/strings';
import { ProviderProps } from './types'

// CONVERT TO TS FILE IF NOT TOO COMPLICATED
const Provider: React.FC<ProviderProps> = ({
  provider,
  showAvailability = true,
  showVideoVisitFlag = true,
  showNewPatientFlag = true,
  showRating = true,
  showButton = false,
  showEmployedFlag = false,
  showNetworkFlag = false,
  showInsuranceFlag = true,
  buttonOnClick = () => null,
  office,
  showRequest = false,
  ratingOnClick = () => false,
  blockName = "hwui-ProviderProfile"
}) => {
  let history = useHistory();
  const image = provider.photoURL ?
    <img src={provider.sslImageUrl} alt={provider.firstName} /> :
    <div className={`${blockName}__initials`}> <i><span>{provider.initials}</span></i></div >

  const getImage = () => {
    return showButton ?
      // @ts-ignore
      <a name="View Profile" tabIndex={-1} role="button" onClick={buttonOnClick}>{image}</a>
      :
      image
  };

  const getName = () => {
    return showButton ?
      // @ts-ignore
      <a name="View Profile" tabIndex={0} role="button" onClick={buttonOnClick}><p className={`${blockName}__Provider-Stats--name`}> {provider.displayName} </p></a>
      :
      <p className={`${blockName}__Provider-Stats--name`}> {provider.displayName} </p>
  };


  // TODO : WIRE UP THIS ROUTE - it will be different here
  const onRequestAppointment = () => {
    const {
      id: providerId,
      office: { id: officeId }
    } = provider;
    history.push(`/scheduling/request/location/${officeId}/physician/${providerId}`);
    window.scrollTo(0, 0);
  };

  // @ts-ignore
  const requestApptButton = ({ provider }) => {
    const { hideRequestAppointment } = provider
    return hideRequestAppointment ? null : <Button onClick={() => onRequestAppointment()} modifier="default" size="sm">Request Appointment</Button>
  }

  const requestAppointment = () => {
    if (office) {
      const { nonAthenaAndOutOfState, nonAthenaOrNoOnlineScheduling, office: { phoneNumber } } = provider;
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

      if (nonAthenaAndOutOfState) {
        return (
          <div className={`${blockName}__No-Request`}><p>Please call the office to schedule an appointment.</p>
            <Button onClick={() => window.location.href = `tel:${formattedPhoneNumber}`} modifier="default" size="sm">Call the Office</Button>
          </div >
        )
      } else if (nonAthenaOrNoOnlineScheduling) {
        return (
          <div>
            <p>Please call the office or complete the request form for the most up-to-date availability.</p>
            <div className={`${blockName}__No-Online-Availability`}>
              <Button onClick={() => window.location.href = `tel:${formattedPhoneNumber}`} modifier="default" size="sm">Call the Office</Button>
              <div className={`${blockName}__Request-Appointment`}>
                {requestApptButton({ provider })}
              </div>
            </div>
          </div >
        )
      }
    }
  }

  return (
    <div className={`${blockName}__Bio-Card`}>
      <div className={`${blockName}__LeftSide`}>
        <div className={`${blockName}__Provider-Photo`}>{getImage()}</div>
        {showButton && <Button className={`${blockName}--ViewProfile`} onClick={buttonOnClick} tabIndex={0}>View Profile</Button>}
      </div>
      <div className={`${blockName}__Provider-Stats`}>
        {getName()}
        {provider.specialties && <p className={`${blockName}__Provider-Stats--specialties`}> {provider.specialties.join(', ')} </p>}
        {showRating && provider.hasAverageRating &&
          <div role="button" tabIndex={0} onClick={ratingOnClick} className={`${blockName}__Rating`}>
            <Rating providerRating={Number(provider.averageRating?.toFixed(1))} />
            <p className={`${blockName}__Rating--number`}>{Number(provider.averageRating?.toFixed(1))}</p>
            <p className={`${blockName}__Rating--responses`}>({provider.ratingCount}) </p>
          </div>
        }
        {showNewPatientFlag && <NewPatientFlag newPatients={provider["availability.accepting_new_patients"]} />}
        {showVideoVisitFlag && provider.virtualVisits && <VideoVisitFlag videoVisits={provider.virtualVisits} />}
        {showAvailability && provider.availability && <AvailabilityFlag blockName={`${blockName}__Provider-Stats--appointments--availability`} availability={provider.availability} />}
        {showRequest && requestAppointment()}
      </div>
    </div>
  )
};

export default Provider

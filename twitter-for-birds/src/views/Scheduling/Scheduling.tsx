import React, { useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { SectionTitle, Tooltip } from 'hw-react-components';
import useSchedulingData from './hook';
import { ThemeProvider } from 'styled-components';
import hwuiOverrides from './overrides.scss';
import Provider from '../../components/Provider/Provider';
import LoaderAnimation from '../../components/Loader/Loader';
import Calendar from '../../components/Calendar/Calendar';
import AppointmentSlots from '../../components/AppointmentSlots/AppointmentSlots';
import StickyScroll from '../../components/hw/StickyScroll';
import ScrollingAnchor from '../../components/hw/ScrollingAnchor';
import SearchMap from '../../components/hw/SearchMap';
import Locations from '../../components/hw/Locations';
import Expertise from '../../components/hw/Expertise';
import Insurances from '../../components/hw/Insurances';
import RatingSection from '../../components/hw/RatingSection';
import { schedulingDisclaimer } from '../../utils/constants';
import { useCalendarAppointments } from '../../connector-hooks/useAppointments/useAppointments';
import '../../components/Provider/provider-profile.sass';
import '../../components/hw/styles/search-map.sass';

type SchedulingProps = {
  blockName: string,
  history: {
    push(url: string): void;
  },
}

const Scheduling: React.FC<SchedulingProps> = ({
  blockName = 'hwui-ProviderProfile',
  history
}) => {
  const ratingsRef = React.createRef<HTMLAnchorElement>()
  const searchParams = new URLSearchParams(window.location.search);
  const location = searchParams?.get('location')?.split(',');
  const [lat, lon] = location

  // bunch of local state in the original component - not sure where I will need them yet
  const [isMapView, setIsMapView] = useState(false)
  const [ratingsPage, setRatingsPage] = useState(0)
  const [date, setDate] = useState(moment(Date.now()).format('YYYY-MM-DD HH:mm:ss').valueOf())
  const [selectedDate, setSelectedDate] = useState('')
  const [appointmentReason, setAppointmentReason] = useState(searchParams.get('reasonForVisit'))
  const [refreshDate, setRefreshDate] = useState(true)

  // Hookes & API call Hooks for data resources
  const { physicianId, locationId } = useParams();
  const { provider, ratings, reasons, googleMapImage, doneLoading } = useSchedulingData({ physicianId, lat, lon, ratingsPage, location })
  const appointments = useCalendarAppointments({ provider: provider.data, physicianId, appointmentReason, date });

  const ShowExpertise = (provider: any) => {
    return provider.fullBiography || provider.care_philosophy || provider.videos || provider.personalInterests || provider.languages || provider.education ?
      (<div><a className={`${blockName}__Anchor`} id="Expertise">expertise section</a>
        <SectionTitle> Expertise </SectionTitle>
        <Expertise provider={provider} /></div>) : null
  }

  const hasExpertise = (provider: any) => Boolean(provider.fullBiography || provider.care_philosophy || provider.videos || provider.personalInterests || provider.languages || provider.education)

  const NavigationBar = (args: any) => {
    const { hasExpertise, hasAverageRating, hasOnlineScheduling, ratingCount } = args;
    return (
      <div className={`${blockName}__Navigation-Bar--wrapper`}>
        <StickyScroll elementClassName={`${blockName}__Navigation-Bar`}>
          <div className={`${blockName}__Navigation-Bar`}>
            <ul>
              {hasOnlineScheduling && <li><ScrollingAnchor href="#Book" className={`${blockName}__Navigation-Bar li`}>book an appointment</ScrollingAnchor></li>}
              <li><ScrollingAnchor href="#Locations" className={`${blockName}__Navigation-Bar`}>locations</ScrollingAnchor></li>
              {hasExpertise && <li><ScrollingAnchor href="#Expertise" className={`${blockName}__Navigation-Bar`}>expertise</ScrollingAnchor></li>}
              <li><ScrollingAnchor href="#Insurances" className={`${blockName}__Navigation-Bar`}>insurances</ScrollingAnchor></li>
              {hasAverageRating && (
                <li>
                  <ScrollingAnchor href="#Ratings" className={`${blockName}__Navigation-Bar`}>
                    reviews and comments
                  {' '}
                    <span className={`${blockName}__Navigation-Bar--rating-number`}>
                      (
                    {ratingCount}
                    )
                  </span>
                  </ScrollingAnchor>
                </li>
              )}
            </ul>
          </div>
        </StickyScroll>
        {hasOnlineScheduling && <div className={`${blockName}__Anchor`} id="Book">book an appointment section</div>}
      </div >
    )
  }

  const onRatingPageChange = (page: number) => {
    setRatingsPage(page);
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(moment(date).format('YYYY-MM-DD'));
    setRefreshDate(false)
  }

  const selectedDay = () => {
    let day = selectedDate || date
    const [firstDayWithAppointments] = [...appointments.data].filter(day => day && day.length > 0);
    if (firstDayWithAppointments && refreshDate) {
      const firstAvailable = moment(firstDayWithAppointments[0].date, 'MM/DD/YYYY');
      day = moment(firstAvailable).format('YYYY-MM-DD').valueOf();
    }
    return day;
  }

  const handleMonthChange = (newDate: string) => {
    let date;

    if (moment(newDate).isSame(moment(), 'month')) {
      date = moment(Date.now()).format('YYYY-MM-DD');
    } else {
      date = moment(newDate).startOf('month').valueOf();
    }

    setDate(moment(date).format('YYYY-MM-DD'));
    setRefreshDate(true)
  }

  const getOffices = () =>
    provider.data.officeAddress.map((officeAddress: any) => ({
      geoLocation: [officeAddress.geoLocation],
      address1: officeAddress.address1,
      city: officeAddress.city
    }))

  const selectedAppointments = () => {
    const day = selectedDay()
    const dateKey = moment(day).date();
    return appointments.data[dateKey];
  }

  const onAppointmentReasonChange = (e: any) => {
    const { value } = e.target;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('reasonForVisit', value);
    history.push(`/scheduling/appointments/location/${locationId}/physician/${physicianId}?${searchParams.toString()}`);
    setAppointmentReason(value);
  };

  const tipContent = () => {
    const {
      gender,
      sslImageUrl,
      firstName,
      lastName,
      specialties,
      officeAddress
    } = provider.data;
    const { address1, city, } = officeAddress
    const blockName = 'hwui-Map';
    return (
      <div className={`${blockName}__tip`}>
        <ul className={`${blockName}__tip--list`}>
          <li>
            <div className={`${blockName}__tip--img-container`}>
              <img alt="doctor-avatar" className={`${blockName}__tip--img`} src={
                `${sslImageUrl ?
                  sslImageUrl :
                  `assets/images/doctorAvatar${gender === 'Female' ? 'Female' : 'Male'}.svg`}`
              } />
            </div>
            <h5 className={`${blockName}__tip--title`}>
              ${firstName} ${lastName}
              <small>${specialties.join(', ')}</small>
              <small>${address1} ${city}</small>
            </h5>
          </li>
        </ul>
      </div >
    );
  }

  const onToggleMapView = () => {
    setIsMapView(prevVal => !prevVal)
  }

  return doneLoading && !appointments?.meta?.loading ? (
    <ThemeProvider theme={hwuiOverrides}>
      <div className={blockName}>
        <Provider provider={provider.data} office={provider.data.office} showRequest showVideoVisitFlag />
        <NavigationBar
          hasExpertise={hasExpertise(provider.data)}
          hasAverageRating={provider.data.hasAverageRating}
          hasOnlineScheduling={provider.data.hasOnlineScheduling}
          ratingCount={provider.data.ratingCount} />
        <main className={`${blockName}__Main`}>
          {provider.data.hasOnlineScheduling && <div className={`${blockName} picker hwui-Card`}>
            <div className={`${blockName} calendar`}>
              <Calendar
                defaultDate={date}
                selectedDate={selectedDay()}
                onDateSelect={(date) => handleDateChange(date)}
                onMonthChange={(date) => handleMonthChange(date)}
                events={appointmentReason ? appointments.data : []}
                minDate={moment(Date.now()).format('YYYY-MM-DD')}
                currentDate={date}
              />
            </div>
            <AppointmentSlots
              history={history}
              isFetching={appointmentReason ? appointments?.meta?.loading : false}
              appointments={appointmentReason ? selectedAppointments() : []}
              date={selectedDay()}
              provider={provider.data}
              appointmentReason={appointmentReason}
              reasons={reasons.data}
              onChange={onAppointmentReasonChange}
            />
          </div>}
          <div className={`${blockName}__Anchor`} id="Locations">locations section</div>
          <SectionTitle> Locations </SectionTitle>
          <Locations
            provider={provider.data}
            latitude={lat}
            longitude={lon}
            previewImage={googleMapImage}
            mapOnClick={onToggleMapView}
          />
          <ShowExpertise provider={provider.data} />
          <div className={`${blockName}__Anchor`} id="Insurances">insurances section</div>
          <SectionTitle> Insurances </SectionTitle>
          <Insurances
            list={provider.data.insuranceAccepted}
            showCount={10}
          />
          <a ref={ratingsRef} className={`${blockName}__Anchor`} id="Ratings">ratings section</a>
          {provider.data.hasAverageRating && <div className={`${blockName}__Ratings-Title`}>
            <h2 className={`${blockName}__Section-Title`}> Reviews and Comments <Tooltip title="Ratings Disclaimer" copy={schedulingDisclaimer}>?</Tooltip></h2>
            <RatingSection ratings={ratings} totalRating={provider.data.averageRating} ratingCount={provider.data.ratingCount} page={ratingsPage} onPage={onRatingPageChange} />
          </div>}
          {isMapView &&
            <SearchMap
              results={getOffices()}
              lat={lat}
              lng={lon}
              tipContent={tipContent}
              onClose={onToggleMapView}
            />}
        </main>
      </div>
    </ThemeProvider>
  ) : <LoaderAnimation fixed />
}

export default Scheduling;

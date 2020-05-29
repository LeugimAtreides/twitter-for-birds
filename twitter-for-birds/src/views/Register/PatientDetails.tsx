import React from 'react';
import './styles/confirmation.sass';

type PatientDetailsProps = {
  registration: any,
  blockName?: string
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ registration, blockName = 'hwui-RegisterConfirm' }) => (

  <section className={`${blockName}__confirmation-group`}>
    <div id="detail-grid" className={`${blockName}__detail-group`}>
      <p className={`${blockName}__detail-group--title`}>First Name</p>
      <p className={`${blockName}__detail-group--plain`}>{registration.get('first_name').value}</p>
    </div>
    <div id="detail-grid" className={`${blockName}__detail-group`}>
      <p className={`${blockName}__detail-group--title`}>Last Name</p>
      <p className={`${blockName}__detail-group--plain`}>{registration.get('last_name').value}</p>
    </div>
    <div id="detail-grid" className={`${blockName}__detail-group`}>
      <p className={`${blockName}__detail-group--title`}>Date of Birth</p>
      <p className={`${blockName}__detail-group--plain`}>{registration.get('date_of_birth').value}</p>
    </div>
    <div id="detail-grid" className={`${blockName}__detail-group`}>
      <p className={`${blockName}__detail-group--title`}>Email</p>
      <p className={`${blockName}__detail-group--plain`}>{registration.get('email_address').value}</p>
    </div>
    <div id="detail-grid" className={`${blockName}__detail-group`}>
      <p className={`${blockName}__detail-group--title`}>Phone</p>
      <p className={`${blockName}__detail-group--plain`}>{registration.get('phone').value}</p>
    </div>
    <div id="detail-grid" className={`${blockName}__detail-group`}>
      <p className={`${blockName}__detail-group--title`}>Insurance</p>
      <p className={`${blockName}__detail-group--plain`}>{registration.get('insurance_name').value}</p>
    </div>
  </section>
);

export default PatientDetails;

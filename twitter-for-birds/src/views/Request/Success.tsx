import React from 'react';
import { Button, PageTitle } from 'hw-react-components';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './request-success.scss';

const Success = () => {
    const history = useHistory();
    const checkMark = <FontAwesomeIcon icon={['fal', 'check-circle']} transform="left-5" pull="right" size='sm' />;
    const calendar = <FontAwesomeIcon icon={['fal', 'calendar-plus']} className='calendar-icon' />;
    return (
        <div className="scheduling__success">
            {calendar}
            <div className="content-body">
                <PageTitle>
                    {checkMark} We&apos;ve received your request
                </PageTitle>
                <main className="main">
                    <div className="copy text-center">
                        <p className="section-title subtitle request-note">
                            Thank you for sending an appointment request. A representative
                            will contact you by phone to work with you on confirming a day and
                            time for your appointment.
                        </p>
                        <Button onClick={() => history.push('/')} modifier="info" size="md">
                            Return to Homepage
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Success;
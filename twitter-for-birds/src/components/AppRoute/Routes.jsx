/* istanbul ignore next */
import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loader from '../Loader/Loader';
import Default from '../../layouts/Default/Default.jsx';
// const NoMatch = () => 'There is nothing to see here';

// Imported Routes
const FindCare = lazy(() => import('../../views/FindCare/FindCare'));
const Scheduling = lazy(() => import('../../views/Scheduling/Scheduling.tsx'));
const Register = lazy(() => import('../../views/Register/Register'));
const Results = lazy(() => import('../../views/Results/Results'));
const Request = lazy(() => import('../../views/Request/Request.tsx'));
const RequestSuccess = lazy(() => import('../../views/Request/Success.tsx'));

const Routes = () => (
  <Switch>
    <Suspense fallback={<Loader fixed title="" />}>
      <Default>
        <Route exact path="/" component={FindCare} />
        <Route exact path="/scheduling/results" component={Results} />
      </Default>
      <Route path="/scheduling/appointments/:appointmentId/location/:locationId/physician/:physicianId" component={Register} />
      <Route path="/scheduling/appointments/location/:locationId/physician/:physicianId" component={Scheduling} />
      <Route path="/scheduling/request/location/:locationId/physician/:physicianId" component={Request} />
      <Route path="/scheduling/request/confirmation" component={RequestSuccess} />
    </Suspense>
  </Switch>
);

export default Routes;

import Personas from './personas';
import Identity from './identity';
import Scheduling from './scheduling';
import GMaps from './GMaps';
import Features from './features';
import Delegation from './delegation';
import Appointments from './appointments';

const api = {
  Personas,
  Identity,
  Scheduling,
  GMaps,
  Features,
  Delegation,
  Appointments,
};

global.api = api;

export default api;

export default function ({ dispatch, getState }) {
  return (next) => (action) => {
    const { collections, documents } = getState();

    // Normal non-api action, pass it through
    if (!action.callApi) {
      return next(action);
    }

    const id = `${action.callApi.name}?${JSON.stringify(action.payload)}`;

    // FROM Collections CACHE
    if (action.type.includes('Collection') && collections[id] && !action.force) {
      return id;
    }

    // FROM Documents CACHE
    if (action.type.includes('Document') && documents[id] && !action.force) {
      return id;
    }

    // Update & Delete needs a promise interface
    if (action.update) {
      dispatch({
        id,
        type: `${action.type}:loading`,
        payload: action.payload,
      });

      return action.callApi(action.payload).then((resp) => {
        dispatch({
          id,
          type: `${action.type}:success`,
          payload: action.payload,
          resp,
        });
        return resp;
      }).catch((err) => {
        dispatch({
          id,
          type: `${action.type}:failure`,
          payload: action.payload,
          resp: err,
        });
        return err;
      });
    }

    // Fetch the information
    dispatch({
      id,
      type: `${action.type}:loading`,
      payload: action.payload,
    });

    action.callApi(action.payload).then((resp) => {
      dispatch({
        id,
        type: `${action.type}:success`,
        payload: action.payload,
        resp,
      });
    }).catch((err) => {
      dispatch({
        id,
        type: `${action.type}:failure`,
        payload: action.payload,
        resp: err,
      });
    });

    return id;
  };
}

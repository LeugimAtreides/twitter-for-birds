export function findCollection(collection) {
  return {
    type: '@@deaui:findCollection',
    id: collection.id,
    callApi: collection.callApi,
    payload: collection.payload,
    force: collection.force,
  };
}

export function deleteFromCollection(collection) {
  return {
    type: '@@deaui:deleteFromCollection',
    id: collection.id,
    callApi: collection.callApi,
    payload: collection.payload,
    update: true,
  };
}

export function updateFromCollection(collection) {
  return {
    type: '@@deaui:updateFromCollection',
    id: collection.id,
    callApi: collection.callApi,
    payload: collection.payload,
    update: true,
  };
}

export function findDocument(doc) {
  return {
    type: '@@deaui:findDocument',
    id: doc.id,
    callApi: doc.callApi,
    payload: doc.payload,
    force: doc.force,
  };
}

export function updateDocument(doc) {
  return {
    type: '@@deaui:updateDocument',
    id: doc.id,
    callApi: doc.callApi,
    payload: doc.payload,
    update: true,
  };
}

export function deleteDocument(doc) {
  return {
    type: '@@deaui:deleteDocument',
    id: doc.id,
    callApi: doc.callApi,
    payload: doc.payload,
    update: true,
  };
}

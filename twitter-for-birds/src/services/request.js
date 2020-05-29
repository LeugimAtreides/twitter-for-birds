/* eslint-disable */
/*
|--------------------------------------------------------------------------
| Generating promise function with abort functionality
|--------------------------------------------------------------------------
*/

const overrideThen = (promise, request) => {
  promise._then = promise.then.bind(promise);

  promise.then = (onResolve, onReject) => {
    const newPromise = promise._then(onResolve, onReject);
    overrideMethods(newPromise, request);

    return newPromise;
  };
};

const overrideMethods = (promise, request) => {
  overrideThen(promise, request);
  addAbortRequest(promise, request);
};

const addAbortRequest = (promise, request) => {
  promise.abortRequest = request.abort.bind(request);
  return promise;
};

// adds abort method
const createPromise = (request, handler) => {
  const promise = new Promise(handler);
  overrideMethods(promise, request);
  return promise;
};

/*
|--------------------------------------------------------------------------
| Request/Response generation
|--------------------------------------------------------------------------
*/

// Gets headers array and sets headers on XMLHttpRequest
const setHeaders = (request, headers) => {
  if (headers != null) {
    headers.forEach((header, key) => {
      request.setRequestHeader(key, header);
    });
  }
};

// Gets a XMLHttpRequest and returns a Headers populated with the response headers
const extractHeaders = () => {
  const headers = new Headers();

  // Splits headers \r\n, iterates and adds them to the headers object
  // IE does not like this, do not uncomment unless you have a good reason, add correct parsing if so.
  // request.getAllResponseHeaders().split('\r\n').forEach((headerString) => {
  //   if (headerString !== '') {
  //     const header = headerString.split(': ');
  //     headers.append(header[0].trim(), header[1].trim());
  //   }
  // });

  return headers;
};

// Gets XMLHttpRequest and returns a Response
const getResponse = (request) => {
  const body = request.responseText;

  const init = {
    status: request.status === 204 ? 200 : request.status,
    statusText: request.statusText,
    headers: extractHeaders(request),
  };

  return new Response(body, init);
};


// Actual request function
export default (url, options) => {
  // Creates request
  const request = new XMLHttpRequest();

  // Creates promise to be returned
  const promise = createPromise(request, (resolve, reject) => {
    const { body, method, headers } = options;

    // Initializes request
    request.open(method, url);
    setHeaders(request, headers);

    request.send(body);

    // Once request is done, this is how it is handled
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status == 0) {
          return reject('status 0');
        }

        // Convert request into Response
        const response = getResponse(request);

        return resolve(response);
      }
    };
  });

  return promise;
};

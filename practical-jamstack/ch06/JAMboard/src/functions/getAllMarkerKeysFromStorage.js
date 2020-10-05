const faunadb = require("faunadb");
const query = faunadb.query;


exports.handler = async function(inEvent, inContext, inCallback) {

  console.log("Function 'getAllMarkerKeysFromStorage' invoked");

  // Get the document ID that was requested.
  const documentID = inEvent.queryStringParameters.documentID;
  console.log(`Requested documentID ${documentID}`);

  const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });

  // Get list of marker keys (note: this gets ALL marker keys in the collection).
  await client.query(query.Paginate(query.Match(query.Ref("indexes/markers"))))
    .then(async inResponse => {

      console.log("inResponse", inResponse);

      // Extract the data from the response.  This is a list of refs.
      const docRefs = inResponse.data;
      console.log("docRefs", docRefs);

      // Create an array of keys, filtering out any not for the requested document.
      let keys = docRefs.filter(inRef => inRef.id.startsWith(documentID));
      keys = keys.map(inRef => inRef.id);
      console.log("keys", keys);

      // Final response of the function.
      inCallback(null, { statusCode : 200, body : JSON.stringify(keys) });

    })
    .catch(inError => {
      console.log("Error", inError);
      return { statusCode : 400, body : JSON.stringify(inError) };
    });

}; /* End handler. */

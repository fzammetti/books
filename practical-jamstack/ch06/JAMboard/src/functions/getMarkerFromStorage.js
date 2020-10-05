const faunadb = require("faunadb");
const query = faunadb.query;


//noinspection JSUnresolvedVariable
exports.handler = async function(inEvent, inContext, inCallback) {

  console.log("Function 'getMarkerFromStorage' invoked");

  // Get the key that was requested.
  const key = inEvent.queryStringParameters.key;
  console.log(`Requested key ${key}`);

  const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });

  await client.query(query.Get(query.Ref(query.Collection("markers"), key)))
  .then((inDoc) => {
    console.log("inDoc", inDoc);
    inCallback(null, { statusCode : 200, body : JSON.stringify(inDoc) });
  })
  .catch(inError => {
    console.log("Error", inError);
    return { statusCode : 400, body : JSON.stringify(inError) };
  });

}; /* End handler. */

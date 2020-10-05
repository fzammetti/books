const faunadb = require("faunadb");
const query = faunadb.query;


exports.handler = async function(inEvent, inContext, inCallback) {

  console.log("Function 'saveMarkerToStorage' invoked");

  console.log("inEvent.body", inEvent.body);
  const incomingData = JSON.parse(inEvent.body);

  const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });

  // Which method of client gets called depends on whether we're doing an update or an add, everything else is the same.
  const whichMethod = incomingData.isUpdate ? "Update" : "Create";
  console.log("whichMethod", whichMethod);
  await client.query(
    query[whichMethod](
      query.Ref(query.Collection("markers"), incomingData.key),
      { data : incomingData.marker }
    )
  )
  .then((inSavedDoc) => {
    console.log("inSavedDoc", inSavedDoc);
    inCallback(null, { statusCode : 200, body : JSON.stringify(inSavedDoc) });
  })
  .catch(inError => {
    console.log("Error", inError);
    return { statusCode : 400, body : JSON.stringify(inError) };
  });

}; /* End handler. */

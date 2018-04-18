"use strict";


// Imports.
const bodyParser = require("body-parser");
const express = require("express");
const nedb = require("nedb");
const path = require("path");


// Create the app and configure it with middleware.
const app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "../app/v4_cordova")));
app.use("/webix", express.static(path.join(__dirname, "../../webix")));


// Load databases (or create new ones if any doesn't already exist).
const databases = {
  appointments : new nedb({ filename : `${__dirname}/appointments.db`, autoload : true }),
  contacts : new nedb({ filename : `${__dirname}/contacts.db`, autoload : true }),
  notes : new nedb({ filename : `${__dirname}/notes.db`, autoload : true }),
  tasks : new nedb({ filename : `${__dirname}/tasks.db`, autoload : true })
};


/**
 * A common bit of code to execute at the start of each path handler.
 *
 * @param inMethodDescription Text to show at the start of the log message that describes the calling method.
 * @param inRequest           The request being serviced.
 */
const commonOpening = function(inMethodDescription, inRequest) {

  const collection = inRequest.params.collection;
  const id = inRequest.params.id;
  const item = inRequest.body;
  console.log(
    `${inMethodDescription}\ncollection: ${collection}\n
     id: ${id}\nitem: ${JSON.stringify(item)}`
  );
  return [ collection, id, item ];

}; /* End commonOpening(). */


/**
 * A common handler to deal with DB operation errors.  Returns a 500 and an error object.
 *
 * @param inError    Error object from the DB call.
 * @param inResponse The response being serviced.
 */
const commonErrorHandler = function(inError, inResponse) {

  console.log(inError);
  inResponse.status(500);
  inResponse.send(`{ "error" : "Server error" }`);

}; /* End commonErrorHandler(). */


/**
 * Create (post) route.
 *
 * Must specify collection in path.
 * Must include item to create in body.
 *
 * Response will be (201) the created item.
 */
const postHandler = function(inRequest, inResponse) {

  let [collection, id, item] = commonOpening("POST (create)", inRequest);

  const db = databases[collection];
  db.insert(item, function (inError, inDocument) {
    if (inError) {
      commonErrorHandler(inError, inResponse);
    } else {
      inResponse.status(201);
      inResponse.send(JSON.stringify(inDocument));
    }
  });

}; /* End create (post) route. */
app.post("/data/:collection", postHandler);


/**
 * Read (get) route (handles getting a single item AND getting ALL items).
 *
 * Must specify collection in path.
 * Can include an ID in path to get a specified item (if none then all in collection are returned).
 *
 * Response will be (200) an array, (200) an object or (404) if not found.
 */
const getHandler = function (inRequest, inResponse) {

  let [collection, id, item] = commonOpening("GET (read)", inRequest);

  const db = databases[collection];
  const callback = function (inError, inDocuments) {
    if (inError) {
      commonErrorHandler(inError, inResponse);
    } else {
      inResponse.status(200);
      inResponse.send(JSON.stringify(inDocuments));
    }
  };
  if (id) {
    db.findOne({ id : id }, callback);
  } else {
    db.find({}, callback);
  }

}; /* End read (get) route. */
app.get("/data/:collection/:id?", getHandler);


/**
 * Update (put) route.
 *
 * Must specify collection in path.
 * Must include item to update in body.
 *
 * Response will be provided by getHandler() or (404) if not found.
 */
const putHandler = function (inRequest, inResponse) {

  let [collection, id, item] = commonOpening("PUT (update)", inRequest);

  const db = databases[collection];
  db.update({ id : id }, item, { returnUpdatedDocs : false },
    function (inError, inNumAffected, inAffectedDocuments, inUpsert) {
      if (inError) {
        commonErrorHandler(inError, inResponse);
      } else {
        getHandler(inRequest, inResponse);
      }
    }
  );

}; /* End update (put) route. */
app.put("/data/:collection/:id", putHandler);


/**
  * Delete (delete) route.
  *
 * Must specify collection in path.
 * Must include ID of item to delete.
 *
 * Response will be (200) ID of deleted item, or (404) if not found.
 */
const deleteHandler = function (inRequest, inResponse) {

  let [collection, id, item] = commonOpening("DELETE (delete)", inRequest);

  const db = databases[collection];
  db.remove({ id : id }, { }, function (inError, inRemovedCount) {
    if (inError) {
      commonErrorHandler(inError, inResponse);
    } else {
      inResponse.status(200);
      inResponse.send(id);
    }
  });

}; /* End delete (delete) route. */
app.delete("/data/:collection/:id", deleteHandler);


/**
 * A special function that returns all data for all specified collections in one response.  This
 * is used the first time the app is run to populate Local Storage.
 */
app.post("/getAllData", function(inRequest, inResponse) {

  // The "item" in this case is an array of collection (module) names.
  let [collection, id, item] = commonOpening("POST (getAll)", inRequest);

  // The object to be returned.
  const returnObject = { };

  // Start counting down the collections who's data has been loaded.
  let collectionsToLoad = item.length;

  // Iterate the list of collections, loading the data for each.
  for (let collectionName of item) {
    databases[collectionName.toLowerCase()].find({},
      function (inError, inDocuments) {
        if (inError) {
          // If ANY fail then we'll render an error response.
          commonErrorHandler(inError, inResponse);
        } else {
          // Add the collection's data to the object to be returned.
          returnObject[collectionName] = inDocuments;
          // Continue the countdown.
          collectionsToLoad = collectionsToLoad - 1;
          // When all collections have been loaded, return the response.
          if (collectionsToLoad === 0) {
            inResponse.status(200);
            inResponse.send(JSON.stringify(returnObject));
          }
        }
      }
    );
  }

});


// ---------------------------------------- Start the server. ----------------------------------------
app.listen(8080, "192.168.1.32", function () {
  console.log("wxPIM server listening at 192.168.1.32:8080")
});

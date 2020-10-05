import axios from "axios";


/**
 * Returns all the keys of markers for the specified document from storage.
 *
 * @param  inDocumentID The ID of the document.
 * @return              An array where each element is the key of a marker for the specified document.
 */
export async function getAllMarkerKeysFromStorage(inDocumentID) {

  console.log("StorageManager.getAllMarkerKeysFromStorage()", inDocumentID);

  global.maskScreen(true);
  try {
    const res = await axios.get("/.netlify/functions/getAllMarkerKeysFromStorage",
      { params : { documentID : inDocumentID } }
    );
    console.log("getAllMarkersFromStorage(): res", res);
    console.log("getAllMarkersFromStorage(): res.data", res.data);
    global.maskScreen(false);
    return res.data;
  } catch (inError) {
    console.log("getAllMarkersFromStorage(): inError", inError);
    global.maskScreen(false);
    return [ ];
  }

} /* End getAllMarkerKeysFromStorage(). */


/**
 * Gets a specific marker from storage.
 *
 * @param  inKey The key of the marker.
 * @return       An object with all marker data.
 */
export async function getMarkerFromStorage(inKey) {

  console.log("getMarkerFromStorage()", inKey);

  global.maskScreen(true);
  try {
    const res = await axios.get("/.netlify/functions/getMarkerFromStorage",
      { params : { key : inKey } }
    );
    console.log("getMarkerFromStorage(): res", res.data.data);
    global.maskScreen(false);
    return res.data.data;
  } catch (inError) {
    console.log("getMarkerFromStorage(): inError", inError);
    global.maskScreen(false);
    throw inError;
  }

} /* End getMarkerFromStorage(). */


/**
 * Saves a marker to storage.
 *
 * @param inKey      The key of the marker.
 * @param inMarker   An object containing all marker data.
 * @param inIsUpdate True if we're doing an update (when adding a comment).
 */
export async function saveMarkerToStorage(inKey, inMarker, inIsUpdate) {

  console.log("saveMarkerToStorage()", inKey, inMarker);

  global.maskScreen(true);
  try {
    await axios.post("/.netlify/functions/saveMarkerToStorage", {
      key : inKey, marker : inMarker, isUpdate : inIsUpdate
    });
  } catch (inError) {
    console.log("saveMarkerToStorage(): inError", inError);
  }
  global.maskScreen(false);

} /* End saveMarkerToStorage(). */

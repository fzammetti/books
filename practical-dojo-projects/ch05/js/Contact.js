function Contact() {


  // ********** All the data fields that make up a contact.
  this.title = "";
  this.firstName = "";
  this.middleName = "";
  this.lastName = "";
  this.suffix = "";
  this.jobTitle = "";
  this.company = "";
  this.department = "";
  this.managerName = "";
  this.assistantName = "";
  this.homePhone = "";
  this.homeCellPhone = "";
  this.homeFAX = "";
  this.homePager = "";
  this.workPhone = "";
  this.workCellPhone = "";
  this.workFAX = "";
  this.workPager = "";
  this.homeEMail = "";
  this.homeWebSite = "";
  this.homeIMNickname = "";
  this.workEMail = "";
  this.workWebSite = "";
  this.workIMNickname = "";
  this.spouseName = "";
  this.childrenName = "";
  this.anniversary = "";
  this.birthday = "";
  this.highSchoolInfo = "";
  this.collegeInfo = "";
  this.custom1 = "";
  this.custom2 = "";
  this.homeAddressLine1 = "";
  this.homeAddressLine2 = "";
  this.homeCity = "";
  this.homeState = "";
  this.homeZipCode = "";
  this.workAddressLine1 = "";
  this.workAddressLine2 = "";
  this.workCity = "";
  this.workState = "";
  this.workZipCode = "";

  this.arrayIndex = -1;

  // ********** Array of the fields in this class.  Used to iterate over the
  //            fields of the class and input fields on the form.
  this.fieldsArray = [
    "title", "firstName", "middleName", "lastName", "suffix", "jobTitle",
    "company", "department", "managerName", "assistantName", "homePhone",
    "homeCellPhone", "homeFAX", "homePager", "workPhone", "workCellPhone",
    "workFAX", "workPager", "homeEMail", "homeWebSite", "homeIMNickname",
    "workEMail", "workWebSite", "workIMNickname", "spouseName", "childrenName",
    "anniversary", "birthday", "highSchoolInfo", "collegeInfo", "custom1",
    "custom2", "homeAddressLine1", "homeAddressLine2", "homeCity", "homeState",
    "homeZipCode", "workAddressLine1", "workAddressLine2", "workCity",
    "workState", "workZipCode"
  ];


  // ********** Function to populate this object from the input fields.
  this.populateContact = function() {

    for (var i = 0; i < this.fieldsArray.length; i++) {
      var fieldValue = dojo.byId(this.fieldsArray[i]).value;
      this[this.fieldsArray[i]] = fieldValue;
    }

  } // End populateContact();


  // ********** Function to populate the screen from this object.
  this.populateScreen = function() {

    for (var i = 0; i < this.fieldsArray.length; i++) {
      dojo.byId(this.fieldsArray[i]).value = this[this.fieldsArray[i]];
    }

  } // End populateScreen().


  // ********** Render this object as a string of JSON for storage.
  this.toString = function() {

    return dojo.toJson(this);

  } // End toString().


  // ********** Populate this object from a string of JSON pulled from storage.
  this.restoreFromJSON = function(inJSON) {

    var o = dojo.fromJson(inJSON);
    for (var i = 0; i < this.fieldsArray.length; i++) {
      this[this.fieldsArray[i]] = o[this.fieldsArray[i]];
    }

  } // End restoreFromJSON().


} // End Contact class.

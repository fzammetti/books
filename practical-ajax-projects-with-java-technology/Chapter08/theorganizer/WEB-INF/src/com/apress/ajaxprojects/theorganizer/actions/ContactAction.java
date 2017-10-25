package com.apress.ajaxprojects.theorganizer.actions;


import com.apress.ajaxprojects.theorganizer.daos.ContactDAO;
import com.apress.ajaxprojects.theorganizer.objects.AccountObject;
import com.apress.ajaxprojects.theorganizer.objects.ContactObject;
import com.opensymphony.webwork.interceptor.SessionAware;
import com.opensymphony.xwork.Action;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Action providing CRUD services for working with Contacts.
 */
public class ContactAction implements Action, SessionAware {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The session map for this request.
   */
  private Map session;


  /**
   * The createdDT field value of the contact to retrieve.
   */
  private long createdDT;


  /**
   * The ContactObject retrieved.
   */
  private ContactObject contact;


  /**
   * The collection of contacts for the user retrieved from the database.
   */
  private List contacts;


  /**
   * First name.
   */
  private String firstName;


  /**
   * Middle name.
   */
  private String middleName;


  /**
   * Last name.
   */
  private String lastName;


  /**
   * Home phone number.
   */
  private String homePhone;


  /**
   * Home address line 1.
   */
  private String homeAddress1;


  /**
   * Home address line 2.
   */
  private String homeAddress2;


  /**
   * Home address line 3.
   */
  private String homeAddress3;


  /**
   * Home address line 4.
   */
  private String homeAddress4;


  /**
   * Personal eMail address.
   */
  private String personalEMail;


  /**
   * Personal instant messenger ID.
   */
  private String personalIM;


  /**
   * Personal FAX number.
   */
  private String personalFAX;


  /**
   * Personal cellular phone number.
   */
  private String personalCell;


  /**
   * Personal pager number.
   */
  private String personalPager;


  /**
   * Spouse name.
   */
  private String spouse;


  /**
   * Child 1 name.
   */
  private String child1;


  /**
   * Child 2 name.
   */
  private String child2;


  /**
   * Child 3 name.
   */
  private String child3;


  /**
   * Child 4 name.
   */
  private String child4;


  /**
   * Child 5 name.
   */
  private String child5;


  /**
   * Child 6 name.
   */
  private String child6;


  /**
   * Child 7 name.
   */
  private String child7;


  /**
   * Child 8 name.
   */
  private String child8;


  /**
   * Company.
   */
  private String company;


  /**
   * Job title.
   */
  private String title;


  /**
   * Job department.
   */
  private String department;


  /**
   * Work phone number.
   */
  private String workPhone;


  /**
   * Work address line 1.
   */
  private String workAddress1;


  /**
   * Work address line 2.
   */
  private String workAddress2;


  /**
   * Work address line 3.
   */
  private String workAddress3;


  /**
   * Work address line 4.
   */
  private String workAddress4;


  /**
   * Work eMail address.
   */
  private String workEMail;


  /**
   * Work instant messenger ID.
   */
  private String workIM;


  /**
   * Work FAX number.
   */
  private String workFAX;


  /**
   * Work cellular phone number.
   */
  private String workCell;


  /**
   * Work pager number.
   */
  private String workPager;


  /**
   * Assistant name.
   */
  private String assistant;


  /**
   * Manager name.
   */
  private String manager;


  /**
   * Other phone number.
   */
  private String otherPhone;


  /**
   * Other address line 1.
   */
  private String otherAddress1;


  /**
   * Other address line 2.
   */
  private String otherAddress2;


  /**
   * Other address line 3.
   */
  private String otherAddress3;


  /**
   * Other address line 4.
   */
  private String otherAddress4;


  /**
   * Other eMail address.
   */
  private String otherEMail;


  /**
   * Other instant messenger ID.
   */
  private String otherIM;


  /**
   * Other FAX number.
   */
  private String otherFAX;


  /**
   * Other cellular phone number.
   */
  private String otherCell;


  /**
   * Other pager number.
   */
  private String otherPager;


  /**
   * Comments.
   */
  private String comments;


  /**
   * Mutator for session.
   *
   * @param inSession New value for session.
   */
  public void setSession(final Map inSession) {

    session = inSession;

  } // End setSession().


  /**
   * Mutator for createdDT.
   *
   * @param inCreatedDT New value for createdDT.
   */
  public void setCreatedDT(final long inCreatedDT) {

    createdDT = inCreatedDT;

  } // End setCreatedDT().


  /**
   * Accessor for createdDT.
   *
   * @return Value of createdDT.
   */
  public long getCreatedDT() {

    return createdDT;

  } // End getCreatedDT().


  /**
   * Accessor for contact.
   *
   * @return Value of contact.
   */
  public ContactObject getContact() {

    return contact;

  } // End getContact().


  /**
   * Accessor for contacts.
   *
   * @return Value of contacts.
   */
  public List getContacts() {

    return contacts;

  } // End getContacts().


 /**
   * Mutator for firstName.
   *
   * @param inFirstName New value for firstName.
   */
  public void setFirstName(final String inFirstName) {

    firstName = inFirstName;

  } // End setFirstName().


  /**
   * Accessor for firstName.
   *
   * @return Value of firstName.
   */
  public String getFirstName() {

    return firstName;

  } // End getFirstName().


  /**
   * Mutator for middleName.
   *
   * @param inMiddleName New value for middleName.
   */
  public void setMiddleName(final String inMiddleName) {

    middleName = inMiddleName;

  } // End setMiddleName().


  /**
   * Accessor for middleName.
   *
   * @return Value of middleName.
   */
  public String getMiddleName() {

    return middleName;

  } // End getMiddleName().


  /**
   * Mutator for lastName.
   *
   * @param inLastName New value for lastName.
   */
  public void setLastName(final String inLastName) {

    lastName = inLastName;

  } // End setLastName().


  /**
   * Accessor for lastName.
   *
   * @return Value of lastName.
   */
  public String getLastName() {

    return lastName;

  } // End getLastName().


  /**
   * Mutator for homePhone.
   *
   * @param inHomePhone New value for homePhone.
   */
  public void setHomePhone(final String inHomePhone) {

    homePhone = inHomePhone;

  } // End setHomePhone().


  /**
   * Accessor for homePhone.
   *
   * @return Value of homePhone.
   */
  public String getHomePhone() {

    return homePhone;

  } // End getHomePhone().


  /**
   * Mutator for homeAddress1.
   *
   * @param inHomeAddress1 New value for homeAddress1.
   */
  public void setHomeAddress1(final String inHomeAddress1) {

    homeAddress1 = inHomeAddress1;

  } // End setHomeAddress1().


  /**
   * Accessor for homeAddress1.
   *
   * @return Value of homeAddress1.
   */
  public String getHomeAddress1() {

    return homeAddress1;

  } // End getHomeAddress1().


  /**
   * Mutator for homeAddress2.
   *
   * @param inHomeAddress2 New value for homeAddress2.
   */
  public void setHomeAddress2(final String inHomeAddress2) {

    homeAddress2 = inHomeAddress2;

  } // End setHomeAddress2().


  /**
   * Accessor for homeAddress2.
   *
   * @return Value of homeAddress2.
   */
  public String getHomeAddress2() {

    return homeAddress2;

  } // End getHomeAddress2().


  /**
   * Mutator for homeAddress3.
   *
   * @param inHomeAddress3 New value for homeAddress3.
   */
  public void setHomeAddress3(final String inHomeAddress3) {

    homeAddress3 = inHomeAddress3;

  } // End setHomeAddress3().


  /**
   * Accessor for homeAddress3.
   *
   * @return Value of homeAddress3.
   */
  public String getHomeAddress3() {

    return homeAddress3;

  } // End getHomeAddress3().


  /**
   * Mutator for homeAddress4.
   *
   * @param inHomeAddress4 New value for homeAddress4.
   */
  public void setHomeAddress4(final String inHomeAddress4) {

    homeAddress4 = inHomeAddress4;

  } // End setHomeAddress4().


  /**
   * Accessor for homeAddress4.
   *
   * @return Value of homeAddress4.
   */
  public String getHomeAddress4() {

    return homeAddress4;

  } // End getHomeAddress4().


  /**
   * Mutator for personalEMail.
   *
   * @param inPersonalEMail New value for personalEMail.
   */
  public void setPersonalEMail(final String inPersonalEMail) {

    personalEMail = inPersonalEMail;

  } // End setPersonalEMail().


  /**
   * Accessor for personalEMail.
   *
   * @return Value of personalEMail.
   */
  public String getPersonalEMail() {

    return personalEMail;

  } // End getPersonalEMail().


  /**
   * Mutator for personalIM.
   *
   * @param inPersonalIM New value for personalIM.
   */
  public void setPersonalIM(final String inPersonalIM) {

    personalIM = inPersonalIM;

  } // End setPersonalIM().


  /**
   * Accessor for personalIM.
   *
   * @return Value of personalIM.
   */
  public String getPersonalIM() {

    return personalIM;

  } // End getPersonalIM().


  /**
   * Mutator for personalFAX.
   *
   * @param inPersonalFAX New value for personalFAX.
   */
  public void setPersonalFAX(final String inPersonalFAX) {

    personalFAX = inPersonalFAX;

  } // End setPersonalFAX().


  /**
   * Accessor for personalFAX.
   *
   * @return Value of personalFAX.
   */
  public String getPersonalFAX() {

    return personalFAX;

  } // End getPersonalFAX().


  /**
   * Mutator for personalCell.
   *
   * @param inPersonalCell New value for personalCell.
   */
  public void setPersonalCell(final String inPersonalCell) {

    personalCell = inPersonalCell;

  } // End setPersonalCell().


  /**
   * Accessor for personalCell.
   *
   * @return Value of personalCell.
   */
  public String getPersonalCell() {

    return personalCell;

  } // End getPersonalCell().


  /**
   * Mutator for personalPager.
   *
   * @param inPersonalPager New value for personalPager.
   */
  public void setPersonalPager(final String inPersonalPager) {

    personalPager = inPersonalPager;

  } // End setPersonalPager().


  /**
   * Accessor for personalPager.
   *
   * @return Value of personalPager.
   */
  public String getPersonalPager() {

    return personalPager;

  } // End getPersonalPager().


  /**
   * Mutator for spouse.
   *
   * @param inSpouse New value for spouse.
   */
  public void setSpouse(final String inSpouse) {

    spouse = inSpouse;

  } // End setSpouse().


  /**
   * Accessor for spouse.
   *
   * @return Value of spouse.
   */
  public String getSpouse() {

    return spouse;

  } // End getSpouse().


  /**
   * Mutator for child1.
   *
   * @param inChild1 New value for child1.
   */
  public void setChild1(final String inChild1) {

    child1 = inChild1;

  } // End setChild1().


  /**
   * Accessor for child1.
   *
   * @return Value of child1.
   */
  public String getChild1() {

    return child1;

  } // End getChild1().


  /**
   * Mutator for child2.
   *
   * @param inChild2 New value for child2.
   */
  public void setChild2(final String inChild2) {

    child2 = inChild2;

  } // End setChild2().


  /**
   * Accessor for child2.
   *
   * @return Value of child2.
   */
  public String getChild2() {

    return child2;

  } // End getChild2().


  /**
   * Mutator for child3.
   *
   * @param inChild3 New value for child3.
   */
  public void setChild3(final String inChild3) {

    child3 = inChild3;

  } // End setChild3().


  /**
   * Accessor for child3.
   *
   * @return Value of child3.
   */
  public String getChild3() {

    return child3;

  } // End getChild3().


  /**
   * Mutator for child4.
   *
   * @param inChild4 New value for child4.
   */
  public void setChild4(final String inChild4) {

    child4 = inChild4;

  } // End setChild4().


  /**
   * Accessor for child4.
   *
   * @return Value of child4.
   */
  public String getChild4() {

    return child4;

  } // End getChild4().


  /**
   * Mutator for child5.
   *
   * @param inChild5 New value for child5.
   */
  public void setChild5(final String inChild5) {

    child5 = inChild5;

  } // End setChild5().


  /**
   * Accessor for child5.
   *
   * @return Value of child5.
   */
  public String getChild5() {

    return child5;

  } // End getChild5().


  /**
   * Mutator for child6.
   *
   * @param inChild6 New value for child6.
   */
  public void setChild6(final String inChild6) {

    child6 = inChild6;

  } // End setChild6().


  /**
   * Accessor for child6.
   *
   * @return Value of child6.
   */
  public String getChild6() {

    return child6;

  } // End getChild6().


  /**
   * Mutator for child7.
   *
   * @param inChild7 New value for child7.
   */
  public void setChild7(final String inChild7) {

    child7 = inChild7;

  } // End setChild7().


  /**
   * Accessor for child7.
   *
   * @return Value of child7.
   */
  public String getChild7() {

    return child7;

  } // End getChild7().


  /**
   * Mutator for child8.
   *
   * @param inChild8 New value for child8.
   */
  public void setChild8(final String inChild8) {

    child8 = inChild8;

  } // End setChild8().


  /**
   * Accessor for child8.
   *
   * @return Value of child8.
   */
  public String getChild8() {

    return child8;

  } // End getChild8().


  /**
   * Mutator for company.
   *
   * @param inCompany New value for company.
   */
  public void setCompany(final String inCompany) {

    company = inCompany;

  } // End setCompany().


  /**
   * Accessor for company.
   *
   * @return Value of company.
   */
  public String getCompany() {

    return company;

  } // End getCompany().


  /**
   * Mutator for title.
   *
   * @param inTitle New value for title.
   */
  public void setTitle(final String inTitle) {

    title = inTitle;

  } // End setTitle().


  /**
   * Accessor for title.
   *
   * @return Value of title.
   */
  public String getTitle() {

    return title;

  } // End getTitle().


  /**
   * Mutator for department.
   *
   * @param inDepartment New value for department.
   */
  public void setDepartment(final String inDepartment) {

    department = inDepartment;

  } // End setDepartment().


  /**
   * Accessor for department.
   *
   * @return Value of department.
   */
  public String getDepartment() {

    return department;

  } // End getDepartment().


  /**
   * Mutator for workPhone.
   *
   * @param inWorkPhone New value for workPhone.
   */
  public void setWorkPhone(final String inWorkPhone) {

    workPhone = inWorkPhone;

  } // End setWorkPhone().


  /**
   * Accessor for workPhone.
   *
   * @return Value of workPhone.
   */
  public String getWorkPhone() {

    return workPhone;

  } // End getWorkPhone().


  /**
   * Mutator for workAddress1.
   *
   * @param inWorkAddress1 New value for workAddress1.
   */
  public void setWorkAddress1(final String inWorkAddress1) {

    workAddress1 = inWorkAddress1;

  } // End setWorkAddress1().


  /**
   * Accessor for workAddress1.
   *
   * @return Value of workAddress1.
   */
  public String getWorkAddress1() {

    return workAddress1;

  } // End getWorkAddress1().


  /**
   * Mutator for workAddress2.
   *
   * @param inWorkAddress2 New value for workAddress2.
   */
  public void setWorkAddress2(final String inWorkAddress2) {

    workAddress2 = inWorkAddress2;

  } // End setWorkAddress2().


  /**
   * Accessor for workAddress2.
   *
   * @return Value of workAddress2.
   */
  public String getWorkAddress2() {

    return workAddress2;

  } // End getWorkAddress2().


  /**
   * Mutator for workAddress3.
   *
   * @param inWorkAddress3 New value for workAddress3.
   */
  public void setWorkAddress3(final String inWorkAddress3) {

    workAddress3 = inWorkAddress3;

  } // End setWorkAddress3().


  /**
   * Accessor for workAddress3.
   *
   * @return Value of workAddress3.
   */
  public String getWorkAddress3() {

    return workAddress3;

  } // End getWorkAddress3().


  /**
   * Mutator for workAddress4.
   *
   * @param inWorkAddress4 New value for workAddress4.
   */
  public void setWorkAddress4(final String inWorkAddress4) {

    workAddress4 = inWorkAddress4;

  } // End setWorkAddress4().


  /**
   * Accessor for workAddress4.
   *
   * @return Value of workAddress4.
   */
  public String getWorkAddress4() {

    return workAddress4;

  } // End getWorkAddress4().


  /**
   * Mutator for workEMail.
   *
   * @param inWorkEMail New value for workEMail.
   */
  public void setWorkEMail(final String inWorkEMail) {

    workEMail = inWorkEMail;

  } // End setWorkEMail().


  /**
   * Accessor for workEMail.
   *
   * @return Value of workEMail.
   */
  public String getWorkEMail() {

    return workEMail;

  } // End getWorkEMail().


  /**
   * Mutator for workIM.
   *
   * @param inWorkIM New value for workIM.
   */
  public void setWorkIM(final String inWorkIM) {

    workIM = inWorkIM;

  } // End setWorkIM().


  /**
   * Accessor for workIM.
   *
   * @return Value of workIM.
   */
  public String getWorkIM() {

    return workIM;

  } // End getWorkIM().


  /**
   * Mutator for workFAX.
   *
   * @param inWorkFAX New value for workFAX.
   */
  public void setWorkFAX(final String inWorkFAX) {

    workFAX = inWorkFAX;

  } // End setWorkFAX().


  /**
   * Accessor for workFAX.
   *
   * @return Value of workFAX.
   */
  public String getWorkFAX() {

    return workFAX;

  } // End getWorkFAX().


  /**
   * Mutator for workCell.
   *
   * @param inWorkCell New value for workCell.
   */
  public void setWorkCell(final String inWorkCell) {

    workCell = inWorkCell;

  } // End setWorkCell().


  /**
   * Accessor for workCell.
   *
   * @return Value of workCell.
   */
  public String getWorkCell() {

    return workCell;

  } // End getWorkCell().


  /**
   * Mutator for workPager.
   *
   * @param inWorkPager New value for workPager.
   */
  public void setWorkPager(final String inWorkPager) {

    workPager = inWorkPager;

  } // End setWorkPager().


  /**
   * Accessor for workPager.
   *
   * @return Value of workPager.
   */
  public String getWorkPager() {

    return workPager;

  } // End getWorkPager().


  /**
   * Mutator for assistant.
   *
   * @param inAssistant New value for assistant.
   */
  public void setAssistant(final String inAssistant) {

    assistant = inAssistant;

  } // End setAssistant().


  /**
   * Accessor for assistant.
   *
   * @return Value of assistant.
   */
  public String getAssistant() {

    return assistant;

  } // End getAssistant().


  /**
   * Mutator for manager.
   *
   * @param inManager New value for manager.
   */
  public void setManager(final String inManager) {

    manager = inManager;

  } // End setManager().


  /**
   * Accessor for manager.
   *
   * @return Value of manager.
   */
  public String getManager() {

    return manager;

  } // End getManager().


  /**
   * Mutator for otherPhone.
   *
   * @param inOtherPhone New value for otherPhone.
   */
  public void setOtherPhone(final String inOtherPhone) {

    otherPhone = inOtherPhone;

  } // End setOtherPhone().


  /**
   * Accessor for otherPhone.
   *
   * @return Value of otherPhone.
   */
  public String getOtherPhone() {

    return otherPhone;

  } // End getOtherPhone().


  /**
   * Mutator for otherAddress1.
   *
   * @param inOtherAddress1 New value for otherAddress1.
   */
  public void setOtherAddress1(final String inOtherAddress1) {

    otherAddress1 = inOtherAddress1;

  } // End setOtherAddress1().


  /**
   * Accessor for otherAddress1.
   *
   * @return Value of otherAddress1.
   */
  public String getOtherAddress1() {

    return otherAddress1;

  } // End getOtherAddress1().


  /**
   * Mutator for otherAddress2.
   *
   * @param inOtherAddress2 New value for otherAddress2.
   */
  public void setOtherAddress2(final String inOtherAddress2) {

    otherAddress2 = inOtherAddress2;

  } // End setOtherAddress2().


  /**
   * Accessor for otherAddress2.
   *
   * @return Value of otherAddress2.
   */
  public String getOtherAddress2() {

    return otherAddress2;

  } // End getOtherAddress2().


  /**
   * Mutator for otherAddress3.
   *
   * @param inOtherAddress3 New value for otherAddress3.
   */
  public void setOtherAddress3(final String inOtherAddress3) {

    otherAddress3 = inOtherAddress3;

  } // End setOtherAddress3().


  /**
   * Accessor for otherAddress3.
   *
   * @return Value of otherAddress3.
   */
  public String getOtherAddress3() {

    return otherAddress3;

  } // End getOtherAddress3().


  /**
   * Mutator for otherAddress4.
   *
   * @param inOtherAddress4 New value for otherAddress4.
   */
  public void setOtherAddress4(final String inOtherAddress4) {

    otherAddress4 = inOtherAddress4;

  } // End setOtherAddress4().


  /**
   * Accessor for otherAddress4.
   *
   * @return Value of otherAddress4.
   */
  public String getOtherAddress4() {

    return otherAddress4;

  } // End getOtherAddress4().


  /**
   * Mutator for otherEMail.
   *
   * @param inOtherEMail New value for otherEMail.
   */
  public void setOtherEMail(final String inOtherEMail) {

    otherEMail = inOtherEMail;

  } // End setOtherEMail().


  /**
   * Accessor for otherEMail.
   *
   * @return Value of otherEMail.
   */
  public String getOtherEMail() {

    return otherEMail;

  } // End getOtherEMail().


  /**
   * Mutator for otherIM.
   *
   * @param inOtherIM New value for otherIM.
   */
  public void setOtherIM(final String inOtherIM) {

    otherIM = inOtherIM;

  } // End setOtherIM().


  /**
   * Accessor for otherIM.
   *
   * @return Value of otherIM.
   */
  public String getOtherIM() {

    return otherIM;

  } // End getOtherIM().


  /**
   * Mutator for otherFAX.
   *
   * @param inOtherFAX New value for otherFAX.
   */
  public void setOtherFAX(final String inOtherFAX) {

    otherFAX = inOtherFAX;

  } // End setOtherFAX().


  /**
   * Accessor for otherFAX.
   *
   * @return Value of otherFAX.
   */
  public String getOtherFAX() {

    return otherFAX;

  } // End getOtherFAX().


  /**
   * Mutator for otherCell.
   *
   * @param inOtherCell New value for otherCell.
   */
  public void setOtherCell(final String inOtherCell) {

    otherCell = inOtherCell;

  } // End setOtherCell().


  /**
   * Accessor for otherCell.
   *
   * @return Value of otherCell.
   */
  public String getOtherCell() {

    return otherCell;

  } // End getOtherCell().


  /**
   * Mutator for otherPager.
   *
   * @param inOtherPager New value for otherPager.
   */
  public void setOtherPager(final String inOtherPager) {

    otherPager = inOtherPager;

  } // End setOtherPager().


  /**
   * Accessor for otherPager.
   *
   * @return Value of otherPager.
   */
  public String getOtherPager() {

    return otherPager;

  } // End getOtherPager().


  /**
   * Mutator for comments.
   *
   * @param inComments New value for comments.
   */
  public void setComments(final String inComments) {

    comments = inComments;

  } // End setComments().


  /**
   * Accessor for comments.
   *
   * @return Value of comments.
   */
  public String getComments() {

    return comments;

  } // End getComments().


  /**
   * execute() (to fulfill interface contract).
   *
   * @return null.
   */
  public String execute() {

    return null;

  } // End execute().


  /**
   * Create new contact.
   *
   * @return result.
   */
  public String create() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("ContactAction.create()...");

    // Display incoming request parameters.
    log.info("ContactAction : " + this.toString());

    // Call on the ContactDAO to save the ContactObject instance we are about to
    // create and populate.
    ContactObject cont = getContactObject();
    ContactDAO    dao  = new ContactDAO();
    // Need to override the createdDT that was populated by getContactObject().
    cont.setCreatedDT(new Date().getTime());
    dao.contactCreate(cont);
    log.debug("ContactAction.create() Done");

    return Action.SUCCESS;

  } // End create().


  /**
   * Retrieve existing contact for editing.
   *
   * @return result.
   */
  public String retrieve() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("ContactAction.retrieve()...");

    // Display incoming request parameters.
    log.info("ContactAction : " + this.toString());

    // Retrieve the contact for the specified user created on the specified date
    // at the specified time.
    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    ContactDAO    dao      = new ContactDAO();
    contact = dao.contactRetrieve(username, createdDT);
    log.debug("ContactAction : " + this.toString());

    log.debug("ContactAction.retrieve() Done");

    return Action.SUCCESS;

  } // End retrieve().


  /**
   * Update existing contact.
   *
   * @return result.
   */
  public String update() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("ContactAction.update()...");

    // Display incoming request parameters.
    log.info("ContactAction : " + this.toString());

    // Call on the ContactDAO to update the ContactObject instance we are about
    // to create and populate.
    ContactObject cont = getContactObject();
    ContactDAO    dao  = new ContactDAO();
    dao.contactUpdate(cont);
    log.debug("ContactAction.update() Done");

    return Action.SUCCESS;

  } // End update().


  /**
   * Deleting existing contact.
   *
   * @return result.
   */
  public String delete() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("ContactAction.delete()...");

    // Display incoming request parameters.
    log.info("ContactAction : " + this.toString());

    // Call on the ContactDAO to delete the ContactObject instance we are about
    // to create and populate.
    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    ContactDAO    dao      = new ContactDAO();
    ContactObject cont     = new ContactObject();
    cont.setUsername(username);
    cont.setCreatedDT(createdDT);
    dao.contactDelete(cont);

    log.debug("ContactAction.delete() Done");

    return Action.SUCCESS;

  } // End delete().


  /**
   * List contacts.
   *
   * @return result.
   */
  public String list() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("ContactAction.list()...");

    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    ContactDAO    dao      = new ContactDAO();
    contacts = dao.contactList(username);
    log.debug("ContactAction : " + this.toString());

    log.debug("ContactAction.list() Done");

    return Action.SUCCESS;

  } // End list().


  /**
   * This method is called form both save() and update() to get a populated
   * ContactObject instance.  This saves a lot of duplicate code in both
   * methods.
   *
   * @return The fully-populated ContactObject.
   */
  private ContactObject getContactObject() {

    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    ContactObject cont     = new ContactObject();
    cont.setUsername(username);
    cont.setCreatedDT(createdDT);
    cont.setFirstName(firstName);
    cont.setMiddleName(middleName);
    cont.setLastName(lastName);
    cont.setHomePhone(homePhone);
    cont.setHomeAddress1(homeAddress1);
    cont.setHomeAddress2(homeAddress2);
    cont.setHomeAddress3(homeAddress3);
    cont.setHomeAddress4(homeAddress4);
    cont.setPersonalEMail(personalEMail);
    cont.setPersonalIM(personalIM);
    cont.setPersonalFAX(personalFAX);
    cont.setPersonalCell(personalCell);
    cont.setPersonalPager(personalPager);
    cont.setSpouse(spouse);
    cont.setChild1(child1);
    cont.setChild2(child2);
    cont.setChild3(child3);
    cont.setChild4(child4);
    cont.setChild5(child5);
    cont.setChild6(child6);
    cont.setChild7(child7);
    cont.setChild8(child8);
    cont.setCompany(company);
    cont.setTitle(title);
    cont.setDepartment(department);
    cont.setWorkPhone(workPhone);
    cont.setWorkAddress1(workAddress1);
    cont.setWorkAddress2(workAddress2);
    cont.setWorkAddress3(workAddress3);
    cont.setWorkAddress4(workAddress4);
    cont.setWorkEMail(workEMail);
    cont.setWorkIM(workIM);
    cont.setWorkFAX(workFAX);
    cont.setWorkCell(workCell);
    cont.setWorkPager(workPager);
    cont.setAssistant(assistant);
    cont.setManager(manager);
    cont.setOtherPhone(otherPhone);
    cont.setOtherAddress1(otherAddress1);
    cont.setOtherAddress2(otherAddress2);
    cont.setOtherAddress3(otherAddress3);
    cont.setOtherAddress4(otherAddress4);
    cont.setOtherEMail(otherEMail);
    cont.setOtherIM(otherIM);
    cont.setOtherFAX(otherFAX);
    cont.setOtherCell(otherCell);
    cont.setOtherPager(otherPager);
    cont.setComments(comments);
    return cont;

  } // End getContactObject();


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[" + super.toString() + "]={");
    boolean firstPropertyDisplayed = false;
    try {
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName() + "=" + fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.

package com.apress.ajaxprojects.theorganizer.daos;


import com.apress.ajaxprojects.theorganizer.Globals;
import com.apress.ajaxprojects.theorganizer.objects.ContactObject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;


/**
 * Data Access Object (DAO) for working with Contacts.
 */
public class ContactDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The DriverManagerDataSource this instance of the DAO will use.
   */
  private DriverManagerDataSource dataSource;


  /**
   * Constructor.
   */
  public ContactDAO() {

    dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(Globals.dbDriver);
    dataSource.setUrl(Globals.dbURL);
    dataSource.setUsername(Globals.dbUsername);
    dataSource.setPassword(Globals.dbPassword);

  } // End constructor.


  /**
   * Method to create a new contact.
   *
   * @param inContact The ContactObject instance to create.
   */
  public void contactCreate(final ContactObject inContact) {

    log.debug("ContactDAO.contactCreate()...");

    log.info("ContactObject to create : " + inContact);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "INSERT INTO contacts (" +
      "username, createddt, first_name, middle_name, last_name, home_phone, " +
      "home_address_1, home_address_2, home_address_3, home_address_4, "      +
      "personal_email, personal_im, personal_fax, personal_cell, "            +
      "personal_pager, spouse, child_1, child_2, child_3, "                   +
      "child_4, child_5, child_6, child_7, child_8, company, title, "         +
      "department, work_phone, work_address_1, work_address_2, "              +
      "work_address_3, work_address_4, work_email, work_im, work_fax, "       +
      "work_cell, work_pager, assistant, manager, other_phone, "              +
      "other_address_1, other_address_2, other_address_3, other_address_4, "  +
      "other_email, other_im, other_fax, other_cell, other_pager, comments"   +
      ") VALUES (" +
      "'" + inContact.getUsername()      + "', " +
      "'" + inContact.getCreatedDT()     + "', " +
      "'" + inContact.getFirstName()     + "', " +
      "'" + inContact.getMiddleName()    + "', " +
      "'" + inContact.getLastName()      + "', " +
      "'" + inContact.getHomePhone()     + "', " +
      "'" + inContact.getHomeAddress1()  + "', " +
      "'" + inContact.getHomeAddress2()  + "', " +
      "'" + inContact.getHomeAddress3()  + "', " +
      "'" + inContact.getHomeAddress4()  + "', " +
      "'" + inContact.getPersonalEMail() + "', " +
      "'" + inContact.getPersonalIM()    + "', " +
      "'" + inContact.getPersonalFAX()   + "', " +
      "'" + inContact.getPersonalCell()  + "', " +
      "'" + inContact.getPersonalPager() + "', " +
      "'" + inContact.getSpouse()        + "', " +
      "'" + inContact.getChild1()        + "', " +
      "'" + inContact.getChild2()        + "', " +
      "'" + inContact.getChild3()        + "', " +
      "'" + inContact.getChild4()        + "', " +
      "'" + inContact.getChild5()        + "', " +
      "'" + inContact.getChild6()        + "', " +
      "'" + inContact.getChild7()        + "', " +
      "'" + inContact.getChild8()        + "', " +
      "'" + inContact.getCompany()       + "', " +
      "'" + inContact.getTitle()         + "', " +
      "'" + inContact.getDepartment()    + "', " +
      "'" + inContact.getWorkPhone()     + "', " +
      "'" + inContact.getWorkAddress1()  + "', " +
      "'" + inContact.getWorkAddress2()  + "', " +
      "'" + inContact.getWorkAddress3()  + "', " +
      "'" + inContact.getWorkAddress4()  + "', " +
      "'" + inContact.getWorkEMail()     + "', " +
      "'" + inContact.getWorkIM()        + "', " +
      "'" + inContact.getWorkFAX()       + "', " +
      "'" + inContact.getWorkCell()      + "', " +
      "'" + inContact.getWorkPager()     + "', " +
      "'" + inContact.getAssistant()     + "', " +
      "'" + inContact.getManager()       + "', " +
      "'" + inContact.getOtherPhone()    + "', " +
      "'" + inContact.getOtherAddress1() + "', " +
      "'" + inContact.getOtherAddress2() + "', " +
      "'" + inContact.getOtherAddress3() + "', " +
      "'" + inContact.getOtherAddress4() + "', " +
      "'" + inContact.getOtherEMail()    + "', " +
      "'" + inContact.getOtherIM()       + "', " +
      "'" + inContact.getOtherFAX()      + "', " +
      "'" + inContact.getOtherCell()     + "', " +
      "'" + inContact.getOtherPager()    + "', " +
      "'" + inContact.getComments()      + "'" +
      ")");

    log.debug("ContactDAO.contactCreate() Done");

  } // End contactCreate().


  /**
   * Method to retrieve a contact created on a specified day at a specified time
   * for a specified user.
   *
   * @param  inUsername  The username to retrieve contact for.
   * @param  inCreatedDT The date and time, expressed as a long (millis) of
   *                     the contact to retrieve.
   * @return             The applicable ContactObject instances.
   */
  public ContactObject contactRetrieve(final String inUsername,
    final long inCreatedDT) {

    log.debug("ContactDAO.contactRetrieve()...");

    // Retrieve the contact for the specified user.
    log.debug("username/createdDT to retrieve contact for : " + inUsername +
      "/" + inCreatedDT);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    Map m = jt.queryForMap(
      "SELECT * FROM contacts WHERE username='" + inUsername + "' AND " +
      "createddt='" + inCreatedDT + "'"
    );
    log.info("Map Retrieved  : " + m);
    // Now build a ContactObjects from it to return.
    ContactObject contact = new ContactObject();
    contact.setUsername(inUsername);
    contact.setCreatedDT(inCreatedDT);
    contact.setFirstName((String)m.get("FIRST_NAME"));
    contact.setMiddleName((String)m.get("MIDDLE_NAME"));
    contact.setLastName((String)m.get("LAST_NAME"));
    contact.setHomePhone((String)m.get("HOME_PHONE"));
    contact.setHomeAddress1((String)m.get("HOME_ADDRESS_1"));
    contact.setHomeAddress2((String)m.get("HOME_ADDRESS_2"));
    contact.setHomeAddress3((String)m.get("HOME_ADDRESS_3"));
    contact.setHomeAddress4((String)m.get("HOME_ADDRESS_4"));
    contact.setPersonalEMail((String)m.get("PERSONAL_EMAIL"));
    contact.setPersonalIM((String)m.get("PERSONAL_IM"));
    contact.setPersonalFAX((String)m.get("PERSONAL_FAX"));
    contact.setPersonalCell((String)m.get("PERSONAL_CELL"));
    contact.setPersonalPager((String)m.get("PERSONAL_PAGER"));
    contact.setSpouse((String)m.get("SPOUSE"));
    contact.setChild1((String)m.get("CHILD_1"));
    contact.setChild2((String)m.get("CHILD_2"));
    contact.setChild3((String)m.get("CHILD_3"));
    contact.setChild4((String)m.get("CHILD_4"));
    contact.setChild5((String)m.get("CHILD_5"));
    contact.setChild6((String)m.get("CHILD_6"));
    contact.setChild7((String)m.get("CHILD_7"));
    contact.setChild8((String)m.get("CHILD_8"));
    contact.setCompany((String)m.get("COMPANY"));
    contact.setTitle((String)m.get("TITLE"));
    contact.setDepartment((String)m.get("DEPARTMENT"));
    contact.setWorkPhone((String)m.get("WORK_PHONE"));
    contact.setWorkAddress1((String)m.get("WORK_ADDRESS_1"));
    contact.setWorkAddress2((String)m.get("WORK_ADDRESS_2"));
    contact.setWorkAddress3((String)m.get("WORK_ADDRESS_3"));
    contact.setWorkAddress4((String)m.get("WORK_ADDRESS_4"));
    contact.setWorkEMail((String)m.get("WORK_EMAIL"));
    contact.setWorkIM((String)m.get("WORK_IM"));
    contact.setWorkFAX((String)m.get("WORK_FAX"));
    contact.setWorkCell((String)m.get("WORK_CELL"));
    contact.setWorkPager((String)m.get("WORK_PAGER"));
    contact.setAssistant((String)m.get("ASSISTANT"));
    contact.setManager((String)m.get("MANAGER"));
    contact.setOtherPhone((String)m.get("OTHER_PHONE"));
    contact.setOtherAddress1((String)m.get("OTHER_ADDRESS_1"));
    contact.setOtherAddress2((String)m.get("OTHER_ADDRESS_2"));
    contact.setOtherAddress3((String)m.get("OTHER_ADDRESS_3"));
    contact.setOtherAddress4((String)m.get("OTHER_ADDRESS_4"));
    contact.setOtherEMail((String)m.get("OTHER_EMAIL"));
    contact.setOtherIM((String)m.get("OTHER_IM"));
    contact.setOtherFAX((String)m.get("OTHER_FAX"));
    contact.setOtherCell((String)m.get("OTHER_CELL"));
    contact.setOtherPager((String)m.get("OTHER_PAGER"));
    contact.setComments((String)m.get("COMMENTS"));
    log.info("contact : " + contact);

    log.debug("ContactDAO.contactRetrieve() Done");
    return contact;

  } // End contactRetrieve().


  /**
   * Method to update an existing contact.
   *
   * @param inContact The ContactObject instance to update.
   */
  public void contactUpdate(final ContactObject inContact) {

    log.debug("ContactDAO.contactUpdate()...");

    log.info("ContactObject to update : " + inContact);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "UPDATE contacts SET " +
      "first_name='"         + inContact.getFirstName()     + "', " +
      "middle_name='"        + inContact.getMiddleName()    + "', " +
      "last_name='"          + inContact.getLastName()      + "', " +
      "home_phone='"         + inContact.getHomePhone()     + "', " +
      "home_address_1='"     + inContact.getHomeAddress1()  + "', " +
      "home_address_2='"     + inContact.getHomeAddress2()  + "', " +
      "home_address_3='"     + inContact.getHomeAddress3()  + "', " +
      "home_address_4='"     + inContact.getHomeAddress4()  + "', " +
      "personal_email='"     + inContact.getPersonalEMail() + "', " +
      "personal_im='"        + inContact.getPersonalIM()    + "', " +
      "personal_fax='"       + inContact.getPersonalFAX()   + "', " +
      "personal_cell='"      + inContact.getPersonalCell()  + "', " +
      "personal_pager='"     + inContact.getPersonalPager() + "', " +
      "spouse='"             + inContact.getSpouse()        + "', " +
      "child_1='"            + inContact.getChild1()        + "', " +
      "child_2='"            + inContact.getChild2()        + "', " +
      "child_3='"            + inContact.getChild3()        + "', " +
      "child_4='"            + inContact.getChild4()        + "', " +
      "child_5='"            + inContact.getChild5()        + "', " +
      "child_6='"            + inContact.getChild6()        + "', " +
      "child_7='"            + inContact.getChild7()        + "', " +
      "child_8='"            + inContact.getChild8()        + "', " +
      "company='"            + inContact.getCompany()       + "', " +
      "title='"              + inContact.getTitle()         + "', " +
      "department='"         + inContact.getDepartment()    + "', " +
      "work_phone='"         + inContact.getWorkPhone()     + "', " +
      "work_address_1='"     + inContact.getWorkAddress1()  + "', " +
      "work_address_2='"     + inContact.getWorkAddress2()  + "', " +
      "work_address_3='"     + inContact.getWorkAddress3()  + "', " +
      "work_address_4='"     + inContact.getWorkAddress4()  + "', " +
      "work_email='"         + inContact.getWorkEMail()     + "', " +
      "work_im='"            + inContact.getWorkIM()        + "', " +
      "work_fax='"           + inContact.getWorkFAX()       + "', " +
      "work_cell='"          + inContact.getWorkCell()      + "', " +
      "work_pager='"         + inContact.getWorkPager()     + "', " +
      "assistant='"          + inContact.getAssistant()     + "', " +
      "manager='"            + inContact.getManager()       + "', " +
      "other_phone='"        + inContact.getOtherPhone()    + "', " +
      "other_address_1='"    + inContact.getOtherAddress1() + "', " +
      "other_address_2='"    + inContact.getOtherAddress2() + "', " +
      "other_address_3='"    + inContact.getOtherAddress3() + "', " +
      "other_address_4='"    + inContact.getOtherAddress4() + "', " +
      "other_email='"        + inContact.getOtherEMail()    + "', " +
      "other_im='"           + inContact.getOtherIM()       + "', " +
      "other_fax='"          + inContact.getOtherFAX()      + "', " +
      "other_cell='"         + inContact.getOtherCell()     + "', " +
      "other_pager='"        + inContact.getOtherPager()    + "', " +
      "comments='"           + inContact.getComments()      + "'" +
      "WHERE username='"     + inContact.getUsername()      + "' AND " +
      "createddt='"          + inContact.getCreatedDT()     + "'"
    );
    log.debug("ContactDAO.contactUpdate() Done");

  } // End contactUpdate().


  /**
   * Method to delete a contact.
   *
   * @param inContact The ContactObject instance to delete.
   */
  public void contactDelete(final ContactObject inContact) {

    log.debug("ContactDAO.contactDelete()...");

    log.info("ContactObject to delete : " + inContact);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "DELETE FROM contacts " +
      "WHERE username='" + inContact.getUsername() + "' AND " +
      "createddt='" + inContact.getCreatedDT() + "'"
    );
    log.debug("ContactDAO.contactDelete() Done");

  } // End contactDelete().


  /**
   * Method to retrieve a List of contacts for the specified user.
   *
   * @param  inUsername The username to retrieve contacts for.
   * @return            A list of ContactObject instances.
   */
  public List contactList(final String inUsername) {

    log.debug("ContactDAO.contactList()...");

    // Retrieve the list of contacts for the specified user.
    log.debug("username to retrieve contacts for : " + inUsername);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    List contacts = jt.queryForList(
      "SELECT createddt, first_name, last_name FROM contacts WHERE username='" +
        inUsername + "'"
    );
    log.info("Retrieved List : " + contacts);
    // Now build a List of ContactObjects from it to return.
    List contactsOut = new ArrayList();
    for (Iterator it = contacts.iterator(); it.hasNext();) {
      Map m = (Map)it.next();
      ContactObject contact = new ContactObject();
      contact.setUsername(inUsername);
      contact.setCreatedDT(((Long)m.get("CREATEDDT")).longValue());
      contact.setFirstName((String)m.get("FIRST_NAME"));
      contact.setLastName((String)m.get("LAST_NAME"));
      contactsOut.add(contact);
    }
    log.info("contactOut List : " + contactsOut);

    log.debug("ContactDAO.contactList() Done");
    return contactsOut;

  } // End contactList().


} // End class.

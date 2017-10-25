package com.apress.ajaxprojects.simplestruts;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.DynaActionForm;

public class GreetPersonAction extends Action {

  public ActionForward execute(ActionMapping mapping, ActionForm form,
    HttpServletRequest request, HttpServletResponse response) throws Exception {

      // Get the two parameters from request.
      DynaActionForm f         = (DynaActionForm)form;
      String         firstName = (String)f.get("firstName");
      String         lastName  = (String)f.get("lastName");
      
      // See if they entered a first and last name.
      if (firstName == null || lastName == null ||
        firstName.equalsIgnoreCase("") || lastName.equalsIgnoreCase("") ) {
        // They didn't so mildly scold them.
        request.setAttribute("greeting", 
          getResources(request).getMessage(getLocale(request), 
          "nameNotEntered"));
      } else {
        // They did, so greet them.
        request.setAttribute("greeting",
          getResources(request).getMessage(getLocale(request), 
          "hello") + " " + firstName + " " + lastName + "!");
      }
      
      // Return the ForwardConfig that tells us where to go next.
      return mapping.findForward("default");
      
    } // End execute().

} // End class.

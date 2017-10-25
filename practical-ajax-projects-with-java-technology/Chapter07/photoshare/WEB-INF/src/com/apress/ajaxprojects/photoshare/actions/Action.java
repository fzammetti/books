package com.apress.ajaxprojects.photoshare.actions;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletContext;


/**
 * Class that all Actions extend.
 */
public class Action {


  /**
   * ServletContext object the request is executing in.
   */
  private ServletContext servletContext;


  /**
   * HttpServletRequest being serviced.
   */
  private HttpServletRequest request;


  /**
   * HttpServletResponse the request will use to render output.
   */
  private HttpServletResponse response;


  /**
   * HttpSession of the request being services.
   */
  private HttpSession session;


  /**
   * Sets the servletContext.
   *
   * @param inServletContext The ServletContext the request is executing in.
   */
  public void setServletContext(ServletContext inServletContext) {

    servletContext = inServletContext;

  } // End setServletContext().


  /**
   * Returns the servletContext.
   *
   * @return servletContext.
   */
  public ServletContext getServletContext() {

    return servletContext;

  } // End getServletContext().


  /**
   * Sets the request.
   *
   * @param inRequest The Request being serviced.
   */
  public void setRequest(HttpServletRequest inRequest) {

    request = inRequest;

  } // End setRequest().


  /**
   * Returns the request.
   *
   * @return request.
   */
  public HttpServletRequest getRequest() {

    return request;

  } // End getRequest().


  /**
   * Sets the response.
   *
   * @param inResponse The Response the request is using to render output.
   */
  public void setResponse(HttpServletResponse inResponse) {

    response = inResponse;

  } // End setResponse().


  /**
   * Returns the response.
   *
   * @return response.
   */
  public HttpServletResponse getResponse() {

    return response;

  } // End getResponse().


  /**
   * Sets the session.
   *
   * @param inSession The Session associated with the request being serviced.
   */
  public void setSession(HttpSession inSession) {

    session = inSession;

  } // End setSession().


  /**
   * Returns the session.
   *
   * @return session.
   */
  public HttpSession getSession() {

    return session;

  } // End getSession().


  /**
   * Sets a request attribute "message" used to convey information to the
   * user.
   *
   * @param inMessage The message string to store.
   */
  public void setMessage(String inMessage) {

    request.setAttribute("message", inMessage);

  } // End setMessage().


  /**
   * Default implementation of the execute() method that most Actions will
   * provide.
   *
   * @return The result.
   */
  public String execute() {

    return "ok";

  } // End execute().


} // End interface.

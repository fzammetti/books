/*
    Timer Tracker - From the book "Practical webOS Projects With the Palm Pre"
    Copyright (C) 2009 Frank W. Zammetti
    fzammetti@etherient.com
    
    Licensed under the terms of the MIT license as follows:
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to 
    deal in the Software without restriction, including without limitation the 
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
    FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
    IN THE SOFTWARE.
*/


package com.etherient.timetracker;


import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;


/**
 * General utility functions, for dealing with JDO and otherwise.  For JDO,
 * primarily this is for the getPersistenceManager() method.  Note that this is 
 * a singleton because the private PersistenceManagerFactory is expensive to 
 * instantiate and therefore we only want it done once per application instance.
 *
 * @author <a href="mailto:fzammetti@etherient.com">Frank W. Zammetti</a>
 */
public final class Utils {


  /**
   * The one and only instance of the PersistenceManagerFactory.
   */
  private static final PersistenceManagerFactory persistenceManagerFactory =
    JDOHelper.getPersistenceManagerFactory("transactions-optional");


  /**
   * Private constructor to implement singleton pattern.
   */
  private Utils() { }


  /**
   * Method called by client code to get a PersistenceManager instance.
   *
   * @return A PersistenceManager instance.
   */
  public static PersistenceManager getPersistenceManager() {
  
    return persistenceManagerFactory.getPersistenceManager();
    
  } // End getPersistenceManager().
  
  
} // End class().

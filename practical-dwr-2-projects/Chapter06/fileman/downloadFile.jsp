<%
  /*
    Copyright (c) 2007 by Frank W. Zammetti.  This file is part of the DWR
    File Manager (Fileman) project from the book Practical DWR 2 Projects
    by Frank W. Zammetti, published by Apress, Inc. in 2008.

    Fileman is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    Fileman is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see
    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html.
  */
%>

<%@ page language="java" import="java.io.*" %>

<%
  /*
    This JSP is used to download a file.  It accepts the path and name of the
    file to download, and streams it back.  Most browsers should try and
    recognize the file type; otherwise it should be downloaded as a stream of
    bytes only, which should always be fine.
  */
  String filePath = request.getParameter("p");
  String fileName = request.getParameter("n");
  response.setContentType("application/unknown");
  response.addHeader("Content-Disposition",
    "attachment; filename=" + fileName);
  try {
    File f = new File(filePath + File.separator + fileName);
    int fSize = (int)f.length();
    FileInputStream fis = new FileInputStream(f);
    PrintWriter pw =  response.getWriter();
    int c = -1;
    while ((c = fis.read()) != -1) {
      pw.print((char)c);
    }
    fis.close();
    pw.flush();
    pw = null;
  } catch (Exception e) {
    e.printStackTrace();
  }
%>

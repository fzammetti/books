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

<%@ page language="java" import="java.util.*,java.io.*,org.apache.commons.fileupload.*,org.apache.commons.fileupload.disk.*,org.apache.commons.fileupload.servlet.*,org.apache.commons.io.*" %>

<%
  /*
    This JSP is used to upload a file.  It used Commons FileUpload to parse the
    multipart request and save the file to the specified location.
  */
  FileItemFactory factory = new DiskFileItemFactory();
  ServletFileUpload upload = new ServletFileUpload(factory);
  List items = upload.parseRequest(request);
  Iterator it = items.iterator();
  HashMap params = new HashMap();
  FileItem file = null;
  // The elements of the request, either form field or the file itself.
  while (it.hasNext()) {
    FileItem item = (FileItem)it.next();
    if (item.isFormField()) {
      params.put(item.getFieldName(), item.getString());
    } else {
      file = item;
    }
  }
  // Get just the name portion of the uploaded file (it's the full path without
  // doing this work, which doesn't help us much).
  String incomingName = file.getName();
  String nakedFilename = FilenameUtils.getName(incomingName);
  try {
    InputStream is = file.getInputStream();
    OutputStream os = new FileOutputStream(
      (String)params.get("uploadDirectory") + File.separator + nakedFilename);
    int bytesRead = 0;
    byte[] buffer = new byte[8192];
    while((bytesRead = is.read(buffer, 0, 8192)) != -1) {
      os.write(buffer, 0, bytesRead);
    }
    is.close();
    os.close();
  } catch (Exception e) {
    e.printStackTrace();
  }
%>

<html><head><title>File uploaded</title><script>
// Hide the file upload form in the parent so that when this popup is closed,
// the display is showing the file manager itself again.
opener.document.getElementById("divFileUpload").style.display = "none";
window.opener.fileman.toolbarButtonClick("tbRefresh", "");
</script></head><body>
File has been uploaded.  You may now close this window.
</body></html>

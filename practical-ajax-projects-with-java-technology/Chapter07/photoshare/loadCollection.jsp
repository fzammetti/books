<% /*
      This JSP is responsible for rendering the XML that describes a collection
      when one is selected by the user.  This XML is generated using the
      collection request attribute, which is a CollectionDTO.
    */
%>
<%@ page language="java" import="java.util.*,com.apress.ajaxprojects.photoshare.dtos.*" %>
<% CollectionDTO collection = (CollectionDTO)request.getAttribute("collection"); %>
<collection name="<%=collection.getName()%>" createdBy="<%=collection.getCreatedBy()%>" createdOn="<%=collection.getCreatedOn()%>">
  <%
    ArrayList photos = collection.getPhotos();
    for (Iterator it = photos.iterator(); it.hasNext();) {
      PhotoDTO photo = (PhotoDTO)it.next();
  %>
      <photo addedBy="<%=photo.getAddedBy()%>" addedOn="<%=photo.getAddedOn()%>" type="<%=photo.getType()%>" fileSize="<%=photo.getFileSize()%>" dimensions="<%=photo.getDimensions()%>" dpi="<%=photo.getDpi()%>" filename="<%=photo.getFilename()%>" colorDepth="<%=photo.getColorDepth()%>">
      <%=photo.getDescription()%>
      </photo>
  <%
    }
  %>
</collection>

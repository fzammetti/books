<html>
  <head>
    <title>simpleapp</title>
  </head>
  <body>
    <%
      Integer answer = (Integer)request.getAttribute("answer");
      // If there's an answer attribute in request, we just performed an
      // operation, so display the result.
      if (answer != null) {
        Integer a = (Integer)request.getAttribute("a");
        String op = (String)request.getAttribute("op");
        Integer b = (Integer)request.getAttribute("b");
    %>
          <span><h1>Result: <%=a%> <%=op%> <%=b%> = <%=answer%></h1></span>
    <%
      }
    %>
    Please enter two numbers, select an operation, and click the equals button:
    <br><br>
    <form action="MathServlet" method="post">
      <input type="text" name="a" size="4">
      &nbsp;
      <select name="op">
        <option value="add">+</option>
        <option value="subtract">-</option>
        <option value="multiply">*</option>
        <option value="divide">/</option>
      </select>
      &nbsp;
      <input type="text" name="b" size="4">
      &nbsp;
      <input type="submit" value="=">
    </form>
  </body>
</html>

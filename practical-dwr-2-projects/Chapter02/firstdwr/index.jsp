<html>
  <head>
    <title>firstdwr</title>
    <script type="text/javascript" src="dwr/interface/MathDelegate.js"></script>
    <script type="text/javascript" src="dwr/engine.js"></script>
    <script>
      var a = 0;
      var b = 0;
      var op = "";
      function doMath() {
        a = document.getElementById("numA").value;
        b = document.getElementById("numB").value;
        op = document.getElementById("op").value;
        if (op == "add") {
          MathDelegate.add(a, b, doMathCallback);
          op = "+";
        } else if (op == "subtract") {
          MathDelegate.subtract(a, b, doMathCallback);
          op = "-";
        } else if (op == "multiply") {
          MathDelegate.multiply(a, b, doMathCallback);
          op = "*";
        } else if (op == "divide") {
          MathDelegate.divide(a, b, doMathCallback);
          op = "/";
        }
      }
      var doMathCallback = function(answer) {
        document.getElementById("resultDiv").innerHTML = "<h1>" +
          "Result: " + a + " " + op + " " + b + " = " + answer + "</h1>";
      }
    </script>
  </head>
  <body>
    <span id="resultDiv"></span>
    Please enter two numbers, select an operation, and click the equals button:
    <br><br>
    <input type="text" id="numA" size="4">
    &nbsp;
    <select id="op">
      <option value="add">+</option>
      <option value="subtract">-</option>
      <option value="multiply">*</option>
      <option value="divide">/</option>
    </select>
    &nbsp;
    <input type="text" id="numB" size="4">
    &nbsp;
    <input type="button" value="=" onClick="doMath();">
  </body>
</html>

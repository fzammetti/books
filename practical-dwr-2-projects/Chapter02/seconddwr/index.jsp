<html>
  <head>
    <title>seconddwr</title>
    <script type="text/javascript" src="dwr/interface/ClassA.js"></script>
    <script type="text/javascript" src="dwr/interface/SigTestClass.js"></script>
    <script type="text/javascript" src="dwr/interface/MathDelegate.js"></script>
    <script type="text/javascript"
      src="dwr/interface/StudentRegistry.js"></script>
    <script type="text/javascript" src="dwr/interface/RemoteClass.js"></script>
    <script type="text/javascript"
      src="dwr/interface/RemoteClassDecoupled.js"></script>
    <script type="text/javascript"
      src="dwr/interface/BatchCallClass.js"></script>
    <script type="text/javascript" src="dwr/engine.js"></script>
    <script type="text/javascript" src="dwr/util.js"></script>
    <script>

      // Tests for ClassA.methodA().
      function callClassAMethodA() {
        ClassA.methodA(callClassAMethodACallback);
      }
      function callClassAMethodACallback(inResp) {
        alert(inResp.myField);
      }

      // Tests for SigTestClass.convertNames().
      function callSigTestClassConvertNames() {
        SigTestClass.convertNames(["tony", "silvio", "christopher", "paulie",
          "bobby"], callSigTestClassConvertNamesCallback);
      }
      function callSigTestClassConvertNamesCallback(inResp) {
        alert(inResp);
      }

      // Tests for MathDelegate.add().
      function callMathDelegateAdd() {
        MathDelegate.add(5, 5, { callback : doMathCallback });
      }
      function doMathCallback(inResp) {
        alert(inResp);
      }

      // Tests for MathDelegate.add() (inline).
      function callMathDelegateAddInline() {
        MathDelegate.add(
          7, 7, { callback : function(inResp) { alert(inResp); } }
        );
      }

      // Tests for StudentRegistry.addStudent().
      var studentCount = 0;
      function callStudentRegistryAddStudent() {
        var names = new Array();
        names[0] = "Eric Lehnsherr"; names[1] = "Charles Xavier";
        names[2] = "Scott Summers"; names[3] = "James Logan";
        names[4] = "Bobby Drake"; names[5] = "Katherine Pryde";
        names[6] = "Ororo Monroe"; names[7] = "Jean Grey";
        names[8] = "Piotr Rasputin"; names[9] = "Hank McCoy";
        names[10] = "Warren Worthington"; names[11] = "Kurt Wagner";
        names[12] = "Mortimer Toynbee"; names[13] = "Cain Marko";
        names[14] = "Yuriko Oyama";
        var student = {
          name : names[studentCount++],
          gpa : Math.round(4.0 * Math.random())
        };
        if (studentCount > 14) { studentCount = 0; }
        StudentRegistry.addStudent(student,
          callStudentRegistryAddStudentCallback);
      }
      function callStudentRegistryAddStudentCallback(inResp) {
        alert(inResp);
      }

      // Tests for RemoteClass.remoteMethod().
      var extraInformation = "Susan Storm";
      var callbackProxy = function(methodReturn) {
        realCallback(methodReturn, extraInformation);
      };
      var realCallback = function(inMethodReturn, extraInformation) {
        alert(inMethodReturn + extraInformation);
      }
      function callRemoteClassRemoteMethod() {
        RemoteClass.remoteMethod("Reed Richards",
          { callback : callbackProxy });
      }

      // Tests for RemoteClass.serverSideObjects().
      function callRemoteClassServerSideObjects() {
        RemoteClass.serverSideObjects(
          {
            callback : function(inResp) {
              alert("See console, or logs, for server object displays");
            }
          }
        );
      }

      // Tests for RemoteClassDecoupled.serverSideObjects().
      function callRemoteClassDecoupledServerSideObjects() {
        RemoteClassDecoupled.serverSideObjects("This is a parameter",
          {
            callback : function(inResp) {
              alert("See console, or logs, for server object displays");
            }
          }
        );
      }

      // Tests for call batching.
      function testCallBatching() {
        DWREngine.beginBatch();
          BatchCallClass.method1(testCallBatchingCallback1);
          BatchCallClass.method2(testCallBatchingCallback2);
          MathDelegate.multiply(8, 4, testCallBatchingCallback3);
        DWREngine.endBatch();
      }
      function testCallBatchingCallback1(inResp) {
        alert("Response from BatchCallClass.method1() = " + inResp);
      }
      function testCallBatchingCallback2(inResp) {
        alert("Response from BatchCallClass.method2() = " + inResp);
      }
      function testCallBatchingCallback3(inResp) {
        alert("Response from MathDelegate.multiply() = " + inResp);
      }

    </script>
  </head>
  <body>

    <input type="button" value="Click to call ClassA.methodA()"
      onClick="callClassAMethodA();">
    <br><br>

    <input type="button"  value="Click to call SigTestClass.convertNames()"
      onClick="callSigTestClassConvertNames();">
    <br><br>

    <input type="button" value="Click to call MathDelegate.add()"
      onClick="callMathDelegateAdd();">
    <br><br>

    <input type="button" value="Click to call MathDelegate.add() (inline)"
      onClick="callMathDelegateAddInline();">
    <br><br>

    <input type="button" value="Click to call StudentRegistry.addStudent()"
      onClick="callStudentRegistryAddStudent();">
    <br><br>

    <input type="button" value="Click to call RemoteClass.RemoteMethod()"
      onClick="callRemoteClassRemoteMethod();">
    <br><br>

    <input type="button" value="Click to call RemoteClass.serverSideObjects()"
      onClick="callRemoteClassServerSideObjects();">
    <br><br>

    <input type="button"
      value="Click to call RemoteClassDecoupled.serverSideObjects()"
      onClick="callRemoteClassDecoupledServerSideObjects();">
    <br><br>

    <input type="button" value="Click to test batch calling"
      onClick="testCallBatching();">
    <br><br>

  </body>
</html>

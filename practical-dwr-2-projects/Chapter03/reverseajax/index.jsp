<html>
  <head>
    <title>dwr</title>
    <script type="text/javascript" src="dwr/interface/RemoteClass.js"></script>
    <script type="text/javascript" src="dwr/engine.js"></script>
    <script type='text/javascript' src="dwr/util.js"></script>
  </head>
  <body
    onLoad="dwr.engine.setActiveReverseAjax(true);RemoteClass.startPolling();">
    The current time will be displayed below, updated every second via
    reverse Ajax polling.
    <br><br>
    <div id="divTest"></div>
  </body>
</html>

function Redirect()   {
  var WhatBrowser;
  var WhatVersion;
  WhatBrowser = navigator.appName.toUpperCase();
  WhatVersion = navigator.appVersion.toUpperCase();
  if (WhatBrowser.indexOf("MICROSOFT") >= 0) {
    if (WhatVersion.indexOf("3") >= 0) {
      top.location = "MainPage.html";
    } else {
      top.location = "BadVersion.html";
    }
  }
  if (WhatBrowser.indexOf("NETSCAPE") >= 0) {
    if (WhatVersion.indexOf("2") >= 0) {
      top.location = "MainPage.html";
    } else {
      top.location = "BadVersion.html";
    }
  }
}

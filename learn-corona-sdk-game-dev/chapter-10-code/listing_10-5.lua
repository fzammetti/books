function networkListener(inEvent)
  if (inEvent.isError) then
    print("Network error!");
  else
    print(inEvent.response);
  end
end

hdrs = { };
hdrs["Accept-Language"] = "en-US";
local rData = {
  headers = hdrs,
  body = "Miscellaneous%20Value"
};

network.request(
  "http://tycho.usno.navy.mil/cgi-bin/timer.pl", "POST", networkListener, rData
);

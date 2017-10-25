function callback(inEvent)

  if (inEvent.isError) then
    print("Download no happen, sorry!");
  else
    display.newImage("house.png", system.TemporaryDirectory, 48, 48);
  end

end

network.download(
  "http://etherient.com/img/home.png",
  "GET",
  callback,
  "house.png",
  system.TemporaryDirectory
);

function networkStatusListener(inEvent)
  print("address", inEvent.address);
  print("isReachable", inEvent.isReachable);
  print("isConnectionRequired", inEvent.isConnectionRequired);
  print("isConnectionOnDemand", inEvent.isConnectionOnDemand);
  print("IsInteractionRequired", inEvent.isInteractionRequired);
  print("IsReachableViaCellular", inEvent.isReachableViaCellular);
  print("IsReachableViaWiFi", inEvent.isReachableViaWiFi);
end

if network.canDetectNetworkStatusChanges then
  network.setStatusListener("www.google.com", networkStatusListener);
else
  print("Network reachability checking not supported");
end
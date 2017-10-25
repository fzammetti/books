local store = require("store");

store.init(
  function (inEvent)

    if inEvent.transaction.state == "purchased" then
      print("Complete");
      print("productIdentifier", inEvent.transaction.productIdentifier);
      print("receipt", inEvent.transaction.receipt);
      print("transactionIdentifier", inEvent.transaction.identifier);
      print("date", inEvent.transaction.date);

    elseif inEvent.transaction.state == "restored" then
      print("Restored (already purchased)");
      print("productIdentifier", inEvent.transaction.productIdentifier);
      print("receipt", inEvent.transaction.receipt);
      print("transactionIdentifier", inEvent.transaction.identifier);
      print("date", inEvent.transaction.date);
      print("originalReceipt", inEvent.transaction.originalReceipt);
      print("originalinEvent.transactionIdentifier",
        inEvent.transaction.originalIdentifier
      );
      print("originalDate", inEvent.transaction.originalDate);

    elseif inEvent.transaction.state == "cancelled" then
      print("Cancelled by user")

    elseif inEvent.transaction.state == "failed" then
      print("Purchase failed: ", transaction.errorType, transaction.errorString);

    else
        print("D'oh! Something went wrong!");

    end

    store.finishTransaction(inEvent.transaction);

  end
);

if store.canMakePurchases then

  store.loadProducts(
    {
      "com.etherient.myGame.purchaseableItem1",
      "com.etherient.myGame.purchaseableItem2"
    },
    function(inEvent)
      for i = 1, #inEvent.products do
        print(inEvent.products[i].title);
        print(inEvent.products[i].description);
        print(inEvent.products[i].price);
        print(inEvent.products[i].localizedPrice);
        print(inEvent.products[i].productIdentifier);
      end
    end
  );

  store.restore();

  store.purchase( { "com.etherient.purchaseableItem1"} );

else

  print("You are not allowed to make in-app purchases on this device");

end

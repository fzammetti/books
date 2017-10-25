/**
 * This class represents a catalog of items.
 */
function Catalog() {


  /**
   * The collection of items for sale in the catalog.
   */
  var catalogItems = new Object;


  /**
   * Load some items so the user can play, assuming JavaScript is enabled.
   */
  var item1 = new CatalogItem();
  item1.setItemID("1");
  item1.setItemTitle("Duo Diamond Ring");
  item1.setItemDescription("This 10K gold Duo ring features two round diamonds in prong settings with round diamond accents.  Duo Jewelry is designed to celebrate a couple's love.");
  item1.setItemImageURL("img/item1.gif");
  item1.setItemPrice(299.09);
  catalogItems[item1.getItemID()] = item1;

  var item2 = new CatalogItem();
  item2.setItemID("2");
  item2.setItemTitle("Seagate Hard Drive");
  item2.setItemDescription("Seagate Barracuda 7200.10 ST3320620AS (Perpendicular Recording Technology) 320GB 7200 RPM 16MB Cache SATA 3.0Gb/s Hard Drive - OEM");
  item2.setItemImageURL("img/item2.gif");
  item2.setItemPrice(94.99);
  catalogItems[item2.getItemID()] = item2;

  var item3 = new CatalogItem();
  item3.setItemID("3");
  item3.setItemTitle("Fisher-Price Rainforest Bouncer");
  item3.setItemDescription("A delightful bouncer for baby in a beautiful rainforest theme.  This bouncer has 14 songs and three sound effects.");
  item3.setItemImageURL("img/item3.gif");
  item3.setItemPrice(49.96);
  catalogItems[item3.getItemID()] = item3;

  var item4 = new CatalogItem();
  item4.setItemID("4");
  item4.setItemTitle("Toastmaster 4-Slice Toaster Oven");
  item4.setItemDescription("4-slice toaster oven/broiler features a clean, contemporary design with nonstick interior, full range thermostat, LED power indicator and slide-out crumb tray.  Bake, broil, toast and top brown settings.");
  item4.setItemImageURL("img/item4.gif");
  item4.setItemPrice(28.49);
  catalogItems[item4.getItemID()] = item4;

  var item5 = new CatalogItem();
  item5.setItemID("5");
  item5.setItemTitle("Practical Ajax Projects");
  item5.setItemDescription("If you're a Java developer already versed in Ajax-style programming, and you want to take your knowledge to the next level, then this is the book for you.  Practical Ajax Projects with Java Technology provides the ultimate learn-by-example experience, featuring seven complete example applications for you to learn from and then adapt for use in your own projects.  During each application, the author will lead you through the planning, design, and implementation stages.");
  item5.setItemImageURL("img/item5.gif");
  item5.setItemPrice(32.99);
  catalogItems[item5.getItemID()] = item5;

  var item6 = new CatalogItem();
  item6.setItemID("6");
  item6.setItemTitle("Images and Words CD");
  item6.setItemDescription("Proof positive that one can be a virtuoso musician and also have heart, Dream Theater are in impressive form on this album, arguably their best.  They do it by never allowing technical flash to overwhelm their songs; there's substance under the style, in the form of ear-catching riffs and aggressive rhythms.");
  item6.setItemImageURL("img/item6.gif");
  item6.setItemPrice(10.09);
  catalogItems[item6.getItemID()] = item6;

  var item7 = new CatalogItem();
  item7.setItemID("7");
  item7.setItemTitle("HoMedics Atom Massager");
  item7.setItemDescription("Work out minor aches and pains with this Mini massager from Homedics.  Its cushy gel heads are sure to be enough to work away hand cramps and even minor joint pain.");
  item7.setItemImageURL("img/item7.gif");
  item7.setItemPrice(9.99);
  catalogItems[item7.getItemID()] = item7;

  var item8 = new CatalogItem();
  item8.setItemID("8");
  item8.setItemTitle("Elebits for Nintendo Wii");
  item8.setItemDescription("For 10,000 years, Elebits have been the only source of the world's power.  These tiny creatures, although very useful to humans, can be quite a handful.  They love to cause trouble, then run away and hide, leaving very little idea of where to find them.  It's up to you to track these mysterious creatures down and secure the state of the world's energy.");
  item8.setItemImageURL("img/item8.gif");
  item8.setItemPrice(49.99);
  catalogItems[item8.getItemID()] = item8;


  /**
   * Returns a CatalogItem by ID.
   *
   * @param  inItemID The ID of the item to return.
   * @return          The corresponding item, or null if not found.
   */
  this.getItem = function(inItemID) {

    return catalogItems[inItemID];

  } // End getItem().


} // End Catalog class.


// The one and only instance of the items catalog.
var catalog = new Catalog();

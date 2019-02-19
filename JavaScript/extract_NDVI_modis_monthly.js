// =============================================================
// Extract MODIS Monthly Data to Country
// =============================================================
// Creates a raster with 12 bands, one for each month, for a given year.

var extract_ndvi_modis_stacked = function(country_name, year, gdrive_folder, image_name){

  // Extracts monthly NDVI Data from MODIS for a year

  // Args:
  //   countryname: Country to export
  //   year: year to extract data
  //   gdrive_folder: Name of folder to export image
  //   image_name: Name to call exported image

  // Get country feature
  var countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
  var country = countries.filter(ee.Filter.eq('Country', country_name));

  // Import Image Collection
  var modis = ee.ImageCollection('MODIS/006/MOD13Q1');

  var modis_m01 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m02 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m03 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m04 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m05 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m06 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m07 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m08 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m09 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m10 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m11 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());
  var modis_m12 = ee.ImageCollection(modis.filterBounds(country).filterDate((year + "-01-" + "01"), (year + "-01-" + "31"))).select("NDVI").reduce(ee.Reducer.mean());

  var modis_month_ic = ee.ImageCollection([modis_m01, modis_m02, modis_m03, modis_m04,
                                           modis_m05, modis_m06, modis_m07, modis_m08,
                                           modis_m09, modis_m10, modis_m11, modis_m12]);

  // Function to turn imagecollection into image with bands
  var stackCollection = function(collection) {
    // Create an initial image.
    var first = ee.Image(collection.first()).select([]);

    // Write a function that appends a band to an image.
    var appendBands = function(image, previous) {
      return ee.Image(previous).addBands(image);
    };
    return ee.Image(collection.iterate(appendBands, first));
  };

  var modis_image_stack = stackCollection(modis_month_ic);

  // Make sure all are float
  modis_image_stack = modis_image_stack.float();

  // Clip to country and export image to google drive
  modis_image_stack = modis_image_stack.clip(country);

  Export.image.toDrive({
    folder: gdrive_folder,
    image: modis_image_stack,
    scale: 250,
    region: country,
    description: image_name,
  });

};

// Extract VIIRS ============================================================================
extract_ndvi_modis_stacked('Rwanda', '2000','gee_extracts', 'rwanda_ndvi_modis_monthly_2000');

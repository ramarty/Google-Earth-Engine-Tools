// =============================================================
// Extract VIIRS Monthly Data to Country
// =============================================================
var extract_viirs_country_time_stacked = function(country_name, begin_date, end_date, gdrive_folder, image_name){
  // Extracts monthly VIIRS data for a specific daterange

  // Args:
  //   country_name: Country to export
  //   begin_date: Beginning data for VIIRS image.
  //   end_date: End date for VIIRS image.
  //   gdrive_folder: Name of folder to export image
  //   image_name: Name to call exported image

  // Get country feature
  var countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
  var country = countries.filter(ee.Filter.eq('Country', country_name));

  // Load VIIRS ImageCollection and filter by date
  var viirs = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG');
  viirs = ee.ImageCollection(
    viirs.filterDate(begin_date,end_date)
  );

  // Create separate ImageCollections of radiance and cloud cover
  var viirs_avg_rad = viirs.select('avg_rad');
  var viirs_cf_cvg = viirs.select('cf_cvg');

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

  var viirs_avg_rad_image = stackCollection(viirs_avg_rad);
  var viirs_cf_cvg_image = stackCollection(viirs_cf_cvg);

  // Make sure data types are all the same
  viirs_avg_rad_image = viirs_avg_rad_image.float()
  viirs_cf_cvg_image = viirs_cf_cvg_image.int16()

  var avg_rad_name = image_name + "_avg_rad"
  var cf_cvg_name = image_name + "_cf_cvg"

  Export.image.toDrive({
    folder: gdrive_folder,
    image: viirs_avg_rad_image,
    scale: 750,
    region: country.geometry().bounds(),
    description: avg_rad_name,
  });

  Export.image.toDrive({
    folder: gdrive_folder,
    image: viirs_cf_cvg_image,
    scale: 750,
    region: country.geometry().bounds(),
    description: cf_cvg_name,
  });

};

// Extract VIIRS ============================================================================
extract_viirs_country_time_stacked('Rwanda', '2012-04-01', '2019-01-31','gee_extracts', 'rwanda_viirs_monthly');

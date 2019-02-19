// =============================================================
// Extract VIIRS to Country
// =============================================================

// =============================================================
// Function to Extract VIIRS Annual Average Data
var extract_viirs = function(begin_date,
                             end_date,
                             country_name,
                             reduce_type,
                             file_name,
                             google_drive_folder){
  // Extracts and summarizes VIIRS data for a specific daterange

  // Args:
  //   begin_date: Beginning data for VIIRS image.
  //   end_date: End date for VIIRS image.
  //   country_name: Country to export
  //   reduce_type: How to reduce/summarize data ("median","mean" or "max")
  //   file_name: Name to call exported image
  //   google_drive_folder: Name of folder to export image

  // Get country feature
  var countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
  var country = countries.filter(ee.Filter.eq('Country', country_name));

  // Load VIIRS ImageCollection and filter by date
  var image = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG');
  image = ee.ImageCollection(
    image.filterDate(begin_date,end_date)
  );

  // Reduce images in image collection; select only radiance band
  if(reduce_type == "median"){
    image = image.reduce(ee.Reducer.median());
    image = image.select('avg_rad_median');
  }

  if(reduce_type == "mean"){
    image = image.reduce(ee.Reducer.mean());
    image = image.select('avg_rad_mean');
  }

  if(reduce_type == "max"){
    image = image.reduce(ee.Reducer.max());
    image = image.select('avg_rad_max');
  }

  // Clip to country and export image to google drive
  image = image.clip(country);

  Export.image.toDrive({
    folder: google_drive_folder,
    image: image,
    scale: 750,
    region: country,
    description: file_name,
  });

  return image;

};

// =============================================================
// Export VIIRS Data to Google Drive
var rwa_viirs_2015 = extract_viirs('2015-01-01','2015-12-31','Rwanda','median','rwa_viirs_median_2015','gee_extracts');
var rwa_viirs_2018 = extract_viirs('2018-01-01','2018-12-31','Rwanda','median','rwa_viirs_median_2018','gee_extracts');

// =============================================================
// Map a Couple Images to Check How they Look
Map.addLayer(rwa_viirs_2015, {}, '2015');
Map.addLayer(rwa_viirs_2018, {}, '2018');

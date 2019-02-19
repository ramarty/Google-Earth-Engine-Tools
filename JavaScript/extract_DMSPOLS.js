// =============================================================
// Extract DMSP OLS to Country
// =============================================================

// =============================================================
// Function to Extract VIIRS Annual Average Data
var extract_dmspols = function(begin_date,
                             end_date,
                             country_name,
                             reduce_type,
                             file_name,
                             google_drive_folder){
  // Extracts Annual DMSPOLS dData

  // Args:
  //   begin_date: Beginning data for VIIRS image.
  //   end_date: End date for VIIRS image.
  //   country_name: Country to export
  //   reduce_type: How to reduce/summarize data ("median","mean" or "max")
  //   file_name: Name to call exported image
  //   google_drive_folder: Name of folder to export image

  // Get country feature
  var countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
  var country = countries.filter(ee.Filter.eq('Country', country_name)).geometry();

  // Load VIIRS ImageCollection and filter by date
  var image = ee.ImageCollection('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS');
  image = ee.ImageCollection(
    image.filterDate(begin_date,end_date)
  );

  // Reduce images in image collection; select only radiance band
  if(reduce_type == "median"){
    image = image.reduce(ee.Reducer.median());
    image = image.select('stable_lights_median');
  }

  if(reduce_type == "mean"){
    image = image.reduce(ee.Reducer.mean());
    image = image.select('stable_lights_mean');
  }

  if(reduce_type == "max"){
    image = image.reduce(ee.Reducer.max());
    image = image.select('stable_lights_max');
  }

  // Clip to country and export image to google drive
  image = image.clip(country);

  Export.image.toDrive({
    folder: google_drive_folder,
    image: image,
    scale: 1000,
    region: country.bounds(),
    description: file_name,
  });

  return image;

};

// =============================================================
// Export VIIRS Data to Google Drive
var dmspols_1992 = extract_dmspols('1992-01-01','1992-12-31','Rwanda','mean','rwanda_dmspols_1992','gee_extracts');
var dmspols_2000 = extract_dmspols('2000-01-01','2000-12-31','Rwanda','mean','rwanda_dmspols_2000','gee_extracts');

// =============================================================
// Map a Images to Check How they Look
var Viz = {min: 1, max: 63, palette: ['000000', 'FFFF00'], opacity: 1};
Map.addLayer(dmspols_1992, Viz, '1992');
Map.addLayer(dmspols_2000, Viz, '2000');

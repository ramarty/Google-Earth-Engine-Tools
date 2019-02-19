// =============================================================
// NDVI for a Country Within a Certain Time Period
// =============================================================

// ==============================================================
// Create Function
var extract_NDVI_l8 = function(begin, end, countryname, cloud_cover_filter, filename, google_drive_folder_name){
  // Extracts NDVI Data for Specific Daterange from Landsat

  // Args:
  //   begin: Beginning data for VIIRS image.
  //   end: End date for VIIRS image.
  //   countryname: Country to export
  //   cloud_cover_filter: Ignore images with greater than ##% cloud cover
  //   filename: Name to call exported image
  //   google_drive_folder: Name of folder to export image

  // Import Country Data
  var countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
  var country = countries.filter(ee.Filter.eq('Country', countryname));

  // Import Image Collection
  var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');

  var l8_filter = ee.ImageCollection(
          l8.filterBounds(country)
            .filterDate(begin, end)
            .filter(ee.Filter.lt('CLOUD_COVER', cloud_cover_filter))
        );

  var l8_median = l8_filter.reduce(ee.Reducer.median());

  var ndvi_median = l8_median.expression(
      '(B5 - B4) / (B5 + B4)', {
        'B4': l8_median.select('B4_median'),
        'B5': l8_median.select('B5_median')
  });

  var ndvi_median_country = ndvi_median.clip(country);

  Export.image.toDrive({
    folder: google_drive_folder_name,
    image: ndvi_median_country,
    scale: 30,
    region: country,
    description: filename,
  });

  return ndvi_median_country;

};

// Example ========================================================================
var ndvi_rwanda_20130701_20130831 = extract_NDVI_l8('2013-07-01', '2013-08-31', 'Rwanda', 50, 'ndvi_2013_seasonC', 'gee_extracts');
Map.addLayer(ndvi_rwanda_20130701_20130831, {}, '2013');

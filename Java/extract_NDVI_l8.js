// =============================================================
// NDVI for a Country Within a Certain Time Period
// =============================================================

// ==============================================================
// Create Function
var getndvi = function(begin, end, cloud_cover_filter, filename, countryname){
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
    folder: "gee_extracts",
    image: ndvi_median_country,
    scale: 30,
    region: country,
    description: filename,
  });
  
  return ndvi_median_country;

};

// Create NDVI Variables and Export ========================================
var ndvi_2013_C = getndvi('2013-07-01', '2013-08-31', 50, 'ndvi_2013_C', 'Rwanda');

var ndvi_2014_A = getndvi('2013-09-01', '2014-02-28', 50, 'ndvi_2014_A', 'Rwanda');
var ndvi_2014_B = getndvi('2014-03-01', '2014-06-30', 50, 'ndvi_2014_B', 'Rwanda');
var ndvi_2014_C = getndvi('2014-07-01', '2014-08-31', 50, 'ndvi_2014_C', 'Rwanda');

var ndvi_2015_A = getndvi('2014-09-01', '2015-02-28', 50, 'ndvi_2015_A', 'Rwanda');
var ndvi_2015_B = getndvi('2015-03-01', '2015-06-30', 50, 'ndvi_2015_B', 'Rwanda');
var ndvi_2015_C = getndvi('2015-07-01', '2015-08-31', 50, 'ndvi_2015_C', 'Rwanda');

var ndvi_2016_A = getndvi('2015-09-01', '2016-02-28', 50, 'ndvi_2016_A', 'Rwanda');
var ndvi_2016_B = getndvi('2016-03-01', '2016-06-30', 50, 'ndvi_2016_B', 'Rwanda');
var ndvi_2016_C = getndvi('2016-07-01', '2016-08-31', 50, 'ndvi_2016_C', 'Rwanda');

var ndvi_2017_A = getndvi('2016-09-01', '2017-02-28', 50, 'ndvi_2017_A', 'Rwanda');
var ndvi_2017_B = getndvi('2017-03-01', '2017-06-30', 50, 'ndvi_2017_B', 'Rwanda');
var ndvi_2017_C = getndvi('2017-07-01', '2017-08-31', 50, 'ndvi_2017_C', 'Rwanda');

var ndvi_2018_A = getndvi('2017-09-01', '2018-02-28', 50, 'ndvi_2018_A', 'Rwanda');
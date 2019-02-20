# Python Code

Contains functions for downloading data from GEE using python.

## Installation

    import requests
    exec(requests.get('https://raw.githubusercontent.com/ramarty/Google-Earth-Engine-Tools/master/Python/gee_functions.py').text)

## Functions

**download_image_aggregate** *(image_type, country, begin_date, end_date, reduce_type, directory, name, cloud_cover_filter)*

Downloads a .tif file of satellite image. If multiple images across time, aggregates images into one image using either mean, median or max.

- *image_type:* Image source and type (options: viirs, dmspols, modis_ndvi, modis_evi, l8_ndvi).
- *country:* Name of Country (e.g., 'Rwanda')
- *begin_date:* Begin date of images
- *end_date:* End date of images
- *reduce_type:* Reduce type of images ('mean', 'median' or 'max')
- *directory:* Directory where to save new tile
- *name:* Name of new file (e.g., 'new_raster.tif')
- *cloud_cover_filter:* Removes images with a cloud cover greater than percent (default = 50). (Only used for landsat images)

Examples:

    download_image_aggregate("viirs", "Rwanda", "2015-01-01", "2015-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_viirs_2015.tif')
    download_image_aggregate("modis_evi", "Rwanda", "2010-01-01", "2010-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_modis_evi_2010.tif')
    download_image_aggregate("l8_ndvi", "Rwanda", "2018-01-01", "2018-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_l8_ndvi_2018.tif')

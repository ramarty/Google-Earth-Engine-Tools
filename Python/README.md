# Python Code

`gee_functions.py` contains functions for working with GEE in python.

**download_image_aggregate** *(image_type, country, begin_date, end_date, reduce_type, directory, name, cloud_cover_filter)*

Downloads a .tif file of satellite image. I multiple images across time, aggregates images into one image.

- *image_type:* Image source and type (options: viirs, dmspols, modis_ndvi, modis_evi, l8_ndvi)
- *country:* Name of Country (e.g., 'Rwanda')
- *begin_date:* Begin date of images
- *end_date:* End date of images
- *reduce_type:* Reduce type of images ('mean', 'median' or 'max')
- *directory:* Directory where to save new tile
- *name:* Name of new file (e.g., 'new_raster.tif')
- *cloud_cover_filter:* Removes images with a cloud cover greater than percent (default = 50)

Examples:

    download_image_aggregate("viirs", "Rwanda", "2015-01-01", "2015-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_viirs_2015.tif')
    download_image_aggregate("modis_evi", "Rwanda", "2010-01-01", "2010-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_modis_evi_2010.tif')
    download_image_aggregate("l8_ndvi", "Rwanda", "2018-01-01", "2018-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_l8_ndvi_2018.tif')

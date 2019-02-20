# Python Code

`gee_functions.py` contains functions for working with GEE in python.

**download_viirs(country, begin_date, end_date, reduce_type, directory, name)**
Downloads a .tif file of nighttime lights from VIIRS. Aggregates monthly tiles over selected date range.

- *country:* Name of Country (e.g., 'Rwanda')
- *begin_date:* Begin date of images
- *end_date:* End date of images
- *reduce_type:* Reduce type of images ('mean', 'median' or 'max')
- *directory:* Directory where to save new tile
- *name:* Name of new file (e.g., 'new_raster.tif')

Example:
`download_viirs('Rwanda', '2015-01-01', 2015-12-31, 'median', 'Users/myname/Desktop/', 'viirs_rwa_2015_median.tif')`

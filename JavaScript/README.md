# JavaScript Code

This folder contains code to run in GEE's code editor.

**Functions To Download Data.** Exports raster data to .tif files to a folder in your google drive.
- **extract_NDVI_landsat_l8:** Extracts NDVI from Landsat 8 for a specified country and time period.
- **extract_NDVI_modis_monthly:** Extracts NDVI from MODIS for a specified country and year. Creates a raster with 12 bands, one for each month.
- **extract_DMSPOLS:** Extracts Nighttime Lights from DMSP-OLS for a specified country and year.
- **extract_VIIRS:** Extracts Nighttime Lights from VIIRS for a specified country and time period.
- **extract_VIIRS_monthly:** Extracts Nighttime Lights from VIIRS for a specified country and time period. Creates a raster with multiple bands, one band per month.

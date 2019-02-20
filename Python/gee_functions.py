import ee
import webbrowser
import glob
import os
import time
import zipfile
ee.Initialize()

# https://stackoverflow.com/questions/35851281/python-finding-the-users-downloads-folder
def get_download_path():
    """Returns the default downloads path for linux or windows"""
    if os.name == 'nt':
        import winreg
        sub_key = r'SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders'
        downloads_guid = '{374DE290-123F-4565-9164-39C4925E467B}'
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, sub_key) as key:
            location = winreg.QueryValueEx(key, downloads_guid)[0]
        return location
    else:
        return os.path.join(os.path.expanduser('~'), 'downloads')

def download_image_aggregate(image_type, country, begin_date, end_date, reduce_type, directory, name, resolution = 'Original', cloud_cover_filter=50):
    """Downloads VIIRS Image for a Country"""

    directory = os.path.abspath(directory)

    # Grab Country -------------------------------------------------------------
    countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
    country = countries.filter(ee.Filter.eq('Country', country));

    # Grab and Proccess Image --------------------------------------------------
    # Grab image and select bands
    if(image_type == "viirs"):
        image = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
        image = image.select('avg_rad')
        scale = 750

    if(image_type == "dmspols"):
        image = ee.ImageCollection('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS')
        image = image.select('stable_lights')
        scale = 1000

    if(image_type == "modis_ndvi"):
        image = ee.ImageCollection('MODIS/006/MOD13Q1')
        image = image.select('NDVI')
        scale = 250

    if(image_type == "modis_evi"):
        image = ee.ImageCollection('MODIS/006/MOD13Q1')
        image = image.select('EVI')
        scale = 250

    if(image_type == "l8_ndvi"):
        image = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');
        image = ee.ImageCollection(image.filter(ee.Filter.lt('CLOUD_COVER', cloud_cover_filter)))
        scale = 30

    # Filter by dates
    image = ee.ImageCollection(image.filterDate(begin_date,end_date))

    # Reduce images in image collection
    if(reduce_type == "median"):
        image = image.reduce(ee.Reducer.median())
        #image = image.select('avg_rad_median')

    if(reduce_type == "mean"):
        image = image.reduce(ee.Reducer.mean())
        #image = image.select('avg_rad_mean')

    if(reduce_type == "max"):
        image = image.reduce(ee.Reducer.max())
        #image = image.select('avg_rad_max')

    # If landsat or sentinel, need to compute indices
    if(image_type == "l8_ndvi"):
        image = image.expression('float(b("B5_'+reduce_type+'") - b("B4_'+reduce_type+'")) / (b("B5_'+reduce_type+'") + b("B4_'+reduce_type+'"))')

    # Clip to country
    image = image.clip(country)

    if resolution == 'Original':
        resolution = scale

    # Download Image -----------------------------------------------------------
    path = image.getDownloadUrl({
        'scale': resolution,
        'crs': 'EPSG:4326',
        'region': country.geometry().getInfo()['coordinates']
    })

    # Initial Files List
    files_initial = glob.glob(get_download_path() + "/*.zip")
    length_files_initial = len(files_initial)

    # Download file and wait until downloads
    implement_download = False
    while(len(glob.glob(get_download_path() + "/*.zip")) == len(files_initial)):
        if implement_download == False:
            webbrowser.open(path)
            implement_download = True

        print("Waiting for File to Download ...")
        time.sleep(2)

    files_after = glob.glob(get_download_path() + "/*.zip")
    zip_file = list(set(files_after) - set(files_initial))

    # Rename and Send Files to Folder
    dir_files_initial = glob.glob(directory + "/*")

    zip_ref = zipfile.ZipFile(zip_file[0], 'r')
    zip_ref.extractall(directory)
    zip_ref.close()

    dir_files_after = glob.glob(directory + "/*")

    extracted_files = list(set(dir_files_after) - set(dir_files_initial))

    # Delete .tfw file
    os.remove(extracted_files[0])

    # Rename .tif file
    os.rename(extracted_files[1], os.path.abspath(directory + "/" + name))

    # Delete zip file
    os.remove(zip_file[0])

    print("Done! File saved to: " + os.path.abspath(directory + "/" + name))

# Examples
#download_image_aggregate("viirs", "Rwanda", "2015-01-01", "2015-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_viirs_2015.tif')
#download_image_aggregate("modis_evi", "Rwanda", "2010-01-01", "2010-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_mevi_2015.tif')
#download_image_aggregate("l8_ndvi", "Rwanda", "2018-01-01", "2018-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_l8_ndvi_2018_v9.tif', 100)

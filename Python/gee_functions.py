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

def download_viirs(country, begin_date, end_date, reduce_type, directory, name):
    """Downloads VIIRS Image for a Country"""

    directory = os.path.abspath(directory)

    # Grab Country
    countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
    country = countries.filter(ee.Filter.eq('Country', country));

    # Grab image, filter by date and country. Take median value across bands
    image = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
    image = ee.ImageCollection(image.filterDate(begin_date,end_date))

    # Reduce images in image collection; select only radiance band
    if(reduce_type == "median"):
        image = image.reduce(ee.Reducer.median())
        image = image.select('avg_rad_median')

    if(reduce_type == "mean"):
        image = image.reduce(ee.Reducer.mean())
        image = image.select('avg_rad_mean')

    if(reduce_type == "max"):
        image = image.reduce(ee.Reducer.max())
        image = image.select('avg_rad_max')

    # Clip to country
    image = image.clip(country)

    path = image.getDownloadUrl({
        'scale': 30,
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
    zip_file[0]

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

    print("Done! File saved to: " + os.path.abspath(directory + "/" + name))

download_viirs("Rwanda", "2015-01-01", "2015-12-31", "mean", "/Users/robmarty/Desktop/test", 'rwa_viirs_2015.tif')

# Google-Earth-Engine-Downloader

Code for downloading images from Google Earth Engine (GEE) for a specific country and time period. The **JavaScript** folder contains code to run in the GEE code editor; the **Python** folder contains code to run in Python.

The scripts download .tif files of images. The JavaScript code uploads the files to a folder in google drive, while the Python code downloads the file locally to a user-specified directory.

## Installation for Python code

    import requests
    exec(requests.get('https://raw.githubusercontent.com/ramarty/Google-Earth-Engine-Tools/master/Python/gee_functions.py').text)

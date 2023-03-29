import json
import pandas as pd
import numpy as np
import openpyxl
import boto3
import io
import logging
import os
import re
import urllib.request

# API objects
s3 = boto3.resource('s3')
ddb = boto3.client('dynamodb')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Hold the global variables used for each fuction
valid = True
error_messages = [] # The list of error messages to be returned
# Hold the current year
set_year = -1
# Hold each regex function
regex_code = r'^[A-Za-z0-9]{1,10}$'
regex_id = r'^[a-zA-Z0-9 ]{1,10}$'
regex_text = r'^[a-zA-Z0-9&@.,#%\-_|\/\'\(\)\s]{1,100}$'
regex_date = r'^\d{4}-\d{2}-\d{2}$'
regex_postzip = r'^(\d{5}|[A-Z][0-9][A-Z][0-9][A-Z][0-9]|[A-Z][0-9][A-Z] [0-9][A-Z][0-9])$'
regex_number = r'^\d+$'
regex_specify = r'^((Y|y)(E|e)(S|s)|(N|n)(O|o)|(P|p)lease (S|s)pecify)$'
regex_year = r'^\d{4}$'
regex_decimal = r'^(\d+)(\.?)(\d*)$'
regex_unit_volume_energy_short = r'^(gal \(US\)|L|scf|ccf|m3|mmBtu|therm|kWh|.)$'
regex_unit_volume_vehicle = r'^(gal \(US\)|L|scf|ccf|m3|.)$'
regex_unit_serviced = r'^(metric ton|kg|lb|.)$'
regex_purchased_energy_type = r'^(Electricity|Purchased heat  \/ steam|Purchased heat \(assumed natural gas\)|Chilled water|.)$'
regex_unit_consumption = r'^(Btu|mmBtu|therm|kWh|MWh|GJ|.)$'



# Function to convert column index num to char
def toChar(col):
    # Get the remainder
    remainder = int(col/26)
    text = "" # Return text
    if(remainder>0): 
        text += chr(remainder + 64)
    text += chr(col - (26*remainder) + 65)
    return text

# Function to check if a string is valid
def isValid(text, regex):
    try:
        # Use the regex and return
        return re.search(regex, text)
    except:
        # If there is an expection, try a list of options
        # First, if the regex is for a date
        if(regex == regex_date):
            # Try to preform the function with the value converted to the correct format
            try:
                # Use the regex and return
                return re.search(regex, str(text)[:10])
            except:
                addError("Unexpected error in format of dates: "+str(text))
        # Next, if the regex is for a number
        elif(regex == regex_number):
            # Try to preform the function with the value converted to the correct format
            try:
                # Use the regex and return
                return re.search(regex, str(text))
            except:
                addError("Unexpected error in format of numeric: "+str(text))
        # Next, if the regex is for a year
        elif(regex == regex_year):
            # Try to preform the function with the value converted to the correct format
            try:
                # Use the regex and return
                return re.search(regex, str(text))
            except:
                addError("Unexpected error in format of year: "+str(text))
        elif(regex == regex_decimal):
            # Try to preform the function with the value converted to the correct format
            try:
                # Use the regex and return
                return re.search(regex, str(text))
            except:
                addError("Unexpected error in format of decimal: "+str(text))
        elif(regex == regex_postzip):
            # Try to preform the function with the value converted to the correct format
            try:
                # Use the regex and return
                return re.search(regex, str(text))
            except:
                addError("Unexpected error in format of postal or zip code: "+str(text))
        else:
            # At this point, the value is not compatible with regex
            # Send an error and return false
            addError("Unexpected error in format of value: "+str(text))

# Add an error message
def addError(message="Template has been altered.", page='File'):
    # Set the file as invalid
    global valid
    valid = False
    # And add the error message
    error_messages.append("ERROR: "+page+": "+message)

# Add an warning message
def addWarning(message, page):
    # And add the warning message
    error_messages.append("WARNING: "+page+": "+message)

def getParsedPage(excel, page):
    # Try to parse of the excel file
    try:
        # Return a successfully parsed page
        return( excel.parse(page) )
    except:
        # If the page is not found the file has been changed
        addError("Page not found.", page)
        # Then return with an empty set
        return

# Upon valid year formatting, check if the year is in the list
def checkYear(year, page_name, row, col):
    global set_year
    # First check if the current year has been set
    if(set_year == -1):
        # Then set the newly uploaded year to the first year
        set_year = year
    # Check if the attempted year matches the set year
    elif(set_year != year):
        # Send an error message
        addError("("+str(row)+":"+toChar(col)+") Year must be consistent between all entries" , page_name)
    # Otherwise the year is ok

# Check if an np row is nan
def isArrNan(arr):
    return all(isNan(a) for a in arr)

def isNan(val):
    return pd.isnull(val)






# Function to check the validity of the facility
def checkFacility(excel):
    pageName = "Facility Info"
    # First get the data of the facility page
    page = getParsedPage(excel, pageName)

    # Transform the page to an array or arrays [[row], ... , [row]]
    data = page.to_numpy()

    # Ensure that the size of the page
    if(len(data) <= 0 or len(data[0]) != 34):
        # Send an error and quit
        addError("Template has been altered.", pageName)
        return
    
    # Hold an array of facilites
    facilityIDs = []
    facility_count = 0
    # Next parse through and find the location of 'unique facility ID'
    row = -1 # Hold the row index
    # Next find the facility unique ID title
    for i in range(len(data)):
        # If the first row contains the string 'Facility unique ID'
        if(data[i][0] == 'Facility unique ID'):
            row = i
            break
    # Check if the key was found
    if(row == -1): 
        addError("Template has been altered.", pageName)
        return
    
    # create a row counter for all facilities
    all_facil_index = -1
    # Using the index of the key, check all future rows until All facilities is found
    for i in range(row+1, len(data)):
        # First check if this is the all facilites row
        if(data[i][0] == 'All facilities'):
            # Set the row and break
            all_facil_index = i
            break
        else:
            # First check if the row is not empty
            if not isArrNan(data[i]):
                # Add to the count
                facility_count+=1
                col = 0
                # Check the validity of the row one column at a time

                # Col A: Unique ID
                id = data[i][col]
                # Check if the id is valid regex
                if(not isNan(id) and isValid(id, regex_id)):
                    # Check if the name is already present in the list
                    if id in facilityIDs:
                        # Send an error
                        addError("("+str(i+2)+":"+toChar(col)+") Facility ID not unique.", pageName)
                    else:
                        # Add the id to the list of ids
                        facilityIDs.append(id)
                # Otherwise: return an error for incompatible formatting
                else:
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Facilty ID format. May only contain numbers letters and spaces and be length [1-10]", pageName)

                # Col B: Optional Facility ID
                col = 1
                # Check if the id is valid regex or nan
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Facilty Name format. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col C: Country Required
                col = 2
                if(isNan(data[i][col]) or not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Country required. Valid country code must be used", pageName)

                # Col D: Optional Adress
                col = 3
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Address formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col E: Optional City
                col = 4
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid City formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col F: Optional State
                col = 5
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid State Province formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col G: Reccomended Zip Code
                col = 6
                # If the zip is not present give warning
                if(isNan(data[i][col])):
                    addWarning("("+str(i+2)+":"+toChar(col)+") Zip/Postal Code recommended.", pageName)
                elif(not isValid(data[i][col], regex_postzip)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Zip/Postal Code formatting. Must be valid postal or zip code.", pageName)

                # Col H: Optional Facility Type
                col = 7
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Facility Type formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col I: Optional Owned Leased
                col = 8
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Owned Leased formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col J: Optional Opening date
                col = 9
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_date)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Opening Date formatting. Must be formatted YYYY-MM-DD", pageName)

                # Col K: Optional Closing date
                col = 10
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_date)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Closing Date formatting. Must be formatted YYYY-MM-DD", pageName)

                # Col L: Optional comments
                col = 11
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Comments formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col M: Required Floor area
                col = 12
                if(isNan(data[i][col]) or not isValid(data[i][col], regex_number)):
                    addError("("+str(i+2)+":"+toChar(col)+") Required Floor Area. Must be numeric with no decimals, commas, or spaces", pageName)

                # Col N: Required Headcount
                col = 13
                if(isNan(data[i][col]) or not isValid(data[i][col], regex_number)):
                    addError("("+str(i+2)+":"+toChar(col)+") Required Headcount. Must be numeric with no decimals, commas, or spaces", pageName)

                # Col O: Optional Electricity
                col = 14
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Electricity formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col P: Optional Purchased Heat Steam
                col = 15
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Purchased Heat Steam formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col Q: Optional Chilled Water
                col = 16
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Chilled Water formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col R: Optional Refridgerants
                col = 17
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Refridgerants formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col S: Optional Refridgerant Type
                col = 18
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Refridgerant Type formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col T: Optional Refridgerant Type
                col = 19
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Refridgerant Type formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col U: Optional Natural Gas
                col = 20
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Natural Gas formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col V: Optional Gasoline
                col = 21
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Gasoline formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col W: Optional Diesel Fuel
                col = 22
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Diesel Fuel formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col X: Optional LPG Propane
                col = 23
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid LPG Propane formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col Y: Optional Residual Fuel Oil
                col = 24
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Residual Fuel Oil formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col Z: Optional Landfill Gas
                col = 25
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Landfill Gas formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col AA: Optional Other Biomass Gases
                col = 26
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Other Biomass Gases formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col AB: Optional Biodiesel 100%
                col = 27
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Biodiesel 100 formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col AC: Optional Ethanol 100%
                col = 28
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Ethanol 100 formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col AD: Optional Kerosene
                col = 29
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Kerosene formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col AE: Optional Other Fuel Sources
                col = 30
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Other Fuel Sources formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

                # Col AF: Optional Motor Gasoline - Mobile
                col = 31
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Motor Gasoline - Mobile formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col AG: Optional Diesel Fuel - Mobile
                col = 32
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_specify)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Diesel Fuel - Mobile formatting. May only contain \"Yes\", \"No\", or \"Please specify\"", pageName)

                # Col AH: Optional Other Fuel Sources
                col = 33
                if(not isNan(data[i][col]) and not isValid(data[i][col], regex_text)):
                    addError("("+str(i+2)+":"+toChar(col)+") Invalid Other Fuel Sources formatting. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

    # Finish by checking if there are no facilites
    if(facility_count <= 0): 
        addError("No facility data present.", pageName)
    # Next check if there is a the 'All Facilites'
    if(all_facil_index == -1): 
        addError("All facilities data not present.", pageName)

    # Then return 
    return


# Function to check the Scope 1 Stationary Page
def checkScope1Stationary(excel):
    pageName = "Scope 1 - Stationary"
    row_diff = 2
    # First get the data of the facility page
    page = getParsedPage(excel, pageName)

    # Try to Transform the excel file
    data = []
    try:
        # Transform the page to an array or arrays [[row], ... , [row]]
        data = page.to_numpy()
    except:
        # If the page is not found the file has been changed
        addError("Page corrupted, cannot be parsed.", pageName)
        # Then return with an empty set
        return

    # Ensure that the size of the page
    if(len(data) <= 0 or len(data[0]) != 9):
        # Send an error and quit
        addError("Template has been altered.", pageName)
        return
    
    # Next parse through and find the location of 'Facility unique ID'
    fuID_index = -1 # Hold the row index
    # Next find the facility unique ID title
    for row in range(len(data)):
        # If the first row contains the string 'Facility unique ID'
        if(data[row][0] == 'Facility unique ID'):
            fuID_index = row
            break
    # Check if the key was found
    if(fuID_index == -1): 
        addError("Template has been altered.", pageName)
        return
    
    # At this point the files format is assumed correct
    for row in range(fuID_index+1, len(data)):
        # First check if the row is not empty
        if not isArrNan(data[row]):
            # Check the validity of the row one column at a time
            # Col A: Required Facility ID
            col = 0
            # Check if the id is valid regex and not nan
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_id)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Facilty ID required. May only contain numbers letters and spaces and be length [1-10]", pageName)

            # Col B: Required Country
            col = 1
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Country required. Valid country code must be used", pageName)

            # Col C: Required Year
            col = 2
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_year)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Year required. Must be formatted YYYY", pageName)
            else:
                # Otherwise the formatting of the year is valid, check for year consistent
                checkYear(data[row][col], pageName, row+row_diff,col)

            # Col D: Optional Start Date
            col = 3
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_date)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Start Date format. Must be formatted YYYY-MM-DD", pageName)

            # Col E: Optional End Date
            col = 4
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_date)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid End Date format. Must be formatted YYYY-MM-DD", pageName)

            # Col F: Required Fuel Type
            col = 5
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Fuel Type required. Must be valid fuel type", pageName)

            # Col G: Required Fuel Consumption
            col = 6
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_number)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Fuel Consumption required. Must be numeric with no decimals, commas, or spaces", pageName)

            # Col H: Required Unit
            col = 7
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_unit_volume_energy_short)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Unit required. Must be valid unit", pageName)

            # Col I: Optional Comments
            col = 8
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Comments format. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)


# Function for scope 1 Mobile
def checkScope1Mobile(excel):
    pageName = "Scope 1 - Mobile"
    row_diff = 2
    # First get the data of the facility page
    page = getParsedPage(excel, pageName)

    # Try to Transform the excel file
    data = []
    try:
        # Transform the page to an array or arrays [[row], ... , [row]]
        data = page.to_numpy()
    except:
        # If the page is not found the file has been changed
        addError("Page corrupted, cannot be parsed.", pageName)
        # Then return with an empty set
        return

    # Ensure that the size of the page
    if(len(data) <= 0 or len(data[0]) != 18):
        # Send an error and quit
        addError("Template has been altered.", pageName)
        return
    
    # Next parse through and find the location of 'Facility unique ID'
    fuID_index = -1 # Hold the row index
    # Next find the facility unique ID title
    for row in range(len(data)):
        # If the first row contains the string 'Facility unique ID'
        if(data[row][0] == 'Facility unique ID'):
            fuID_index = row
            break
    # Check if the key was found
    if(fuID_index == -1): 
        addError("Template has been altered.", pageName)
        return
    
    # At this point the files format is assumed correct
    for row in range(fuID_index+1, len(data)):
        # First check if the row is not empty
        if not isArrNan(data[row]):
            # Check the validity of the row one column at a time
            # Col A: Required Facility ID
            col = 0
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_id)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Facilty ID required. May only contain numbers letters and spaces and be length [1-10]", pageName)

            # Col B: Required Country
            col = 1
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Country required. Valid country code must be used", pageName)

            # Col C: Required Year
            col = 2
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_year)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Year required. Must be formatted YYYY", pageName)
            else:
                # Otherwise the formatting of the year is valid, check for year consistent
                checkYear(data[row][col], pageName, row+row_diff,col)

            # Col D: Optional Start Date
            col = 3
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_date)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Start Date format. Must be formatted YYYY-MM-DD", pageName)

            # Col E: Optional End Date
            col = 4
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_date)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid End Date format. Must be formatted YYYY-MM-DD", pageName)

            # Col F: Required Data Type
            col = 5
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Data Type required. Must be valid data type", pageName)

            # Col G: Required Fuel Type
            col = 6
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Fuel Type required. Must be valid fuel type", pageName)

            # Col H: Required Vehicle Type
            col = 7
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Vehicle Type required. Must be valid vehicle type", pageName)

            # Col I: Optional Vehicle Make
            col = 8
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Vehicle Make format. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

            # Col J: Optional Vehicle Model
            col = 9
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Vehicle Model format. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

            # Col K: Optional Vehicle Year
            col = 10
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_year)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Vehicle Year format. Must be formatted YYYY", pageName)

            # Col L: Optional Fuel Consumption
            col = 11
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_number)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Fuel Consumption format. Must be numeric with no decimals, commas, or spaces", pageName)

            # Col M: Optional Fuel Units
            col = 12
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_unit_volume_vehicle)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Fuel Units format. Must be valid unit", pageName)

            # Col N: Optional Distance Travelled
            col = 13
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_number)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Distance Travelled format. Must be numeric with no decimals, commas, or spaces", pageName)

            # Col O: Optional Distance Unit
            col = 14
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Distance Unit format. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

            # Col P: Optional Fuel Efficiency
            col = 15
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_decimal)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Fuel Efficiency format. Must be valid postitive number", pageName)

            # Col Q: Optional Fuel Efficiency Unit
            col = 16
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Fuel Efficiency Unit format. Must be valid unit", pageName)

            # Col R: Optional Comments
            col = 17
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Comments format. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)


# Function for Scope 1 Fugitives
def checkScope1Fugitives(excel):
    pageName = "Scope 1 - Fugitives"
    row_diff = 2
    # First get the data of the facility page
    page = getParsedPage(excel, pageName)

    # Try to Transform the excel file
    data = []
    try:
        # Transform the page to an array or arrays [[row], ... , [row]]
        data = page.to_numpy()
    except:
        # If the page is not found the file has been changed
        addError("Page corrupted, cannot be parsed.", pageName)
        # Then return with an empty set
        return

    # Ensure that the size of the page
    if(len(data) <= 0 or len(data[0]) != 14):
        # Send an error and quit
        addError("Template has been altered.", pageName)
        return
    
    # Next parse through and find the location of 'Facility unique ID'
    fuID_index = -1 # Hold the row index
    # Next find the facility unique ID title
    for row in range(len(data)):
        # If the first row contains the string 'Facility unique ID'
        if(data[row][0] == 'Facility unique ID'):
            fuID_index = row
            break
    # Check if the key was found
    if(fuID_index == -1): 
        addError("Template has been altered.", pageName)
        return
    
    # At this point the files format is assumed correct
    for row in range(fuID_index+1, len(data)):
        # First check if the row is not empty
        if not isArrNan(data[row]):
            # Check the validity of the row one column at a time
            # Col A: Required Facility ID
            col = 0
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_id)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Facilty ID required. May only contain numbers letters and spaces and be length [1-10]", pageName)

            # Col B: Required Country
            col = 1
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Country required. Valid country code must be used", pageName)

            # Col C: Required Year
            col = 2
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_year)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Year required. Must be formatted YYYY", pageName)
            else:
                # Otherwise the formatting of the year is valid, check for year consistent
                checkYear(data[row][col], pageName, row+row_diff,col)

            # Col D: Optional Start Date
            col = 3
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_date)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Start Date format. Must be formatted YYYY-MM-DD", pageName)

            # Col E: Optional End Date
            col = 4
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_date)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid End Date format. Must be formatted YYYY-MM-DD", pageName)

            # Col F: Required Refridgerant Type
            col = 5
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Refridgerant Type required. Valid Refridgerant Type must be used", pageName)

            # Col G: Required Quantity Serviced
            col = 6
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_number)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Quantity Serviced required. Must be numeric with no decimals, commas, or spaces", pageName)

            # Col H: Required Unit
            col = 7
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_unit_serviced)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Unit required. Must be valid unit", pageName)

            # Col I: Optional Quantity Recycled
            col = 8
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_number)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Quantity Recycled format. Must be numeric with no decimals, commas, or spaces", pageName)

            # Col J: Optional Unit of Recycled
            col = 9
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_unit_serviced)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Unit of Quantity Recycled format. Must be valid unit", pageName)

            # Col K: Optional Equipment Type
            col = 10
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Equipment Type format. Valid Equipment Type must be used", pageName)

            # Col L: Optional Equipment Charge Size
            col = 11
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_number)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Equipment Charge Size format. Must be numeric with no decimals, commas, or spaces", pageName)

            # Col M: Optional Equipment Charge Size Unit
            col = 12
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_unit_serviced)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Equipment Charge Size Unit format. Must be valid unit", pageName)

            # Col N: Optional Comments
            col = 13
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Comments format. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)


def checkScope2PurchasedEnergy(excel):
    pageName = "Scope 2 - Purchased Energy"
    row_diff = 2
    # First get the data of the facility page
    page = getParsedPage(excel, pageName)

    # Try to Transform the excel file
    data = []
    try:
        # Transform the page to an array or arrays [[row], ... , [row]]
        data = page.to_numpy()
    except:
        # If the page is not found the file has been changed
        addError("Page corrupted, cannot be parsed.", pageName)
        # Then return with an empty set
        return

    # Ensure that the size of the page
    if(len(data) <= 0 or len(data[0]) != 11):
        # Send an error and quit
        addError("Template has been altered.", pageName)
        return
    
    # Next parse through and find the location of 'Facility unique ID'
    fuID_index = -1 # Hold the row index
    # Next find the facility unique ID title
    for row in range(len(data)):
        # If the first row contains the string 'Facility unique ID'
        if(data[row][0] == 'Facility unique ID'):
            fuID_index = row
            break
    # Check if the key was found
    if(fuID_index == -1): 
        addError("Template has been altered.", pageName)
        return
    
    # At this point the files format is assumed correct
    for row in range(fuID_index+1, len(data)):
        # First check if the row is not empty
        if not isArrNan(data[row]):
            # Check the validity of the row one column at a time
            # Col A: Required Facility ID
            col = 0
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_id)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Facilty ID required. May only contain numbers letters and spaces and be length [1-10]", pageName)

            # Col B: Required Country
            col = 1
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Country required. Valid country code must be used", pageName)

            # Col C: Required Year
            col = 2
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_year)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Year required. Must be formatted YYYY", pageName)
            else:
                # Otherwise the formatting of the year is valid, check for year consistent
                checkYear(data[row][col], pageName, row+row_diff,col)

            # Col D: Optional Start Date
            col = 3
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_date)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Start Date format. Must be formatted YYYY-MM-DD", pageName)

            # Col E: Optional End Date
            col = 4
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_date)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid End Date format. Must be formatted YYYY-MM-DD", pageName)

            # Col F: Required Purchased Energy Type
            col = 5
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_purchased_energy_type)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Purchased Energy Type required. Must be valid Purchased Energy Type", pageName)

            # Col G: Required Grid Region
            col = 6
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_id)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Grid Region required. Must be valid Grid Region", pageName)

            # Col H: Optional Utility
            col = 7
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Utility format. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)

            # Col I: Required Consumption
            col = 8
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_number)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Consumption required. Must be numeric with no decimals, commas, or spaces", pageName)

            # Col J: Required Unit
            col = 9
            if(isNan(data[row][col]) or not isValid(data[row][col], regex_unit_consumption)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Unit required. Must be valid unit", pageName)

            # Col K: Optional Comments
            col = 10
            if(not isNan(data[row][col]) and not isValid(data[row][col], regex_text)):
                addError("("+str(row+row_diff)+":"+toChar(col)+") Invalid Comments format. May only contain numbers, letters, spaces, and special characters [&@.,#%-_\'()] and be length [1-100]", pageName)


def handler(event, context):
    # Log envent and query
    logger.info(event)
    logger.info(event["queryStringParameters"])

    # Get user ID and key from params
    userID = event["queryStringParameters"]["userID"]
    Key = event["queryStringParameters"]["s3FileKey"]
    # creating local files
    local_file_name = '/tmp/userData.xlsx'

     #try to download the file to the temp directory
    try:
        logger.info(Key)
        # Download using the url
        urllib.request.urlretrieve(Key,local_file_name)
    except:
        logger.info("Failed")
        # If the file is not downloaded
        addError("File not found.")
        # Then return

    # Hold the excel
    excel = ''
    
    global valid
    if(valid):
        # Log the file
        logger.info("Passed Check Here: " + str(os.path.isfile(local_file_name)))

        # Try to parse the downloaded file
        try:
            # Use pandas to parse the file
            excel = pd.ExcelFile(local_file_name)
        except:
            # If the file is not downloaded
            addError("File corrupted, cannot be paresd.")

    # Run throught the checks for each page if valid so far
    if(valid):
        
        # First check the facility
        checkFacility(excel)
        # Next check the scope 1 stationary
        checkScope1Stationary(excel)
        # Next check the scope 1 mobile
        checkScope1Mobile(excel)
        # Next check the scope 1 fugitives
        checkScope1Fugitives(excel)
        # Next check the scope 2 purchased energy
        checkScope2PurchasedEnergy(excel)

        global set_year
        # End by ensuring the year has been set
        if(set_year == -1):
            # The year has not been set, return an error
            addError("The year has not been set.")
            
    global error_messages
    # Create return a new dictionary
    jayson = {'isValid':valid, 'errorList':error_messages}

    # reset values in lambda function
    set_year = -1
    error_messages = []
    valid = True

    # Return to the request from the api
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(jayson)
    }
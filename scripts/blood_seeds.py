import random
import subprocess
from datetime import datetime, timedelta

# List of donors with their blood types
donors = [
    {"id": 1, "userId": 3, "bloodAntigenType": "APositive", "bloodSubtype": "Rhd", "lastDonationTime": "2023-06-09T00:00:00", "addressId": 1},
    {"id": 2, "userId": 7, "bloodAntigenType": "ANegative", "bloodSubtype": "Rhd", "lastDonationTime": "2024-03-07T00:00:00", "addressId": 2},
    {"id": 3, "userId": 8, "bloodAntigenType": "OPositive", "bloodSubtype": "Rhd", "lastDonationTime": None, "addressId": 3},
    {"id": 4, "userId": 9, "bloodAntigenType": "ONegative", "bloodSubtype": "Rhd", "lastDonationTime": "2024-05-10T00:00:00", "addressId": 4},
    {"id": 5, "userId": 10, "bloodAntigenType": "OPositive", "bloodSubtype": "Ro", "lastDonationTime": "2024-04-12T00:00:00", "addressId": 5},
    {"id": 6, "userId": 11, "bloodAntigenType": "ABPositive", "bloodSubtype": "Rhd", "lastDonationTime": "2024-04-06T00:00:00", "addressId": 6},
    {"id": 7, "userId": 12, "bloodAntigenType": "ABNegative", "bloodSubtype": "Rhd", "lastDonationTime": "2024-04-06T00:00:00", "addressId": 7},
    {"id": 8, "userId": 13, "bloodAntigenType": "BPositive", "bloodSubtype": "Rhd", "lastDonationTime": "2024-03-08T00:00:00", "addressId": 8},
    {"id": 9, "userId": 14, "bloodAntigenType": "BNegative", "bloodSubtype": "Rhd", "lastDonationTime": "2024-02-08T00:00:00", "addressId": 9},
    {"id": 10, "userId": 15, "bloodAntigenType": "ONegative", "bloodSubtype": "Rhd", "lastDonationTime": None, "addressId": 10},
    {"id": 11, "userId": 16, "bloodAntigenType": "OPositive", "bloodSubtype": "Ro", "lastDonationTime": None, "addressId": 11},
]

# List of centers
centers = [
    {"id": 1, "name": "BC Rasipuram Main", "latitude": 11.457394552310063, "longitude": 78.19057176836289, "unitsCapacity": 150, "rbcUnits": 1, "plateletsUnits": 1, "plasmaUnits": 1, "isCentralReserve": False, "slotsCapacity": 10, "addressId": None, "openByTime": "09:00:00", "closeByTime": "15:30:00"},
    {"id": 2, "name": "Jai Suryas Blood Bank Services", "latitude": 11.458141353997457, "longitude": 78.19077339926346, "unitsCapacity": 125, "rbcUnits": 1, "plateletsUnits": 1, "plasmaUnits": 1, "isCentralReserve": False, "slotsCapacity": 14, "addressId": None, "openByTime": "09:00:00", "closeByTime": "15:30:00"},
    {"id": 9, "name": "CMC Reserve", "latitude": 11.028636207836566, "longitude": 77.02374203456698, "unitsCapacity": 1000, "rbcUnits": 1, "plateletsUnits": 1, "plasmaUnits": 1, "isCentralReserve": True, "slotsCapacity": 30, "addressId": None, "openByTime": "05:00:00", "closeByTime": "23:30:00"},
    {"id": 10, "name": "SKCET Reserve", "latitude": 10.937165211261847, "longitude": 76.95553122311554, "unitsCapacity": 1000, "rbcUnits": 1, "plateletsUnits": 1, "plasmaUnits": 1, "isCentralReserve": False, "slotsCapacity": 20, "addressId": None, "openByTime": "09:00:00", "closeByTime": "14:30:00"},
    {"id": 11, "name": "Ganga Blood Bank", "latitude": 10.963047899555486, "longitude": 76.9517570112368, "unitsCapacity": 1500, "rbcUnits": 1, "plateletsUnits": 1, "plasmaUnits": 1, "isCentralReserve": True, "slotsCapacity": 60, "addressId": None, "openByTime": "09:00:00", "closeByTime": "14:30:00"},
    {"id": 13, "name": "Olympia BC & Labs", "latitude": 13.01712862354969, "longitude": 80.20588873797286, "unitsCapacity": 1500, "rbcUnits": 1, "plateletsUnits": 1, "plasmaUnits": 1, "isCentralReserve": True, "slotsCapacity": 200, "addressId": None, "openByTime": "09:00:00", "closeByTime": "22:30:00"},
    {"id": 14, "name": "Meenambakam BC", "latitude": 12.983524371763952, "longitude": 80.16750522695797, "unitsCapacity": 150, "rbcUnits": 1, "plateletsUnits": 1, "plasmaUnits": 1, "isCentralReserve": False, "slotsCapacity": 100, "addressId": None, "openByTime": "09:00:00", "closeByTime": "16:30:00"},
]

# Blood types and subtypes
blood_types = ["RBC", "Platelets", "Plasma"]

# Expiry dates for different blood types
expiry_dates = {
    "RBC": (datetime.now() + timedelta(days=35)).strftime('%Y-%m-%dT%H:%M:%S.000Z'),
    "Platelets": (datetime.now() + timedelta(days=25)).strftime('%Y-%m-%dT%H:%M:%S.000Z'),
    "Plasma": (datetime.now() + timedelta(days=730)).strftime('%Y-%m-%dT%H:%M:%S.000Z')
}

# Expiry date for RBC expiring today
expiry_today = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.000Z')

# cURL command template
curl_command_template = """curl --location 'http://localhost:5226/api/UnitBag' \\
--header 'Content-Type: application/json' \\
--header 'Accept: text/plain' \\
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1Z2Fua3Btc0BnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTcyMjgzOTU4NH0.pHZVgUkpVn1rThGf6PEhwx6ZVwqHlGHKDwfqSqFCIqI' \\
--data '{{
    "type": "{type}",
    "bloodSubtype": "{bloodSubtype}",
    "bloodType": "{bloodType}",
    "expiry": "{expiry}",
    "donorId": {donorId},
    "centerId": {centerId},
    "isRare": {isRare}
}}'"""

commands = []

# Generate cURL commands for different expiry dates
for center in centers:
    for blood_type in blood_types:
        for donor in donors:
            expiry_date = expiry_dates[blood_type]
            command = curl_command_template.format(
                type=donor["bloodAntigenType"],
                bloodSubtype=donor["bloodSubtype"],
                bloodType=blood_type,
                expiry=expiry_date,
                donorId=donor["id"],
                centerId=center["id"],
                isRare="true" if donor["bloodSubtype"] == "Ro" else "false"
            )
            commands.append(command)

# Generate additional cURL commands for RBC units expiring today
# for center in centers:
#     for donor in donors:
#         command = curl_command_template.format(
#             type=donor["bloodAntigenType"],
#             bloodSubtype=donor["bloodSubtype"],
#             bloodType="RBC",
#             expiry=expiry_today,
#             donorId=donor["id"],
#             centerId=center["id"],
#             isRare="true" if donor["bloodSubtype"] == "Ro" else "false"
#         )
#         commands.append(command)

def execute_curl(command):
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(result.stderr)

# Print the commands
for command in commands:
    print(command)
    execute_curl(command)
    print()


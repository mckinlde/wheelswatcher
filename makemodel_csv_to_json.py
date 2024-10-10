import pandas as pd
import json

# Load the CSV file
df = pd.read_csv('/Users/douglasmckinley/Desktop/wheelswatcher_documents/makemodel - Sheet1.csv')

# Drop rows where 'Make' is NaN
df = df.dropna(subset=['Make'])

# Ensure 'Make' and 'Model' are strings
df['Make'] = df['Make'].astype(str).str.lower()
df['Model'] = df['Model'].astype(str).str.lower()

# Drop rows where make starts with a digit
df = df[~df['Make'].str.match('^\d')]

# Group by 'Make' and collect associated models
car_data = df.groupby('Make')['Model'].apply(list).to_dict()

# Save the result as JSON
with open('makemodel.json', 'w') as json_file:
    json.dump(car_data, json_file)

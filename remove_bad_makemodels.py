import json

def remove_names_with_fewer_values(json_file):
    # Open and load the JSON data
    with open(json_file, 'r') as file:
        data = json.load(file)

    # Remove any keys (names) with fewer than 4 values
    filtered_data = {key: value for key, value in data.items() if len(value) >= 4}

    # Write the updated data back to the file
    with open(json_file, 'w') as file:
        json.dump(filtered_data, file, indent=4)

    print(f"Names with fewer than 4 values have been removed from {json_file}")

# Example usage
remove_names_with_fewer_values('/Users/douglasmckinley/PycharmProjects/pythonProject/wheelswatcher/makemodel.json')

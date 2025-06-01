// CarDropdown.js

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const defaultFilters = {
  purveyor: 'all',
  milesFromLocation: '',
  fromZip: '',
  minPrice: '',
  maxPrice: '',
  minMonthlyPayment: '',
  maxMonthlyPayment: '',
  makeAndModel: '',
  minOdometer: '',
  maxOdometer: '',
  minModelYear: '',
  maxModelYear: '',
  drive: [],
  transmission: [],
  cylinders: [],
  condition: [],
  fuel: [],
  type: [],
  titleStatus: [],
  paintColor: [],
  deliveryAvailable: false,
  cryptoOk: false
};

const multiSelectOptions = {
  drive: [
    { value: '1', label: 'fwd' },
    { value: '2', label: 'rwd' },
    { value: '3', label: '4wd' }
  ],
  transmission: [
    { value: '1', label: 'manual' },
    { value: '2', label: 'automatic' },
    { value: '3', label: 'other' }
  ],
  cylinders: [
    { value: '1', label: '3 cylinders' },
    { value: '2', label: '4 cylinders' },
    { value: '3', label: '5 cylinders' },
    { value: '4', label: '6 cylinders' },
    { value: '5', label: '8 cylinders' },
    { value: '6', label: '10 cylinders' },
    { value: '7', label: '12 cylinders' },
    { value: '8', label: 'other' }
  ],
  condition: [
    { value: '10', label: 'new' },
    { value: '20', label: 'like new' },
    { value: '30', label: 'excellent' },
    { value: '40', label: 'good' },
    { value: '50', label: 'fair' },
    { value: '60', label: 'salvage' }
  ],
  fuel: [
    { value: '1', label: 'gas' },
    { value: '2', label: 'diesel' },
    { value: '3', label: 'hybrid' },
    { value: '4', label: 'electric' },
    { value: '6', label: 'other' }
  ],
  type: [
    { value: '1', label: 'bus' },
    { value: '2', label: 'convertible' },
    { value: '3', label: 'coupe' },
    { value: '4', label: 'hatchback' },
    { value: '5', label: 'minivan' },
    { value: '6', label: 'offroad' },
    { value: '7', label: 'pickup' },
    { value: '8', label: 'sedan' },
    { value: '9', label: 'truck' },
    { value: '10', label: 'SUV' },
    { value: '11', label: 'wagon' },
    { value: '12', label: 'van' },
    { value: '13', label: 'other' }
  ],
  titleStatus: [
    { value: '1', label: 'clean' },
    { value: '2', label: 'salvage' },
    { value: '3', label: 'rebuilt' },
    { value: '4', label: 'parts only' },
    { value: '5', label: 'lien' },
    { value: '6', label: 'missing' }
  ],
  paintColor: [
    { value: '1', label: 'black' },
    { value: '2', label: 'blue' },
    { value: '20', label: 'brown' },
    { value: '3', label: 'green' },
    { value: '4', label: 'grey' },
    { value: '5', label: 'orange' },
    { value: '6', label: 'purple' },
    { value: '7', label: 'red' },
    { value: '8', label: 'silver' },
    { value: '9', label: 'white' },
    { value: '10', label: 'yellow' },
    { value: '11', label: 'custom' }
  ]
};

const CarDropdown = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [expandedSections, setExpandedSections] = useState([]);

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field, value, checked) => {
    setFilters(prev => {
      const arr = prev[field] || [];
      return {
        ...prev,
        [field]: checked ? [...arr, value] : arr.filter(item => item !== value)
      };
    });
  };

  const renderMultiSelect = (title, options, field, hasSelectAll = false) => {
    const isExpanded = expandedSections.includes(title);
    const selectedValues = filters[field] || [];

    return (
      <div className="border-b border-gray-200 py-3">
        <Button
          variant="ghost"
          className="w-full justify-start px-0 py-1 h-auto font-normal text-blue-600 hover:text-blue-800"
          onClick={() => toggleSection(title)}
        >
          <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          {title}
        </Button>

        {isExpanded && (
          <div className="mt-2 ml-6">
            {options.map(option => (
              <div key={option.value} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`${title}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleMultiSelectChange(field, option.value, !!checked)
                  }
                />
                <Label htmlFor={`${title}-${option.value}`} className="text-sm font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
            {hasSelectAll && (
              <div className="flex gap-4 mt-2 pt-2 border-t border-gray-100">
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-blue-600"
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    [field]: options.map(opt => opt.value)
                  }))}
                >
                  select all
                </Button>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-gray-400"
                  onClick={() => setFilters(prev => ({ ...prev, [field]: [] }))}
                >
                  deselect all
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRangeInput = (label, minField, maxField, prefix = '') => (
    <div className="py-3 border-b border-gray-200">
      <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-sm text-gray-600">{prefix}</span>}
        <Input
          className="h-8 text-sm"
          placeholder="min"
          value={filters[minField]}
          onChange={(e) => handleInputChange(minField, e.target.value)}
        />
        <span className="text-gray-500">-</span>
        {prefix && <span className="text-sm text-gray-600">{prefix}</span>}
        <Input
          className="h-8 text-sm"
          placeholder="max"
          value={filters[maxField]}
          onChange={(e) => handleInputChange(maxField, e.target.value)}
        />
      </div>
    </div>
  );

  const handleApply = () => {
    console.log('Sidebar JSON:', JSON.stringify(filters, null, 2));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setExpandedSections([]);
  };

  return (
    <div className="bg-white border-r border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-xl font-semibold text-gray-900">cars+trucks</h1>
      </div>

      <div className="p-4">
        {renderRangeInput('Price', 'minPrice', 'maxPrice', '$')}
        {renderRangeInput('Monthly Payment', 'minMonthlyPayment', 'maxMonthlyPayment', '$')}
        {renderRangeInput('Model Year', 'minModelYear', 'maxModelYear')}
        {renderRangeInput('Odometer', 'minOdometer', 'maxOdometer', 'mi')}

        {Object.entries(multiSelectOptions).map(([field, options]) =>
          renderMultiSelect(field, options, field, true)
        )}

        <div className="mt-6 flex gap-4">
          <Button onClick={handleApply}>Apply</Button>
          <Button variant="ghost" onClick={handleReset}>Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default CarDropdown;

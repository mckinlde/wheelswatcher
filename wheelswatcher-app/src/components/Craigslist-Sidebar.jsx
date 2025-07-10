import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Menu } from 'lucide-react';

const Sidebar = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [radius, setRadius] = useState('');
  const [hasImage, setHasImage] = useState(true);
  const [manual, setManual] = useState(false);
  const [awd, setAwd] = useState(false);
  const [electric, setElectric] = useState(false);

  const applyFilters = () => {
    const filters = {
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      radius,
      hasImage,
      manual,
      awd,
      electric,
    };
    onFilterChange(filters);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="m-2">
          <Menu className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-auto">
        <SheetHeader>
          <SheetTitle>Search Filters</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[85vh] pr-2 mt-4">
          <div className="space-y-4">

            <div>
              <Label>Price ($)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Year</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Search Radius (miles)</Label>
              <Input
                type="number"
                placeholder="e.g. 100"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Only Listings With Images</Label>
              <Switch checked={hasImage} onCheckedChange={setHasImage} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Manual Transmission</Label>
              <Switch checked={manual} onCheckedChange={setManual} />
            </div>

            <div className="flex items-center justify-between">
              <Label>AWD/4WD</Label>
              <Switch checked={awd} onCheckedChange={setAwd} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Electric Only</Label>
              <Switch checked={electric} onCheckedChange={setElectric} />
            </div>

            <div className="pt-4">
              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;

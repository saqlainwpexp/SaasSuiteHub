import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ruler, 
  Weight, 
  Droplets, 
  Thermometer,
  Clock, 
  Crop,
  Power,
  Gauge
} from "lucide-react";

type Unit = {
  id: string;
  name: string;
  rate: number;
};

type UnitCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  baseUnit: string;
  units: Unit[];
};

const unitCategories: UnitCategory[] = [
  {
    id: "length",
    name: "Length",
    icon: <Ruler className="h-4 w-4" />,
    baseUnit: "m",
    units: [
      { id: "mm", name: "Millimeter (mm)", rate: 0.001 },
      { id: "cm", name: "Centimeter (cm)", rate: 0.01 },
      { id: "m", name: "Meter (m)", rate: 1 },
      { id: "km", name: "Kilometer (km)", rate: 1000 },
      { id: "in", name: "Inch (in)", rate: 0.0254 },
      { id: "ft", name: "Foot (ft)", rate: 0.3048 },
      { id: "yd", name: "Yard (yd)", rate: 0.9144 },
      { id: "mi", name: "Mile (mi)", rate: 1609.344 },
    ],
  },
  {
    id: "weight",
    name: "Weight",
    icon: <Weight className="h-4 w-4" />,
    baseUnit: "kg",
    units: [
      { id: "mg", name: "Milligram (mg)", rate: 0.000001 },
      { id: "g", name: "Gram (g)", rate: 0.001 },
      { id: "kg", name: "Kilogram (kg)", rate: 1 },
      { id: "t", name: "Metric Ton (t)", rate: 1000 },
      { id: "oz", name: "Ounce (oz)", rate: 0.028349523125 },
      { id: "lb", name: "Pound (lb)", rate: 0.45359237 },
      { id: "st", name: "Stone (st)", rate: 6.35029318 },
    ],
  },
  {
    id: "volume",
    name: "Volume",
    icon: <Droplets className="h-4 w-4" />,
    baseUnit: "l",
    units: [
      { id: "ml", name: "Milliliter (ml)", rate: 0.001 },
      { id: "cl", name: "Centiliter (cl)", rate: 0.01 },
      { id: "l", name: "Liter (l)", rate: 1 },
      { id: "m3", name: "Cubic Meter (m³)", rate: 1000 },
      { id: "pt", name: "Pint (pt)", rate: 0.473176473 },
      { id: "qt", name: "Quart (qt)", rate: 0.946352946 },
      { id: "gal", name: "Gallon (gal)", rate: 3.78541178 },
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    icon: <Thermometer className="h-4 w-4" />,
    baseUnit: "c",
    units: [
      { id: "c", name: "Celsius (°C)", rate: 1 },
      { id: "f", name: "Fahrenheit (°F)", rate: 1 },
      { id: "k", name: "Kelvin (K)", rate: 1 },
    ],
  },
  {
    id: "time",
    name: "Time",
    icon: <Clock className="h-4 w-4" />,
    baseUnit: "s",
    units: [
      { id: "ms", name: "Millisecond (ms)", rate: 0.001 },
      { id: "s", name: "Second (s)", rate: 1 },
      { id: "min", name: "Minute (min)", rate: 60 },
      { id: "h", name: "Hour (h)", rate: 3600 },
      { id: "d", name: "Day (d)", rate: 86400 },
      { id: "wk", name: "Week (wk)", rate: 604800 },
      { id: "mo", name: "Month (30 days)", rate: 2592000 },
      { id: "yr", name: "Year (365 days)", rate: 31536000 },
    ],
  },
  {
    id: "area",
    name: "Area",
    icon: <Crop className="h-4 w-4" />,
    baseUnit: "m2",
    units: [
      { id: "mm2", name: "Square Millimeter (mm²)", rate: 0.000001 },
      { id: "cm2", name: "Square Centimeter (cm²)", rate: 0.0001 },
      { id: "m2", name: "Square Meter (m²)", rate: 1 },
      { id: "ha", name: "Hectare (ha)", rate: 10000 },
      { id: "km2", name: "Square Kilometer (km²)", rate: 1000000 },
      { id: "in2", name: "Square Inch (in²)", rate: 0.00064516 },
      { id: "ft2", name: "Square Foot (ft²)", rate: 0.09290304 },
      { id: "ac", name: "Acre (ac)", rate: 4046.8564224 },
      { id: "mi2", name: "Square Mile (mi²)", rate: 2589988.110336 },
    ],
  },
  {
    id: "speed",
    name: "Speed",
    icon: <Gauge className="h-4 w-4" />,
    baseUnit: "mps",
    units: [
      { id: "mps", name: "Meters/Second (m/s)", rate: 1 },
      { id: "kmh", name: "Kilometers/Hour (km/h)", rate: 0.277777778 },
      { id: "mph", name: "Miles/Hour (mph)", rate: 0.44704 },
      { id: "fps", name: "Feet/Second (ft/s)", rate: 0.3048 },
      { id: "kn", name: "Knot (kn)", rate: 0.514444444 },
    ],
  },
  {
    id: "data",
    name: "Data",
    icon: <Power className="h-4 w-4" />,
    baseUnit: "b",
    units: [
      { id: "b", name: "Bit (b)", rate: 1 },
      { id: "B", name: "Byte (B)", rate: 8 },
      { id: "KB", name: "Kilobyte (KB)", rate: 8 * 1024 },
      { id: "MB", name: "Megabyte (MB)", rate: 8 * 1024 * 1024 },
      { id: "GB", name: "Gigabyte (GB)", rate: 8 * 1024 * 1024 * 1024 },
      { id: "TB", name: "Terabyte (TB)", rate: 8 * 1024 * 1024 * 1024 * 1024 },
    ],
  },
];

export default function UnitConverter() {
  const [category, setCategory] = useState<string>("length");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [result, setResult] = useState<string>("");
  
  useEffect(() => {
    // Set default units based on category
    const currentCategory = unitCategories.find(c => c.id === category);
    if (currentCategory) {
      setFromUnit(currentCategory.units[0].id);
      setToUnit(currentCategory.units[1].id);
    }
  }, [category]);
  
  useEffect(() => {
    if (fromUnit && toUnit && inputValue) {
      convertUnit();
    }
  }, [category, fromUnit, toUnit, inputValue]);
  
  const getCurrentCategory = () => {
    return unitCategories.find(c => c.id === category) as UnitCategory;
  };
  
  const convertUnit = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult("");
      return;
    }
    
    const currentCategory = getCurrentCategory();
    const value = parseFloat(inputValue);
    
    // Special case for temperature conversion
    if (category === "temperature") {
      let resultValue = 0;
      
      // Convert to Celsius as base
      let valueCelsius = 0;
      if (fromUnit === "c") {
        valueCelsius = value;
      } else if (fromUnit === "f") {
        valueCelsius = (value - 32) * 5/9;
      } else if (fromUnit === "k") {
        valueCelsius = value - 273.15;
      }
      
      // Convert from Celsius to target
      if (toUnit === "c") {
        resultValue = valueCelsius;
      } else if (toUnit === "f") {
        resultValue = (valueCelsius * 9/5) + 32;
      } else if (toUnit === "k") {
        resultValue = valueCelsius + 273.15;
      }
      
      setResult(resultValue.toFixed(5).replace(/\.?0+$/, ""));
      return;
    }
    
    // For other unit types
    const fromUnitObj = currentCategory.units.find(u => u.id === fromUnit) as Unit;
    const toUnitObj = currentCategory.units.find(u => u.id === toUnit) as Unit;
    
    // Convert to base unit then to target unit
    const baseValue = value * fromUnitObj.rate;
    const resultValue = baseValue / toUnitObj.rate;
    
    setResult(resultValue.toFixed(8).replace(/\.?0+$/, ""));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Unit Converter</h2>
        <p className="text-gray-600">
          Convert between various units of measurement
        </p>
      </div>
      
      <div className="bg-white rounded-lg border overflow-hidden mb-6">
        <Tabs 
          defaultValue="length" 
          value={category} 
          onValueChange={setCategory}
          className="w-full"
        >
          <div className="overflow-x-auto">
            <TabsList className="flex border-b p-0 rounded-none">
              {unitCategories.map(cat => (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="flex items-center gap-1.5 py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {unitCategories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="from-value" className="block mb-2">From</Label>
                  <Input
                    id="from-value"
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="mb-2 text-lg"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {cat.units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="to-value" className="block mb-2">To</Label>
                  <Input
                    id="to-value"
                    type="text"
                    value={result}
                    readOnly
                    className="mb-2 text-lg bg-gray-50"
                  />
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {cat.units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Common Conversions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {cat.units.slice(0, 4).map((fromU, i) => (
                    <div key={`conversion-${i}`} className="p-2 bg-gray-50 rounded">
                      <strong>1 {fromU.name.split('(')[1].split(')')[0]}</strong> = {(cat.units[0].rate / fromU.rate).toFixed(6).replace(/\.?0+$/, "")} {cat.units[0].name.split('(')[1].split(')')[0]}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <div className="bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">About Unit Converter</h3>
        <p className="text-sm text-gray-600">
          This tool provides accurate conversions between different units of measurement across multiple categories.
          All conversion factors used are based on standard international definitions.
        </p>
      </div>
    </div>
  );
}

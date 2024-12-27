import React, { useState } from "react";
import { standardSizes } from './constants/standardSizes';

const getStandardSize = (measurements) => {
  const { bust, waist, hips } = measurements;
  let bestSize = "M"; // Default size
  let bestMatch = 0;

  Object.entries(standardSizes).forEach(([size, ranges]) => {
    let matches = 0;
    let total = 0;

    if (bust) {
      total++;
      if (bust >= ranges.bust.min && bust <= ranges.bust.max) matches++;
    }
    if (waist) {
      total++;
      if (waist >= ranges.waist.min && waist <= ranges.waist.max) matches++;
    }
    if (hips) {
      total++;
      if (hips >= ranges.hips.min && hips <= ranges.hips.max) matches++;
    }

    const matchRate = total > 0 ? matches / total : 0;
    if (matchRate > bestMatch) {
      bestMatch = matchRate;
      bestSize = size;
    }
  });

  return bestSize;
};

console.log("Bust Component:", bustComponent); 
console.log("Waist Component:", waistComponent); 
console.log("Calculated Hips with Precision Fix:", hips); 


const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    bust: "",
    waist: "",
    unit: "inches",
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const { bust, waist, unit } = measurements;

    if (!waist || !bust) {
      setErrors(["Bust and waist measurements are required."]);
      return;
    }

    const convert = (value) => (unit === "cm" ? value / 2.54 : value);
    const parsedMeasurements = {
      bust: convert(parseFloat(bust)),
      waist: convert(parseFloat(waist)),
    };

    console.log("Parsed Measurements Before Hips Calculation:", parsedMeasurements);

    // Static test
    console.log("Static Test Hips (40 * 0.4 + 32 * 0.6):", +(40 * 0.4 + 32 * 0.6).toFixed(10));

    // Inline hips calculation
    const bustComponent = +(parsedMeasurements.bust * 0.4).toFixed(10);
    const waistComponent = +(parsedMeasurements.waist * 0.6).toFixed(10);

    console.log("Bust Component (Bust * 0.4):", bustComponent);
    console.log("Waist Component (Waist * 0.6):", waistComponent);

    const hips = +(bustComponent + waistComponent).toFixed(10); // Fix precision
    console.log("Inline Calculated Hips:", hips);

    parsedMeasurements.hips = hips;

    console.log("Parsed Measurements After Hips Calculation:", parsedMeasurements);

    const bestSize = getStandardSize(parsedMeasurements);

    const finalResults = {
      bust: parsedMeasurements.bust.toFixed(2),
      waist: parsedMeasurements.waist.toFixed(2),
      hips: parsedMeasurements.hips.toFixed(2),
      size: bestSize,
      message: `The best size match is ${bestSize}.`,
    };

    console.log("Final Results Before Rendering:", finalResults);

    setResults(finalResults);
    setErrors([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Size Calculator</h1>

        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Input Measurements</h2>
            <div className="mb-4">
              <label className="block font-medium">Unit</label>
              <select
                name="unit"
                value={measurements.unit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="inches">Inches</option>
                <option value="cm">Centimeters</option>
              </select>
            </div>
            {["bust", "waist"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block font-medium capitalize">{field}</label>
                <input
                  type="number"
                  name={field}
                  value={measurements[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
            <button
              onClick={handleCalculate}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Calculate
            </button>
          </div>

          {results && (
            <div className="bg-gray-50 p-4 rounded mb-6">
              <p><strong>Bust:</strong> {results.bust} inches</p>
              <p><strong>Waist:</strong> {results.waist} inches</p>
              <p><strong>Hips (calculated):</strong> {results.hips} inches</p>
              <p><strong>Standard Size:</strong> {results.size}</p>
              <p>{results.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

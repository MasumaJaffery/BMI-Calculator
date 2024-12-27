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

const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    bust: "",
    waist: "",
    height: "",
    weight: "",
    ageGroup: "18-24", // Default value
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
      setResults(null); // Clear previous results
      return;
    }

    const convert = (value) => {
      const numericValue = parseFloat(value);
      return isNaN(numericValue) ? 0 : unit === "cm" ? numericValue / 2.54 : numericValue;
    };

    const parsedMeasurements = {
      bust: convert(bust),
      waist: convert(waist),
    };

    const hips = +(parsedMeasurements.bust * 0.4 + parsedMeasurements.waist * 0.6).toFixed(10);
    parsedMeasurements.hips = hips;

    const bestSize = getStandardSize(parsedMeasurements);

    const finalResults = {
      bust: parsedMeasurements.bust.toFixed(2),
      waist: parsedMeasurements.waist.toFixed(2),
      hips: parsedMeasurements.hips.toFixed(2),
      size: bestSize,
      message: `The best size match is ${bestSize}.`,
    };

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
            {["bust", "waist", "height", "weight"].map((field) => (
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
            <div className="mb-4">
              <label className="block font-medium">Age Group</label>
              <select
                name="ageGroup"
                value={measurements.ageGroup}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
            </div>
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

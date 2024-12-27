import React, { useState } from "react";
import { standardSizes } from "./constants/standardSizes";

// Function to calculate standard size
const calculateStandardSize = ({ bust, waist }) => {
  const parsedMeasurements = {
    bust: parseFloat(bust),
    waist: parseFloat(waist),
  };

  if (Object.values(parsedMeasurements).some((val) => isNaN(val) || val <= 0)) {
    return { size: "N/A", message: "Invalid or missing measurements. Please provide valid values." };
  }

  console.log("Parsed Measurements:", parsedMeasurements);

  let closestSize = null;
  let closestDistance = Infinity;

  for (const [size, ranges] of Object.entries(standardSizes)) {
    const bustCenter = (ranges.bust.min + ranges.bust.max) / 2;
    const waistCenter = (ranges.waist.min + ranges.waist.max) / 2;

    const bustDistance = Math.abs(parsedMeasurements.bust - bustCenter);
    const waistDistance = Math.abs(parsedMeasurements.waist - waistCenter);

    const totalDistance = bustDistance + waistDistance;

    if (
      parsedMeasurements.bust >= ranges.bust.min &&
      parsedMeasurements.bust <= ranges.bust.max &&
      parsedMeasurements.waist >= ranges.waist.min &&
      parsedMeasurements.waist <= ranges.waist.max
    ) {
      return { size, message: `You are a ${size} size!` };
    }

    if (totalDistance < closestDistance) {
      closestDistance = totalDistance;
      closestSize = size;
    }
  }

  if (closestSize) {
    return {
      size: closestSize,
      message: `Closest match: ${closestSize}. Your measurements are slightly outside the exact range.`,
    };
  }

  return { size: "N/A", message: "Measurements do not match any standard size." };
};

// Main Component
const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    waist: "",
    bust: "",
    unit: "inches",
    ageGroup: "18-24", // Default age group
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const { waist, bust } = measurements;

    if (!waist || !bust) {
      setErrors(["Bust and waist measurements are required."]);
      return;
    }

    const sizeInfo = calculateStandardSize({ bust, waist });

    setResults({
      bust,
      waist,
      size: sizeInfo.size,
      message: sizeInfo.message,
    });
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
            {["height", "weight", "waist", "bust"].map((field) => (
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

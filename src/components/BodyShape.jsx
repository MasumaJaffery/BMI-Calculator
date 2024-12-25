import React, { useState } from "react";
import { bodyShapeData } from "./constants/bodyShapeData";

// Function to detect body shape
const detectBodyShape = (measurements) => {
  const { waist, bust, height } = measurements;

  // Convert values to floats for calculation
  const parsedMeasurements = {
    waist: parseFloat(waist),
    bust: parseFloat(bust),
    height: parseFloat(height),
  };

  if (Object.values(parsedMeasurements).some((val) => isNaN(val) || val <= 0)) {
    return "N/A";
  }

  const bustToWaist = (parsedMeasurements.bust / parsedMeasurements.waist).toFixed(2);
  const hipsToWaist = (1.25 * parsedMeasurements.waist).toFixed(2);
  const heightToWaist = (parsedMeasurements.height / parsedMeasurements.waist).toFixed(2);

  let bestMatch = "";
  let highestConfidence = 0;

  Object.entries(bodyShapeData).forEach(([shape, data]) => {
    const { ratios } = data;
    let score = 0;

    if (
      bustToWaist >= ratios.bustToWaist - 0.1 &&
      bustToWaist <= ratios.bustToWaist + 0.1
    )
      score += 10;
    if (
      hipsToWaist >= ratios.hipsToWaist - 0.1 &&
      hipsToWaist <= ratios.hipsToWaist + 0.1
    )
      score += 10;
    if (
      heightToWaist >= ratios.heightToWaist - 0.1 &&
      heightToWaist <= ratios.heightToWaist + 0.1
    )
      score += 10;

    if (score > highestConfidence) {
      highestConfidence = score;
      bestMatch = shape;
    }
  });

  return bestMatch || "N/A";
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
    const { height, weight, waist, bust } = measurements;

    // Validate input fields
    if (!height || !weight || !waist || !bust) {
      setErrors(["All fields are required."]);
      return;
    }

    const bodyShape = detectBodyShape(measurements);

    setResults({
      height,
      weight,
      bust,
      waist,
      bodyShape,
    });
    setErrors([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Body Shape Calculator</h1>

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
              <h3><strong>Body Shape:</strong></h3>
              <p>{results.bodyShape}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

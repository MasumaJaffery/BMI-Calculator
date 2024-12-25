import React, { useState } from "react";
import {
  validateInputs,
  validateProportions,
  validateVerticalProportions,
  validateBodyShape
} from "./utils/validation";

const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    height: 65, // Default height in inches
    weight: 70, // Default weight in kg
    waist: 30, // Default waist in inches
    bust: 36, // Default bust in inches
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = () => {
    setErrors([]);
    const inputErrors = validateInputs(measurements);

    if (inputErrors.length > 0) {
      setErrors(inputErrors);
      return;
    }

    const { height, waist, bust } = measurements;

    // Calculate secondary measurements
    const shoulderWidth = Math.round(waist * 0.8);
    const upperArm = Math.round(bust * 0.16);
    const thigh = Math.round(waist * 0.27);
    const inseam = Math.round(height * 0.45);

    setResults({ shoulderWidth, upperArm, thigh, inseam });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Size Calculator</h1>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Input Measurements</h2>
            {["height", "weight", "waist", "bust"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block font-medium capitalize">{field}</label>
                <input
                  type="number"
                  name={field}
                  value={measurements[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
             <div className="mb-4">
  <label className="block font-medium">Age Group</label>
  <select
    name="ageGroup"
    value={measurements.ageGroup || ""}
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
              Calculate Measurements
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Results</h2>

              {/* Secondary Measurements */}
              <h3 className="text-lg font-bold mb-4">Secondary Measurements</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(results).map(([key, value]) => (
                  <div key={key} className="bg-blue-100 p-3 rounded text-center">
                    <p className="font-medium capitalize">{key}</p>
                    <p className="font-bold">{value}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

import React, { useState } from "react";
import ConfidenceCalculator from "../components/core/ConfidenceCalculator";
import {
  validateInputs
} from "../components/utils/validation";

const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    height: 65, // Default height in inches
    weight: 70, // Default weight in kg
    waist: 30, // Default waist in inches
    bust: 36, // Default bust in inches
  });

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-gray-50 p-4 rounded shadow">
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
              className="w-full bg-blue-500 text-white py-2 rounded mt-4"
            >
              Calculate Confidence
            </button>
          </div>

          {/* Confidence Section */}
          <ConfidenceCalculator measurements={measurements} additionalFactors={{}} />
        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

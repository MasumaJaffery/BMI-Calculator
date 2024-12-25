import React, { useState } from "react";

// Function to calculate BMI
const calculateBMI = (height, weight, unit) => {
  let heightInMeters = height;
  let weightInKg = weight;

  if (unit === "inches") {
    heightInMeters = height / 39.37; // Convert inches to meters
    weightInKg = weight / 2.205;    // Convert pounds to kilograms
  } else if (unit === "cm") {
    heightInMeters = height / 100;  // Convert cm to meters
  }

  const bmi = (weightInKg / (heightInMeters ** 2)).toFixed(1);

  let category = "";
  if (bmi < 16) {
    category = "Severely Underweight";
  } else if (bmi >= 16 && bmi < 18.5) {
    category = "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
  } else if (bmi >= 30 && bmi < 35) {
    category = "Obese (Class I)";
  } else if (bmi >= 35 && bmi < 40) {
    category = "Obese (Class II)";
  } else {
    category = "Obese (Class III)";
  }

  const minIdealWeight = (18.5 * (heightInMeters ** 2)).toFixed(1);
  const maxIdealWeight = (24.9 * (heightInMeters ** 2)).toFixed(1);

  return {
    bmi,
    category,
    minIdealWeight,
    maxIdealWeight,
  };
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

  const [bmiDetails, setBmiDetails] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const { height, weight, waist, bust, unit, ageGroup } = measurements;

    if (!height || !weight || !waist || !bust) {
      setErrors(["All fields are required."]);
      return;
    }

    const bmiInfo = calculateBMI(height, weight, unit);
    setBmiDetails({ ...bmiInfo, waist, bust, ageGroup });
    setErrors([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">BMI Calculator</h1>

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

          {bmiDetails && (
            <div className="bg-gray-50 p-4 rounded mb-6">
              <h2 className="text-xl font-bold mb-4">Results</h2>
              <p><strong>BMI:</strong> {bmiDetails.bmi}</p>
              <p><strong>Category:</strong> {bmiDetails.category}</p>
              <p><strong>Ideal Weight Range:</strong> {bmiDetails.minIdealWeight} - {bmiDetails.maxIdealWeight} {measurements.unit === "inches" ? "kg" : "lbs"}</p>
              <p><strong>Waist:</strong> {bmiDetails.waist}"</p>
              <p><strong>Bust:</strong> {bmiDetails.bust}"</p>
              <p><strong>Age Group:</strong> {bmiDetails.ageGroup}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

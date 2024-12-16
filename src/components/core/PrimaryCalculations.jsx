import React, { useState } from 'react';
import { adjustmentFactors } from '../constants/adjustmentFactors';
import { validationRules } from '../constants/validationRules';
import { bodyShapeData } from '../constants/bodyShapeData';

// Helper: Validate inputs based on validation rules
const validateInputs = (measurements) => {
  const errors = [];

  for (let key in validationRules) {
    if (measurements[key]) {
      const value = measurements[key];
      const rule = validationRules[key];

      if (value < rule.min || value > rule.max) {
        errors.push(rule.message);
      }
    } else {
      errors.push(`${key} is required`);
    }
  }

  return errors;
};

// Helper: Adjust results based on body shape and additional factors
const applyAdjustments = (results, bodyShape, additionalFactors) => {
  if (bodyShape === 'hourglass') {
    results.hips *= 1.05;
    results.bust *= 1.05;
    results.waist *= 0.95;
  } else if (bodyShape === 'pear') {
    results.hips *= 1.1;
    results.waist *= 1.02;
  }

  if (additionalFactors.age > 50) {
    results.thigh *= 0.95;
    results.hips *= 0.97;
  }

  if (additionalFactors.activityLevel === 'high') {
    results.upperArm *= 1.1;
    results.thigh *= 1.1;
  }

  return results;
};

// Helper: Calculate measurements from height and weight
const calculateMeasurements = (measurements, bodyShape, additionalFactors) => {
  const shapeData = bodyShapeData[bodyShape] || {};
  const results = {
    waist: measurements.weight * (shapeData.waistRatio || 0.4),
    bust: measurements.weight * (shapeData.bustRatio || 0.3),
    hips: measurements.weight * (shapeData.hipsRatio || 0.3),
    shoulder: measurements.height * 0.1,
    upperArm: measurements.weight * 0.05,
    thigh: measurements.weight * 0.1,
  };

  // Apply adjustments based on body shape and other factors
  return applyAdjustments(results, bodyShape, additionalFactors);
};

// Helper: Get standard size based on measurements
const getStandardSize = (measurements) => {
  const { waist, bust, hips } = measurements;

  if (waist <= 28 && bust <= 34 && hips <= 36) {
    return 'S';
  } else if (waist <= 32 && bust <= 38 && hips <= 40) {
    return 'M';
  } else if (waist <= 36 && bust <= 42 && hips <= 44) {
    return 'L';
  } else {
    return 'XL';
  }
};

const PrimaryCalculations = () => {
  const [measurements, setMeasurements] = useState({
    weight: 70,
    height: 170,
    waist: 30,
    bust: 34,
    hips: 36,
    age: 30,
  });

  const [results, setResults] = useState({});
  const [bodyShape, setBodyShape] = useState('average');
  const [additionalFactors, setAdditionalFactors] = useState({ activityLevel: 'moderate', age: 30 });
  const [errors, setErrors] = useState([]);

  const handleSubmit = () => {
    const validationErrors = validateInputs(measurements);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    } else {
      const calculatedResults = calculateMeasurements(measurements, bodyShape, additionalFactors);
      calculatedResults.size = getStandardSize(calculatedResults);
      setResults(calculatedResults);
      setErrors([]);
    }
  };

  return (
    <div className="primary-calculations">
      <h1>Primary Calculations</h1>
      
      {/* Input Fields */}
      <div className="inputs">
        <label>
          Weight (kg):
          <input
            type="number"
            value={measurements.weight}
            onChange={(e) => setMeasurements({ ...measurements, weight: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          Height (cm):
          <input
            type="number"
            value={measurements.height}
            onChange={(e) => setMeasurements({ ...measurements, height: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          Waist (inches):
          <input
            type="number"
            value={measurements.waist}
            onChange={(e) => setMeasurements({ ...measurements, waist: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          Bust (inches):
          <input
            type="number"
            value={measurements.bust}
            onChange={(e) => setMeasurements({ ...measurements, bust: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          Age:
          <input
            type="number"
            value={measurements.age}
            onChange={(e) => setAdditionalFactors({ ...additionalFactors, age: parseInt(e.target.value, 10) })}
          />
        </label>
        <label>
          Body Shape:
          <select value={bodyShape} onChange={(e) => setBodyShape(e.target.value)}>
            <option value="average">Average</option>
            <option value="hourglass">Hourglass</option>
            <option value="pear">Pear</option>
            <option value="apple">Apple</option>
            <option value="rectangle">Rectangle</option>
          </select>
        </label>
        <label>
          Activity Level:
          <select
            value={additionalFactors.activityLevel}
            onChange={(e) => setAdditionalFactors({ ...additionalFactors, activityLevel: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="errors">
          <ul>
            {errors.map((error, index) => (
              <li key={index} style={{ color: 'red' }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Results */}
      <button onClick={handleSubmit}>Calculate</button>
      {results && (
        <div className="results">
          <h2>Results:</h2>
          <p>Waist: {results.waist.toFixed(2)} inches</p>
          <p>Bust: {results.bust.toFixed(2)} inches</p>
          <p>Hips: {results.hips.toFixed(2)} inches</p>
          <p>Size: {results.size}</p>
        </div>
      )}
    </div>
  );
};

export default PrimaryCalculations;

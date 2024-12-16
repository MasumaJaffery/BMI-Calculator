// In SecondaryCalculations.jsx

import { useState, useEffect } from 'react';
import { bodyShapeData } from '../constants/bodyShapeData.js';

export const calculateSecondaryMeasurements = ({ measurements, bodyShape, additionalFactors }) => {
  const [secondaryMeasurements, setSecondaryMeasurements] = useState({});

  useEffect(() => {
    const calculateSecondaryMeasurements = () => {
      const { height, weight, bust, waist, hips } = measurements;
      const shapeData = bodyShapeData[bodyShape] || bodyShapeData.average;
      let secondary = {};

      console.log('Calculating secondary measurements with bust, waist, hips:', bust, waist, hips);

      // Handle both weight and height calculations
      if (weight && height) {
        const bmi = weight / ((height / 100) ** 2);
        const adjustmentFactor = getWeightAdjustmentFactor(bmi);

        // Calculating secondary measurements based on height, weight, and body shape adjustments
        secondary = {
          shoulder: height * 0.23 * adjustmentFactor * shapeData.adjustments.shoulder,
          upperArm: weight * 0.08 * adjustmentFactor * shapeData.adjustments.upperArm,
          thigh: weight * 0.15 * adjustmentFactor * shapeData.adjustments.thigh,
          inseam: height * 0.45,
          neck: height * 0.18 * adjustmentFactor,
          underbust: height * 0.43 * adjustmentFactor,
          highHip: height * 0.41 * adjustmentFactor,
          crossBack: height * 0.23 * adjustmentFactor,
          armLength: height * 0.31,
          shoulderToWaist: height * 0.24,
        };

        console.log('Secondary measurements based on height and weight:', secondary);

        // Incorporating bust, waist, and hips into adjustments
        secondary.shoulder += bust * 0.05;
        secondary.upperArm += waist * 0.02;
        secondary.thigh += hips * 0.03;

        console.log('After incorporating bust, waist, and hips into secondary measurements:', secondary);
      } else if (height) {
        // If only height is available, calculate based on that
        secondary = {
          shoulder: height * 0.23 * shapeData.adjustments.shoulder,
          upperArm: height * 0.08 * shapeData.adjustments.upperArm,
          thigh: height * 0.15 * shapeData.adjustments.thigh,
          inseam: height * 0.45,
          neck: height * 0.18,
          underbust: height * 0.43,
          highHip: height * 0.41,
          crossBack: height * 0.23,
          armLength: height * 0.31,
          shoulderToWaist: height * 0.24,
        };

        console.log('Secondary measurements based on height only:', secondary);

        // Adjusting with bust, waist, and hips values
        secondary.shoulder += bust * 0.05;
        secondary.upperArm += waist * 0.02;
        secondary.thigh += hips * 0.03;

        console.log('After adjusting with bust, waist, and hips for height-based calculations:', secondary);
      }

      // Apply age-based adjustments if available
      if (measurements.age) {
        const ageModifiers = getAgeBasedModifiers(getAgeGroup(measurements.age), bmi || 22);
        console.log('Age-based modifiers:', ageModifiers);

        Object.keys(secondary).forEach(key => {
          if (ageModifiers[key]) {
            secondary[key] *= ageModifiers[key];
            console.log(`Adjusted ${key} with age modifier:`, secondary[key]);
          }
        });
      }

      // Set the calculated secondary measurements
      setSecondaryMeasurements(applyAdjustments(secondary, bodyShape, additionalFactors));
    };

    calculateSecondaryMeasurements();
  }, [measurements, bodyShape, additionalFactors]);

  // BMI adjustment factor based on weight
  const getWeightAdjustmentFactor = (bmi) => {
    console.log('Calculating weight adjustment factor for BMI:', bmi);
    if (bmi < 18.5) {
      return 0.9; // Underweight
    } else if (bmi >= 18.5 && bmi < 25) {
      return 1; // Normal weight
    } else if (bmi >= 25 && bmi < 30) {
      return 1.1; // Overweight
    } else {
      return 1.2; // Obese
    }
  };

  // Get age group for age-based modifiers
  const getAgeGroup = (age) => {
    console.log('Determining age group for age:', age);
    if (age < 25) {
      return 'youngAdult';
    } else if (age >= 25 && age < 50) {
      return 'middleAged';
    } else {
      return 'senior';
    }
  };

  // Age-based modifiers for measurements
  const getAgeBasedModifiers = (ageGroup, bmi) => {
    let modifiers = {};

    console.log('Getting age-based modifiers for group:', ageGroup);

    switch (ageGroup) {
      case 'youngAdult':
        modifiers = {
          shoulder: 1.02,
          upperArm: 1,
          thigh: 0.98
        };
        break;
      case 'middleAged':
        modifiers = {
          shoulder: 1,
          upperArm: 1.05,
          thigh: 1.02
        };
        break;
      case 'senior':
        modifiers = {
          shoulder: 0.98,
          upperArm: 1.1,
          thigh: 1.05
        };
        break;
      default:
        modifiers = {};
    }

    // Apply BMI-based adjustments within each age group
    if (bmi < 18.5) {
      Object.keys(modifiers).forEach(key => modifiers[key] *= 0.95);
    } else if (bmi >= 25) {
      Object.keys(modifiers).forEach(key => modifiers[key] *= 1.05);
    }

    console.log('Age-based modifiers after BMI adjustments:', modifiers);

    return modifiers;
  };

  // Apply custom adjustments based on body shape and additional factors
  const applyAdjustments = (secondary, bodyShape, additionalFactors) => {
    console.log('Applying custom adjustments for body shape:', bodyShape);

    if (bodyShape === 'Pear') {
      secondary.hips *= 1.05;
      console.log('Adjusted for Pear shape:', secondary);
    } else if (bodyShape === 'Apple') {
      secondary.waist *= 1.03;
      console.log('Adjusted for Apple shape:', secondary);
    }

    // Add more custom adjustment logic here

    return secondary;
  };

  return (
    <div>
      <h2>Secondary Measurements</h2>
      <ul>
        <li>Shoulder: {secondaryMeasurements.shoulder?.toFixed(2)} cm</li>
        <li>Upper Arm: {secondaryMeasurements.upperArm?.toFixed(2)} cm</li>
        <li>Thigh: {secondaryMeasurements.thigh?.toFixed(2)} cm</li>
        <li>Inseam: {secondaryMeasurements.inseam?.toFixed(2)} cm</li>
        <li>Neck: {secondaryMeasurements.neck?.toFixed(2)} cm</li>
        <li>Underbust: {secondaryMeasurements.underbust?.toFixed(2)} cm</li>
        <li>High Hip: {secondaryMeasurements.highHip?.toFixed(2)} cm</li>
        <li>Cross Back: {secondaryMeasurements.crossBack?.toFixed(2)} cm</li>
        <li>Arm Length: {secondaryMeasurements.armLength?.toFixed(2)} cm</li>
        <li>Shoulder to Waist: {secondaryMeasurements.shoulderToWaist?.toFixed(2)} cm</li>
      </ul>
    </div>
  );
};

export default calculateSecondaryMeasurements;

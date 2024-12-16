import MeasurementCalculator from '../core/MeasurementCalculator';  // Correct import

export const handleCalculate = async (
  measurements,
  setResults,
  setConfidenceScore,
  setConfidenceLevel,
  setIsLoading,
  setErrors
) => {
  console.log('handleCalculation started');
  
  // Reset states before calculation
  setIsLoading(true);
  setErrors([]);
  setResults(null);
  setConfidenceScore(null);
  setConfidenceLevel(null);

  // Validate the input measurements
  const validationErrors = validateInputs(measurements);
  if (validationErrors.length > 0) {
    console.log('Validation Errors:', validationErrors);
    setErrors(validationErrors);  // Set validation errors in the state
    setIsLoading(false);  // Stop loading as validation failed
    return;
  }

  try {
    // Instantiate the MeasurementCalculator class
    const calculator = new MeasurementCalculator(measurements);

    // Calculate the results asynchronously
    const additionalFactors = {
      age: measurements.ageGroup,
      bodyType: measurements.bodyShape,
      heightCategory: measurements.height ? calculator.getHeightCategory(measurements.height) : 'average',
    };

    const calculatedResults = await calculator.calculateMeasurements(
      measurements,
      measurements.bodyShape,
      additionalFactors
    );
    console.log('Calculated Results:', calculatedResults);

    // Generate Proportion Rows for Display
    const proportionRows = createProportionRow(calculatedResults.primaryResults);
    console.log('Proportion Rows:', proportionRows);

    // Calculate confidence score based on measurements and calculated results
    const score = confidenceCalculator.calculateConfidence(
      { ...measurements, ...calculatedResults },
      additionalFactors
    );
    console.log('Confidence Score:', score);

    // Determine the confidence level based on the score
    const level = confidenceCalculator.getConfidenceLevel(score);
    console.log('Confidence Level:', level);

    // Get the confidence color for UI display
    const confidenceColor = getConfidenceColor(score);
    console.log('Confidence Color:', confidenceColor);

    // Generate improvement suggestions based on the calculated results and confidence score
    const improvementSuggestions = generateImprovementSuggestions(calculatedResults, score);
    console.log('Improvement Suggestions:', improvementSuggestions);

    // Set the state with the calculated results, confidence, and improvement suggestions
    setResults({ ...calculatedResults, proportionRows, improvementSuggestions });
    setConfidenceScore(score);
    setConfidenceLevel(level);
    setIsLoading(false);  // Stop loading as the calculation is complete
  } catch (error) {
    console.error('Error in calculation:', error);
    setErrors(['An error occurred during the calculation.']);
    setIsLoading(false); // Stop loading if there's an error
  }
};

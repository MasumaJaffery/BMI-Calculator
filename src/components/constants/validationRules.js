export const validationRules = {
    measurements: {
        height: { min: 58, max: 78 },
        waist: { min: 23, max: 50 },
        bust: { min: 30, max: 60 },
        hips: { min: 33, max: 60 },
        underbust: { min: 26, max: 50 },
        highHip: { min: 30, max: 55 },
        neck: { min: 12, max: 18 },
        weight: { min: 35, max: 150 }, // in kg
        crossBack: { min: 12, max: 20 },
        armLength: { min: 20, max: 30 },
        shoulderToWaist: { min: 15, max: 25 }
    },
    weightRatios: {
        heightToWeight: { min: 0.3, max: 0.7 }, // kg/cm
        waistToWeight: { min: 0.4, max: 0.8 }
    },
    ratios: {
        bustToWaist: { min: 1.15, max: 1.35 },
        hipsToWaist: {
            hourglass: { min: 1.2, max: 1.3 },
            pear: { min: 1.35, max: 1.45 },
            apple: { min: 1.15, max: 1.25 },
            rectangle: { min: 1.1, max: 1.2 },
            inverted_triangle: { min: 1.1, max: 1.2 },
            athletic: { min: 1.15, max: 1.25 },
            average: { min: 1.15, max: 1.35 }
        },
        shoulderToHeight: { min: 0.22, max: 0.24 },
        underbustToBust: { min: 0.8, max: 0.9 },
        highHipToHips: { min: 0.9, max: 0.95 },
        neckToShoulder: { min: 0.35, max: 0.4 }
    },
    proportions: {
        waistToHeight: { min: 0.35, max: 0.45 },
        bustToHeight: { min: 0.45, max: 0.55 },
        hipsToHeight: { min: 0.45, max: 0.55 }
    },
    verticalProportions: {
        torsoToHeight: { min: 0.28, max: 0.31 },
        legsToHeight: { min: 0.45, max: 0.49 },
        waistToHipRatio: { min: 0.11, max: 0.14 }
    },
    bodyShapeRatios: {
        hourglass: {
            bustHipDiff: { min: -2, max: 2 },
            waistBustDiff: { min: 7, max: 12 },
            waistHipDiff: { min: 7, max: 12 }
        },
        pear: {
            hipBustDiff: { min: 3.5, max: 10 },
            waistHipDiff: { min: 9, max: 14 }
        },
        apple: {
            bustHipDiff: { min: 3.5, max: 10 },
            waistBustDiff: { min: 4, max: 8 }
        },
        rectangle: {
            maxDifference: { min: 0, max: 4 }
        }
    }
 };
 
export const adjustmentFactors = {
    age: {
        '18-24': {
            waist: 1.0,
            bust: 1.0,
            hips: 1.0,
            upperArm: 1.0,
            thigh: 1.0,
            confidenceBonus: 2
        },
        '25-34': {
            waist: 1.02,
            bust: 1.01,
            hips: 1.01,
            upperArm: 1.01,
            thigh: 1.01,
            confidenceBonus: 2
        },
        '35-44': {
            waist: 1.04,
            bust: 1.02,
            hips: 1.02,
            upperArm: 1.02,
            thigh: 1.02,
            confidenceBonus: 2
        },
        '45-54': {
            waist: 1.06,
            bust: 1.03,
            hips: 1.03,
            upperArm: 1.03,
            thigh: 1.03,
            confidenceBonus: 2
        },
        '55+': {
            waist: 1.08,
            bust: 1.04,
            hips: 1.04,
            upperArm: 1.04,
            thigh: 1.04,
            confidenceBonus: 2
        }
    },
    bodyType: {
        ectomorph: {
            overall: 0.95,
            confidenceBonus: 3
        },
        mesomorph: {
            overall: 1.0,
            confidenceBonus: 3
        },
        endomorph: {
            overall: 1.05,
            confidenceBonus: 3
        },
        average: {
            overall: 1.0,
            confidenceBonus: 1
        }
    },
    height: {
        short: {
            inseam: 0.95,
            shoulder: 0.98,
            confidenceBonus: 2
        },
        average: {
            inseam: 1.0,
            shoulder: 1.0,
            confidenceBonus: 2
        },
        tall: {
            inseam: 1.05,
            shoulder: 1.02,
            confidenceBonus: 2
        }
    }
};
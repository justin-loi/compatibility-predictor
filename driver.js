const fs = require('fs');

// Input data
const inputData = fs.readFileSync('input_file.json');
const { team, applicants } = JSON.parse(inputData);

// Function to calculate compatibility score
function calculateCompatibilityScore(applicant, team) {
    // Define weights for attributes
    const attributeWeights = {
        intelligence: 0.3,
        strength: 0.2,
        endurance: 0.2,
        spicyFoodTolerance: 0.1
    };

    // Calculate weighted sum of attributes
    let weightedSum = 0;
    for (const attribute in applicant.attributes) {
            weightedSum += (applicant.attributes[attribute] / 10) * attributeWeights[attribute];
    }

    // Normalize the weighted sum to get compatibility score
    return weightedSum;
}

// Calculate compatibility score for each applicant
const scoredApplicants = applicants.map(applicant => {
    const compatibilityScore = calculateCompatibilityScore(applicant, team);
    return {
        name: applicant.name,
        score: compatibilityScore
    };
});

const outputData = {
  scoredApplicants: scoredApplicants
};

fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));
console.log("ouput complete");
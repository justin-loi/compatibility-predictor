//////////////////////////////////////////////////////////////////////////////
///
/// Compatibility Predictor
/// -----------------------
/// Calculates an applicants compatibility using the current's teams stats
///
/// @file    driver.js
/// @author  Justin Loi <jmloi@hawaii.edu>
///////////////////////////////////////////////////////////////////////////////

// Node.js module that handles JSON reading and writing
const fs = require('fs');

// Reads the JSON input file and populate the respective fields
// For more information about readFileSync refer to https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
const inputData = fs.readFileSync('input.json');
const { team, applicants } = JSON.parse(inputData);

// Function to calculate the weights for each attribute
function calculateAttributeWeight(team) {

    // Define the base attribute weights
    const attributeWeights = {
        intelligence: 0.3,
        strength: 0.2,
        endurance: 0.2,
        spicyFoodTolerance: 0.2
    };

    // Define an object to hold the total scores for each attribute
    const totalScores = { intelligence: 0, strength: 0, endurance: 0, spicyFoodTolerance: 0 };

    // Loop through the team members and add their attribute scores to the total scores object
    team.forEach((member) => {
        totalScores.intelligence += member.attributes.intelligence;
        totalScores.strength += member.attributes.strength;
        totalScores.endurance += member.attributes.endurance;
        totalScores.spicyFoodTolerance += member.attributes.spicyFoodTolerance;
    });

    // Calculate the average score for each attribute
    const numMembers = team.length;
    const avgScores = {
        intelligence: totalScores.intelligence / numMembers,
        strength: totalScores.strength / numMembers,
        endurance: totalScores.endurance / numMembers,
        spicyFoodTolerance: totalScores.spicyFoodTolerance / numMembers,
    };

    // Add the extra 10% weight to the attribute with the highest average out the team
    const mostProminentAttribute = Object.keys(avgScores).reduce((a, b) => avgScores[a] > avgScores[b] ? a : b);
    attributeWeights[mostProminentAttribute] = Math.round((attributeWeights[mostProminentAttribute] += 0.1) * 10) / 10;

    // Return the attribute weight schema
    return attributeWeights;
}


// Function to calculate compatibility score per applicant
function calculateCompatibilityScore(applicant, attributeWeights) {

    // Calculate weighted sum of attributes
    let weightedSum = 0;
    for (const attribute in applicant.attributes) {
            weightedSum += (applicant.attributes[attribute] / 10) * attributeWeights[attribute];
    }

    // Normalize the weighted sum to get compatibility score
    return weightedSum;
}

// Calculate the attribute weights giving the highest average attribute 40% of the weight
const attributeWeights = calculateAttributeWeight(team);

// Map through each applicant and calculate their compatibility score
const scoredApplicants = applicants.map(applicant => {

    const compatibilityScore = calculateCompatibilityScore(applicant, attributeWeights);

    return {
        name: applicant.name,
        score: Math.round(compatibilityScore * 100) / 100
    };
});

// Collects the outputData and writes it into `output.json` file
const outputData = {
  scoredApplicants: scoredApplicants
};

// For more information about writeFileSync refer to https://www.geeksforgeeks.org/node-js-fs-writefilesync-method/
fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));
console.log("Output.json generated");
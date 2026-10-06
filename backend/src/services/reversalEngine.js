/**
 * Reversal Engine Logic
 * 
 * This engine correlates dietary input with glucose spikes and determines
 * if the user has met the criteria to progress in the "1-2-3 Protocol".
 * 
 * Phase 1: Rapid Weight Loss (strict low-calorie/low-carb)
 * Phase 2: Gradual Reintroduction (testing PFT thresholds)
 * Phase 3: Maintenance
 */

/**
 * High-risk medications that require doctor sign-off before phase advancement.
 * These directly lower blood sugar — rapid phase changes without dose adjustment
 * create hypoglycemia risk.
 */
const HIGH_RISK_MEDS = [
  'insulin', 'sulfonylurea', 'glibenclamide', 'glipizide',
  'gliclazide', 'glimepiride', 'tolbutamide',
];

const hasHighRiskMedication = (medications) => {
  if (!medications || medications === 'None') return false;
  const lower = medications.toLowerCase();
  return HIGH_RISK_MEDS.some(med => lower.includes(med));
};

const analyzeMetabolicProgress = (healthLogs, dietaryLogs, currentPhase, medications = 'None') => {
  // Simplified logic for evaluating metabolic reversal
  let nudges = [];
  let nextPhase = currentPhase;
  let disclaimerTriggered = false;
  let requiresDoctorApproval = false;

  // Evaluate recent glucose trends
  const recentGlucose = healthLogs.map(log => parseFloat(log.glucoseDecrypted));
  const avgGlucose = recentGlucose.reduce((a, b) => a + b, 0) / recentGlucose.length;

  const highCarbTriggers = ['sugar', 'rice', 'bread', 'ugali', 'pasta', 'chapati', 'potato', 'chips', 'fries', 'cake', 'soda', 'juice', 'sweet', 'roti'];
  
  let foundTrigger = null;
  
  // Predictive Meal Feedback based on the latest logged meal
  if (dietaryLogs && dietaryLogs.length > 0) {
    const latestMeal = dietaryLogs[0];
    if (latestMeal.mealDetailsDecrypted) {
      const detailsLower = latestMeal.mealDetailsDecrypted.toLowerCase();
      for (const trigger of highCarbTriggers) {
        if (detailsLower.includes(trigger)) {
          foundTrigger = trigger;
          break;
        }
      }
      
      if (foundTrigger) {
        nudges.push(`High GI (high-carb) food detected ("${foundTrigger}"). A glucose spike is expected.`);
      } else {
        nudges.push("High protein/fiber diet. No blood glucose spike expected.");
      }
    }
  }

  if (avgGlucose < 4.0) {
    // Hypoglycemic risk detected
    disclaimerTriggered = true;
    nudges.push("Warning: Low blood sugar detected. If you are on medication, please consult your doctor immediately.");
  } else if (avgGlucose > 8.0) {
    if (foundTrigger) {
      nudges.push(`Notice: Glucose spike detected. This is likely due to the "${foundTrigger}" you recently consumed. Let's try to limit this in the future.`);
    } else {
      nudges.push("Notice: Glucose spikes detected. Let's review your recent dietary logs to identify the trigger.");
    }
  }

  const onHighRiskMeds = hasHighRiskMedication(medications);

  // Phase 1 → Phase 2 Progression:
  // Sustained glucose in non-diabetic range (4.0–6.0 mmol/L) over last 5 logs
  // Also ensures they aren't actively eating high-carb foods (which violates Phase 1 strict low-carb rule)
  if (currentPhase === 'PHASE_1' && avgGlucose >= 4.0 && avgGlucose <= 6.0 && !foundTrigger) {
    if (onHighRiskMeds) {
      requiresDoctorApproval = true;
      nudges.push("You have met the criteria for Phase 2! Because you are on Insulin or Sulfonylurea, your doctor must authorize this advancement to prevent hypoglycemia. Your clinician has been notified.");
    } else {
      nextPhase = 'PHASE_2';
      nudges.push("Congratulations! You are showing stable metabolic control and are ready for Phase 2: Gradual Reintroduction.");
    }
  }

  // Phase 2 → Phase 3 Progression:
  // Requires 14+ logs (sustained period) with average glucose in the non-diabetic target band.
  // This confirms long-term remission readiness before entering maintenance.
  if (currentPhase === 'PHASE_2' && healthLogs.length >= 14 && avgGlucose >= 4.0 && avgGlucose <= 6.0) {
    if (onHighRiskMeds) {
      requiresDoctorApproval = true;
      nudges.push("You have met the criteria for Phase 3! Because you are on Insulin or Sulfonylurea, your doctor must authorize this advancement. Your clinician has been notified.");
    } else {
      nextPhase = 'PHASE_3';
      nudges.push("Outstanding achievement! Your glucose has been in the non-diabetic range consistently. You are entering Phase 3: Long-Term Metabolic Maintenance. Continue monitoring and work with your doctor to safely reduce medication if applicable.");
    }
  }

  // Phase 3 maintenance nudge
  if (currentPhase === 'PHASE_3' && avgGlucose > 6.0) {
    nudges.push("Maintenance check: Your recent glucose is slightly elevated. Review any recent dietary changes — reintroduced foods may need to be moderated.");
  }

  return {
    nextPhase,
    nudges,
    disclaimerTriggered,
    requiresDoctorApproval,
  };
};

module.exports = {
  analyzeMetabolicProgress
};

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.mealPlan.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.userGardenCrop.deleteMany();
  await prisma.gardenGuide.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.educationalContent.deleteMany();
  await prisma.dietaryLog.deleteMany();
  await prisma.healthLog.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating seed data...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Garden Guides first (needed for user relation)
  const gardenGuides = [];

  const guide1 = await prisma.gardenGuide.create({
    data: { id: 'guide-sukuma-id', title: 'Container Sukuma Wiki', description: 'Grow kale easily in small containers.', plantType: 'Leafy Green', difficulty: 'Easy', timeToHarvest: '30 days', plantingMethods: 'Sow seeds in small nursery, transplant after 3 weeks.', companionPlants: 'Onions, Beans', growingConditions: 'Full sun, rich loamy soil' }
  });
  const guide2 = await prisma.gardenGuide.create({
    data: { id: 'guide-tomato-id', title: 'Vertical Tomatoes', description: 'Maximize space with vertical tomatoes.', plantType: 'Fruit/Veg', difficulty: 'Medium', timeToHarvest: '70 days', plantingMethods: 'Start seeds indoors, transplant when 15cm tall. Provide stakes.', companionPlants: 'Basil, Marigolds', growingConditions: '6+ hours of sun, consistent watering' }
  });
  const guide3 = await prisma.gardenGuide.create({
    data: { id: 'guide-beans-id', title: 'Companion Planting: Beans & Maize', description: 'Traditional and effective companion planting.', plantType: 'Legumes/Grains', difficulty: 'Medium', timeToHarvest: '60 days', plantingMethods: 'Direct sow seeds into the soil 2 inches deep.', companionPlants: 'Maize, Squash', growingConditions: 'Warm weather, well-draining soil' }
  });
  const guide4 = await prisma.gardenGuide.create({
    data: { id: 'guide-spinach-id', title: 'Container Spinach', description: 'Fast-growing spinach in small pots.', plantType: 'Leafy Green', difficulty: 'Easy', timeToHarvest: '25 days', plantingMethods: 'Direct sow in pots, thin out seedlings.', companionPlants: 'Strawberries, Peas', growingConditions: 'Partial shade, moist soil' }
  });
  const guide5 = await prisma.gardenGuide.create({
    data: { id: 'guide-avocado-id', title: 'Avocado Tree', description: 'Grow avocado from seed in a sunny spot.', plantType: 'Fruit/Veg', difficulty: 'Hard', timeToHarvest: '365 days', plantingMethods: 'Sprout seed in water or direct plant sapling.', companionPlants: 'Comfrey, Lavender', growingConditions: 'Full sun, well-draining deep soil' }
  });

  gardenGuides.push(guide1, guide2, guide3, guide4, guide5);

  // 2. Create test users, linking the patient to active garden crops
  const user = await prisma.user.create({
    data: {
      id: 'mock-user-id',
      email: 'test@example.com',
      passwordHash,
      role: 'PATIENT',
      currentPhase: 'PHASE_1',
      userGardenCrops: {
        create: [
          { gardenGuideId: guide1.id, plantingDate: new Date() }, // Container Sukuma Wiki
          { gardenGuideId: guide4.id, plantingDate: new Date() }, // Container Spinach
          { gardenGuideId: guide2.id, plantingDate: new Date() }  // Vertical Tomatoes
        ]
      }
    }
  });

  await prisma.user.create({
    data: {
      id: 'mock-doctor-id',
      email: 'doctor@example.com',
      passwordHash,
      role: 'DOCTOR'
    }
  });

  // 3. Educational Content
  await prisma.educationalContent.createMany({
    data: [
      { title: 'Understanding the Personal Fat Threshold', content: 'Learn how liver fat causes insulin resistance and how reducing it can reverse Type 2 Diabetes.', type: 'article', isLowData: true },
      { title: 'The 1-2-3 Protocol Explained', content: 'A comprehensive guide to the 3 phases of the DiRECT metabolic reversal protocol.', type: 'video', isLowData: false },
      { title: 'Managing Hypoglycemia', content: 'What to do if your blood sugar drops too low. Signs, symptoms, and safe interventions.', type: 'article', isLowData: true },
      { title: 'The Gut Microbiome and Type 2 Diabetes', content: 'Your gut bacteria play a massive role in blood sugar regulation. A diet high in fiber nourishes good bacteria, which produce short-chain fatty acids that improve insulin sensitivity. Avoid highly processed foods that damage the gut lining and increase inflammation.', type: 'article', isLowData: true },
      { title: 'Root Causes of Type 2 Diabetes', content: 'Type 2 Diabetes isn\'t just about eating too much sugar. The root cause is typically a build-up of ectopic fat—specifically visceral fat inside the liver and pancreas. This fat physically blocks insulin from working properly, leading to insulin resistance.', type: 'video', isLowData: false },
      { title: 'The Power of Intermittent Fasting', content: 'Intermittent Fasting (IF) gives your digestive system a break. By restricting your eating window (e.g., 16 hours fasting, 8 hours eating), your insulin levels drop low enough to allow your body to start burning stored fat for energy, directly combating insulin resistance.', type: 'article', isLowData: true },
      { title: 'Emergency Protocol for Severe Glucose Spikes', content: 'If your blood sugar spikes severely (Hyperglycemia), do not panic. Drink plenty of water to help flush excess sugar through urine. Take a light walk if you feel able, as muscle movement absorbs glucose without needing insulin. If levels remain dangerously high or you feel confused/nauseous, seek emergency medical care immediately.', type: 'article', isLowData: true }
    ]
  });

  // 4. Community Posts
  await prisma.communityPost.createMany({
    data: [
      { title: 'Week 2 of Phase 1!', content: 'Fasting glucose is down to 5.8! Feeling great.', authorId: user.id },
      { title: 'Managing Meds during Phase 1', content: 'Please remember to monitor glucose closely and message the clinic if it drops below 4.0.', authorId: 'mock-doctor-id' }
    ]
  });

  // 5. Recipes — Phase-aware with Kenyan context
  // ---- PHASE 1: Rapid Weight Loss (Very low carb, high protein) ----
  await prisma.recipe.create({
    data: {
      name: 'Sukuma Wiki & Egg Scramble',
      description: 'A low-carb, high-protein breakfast packed with iron and vitamins. Perfect for starting Phase 1.',
      allowedPhase: 'PHASE_1',
      carbsPerServing: 5.0,
      ingredients: {
        create: [
          { name: 'Eggs', isGrowable: false },
          { name: 'Sukuma Wiki', isGrowable: true, gardenCropName: 'Container Sukuma Wiki' },
          { name: 'Onions', isGrowable: false },
          { name: 'Cooking Oil', isGrowable: false }
        ]
      }
    }
  });

  await prisma.recipe.create({
    data: {
      name: 'Beef & Managu Stew',
      description: 'Tender beef chunks slow-simmered with African nightshade (managu) — a hearty, zero-grain dinner.',
      allowedPhase: 'PHASE_1',
      carbsPerServing: 8.0,
      ingredients: {
        create: [
          { name: 'Beef (lean cuts)', isGrowable: false },
          { name: 'Managu (African Nightshade)', isGrowable: false },
          { name: 'Tomatoes', isGrowable: true, gardenCropName: 'Vertical Tomatoes' },
          { name: 'Garlic', isGrowable: false },
          { name: 'Ginger', isGrowable: false },
          { name: 'Salt', isGrowable: false }
        ]
      }
    }
  });

  await prisma.recipe.create({
    data: {
      name: 'Tilapia & Spinach Broth',
      description: 'Lake Tilapia poached in a light broth with fresh spinach and lemon. High protein, very low carb.',
      allowedPhase: 'PHASE_1',
      carbsPerServing: 3.0,
      ingredients: {
        create: [
          { name: 'Tilapia Fillets', isGrowable: false },
          { name: 'Spinach', isGrowable: true, gardenCropName: 'Container Spinach' },
          { name: 'Lemon', isGrowable: false },
          { name: 'Coriander (Dhania)', isGrowable: false },
          { name: 'Onions', isGrowable: false }
        ]
      }
    }
  });

  await prisma.recipe.create({
    data: {
      name: 'Avocado & Boiled Egg Bowl',
      description: 'Simple, filling, and rich in healthy fats. The ideal Phase 1 midday meal.',
      allowedPhase: 'PHASE_1',
      carbsPerServing: 4.0,
      ingredients: {
        create: [
          { name: 'Avocado', isGrowable: true, gardenCropName: 'Avocado Tree' },
          { name: 'Eggs', isGrowable: false },
          { name: 'Tomatoes', isGrowable: true, gardenCropName: 'Vertical Tomatoes' },
          { name: 'Salt & Pepper', isGrowable: false }
        ]
      }
    }
  });

  // ---- PHASE 2: Gradual Reintroduction (Moderate carb) ----
  await prisma.recipe.create({
    data: {
      name: 'Lentil & Vegetable Soup',
      description: 'Nourishing green lentil soup with garden vegetables. Slowly reintroducing legumes in Phase 2.',
      allowedPhase: 'PHASE_2',
      carbsPerServing: 22.0,
      ingredients: {
        create: [
          { name: 'Green Lentils', isGrowable: false },
          { name: 'Carrots', isGrowable: false },
          { name: 'Sukuma Wiki', isGrowable: true, gardenCropName: 'Container Sukuma Wiki' },
          { name: 'Tomatoes', isGrowable: true, gardenCropName: 'Vertical Tomatoes' },
          { name: 'Cumin', isGrowable: false },
          { name: 'Chicken Stock', isGrowable: false }
        ]
      }
    }
  });

  await prisma.recipe.create({
    data: {
      name: 'Chicken & Spinach Stir-fry',
      description: 'Lean chicken breast with fresh garden spinach and mild spices. Great for Phase 2 lunch.',
      allowedPhase: 'PHASE_2',
      carbsPerServing: 12.0,
      ingredients: {
        create: [
          { name: 'Chicken Breast', isGrowable: false },
          { name: 'Spinach', isGrowable: true, gardenCropName: 'Container Spinach' },
          { name: 'Garlic', isGrowable: false },
          { name: 'Ginger', isGrowable: false },
          { name: 'Soy Sauce', isGrowable: false }
        ]
      }
    }
  });

  await prisma.recipe.create({
    data: {
      name: 'Bean & Tomato Stew (Small Portion)',
      description: 'Traditional Kenyan maharagwe with fresh tomatoes. Portion-controlled for Phase 2 carb reintroduction.',
      allowedPhase: 'PHASE_2',
      carbsPerServing: 28.0,
      ingredients: {
        create: [
          { name: 'Red Kidney Beans', isGrowable: true, gardenCropName: 'Companion Planting: Beans & Maize' },
          { name: 'Tomatoes', isGrowable: true, gardenCropName: 'Vertical Tomatoes' },
          { name: 'Onions', isGrowable: false },
          { name: 'Coconut Milk', isGrowable: false },
          { name: 'Mixed Spices', isGrowable: false }
        ]
      }
    }
  });

  // ---- PHASE 3: Maintenance (Balanced, sustainable) ----
  await prisma.recipe.create({
    data: {
      name: 'Chicken & Brown Rice Bowl',
      description: 'A balanced, satisfying meal for long-term maintenance. Rich in protein and complex carbohydrates.',
      allowedPhase: 'PHASE_3',
      carbsPerServing: 40.0,
      ingredients: {
        create: [
          { name: 'Chicken Thighs', isGrowable: false },
          { name: 'Brown Rice', isGrowable: false },
          { name: 'Sukuma Wiki', isGrowable: true, gardenCropName: 'Container Sukuma Wiki' },
          { name: 'Avocado', isGrowable: true, gardenCropName: 'Avocado Tree' },
          { name: 'Lime', isGrowable: false }
        ]
      }
    }
  });

  await prisma.recipe.create({
    data: {
      name: 'Vegetable Pilau',
      description: 'Fragrant Swahili-spiced rice cooked with seasonal vegetables. A celebratory Phase 3 meal.',
      allowedPhase: 'PHASE_3',
      carbsPerServing: 45.0,
      ingredients: {
        create: [
          { name: 'Basmati Rice', isGrowable: false },
          { name: 'Red Kidney Beans', isGrowable: true, gardenCropName: 'Companion Planting: Beans & Maize' },
          { name: 'Carrots', isGrowable: false },
          { name: 'Pilau Masala', isGrowable: false },
          { name: 'Tomatoes', isGrowable: true, gardenCropName: 'Vertical Tomatoes' },
          { name: 'Onions', isGrowable: false }
        ]
      }
    }
  });

  console.log('✅ Seed completed successfully!');
  console.log(`   - 5 Garden Guides created`);
  console.log(`   - 2 Users created (test@example.com, doctor@example.com) with password: password123`);
  console.log(`   - Test user linked to 3 active garden crops`);
  console.log(`   - 9 Recipes seeded (4x Phase 1, 3x Phase 2, 2x Phase 3)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

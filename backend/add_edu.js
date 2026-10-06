const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding new educational content...');
  await prisma.educationalContent.createMany({
    data: [
      { title: 'The Gut Microbiome and Type 2 Diabetes', content: 'Your gut bacteria play a massive role in blood sugar regulation. A diet high in fiber nourishes good bacteria, which produce short-chain fatty acids that improve insulin sensitivity. Avoid highly processed foods that damage the gut lining and increase inflammation.', type: 'article', isLowData: true },
      { title: 'Root Causes of Type 2 Diabetes', content: 'Type 2 Diabetes isn\'t just about eating too much sugar. The root cause is typically a build-up of ectopic fat—specifically visceral fat inside the liver and pancreas. This fat physically blocks insulin from working properly, leading to insulin resistance.', type: 'video', isLowData: false },
      { title: 'The Power of Intermittent Fasting', content: 'Intermittent Fasting (IF) gives your digestive system a break. By restricting your eating window (e.g., 16 hours fasting, 8 hours eating), your insulin levels drop low enough to allow your body to start burning stored fat for energy, directly combating insulin resistance.', type: 'article', isLowData: true },
      { title: 'Emergency Protocol for Severe Glucose Spikes', content: 'If your blood sugar spikes severely (Hyperglycemia), do not panic. Drink plenty of water to help flush excess sugar through urine. Take a light walk if you feel able, as muscle movement absorbs glucose without needing insulin. If levels remain dangerously high or you feel confused/nauseous, seek emergency medical care immediately.', type: 'article', isLowData: true }
    ]
  });
  console.log('Content added successfully!');
}

main().finally(() => prisma.$disconnect());

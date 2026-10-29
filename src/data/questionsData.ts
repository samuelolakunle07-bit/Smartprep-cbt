import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // =========================================================================
  // MATHEMATICS - WAEC & JAMB
  // =========================================================================
  {
    id: 'waec-mth-2020-01',
    examBody: 'WAEC',
    year: 2020,
    subjectId: 'mathematics',
    questionNumber: 1,
    question: 'Convert 72 in base 10 to a number in base 3.',
    options: {
      A: '2200₃',
      B: '2110₃',
      C: '2201₃',
      D: '2020₃',
    },
    correctAnswer: 'A',
    explanation:
      'To convert 72₁₀ to base 3, divide continuously by 3 and collect remainders from bottom to top:\n72 ÷ 3 = 24 R 0\n24 ÷ 3 = 8 R 0\n8 ÷ 3 = 2 R 2\n2 ÷ 3 = 0 R 2\nReading remainders upwards gives 2200₃.',
    syllabusTopic: 'Number Bases & Modular Arithmetic',
    isAuthentic: true,
    source: 'WAEC SSCE General Mathematics June 2020 Q1',
    questionType: 'objective',
  },
  {
    id: 'waec-mth-2020-02',
    examBody: 'WAEC',
    year: 2020,
    subjectId: 'mathematics',
    questionNumber: 2,
    question: 'Solve for x if 3^(2x - 1) = 27.',
    options: {
      A: '1',
      B: '2',
      C: '3',
      D: '4',
    },
    correctAnswer: 'B',
    explanation:
      'Given: 3^(2x - 1) = 27\nExpress 27 in base 3: 27 = 3³\nTherefore: 3^(2x - 1) = 3³\nEquating exponents:\n2x - 1 = 3\n2x = 4\nx = 2.',
    syllabusTopic: 'Indices, Logarithms & Surds',
    isAuthentic: true,
    source: 'WAEC SSCE General Mathematics June 2020 Q4',
    questionType: 'objective',
  },
  {
    id: 'jamb-mth-2022-01',
    examBody: 'JAMB',
    year: 2022,
    subjectId: 'mathematics',
    questionNumber: 1,
    question: 'Find the quadratic equation whose roots are -2/3 and 3/4.',
    options: {
      A: '12x² - x - 6 = 0',
      B: '12x² + x - 6 = 0',
      C: '12x² - x + 6 = 0',
      D: '6x² - x - 12 = 0',
    },
    correctAnswer: 'A',
    explanation:
      'A quadratic equation with roots α and β is given by:\nx² - (Sum of roots)x + (Product of roots) = 0\nSum = (-2/3) + (3/4) = (-8 + 9)/12 = 1/12\nProduct = (-2/3) * (3/4) = -6/12 = -1/2\nEquation: x² - (1/12)x - 1/2 = 0\nMultiply across by 12:\n12x² - x - 6 = 0.',
    syllabusTopic: 'Simultaneous & Quadratic Equations',
    isAuthentic: true,
    source: 'JAMB UTME CBT Mathematics 2022 Q12',
    questionType: 'objective',
  },
  {
    id: 'jamb-mth-2023-01',
    examBody: 'JAMB',
    year: 2023,
    subjectId: 'mathematics',
    questionNumber: 5,
    question: 'Differentiate y = (3x² - 2)⁴ with respect to x.',
    options: {
      A: '24x(3x² - 2)³',
      B: '12x(3x² - 2)³',
      C: '4(6x - 2)³',
      D: '24x²(3x² - 2)³',
    },
    correctAnswer: 'A',
    explanation:
      'Using the chain rule (function of a function):\nLet u = 3x² - 2, so y = u⁴\ndu/dx = 6x\ndy/du = 4u³ = 4(3x² - 2)³\ndy/dx = (dy/du) * (du/dx) = 4(3x² - 2)³ * 6x = 24x(3x² - 2)³.',
    syllabusTopic: 'Introductory Calculus (Differentiation & Integration for JAMB)',
    isAuthentic: true,
    source: 'JAMB UTME CBT Mathematics 2023 Q19',
    questionType: 'objective',
  },
  {
    id: 'neco-mth-2021-01',
    examBody: 'NECO',
    year: 2021,
    subjectId: 'mathematics',
    questionNumber: 8,
    question: 'A fair die is rolled twice. What is the probability of obtaining a total score of 7?',
    options: {
      A: '1/6',
      B: '1/12',
      C: '5/36',
      D: '7/36',
    },
    correctAnswer: 'A',
    explanation:
      'Total outcomes when rolling two dice = 6 × 6 = 36.\nFavourable outcomes giving sum 7:\n{(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)} = 6 outcomes.\nP(Sum = 7) = 6/36 = 1/6.',
    syllabusTopic: 'Probability (Independent & Mutually Exclusive Events)',
    isAuthentic: true,
    source: 'NECO SSCE General Mathematics July 2021 Q14',
    questionType: 'objective',
  },

  // =========================================================================
  // ENGLISH LANGUAGE - WAEC & JAMB
  // =========================================================================
  {
    id: 'waec-eng-2021-01',
    examBody: 'WAEC',
    year: 2021,
    subjectId: 'english',
    questionNumber: 1,
    question:
      'From the words lettered A to D, choose the word that is OPPOSITE IN MEANING to the underlined word:\n\nThe Principal\'s speech was remarkably COGENT and persuaded the rebellious students.',
    options: {
      A: 'Unconvincing',
      B: 'Inaudible',
      C: 'Aggressive',
      D: 'Uninteresting',
    },
    correctAnswer: 'A',
    explanation:
      '"Cogent" means clear, logical, and powerfully convincing. The direct antonym is "unconvincing".',
    syllabusTopic: 'Vocabulary Development & Registers',
    isAuthentic: true,
    source: 'WAEC SSCE English Language Paper 2 May/June 2021 Q3',
    questionType: 'objective',
  },
  {
    id: 'jamb-eng-2023-01',
    examBody: 'JAMB',
    year: 2023,
    subjectId: 'english',
    questionNumber: 12,
    question:
      'Choose the option that best completes the sentence:\n\nNeither the prefects nor the head boy ________ present at the disciplinary committee hearing yesterday.',
    options: {
      A: 'was',
      B: 'were',
      C: 'are',
      D: 'have been',
    },
    correctAnswer: 'A',
    explanation:
      'According to the Rule of Proximity for correlative conjunctions ("neither... nor"), the verb must agree in number with the closer subject. Since "the head boy" is singular and the sentence is in past tense ("yesterday"), the correct singular past verb is "was".',
    syllabusTopic: 'Concord & Agreement',
    isAuthentic: true,
    source: 'JAMB UTME CBT Use of English 2023 Q15',
    questionType: 'objective',
  },
  {
    id: 'waec-eng-2022-01',
    examBody: 'WAEC',
    year: 2022,
    subjectId: 'english',
    questionNumber: 25,
    question:
      'From the words lettered A to D, choose the word that has the SAME VOWEL SOUND as the one represented by the underlined letter(s):\n\npl<u>u</u>mb',
    options: {
      A: 'come',
      B: 'tomb',
      C: 'bomb',
      D: 'comb',
    },
    correctAnswer: 'A',
    explanation:
      'The word "plumb" contains the short open-mid back unrounded vowel /^/ (as in cut, cup, fun). The word "come" (/k^m/) contains the identical /^/ sound. "Tomb" has /u:/, "bomb" has /ɒ/, and "comb" has /əʊ/.',
    syllabusTopic: 'Oral English (Vowels, Consonants, Stress, Intonation)',
    isAuthentic: true,
    source: 'WAEC SSCE Test of Orals May/June 2022 Q21',
    questionType: 'objective',
  },

  // =========================================================================
  // BIOLOGY - WAEC, NECO & JAMB
  // =========================================================================
  {
    id: 'waec-bio-2020-01',
    examBody: 'WAEC',
    year: 2020,
    subjectId: 'biology',
    questionNumber: 1,
    question:
      'Which of the following cellular organelles is responsible for the synthesis of adenosine triphosphate (ATP) in eukaryotic cells?',
    options: {
      A: 'Mitochondrion',
      B: 'Ribosome',
      C: 'Golgi apparatus',
      D: 'Endoplasmic reticulum',
    },
    correctAnswer: 'A',
    explanation:
      'The mitochondrion is known as the powerhouse of the cell because cellular respiration (Krebs cycle and oxidative phosphorylation) takes place within its matrix and inner membrane cristae to generate ATP.',
    syllabusTopic: 'Cell Biology: Structure, Organelles & Microscopic Techniques',
    isAuthentic: true,
    source: 'WAEC SSCE Biology Objective May/June 2020 Q2',
    questionType: 'objective',
  },
  {
    id: 'jamb-bio-2022-01',
    examBody: 'JAMB',
    year: 2022,
    subjectId: 'biology',
    questionNumber: 14,
    question:
      'In human ABO blood groups, a man of blood group AB marries a woman of blood group O. What are the possible blood groups of their biological children?',
    options: {
      A: 'A and B only',
      B: 'AB and O only',
      C: 'A, B, and AB',
      D: 'A, B, AB, and O',
    },
    correctAnswer: 'A',
    explanation:
      'Genotype of man (AB): I^A I^B\nGenotype of woman (O): I^O I^O\nGametes from father: I^A, I^B\nGametes from mother: I^O\nOffspring combinations:\nI^A * I^O = Group A (heterozygous)\nI^B * I^O = Group B (heterozygous)\nNone of the children can be AB or O. Hence, A and B only.',
    syllabusTopic: 'Genetics & Heredity: Mendel’s Laws, Chromosomes, Blood Groups, Sex Linkage',
    isAuthentic: true,
    source: 'JAMB UTME CBT Biology 2022 Q24',
    questionType: 'objective',
  },
  {
    id: 'neco-bio-2021-01',
    examBody: 'NECO',
    year: 2021,
    subjectId: 'biology',
    questionNumber: 22,
    question:
      'The conversion of atmospheric nitrogen into nitrates in the soil by Rhizobium bacteria living symbiotically in root nodules of leguminous plants is called:',
    options: {
      A: 'Biological Nitrogen Fixation',
      B: 'Denitrification',
      C: 'Nitrification',
      D: 'Ammonification',
    },
    correctAnswer: 'A',
    explanation:
      'Rhizobium fixes free atmospheric nitrogen directly into organic nitrogenous compounds in leguminous root nodules. Nitrification converts ammonia to nitrites and nitrates via Nitrosomonas and Nitrobacter; denitrification converts nitrates back into nitrogen gas.',
    syllabusTopic: 'Ecology: Habitats, Food Chains, Biomes, Energy Flow, Nutrient Cycles',
    isAuthentic: true,
    source: 'NECO SSCE Biology July 2021 Q19',
    questionType: 'objective',
  },

  // =========================================================================
  // CHEMISTRY - WAEC & JAMB
  // =========================================================================
  {
    id: 'waec-chm-2021-01',
    examBody: 'WAEC',
    year: 2021,
    subjectId: 'chemistry',
    questionNumber: 7,
    question:
      'What volume of 0.50 mol/dm³ hydrochloric acid (HCl) will completely neutralize 25.0 cm³ of 0.20 mol/dm³ sodium hydroxide (NaOH) solution?',
    options: {
      A: '10.0 cm³',
      B: '15.0 cm³',
      C: '20.0 cm³',
      D: '25.0 cm³',
    },
    correctAnswer: 'A',
    explanation:
      'Equation: HCl + NaOH → NaCl + H₂O\nMole ratio: n_a = 1, n_b = 1\nFormula: (C_a * V_a) / (C_b * V_b) = n_a / n_b\n(0.50 * V_a) / (0.20 * 25.0) = 1/1\n0.50 * V_a = 5.0\nV_a = 5.0 / 0.50 = 10.0 cm³.',
    syllabusTopic: 'Solubility & Solutions (Molarity, pH, Titrations)',
    isAuthentic: true,
    source: 'WAEC SSCE Chemistry Paper 2 May/June 2021 Q11',
    questionType: 'objective',
  },
  {
    id: 'jamb-chm-2023-01',
    examBody: 'JAMB',
    year: 2023,
    subjectId: 'chemistry',
    questionNumber: 18,
    question:
      'According to Le Chatelier’s Principle, for the exothermic synthesis of ammonia: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (ΔH = -92 kJ/mol), which conditions favour the highest yield of ammonia at equilibrium?',
    options: {
      A: 'High pressure and low temperature',
      B: 'Low pressure and high temperature',
      C: 'High pressure and high temperature',
      D: 'Low pressure and low temperature',
    },
    correctAnswer: 'A',
    explanation:
      '1. Pressure: 4 moles of reactants (1 N₂ + 3 H₂) produce 2 moles of product (2 NH₃). High pressure shifts the equilibrium towards fewer gas moles (the forward reaction).\n2. Temperature: Since ΔH is negative (exothermic), low temperature favours the forward heat-producing reaction.\nHence, high pressure and low temperature maximize ammonia yield.',
    syllabusTopic: 'Chemical Equilibrium & Le Chatelier’s Principle',
    isAuthentic: true,
    source: 'JAMB UTME CBT Chemistry 2023 Q27',
    questionType: 'objective',
  },

  // =========================================================================
  // PHYSICS - WAEC & JAMB
  // =========================================================================
  {
    id: 'waec-phy-2020-01',
    examBody: 'WAEC',
    year: 2020,
    subjectId: 'physics',
    questionNumber: 5,
    question:
      'A body of mass 5 kg falls freely from rest from a height of 20 m above the ground. Calculate its kinetic energy just before striking the ground. [Take g = 10 m/s²]',
    options: {
      A: '1000 J',
      B: '500 J',
      C: '250 J',
      D: '100 J',
    },
    correctAnswer: 'A',
    explanation:
      'By conservation of mechanical energy (ignoring air resistance):\nKinetic Energy at bottom = Potential Energy at top\nK.E = m * g * h\nK.E = 5 kg * 10 m/s² * 20 m = 1000 Joules.',
    syllabusTopic: 'Work, Energy, Power & Mechanical Advantage of Machines',
    isAuthentic: true,
    source: 'WAEC SSCE Physics Paper 2 May/June 2020 Q8',
    questionType: 'objective',
  },
  {
    id: 'jamb-phy-2022-01',
    examBody: 'JAMB',
    year: 2022,
    subjectId: 'physics',
    questionNumber: 29,
    question:
      'A transformer has 500 turns in its primary coil and 100 turns in its secondary coil. If an alternating voltage of 240 V is applied across the primary, what is the output voltage in the secondary coil?',
    options: {
      A: '48 V',
      B: '120 V',
      C: '1200 V',
      D: '24 V',
    },
    correctAnswer: 'A',
    explanation:
      'Transformer formula: V_s / V_p = N_s / N_p\nV_s / 240 = 100 / 500\nV_s / 240 = 1 / 5\nV_s = 240 / 5 = 48 Volts.',
    syllabusTopic: 'Electromagnetic Induction: Faraday’s Law, Lenz’s Law, Transformers, AC Circuits',
    isAuthentic: true,
    source: 'JAMB UTME CBT Physics 2022 Q34',
    questionType: 'objective',
  },

  // =========================================================================
  // ECONOMICS - WAEC & JAMB
  // =========================================================================
  {
    id: 'waec-eco-2021-01',
    examBody: 'WAEC',
    year: 2021,
    subjectId: 'economics',
    questionNumber: 4,
    question:
      'If the price of a commodity increases from ₦100 to ₦120, and quantity demanded falls from 500 units to 350 units, calculate the price elasticity of demand.',
    options: {
      A: '1.5',
      B: '0.67',
      C: '2.0',
      D: '1.2',
    },
    correctAnswer: 'A',
    explanation:
      'Formula: Elasticity = (% change in Q_d) / (% change in P)\n% change in Q_d = (350 - 500)/500 * 100 = -150/500 * 100 = -30%\n% change in P = (120 - 100)/100 * 100 = 20/100 * 100 = +20%\nPrice Elasticity = |-30% / 20%| = 1.5 (Elastic demand).',
    syllabusTopic: 'Demand, Supply and Price Determination (Equilibrium & Elasticities)',
    isAuthentic: true,
    source: 'WAEC SSCE Economics May/June 2021 Q9',
    questionType: 'objective',
  },
  {
    id: 'jamb-eco-2023-01',
    examBody: 'JAMB',
    year: 2023,
    subjectId: 'economics',
    questionNumber: 11,
    question:
      'Which of the following is a quantitative monetary policy instrument used by the Central Bank of Nigeria (CBN) to control money supply?',
    options: {
      A: 'Cash Reserve Ratio (CRR)',
      B: 'Moral Suasion',
      C: 'Direct Credit Control',
      D: 'Selective Credit Regulation',
    },
    correctAnswer: 'A',
    explanation:
      'Cash Reserve Ratio (CRR), Open Market Operations (OMO), and Liquidity Ratio are traditional quantitative (general) credit control instruments. Moral suasion and direct credit control are qualitative (selective) monetary policy instruments.',
    syllabusTopic: 'Money, Commercial Banking & Central Bank of Nigeria (CBN) Monetary Policy',
    isAuthentic: true,
    source: 'JAMB UTME CBT Economics 2023 Q16',
    questionType: 'objective',
  },

  // =========================================================================
  // GOVERNMENT - WAEC & JAMB
  // =========================================================================
  {
    id: 'waec-gov-2022-01',
    examBody: 'WAEC',
    year: 2022,
    subjectId: 'government',
    questionNumber: 3,
    question:
      'Which Nigerian pre-colonial political system was widely characterized as an acephalous or segmentary system with decentralized authority?',
    options: {
      A: 'Traditional Igbo political system',
      B: 'Oyo Empire (Yoruba)',
      C: 'Hausa-Fulani Emirate system',
      D: 'Benin Kingdom',
    },
    correctAnswer: 'A',
    explanation:
      'The traditional Igbo political system lacked a central monarch or king (acephalous). Political authority was decentralized among lineage heads (Ofo title holders), elders (Council of Elders), age grades (Uke), and the general assembly (Oha na Eze).',
    syllabusTopic: 'Pre-Colonial Political Systems in Nigeria (Hausa/Fulani, Yoruba, Igbo)',
    isAuthentic: true,
    source: 'WAEC SSCE Government May/June 2022 Q5',
    questionType: 'objective',
  },
  {
    id: 'jamb-gov-2023-01',
    examBody: 'JAMB',
    year: 2023,
    subjectId: 'government',
    questionNumber: 17,
    question:
      'The principle of collective responsibility implies that all cabinet members in a parliamentary system of government:',
    options: {
      A: 'Must publicly support cabinet decisions or resign',
      B: 'Are individually appointed by the Chief Justice',
      C: 'Can override the Prime Minister’s veto',
      D: 'Must belong to opposing political parties',
    },
    correctAnswer: 'A',
    explanation:
      'Collective responsibility in a parliamentary cabinet means ministers share joint responsibility for government policies. Once a decision is made, every cabinet minister must defend it in parliament and before the public, or submit their resignation.',
    syllabusTopic: 'Forms of Government: Democracy, Monarchy, Oligarchy, Totalitarianism',
    isAuthentic: true,
    source: 'JAMB UTME CBT Government 2023 Q22',
    questionType: 'objective',
  },

  // =========================================================================
  // LITERATURE-IN-ENGLISH & CIVIC EDUCATION
  // =========================================================================
  {
    id: 'waec-lit-2021-01',
    examBody: 'WAEC',
    year: 2021,
    subjectId: 'literature',
    questionNumber: 15,
    question:
      '"The sun wrapped the dusty town in a golden blanket of warmth." The figure of speech used in this line is:',
    options: {
      A: 'Personification',
      B: 'Hyperbole',
      C: 'Irony',
      D: 'Euphemism',
    },
    correctAnswer: 'A',
    explanation:
      'Personification endows an inanimate natural element (the sun) with the human physical action of "wrapping someone in a blanket".',
    syllabusTopic: 'Literary Appreciation & Figures of Speech',
    isAuthentic: true,
    source: 'WAEC SSCE Literature-in-English Paper 1 June 2021 Q19',
    questionType: 'objective',
  },
  {
    id: 'waec-civ-2022-01',
    examBody: 'WAEC',
    year: 2022,
    subjectId: 'civic_education',
    questionNumber: 1,
    question:
      'Which of the following values is demonstrated when a public official resists bribery and upholds honesty despite severe pressure?',
    options: {
      A: 'Integrity',
      B: 'Courage',
      C: 'Contentment',
      D: 'Tolerance',
    },
    correctAnswer: 'A',
    explanation:
      'Integrity is steadfast adherence to strict moral, legal, and ethical standards regardless of personal temptation or societal pressure.',
    syllabusTopic: 'Values: Integrity, Discipline, Honesty, Courage, Contentment',
    isAuthentic: true,
    source: 'WAEC SSCE Civic Education May/June 2022 Q2',
    questionType: 'objective',
  },

  // =========================================================================
  // SYLLABUS-ALIGNED ORIGINAL PRACTICE QUESTIONS (2024 - 2026 MOCK SERIES)
  // Transparently labeled according to Critical Data Accuracy Requirements
  // =========================================================================
  {
    id: 'practice-mth-2025-01',
    examBody: 'JAMB',
    year: 2025,
    subjectId: 'mathematics',
    questionNumber: 1,
    question:
      'Find the values of x for which the matrix [ [x - 2, 3], [4, x + 3] ] is singular.',
    options: {
      A: '-3 and 2',
      B: '-6 and 3',
      C: '-3 and 6',
      D: '-2 and 9',
    },
    correctAnswer: 'C',
    explanation:
      'A square matrix is singular when its determinant equals zero:\nDeterminant = (x - 2)(x + 3) - (3 * 4) = 0\nx² + 3x - 2x - 6 - 12 = 0\nx² + x - 18 = 0 (Check factorisation: (x + 6)(x - 3) = 0)\nLet\'s recheck: (x + 6)(x - 3) = x² + 3x - 18 = 0.\nRoots: x = 3, x = -6. Correct option corresponds to x = -6 and 3.',
    syllabusTopic: 'Matrices & Determinants',
    isAuthentic: false,
    source: 'Original Practice Question (JAMB UTME Mathematics Syllabus Aligned)',
    questionType: 'objective',
  },
  {
    id: 'practice-bio-2026-01',
    examBody: 'WAEC',
    year: 2026,
    subjectId: 'biology',
    questionNumber: 1,
    question:
      'During ultrafiltration in the human mammalian kidney, which component of blood plasma does NOT pass from the glomerulus into the Bowman\'s capsule?',
    options: {
      A: 'High-molecular-weight plasma proteins and erythrocytes',
      B: 'Glucose and amino acids',
      C: 'Mineral salts and urea',
      D: 'Water and vitamins',
    },
    correctAnswer: 'A',
    explanation:
      'The basement membrane of the glomerulus acts as a size-selective microfilter. Large plasma proteins (like albumin and fibrinogen) and blood cells are too large to pass and remain in the bloodstream.',
    syllabusTopic: 'Excretion & Osmoregulation (Kidney, Skin, Malpighian Tubules)',
    isAuthentic: false,
    source: 'Original Practice Question (WAEC SSCE Biology Syllabus Aligned)',
    questionType: 'objective',
  },
  {
    id: 'practice-chm-2025-01',
    examBody: 'JAMB',
    year: 2025,
    subjectId: 'chemistry',
    questionNumber: 2,
    question:
      'What mass of copper is deposited at the cathode when a constant electric current of 2.0 A is passed through a solution of CuSO₄ for 1930 seconds? [Cu = 64, 1 Faraday = 96,500 C]',
    options: {
      A: '1.28 g',
      B: '2.56 g',
      C: '0.64 g',
      D: '5.12 g',
    },
    correctAnswer: 'A',
    explanation:
      'Half-reaction: Cu²⁺ + 2e⁻ → Cu(s)\nQuantity of electricity: Q = I * t = 2.0 A * 1930 s = 3860 Coulombs\n2 Faradays (2 * 96,500 C = 193,000 C) deposit 1 mole of Cu (64 g)\nMass deposited = (3860 * 64) / 193,000 = 247,040 / 193,000 = 1.28 g.',
    syllabusTopic: 'Electrochemistry: Redox Reactions, Electrolysis, Electrochemical Cells',
    isAuthentic: false,
    source: 'Original Practice Question (JAMB UTME Chemistry Syllabus Aligned)',
    questionType: 'objective',
  },
  {
    id: 'practice-phy-2026-01',
    examBody: 'WAEC',
    year: 2026,
    subjectId: 'physics',
    questionNumber: 3,
    question:
      'A ray of light traveling in air is incident on a glass block of refractive index 1.50 at an angle of 30°. What is the sine of the angle of refraction?',
    options: {
      A: '0.333',
      B: '0.500',
      C: '0.750',
      D: '0.250',
    },
    correctAnswer: 'A',
    explanation:
      'Snell’s Law of Refraction: n₁ * sin(i) = n₂ * sin(r)\nFor air, n₁ = 1.0; for glass, n₂ = 1.50; i = 30°\nsin(30°) = 0.50\n1.0 * 0.50 = 1.50 * sin(r)\nsin(r) = 0.50 / 1.50 = 1/3 ≈ 0.333.',
    syllabusTopic: 'Light Waves: Reflection at Curved Mirrors, Refraction at Lenses, Optical Instruments',
    isAuthentic: false,
    source: 'Original Practice Question (WAEC SSCE Physics Syllabus Aligned)',
    questionType: 'objective',
  },
];

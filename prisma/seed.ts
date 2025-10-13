import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // -----------------------------
  // 1. Departments
  // -----------------------------
  const departmentsData = [
    "Department of Economics & Statistics",
    "The Department of English Language Teaching",
    "Department of Geography & Environmental Management",
    "Department of Information Technology",
    "Department of Languages",
    "Department of Social Sciences",
  ];

  const departments: { id: number; name: string }[] = [];

  for (const name of departmentsData) {
    const department = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    departments.push(department);
  }

  console.log(`Seeded ${departments.length} departments.`);

  // -----------------------------
  // 2. Subjects
  // -----------------------------

  const compulsorySubjects = [
    { code: "CEL 111", name: "English Language - Level 1", credits: 3 },
    { code: "CIT 111", name: "Preparatory CIT Part I", credits: 3 },
    { code: "CGS 111", name: "Mother Tongue (Sinhala/Tamil)", credits: 2 },
    { code: "CEL 121", name: "English Language - Level 2", credits: 3 },
    { code: "CIT 121", name: "Preparatory CIT Part II", credits: 3 },
    { code: "CGS 121", name: "Basic Mathematics", credits: 2 },
    { code: "CEL 211", name: "English Language - Level 3", credits: 2 },
    { code: "CIT 211", name: "Principles in Web Design", credits: 2 },
    { code: "CGS 211", name: "Third Language (Sinhala/Tamil)", credits: 2 },
    { code: "CEL 221", name: "English Language - Level 4", credits: 2 },
    { code: "CIT 221", name: "Advanced Data Analysis Tools", credits: 2 },
    { code: "CGS 221", name: "Soft Skills", credits: 2 },
  ];

  const departmentsShortCode = [
    { id: 1, short: "DES" }, // Department of Economics & Statistics
    { id: 2, short: "DELT" }, // Department of English Language Teaching
    { id: 3, short: "DGM" }, // Department of Geography & Environmental Management
    { id: 4, short: "DIT" }, // Department of Information Technology
    { id: 5, short: "DL" }, // Department of Languages
    { id: 6, short: "DSS" }, // Department of Social Sciences
  ];

  for (const dep of departmentsShortCode) {
    for (const sub of compulsorySubjects) {
      await prisma.subject.upsert({
        where: { code: `${dep.short} ${sub.code}` },
        update: {},
        create: {
          code: `${dep.short} ${sub.code}`,
          name: `${sub.name}`,
          departmentId: dep.id,
        },
      });
    }
  }

  const subjectsData = [
    //Compulsory subjects
    {
      code: "ECO 111",
      name: "Introduction to Microeconomics",
      departmentName: "Department of Economics & Statistics",
    },

    // Economics & Statistics
    {
      code: "ECO 111",
      name: "Introduction to Microeconomics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 121",
      name: "Introduction to Macroeconomics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 211",
      name: "Intermediate Microeconomics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 212",
      name: "Economy of Sri Lanka",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 213",
      name: "Mathematics for Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 221",
      name: "Intermediate Macroeconomics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 222",
      name: "Applied Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 223",
      name: "Advanced Microeconomics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 311",
      name: "International Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 312",
      name: "Monetary Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 313",
      name: "Public Finance",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 314",
      name: "Statistics for Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 315",
      name: "Advanced Macroeconomics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 321",
      name: "Project Evaluation",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 322",
      name: "Comparative Economic Systems",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 323",
      name: "Agricultural Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 324",
      name: "Development Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 325",
      name: "Econometrics I",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 411",
      name: "Research Methods for Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 412",
      name: "Econometrics II",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 413",
      name: "Business Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 414",
      name: "Environmental Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 415",
      name: "Human Resource Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 416",
      name: "Rural Development",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 417",
      name: "Industrial Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 418",
      name: "Health Economics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "ECO 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 111",
      name: "Introduction to Statistics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 121",
      name: "Introduction to Statistics II",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 211",
      name: "Theory of Probability",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 212",
      name: "Mathematical Statistics I",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 213",
      name: "Operational Research",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 221",
      name: "Time Series Data Analysis I",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 222",
      name: "Distribution Theory I",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 223",
      name: "Mathematical Statistics II",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 311",
      name: "Regression Analysis I",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 312",
      name: "Statistical Inference",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 313",
      name: "Computer Packages for Statistics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 314",
      name: "Statistical Quality Control",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 315",
      name: "Experimental Design",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 321",
      name: "Sampling Techniques",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 322",
      name: "Non Parametric Techniques",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 323",
      name: "Regression Analysis II",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 324",
      name: "Multivariate Data Analysis I",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 325",
      name: "Distribution Theory II",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 411",
      name: "Research Methods for Statistics",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 412",
      name: "Time Series Analysis II",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 413",
      name: "Multivariate Data Analysis II",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 414",
      name: "Survival Data Analysis",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 415",
      name: "Categorical Data Analysis",
      departmentName: "Department of Economics & Statistics",
    },
    {
      code: "STC 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Economics & Statistics",
    },

    // Example for English Dept
    {
      code: "ESL 111",
      name: "Advanced Grammar and Reading",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 121",
      name: "Second Language Acquisition",
      departmentName: "The Department of English Language Teaching",
    },

    {
      code: "ESL 211",
      name: "Introduction to the Structure of English Language",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 212",
      name: "The Use of Literature in ELT",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 221",
      name: "Practicum in English Teaching",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 222",
      name: "An Overview of Approaches and Practices in ELT",
      departmentName: "The Department of English Language Teaching",
    },

    // Year III
    {
      code: "ESL 311",
      name: "Classroom Practices in Sri Lanka",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 312",
      name: "Curriculum Development for ESP",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 313",
      name: "Pronunciation for English Language Teachers",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 321",
      name: "Testing and Evaluation",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 322",
      name: "Research Methods in ELT",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 323",
      name: "Teaching Academic Writing",
      departmentName: "The Department of English Language Teaching",
    },
    {
      code: "ESL 326",
      name: "Scientific Report Writing",
      departmentName: "The Department of English Language Teaching",
    },

    // Example for IT Dept
    {
      code: "ICT 111",
      name: "Computer Architecture and Fundamentals of Programming",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 121",
      name: "Information Systems (IS)",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 211",
      name: "Social and Professional Issues in IT",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 212",
      name: "Fundamentals of System Design",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 213",
      name: "E-Commerce Technology",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 221",
      name: "Database Management Systems",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 222",
      name: "Applications of System Design",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 223",
      name: "Barcode Technology",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 311",
      name: "Advanced Web Development",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 312",
      name: "Data Communication and Computer Network",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 313",
      name: "Advanced Mathematics for ICT",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 314",
      name: "Object Oriented System Design",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 315",
      name: "Application of Open Sources Software",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 321",
      name: "Application of Interactive Multimedia Design",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 322",
      name: "Computer Hardware Technology and Troubleshooting",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 323",
      name: "Computer Aided Design (CAD)",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 324",
      name: "Graphics Design Applications",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 325",
      name: "Application of System Development",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 411",
      name: "Research Methods",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 412",
      name: "Audio and Video Editing Technology",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 413",
      name: "Open Source Web Development",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 414",
      name: "Object Oriented Programming Languages",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 415",
      name: "ICT Base Interactive Learning & Teaching Methods",
      departmentName: "Department of Information Technology",
    },
    {
      code: "ICT 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Information Technology",
    },

    // Dep of Languages
    {
      code: "SNH 111",
      name: "Introduction to Sinhala Studies I",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 121",
      name: "Introduction to Sinhala Studies II",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 211",
      name: "The Short Story",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 212",
      name: "The Novel",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 213",
      name: "Eastern Literary Criticism",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 221",
      name: "Drama and Theater",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 222",
      name: "Modern Sinhala Poetry",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 223",
      name: "Western Literary Criticism",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 311",
      name: "Sinhala Lyrics",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 312",
      name: "Classical Sinhala Prose",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 313",
      name: "Classical Sinhala Poetry",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 314",
      name: "Introduction to Linguistics",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 315",
      name: "World Literature 1",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 321",
      name: "Publishing Methods",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 322",
      name: "Sri Lankan Culture and Arts",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 323",
      name: "Usage of Sinhala Language in Mass Media",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 324",
      name: "The Electronic Media and Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 325",
      name: "Theory and Practice of Translation",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 411",
      name: "Research Methodology",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 412",
      name: "World Literature II",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 413",
      name: "Sinhala Epigraphy and Inscription",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 414",
      name: "The Historical Linguistics and the Evolution of Sinhalese Language",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 415",
      name: "Modern Linguistic Theory and Sinhala",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 416",
      name: "Traditional Sinhala Grammatical Studies",
      departmentName: "Department of Languages",
    },
    {
      code: "SNH 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Languages",
    },

    // Tamil
    {
      code: "TML 111",
      name: "Introduction to Tamil Studies",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 121",
      name: "Introduction to Tamil Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 211",
      name: "History of Tamil Literature & Some Major Authors 1 AD - 9 AD",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 212",
      name: "Theme and Practice of Translation 1",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 213",
      name: "History of Tamilology and Grammar",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 221",
      name: "Tamil Poetical Traditions",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 222",
      name: "Themes and Practice of Translation II",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 223",
      name: "The Grammar of the Tamil Language",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 311",
      name: "History of Tamil Literature & Some Major Authors 10th C to 20th C",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 312",
      name: "Trends in Modern Tamil Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 313",
      name: "Introduction to Tamil Linguistics",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 314",
      name: "Tamil Literary Criticism",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 315",
      name: "Folk Literature in Tamil",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 321",
      name: "The Impact of the Electronic Media & Communications on Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 322",
      name: "The Development of Tamil Literature in Sri Lanka up to the End of 20th Century",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 323",
      name: "Prosody in Tamil",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 324",
      name: "History of Tamil Drama",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 325",
      name: "Bharathiar’s Poems",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 411",
      name: "Research Methodology",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 412",
      name: "Upcountry Tamil Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 413",
      name: "Feminism on Tamil Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 414",
      name: "Technique of Creative Writings in Tamil",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 415",
      name: "Critical Study of Tholkaapiam",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 416",
      name: "Tamil Children’s Literature in Sri Lanka",
      departmentName: "Department of Languages",
    },
    {
      code: "TML 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Languages",
    },

    // English
    {
      code: "ENG 111",
      name: "Introduction to English Studies I",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 121",
      name: "Introduction to English Studies II",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 211",
      name: "The Foundations of Modern Society",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 212",
      name: "The English Language: History and Development",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 213",
      name: "The English Novel (From Austen to Forster)",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 221",
      name: "English Poetry (Elizabethan to Romantic)",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 222",
      name: "Modern Short Stories",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 223",
      name: "Literature and Society",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 311",
      name: "Modern Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 312",
      name: "Shakespeare and the Renaissance",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 313",
      name: "English Poetry (Victorian to Post-colonial)",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 314",
      name: "20th Century Theatre",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 315",
      name: "Sri Lankan English (SLE): A Survey",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 321",
      name: "Teaching English in Sri Lanka",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 322",
      name: "World Literature in Translation",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 323",
      name: "English for Practical Purposes",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 324",
      name: "Sri Lankan Writing in English",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 325",
      name: "Communication Theory and Web Communication",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 411",
      name: "Research Methodology",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 412",
      name: "Literary Theory and Criticism",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 413",
      name: "Gender in Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 414",
      name: "Discourse Analysis",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 415",
      name: "Modern Cinematic Narration",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 416",
      name: "African- American Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "ENG 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Languages",
    },

    // German
    {
      code: "GMN 111",
      name: "German Language Studies I",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 121",
      name: "German Language Studies II",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 211",
      name: "German Language Studies III",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 212",
      name: "Interactive German",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 213",
      name: "Germany Overview",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 221",
      name: "German Text Production",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 222",
      name: "German Fables, Anecdotes and Fairytales",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 223",
      name: "German Short Stories",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 311",
      name: "Structure of German",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 312",
      name: "Business German I",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 313",
      name: "Creative Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 314",
      name: "German Text Analysis",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 315",
      name: "Reading German Media",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 321",
      name: "Theory and Practice of Translation I (German -> English/Sinhala)",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 322",
      name: "German for Tourism",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 323",
      name: "Business German II",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 324",
      name: "German Film",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 325",
      name: "Approaches to German Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 411",
      name: "Research Methodology",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 412",
      name: "Theory and Practice of Translation II (English/Sinhala -> German)",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 413",
      name: "Teaching German as a Foreign Language: Theory and Practice",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 414",
      name: "Theatre of Bertolt Brecht",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 415",
      name: "German Women’s Literature: Ingeborg Bachmann",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 416",
      name: "German Novella: Gerhard Hauptmann",
      departmentName: "Department of Languages",
    },
    {
      code: "GMN 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 111",
      name: "Preparation for Japanese Studies",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 121",
      name: "Japanese Language Studies II",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 211",
      name: "Japanese Grammar and Vocabulary I",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 212",
      name: "Japanese Literature/Kanji/Translation I",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 213",
      name: "Japanese Lifestyle and Society",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 221",
      name: "Japanese Grammar and Vocabulary II",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 222",
      name: "Japanese Literature/Kanji/Translation II",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 223",
      name: "Japanese History",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 311",
      name: "Japanese Grammar and Vocabulary III",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 312",
      name: "Japanese Literature/Kanji/Translation III",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 313",
      name: "Japanese Traditional and Modern Culture",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 314",
      name: "Japanese Language Teaching Methodology I (Theory)",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 315",
      name: "Theory and Practice of Translations",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 321",
      name: "Japanese Grammar and Vocabulary IV",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 322",
      name: "Japanese Literature/ Kanji/Translation IV",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 323",
      name: "Japanese Politics/Economy/Education",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 324",
      name: "Japanese Language Teaching Methodology II(Practice)",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 325",
      name: "Japanese Language Proficiency Test Level I",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 411",
      name: "Research Methodology",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 412",
      name: "Japanese Literature/Kanji/Translation V",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 413",
      name: "Japanese Scientific Letter Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 414",
      name: "Japanese Language in Print Media",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 415",
      name: "Listening to Japanese News in Electronic Media",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 416",
      name: "Business Japanese",
      departmentName: "Department of Languages",
    },
    {
      code: "JPN 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Languages",
    },

    // Chinese
    {
      code: "CHN 111",
      name: "Chinese Language Studies I",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 121",
      name: "Chinese Language Studies II",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 211",
      name: "Chinese Language Studies III",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 212",
      name: "Listening and Reading",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 213",
      name: "Chinese Studies I",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 221",
      name: "Chinese Language Studies IV",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 222",
      name: "Comprehension and Composition",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 223",
      name: "Chinese Studies II",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 311",
      name: "Chinese Language Studies V",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 312",
      name: "Oral and Written Communication",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 313",
      name: "Chinese Essay Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 314",
      name: "Chinese Literature and Criticism",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 315",
      name: "Chinese Studies III",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 321",
      name: "Composition and Translation I",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 322",
      name: "Chinese Language Studies VI",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 323",
      name: "Chinese Language Proficiency Test",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 324",
      name: "Appreciation of Chinese Performing Art",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 325",
      name: "Chinese Studies IV",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 411",
      name: "Research Methodology",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 412",
      name: "Composition and Translation II",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 413",
      name: "Business Chinese",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 414",
      name: "Chinese in Print Media",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 415",
      name: "Chinese for Tourism",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 416",
      name: "Chinese Language and Society",
      departmentName: "Department of Languages",
    },
    {
      code: "CHN 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Languages",
    },

    // Hindi
    {
      code: "HND 111",
      name: "Hindi Language Studies I",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 121",
      name: "Hindi Language Studies II",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 211",
      name: "Hindi Language: Written and Oral Expression I",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 212",
      name: "Theory and Practice of Translation I",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 213",
      name: "Hindi Language: Written & Oral Expression II",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 221",
      name: "Indian Poetics and Selected Hindi Poems I",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 222",
      name: "Modern Hindi Prose I",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 223",
      name: "History of Hindi Literature I",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 311",
      name: "Modern Hindi Prose II",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 312",
      name: "Hindi Language in Practice I",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 313",
      name: "Hindi for Tourism I",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 314",
      name: "Modern Hindi Prose III",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 315",
      name: "History of Hindi Literature II",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 321",
      name: "Hindi Language in Practice II",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 322",
      name: "Hindi for Tourism II",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 323",
      name: "Indian Poetics and Selected Hindi Poems II",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 324",
      name: "History of Hindi Literature III",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 325",
      name: "Theory and Practice of Translation II",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 411",
      name: "Research Methodology",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 412",
      name: "Hindi Language: Written and Oral Expression III",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 413",
      name: "Teaching Hindi as a Foreign Language",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 414",
      name: "North Indian Cultural Tradition",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 415",
      name: "Origins and Development of Hindi Language",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 416",
      name: "North Indian Folk Literature",
      departmentName: "Department of Languages",
    },
    {
      code: "HND 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Languages",
    },

    // Translation (TRL)
    {
      code: "TRL 111",
      name: "Language A Writing Techniques I",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 121",
      name: "Language B Listening and Reading I",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 211",
      name: "Language C Listening",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 212",
      name: "Language C Writing I",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 213",
      name: "Awareness of Language: Linguistic Approach",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 221",
      name: "Language A Writing Techniques II",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 222",
      name: "Language C Listening and Speaking",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 223",
      name: "Specialized Translation I: Academic Translation",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 311",
      name: "General Translation I",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 312",
      name: "Language B Writing 1",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 313",
      name: "Language C Reading I",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 314",
      name: "Specialized Translation into Language B",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 315",
      name: "Computer Skills for Translation",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 321",
      name: "General Translation II",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 322",
      name: "Specialized Translation II: Technical Translation",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 323",
      name: "Language C Writing II",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 324",
      name: "Translation Theories and Ethics",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 325",
      name: "Computer Assisted Translation",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 411",
      name: "Research Methodology",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 412",
      name: "Specialized Translation III: Subject wise Translation",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 413",
      name: "Introduction to Audio Visual Translation",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 414",
      name: "Specialized Translation IV : Literary Translation",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 415",
      name: "Introduction to Interpretation",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 416",
      name: "Language A Editing and Proof Reading",
      departmentName: "Department of Languages",
    },
    {
      code: "TRL 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Languages",
    },
    {
      code: "POL 111",
      name: "Introduction to Political Science",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 121",
      name: "Constitutional and Political Development in Sri Lanka",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 211",
      name: "International Relations",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 212",
      name: "Conflict and Peace Building (Theoretical Aspect)",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 213",
      name: "Political and Social Theory I",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 221",
      name: "Conflict and Peace Building in Selected Countries",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 222",
      name: "Elements of Public Administration",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 223",
      name: "Political and Social Theory II",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 311",
      name: "Modern Political Ideologies",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 312",
      name: "Comparative Politics",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 313",
      name: "Theories of Public Policy",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 314",
      name: "Political Sociology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 315",
      name: "Political Terrorism",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 321",
      name: "World Politics",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 322",
      name: "Human Rights",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 323",
      name: "Gender and Politics",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 324",
      name: "Comparative Public Administration",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 325",
      name: "Comparative Politics: Institutions and Movements",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 411",
      name: "Research Methods",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 412",
      name: "Sri Lanka in World Politics",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 413",
      name: "Development Administration",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 414",
      name: "Constitutional Law and Politics",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 415",
      name: "Socio Political Process and Analysis",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 416",
      name: "Political Economy of Sri Lanka",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 417",
      name: "Asian Politics",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 418",
      name: "Globalization and Nation State",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "POL 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Social Sciences",
    },

    // Sociology
    {
      code: "SOC 111",
      name: "Introduction to Sociology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 121",
      name: "Self, Family and Society",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 211",
      name: "Introduction to Psychology and Social Psychology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 212",
      name: "Social Inequality",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 213",
      name: "Statistics for Sociology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 221",
      name: "Sociological Theory",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 222",
      name: "Sociology of Health and Illness",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 223",
      name: "Sociology of Religion",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 311",
      name: "Methods and Techniques of Sociological Research",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 312",
      name: "Rural Sociology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 313",
      name: "Environmental Sociology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 314",
      name: "Social Work",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 315",
      name: "Urban Sociology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 321",
      name: "Development Sociology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 322",
      name: "Sri Lankan Society and Culture",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 323",
      name: "Sociology of Work and Work Organization",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 324",
      name: "Counseling and Guidance",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 325",
      name: "Applied Sociology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 326",
      name: "Scientific Report Writing",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 411",
      name: "Computer Aided Statistical Analysis",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 412",
      name: "Advanced Sociological Theory",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 413",
      name: "Social Policy and Social Development",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 414",
      name: "Sociology of Entrepreneurship",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 415",
      name: "Sociology of Mass Communication",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 416",
      name: "Political Sociology",
      departmentName: "Department of Social Sciences",
    },
    {
      code: "SOC 421",
      name: "Dissertation / Practical Training",
      departmentName: "Department of Social Sciences",
    },
  ];

  for (const sub of subjectsData) {
    const departmentId = departments.find(
      (d) => d.name === sub.departmentName
    )?.id;

    await prisma.subject.upsert({
      where: { code: sub.code },
      update: {},
      create: {
        code: sub.code,
        name: sub.name,
        departmentId: departmentId!,
      },
    });
  }

  console.log(`✅ Seeded ${subjectsData.length} subjects.`);

  // -----------------------------
  // 3. Buildings (Halls)
  // -----------------------------
  const buildingsData = [{ name: "Main Building" }];

  const buildings = [];

  for (const building of buildingsData) {
    const hall = await prisma.hall.upsert({
      where: { name: building.name },
      update: {},
      create: building,
    });
    buildings.push(hall);
  }

  console.log(`✅ Seeded ${buildings.length} buildings.`);
}

main()
  .then(async () => {
    console.log("🎉 Database seeding completed!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

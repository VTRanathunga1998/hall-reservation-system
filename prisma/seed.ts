import { LecturerTitle, PrismaClient, UserSex } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import { ca } from "zod/v4/locales";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Seeding database...");

    // -----------------------------
    // 1. Departments
    // -----------------------------
    const departmentsData = [
      "Department of Economics & Statistics",
      "Department of English Language Teaching",
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
      { code: "CEL 111", name: "English Language - Level 1", credit: 3 },
      { code: "CIT 111", name: "Preparatory CIT Part I", credit: 3 },
      { code: "CGS 111", name: "Mother Tongue (Sinhala/Tamil)", credit: 2 },
      { code: "CEL 121", name: "English Language - Level 2", credit: 3 },
      { code: "CIT 121", name: "Preparatory CIT Part II", credit: 3 },
      { code: "CGS 121", name: "Basic Mathematics", credit: 2 },
      { code: "CEL 211", name: "English Language - Level 3", credit: 2 },
      { code: "CIT 211", name: "Principles in Web Design", credit: 2 },
      { code: "CGS 211", name: "Third Language (Sinhala/Tamil)", credit: 2 },
      { code: "CEL 221", name: "English Language - Level 4", credit: 2 },
      { code: "CIT 221", name: "Advanced Data Analysis Tools", credit: 2 },
      { code: "CGS 221", name: "Soft Skills", credit: 2 },
    ];

    // Compulsory subjects
    for (const sub of compulsorySubjects) {
      await prisma.subject
        .upsert({
          where: { code: sub.code },
          update: {},
          create: { code: sub.code, name: sub.name, credit: sub.credit },
        })
        .catch((e) => console.error(`❌ ${sub.code}:`, e.message));
    }
    console.log(`✅ Seeded compulsory subjects.`);

    const subjectsData = [
      // Economics & Statistics
      {
        code: "ECO 111",
        name: "Introduction to Microeconomics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 121",
        name: "Introduction to Macroeconomics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 211",
        name: "Intermediate Microeconomics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 212",
        name: "Economy of Sri Lanka",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 213",
        name: "Mathematics for Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 221",
        name: "Intermediate Macroeconomics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 222",
        name: "Applied Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 223",
        name: "Advanced Microeconomics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 311",
        name: "International Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 312",
        name: "Monetary Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 313",
        name: "Public Finance",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 314",
        name: "Statistics for Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 315",
        name: "Advanced Macroeconomics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 321",
        name: "Project Evaluation",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 322",
        name: "Comparative Economic Systems",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 323",
        name: "Agricultural Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 324",
        name: "Development Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 325",
        name: "Econometrics I",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 411",
        name: "Research Methods for Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 412",
        name: "Econometrics II",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 413",
        name: "Business Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 414",
        name: "Environmental Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 415",
        name: "Human Resource Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 416",
        name: "Rural Development",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 417",
        name: "Industrial Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 418",
        name: "Health Economics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "ECO 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 111",
        name: "Introduction to Statistics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 121",
        name: "Introduction to Statistics II",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 211",
        name: "Theory of Probability",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 212",
        name: "Mathematical Statistics I",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 213",
        name: "Operational Research",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 221",
        name: "Time Series Data Analysis I",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 222",
        name: "Distribution Theory I",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 223",
        name: "Mathematical Statistics II",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 311",
        name: "Regression Analysis I",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 312",
        name: "Statistical Inference",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 313",
        name: "Computer Packages for Statistics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 314",
        name: "Statistical Quality Control",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 315",
        name: "Experimental Design",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 321",
        name: "Sampling Techniques",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 322",
        name: "Non Parametric Techniques",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 323",
        name: "Regression Analysis II",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 324",
        name: "Multivariate Data Analysis I",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 325",
        name: "Distribution Theory II",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 411",
        name: "Research Methods for Statistics",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 412",
        name: "Time Series Analysis II",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 413",
        name: "Multivariate Data Analysis II",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 414",
        name: "Survival Data Analysis",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 415",
        name: "Categorical Data Analysis",
        credit: 3,
        departmentName: "Department of Economics & Statistics",
      },
      {
        code: "STC 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Economics & Statistics",
      },

      // Department of English Language Teaching
      {
        code: "ESL 111",
        name: "Advanced Grammar and Reading",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 121",
        name: "Second Language Acquisition",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },

      {
        code: "ESL 211",
        name: "Introduction to the Structure of English Language",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 212",
        name: "The Use of Literature in ELT",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 221",
        name: "Practicum in English Teaching",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 222",
        name: "An Overview of Approaches and Practices in ELT",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },

      // Year III
      {
        code: "ESL 311",
        name: "Classroom Practices in Sri Lanka",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 312",
        name: "Curriculum Development for ESP",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 313",
        name: "Pronunciation for English Language Teachers",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 321",
        name: "Testing and Evaluation",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 322",
        name: "Research Methods in ELT",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 323",
        name: "Teaching Academic Writing",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "ESL 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },

      // Year I Semester I
      {
        code: "TESL 111",
        name: "Advanced Grammar and Reading",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },

      // Year I Semester II
      {
        code: "TESL 121",
        name: "Second Language Acquisition",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },

      // Year II Semester I
      {
        code: "TESL 211",
        name: "Introduction to the Structure of English Language",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "TESL 212",
        name: "The Use of Literature in ELT",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },

      // Year II Semester II
      {
        code: "TESL 221",
        name: "Practicum in English Teaching",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "TESL 222",
        name: "An Overview of Approaches and Practices in ELT",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },

      // Year III Semester I
      {
        code: "TESL 311",
        name: "Classroom Practices in Sri Lanka",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "TESL 312",
        name: "Curriculum Development for ESP",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "TESL 313",
        name: "Pronunciation for English Language Teachers",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },

      // Year III Semester II
      {
        code: "TESL 321",
        name: "Testing and Evaluation",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "TESL 322",
        name: "Research Methods in ELT",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "TESL 323",
        name: "Teaching Academic Writing",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },
      {
        code: "TESL 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of English Language Teaching",
      },

      // Department of ICT

      {
        code: "ICT 111",
        name: "Computer Architecture and Fundamentals of Programming",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 121",
        name: "Information Systems (IS)",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 211",
        name: "Social and Professional Issues in IT",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 212",
        name: "Fundamentals of System Design",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 213",
        name: "E-Commerce Technology",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 221",
        name: "Database Management Systems",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 222",
        name: "Applications of System Design",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 223",
        name: "Barcode Technology",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 311",
        name: "Advanced Web Development",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 312",
        name: "Data Communication and Computer Network",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 313",
        name: "Advanced Mathematics for ICT",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 314",
        name: "Object Oriented System Design",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 315",
        name: "Application of Open Sources Software",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 321",
        name: "Application of Interactive Multimedia Design",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 322",
        name: "Computer Hardware Technology and Troubleshooting",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 323",
        name: "Computer Aided Design (CAD)",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 324",
        name: "Graphics Design Applications",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 325",
        name: "Application of System Development",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 411",
        name: "Research Methods",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 412",
        name: "Audio and Video Editing Technology",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 413",
        name: "Open Source Web Development",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 414",
        name: "Object Oriented Programming Languages",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 415",
        name: "ICT Base Interactive Learning & Teaching Methods",
        credit: 3,
        departmentName: "Department of Information Technology",
      },
      {
        code: "ICT 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Information Technology",
      },

      // Dep of Languages
      {
        code: "SNH 111",
        name: "Introduction to Sinhala Studies I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 121",
        name: "Introduction to Sinhala Studies II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 211",
        name: "The Short Story",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 212",
        name: "The Novel",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 213",
        name: "Eastern Literary Criticism",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 221",
        name: "Drama and Theater",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 222",
        name: "Modern Sinhala Poetry",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 223",
        name: "Western Literary Criticism",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 311",
        name: "Sinhala Lyrics",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 312",
        name: "Classical Sinhala Prose",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 313",
        name: "Classical Sinhala Poetry",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 314",
        name: "Introduction to Linguistics",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 315",
        name: "World Literature 1",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 321",
        name: "Publishing Methods",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 322",
        name: "Sri Lankan Culture and Arts",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 323",
        name: "Usage of Sinhala Language in Mass Media",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 324",
        name: "The Electronic Media and Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 325",
        name: "Theory and Practice of Translation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 411",
        name: "Research Methodology",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 412",
        name: "World Literature II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 413",
        name: "Sinhala Epigraphy and Inscription",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 414",
        name: "The Historical Linguistics and the Evolution of Sinhalese Language",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 415",
        name: "Modern Linguistic Theory and Sinhala",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 416",
        name: "Traditional Sinhala Grammatical Studies",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "SNH 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Languages",
      },

      // Tamil
      {
        code: "TML 111",
        name: "Introduction to Tamil Studies",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 121",
        name: "Introduction to Tamil Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 211",
        name: "History of Tamil Literature & Some Major Authors 1 AD - 9 AD",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 212",
        name: "Theme and Practice of Translation 1",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 213",
        name: "History of Tamilology and Grammar",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 221",
        name: "Tamil Poetical Traditions",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 222",
        name: "Themes and Practice of Translation II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 223",
        name: "The Grammar of the Tamil Language",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 311",
        name: "History of Tamil Literature & Some Major Authors 10th C to 20th C",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 312",
        name: "Trends in Modern Tamil Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 313",
        name: "Introduction to Tamil Linguistics",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 314",
        name: "Tamil Literary Criticism",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 315",
        name: "Folk Literature in Tamil",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 321",
        name: "The Impact of the Electronic Media & Communications on Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 322",
        name: "The Development of Tamil Literature in Sri Lanka up to the End of 20th Century",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 323",
        name: "Prosody in Tamil",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 324",
        name: "History of Tamil Drama",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 325",
        name: "Bharathiar’s Poems",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 411",
        name: "Research Methodology",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 412",
        name: "Upcountry Tamil Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 413",
        name: "Feminism on Tamil Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 414",
        name: "Technique of Creative Writings in Tamil",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 415",
        name: "Critical Study of Tholkaapiam",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 416",
        name: "Tamil Children’s Literature in Sri Lanka",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TML 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Languages",
      },

      // English
      {
        code: "ENG 111",
        name: "Introduction to English Studies I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 121",
        name: "Introduction to English Studies II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 211",
        name: "The Foundations of Modern Society",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 212",
        name: "The English Language: History and Development",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 213",
        name: "The English Novel (From Austen to Forster)",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 221",
        name: "English Poetry (Elizabethan to Romantic)",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 222",
        name: "Modern Short Stories",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 223",
        name: "Literature and Society",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 311",
        name: "Modern Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 312",
        name: "Shakespeare and the Renaissance",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 313",
        name: "English Poetry (Victorian to Post-colonial)",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 314",
        name: "20th Century Theatre",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 315",
        name: "Sri Lankan English (SLE): A Survey",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 321",
        name: "Teaching English in Sri Lanka",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 322",
        name: "World Literature in Translation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 323",
        name: "English for Practical Purposes",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 324",
        name: "Sri Lankan Writing in English",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 325",
        name: "Communication Theory and Web Communication",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 411",
        name: "Research Methodology",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 412",
        name: "Literary Theory and Criticism",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 413",
        name: "Gender in Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 414",
        name: "Discourse Analysis",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 415",
        name: "Modern Cinematic Narration",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 416",
        name: "African- American Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "ENG 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Languages",
      },

      // German
      {
        code: "GMN 111",
        name: "German Language Studies I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 121",
        name: "German Language Studies II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 211",
        name: "German Language Studies III",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 212",
        name: "Interactive German",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 213",
        name: "Germany Overview",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 221",
        name: "German Text Production",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 222",
        name: "German Fables, Anecdotes and Fairytales",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 223",
        name: "German Short Stories",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 311",
        name: "Structure of German",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 312",
        name: "Business German I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 313",
        name: "Creative Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 314",
        name: "German Text Analysis",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 315",
        name: "Reading German Media",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 321",
        name: "Theory and Practice of Translation I (German -> English/Sinhala)",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 322",
        name: "German for Tourism",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 323",
        name: "Business German II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 324",
        name: "German Film",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 325",
        name: "Approaches to German Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 411",
        name: "Research Methodology",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 412",
        name: "Theory and Practice of Translation II (English/Sinhala -> German)",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 413",
        name: "Teaching German as a Foreign Language: Theory and Practice",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 414",
        name: "Theatre of Bertolt Brecht",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 415",
        name: "German Women’s Literature: Ingeborg Bachmann",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 416",
        name: "German Novella: Gerhard Hauptmann",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "GMN 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 111",
        name: "Preparation for Japanese Studies",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 121",
        name: "Japanese Language Studies II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 211",
        name: "Japanese Grammar and Vocabulary I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 212",
        name: "Japanese Literature/Kanji/Translation I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 213",
        name: "Japanese Lifestyle and Society",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 221",
        name: "Japanese Grammar and Vocabulary II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 222",
        name: "Japanese Literature/Kanji/Translation II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 223",
        name: "Japanese History",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 311",
        name: "Japanese Grammar and Vocabulary III",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 312",
        name: "Japanese Literature/Kanji/Translation III",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 313",
        name: "Japanese Traditional and Modern Culture",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 314",
        name: "Japanese Language Teaching Methodology I (Theory)",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 315",
        name: "Theory and Practice of Translations",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 321",
        name: "Japanese Grammar and Vocabulary IV",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 322",
        name: "Japanese Literature/ Kanji/Translation IV",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 323",
        name: "Japanese Politics/Economy/Education",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 324",
        name: "Japanese Language Teaching Methodology II(Practice)",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 325",
        name: "Japanese Language Proficiency Test Level I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 411",
        name: "Research Methodology",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 412",
        name: "Japanese Literature/Kanji/Translation V",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 413",
        name: "Japanese Scientific Letter Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 414",
        name: "Japanese Language in Print Media",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 415",
        name: "Listening to Japanese News in Electronic Media",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 416",
        name: "Business Japanese",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "JPN 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Languages",
      },

      // Chinese
      {
        code: "CHN 111",
        name: "Chinese Language Studies I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 121",
        name: "Chinese Language Studies II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 211",
        name: "Chinese Language Studies III",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 212",
        name: "Listening and Reading",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 213",
        name: "Chinese Studies I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 221",
        name: "Chinese Language Studies IV",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 222",
        name: "Comprehension and Composition",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 223",
        name: "Chinese Studies II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 311",
        name: "Chinese Language Studies V",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 312",
        name: "Oral and Written Communication",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 313",
        name: "Chinese Essay Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 314",
        name: "Chinese Literature and Criticism",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 315",
        name: "Chinese Studies III",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 321",
        name: "Composition and Translation I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 322",
        name: "Chinese Language Studies VI",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 323",
        name: "Chinese Language Proficiency Test",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 324",
        name: "Appreciation of Chinese Performing Art",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 325",
        name: "Chinese Studies IV",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 411",
        name: "Research Methodology",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 412",
        name: "Composition and Translation II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 413",
        name: "Business Chinese",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 414",
        name: "Chinese in Print Media",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 415",
        name: "Chinese for Tourism",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 416",
        name: "Chinese Language and Society",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "CHN 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Languages",
      },

      // Hindi
      {
        code: "HND 111",
        name: "Hindi Language Studies I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 121",
        name: "Hindi Language Studies II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 211",
        name: "Hindi Language: Written and Oral Expression I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 212",
        name: "Theory and Practice of Translation I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 213",
        name: "Hindi Language: Written & Oral Expression II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 221",
        name: "Indian Poetics and Selected Hindi Poems I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 222",
        name: "Modern Hindi Prose I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 223",
        name: "History of Hindi Literature I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 311",
        name: "Modern Hindi Prose II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 312",
        name: "Hindi Language in Practice I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 313",
        name: "Hindi for Tourism I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 314",
        name: "Modern Hindi Prose III",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 315",
        name: "History of Hindi Literature II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 321",
        name: "Hindi Language in Practice II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 322",
        name: "Hindi for Tourism II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 323",
        name: "Indian Poetics and Selected Hindi Poems II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 324",
        name: "History of Hindi Literature III",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 325",
        name: "Theory and Practice of Translation II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 411",
        name: "Research Methodology",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 412",
        name: "Hindi Language: Written and Oral Expression III",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 413",
        name: "Teaching Hindi as a Foreign Language",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 414",
        name: "North Indian Cultural Tradition",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 415",
        name: "Origins and Development of Hindi Language",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 416",
        name: "North Indian Folk Literature",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "HND 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Languages",
      },

      // Translation (TRL)
      {
        code: "TRL 111",
        name: "Language A Writing Techniques I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 121",
        name: "Language B Listening and Reading I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 211",
        name: "Language C Listening",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 212",
        name: "Language C Writing I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 213",
        name: "Awareness of Language: Linguistic Approach",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 221",
        name: "Language A Writing Techniques II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 222",
        name: "Language C Listening and Speaking",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 223",
        name: "Specialized Translation I: Academic Translation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 311",
        name: "General Translation I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 312",
        name: "Language B Writing 1",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 313",
        name: "Language C Reading I",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 314",
        name: "Specialized Translation into Language B",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 315",
        name: "Computer Skills for Translation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 321",
        name: "General Translation II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 322",
        name: "Specialized Translation II: Technical Translation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 323",
        name: "Language C Writing II",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 324",
        name: "Translation Theories and Ethics",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 325",
        name: "Computer Assisted Translation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 411",
        name: "Research Methodology",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 412",
        name: "Specialized Translation III: Subject wise Translation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 413",
        name: "Introduction to Audio Visual Translation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 414",
        name: "Specialized Translation IV : Literary Translation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 415",
        name: "Introduction to Interpretation",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 416",
        name: "Language A Editing and Proof Reading",
        credit: 3,
        departmentName: "Department of Languages",
      },
      {
        code: "TRL 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Languages",
      },
      {
        code: "POL 111",
        name: "Introduction to Political Science",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 121",
        name: "Constitutional and Political Development in Sri Lanka",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 211",
        name: "International Relations",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 212",
        name: "Conflict and Peace Building (Theoretical Aspect)",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 213",
        name: "Political and Social Theory I",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 221",
        name: "Conflict and Peace Building in Selected Countries",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 222",
        name: "Elements of Public Administration",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 223",
        name: "Political and Social Theory II",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 311",
        name: "Modern Political Ideologies",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 312",
        name: "Comparative Politics",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 313",
        name: "Theories of Public Policy",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 314",
        name: "Political Sociology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 315",
        name: "Political Terrorism",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 321",
        name: "World Politics",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 322",
        name: "Human Rights",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 323",
        name: "Gender and Politics",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 324",
        name: "Comparative Public Administration",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 325",
        name: "Comparative Politics: Institutions and Movements",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 411",
        name: "Research Methods",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 412",
        name: "Sri Lanka in World Politics",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 413",
        name: "Development Administration",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 414",
        name: "Constitutional Law and Politics",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 415",
        name: "Socio Political Process and Analysis",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 416",
        name: "Political Economy of Sri Lanka",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 417",
        name: "Asian Politics",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 418",
        name: "Globalization and Nation State",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "POL 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Social Sciences",
      },

      // Sociology
      {
        code: "SOC 111",
        name: "Introduction to Sociology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 121",
        name: "Self, Family and Society",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 211",
        name: "Introduction to Psychology and Social Psychology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 212",
        name: "Social Inequality",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 213",
        name: "Statistics for Sociology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 221",
        name: "Sociological Theory",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 222",
        name: "Sociology of Health and Illness",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 223",
        name: "Sociology of Religion",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 311",
        name: "Methods and Techniques of Sociological Research",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 312",
        name: "Rural Sociology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 313",
        name: "Environmental Sociology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 314",
        name: "Social Work",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 315",
        name: "Urban Sociology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 321",
        name: "Development Sociology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 322",
        name: "Sri Lankan Society and Culture",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 323",
        name: "Sociology of Work and Work Organization",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 324",
        name: "Counseling and Guidance",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 325",
        name: "Applied Sociology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 411",
        name: "Computer Aided Statistical Analysis",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 412",
        name: "Advanced Sociological Theory",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 413",
        name: "Social Policy and Social Development",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 414",
        name: "Sociology of Entrepreneurship",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 415",
        name: "Sociology of Mass Communication",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 416",
        name: "Political Sociology",
        credit: 3,
        departmentName: "Department of Social Sciences",
      },
      {
        code: "SOC 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Social Sciences",
      },

      //Dep. Geogrphy

      // Year I Semester I
      {
        code: "GEO 111",
        name: "Introduction to Physical and Human Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },

      // Year I Semester II
      {
        code: "GEO 121",
        name: "Basic Cartography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },

      // Year II Semester I
      {
        code: "GEO 211",
        name: "Advanced Cartography and Field Techniques",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 212",
        name: "Geomorphology",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 213",
        name: "Environmental Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },

      // Year II Semester II
      {
        code: "GEO 221",
        name: "Basic Geographical Information Systems (GIS)",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 222",
        name: "Climatology",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 223",
        name: "Population Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },

      // Year III Semester I
      {
        code: "GEO 311",
        name: "Quantitative Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 312",
        name: "Regional Development and Planning",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 313",
        name: "Bio Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 314",
        name: "Remote Sensing",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 315",
        name: "Urban Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },

      // Year III Semester II
      {
        code: "GEO 321",
        name: "Human Resource Management",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 322",
        name: "Land Use Planning",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 323",
        name: "Recreation Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 324",
        name: "Advanced Geographical Information Systems (GIS)",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 325",
        name: "Hydrology & Watershed Management",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 326",
        name: "Scientific Report Writing",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },

      // Year IV Semester I
      {
        code: "GEO 411",
        name: "Research Methods in Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 412",
        name: "Natural Hazards and Disaster Management",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 413",
        name: "Project Planning & Management",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },

      // Optional Courses (choose two)
      {
        code: "GEO 414",
        name: "Medical Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 415",
        name: "Settlement Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 416",
        name: "Tropical Agro Forestry",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 417",
        name: "Industrial Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        code: "GEO 418",
        name: "Political Geography",
        credit: 3,
        departmentName: "Department of Geography & Environmental Management",
      },

      // Year IV Semester II
      {
        code: "GEO 421",
        name: "Dissertation / Practical Training",
        credit: 6,
        departmentName: "Department of Geography & Environmental Management",
      },
    ];

    // Department subjects — batch in chunks of 10
    const chunkSize = 10;
    for (let i = 0; i < subjectsData.length; i += chunkSize) {
      const chunk = subjectsData.slice(i, i + chunkSize);
      await prisma.$transaction(
        chunk.map((sub) => {
          const departmentId = departments.find(
            (d) => d.name === sub.departmentName,
          )?.id;
          if (!departmentId) {
            console.warn(`⚠️ No department for ${sub.code}`);
            return prisma.subject.upsert({
              where: { code: sub.code },
              update: {},
              create: { code: sub.code, name: sub.name, credit: sub.credit },
            });
          }
          return prisma.subject.upsert({
            where: { code: sub.code },
            update: {},
            create: {
              code: sub.code,
              name: sub.name,
              credit: sub.credit,
              departmentId,
            },
          });
        }),
      );
      console.log(
        `✅ Seeded subjects ${i + 1}–${Math.min(i + chunkSize, subjectsData.length)}`,
      );
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

    // ---------- STEP 3: CREATE LECTURERS IN CLERK + DB ----------
    const clerk = await clerkClient();

    const studentsData = [
      {
        username: "21sst6673",
        name: "M D C",
        surname: "Sumanasekara",
        email: "chithruni@gmail.com",
        phone: null,
        sex: UserSex.FEMALE,
        departmentName: "Department of Social Sciences",
      },
      {
        username: "21ssl6520",
        name: "S.D.U",
        surname: "Shavindini",
        email: "upekshashavindini17@gmail.com",
        phone: "766236780",
        sex: UserSex.FEMALE,
        departmentName: "Department of Social Sciences",
      },
      {
        username: "21ssl6621",
        name: "P.K.Sellahewa",
        surname: "Sellahewa",
        email: "Pabodhasellahewa11@gmail.com",
        phone: "701028031",
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21sst6694",
        name: "Hiruni",
        surname: "Chathurangi",
        email: "hirunichathurangi2002@gmail.com",
        phone: "762904658",
        sex: UserSex.FEMALE,
        departmentName: "Department of Languages",
      },
      {
        username: "21ssl6447",
        name: "S.N.J",
        surname: "Jayasinghe",
        email: "sjayasinghe108@gmail.com",
        phone: "742844512",
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6475",
        name: "M.H.",
        surname: "Kumari",
        email: "hansala2002kumari@gmail.com",
        phone: "761280107",
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6452",
        name: "M.A.M.U.L",
        surname: "Lakshan",
        email: "lakshanudara961q@gamil.com", // typo in original form — fix if needed
        phone: "754060455",
        sex: UserSex.MALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6497",
        name: "K.S",
        surname: "Gayangi",
        email: "gayangiskulasingha@gmail.com",
        phone: "705864375",
        sex: UserSex.FEMALE,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        username: "21ssl6509",
        name: "M.R.Aakila",
        surname: "Farwin",
        email: "aakilarafees@gmail.com",
        phone: "701529487",
        sex: UserSex.FEMALE,
        departmentName: "Department of Social Sciences",
      },
      {
        username: "21ssl6597",
        name: "D.M.D.S",
        surname: "Dissanayake",
        email: "dithudissanayake@gmail.com",
        phone: "712641243",
        sex: UserSex.FEMALE,
        departmentName: "Department of Information Technology",
      },
      {
        username: "21ssl6600",
        name: "M.H.S.Sanuri Abiseka",
        surname: "Harindi",
        email: "s.a.harindi2002@gmail.com",
        phone: "766291296",
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21sst6697",
        name: "D.",
        surname: "Mona",
        email: "devadasmona04@gmail.com",
        phone: "705792737",
        sex: UserSex.FEMALE,
        departmentName: "Department of Languages",
      },
      {
        username: "21ssl6409",
        name: "W.M.M.D",
        surname: "Weerasinghe",
        email: "maheshidhananjana91@gmail.com",
        phone: "702992215",
        sex: UserSex.FEMALE,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        username: "21sst6687",
        name: "S.M.I.H",
        surname: "Samarakoon",
        email: "induminisamarakoon318@gmail.com",
        phone: null,
        sex: UserSex.FEMALE,
        departmentName: "Department of Languages",
      },
      {
        username: "21ssl6553",
        name: "A.M.P",
        surname: "Thilakarathna",
        email: "andriyanathilakarathna@gmail.com",
        phone: null,
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6532",
        name: "K.G.N",
        surname: "Thilakarathna",
        email: "nilushithilakarathna47@gmail.com",
        phone: "710326512",
        sex: UserSex.FEMALE,
        departmentName: "Department of Geography & Environmental Management",
      },
      {
        username: "21ssl6438",
        name: "A.S",
        surname: "Vithanage",
        email: "sathsaraniwithanage753@gmail.com",
        phone: "740068980",
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6451",
        name: "G.H.S.K",
        surname: "Kumari",
        email: "hashinisaumya0204@gmail.com",
        phone: "712626392",
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21sst6670",
        name: "Siluni",
        surname: "Jayalath",
        email: "silunivihansa74@gmail.com",
        phone: "0788910250",
        sex: UserSex.FEMALE,
        departmentName: "Department of Languages",
      },
      {
        username: "21sst6671",
        name: "L.H.K. Liyanaarachchi",
        surname: "Liyanaarachchi",
        email: "hashini21kaushalya@gmail.com",
        phone: "762312065",
        sex: UserSex.FEMALE,
        departmentName: "Department of Languages",
      },
      {
        username: "21ssl6404",
        name: "G.H.S",
        surname: "Nethpiumi",
        email: "sangeethmagallehewage@gmail.com",
        phone: "710911095",
        sex: UserSex.FEMALE,
        departmentName: "Department of Languages",
      },
      {
        username: "21ssl6458",
        name: "G.P",
        surname: "Nadeeshani",
        email: "Pubuduninadeeshani2002@gmail.com",
        phone: null,
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6406",
        name: "R.M.V.C.D.",
        surname: "Ranasinghe",
        email: "chethanaranasinghe82@gmail.com",
        phone: null,
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6480",
        name: "T.M.R",
        surname: "Thennakoon",
        email: "rashmiprathibani935@gmail.com",
        phone: null,
        sex: UserSex.FEMALE,
        departmentName: "Department of Social Sciences",
      },
      {
        username: "21ssl6577",
        name: "R.D.D.T",
        surname: "Udayananda",
        email: "udayanandadilmi@gmail.com",
        phone: "766427090",
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6700",
        name: "L.C.A",
        surname: "Perera",
        email: "chamathkaanjalee114@gmail.com",
        phone: "716358804",
        sex: UserSex.FEMALE,
        departmentName: "Department of Languages",
      },
      {
        username: "21ssl6445",
        name: "K.H.R.T",
        surname: "Gamini",
        email: "khrashmitharanga123@gmail.com",
        phone: "743180252",
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6660",
        name: "P.P.U.",
        surname: "Upekshika",
        email: "ushaniupekshikaa20@gmail.com",
        phone: "762358421",
        sex: UserSex.FEMALE,
        departmentName: "Department of Languages",
      },
      {
        username: "21ssl6653",
        name: "D.M.S",
        surname: "Hansika",
        email: "saduaponsu143@gmail.com",
        phone: "741835551",
        sex: UserSex.FEMALE,
        departmentName: "Department of Social Sciences",
      },
      {
        username: "21ssl6412",
        name: "T.D",
        surname: "Danangala",
        email: "thisakya.devindi@gmail.com",
        phone: "761250685",
        sex: UserSex.FEMALE,
        departmentName: "Department of Economics & Statistics",
      },
      {
        username: "21ssl6518",
        name: "W.A",
        surname: "Sathsarani",
        email: "amayaadmission22@gmail.com",
        phone: "763493790",
        sex: UserSex.FEMALE,
        departmentName: "Department of Social Sciences",
      },
      {
        username: "21ssl6709",
        name: "I.C.U.B",
        surname: "Dissanayake",
        email: "chamma3306@gmail.com",
        phone: null,
        sex: UserSex.FEMALE,
        departmentName: "Department of Languages",
      },
    ];

    for (const student of studentsData) {
      try {
        // Find department
        const department = departments.find(
          (d) => d.name === student.departmentName,
        );
        if (!department) {
          console.warn(
            `Department not found for ${student.username}, skipping`,
          );
          continue;
        }

        // Step 1: Create Clerk user (password = username)
        const user = await clerk.users.createUser({
          username: student.username,
          ...(student.email ? { emailAddress: [student.email] } : {}),
          password: student.username,
          firstName: student.name,
          lastName: student.surname,
          publicMetadata: { role: "student" },
        });

        console.log(`Created Clerk user: ${student.username}`);

        // Step 2: Create Student in Prisma DB
        await prisma.student.create({
          data: {
            id: user.id, // Clerk userId
            username: student.username,
            name: student.name,
            surname: student.surname,
            email: student.email ?? undefined,
            phone: student.phone ?? undefined,
            sex: student.sex,
            departmentId: department.id,
          },
        });

        console.log(
          `Added student ${student.username} (${student.name} ${student.surname})`,
        );
      } catch (error: any) {
        console.error(`Failed to create ${student.username}:`, error.message);

        // Rollback Clerk user if Prisma failed
        if (error.code?.startsWith("P")) {
          const existingUser = await clerk.users.getUserList({
            username: [student.username],
          });
          if (existingUser?.data?.[0]?.id) {
            await clerk.users.deleteUser(existingUser.data[0].id);
            console.log(`Rolled back Clerk user for ${student.username}`);
          }
        }
      }
    }
  } catch (e: any) {
    // ← and this at the very end before the closing }
    console.error("❌ Seed crashed with:", e.message);
    console.error(e);
    throw e;
  }

  const adminData = {
    username: "admin",
    password: "@Abc5273", // change this after first login
  };

  const clerk = await clerkClient();

  // Step 1: Create Clerk user
  const adminUser = await clerk.users.createUser({
    username: adminData.username,
    password: adminData.password,
    publicMetadata: { role: "admin" },
  });

  console.log(`Created Clerk admin user: ${adminData.username}`);

  // Step 2: Create Admin in Prisma DB
  await prisma.admin.create({
    data: {
      id: adminUser.id,
      username: adminData.username,
    },
  });

  console.log(`✅ Admin seeded: ${adminData.username}`);
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

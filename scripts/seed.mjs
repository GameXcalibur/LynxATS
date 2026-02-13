/**
 * Seed script for LynxATS
 *
 * Usage:
 *   npm run seed
 *   — or —
 *   MONGODB_URL="mongodb+srv://..." node scripts/seed.mjs
 *
 * This script is ADDITIVE — it does NOT drop existing data.
 * Run it once to populate the DB with sample records.
 */

import mongoose from "mongoose";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env manually (no dotenv dependency needed) ────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envPath = resolve(__dirname, "../.env");
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env file not found — that's fine if MONGODB_URL is set in the environment
}

// ── Mongoose model definitions (inline to avoid TS import issues) ───────────

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, unique: true },
  name: { type: String },
  image: { type: String },
  bio: { type: String },
  userInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "userInfo" }],
  postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  onboarded: { type: Boolean, default: false },
}, { timestamps: true });

const jobSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jobTitle: { type: String },
  jobDescription: { type: String },
  teamDept: { type: String },
  location: { type: String },
  jobType: { type: String },
  yrsOfExp: { type: String },
  companyOverview: { type: String },
  qualifications: { type: String },
  deadline: { type: String },
  coverPhoto: { type: String },
  applicationRequirement: {
    name: { type: Boolean },
    email: { type: Boolean },
    mobile: { type: Boolean },
    linkedin: { type: Boolean },
    portfolioworksample: { type: Boolean },
  },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  integrationContext: { type: String },
  companyApplyUrl: { type: String },
  description: { type: String },
  employmentStatus: { type: String, enum: ["PART_TIME", "FULL_TIME"] },
  externalJobPostingId: { type: String },
  listedAt: { type: Number },
  jobPostingOperationType: { type: String, default: "CREATE" },
  workplaceTypes: { type: String, enum: ["hybrid", "remote", "On-site"] },
}, { timestamps: true });

const applicationSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  linkedin: { type: String },
  resume: { type: String },
  passport: { type: String },
  yearsofexperience: { type: String },
  portfolioworksample: { type: String },
  coverletter: { type: String },
  attachments: { type: String },
  video: { type: String },
  noteAndFeedBack: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
}, { timestamps: true });

const interviewSchema = new mongoose.Schema({
  interviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  scheduledDate: { type: Date },
  interviewStartTime: { type: String },
  interviewEndTime: { type: String },
  title: { type: String },
  description: { type: String },
  summary: { type: String },
  venue: { type: String },
  details: { type: String },
  inviteLink: { type: String },
  status: { type: String, enum: ["scheduled", "completed", "canceled", "rejected"], default: "scheduled" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);
const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
const Interview = mongoose.models.Interview || mongoose.model("Interview", interviewSchema);

// ── Seed data ───────────────────────────────────────────────────────────────

const USERS = [
  {
    id: "seed_user_001",
    username: "sarah_chen",
    name: "Sarah Chen",
    bio: "Head of Talent Acquisition with 8+ years of experience in tech recruiting.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    onboarded: true,
  },
  {
    id: "seed_user_002",
    username: "james_okafor",
    name: "James Okafor",
    bio: "Engineering Manager leading the platform team. Passionate about building great teams.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    onboarded: true,
  },
  {
    id: "seed_user_003",
    username: "maria_garcia",
    name: "Maria Garcia",
    bio: "VP of People Operations. Focused on scaling culture alongside growth.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    onboarded: true,
  },
];

const JOBS = [
  {
    jobTitle: "Senior Frontend Engineer",
    jobDescription: "We are looking for a Senior Frontend Engineer to lead the development of our customer-facing web application. You will architect scalable React components, mentor junior developers, and collaborate closely with design and product teams to deliver polished user experiences.",
    teamDept: "Engineering",
    location: "San Francisco, CA",
    jobType: "Full-Time",
    yrsOfExp: "5+",
    companyOverview: "LynxATS is a fast-growing HR-tech startup building the next generation of applicant tracking systems. We believe hiring should be simple, transparent, and fair.",
    qualifications: "5+ years of experience with React/Next.js, strong TypeScript skills, experience with design systems, familiarity with testing frameworks (Jest, Cypress), excellent communication skills.",
    deadline: "2026-04-15",
    employmentStatus: "FULL_TIME",
    workplaceTypes: "hybrid",
    applicationRequirement: { name: true, email: true, mobile: true, linkedin: true, portfolioworksample: true },
  },
  {
    jobTitle: "Backend Engineer",
    jobDescription: "Join our backend team to build robust APIs and services that power the LynxATS platform. You will design database schemas, implement RESTful and GraphQL endpoints, and ensure our infrastructure scales to support thousands of concurrent users.",
    teamDept: "Engineering",
    location: "New York, NY",
    jobType: "Full-Time",
    yrsOfExp: "3+",
    companyOverview: "LynxATS is a fast-growing HR-tech startup building the next generation of applicant tracking systems.",
    qualifications: "3+ years with Node.js or Python, MongoDB/PostgreSQL experience, understanding of RESTful API design, experience with cloud services (AWS/GCP), strong problem-solving skills.",
    deadline: "2026-04-01",
    employmentStatus: "FULL_TIME",
    workplaceTypes: "remote",
    applicationRequirement: { name: true, email: true, mobile: true, linkedin: false, portfolioworksample: false },
  },
  {
    jobTitle: "Product Designer",
    jobDescription: "We need a Product Designer to own the end-to-end design process for key features in our ATS platform. From user research and wireframing to high-fidelity prototypes and design system maintenance, you will shape how recruiters and candidates interact with LynxATS.",
    teamDept: "Design",
    location: "Austin, TX",
    jobType: "Full-Time",
    yrsOfExp: "4+",
    companyOverview: "LynxATS is a fast-growing HR-tech startup building the next generation of applicant tracking systems.",
    qualifications: "4+ years of product design experience, proficiency in Figma, portfolio demonstrating end-to-end design work, experience with user research and usability testing, understanding of accessibility standards.",
    deadline: "2026-03-20",
    employmentStatus: "FULL_TIME",
    workplaceTypes: "hybrid",
    applicationRequirement: { name: true, email: true, mobile: false, linkedin: true, portfolioworksample: true },
  },
  {
    jobTitle: "DevOps Engineer",
    jobDescription: "We are seeking a DevOps Engineer to build and maintain our CI/CD pipelines, manage cloud infrastructure, and ensure high availability across all environments. You will work closely with the engineering team to automate deployments and improve developer productivity.",
    teamDept: "Infrastructure",
    location: "Remote",
    jobType: "Full-Time",
    yrsOfExp: "3+",
    companyOverview: "LynxATS is a fast-growing HR-tech startup building the next generation of applicant tracking systems.",
    qualifications: "3+ years in DevOps/SRE roles, experience with Docker/Kubernetes, Terraform or Pulumi, AWS or GCP, monitoring tools (Datadog, Grafana), scripting (Bash, Python).",
    deadline: "2026-05-01",
    employmentStatus: "FULL_TIME",
    workplaceTypes: "remote",
    applicationRequirement: { name: true, email: true, mobile: true, linkedin: false, portfolioworksample: false },
  },
  {
    jobTitle: "Technical Recruiter (Part-Time)",
    jobDescription: "We are hiring a part-time Technical Recruiter to source, screen, and coordinate interviews for engineering and design roles. You will partner with hiring managers to understand role requirements and build a diverse talent pipeline.",
    teamDept: "People Operations",
    location: "San Francisco, CA",
    jobType: "Part-Time",
    yrsOfExp: "2+",
    companyOverview: "LynxATS is a fast-growing HR-tech startup building the next generation of applicant tracking systems.",
    qualifications: "2+ years of technical recruiting experience, familiarity with ATS tools, strong sourcing skills (LinkedIn Recruiter, GitHub), excellent interpersonal skills, ability to manage multiple requisitions.",
    deadline: "2026-03-30",
    employmentStatus: "PART_TIME",
    workplaceTypes: "On-site",
    applicationRequirement: { name: true, email: true, mobile: true, linkedin: true, portfolioworksample: false },
  },
];

const APPLICANTS = [
  { name: "Alex Johnson", email: "alex.johnson@example.com", mobile: "+1-415-555-0101", linkedin: "https://linkedin.com/in/alexjohnson", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "6", portfolioworksample: "https://alexjohnson.dev" },
  { name: "Priya Sharma", email: "priya.sharma@example.com", mobile: "+1-212-555-0102", linkedin: "https://linkedin.com/in/priyasharma", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "4", portfolioworksample: "https://priyasharma.design" },
  { name: "David Kim", email: "david.kim@example.com", mobile: "+1-512-555-0103", linkedin: "https://linkedin.com/in/davidkim", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "7", portfolioworksample: "https://davidkim.io" },
  { name: "Emily Rodriguez", email: "emily.rodriguez@example.com", mobile: "+1-303-555-0104", linkedin: "https://linkedin.com/in/emilyrodriguez", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "3" },
  { name: "Michael Brown", email: "michael.brown@example.com", mobile: "+1-206-555-0105", linkedin: "https://linkedin.com/in/michaelbrown", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "5" },
  { name: "Olivia Martinez", email: "olivia.martinez@example.com", mobile: "+1-617-555-0106", linkedin: "https://linkedin.com/in/oliviamartinez", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "2", portfolioworksample: "https://oliviamartinez.com" },
  { name: "Liam Nguyen", email: "liam.nguyen@example.com", mobile: "+1-408-555-0107", linkedin: "https://linkedin.com/in/liamnguyen", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "8" },
  { name: "Sophia Patel", email: "sophia.patel@example.com", mobile: "+1-310-555-0108", linkedin: "https://linkedin.com/in/sophiapatel", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "5", portfolioworksample: "https://sophiapatel.design" },
  { name: "Ethan Wilson", email: "ethan.wilson@example.com", mobile: "+1-773-555-0109", linkedin: "https://linkedin.com/in/ethanwilson", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "4" },
  { name: "Ava Thompson", email: "ava.thompson@example.com", mobile: "+1-503-555-0110", linkedin: "https://linkedin.com/in/avathompson", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "6", portfolioworksample: "https://avathompson.dev" },
  { name: "Noah Davis", email: "noah.davis@example.com", mobile: "+1-469-555-0111", linkedin: "https://linkedin.com/in/noahdavis", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "3" },
  { name: "Isabella Lee", email: "isabella.lee@example.com", mobile: "+1-650-555-0112", linkedin: "https://linkedin.com/in/isabellalee", resume: "https://res.cloudinary.com/demo/raw/upload/sample_resume.pdf", passport: "https://res.cloudinary.com/demo/image/upload/sample.jpg", coverletter: "https://res.cloudinary.com/demo/raw/upload/sample_cover.pdf", yearsofexperience: "9", portfolioworksample: "https://isabellalee.io" },
];

const COMMENT_TEMPLATES = [
  "Strong candidate — technical skills align well with the role requirements.",
  "Good cultural fit. Communication skills stood out during the initial screen.",
  "Resume is impressive but lacks specific experience with our tech stack. Worth a follow-up.",
  "Portfolio work is excellent. Recommend moving to the next round.",
  "Years of experience are a bit below our target, but showed strong potential.",
  "Great problem-solving approach in the take-home assessment.",
  "References check out well. Previous managers gave glowing feedback.",
  "Needs improvement in system design, but strong in hands-on coding.",
  "Excellent leadership experience — could grow into a team lead role.",
  "Salary expectations are within our range. Recommend extending an offer.",
];

// ── Main ────────────────────────────────────────────────────────────────────

async function seed() {
  const MONGODB_URL = process.env.MONGODB_URL;
  if (!MONGODB_URL) {
    console.error("Error: MONGODB_URL is not set. Add it to .env or pass it as an env var.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URL);
  console.log("Connected.\n");

  // ── 1. Users ──────────────────────────────────────────────────────────
  console.log("Creating users...");
  const createdUsers = [];
  for (const userData of USERS) {
    const existing = await User.findOne({ id: userData.id });
    if (existing) {
      console.log(`  User "${userData.username}" already exists — skipping.`);
      createdUsers.push(existing);
    } else {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`  Created user: ${userData.name}`);
    }
  }

  // ── 2. Jobs ───────────────────────────────────────────────────────────
  console.log("\nCreating jobs...");
  const createdJobs = [];
  const jobAuthorMap = [0, 0, 1, 1, 2];

  for (let i = 0; i < JOBS.length; i++) {
    const jobData = JOBS[i];
    const author = createdUsers[jobAuthorMap[i]];

    const job = await Job.create({
      ...jobData,
      author: author._id,
      integrationContext: "urn:li:organization:2414183",
      companyApplyUrl: "https://lynxats.com/careers",
      externalJobPostingId: `LYNX-${1000 + i}`,
      listedAt: Date.now(),
      jobPostingOperationType: "CREATE",
    });

    author.postedJobs.push(job._id);
    await author.save();

    createdJobs.push(job);
    console.log(`  Created job: "${jobData.jobTitle}" (by ${author.name})`);
  }

  // ── 3. Applications ──────────────────────────────────────────────────
  console.log("\nCreating applications...");
  const createdApplications = [];

  const applicantJobMap = [
    { applicantIdx: 0, jobIdx: 0 },
    { applicantIdx: 2, jobIdx: 0 },
    { applicantIdx: 9, jobIdx: 0 },
    { applicantIdx: 3, jobIdx: 1 },
    { applicantIdx: 6, jobIdx: 1 },
    { applicantIdx: 10, jobIdx: 1 },
    { applicantIdx: 1, jobIdx: 2 },
    { applicantIdx: 7, jobIdx: 2 },
    { applicantIdx: 4, jobIdx: 3 },
    { applicantIdx: 8, jobIdx: 3 },
    { applicantIdx: 5, jobIdx: 4 },
    { applicantIdx: 11, jobIdx: 4 },
  ];

  for (const mapping of applicantJobMap) {
    const applicantData = APPLICANTS[mapping.applicantIdx];
    const job = createdJobs[mapping.jobIdx];

    const application = await Application.create({
      id: `seed_applicant_${mapping.applicantIdx}`,
      ...applicantData,
    });

    job.applications.push(application._id);
    await job.save();

    createdApplications.push({ application, jobIdx: mapping.jobIdx });
    console.log(`  ${applicantData.name} → "${JOBS[mapping.jobIdx].jobTitle}"`);
  }

  // ── 4. Comments ───────────────────────────────────────────────────────
  console.log("\nCreating comments/feedback...");
  let commentCount = 0;

  for (const { application, jobIdx } of createdApplications) {
    const numComments = Math.random() > 0.4 ? 2 : 1;

    for (let c = 0; c < numComments; c++) {
      const reviewer = createdUsers[(jobIdx + c) % createdUsers.length];
      const commentText = COMMENT_TEMPLATES[commentCount % COMMENT_TEMPLATES.length];

      const comment = await Comment.create({
        content: commentText,
        sender: reviewer._id,
        receiver: application._id,
      });

      application.noteAndFeedBack.push(comment._id);
      await application.save();

      commentCount++;
    }
  }
  console.log(`  Created ${commentCount} comments across ${createdApplications.length} applications.`);

  // ── 5. Interviews ────────────────────────────────────────────────────
  console.log("\nCreating interviews...");
  let interviewCount = 0;

  const interviewCandidates = [
    { appMapIdx: 0, daysFromNow: 3 },
    { appMapIdx: 3, daysFromNow: 5 },
    { appMapIdx: 6, daysFromNow: 2 },
    { appMapIdx: 8, daysFromNow: 7 },
    { appMapIdx: 10, daysFromNow: 4 },
  ];

  for (const { appMapIdx, daysFromNow } of interviewCandidates) {
    const { application, jobIdx } = createdApplications[appMapIdx];
    const job = createdJobs[jobIdx];
    const interviewer = createdUsers[jobAuthorMap[jobIdx]];

    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + daysFromNow);
    scheduledDate.setHours(10, 0, 0, 0);

    const endTime = new Date(scheduledDate);
    endTime.setHours(11, 0, 0, 0);

    await Interview.create({
      interviewer: interviewer._id,
      applicant: application._id,
      job: job._id,
      scheduledDate,
      interviewStartTime: "10:00 AM",
      interviewEndTime: endTime.toISOString(),
      title: `Interview: ${APPLICANTS[applicantJobMap[appMapIdx].applicantIdx].name} for ${JOBS[jobIdx].jobTitle}`,
      description: `Technical interview round for the ${JOBS[jobIdx].jobTitle} position.`,
      summary: "Evaluate technical skills, cultural fit, and role-specific competencies.",
      venue: jobIdx % 2 === 0 ? "Conference Room A — 4th Floor" : "Virtual (Google Meet)",
      details: "Please review the candidate's resume and portfolio before the interview. Prepare 2-3 technical questions relevant to the role.",
      inviteLink: `https://meet.google.com/seed-${1000 + appMapIdx}`,
      status: "scheduled",
    });

    interviewCount++;
    console.log(
      `  Scheduled: ${APPLICANTS[applicantJobMap[appMapIdx].applicantIdx].name} — ${JOBS[jobIdx].jobTitle} (${scheduledDate.toLocaleDateString()})`
    );
  }

  // ── Summary ───────────────────────────────────────────────────────────
  console.log("\n========================================");
  console.log("Seed complete!");
  console.log(`  Users:        ${createdUsers.length}`);
  console.log(`  Jobs:         ${createdJobs.length}`);
  console.log(`  Applications: ${createdApplications.length}`);
  console.log(`  Comments:     ${commentCount}`);
  console.log(`  Interviews:   ${interviewCount}`);
  console.log("========================================\n");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});

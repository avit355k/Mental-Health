/* ===================== OPTIONS ===================== */

const phq9Options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

const gad7Options = [...phq9Options];

const mdqOptions = [
  { value: 0, label: "No" },
  { value: 1, label: "Yes" },
];

const auditOptions = [
  { value: 0, label: "Never" },
  { value: 1, label: "Less than monthly" },
  { value: 2, label: "Monthly" },
  { value: 3, label: "Weekly" },
  { value: 4, label: "Daily or almost daily" },
];

const pssOptions = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly often" },
  { value: 4, label: "Very often" },
];

/* ===================== ASSESSMENTS ===================== */

export const assessmentConfigs = {
  /* ---------- PHQ-9 ---------- */
  phq9: {
    id: "phq9",
    name: "PHQ-9",
    fullName: "Patient Health Questionnaire-9",
    description:
      "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    maxScore: 27,
    questions: [
      { id: 1, text: "Little interest or pleasure in doing things", options: phq9Options },
      { id: 2, text: "Feeling down, depressed, or hopeless", options: phq9Options },
      { id: 3, text: "Trouble falling or staying asleep, or sleeping too much", options: phq9Options },
      { id: 4, text: "Feeling tired or having little energy", options: phq9Options },
      { id: 5, text: "Poor appetite or overeating", options: phq9Options },
      { id: 6, text: "Feeling bad about yourself — or that you are a failure", options: phq9Options },
      { id: 7, text: "Trouble concentrating on things", options: phq9Options },
      { id: 8, text: "Moving or speaking slowly or being fidgety", options: phq9Options },
      { id: 9, text: "Thoughts that you would be better off dead", options: phq9Options },
    ],
    getSeverity: (score) => {
      if (score <= 4) return { level: "Minimal", description: "Minimal depression", color: "text-emerald-600" };
      if (score <= 9) return { level: "Mild", description: "Mild depression", color: "text-yellow-600" };
      if (score <= 14) return { level: "Moderate", description: "Moderate depression", color: "text-orange-600" };
      if (score <= 19) return { level: "Moderately Severe", description: "Moderately severe depression", color: "text-red-500" };
      return { level: "Severe", description: "Severe depression", color: "text-red-700" };
    },
  },

  /* ---------- GAD-7 ---------- */
  gad7: {
    id: "gad7",
    name: "GAD-7",
    fullName: "Generalized Anxiety Disorder",
    description:
      "Over the last 2 weeks, how often have you been bothered by the following problems?",
    maxScore: 21,
    questions: [
      { id: 1, text: "Feeling nervous, anxious, or on edge", options: gad7Options },
      { id: 2, text: "Not being able to stop or control worrying", options: gad7Options },
      { id: 3, text: "Worrying too much about different things", options: gad7Options },
      { id: 4, text: "Trouble relaxing", options: gad7Options },
      { id: 5, text: "Being so restless that it's hard to sit still", options: gad7Options },
      { id: 6, text: "Becoming easily annoyed or irritable", options: gad7Options },
      { id: 7, text: "Feeling afraid as if something awful might happen", options: gad7Options },
    ],
    getSeverity: (score) => {
      if (score <= 4) return { level: "Minimal", description: "Minimal anxiety", color: "text-emerald-600" };
      if (score <= 9) return { level: "Mild", description: "Mild anxiety", color: "text-yellow-600" };
      if (score <= 14) return { level: "Moderate", description: "Moderate anxiety", color: "text-orange-600" };
      return { level: "Severe", description: "Severe anxiety", color: "text-red-600" };
    },
  },

  /* ---------- MDQ ---------- */
  mdq: {
    id: "mdq",
    name: "MDQ",
    fullName: "Mood Disorder Questionnaire",
    description:
      "Has there ever been a period of time when you were not your usual self and...",
    maxScore: 13,
    questions: [
      { id: 1, text: "You felt so good or hyper that others noticed?", options: mdqOptions },
      { id: 2, text: "You were so irritable you started arguments?", options: mdqOptions },
      { id: 3, text: "You felt much more self-confident than usual?", options: mdqOptions },
      { id: 4, text: "You needed much less sleep than usual?", options: mdqOptions },
      { id: 5, text: "You were much more talkative than usual?", options: mdqOptions },
      { id: 6, text: "Thoughts raced through your head?", options: mdqOptions },
      { id: 7, text: "You were easily distracted?", options: mdqOptions },
      { id: 8, text: "You had much more energy than usual?", options: mdqOptions },
      { id: 9, text: "You were much more active than usual?", options: mdqOptions },
      { id: 10, text: "You were much more social than usual?", options: mdqOptions },
      { id: 11, text: "You were more interested in sex than usual?", options: mdqOptions },
      { id: 12, text: "You did risky or unusual things?", options: mdqOptions },
      { id: 13, text: "Spending money caused trouble?", options: mdqOptions },
    ],
    getSeverity: (score) => {
      if (score < 7)
        return { level: "Negative", description: "Screen negative for bipolar disorder", color: "text-chart-1" };
      return { level: "Positive", description: "Screen positive - consult a professional", color: "text-destructive" };
    },
  },

  /* ---------- AUDIT (FIXED) ---------- */
  audit: {
    id: "audit",
    name: "AUDIT",
    fullName: "Alcohol Use Disorders Identification Test",
    description: "Please answer the following questions about your alcohol use.",
    maxScore: 40,
    questions: [
      {
        id: 1,
        text: "How often do you have a drink containing alcohol?",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Monthly or less" },
          { value: 2, label: "2–4 times a month" },
          { value: 3, label: "2–3 times a week" },
          { value: 4, label: "4+ times a week" },
        ],
      },
      {
        id: 2,
        text: "How many drinks do you have on a typical day?",
        options: [
          { value: 0, label: "1 or 2" },
          { value: 1, label: "3 or 4" },
          { value: 2, label: "5 or 6" },
          { value: 3, label: "7 to 9" },
          { value: 4, label: "10 or more" },
        ],
      },
      { id: 3, text: "How often do you have six or more drinks on one occasion?", options: auditOptions },
      { id: 4, text: "Unable to stop drinking once started?", options: auditOptions },
      { id: 5, text: "Failed to do what was expected because of drinking?", options: auditOptions },
      { id: 6, text: "Needed a drink in the morning?", options: auditOptions },
      { id: 7, text: "Felt guilt or remorse after drinking?", options: auditOptions },
      { id: 8, text: "Unable to remember the night before?", options: auditOptions },
      { id: 9, text: "Someone injured because of your drinking?", options: auditOptions },
      { id: 10, text: "Others concerned about your drinking?", options: auditOptions },
    ],
    getSeverity: (score) => {
      if (score <= 7) return { level: "Low Risk", description: "Low risk drinking", color: "text-chart-1" };
      if (score <= 15) return { level: "Risky", description: "Risky drinking", color: "text-chart-4" };
      if (score <= 19) return { level: "Harmful", description: "Harmful drinking", color: "text-destructive/70" };
      return { level: "Dependence", description: "Possible alcohol dependence", color: "text-destructive" };
    },
  },

  /* ---------- PSS ---------- */
  pss: {
    id: "pss",
    name: "PSS",
    fullName: "Perceived Stress Scale",
    description: "In the last month, how often have you...",
    maxScore: 40,
    questions: [
      { id: 1, text: "Been upset because of something unexpected?", options: pssOptions },
      { id: 2, text: "Felt unable to control important things in life?", options: pssOptions },
      { id: 3, text: "Felt nervous and stressed?", options: pssOptions },
      { id: 4, text: "Felt confident handling personal problems?", options: pssOptions },
      { id: 5, text: "Felt things were going your way?", options: pssOptions },
      { id: 6, text: "Found you could not cope with things?", options: pssOptions },
      { id: 7, text: "Been able to control irritations?", options: pssOptions },
      { id: 8, text: "Felt on top of things?", options: pssOptions },
      { id: 9, text: "Been angered by things outside control?", options: pssOptions },
      { id: 10, text: "Felt difficulties piling up?", options: pssOptions },
    ],
    getSeverity: (score) => {
      if (score <= 13) return { level: "Low", description: "Low stress", color: "text-emerald-600" };
      if (score <= 26) return { level: "Moderate", description: "Moderate stress", color: "text-orange-600" };
      return { level: "High", description: "High stress", color: "text-red-600" };
    },
  },
};

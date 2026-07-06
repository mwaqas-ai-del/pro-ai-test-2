import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell,
  ChevronDown,
  CheckCircle,
  Clock3,
  Database,
  FileQuestion,
  Home,
  Inbox,
  KeyRound,
  LockKeyhole,
  Mail,
  Menu,
  Moon,
  Pencil,
  Percent,
  Power,
  RefreshCw,
  Send,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import './styles.css';

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    description: 'High-level testing activity and administration metrics.',
  },
  {
    id: 'question-bank',
    label: 'Question Bank',
    icon: Database,
    description: 'Manage question categories, item pools, and review status.',
  },
  {
    id: 'test-profiles',
    label: 'Test Profiles',
    icon: Users,
    description: 'Configure candidate groups, test assignments, and access.',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Control panel preferences, roles, and administrative rules.',
    disabled: true,
  },
];

const sectionStats = {
  'question-bank': [
    ['Draft Questions', '146'],
    ['Approved Items', '1,102'],
    ['Categories', '24'],
    ['Flagged', '9'],
  ],
  'test-profiles': [
    ['Candidate Profiles', '418'],
    ['Assigned Tests', '73'],
    ['Role Groups', '12'],
    ['Invites Sent', '206'],
  ],
  settings: [
    ['Admin Roles', '6'],
    ['Security Rules', '14'],
    ['Integrations', '3'],
    ['Audit Events', '2,904'],
  ],
};

const badgeStyles = {
  'Email Sent': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Link Opened': 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  'In Progress': 'bg-orange-50 text-orange-700 ring-orange-600/20',
  Completed: 'bg-green-50 text-green-700 ring-green-600/20',
  Terminated: 'bg-red-50 text-red-700 ring-red-600/20',
  Pass: 'bg-green-50 text-green-700 ring-green-600/20',
  Fail: 'bg-red-50 text-red-700 ring-red-600/20',
  Active: 'bg-green-50 text-green-700 ring-green-600/20',
  Inactive: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};
const questionTypeBadgeStyles = {
  MCQ: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Short Answer': 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  'Long Answer': 'bg-purple-50 text-purple-700 ring-purple-600/20',
};

const departmentOptions = [
  'Amazon',
  'Customer Service',
  'Content Creation',
  'Dev Ops',
  'Human Resource Management',
  'Accountant',
];
const profileAmazonDesignationOptions = [
  'Probation',
  'Brand Trainee',
  'Brand Analyst',
  'Senior Brand Analyst',
  'Brand Strategist',
  'Senior Brand Strategist',
  'Expert Brand Strategist',
  'Senior Expert Brand Strategist',
];
const questionDesignationOptions = [
  'Probation (1-3 Months)',
  'Brand Trainee (4-6 Months)',
  'Brand Analyst (7-12 Months)',
  'Senior Brand Analyst (13-18 Months)',
  'Brand Strategist (19-24 Months)',
  'Senior Brand Strategist (25-30 Months)',
  'Expert Brand Strategist (31-36 Months)',
  'Senior Expert Brand Strategist (37-42 Months)',
  'Project Manager (43-48 Months)',
  'Senior Project Manager (49-54 Months)',
];
const amazonDesignationPromptSuggestions = {
  'Probation (1-3 Months)':
    'Focus on basic catalog execution, front-end listing optimization, manual keyword placement using flat files, resolving simple stranded inventory errors on Seller Central, and fundamental Excel data sorting functions.',
  'Brand Trainee (4-6 Months)':
    'Focus on basic catalog execution, front-end listing optimization, manual keyword placement using flat files, resolving simple stranded inventory errors on Seller Central, and fundamental Excel data sorting functions.',
  'Brand Analyst (7-12 Months)':
    'Focus on operational performance monitoring, deep competitor listing auditing, troubleshooting suppressed buy-boxes, cross-referencing multi-channel inventory data using VLOOKUP/XLOOKUP in Excel, and Linnworks inventory sync setups.',
  'Senior Brand Analyst (13-18 Months)':
    'Focus on identifying high-impact performance leakage, analyzing conversion rate drops across TikTok Shop and Amazon, mapping complex inventory variations, and using Excel Pivot Tables to audit macro-advertising spend metrics.',
  'Brand Strategist (19-24 Months)':
    'Focus on full multi-channel product launch planning, cross-platform traffic scaling (Amazon PPC combined with TikTok Shop affiliate traffic), supply chain risk handling across platforms, and high-level portfolio optimization models.',
  'Senior Brand Strategist (25-30 Months)':
    'Focus on full multi-channel product launch planning, cross-platform traffic scaling (Amazon PPC combined with TikTok Shop affiliate traffic), supply chain risk handling across platforms, and high-level portfolio optimization models.',
  'Expert Brand Strategist (31-36 Months)':
    'Focus on multi-marketplace ecosystem architecture, rescuing dying brands with complex account health issues, cross-border commerce scaling (Temu, Etsy, and eBay simultaneous deployment), and advanced business development frameworks.',
  'Senior Expert Brand Strategist (37-42 Months)':
    'Focus on multi-marketplace ecosystem architecture, rescuing dying brands with complex account health issues, cross-border commerce scaling (Temu, Etsy, and eBay simultaneous deployment), and advanced business development frameworks.',
  'Project Manager (43-48 Months)':
    'Focus on complete team resource allocation, standard operating procedure (SOP) design for large-scale e-commerce operations, cross-departmental delivery timelines, crisis management for critical supply chain collapses, and high-stakes client strategy presentations.',
  'Senior Project Manager (49-54 Months)':
    'Focus on complete team resource allocation, standard operating procedure (SOP) design for large-scale e-commerce operations, cross-departmental delivery timelines, crisis management for critical supply chain collapses, and high-stakes client strategy presentations.',
};
function getRequiredEnv(name) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const generationWebhookUrl = getRequiredEnv('VITE_GENERATION_WEBHOOK_URL');
const testProfileSenderWebhookUrl = getRequiredEnv('VITE_TEST_PROFILE_SENDER_WEBHOOK_URL');
const aiTestCheckerWebhookUrl = getRequiredEnv('VITE_AI_TEST_CHECKER_WEBHOOK_URL');
const resultEmailerWebhookUrl = getRequiredEnv('VITE_RESULT_EMAILER_WEBHOOK_URL');
const authEngineWebhookUrl = getRequiredEnv('VITE_AUTH_ENGINE_WEBHOOK_URL');
const dashboardResultEmailNotificationsEnabled = true;
const appVersion = '1.38';
const defaultTestDurationMinutes = 75;
const testDurationOptions = [
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1 hour 15 minutes', value: 75 },
  { label: '1 hour 30 minutes', value: 90 },
  { label: '2 hours', value: 120 },
];
const supabaseUrl = getRequiredEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getRequiredEnv('VITE_SUPABASE_ANON_KEY');
const adminAuthStorageKey = 'probation-test-admin-authenticated';
const adminThemeStorageKey = 'probation-test-admin-theme';
const adminSessionStorageKey = 'probation-test-admin-session';
const activeQuestionBatchStorageKey = 'probation-test-active-batch-id';
const dashboardRefreshIntervalMs = 3000;
const batchSummaries = {
  'Amazon - 30 Questions': {
    title: 'Amazon Batch - 30 Questions',
    mcq: 20,
    short: 5,
    long: 5,
  },
  'HR - 30 Questions': {
    title: 'HR Batch - 30 Questions',
    mcq: 18,
    short: 7,
    long: 5,
  },
  'Supply Chain - 30 Questions': {
    title: 'Supply Chain Batch - 30 Questions',
    mcq: 20,
    short: 6,
    long: 4,
  },
  'IT - 30 Questions': {
    title: 'IT Batch - 30 Questions',
    mcq: 22,
    short: 4,
    long: 4,
  },
  'Operations - 30 Questions': {
    title: 'Operations Batch - 30 Questions',
    mcq: 20,
    short: 5,
    long: 5,
  },
};

function createQuestionBatch(startId, templates) {
  const focusAreas = [
    'policy compliance',
    'role readiness',
    'communication',
    'decision making',
    'team conduct',
    'documentation',
  ];

  return Array.from({ length: 30 }, (_, index) => {
    const template = templates[index % templates.length];
    const focusArea = focusAreas[index % focusAreas.length];
    const typeCycle = ['MCQ', 'Short Answer', 'Long Answer'];
    const questionType = template.type || typeCycle[index % typeCycle.length];
    const text =
      index < templates.length
        ? template.text
        : `${template.text} Consider the context of ${focusArea}.`;

    return {
      ...template,
      id: startId + index,
      type: questionType,
      text,
      expectedAnswer:
        template.expectedAnswer ||
        'A concise response should reference measurable performance evidence and the required workplace standard.',
      modelAnswer:
        template.modelAnswer ||
        'A strong answer explains the situation, cites documented expectations, describes the action taken, and connects the outcome to probation criteria. It should be specific, fair, and aligned with the candidate role.',
    };
  });
}

const questionBatches = [
  createQuestionBatch(1, [
    {
      type: 'MCQ',
      text: 'Which principle best describes maintaining consistent performance during probation?',
      options: ['Completing only assigned tasks', 'Meeting standards reliably', 'Avoiding feedback', 'Working without documentation'],
      correctAnswer: 'B',
    },
    {
      type: 'Short Answer',
      text: 'What should a supervisor review first when evaluating probation progress?',
      options: ['Attendance trends', 'Personal preferences', 'Office location', 'Informal rumors'],
      correctAnswer: 'A',
      expectedAnswer: 'The supervisor should review documented performance, attendance, and milestone evidence before making a probation decision.',
    },
    {
      type: 'Long Answer',
      text: 'Which action demonstrates strong workplace accountability?',
      options: ['Delaying issue reporting', 'Taking ownership of assigned work', 'Skipping status updates', 'Avoiding collaboration'],
      correctAnswer: 'B',
      modelAnswer: 'Strong accountability means taking ownership of assigned work, communicating risks early, documenting progress, and following through on commitments. During probation, this helps supervisors evaluate reliability and readiness objectively.',
    },
    {
      type: 'MCQ',
      text: 'What is the most appropriate response to a missed probation milestone?',
      options: ['Ignore the gap', 'Document and discuss improvement steps', 'Remove all responsibilities', 'Wait until final review'],
      correctAnswer: 'B',
    },
    {
      type: 'Short Answer',
      text: 'Which factor is most useful in a fair probation assessment?',
      options: ['Measured performance evidence', 'Unverified comments', 'Seniority alone', 'Department size'],
      correctAnswer: 'A',
      expectedAnswer: 'Measured performance evidence is the most useful factor because it supports a fair and consistent review.',
    },
  ]),
  createQuestionBatch(101, [
    {
      type: 'MCQ',
      text: 'Which skill matters most when handling customer escalations?',
      options: ['Speed without review', 'Clear communication', 'Avoiding notes', 'Transferring immediately'],
      correctAnswer: 'B',
    },
    {
      type: 'Short Answer',
      text: 'What should be included in a structured test profile?',
      options: ['Role requirements and scoring rules', 'Candidate hobbies', 'Office seating', 'Payroll date'],
      correctAnswer: 'A',
      expectedAnswer: 'A structured test profile should include role requirements, question batch, scoring rules, and completion expectations.',
    },
    {
      type: 'Long Answer',
      text: 'Which behavior supports operational compliance?',
      options: ['Following documented procedures', 'Skipping approvals', 'Using outdated forms', 'Sharing credentials'],
      correctAnswer: 'A',
      modelAnswer: 'Operational compliance is supported by following approved procedures, using current documentation, protecting credentials, and escalating exceptions through the proper channel. This reduces risk and keeps evaluations consistent.',
    },
    {
      type: 'MCQ',
      text: 'What is the best way to reduce bias in probation testing?',
      options: ['Use consistent criteria', 'Change questions per candidate randomly', 'Avoid score records', 'Use only verbal feedback'],
      correctAnswer: 'A',
    },
    {
      type: 'Short Answer',
      text: 'Which metric is most relevant for test completion monitoring?',
      options: ['Invitations sent', 'Completed assessments', 'Desk allocation', 'Lunch schedule'],
      correctAnswer: 'B',
      expectedAnswer: 'Completed assessments are the most relevant metric because they show which candidates finished the assigned test.',
    },
  ]),
];

const initialProfiles = [
  {
    id: 1,
    name: 'Maryam Siddiqui',
    designation: 'Amazon Assistant',
    email: 'maryam.siddiqui@example.com',
    assignedBatch: 'Amazon — 30 Questions',
    status: 'Email Sent',
    active: true,
  },
  {
    id: 2,
    name: 'Danish Iqbal',
    designation: 'HR Executive',
    email: 'danish.iqbal@example.com',
    assignedBatch: 'HR — 30 Questions',
    status: 'Completed',
    active: true,
  },
  {
    id: 3,
    name: 'Sana Qureshi',
    designation: 'Supply Chain Officer',
    email: 'sana.qureshi@example.com',
    assignedBatch: 'Supply Chain — 30 Questions',
    status: 'In Progress',
    active: true,
  },
  {
    id: 4,
    name: 'Omar Sheikh',
    designation: 'IT Support Analyst',
    email: 'omar.sheikh@example.com',
    assignedBatch: 'IT — 30 Questions',
    status: 'Link Opened',
    active: false,
  },
];

function normalizeQuestionType(type) {
  const normalizedType = String(type || 'MCQ').toLowerCase();

  if (normalizedType.includes('short')) {
    return 'Short Answer';
  }
  if (normalizedType.includes('long')) {
    return 'Long Answer';
  }
  return 'MCQ';
}

function toDatabaseQuestionType(type) {
  const normalizedType = normalizeQuestionType(type);

  if (normalizedType === 'Short Answer') {
    return 'short';
  }
  if (normalizedType === 'Long Answer') {
    return 'long';
  }
  return 'mcq';
}

function parseOptions(row) {
  const rawOptions = row.options || row.mcq_options || row.choices;

  if (Array.isArray(rawOptions)) {
    return rawOptions;
  }

  if (typeof rawOptions === 'string') {
    try {
      const parsedOptions = JSON.parse(rawOptions);
      if (Array.isArray(parsedOptions)) {
        return parsedOptions;
      }
      if (parsedOptions && typeof parsedOptions === 'object') {
        return ['A', 'B', 'C', 'D'].map((key) => parsedOptions[key]).filter(Boolean);
      }
    } catch {
      return rawOptions.split('|').map((option) => option.trim()).filter(Boolean);
    }
  }

  return [row.option_a, row.option_b, row.option_c, row.option_d].filter(Boolean);
}

function normalizeFetchedQuestion(row, index) {
  const type = normalizeQuestionType(row.type || row.question_type);
  const options = parseOptions(row);
  const fallbackAnswer =
    row.model_answer || row.expected_answer || row.correct_answer || row.answer || '';

  return {
    id: row.id || `${row.batch_id || 'batch'}-${index}`,
    databaseId: row.id || '',
    batchId: row.batch_id || '',
    type,
    orderIndex: row.order_index || index + 1,
    text: row.question || row.question_text || row.text || `Generated ${type} question`,
    options: options.length ? options : ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: row.correct_answer || row.correctAnswer || row.answer_key || 'A',
    expectedAnswer: row.expected_answer || fallbackAnswer,
    modelAnswer: row.model_answer || fallbackAnswer,
  };
}

function normalizeQuestionBatch(row) {
  const source = row?.summary || row?.json?.summary || row?.data?.summary || row || {};
  const totalCount =
    source.total_count ?? source.total_questions ?? source.question_count ?? source.count ?? 0;

  return {
    batchId: source.batch_id || source.id,
    department: source.department || source.department_label || 'Unknown',
    designation: source.designation || source.role || 'Unassigned Designation',
    mcqCount: source.mcq_count ?? source.mcq ?? 0,
    shortCount: source.short_count ?? source.short_answer_count ?? source.short ?? 0,
    longCount: source.long_count ?? source.long_answer_count ?? source.long ?? 0,
    totalCount,
    createdAt: source.created_at || source.inserted_at || source.createdAt || '',
  };
}

function formatBatchDate(createdAt) {
  if (!createdAt) {
    return 'date unavailable';
  }

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDesignationLabel(designation) {
  return String(designation || 'Unassigned Designation')
    .replace(/\s*\([^)]*months?[^)]*\)\s*/i, '')
    .trim() || 'Unassigned Designation';
}

function formatBatchOptionLabel(batch) {
  const batchIdSuffix = String(batch.batchId || batch.id || '').slice(-4) || '----';
  const designation = formatDesignationLabel(batch.designation);

  return `${batch.department} - ${designation} - #${batchIdSuffix} (${formatBatchDate(batch.createdAt)})`;
}

function formatBatchSummary(batch) {
  if (!batch) {
    return '';
  }

  return `${batch.department} — ${batch.designation} — ${batch.mcqCount} MCQs | ${batch.shortCount} Short | ${batch.longCount} Long | ${batch.totalCount} Total`;
}

function formatProfileBatch(batch) {
  if (!batch) {
    return 'No batch assigned';
  }

  return `${batch.department} - ${batch.designation} - ${batch.totalCount} Questions`;
}

function generateCandidatePassword() {
  return `PT-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function generateCandidateUsername(name) {
  const slug =
    String(name || 'candidate')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.+|\.+$/g, '') || 'candidate';

  const timestamp = Date.now().toString(36);
  const randomPart =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${slug}.${timestamp}.${randomPart}`;
}

function getValidTestDurationMinutes(value) {
  const duration = Number(value);
  return Number.isFinite(duration) && duration > 0
    ? Math.round(duration)
    : defaultTestDurationMinutes;
}

function buildCandidatePortalLink(username, durationMinutes = defaultTestDurationMinutes) {
  return `${window.location.origin}/portal-replica-007.html?username=${encodeURIComponent(username)}&duration=${encodeURIComponent(getValidTestDurationMinutes(durationMinutes))}`;
}

function getTestDurationMinutesFromLink(testLink) {
  try {
    const url = new URL(testLink, window.location.origin);
    return getValidTestDurationMinutes(url.searchParams.get('duration'));
  } catch {
    return defaultTestDurationMinutes;
  }
}

async function generateUniqueCandidateUsername(name) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const username = generateCandidateUsername(name);
    const response = await fetch(
      `${supabaseUrl}/rest/v1/candidates?select=id&username=eq.${encodeURIComponent(username)}&limit=1`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Username uniqueness check failed');
    }

    const rows = await response.json();
    if (Array.isArray(rows) && rows.length === 0) {
      return username;
    }
  }

  throw new Error('Unable to generate unique candidate link');
}

function normalizeCandidateProfile(row, batches = []) {
  const selectedBatch = batches.find((batch) => batch.batchId === row.batch_id);

  return {
    id: row.id,
    name: row.full_name || 'Unnamed Candidate',
    department: row.department || selectedBatch?.department || 'Unassigned Department',
    designation: row.designation || selectedBatch?.designation || 'Unassigned Designation',
    email: row.email || '',
    assignedBatch: formatProfileBatch(selectedBatch),
    batchId: row.batch_id || '',
    username: row.username || '',
    password: row.password || '',
    testLink: row.test_link || '',
    testDurationMinutes: getTestDurationMinutesFromLink(row.test_link),
    active: Boolean(row.is_active),
    completed: row.status === 'completed',
  };
}

function formatCandidateStatus(status) {
  const normalizedStatus = String(status || 'pending').toLowerCase();

  if (normalizedStatus === 'link_opened') {
    return 'Link Opened';
  }

  if (normalizedStatus === 'in_progress') {
    return 'In Progress';
  }

  if (normalizedStatus === 'completed') {
    return 'Completed';
  }

  if (normalizedStatus === 'terminated') {
    return 'Terminated';
  }

  return 'Email Sent';
}

function normalizeDashboardCandidate(row, latestResult = null, attemptCount = 0, latestFinishedSession = null) {
  const status = formatCandidateStatus(row.status);
  const isFinishedStatus = ['Completed', 'Terminated'].includes(status);
  const resultMatchesLatestSession =
    !latestFinishedSession?.id ||
    (latestResult?.session_id && String(latestResult.session_id) === String(latestFinishedSession.id));
  const hasUsableResult =
    Boolean(latestResult?.terminated) ||
    (typeof latestResult?.passed === 'boolean' && latestResult?.percentage !== null);
  const isResultPending = isFinishedStatus && (!latestResult || !resultMatchesLatestSession || !hasUsableResult);
  const visibleResult = isResultPending ? null : latestResult;
  const totalScore = toDashboardNumber(visibleResult?.total_score);
  const percentage = toDashboardNumber(visibleResult?.percentage);
  const mcqScore = toDashboardNumber(visibleResult?.mcq_score);
  const shortScore = toDashboardNumber(visibleResult?.short_score);
  const longScore = toDashboardNumber(visibleResult?.long_score);
  const hasResult = typeof visibleResult?.passed === 'boolean';
  const submittedAt = latestFinishedSession?.submitted_at || null;
  const latestActivityAt =
    visibleResult?.created_at ||
    latestFinishedSession?.submitted_at ||
    latestFinishedSession?.created_at ||
    row.updated_at ||
    row.created_at ||
    null;

  return {
    id: row.id,
    name: row.full_name || 'Unnamed Candidate',
    designation: row.designation || 'Unassigned Designation',
    department: row.department || 'Unassigned Department',
    batchId: row.batch_id || '',
    status,
    attempts: attemptCount,
    score: totalScore,
    percentage,
    mcqScore,
    shortScore,
    longScore,
    result: hasResult ? (visibleResult.passed ? 'Pass' : 'Fail') : null,
    resultUpdatedAt: visibleResult?.created_at || null,
    submittedAt,
    latestActivityAt,
    createdAt: row.created_at || null,
    isResultPending,
    active: Boolean(row.is_active),
  };
}

function getDashboardResultSignature(resultRow) {
  if (!resultRow?.id) {
    return '';
  }

  return [
    resultRow.id,
    resultRow.session_id,
    resultRow.mcq_score,
    resultRow.short_score,
    resultRow.long_score,
    resultRow.total_score,
    resultRow.percentage,
    resultRow.passed,
    resultRow.terminated,
    resultRow.termination_reason,
    resultRow.created_at,
  ].join('|');
}

function toDashboardNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function buildResultEmailerPayload(candidateRow, resultRow, { sendResults = false } = {}) {
  if (resultRow.terminated) {
    return {
      event_type: 'test_terminated',
      send_results: sendResults,
      candidate_id: candidateRow.id,
      session_id: resultRow.session_id,
      candidate_name: candidateRow.full_name || 'Unnamed Candidate',
      candidate_email: candidateRow.email || '',
      designation: candidateRow.designation || '',
      department: candidateRow.department || '',
      termination_reason:
        resultRow.termination_reason || 'Test terminated due to policy violations.',
    };
  }

  return {
    event_type: 'test_result',
    send_results: sendResults,
    candidate_id: candidateRow.id,
    session_id: resultRow.session_id,
    candidate_name: candidateRow.full_name || 'Unnamed Candidate',
    candidate_email: candidateRow.email || '',
    designation: candidateRow.designation || '',
    department: candidateRow.department || '',
    mcq_score: resultRow.mcq_score,
    short_score: resultRow.short_score,
    long_score: resultRow.long_score,
    total_score: resultRow.total_score,
    percentage: resultRow.percentage,
    passed: Boolean(resultRow.passed),
    status: resultRow.passed ? 'pass' : 'fail',
  };
}

async function sendResultEmailerPayload(payload) {
  const response = await fetch(resultEmailerWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Result emailer webhook failed');
  }
}

async function claimResultEmailNotification(resultRow) {
  if (!resultRow?.id || resultRow.email_sent_to_hr) {
    return false;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/results?id=eq.${encodeURIComponent(resultRow.id)}&email_sent_to_hr=is.false`,
    {
      method: 'PATCH',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ email_sent_to_hr: true }),
    },
  );

  if (!response.ok) {
    throw new Error('Result email notification claim failed');
  }

  const rows = await response.json();
  return Array.isArray(rows) && rows.length > 0;
}

async function releaseResultEmailNotificationClaim(resultRow) {
  if (!resultRow?.id) {
    return;
  }

  await fetch(`${supabaseUrl}/rest/v1/results?id=eq.${encodeURIComponent(resultRow.id)}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_sent_to_hr: false }),
  });
}

async function notifyResultEmailerForUpdatedResults(candidateRows, resultRows) {
  if (!dashboardResultEmailNotificationsEnabled) {
    return;
  }

  const candidatesById = new Map(candidateRows.map((candidateRow) => [candidateRow.id, candidateRow]));
  const latestResultsBySession = new Map();

  resultRows
    .slice()
    .sort((firstRow, secondRow) => {
      const firstDate = new Date(firstRow.created_at || 0).getTime();
      const secondDate = new Date(secondRow.created_at || 0).getTime();
      return secondDate - firstDate;
    })
    .forEach((resultRow) => {
      const sessionKey = resultRow.session_id || resultRow.id;
      if (sessionKey && !latestResultsBySession.has(sessionKey)) {
        latestResultsBySession.set(sessionKey, resultRow);
      }
    });

  const sendableResults = [...latestResultsBySession.values()].filter((resultRow) => {
    const hasScoredResult =
      typeof resultRow.passed === 'boolean' && resultRow.percentage !== null;
    const hasTerminationResult = Boolean(resultRow.terminated);
    return (
      !resultRow.email_sent_to_hr &&
      (hasScoredResult || hasTerminationResult) &&
      candidatesById.has(resultRow.candidate_id)
    );
  });

  for (const resultRow of sendableResults) {
    const candidateRow = candidatesById.get(resultRow.candidate_id);
    const didClaim = await claimResultEmailNotification(resultRow);
    if (!didClaim) {
      continue;
    }

    try {
      await sendResultEmailerPayload(buildResultEmailerPayload(candidateRow, resultRow));
    } catch (error) {
      await releaseResultEmailNotificationClaim(resultRow);
      throw error;
    }
  }
}

async function sendTestProfilePayload(payload) {
  const response = await fetch(testProfileSenderWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Test profile sender webhook failed');
  }
}

async function sendAuthEnginePayload(payload) {
  const response = await fetch(authEngineWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const responseText = await response.text();
  let responseBody = null;

  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = { message: responseText };
    }
  }

  if (!response.ok) {
    throw new Error(responseBody?.message || responseBody?.error || 'Authentication request failed');
  }

  if (
    responseBody &&
    (responseBody.success === false || responseBody.ok === false || responseBody.status === 'error')
  ) {
    throw new Error(responseBody.message || responseBody.error || 'Authentication request failed');
  }

  return responseBody || { success: true };
}

function isConfirmedAuthResponse(responseBody) {
  if (!responseBody) {
    return false;
  }

  const status = String(responseBody.status || '').toLowerCase();
  const message = String(responseBody.message || '').toLowerCase();

  return (
    responseBody.success === true ||
    responseBody.ok === true ||
    responseBody.authenticated === true ||
    responseBody.verified === true ||
    responseBody.valid === true ||
    status === 'success' ||
    status === 'verified' ||
    status === 'authenticated' ||
    message.includes('verified') ||
    message.includes('authenticated') ||
    message.includes('activated') ||
    message.includes('password updated')
  );
}

function buildAdminAccountFromAuthResponse(responseBody, email) {
  const user = responseBody?.user || responseBody?.account || responseBody?.data || responseBody || {};
  const role = String(user.role || responseBody?.role || 'admin').toLowerCase();
  const fullName = user.full_name || user.name || user.label || email;

  return {
    id: user.id || `${role}-${email}`,
    role: role === 'manager' ? 'manager' : 'admin',
    label: fullName,
    username: user.email || email,
  };
}

function getStoredAdminSession() {
  const storedSession =
    window.localStorage.getItem(adminSessionStorageKey) ||
    window.sessionStorage.getItem(adminSessionStorageKey);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    return null;
  }
}

function formatAccountRole(role) {
  return String(role || 'admin').toLowerCase() === 'manager' ? 'Manager' : 'Admin';
}

function buildCreateProfileSenderPayload(profile) {
  return {
    action: 'create_profile',
    full_name: profile.name,
    email: profile.email,
    password: profile.password,
    department: profile.department,
    designation: profile.designation,
    batch_id: profile.batchId,
    batch_label: profile.assignedBatch,
    portal_link: profile.testLink,
    username: profile.username,
    test_duration_minutes: profile.testDurationMinutes,
  };
}

function buildResendCredentialsPayload(profile) {
  return {
    action: 'resend_credentials',
    full_name: profile.name,
    email: profile.email,
    password: profile.password,
    department: profile.department,
    designation: profile.designation,
    portal_link: profile.testLink,
    username: profile.username,
    test_duration_minutes: profile.testDurationMinutes,
  };
}

function buildRetakeTestPayload(profile, resetCredentials = {}) {
  return {
    action: 'retake_test',
    candidate_id: profile.id,
    full_name: profile.name,
    email: profile.email,
    new_password: resetCredentials.password || profile.password || '',
    department: profile.department,
    designation: profile.designation,
    portal_link: resetCredentials.testLink || profile.testLink || '',
    username: resetCredentials.username || profile.username || '',
    test_duration_minutes:
      resetCredentials.testDurationMinutes || profile.testDurationMinutes || defaultTestDurationMinutes,
  };
}

function extractBatchId(payload) {
  if (Array.isArray(payload)) {
    return (
      payload[0]?.batch_id ||
      payload[0]?.id ||
      payload[0]?.summary?.id ||
      payload[0]?.json?.batch_id ||
      payload[0]?.json?.id ||
      payload[0]?.json?.summary?.id ||
      payload[0]?.data?.batch_id ||
      payload[0]?.data?.id ||
      payload[0]?.data?.summary?.id
    );
  }

  return (
    payload?.batch_id ||
    payload?.id ||
    payload?.summary?.id ||
    payload?.json?.batch_id ||
    payload?.json?.id ||
    payload?.json?.summary?.id ||
    payload?.data?.batch_id ||
    payload?.data?.id ||
    payload?.data?.summary?.id
  );
}

function extractQuestions(payload) {
  const data = Array.isArray(payload) ? payload[0] : payload;

  return (
    data?.questions ||
    data?.summary?.questions ||
    data?.json?.questions ||
    data?.json?.summary?.questions ||
    data?.data?.questions ||
    data?.data?.summary?.questions ||
    []
  );
}

function isCorrectMcqOption(correctAnswer, optionLabel, optionText) {
  const normalizedAnswer = String(correctAnswer || '').trim().toLowerCase();

  return (
    normalizedAnswer === optionLabel.toLowerCase() ||
    normalizedAnswer === optionText.trim().toLowerCase()
  );
}

function getQuestionCountValue(count) {
  if (count === '') {
    return 0;
  }

  const numericCount = Number(count);
  return Number.isFinite(numericCount) && numericCount > 0 ? numericCount : 0;
}

function formatElapsedTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () =>
      window.localStorage.getItem(adminAuthStorageKey) === 'true' ||
      window.sessionStorage.getItem(adminAuthStorageKey) === 'true',
  );
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminTheme, setAdminTheme] = useState(
    () => window.localStorage.getItem(adminThemeStorageKey) || 'light',
  );
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [candidates, setCandidates] = useState([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState('');
  const [lastDashboardSync, setLastDashboardSync] = useState(null);
  const [highlightedDashboardCandidateIds, setHighlightedDashboardCandidateIds] = useState([]);
  const dashboardRefreshInFlight = useRef(false);
  const dashboardResultSignaturesRef = useRef(new Map());
  const dashboardResultsInitializedRef = useRef(false);
  const dashboardHighlightTimeoutRef = useRef(null);
  const resultOverviewRefreshInFlight = useRef(false);
  const [questionPrompt, setQuestionPrompt] = useState('');
  const [questionDepartment, setQuestionDepartment] = useState('Amazon');
  const [customQuestionDepartment, setCustomQuestionDepartment] = useState('');
  const [questionDesignation, setQuestionDesignation] = useState(questionDesignationOptions[0]);
  const [questionTypes, setQuestionTypes] = useState({
    mcq: { selected: true, count: 20 },
    short: { selected: true, count: 5 },
    long: { selected: true, count: 5 },
  });
  const [questionBatchIndex, setQuestionBatchIndex] = useState(0);
  const [questions, setQuestions] = useState(questionBatches[0]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [questionTypeFilter, setQuestionTypeFilter] = useState('All');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generationElapsedSeconds, setGenerationElapsedSeconds] = useState(0);
  const [generationError, setGenerationError] = useState('');
  const [loadedBatchId, setLoadedBatchId] = useState('');
  const [questionBatchRecords, setQuestionBatchRecords] = useState([]);
  const [activeBatchSummary, setActiveBatchSummary] = useState(null);
  const [isLoadingBatchQuestions, setIsLoadingBatchQuestions] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileForm, setProfileForm] = useState({
    name: '',
    department: 'Amazon',
    customDepartment: '',
    designation: profileAmazonDesignationOptions[0],
    email: '',
    assignedBatch: '',
    testDurationMinutes: defaultTestDurationMinutes,
  });
  const [sendingResultCandidateIds, setSendingResultCandidateIds] = useState([]);
  const [resultOverview, setResultOverview] = useState({
    isOpen: false,
    isLoading: false,
    error: '',
    candidate: null,
    result: null,
    session: null,
    questions: [],
    answers: [],
    lastUpdated: null,
  });
  const [toasts, setToasts] = useState([]);

  const section = useMemo(
    () => navItems.find((item) => item.id === activeSection && !item.disabled) || navItems[0],
    [activeSection],
  );

  useEffect(() => {
    const normalizedTheme = adminTheme === 'dark' ? 'dark' : 'light';
    window.localStorage.setItem(adminThemeStorageKey, normalizedTheme);
    document.documentElement.dataset.adminTheme = normalizedTheme;
    document.documentElement.style.colorScheme = normalizedTheme;

    return () => {
      document.documentElement.style.colorScheme = 'light';
    };
  }, [adminTheme]);
  const departments = useMemo(
    () => ['All Departments', ...Array.from(new Set(candidates.map((candidate) => candidate.department)))],
    [candidates],
  );
  const statuses = useMemo(
    () => ['All Statuses', ...Array.from(new Set(candidates.map((candidate) => candidate.status)))],
    [candidates],
  );
  const filteredCandidates = useMemo(
    () => {
      const highlightedIds = new Set(highlightedDashboardCandidateIds);

      return candidates
        .filter((candidate) => {
        const departmentMatches =
          departmentFilter === 'All Departments' || candidate.department === departmentFilter;
        const statusMatches = statusFilter === 'All Statuses' || candidate.status === statusFilter;

        return departmentMatches && statusMatches;
      })
        .map((candidate) => ({
          ...candidate,
          isResultHighlighted: highlightedIds.has(candidate.id),
        }))
        .sort((firstCandidate, secondCandidate) => {
          const firstHighlighted = highlightedIds.has(firstCandidate.id);
          const secondHighlighted = highlightedIds.has(secondCandidate.id);
          const getCandidatePriority = (candidate) => {
            if (candidate.isResultPending) {
              return 0;
            }

            if (highlightedIds.has(candidate.id)) {
              return 1;
            }

            if (['Completed', 'Terminated'].includes(candidate.status)) {
              return 2;
            }

            if (candidate.status === 'In Progress') {
              return 3;
            }

            return 4;
          };
          const firstPriority = getCandidatePriority(firstCandidate);
          const secondPriority = getCandidatePriority(secondCandidate);

          if (firstPriority !== secondPriority) {
            return firstPriority - secondPriority;
          }

          if (firstHighlighted !== secondHighlighted) {
            return firstHighlighted ? -1 : 1;
          }

          const firstTime = new Date(firstCandidate.latestActivityAt || 0).getTime();
          const secondTime = new Date(secondCandidate.latestActivityAt || 0).getTime();

          if (firstTime !== secondTime) {
            return secondTime - firstTime;
          }

          return String(firstCandidate.name).localeCompare(String(secondCandidate.name));
        });
    },
    [candidates, departmentFilter, highlightedDashboardCandidateIds, statusFilter],
  );
  const dashboardStats = useMemo(() => {
    const completed = candidates.filter((candidate) => candidate.status === 'Completed');
    const passed = completed.filter((candidate) => candidate.result === 'Pass').length;
    const pending = candidates.filter(
      (candidate) => candidate.status !== 'Completed' && candidate.status !== 'Terminated',
    ).length;
    const passRate = completed.length ? Math.round((passed / completed.length) * 100) : 0;

    return [
      ['Total Candidates', candidates.length],
      ['Tests Completed', completed.length],
      ['Tests Pending', pending],
      ['Pass Rate', `${passRate}%`],
    ];
  }, [candidates]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      return;
    }

    fetchDashboardData();
    fetchQuestionBatches();

    const storedBatchId = window.localStorage.getItem(activeQuestionBatchStorageKey);
    if (storedBatchId) {
      fetchQuestionsForBatch(storedBatchId, null, { showLoadedToast: false });
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      return undefined;
    }

    const refreshDashboardSilently = () => {
      fetchDashboardData({ silent: true });
    };
    const refreshWhenVisible = () => {
      if (!document.hidden) {
        refreshDashboardSilently();
      }
    };

    const dashboardRefreshTimer = window.setInterval(
      refreshDashboardSilently,
      dashboardRefreshIntervalMs,
    );

    document.addEventListener('visibilitychange', refreshWhenVisible);
    window.addEventListener('focus', refreshDashboardSilently);

    return () => {
      window.clearInterval(dashboardRefreshTimer);
      if (dashboardHighlightTimeoutRef.current) {
        window.clearTimeout(dashboardHighlightTimeoutRef.current);
      }
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.removeEventListener('focus', refreshDashboardSilently);
    };
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (!resultOverview.isOpen || !resultOverview.candidate?.id) {
      return undefined;
    }

    const candidate = resultOverview.candidate;
    const refreshSilently = () => {
      if (!document.hidden) {
        refreshResultOverview(candidate, { silent: true });
      }
    };

    const refreshTimer = window.setInterval(refreshSilently, 3000);
    window.addEventListener('focus', refreshSilently);
    document.addEventListener('visibilitychange', refreshSilently);

    return () => {
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', refreshSilently);
      document.removeEventListener('visibilitychange', refreshSilently);
    };
  }, [resultOverview.isOpen, resultOverview.candidate?.id]);

  useEffect(() => {
    if (!resultOverview.isOpen) {
      return undefined;
    }

    function handleResultOverviewEscape(event) {
      if (event.key === 'Escape') {
        closeResultOverview();
      }
    }

    window.addEventListener('keydown', handleResultOverviewEscape);

    return () => {
      window.removeEventListener('keydown', handleResultOverviewEscape);
    };
  }, [resultOverview.isOpen]);

  useEffect(() => {
    if (!isGeneratingQuestions) {
      return undefined;
    }

    setGenerationElapsedSeconds(0);
    const timer = window.setInterval(() => {
      setGenerationElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isGeneratingQuestions]);

  useEffect(() => {
    if (questionBatchRecords.length === 0) {
      return;
    }

    setProfileForm((currentForm) => {
      const hasSelectedBatch = questionBatchRecords.some(
        (batch) => batch.batchId === currentForm.assignedBatch,
      );

      if (hasSelectedBatch) {
        return currentForm;
      }

      return {
        ...currentForm,
        assignedBatch: questionBatchRecords[0].batchId,
      };
    });
  }, [questionBatchRecords]);

  useEffect(() => {
    if (questionBatchRecords.length === 0) {
      setProfiles([]);
      return;
    }

    fetchCandidateProfiles(questionBatchRecords);
  }, [questionBatchRecords]);

  async function toggleCandidate(candidateId) {
    const candidate = candidates.find((currentCandidate) => currentCandidate.id === candidateId);
    if (!candidate) {
      return;
    }

    const nextActive = !candidate.active;
    setDashboardError('');

    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/candidates?id=eq.${encodeURIComponent(candidateId)}`,
        {
          method: 'PATCH',
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_active: nextActive }),
        },
      );

      if (!response.ok) {
        throw new Error('Candidate active state update failed');
      }

      setCandidates((currentCandidates) =>
        currentCandidates.map((currentCandidate) =>
          currentCandidate.id === candidateId
            ? { ...currentCandidate, active: nextActive }
            : currentCandidate,
        ),
      );
      setProfiles((currentProfiles) =>
        currentProfiles.map((profile) =>
          profile.id === candidateId ? { ...profile, active: nextActive } : profile,
        ),
      );
      showToast({
        type: 'success',
        title: nextActive ? 'Candidate activated' : 'Candidate deactivated',
        message: `${candidate.name} status was updated.`,
      });
    } catch {
      setDashboardError('Candidate status could not be updated.');
      showToast({
        type: 'error',
        title: 'Status update failed',
        message: 'Candidate active status could not be saved.',
      });
    }
  }

  function buildGenerationPayload(overrides = {}) {
    const loadedDepartment =
      questionDepartment === 'Custom' ? customQuestionDepartment || 'Custom' : questionDepartment;
    const activePrompt = questionPrompt.trim();

    return {
      department: loadedDepartment,
      designation: questionDesignation,
      mcq_count: questionTypes.mcq.selected
        ? getQuestionCountValue(questionTypes.mcq.count)
        : 0,
      short_count: questionTypes.short.selected
        ? getQuestionCountValue(questionTypes.short.count)
        : 0,
      long_count: questionTypes.long.selected
        ? getQuestionCountValue(questionTypes.long.count)
        : 0,
      prompt: activePrompt,
      regenerate: false,
      replace_existing: false,
      ...overrides,
    };
  }

  function isQuestionGeneratorReady() {
    const resolvedDepartment =
      questionDepartment === 'Custom' ? customQuestionDepartment.trim() : questionDepartment.trim();
    const selectedTypeCount = Object.values(questionTypes).filter((type) => type.selected).length;
    const totalQuestionCount = Object.values(questionTypes).reduce(
      (total, type) => (type.selected ? total + getQuestionCountValue(type.count) : total),
      0,
    );

    return (
      questionPrompt.trim().length > 0 &&
      resolvedDepartment.length > 0 &&
      questionDesignation.trim().length > 0 &&
      selectedTypeCount > 0 &&
      totalQuestionCount > 0
    );
  }

  function clearQuestionGeneratorInputs() {
    setQuestionPrompt('');
    setQuestionTypes({
      mcq: { selected: false, count: '' },
      short: { selected: false, count: '' },
      long: { selected: false, count: '' },
    });
    setGenerationError('');
  }

  async function regenerateQuestions() {
    const batchId = loadedBatchId || activeBatchSummary?.batchId;

    if (!isQuestionGeneratorReady()) {
      setGenerationError('Enter a prompt, department, designation, and question counts before regenerating.');
      showToast({
        type: 'warning',
        title: 'Generator details required',
        message: 'Complete the prompt, role details, and question counts before regenerating.',
      });
      return;
    }

    if (!batchId) {
      setGenerationError('Load a generated batch before regenerating questions.');
      showToast({
        type: 'warning',
        title: 'No batch loaded',
        message: 'Load a generated batch before regenerating questions.',
      });
      return;
    }

    setIsGeneratingQuestions(true);
    setGenerationElapsedSeconds(0);
    setGenerationError('');

    try {
      const regenerationPayload = buildGenerationPayload({
        batch_id: batchId,
        regenerate: true,
        replace_existing: true,
      });
      const generationResponse = await fetch(generationWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(regenerationPayload),
      });

      if (!generationResponse.ok) {
        throw new Error('Regeneration webhook failed');
      }

      const generationPayload = await generationResponse.json();
      const generationData = Array.isArray(generationPayload) ? generationPayload[0] : generationPayload;
      if (generationData?.status && generationData.status !== 'success') {
        throw new Error('Regeneration webhook did not return success');
      }

      const responseBatchId = extractBatchId(generationPayload) || batchId;
      const responseQuestions = extractQuestions(generationPayload);
      const hasDirectQuestions = Array.isArray(responseQuestions) && responseQuestions.length > 0;

      if (hasDirectQuestions) {
        setQuestions(responseQuestions.map(normalizeFetchedQuestion));
        setQuestionTypeFilter('All');
        setEditingQuestionId(null);
        setSelectedQuestionIds([]);
        setLoadedBatchId(responseBatchId);
        window.localStorage.setItem(activeQuestionBatchStorageKey, responseBatchId);
      } else {
        await fetchQuestionsForBatch(responseBatchId);
      }

      const refreshedBatch = await refreshQuestionBatches(responseBatchId);
      const regeneratedBatch = normalizeQuestionBatch({
        ...regenerationPayload,
        total_count:
          regenerationPayload.mcq_count +
          regenerationPayload.short_count +
          regenerationPayload.long_count,
        ...generationData,
        batch_id: responseBatchId,
        id: responseBatchId,
      });
      const nextBatchSummary = refreshedBatch || {
        ...regeneratedBatch,
        createdAt: regeneratedBatch.createdAt || activeBatchSummary?.createdAt || new Date().toISOString(),
      };
      setActiveBatchSummary(nextBatchSummary);
      setQuestionBatchRecords((currentBatches) => {
        const withoutRegenerated = currentBatches.filter(
          (batch) => batch.batchId !== responseBatchId,
        );
        return [nextBatchSummary, ...withoutRegenerated];
      });
      showToast({
        type: 'success',
        title: 'Questions regenerated',
        message: `${nextBatchSummary.totalCount || questions.length} questions are ready for review.`,
      });
    } catch {
      setGenerationError('Regeneration failed, please try again');
      showToast({
        type: 'error',
        title: 'Regeneration failed',
        message: 'AI question regeneration could not be completed.',
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  function updateQuestion(questionId, field, value) {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId ? { ...question, [field]: value } : question,
      ),
    );
  }

  function updateQuestionOption(questionId, optionIndex, value) {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        return {
          ...question,
          options: question.options.map((option, index) => (index === optionIndex ? value : option)),
        };
      }),
    );
  }

  function buildQuestionRowFilter(question) {
    if (question?.databaseId) {
      return `id=eq.${encodeURIComponent(question.databaseId)}`;
    }

    if (question?.batchId && question?.orderIndex) {
      return `batch_id=eq.${encodeURIComponent(question.batchId)}&order_index=eq.${encodeURIComponent(question.orderIndex)}`;
    }

    return '';
  }

  async function saveQuestionToSupabase(questionId) {
    const question = questions.find((currentQuestion) => currentQuestion.id === questionId);

    if (!question) {
      return;
    }

    const rowFilter = buildQuestionRowFilter(question);

    if (!rowFilter) {
      throw new Error('Question update failed');
    }

    const updatePayload = {
      question: question.text,
    };

    if (question.type === 'MCQ') {
      updatePayload.options = JSON.stringify(question.options);
      updatePayload.correct_answer = question.correctAnswer;
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/questions?${rowFilter}`,
      {
        method: 'PATCH',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(updatePayload),
      },
    );

    if (!response.ok) {
      throw new Error('Question update failed');
    }

    const updatedRows = await response.json();
    if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
      throw new Error('Question update failed');
    }
  }

  async function toggleQuestionEdit(questionId) {
    if (editingQuestionId === questionId) {
      try {
        await saveQuestionToSupabase(questionId);
        setEditingQuestionId(null);
        setGenerationError('');
        showToast({
          type: 'success',
          title: 'Question updated',
          message: 'The question was saved to Supabase.',
        });
      } catch {
        setGenerationError('Question update failed, please try again');
        showToast({
          type: 'error',
          title: 'Question update failed',
          message: 'The question could not be saved.',
        });
      }
      return;
    }

    setEditingQuestionId(questionId);
  }

  async function deleteQuestionsFromSupabase(questionIds) {
    await Promise.all(
      questionIds.map(async (questionId) => {
        const question = questions.find((currentQuestion) => currentQuestion.id === questionId);
        const rowFilter = buildQuestionRowFilter(question || { databaseId: questionId });

        if (!rowFilter) {
          throw new Error('Question delete failed');
        }

        const response = await fetch(
          `${supabaseUrl}/rest/v1/questions?${rowFilter}`,
          {
            method: 'DELETE',
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
              Prefer: 'return=representation',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Question delete failed');
        }

        const deletedRows = await response.json();
        if (!Array.isArray(deletedRows) || deletedRows.length === 0) {
          throw new Error('Question delete failed');
        }
      }),
    );
  }

  async function deleteQuestions(questionIds) {
    const idsToDelete = Array.from(new Set(questionIds)).filter(Boolean);

    if (idsToDelete.length === 0) {
      return;
    }

    await deleteQuestionsFromSupabase(idsToDelete);
    setQuestions((currentQuestions) =>
      currentQuestions.filter((question) => !idsToDelete.includes(question.id)),
    );
    setSelectedQuestionIds((currentIds) =>
      currentIds.filter((questionId) => !idsToDelete.includes(questionId)),
    );
    if (idsToDelete.includes(editingQuestionId)) {
      setEditingQuestionId(null);
    }
    setGenerationError('');
    showToast({
      type: 'success',
      title: idsToDelete.length === 1 ? 'Question deleted' : 'Questions deleted',
      message: `${idsToDelete.length} question${idsToDelete.length === 1 ? '' : 's'} removed from Supabase.`,
    });
  }

  function requestDeleteQuestion(questionId) {
    setConfirmation({
      title: 'Delete question?',
      message: 'This question will be removed from the current generated batch.',
      confirmLabel: 'Delete Question',
      action: () => deleteQuestions([questionId]),
    });
  }

  function toggleQuestionSelection(questionId) {
    setSelectedQuestionIds((currentIds) =>
      currentIds.includes(questionId)
        ? currentIds.filter((currentId) => currentId !== questionId)
        : [...currentIds, questionId],
    );
  }

  function selectVisibleQuestions(questionIds) {
    setSelectedQuestionIds((currentIds) => Array.from(new Set([...currentIds, ...questionIds])));
  }

  function clearQuestionSelection() {
    setSelectedQuestionIds([]);
  }

  function requestDeleteSelectedQuestions() {
    setConfirmation({
      title: 'Delete selected questions?',
      message: `${selectedQuestionIds.length} selected question${selectedQuestionIds.length === 1 ? '' : 's'} will be permanently removed from Supabase.`,
      confirmLabel: 'Delete Selected',
      action: () => deleteQuestions(selectedQuestionIds),
    });
  }

  function requestDeleteAllQuestions() {
    setConfirmation({
      title: 'Delete all questions?',
      message: `${questions.length} question${questions.length === 1 ? '' : 's'} in the loaded batch will be permanently removed from Supabase.`,
      confirmLabel: 'Delete All',
      action: () => deleteQuestions(questions.map((question) => question.id)),
    });
  }

  async function deleteLoadedQuestionBatch() {
    if (!loadedBatchId) {
      return;
    }

    const batchIdToDelete = loadedBatchId;
    const rows = await deleteSupabaseRows(
      'question_batches',
      `id=eq.${encodeURIComponent(batchIdToDelete)}`,
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Question batch delete failed');
    }

    setQuestionBatchRecords((currentBatches) =>
      currentBatches.filter((batch) => batch.batchId !== batchIdToDelete),
    );
    setQuestions([]);
    setSelectedQuestionIds([]);
    setEditingQuestionId(null);
    setLoadedBatchId('');
    setActiveBatchSummary(null);
    setQuestionTypeFilter('All');
    window.localStorage.removeItem(activeQuestionBatchStorageKey);
    showToast({
      type: 'success',
      title: 'Batch deleted',
      message: 'The selected question batch and its questions were removed from Supabase.',
    });
  }

  function requestDeleteLoadedQuestionBatch() {
    setConfirmation({
      title: 'Delete question batch?',
      message:
        'This will permanently delete the loaded batch and all questions inside it from Supabase.',
      confirmLabel: 'Delete Batch',
      action: deleteLoadedQuestionBatch,
    });
  }

  async function fetchDashboardData({ silent = false } = {}) {
    if (dashboardRefreshInFlight.current) {
      return;
    }

    dashboardRefreshInFlight.current = true;
    if (!silent) {
      setIsLoadingDashboard(true);
    }
    setDashboardError('');

    try {
      const [candidateResponse, resultResponse, testSessionResponse] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/candidates?select=*&order=created_at.desc`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        }),
        fetch(`${supabaseUrl}/rest/v1/results?select=*&order=created_at.desc`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        }),
        fetch(`${supabaseUrl}/rest/v1/test_sessions?select=id,candidate_id,status,created_at,submitted_at`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        }),
      ]);

      if (!candidateResponse.ok || !resultResponse.ok || !testSessionResponse.ok) {
        throw new Error('Dashboard fetch failed');
      }

      const [candidateRows, resultRows, testSessionRows] = await Promise.all([
        candidateResponse.json(),
        resultResponse.json(),
        testSessionResponse.json(),
      ]);
      const latestResultsByCandidate = new Map();
      const attemptsByCandidate = new Map();
      const latestFinishedSessionsByCandidate = new Map();

      resultRows.forEach((resultRow) => {
        if (resultRow.candidate_id && !latestResultsByCandidate.has(resultRow.candidate_id)) {
          latestResultsByCandidate.set(resultRow.candidate_id, resultRow);
        }
      });

      const nextResultSignatures = new Map();
      const newlyUpdatedCandidateIds = [];
      latestResultsByCandidate.forEach((resultRow, candidateId) => {
        const resultSignature = getDashboardResultSignature(resultRow);
        const hasCompletedResult =
          Boolean(resultRow.terminated) ||
          (typeof resultRow.passed === 'boolean' && resultRow.percentage !== null);

        nextResultSignatures.set(candidateId, resultSignature);
        if (
          dashboardResultsInitializedRef.current &&
          hasCompletedResult &&
          dashboardResultSignaturesRef.current.get(candidateId) !== resultSignature
        ) {
          newlyUpdatedCandidateIds.push(candidateId);
        }
      });
      dashboardResultSignaturesRef.current = nextResultSignatures;
      dashboardResultsInitializedRef.current = true;

      if (newlyUpdatedCandidateIds.length > 0) {
        setHighlightedDashboardCandidateIds(newlyUpdatedCandidateIds);
        if (dashboardHighlightTimeoutRef.current) {
          window.clearTimeout(dashboardHighlightTimeoutRef.current);
        }
        dashboardHighlightTimeoutRef.current = window.setTimeout(() => {
          setHighlightedDashboardCandidateIds([]);
          dashboardHighlightTimeoutRef.current = null;
        }, 18000);
      }

      testSessionRows.forEach((sessionRow) => {
        if (!sessionRow.candidate_id || !['submitted', 'terminated'].includes(sessionRow.status)) {
          return;
        }

        const currentLatestSession = latestFinishedSessionsByCandidate.get(sessionRow.candidate_id);
        const sessionTime = new Date(sessionRow.submitted_at || sessionRow.created_at || 0).getTime();
        const currentLatestSessionTime = new Date(
          currentLatestSession?.submitted_at || currentLatestSession?.created_at || 0,
        ).getTime();

        if (!currentLatestSession || sessionTime > currentLatestSessionTime) {
          latestFinishedSessionsByCandidate.set(sessionRow.candidate_id, sessionRow);
        }

        attemptsByCandidate.set(
          sessionRow.candidate_id,
          (attemptsByCandidate.get(sessionRow.candidate_id) || 0) + 1,
        );
      });

      setCandidates(
        candidateRows.map((candidateRow) =>
          normalizeDashboardCandidate(
            candidateRow,
            latestResultsByCandidate.get(candidateRow.id),
            attemptsByCandidate.get(candidateRow.id) || 0,
            latestFinishedSessionsByCandidate.get(candidateRow.id),
          ),
        ),
      );
      notifyResultEmailerForUpdatedResults(candidateRows, resultRows).catch(() => {
        setDashboardError('Dashboard synced, but result email notification could not be sent.');
      });
      setLastDashboardSync(new Date());
    } catch {
      setDashboardError('Dashboard data could not be loaded from Supabase.');
      if (!silent) {
        setCandidates([]);
      }
    } finally {
      dashboardRefreshInFlight.current = false;
      if (!silent) {
        setIsLoadingDashboard(false);
      }
    }
  }

  async function sendCandidateResultManually(candidate) {
    if (!candidate?.id) {
      return;
    }

    setSendingResultCandidateIds((currentIds) =>
      currentIds.includes(candidate.id) ? currentIds : [...currentIds, candidate.id],
    );

    try {
      const [candidateResponse, resultResponse] = await Promise.all([
        fetch(
          `${supabaseUrl}/rest/v1/candidates?select=*&id=eq.${encodeURIComponent(candidate.id)}&limit=1`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          },
        ),
        fetch(
          `${supabaseUrl}/rest/v1/results?select=*&candidate_id=eq.${encodeURIComponent(candidate.id)}&order=created_at.desc&limit=1`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          },
        ),
      ]);

      if (!candidateResponse.ok || !resultResponse.ok) {
        throw new Error('Manual result payload fetch failed');
      }

      const [candidateRows, resultRows] = await Promise.all([
        candidateResponse.json(),
        resultResponse.json(),
      ]);
      const candidateRow = Array.isArray(candidateRows) ? candidateRows[0] : null;
      const resultRow = Array.isArray(resultRows) ? resultRows[0] : null;

      if (!candidateRow || !resultRow) {
        throw new Error('Manual result payload data missing');
      }

      await sendResultEmailerPayload(
        buildResultEmailerPayload(candidateRow, resultRow, { sendResults: true }),
      );
      showToast({
        type: 'success',
        title: 'Result email sent',
        message: `Result email has been sent to ${
          candidate.name || candidateRow.full_name || 'the candidate'
        }.`,
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Result send failed',
        message: 'The latest result payload could not be sent.',
      });
    } finally {
      setSendingResultCandidateIds((currentIds) =>
        currentIds.filter((candidateId) => candidateId !== candidate.id),
      );
    }
  }

  function closeResultOverview() {
    setResultOverview((currentOverview) => ({
      ...currentOverview,
      isOpen: false,
    }));
  }

  async function refreshResultOverview(candidate, { silent = false } = {}) {
    if (!candidate?.id || resultOverviewRefreshInFlight.current) {
      return;
    }

    resultOverviewRefreshInFlight.current = true;
    if (!silent) {
      setResultOverview((currentOverview) => ({
        ...currentOverview,
        isLoading: true,
        error: '',
      }));
    }

    try {
      const [resultResponse, sessionResponse] = await Promise.all([
        fetch(
          `${supabaseUrl}/rest/v1/results?select=*&candidate_id=eq.${encodeURIComponent(candidate.id)}&order=created_at.desc&limit=1`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          },
        ),
        fetch(
          `${supabaseUrl}/rest/v1/test_sessions?select=*&candidate_id=eq.${encodeURIComponent(candidate.id)}&order=created_at.desc&limit=1`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          },
        ),
      ]);

      if (!resultResponse.ok || !sessionResponse.ok) {
        throw new Error('Result overview fetch failed');
      }

      const [resultRows, sessionRows] = await Promise.all([
        resultResponse.json(),
        sessionResponse.json(),
      ]);
      const latestResult = Array.isArray(resultRows) ? resultRows[0] : null;
      let latestSession = Array.isArray(sessionRows) ? sessionRows[0] : null;
      const sessionId = latestResult?.session_id || latestSession?.id;

      if (latestResult?.session_id && latestSession?.id !== latestResult.session_id) {
        const exactSessionResponse = await fetch(
          `${supabaseUrl}/rest/v1/test_sessions?select=*&id=eq.${encodeURIComponent(latestResult.session_id)}&limit=1`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          },
        );

        if (exactSessionResponse.ok) {
          const exactSessionRows = await exactSessionResponse.json();
          latestSession = Array.isArray(exactSessionRows) ? exactSessionRows[0] || latestSession : latestSession;
        }
      }

      const batchId = latestSession?.batch_id || candidate.batchId;

      if (!sessionId || !batchId) {
        setResultOverview((currentOverview) => ({
          ...currentOverview,
          isLoading: false,
          candidate,
          result: latestResult || null,
          session: latestSession || null,
          lastUpdated: new Date(),
          error: 'No completed test session is available for this candidate yet.',
        }));
        return;
      }

      const [answersResponse, questionsResponse] = await Promise.all([
        fetch(
          `${supabaseUrl}/rest/v1/answers?select=*&session_id=eq.${encodeURIComponent(sessionId)}&order=created_at.asc`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          },
        ),
        fetch(
          `${supabaseUrl}/rest/v1/questions?select=*&batch_id=eq.${encodeURIComponent(batchId)}&order=order_index.asc`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          },
        ),
      ]);

      if (!answersResponse.ok || !questionsResponse.ok) {
        throw new Error('Question answer overview fetch failed');
      }

      const [answerRows, questionRows] = await Promise.all([
        answersResponse.json(),
        questionsResponse.json(),
      ]);

      setResultOverview((currentOverview) => ({
        ...currentOverview,
        isLoading: false,
        error: '',
        candidate,
        result: latestResult || null,
        session: latestSession || null,
        questions: Array.isArray(questionRows)
          ? questionRows.map(normalizeFetchedQuestion)
          : [],
        answers: Array.isArray(answerRows) ? answerRows : [],
        lastUpdated: new Date(),
      }));
    } catch {
      if (!silent) {
        setResultOverview((currentOverview) => ({
          ...currentOverview,
          isLoading: false,
          candidate,
          error: 'Result details could not be loaded from Supabase.',
        }));
      }
    } finally {
      resultOverviewRefreshInFlight.current = false;
    }
  }

  function openResultOverview(candidate) {
    setResultOverview({
      isOpen: true,
      isLoading: true,
      error: '',
      candidate,
      result: null,
      session: null,
      questions: [],
      answers: [],
      lastUpdated: null,
    });
    refreshResultOverview(candidate);
  }

  async function fetchCandidateProfiles(batches = questionBatchRecords) {
    setIsLoadingProfiles(true);
    setProfileError('');

    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/candidates?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Candidate profiles fetch failed');
      }

      const rows = await response.json();
      setProfiles(rows.map((row) => normalizeCandidateProfile(row, batches)));
    } catch {
      setProfileError('Profiles could not be loaded from Supabase.');
      setProfiles([]);
    } finally {
      setIsLoadingProfiles(false);
    }
  }

function updateProfileForm(field, value) {
    setProfileForm((currentForm) => {
      if (field === 'department') {
        const shouldUseDefaultAmazonDesignation =
          value === 'Amazon' && !currentForm.designation.trim();

        return {
          ...currentForm,
          department: value,
          customDepartment: '',
          designation: shouldUseDefaultAmazonDesignation
            ? profileAmazonDesignationOptions[0]
            : currentForm.designation,
        };
      }

      return { ...currentForm, [field]: value };
    });
  }

  async function createProfile() {
    const department =
      profileForm.department === 'Custom'
        ? profileForm.customDepartment || 'Custom'
        : profileForm.department;
    const selectedBatch = questionBatchRecords.find(
      (batch) => batch.batchId === profileForm.assignedBatch,
    );

    if (!selectedBatch) {
      setProfileError('Select a question batch before creating a profile.');
      showToast({
        type: 'warning',
        title: 'Select a batch',
        message: 'Choose a question batch before creating a profile.',
      });
      return;
    }

    const fullName = profileForm.name.trim() || 'New Candidate';
    const testDurationMinutes = getValidTestDurationMinutes(profileForm.testDurationMinutes);
    const createPayload = {
      full_name: fullName,
      department,
      designation: profileForm.designation.trim() || selectedBatch.designation || department,
      email: profileForm.email.trim() || 'candidate@example.com',
      batch_id: selectedBatch.batchId,
      status: 'pending',
      is_active: true,
    };

    try {
      setProfileError('');
      const username = await generateUniqueCandidateUsername(fullName);
      const password = generateCandidatePassword();
      const testLink = buildCandidatePortalLink(username, testDurationMinutes);
      const response = await fetch(`${supabaseUrl}/rest/v1/candidates`, {
        method: 'POST',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          ...createPayload,
          username,
          password,
          test_link: testLink,
        }),
      });

      if (!response.ok) {
        throw new Error('Candidate profile create failed');
      }

      const rows = await response.json();
      const createdProfile = normalizeCandidateProfile(rows[0], questionBatchRecords);
      setProfiles((currentProfiles) => [createdProfile, ...currentProfiles]);
      fetchDashboardData();
      try {
        await sendTestProfilePayload(buildCreateProfileSenderPayload(createdProfile));
        showToast({
          type: 'success',
          title: 'Profile created',
          message: `Credentials were sent to ${createdProfile.name}.`,
        });
      } catch {
        setProfileError('Profile saved, but credentials could not be sent.');
        showToast({
          type: 'warning',
          title: 'Profile saved',
          message: 'Credentials could not be sent. Try resend credentials.',
        });
      }
      setProfileForm({
        name: '',
        department: 'Amazon',
        customDepartment: '',
        designation: '',
        email: '',
        assignedBatch: questionBatchRecords[0]?.batchId || '',
        testDurationMinutes: defaultTestDurationMinutes,
      });
    } catch {
      setProfileError('Profile could not be saved to Supabase.');
      showToast({
        type: 'error',
        title: 'Profile not created',
        message: 'The candidate profile could not be saved.',
      });
    }
  }

  async function resendProfileCredentials(profile) {
    try {
      setProfileError('');
      await sendTestProfilePayload(buildResendCredentialsPayload(profile));
      showToast({
        type: 'success',
        title: 'Credentials resent',
        message: `Credentials were sent to ${profile.name}.`,
      });
    } catch {
      setProfileError('Credentials could not be resent.');
      showToast({
        type: 'error',
        title: 'Resend failed',
        message: 'Credentials could not be sent.',
      });
    }
  }

  async function toggleProfileNow(profile) {
    const nextActive = !profile.active;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/candidates?id=eq.${encodeURIComponent(profile.id)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ is_active: nextActive }),
      },
    );

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Profile update failed');
    }

    setProfiles((currentProfiles) =>
      currentProfiles.map((currentProfile) =>
        currentProfile.id === profile.id
          ? normalizeCandidateProfile(rows[0], questionBatchRecords)
          : currentProfile,
      ),
    );
    fetchDashboardData();
    showToast({
      type: 'success',
      title: nextActive ? 'Profile activated' : 'Profile deactivated',
      message: `${profile.name} was updated.`,
    });
  }

  function requestToggleProfile(profile) {
    if (!profile.active) {
      toggleProfileNow(profile).catch(() => {
        setProfileError('Profile status could not be updated.');
        showToast({
          type: 'error',
          title: 'Profile update failed',
          message: 'Profile status could not be saved.',
        });
      });
      return;
    }

    setConfirmation({
      title: 'Deactivate profile?',
      message: `${profile.name} will no longer be able to access assigned probation test credentials.`,
      confirmLabel: 'Deactivate Profile',
      action: () => toggleProfileNow(profile),
    });
  }

  async function deleteSupabaseRows(tableName, filter) {
    const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}?${filter}`, {
      method: 'DELETE',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Prefer: 'return=representation',
      },
    });

    if (!response.ok) {
      throw new Error(`${tableName} delete failed`);
    }

    return response.json();
  }

  async function clearProfileTestData(profileId) {
    const profileFilter = `candidate_id=eq.${encodeURIComponent(profileId)}`;

    await deleteSupabaseRows('cheating_logs', profileFilter);
    await deleteSupabaseRows('answers', profileFilter);
    await deleteSupabaseRows('results', profileFilter);
    await deleteSupabaseRows('test_sessions', profileFilter);
  }

  async function resetProfileForRetake(profile) {
    await clearProfileTestData(profile.id);

    const username = await generateUniqueCandidateUsername(profile.name);
    const password = generateCandidatePassword();
    const testDurationMinutes = profile.testDurationMinutes || defaultTestDurationMinutes;
    const testLink = buildCandidatePortalLink(username, testDurationMinutes);

    const response = await fetch(
      `${supabaseUrl}/rest/v1/candidates?id=eq.${encodeURIComponent(profile.id)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          username,
          password,
          test_link: testLink,
          status: 'pending',
          is_active: true,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Profile reset failed');
    }

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Profile reset failed');
    }

    const resetProfile = normalizeCandidateProfile(rows[0], questionBatchRecords);
    setProfiles((currentProfiles) =>
      currentProfiles.map((currentProfile) =>
        currentProfile.id === profile.id
          ? resetProfile
          : currentProfile,
      ),
    );
    fetchDashboardData();
    try {
      await sendTestProfilePayload(
        buildRetakeTestPayload(resetProfile, {
          password,
          testLink,
          username,
          testDurationMinutes,
        }),
      );
      showToast({
        type: 'success',
        title: 'Retake credentials sent',
        message: `${resetProfile.name} can retake the test with new credentials.`,
      });
    } catch {
      setProfileError('Profile reset saved, but retake credentials could not be sent.');
      showToast({
        type: 'warning',
        title: 'Profile reset saved',
        message: 'Retake credentials could not be sent.',
      });
    }
  }

  function requestResetProfile(profile) {
    setConfirmation({
      title: 'Reset profile for retake?',
      message: `${profile.name} will get a new password and portal link. Previous test progress, answers, logs, and results will be cleared.`,
      confirmLabel: 'Reset & Retake',
      action: () => resetProfileForRetake(profile),
    });
  }

  async function deleteProfileNow(profileId) {
    await clearProfileTestData(profileId);

    const rows = await deleteSupabaseRows(
      'candidates',
      `id=eq.${encodeURIComponent(profileId)}`,
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Profile delete failed');
    }

    setProfiles((currentProfiles) =>
      currentProfiles.filter((profile) => profile.id !== profileId),
    );
    setCandidates((currentCandidates) =>
      currentCandidates.filter((candidate) => candidate.id !== profileId),
    );
    showToast({
      type: 'success',
      title: 'Profile deleted',
      message: 'Candidate profile and related test data were removed.',
    });
  }

  function requestDeleteProfile(profile) {
    setConfirmation({
      title: 'Delete profile?',
      message: `${profile.name} will be removed from the existing profiles list.`,
      confirmLabel: 'Delete Profile',
      action: () => deleteProfileNow(profile.id),
    });
  }

  async function confirmPendingAction() {
    if (isConfirmingAction) {
      return;
    }

    setIsConfirmingAction(true);
    if (confirmation?.action) {
      try {
        await confirmation.action();
        setConfirmation(null);
      } catch {
        setGenerationError('Action failed, please try again');
        setProfileError('Profile action could not be completed.');
        showToast({
          type: 'error',
          title: 'Action failed',
          message: 'The requested action could not be completed.',
        });
      } finally {
        setIsConfirmingAction(false);
      }
      return;
    }
    setIsConfirmingAction(false);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  async function fetchQuestionBatches() {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/question_batches?order=created_at.desc`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Question batches fetch failed');
      }

      const rows = await response.json();
      const normalizedBatches = rows.map(normalizeQuestionBatch).filter((batch) => batch.batchId);
      setQuestionBatchRecords(normalizedBatches);

      const storedBatchId = window.localStorage.getItem(activeQuestionBatchStorageKey);
      const storedBatch = normalizedBatches.find((batch) => batch.batchId === storedBatchId);
      if (storedBatch) {
        setActiveBatchSummary(storedBatch);
      }
    } catch {
      setGenerationError('Generation failed, please try again');
      showToast({
        type: 'error',
        title: 'Batches unavailable',
        message: 'Question batches could not be loaded.',
      });
    }
  }

  async function fetchQuestionBatchById(batchId) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/question_batches?id=eq.${encodeURIComponent(batchId)}&limit=1`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Question batch fetch failed');
    }

    const rows = await response.json();
    return rows.length > 0 ? normalizeQuestionBatch(rows[0]) : null;
  }

  async function refreshQuestionBatches(selectedBatchId = '') {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/question_batches?order=created_at.desc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Question batches fetch failed');
    }

    const rows = await response.json();
    const normalizedBatches = rows.map(normalizeQuestionBatch).filter((batch) => batch.batchId);
    setQuestionBatchRecords(normalizedBatches);

    return normalizedBatches.find((batch) => batch.batchId === selectedBatchId) || null;
  }

  async function fetchQuestionsForBatch(batchId, batchSummary = null, options = {}) {
    const { showLoadedToast = true } = options;
    setIsLoadingBatchQuestions(true);
    setGenerationError('');

    try {
      const fetchedQuestions = await fetchQuestionsForBatchRows(batchId);
      setQuestions(fetchedQuestions.map(normalizeFetchedQuestion));
      setQuestionTypeFilter('All');
      setEditingQuestionId(null);
      setSelectedQuestionIds([]);
      setLoadedBatchId(batchId);
      window.localStorage.setItem(activeQuestionBatchStorageKey, batchId);

      const knownBatch =
        batchSummary ||
        questionBatchRecords.find((batch) => batch.batchId === batchId) ||
        (await fetchQuestionBatchById(batchId));
      if (knownBatch) {
        setActiveBatchSummary(knownBatch);
      }
      if (showLoadedToast) {
        showToast({
          type: 'success',
          title: 'Batch loaded',
          message: `${fetchedQuestions.length} questions are ready for review.`,
        });
      }
    } catch {
      setGenerationError('Generation failed, please try again');
      showToast({
        type: 'error',
        title: 'Batch load failed',
        message: 'Questions could not be loaded from Supabase.',
      });
    } finally {
      setIsLoadingBatchQuestions(false);
    }
  }

  async function fetchQuestionsForBatchRows(batchId, retries = 5) {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/questions?batch_id=eq.${encodeURIComponent(batchId)}&order=order_index.asc`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Questions fetch failed');
      }

      const fetchedQuestions = await response.json();
      if (fetchedQuestions.length > 0 || attempt === retries) {
        return fetchedQuestions;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 1200));
    }

    return [];
  }

  function selectQuestionBatch(batchId) {
    if (!batchId) {
      return;
    }

    const selectedBatch = questionBatchRecords.find((batch) => batch.batchId === batchId);
    fetchQuestionsForBatch(batchId, selectedBatch || null);
  }

  async function confirmAndGenerateQuestions() {
    if (!isQuestionGeneratorReady()) {
      setGenerationError('Enter a prompt, department, designation, and question counts before generating.');
      showToast({
        type: 'warning',
        title: 'Generator details required',
        message: 'Complete the prompt, role details, and question counts before generating.',
      });
      return;
    }

    setIsGeneratingQuestions(true);
    setGenerationElapsedSeconds(0);
    setGenerationError('');

    try {
      const generationRequestPayload = buildGenerationPayload();
      const generationResponse = await fetch(generationWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(generationRequestPayload),
      });

      if (!generationResponse.ok) {
        throw new Error('Generation webhook failed');
      }

      const generationPayload = await generationResponse.json();
      const generationData = Array.isArray(generationPayload) ? generationPayload[0] : generationPayload;
      if (generationData?.status && generationData.status !== 'success') {
        throw new Error('Generation webhook did not return success');
      }
      const batchId = extractBatchId(generationPayload);
      const responseQuestions = extractQuestions(generationPayload);

      if (!batchId) {
        throw new Error('No batch_id returned');
      }

      const fallbackGeneratedBatch = normalizeQuestionBatch({
        ...generationRequestPayload,
        total_count:
          generationRequestPayload.mcq_count +
          generationRequestPayload.short_count +
          generationRequestPayload.long_count,
        ...generationData,
        batch_id: batchId,
        id: batchId,
      });
      const generatedBatch = {
        ...fallbackGeneratedBatch,
        createdAt: fallbackGeneratedBatch.createdAt || new Date().toISOString(),
      };
      setActiveBatchSummary(generatedBatch);
      setSelectedQuestionIds([]);
      setQuestionBatchRecords((currentBatches) => {
        const withoutGenerated = currentBatches.filter((batch) => batch.batchId !== batchId);
        return [generatedBatch, ...withoutGenerated];
      });
      if (Array.isArray(responseQuestions) && responseQuestions.length > 0) {
        setQuestions(responseQuestions.map(normalizeFetchedQuestion));
        setQuestionTypeFilter('All');
        setEditingQuestionId(null);
        setSelectedQuestionIds([]);
        setLoadedBatchId(batchId);
        window.localStorage.setItem(activeQuestionBatchStorageKey, batchId);
      } else {
        await fetchQuestionsForBatch(batchId, generatedBatch);
      }

      const refreshedBatch = await refreshQuestionBatches(batchId);
      if (refreshedBatch) {
        setActiveBatchSummary(refreshedBatch);
      }
      showToast({
        type: 'success',
        title: 'Questions generated',
        message: `${generatedBatch.totalCount} AI-generated questions are ready for review.`,
      });
    } catch {
      setGenerationError('Generation failed, please try again');
      showToast({
        type: 'error',
        title: 'Generation failed',
        message: 'AI question generation could not be completed.',
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  function toggleQuestionType(typeId) {
    setQuestionTypes((currentTypes) => ({
      ...currentTypes,
      [typeId]: {
        ...currentTypes[typeId],
        selected: !currentTypes[typeId].selected,
      },
    }));
  }

  function updateQuestionTypeCount(typeId, count) {
    setQuestionTypes((currentTypes) => ({
      ...currentTypes,
      [typeId]: {
        ...currentTypes[typeId],
        count,
      },
    }));
  }

  function validateQuestionTypeCount(typeId) {
    setQuestionTypes((currentTypes) => {
      const currentCount = currentTypes[typeId].count;

      if (currentCount === '') {
        return currentTypes;
      }

      const numericCount = Number(currentCount);
      if (Number.isFinite(numericCount) && numericCount >= 0) {
        return currentTypes;
      }

      return {
        ...currentTypes,
        [typeId]: {
          ...currentTypes[typeId],
          count: 0,
        },
      };
    });
  }

  function dismissToast(toastId) {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
  }

  function showToast({ title, message = '', type = 'info' }) {
    const toastId = createToastId();
    setToasts((currentToasts) => [
      ...currentToasts.slice(-3),
      { id: toastId, title, message, type },
    ]);
    window.setTimeout(() => dismissToast(toastId), 2600);
  }

  function handleAdminLogin(account, rememberMe = true) {
    const authStorage = rememberMe ? window.localStorage : window.sessionStorage;
    window.localStorage.removeItem(adminAuthStorageKey);
    window.sessionStorage.removeItem(adminAuthStorageKey);
    window.localStorage.removeItem(adminSessionStorageKey);
    window.sessionStorage.removeItem(adminSessionStorageKey);
    authStorage.setItem(adminAuthStorageKey, 'true');
    authStorage.setItem(
      adminSessionStorageKey,
      JSON.stringify({
        id: account.id,
        role: account.role,
        label: account.label,
        username: account.username,
      }),
    );
    setAdminLoginError('');
    setIsAdminAuthenticated(true);
    showToast({
      type: 'success',
      title: `Welcome Back, ${account.label}`,
      message: `${formatAccountRole(account.role)} session started.`,
    });
  }

  function handleAdminLogout() {
    const storedAccount = getStoredAdminSession();
    const roleLabel = formatAccountRole(storedAccount?.role);
    window.localStorage.removeItem(adminAuthStorageKey);
    window.sessionStorage.removeItem(adminAuthStorageKey);
    window.localStorage.removeItem(adminSessionStorageKey);
    window.sessionStorage.removeItem(adminSessionStorageKey);
    setIsAdminAuthenticated(false);
    setIsSidebarOpen(false);
    setAdminLoginError('');
    showToast({
      type: 'info',
      title: 'Signed out',
      message: `${roleLabel} session ended.`,
    });
  }

  if (!isAdminAuthenticated) {
    return (
      <>
        <AdminLoginScreen error={adminLoginError} onLogin={handleAdminLogin} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  const isDarkTheme = adminTheme === 'dark';
  const ThemeIcon = isDarkTheme ? Sun : Moon;

  return (
    <div
      className={`admin-app-shell min-h-screen bg-[#fbf9f9] text-[#1b1c1c] ${
        isDarkTheme ? 'admin-theme-dark' : 'admin-theme-light'
      }`}
      data-theme={adminTheme}
    >
      <div className="min-h-screen">
        <div
          className={`fixed inset-0 z-20 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${
            isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={closeSidebar}
          aria-hidden="true"
        />
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col gap-2 bg-[#1b1b1b] p-4 text-white shadow-2xl transition-transform duration-300 ease-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-white text-[#1b1b1b] shadow-sm">
              <span className="text-sm font-black">PT</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="app-display truncate text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                Admin Panel
              </p>
              <p className="app-brand-title truncate text-base font-extrabold leading-tight text-white">
                Probation Test
              </p>
            </div>
            <button
              type="button"
              onClick={closeSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1" aria-label="Primary navigation">
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = item.id === activeSection;
              const isDisabled = Boolean(item.disabled);

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) {
                      return;
                    }

                    setActiveSection(item.id);
                    closeSidebar();
                  }}
                  className={`app-nav-button group flex h-11 w-full items-center rounded-lg px-4 text-left text-[13px] font-semibold transition duration-200 active:scale-[0.98] ${
                    isDisabled
                      ? 'cursor-not-allowed text-white/25'
                      : isActive
                      ? 'bg-white text-[#1b1b1b] shadow-lg shadow-black/10'
                      : 'text-white/55 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-label={item.label}
                  title={isDisabled ? 'Settings is currently inactive' : item.label}
                >
                  <ItemIcon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-xs font-black text-[#1b1b1b]">
                AD
              </div>
              <div className="min-w-0">
                <p className="app-display truncate text-xs font-semibold text-white">Super Admin</p>
                <p className="truncate text-[10px] text-white/40">HR Administrator</p>
              </div>
            </div>
            <div className="mt-4 px-2">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                Version {appVersion}
              </span>
            </div>
          </div>
        </aside>

        <div className="min-h-screen lg:ml-[260px]">
          <header className="fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-[#cfc4c5] bg-[#fbf9f9]/85 px-4 backdrop-blur-md sm:px-6 lg:left-[260px]">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#cfc4c5] text-[#4c4546] transition hover:bg-[#efeded] lg:hidden"
                aria-label="Open sidebar"
                title="Open sidebar"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <h1 className="app-header-title truncate text-xl font-bold text-[#1b1c1c]">
                  {section.label}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdminTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#cfc4c5] text-[#4c4546] transition duration-200 hover:bg-[#efeded]"
                aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <ThemeIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => fetchDashboardData()}
                className="hidden h-10 w-10 items-center justify-center rounded-lg border border-[#cfc4c5] text-[#4c4546] transition duration-200 hover:bg-[#efeded] sm:flex"
                aria-label="Refresh"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="hidden h-10 w-10 items-center justify-center rounded-lg border border-[#cfc4c5] text-[#4c4546] transition duration-200 hover:bg-[#efeded] sm:flex"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1b1b1b] px-3 text-sm font-bold text-white transition duration-200 hover:opacity-90"
                aria-label="Sign out"
                title="Sign out"
              >
                <Power className="h-4 w-4" aria-hidden="true" />
                <span className="hidden xl:inline">Sign out</span>
              </button>
            </div>
          </header>

          <main className="min-h-screen bg-[#fbf9f9] px-4 pb-6 pt-20 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-[1440px]">
              <div className="mb-6">
                <p className="max-w-2xl text-sm leading-6 text-[#4c4546]">
                    {section.description}
                  </p>
              </div>

              {activeSection === 'dashboard' ? (
                <DashboardSection
                  candidates={candidates}
                  dashboardStats={dashboardStats}
                  departments={departments}
                  departmentFilter={departmentFilter}
                  filteredCandidates={filteredCandidates}
                  isLoadingDashboard={isLoadingDashboard}
                  dashboardError={dashboardError}
                  lastDashboardSync={lastDashboardSync}
                  onCandidateDoubleClick={openResultOverview}
                  onDepartmentChange={setDepartmentFilter}
                  onSendResults={sendCandidateResultManually}
                  sendingResultCandidateIds={sendingResultCandidateIds}
                  onStatusChange={setStatusFilter}
                  statusFilter={statusFilter}
                  statuses={statuses}
                />
              ) : activeSection === 'question-bank' ? (
                <QuestionBankSection
                  customDepartment={customQuestionDepartment}
                  activeBatchSummary={activeBatchSummary}
                  department={questionDepartment}
                  designation={questionDesignation}
                  generationError={generationError}
                  generationElapsedSeconds={generationElapsedSeconds}
                  isGenerating={isGeneratingQuestions}
                  isLoadingBatchQuestions={isLoadingBatchQuestions}
                  loadedBatchId={loadedBatchId}
                  onClearGeneratorInputs={clearQuestionGeneratorInputs}
                  onCustomDepartmentChange={setCustomQuestionDepartment}
                  onClearQuestionSelection={clearQuestionSelection}
                  onDeleteAllQuestions={requestDeleteAllQuestions}
                  onDeleteQuestionBatch={requestDeleteLoadedQuestionBatch}
                  onDeleteQuestion={requestDeleteQuestion}
                  onDeleteSelectedQuestions={requestDeleteSelectedQuestions}
                  onDepartmentChange={setQuestionDepartment}
                  onDesignationChange={setQuestionDesignation}
                  onEditQuestion={toggleQuestionEdit}
                  onConfirmGenerate={confirmAndGenerateQuestions}
                  onPromptChange={setQuestionPrompt}
                  onRegenerate={regenerateQuestions}
                  onQuestionTypeFilterChange={setQuestionTypeFilter}
                  onSelectQuestionBatch={selectQuestionBatch}
                  onSelectVisibleQuestions={selectVisibleQuestions}
                  onToggleType={toggleQuestionType}
                  onToggleQuestionSelection={toggleQuestionSelection}
                  onTypeCountBlur={validateQuestionTypeCount}
                  onUpdateOption={updateQuestionOption}
                  onUpdateQuestion={updateQuestion}
                  onUpdateTypeCount={updateQuestionTypeCount}
                  prompt={questionPrompt}
                  questionTypeFilter={questionTypeFilter}
                  questionTypes={questionTypes}
                  questionBatchRecords={questionBatchRecords}
                  questions={questions}
                  editingQuestionId={editingQuestionId}
                  selectedQuestionIds={selectedQuestionIds}
                />
              ) : activeSection === 'test-profiles' ? (
                <TestProfilesSection
                  batchRecords={questionBatchRecords}
                  form={profileForm}
                  isLoadingProfiles={isLoadingProfiles}
                  onCreateProfile={createProfile}
                  onDeleteProfile={requestDeleteProfile}
                  onResendCredentials={resendProfileCredentials}
                  onResetProfile={requestResetProfile}
                  onToggleProfile={requestToggleProfile}
                  onUpdateForm={updateProfileForm}
                  profileError={profileError}
                  profiles={profiles}
                />
              ) : activeSection === 'test-portal' ? (
                <TestPortalSection />
              ) : (
                <PlaceholderSection section={section} />
              )}
            </section>
          </main>
        </div>
      </div>
      <ConfirmationModal
        confirmation={confirmation}
        isConfirming={isConfirmingAction}
        onCancel={() => {
          if (!isConfirmingAction) {
            setConfirmation(null);
          }
        }}
        onConfirm={confirmPendingAction}
      />
      <ResultOverviewModal overview={resultOverview} onClose={closeResultOverview} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastMessage({ toast, onDismiss }) {
  const toneStyles = {
    success: {
      shell: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#14532d' },
      dot: { backgroundColor: '#22c55e' },
    },
    error: {
      shell: { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#7f1d1d' },
      dot: { backgroundColor: '#ef4444' },
    },
    warning: {
      shell: { backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#78350f' },
      dot: { backgroundColor: '#f59e0b' },
    },
    info: {
      shell: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a' },
      dot: { backgroundColor: '#3b82f6' },
    },
  };
  const styles = toneStyles[toast.type] || toneStyles.info;

  return (
    <div
      className="rounded-xl border p-4 shadow-lg shadow-slate-950/10 backdrop-blur transition"
      style={styles.shell}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
          style={styles.dot}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black">{toast.title}</p>
          {toast.message ? (
            <p className="mt-1 text-sm leading-5 opacity-80">{toast.message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="rounded-md p-1 opacity-60 transition hover:bg-white/70 hover:opacity-100"
          aria-label="Dismiss notification"
          title="Dismiss notification"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function AdminLoginScreen({ error, onLogin }) {
  const [authView, setAuthView] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [resetForm, setResetForm] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  const [resetStep, setResetStep] = useState('email');
  const [registrationForm, setRegistrationForm] = useState({
    role: 'admin',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [verificationState, setVerificationState] = useState({
    email: '',
    role: 'admin',
    fullName: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [authAlert, setAuthAlert] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  const [isVerifyingResetCode, setIsVerifyingResetCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [expirySeconds, setExpirySeconds] = useState(60);
  const [resetExpirySeconds, setResetExpirySeconds] = useState(60);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(60);
  const roleTitle = verificationState.role === 'admin' ? 'Admin' : 'Manager';

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const consumerEmailDomains = new Set([
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'aol.com',
    'proton.me',
    'protonmail.com',
  ]);
  const passwordIsValid = registrationForm.password.length >= 8;
  const emailDomain = registrationForm.email.trim().toLowerCase().split('@')[1] || '';
  const emailIsValid =
    emailPattern.test(registrationForm.email.trim()) && !consumerEmailDomains.has(emailDomain);
  const passwordsMatch =
    registrationForm.password.length > 0 &&
    registrationForm.password === registrationForm.confirmPassword;
  const registrationIsValid =
    registrationForm.fullName.trim().length >= 2 &&
    emailIsValid &&
    passwordIsValid &&
    passwordsMatch;
  const verificationIsExpired = expirySeconds <= 0;
  const verificationIsValid = /^\d{6}$/.test(verificationCode) && !verificationIsExpired;
  const resetEmailIsValid = emailPattern.test(resetForm.email.trim());
  const resetCodeIsExpired = resetStep === 'code' && resetExpirySeconds <= 0;
  const resetPasswordsMatch =
    resetForm.password.length > 0 && resetForm.password === resetForm.confirmPassword;
  const resetPasswordIsValid = resetForm.password.length >= 8 && resetPasswordsMatch;
  const resetCodeIsValid = /^\d{6}$/.test(resetForm.code) && !resetCodeIsExpired;

  useEffect(() => {
    if (authView !== 'verification' || expirySeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setExpirySeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [authView, expirySeconds]);

  useEffect(() => {
    if (authView !== 'reset' || resetStep !== 'code' || resetExpirySeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResetExpirySeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [authView, resetStep, resetExpirySeconds]);

  useEffect(() => {
    if (authView !== 'verification' || resendCooldownSeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResendCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [authView, resendCooldownSeconds]);

  function updateRegistrationForm(field, value) {
    setRegistrationForm((currentForm) => ({ ...currentForm, [field]: value }));
    setAuthAlert(null);
  }

  function updateLoginForm(field, value) {
    setLoginForm((currentForm) => ({ ...currentForm, [field]: value }));
    setAuthAlert(null);
  }

  function updateResetForm(field, value) {
    setResetForm((currentForm) => ({
      ...currentForm,
      [field]: field === 'code' ? value.replace(/\D/g, '').slice(0, 6) : value,
    }));
    setAuthAlert(null);
  }

  function openLoginView(prefilledEmail = '') {
    setLoginForm((currentForm) => ({
      ...currentForm,
      email: prefilledEmail || currentForm.email,
      password: '',
    }));
    setAuthAlert(null);
    setAuthView('login');
  }

  function openRegistrationView() {
    setAuthAlert(null);
    setAuthView('registration');
  }

  function openPasswordResetView() {
      setResetStep('email');
      setResetExpirySeconds(60);
      setResetForm({
      email: loginForm.email,
      code: '',
      password: '',
      confirmPassword: '',
    });
    setAuthAlert(null);
    setAuthView('reset');
  }

  function formatAuthCountdown(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function getAuthResponseMessage(responseBody, fallback) {
    return responseBody?.message || responseBody?.detail || responseBody?.status_message || fallback;
  }

  async function submitLogin(event) {
    event.preventDefault();
    setIsLoggingIn(true);
    setAuthAlert(null);

    try {
      const normalizedUsername = loginForm.email.trim().toLowerCase();
      const responseBody = await sendAuthEnginePayload({
        action: 'login',
        email: normalizedUsername,
        password: loginForm.password,
      });

      if (responseBody?.requires_verification) {
        setVerificationState({
          email: normalizedUsername,
          role: responseBody.role || 'admin',
          fullName: responseBody.full_name || '',
        });
        setVerificationCode('');
        setExpirySeconds(60);
        setResendCooldownSeconds(60);
        setAuthView('verification');
        setAuthAlert({
          type: 'warning',
          message: responseBody.message || 'Account verification is required. Enter the code sent to your email.',
        });
        return;
      }

      if (!isConfirmedAuthResponse(responseBody)) {
        throw new Error('Login was not confirmed by the authorization service.');
      }

      onLogin(buildAdminAccountFromAuthResponse(responseBody, normalizedUsername), rememberMe);
    } catch (requestError) {
      setAuthAlert({
        type: 'error',
        message: requestError.message || 'Invalid username or password.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function submitRegistration(event) {
    event.preventDefault();

    if (!registrationIsValid) {
      setAuthAlert({
        type: 'error',
        message: 'Enter a valid name, corporate email, and matching 8+ character password.',
      });
      return;
    }

    setIsRegistering(true);
    setAuthAlert(null);

    try {
      const payload = {
        action: 'register',
        full_name: registrationForm.fullName.trim(),
        email: registrationForm.email.trim().toLowerCase(),
        password: registrationForm.password,
        role: registrationForm.role,
      };
      const responseBody = await sendAuthEnginePayload(payload);
      setVerificationState({
        email: payload.email,
        role: payload.role,
        fullName: payload.full_name,
      });
      setVerificationCode('');
      setExpirySeconds(60);
      setResendCooldownSeconds(60);
      setAuthView('verification');
      setAuthAlert({
        type: 'success',
        message: getAuthResponseMessage(responseBody, 'Activation authorization code sent.'),
      });
    } catch (requestError) {
      setAuthAlert({
        type: 'error',
        message: requestError.message || 'Access request failed. Please try again.',
      });
    } finally {
      setIsRegistering(false);
    }
  }

  async function submitVerification(event) {
    event.preventDefault();

    if (!verificationIsValid) {
      setAuthAlert({
        type: 'error',
        message: verificationIsExpired
          ? 'Verification code expired. Please resend a new code.'
          : 'Enter the 6-digit verification code.',
      });
      return;
    }

    setIsVerifying(true);
    setAuthAlert(null);

    try {
      const payload = {
        action: 'verify_registration',
        email: verificationState.email,
        code: verificationCode,
        role: verificationState.role,
      };
      const responseBody = await sendAuthEnginePayload(payload);
      if (!isConfirmedAuthResponse(responseBody)) {
        throw new Error('Activation code was not confirmed by the authorization service.');
      }
      setAuthAlert({
        type: 'success',
        message: getAuthResponseMessage(
          responseBody,
          'Account activated successfully! Redirecting to login...',
        ),
      });
      window.setTimeout(() => {
        setLoginForm({ email: verificationState.email, password: '' });
        setRegistrationForm({
          role: verificationState.role,
          fullName: '',
          email: verificationState.email,
          password: '',
          confirmPassword: '',
        });
        setVerificationCode('');
        setAuthAlert(null);
        setAuthView('login');
      }, 3000);
    } catch (requestError) {
      setAuthAlert({
        type: 'error',
        message: requestError.message || 'Verification failed. Please try again.',
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function resendVerificationCode() {
    if (resendCooldownSeconds > 0 || isResending) {
      return;
    }

    setIsResending(true);
    setAuthAlert(null);

    try {
      const responseBody = await sendAuthEnginePayload({
        action: 'resend_registration_code',
        email: verificationState.email,
        role: verificationState.role,
      });
      setExpirySeconds(60);
      setResendCooldownSeconds(60);
      setAuthAlert({
        type: 'success',
        message: getAuthResponseMessage(responseBody, 'A fresh verification code has been sent.'),
      });
    } catch (requestError) {
      setAuthAlert({
        type: 'error',
        message: requestError.message || 'Code could not be resent. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  }

  async function submitResetEmail(event) {
    event.preventDefault();

    if (!resetEmailIsValid) {
      setAuthAlert({
        type: 'error',
        message: 'Enter the email address linked to your admin account.',
      });
      return;
    }

    await requestPasswordResetCode('forgot_password');
  }

  async function requestPasswordResetCode(action = 'forgot_password') {
    setIsRequestingReset(true);
    setAuthAlert(null);

    try {
      const resetEmail = resetForm.email.trim().toLowerCase();
      const responseBody = await sendAuthEnginePayload({
        action,
        email: resetEmail,
      });
      setResetForm((currentForm) => ({
        ...currentForm,
        email: resetEmail,
        code: '',
      }));
      setResetExpirySeconds(60);
      setResetStep('code');
      setAuthAlert({
        type: 'success',
        message: getAuthResponseMessage(
          responseBody,
          'A password reset code has been sent to your email.',
        ),
      });
    } catch (requestError) {
      setAuthAlert({
        type: 'error',
        message: requestError.message || 'Password reset request failed. Please try again.',
      });
    } finally {
      setIsRequestingReset(false);
    }
  }

  async function submitResetCode(event) {
    event.preventDefault();

    if (!resetCodeIsValid) {
      setAuthAlert({
        type: 'error',
        message: resetCodeIsExpired
          ? 'Reset code expired. Please request a new code.'
          : 'Enter the 6-digit reset code sent to your email.',
      });
      return;
    }

    setIsVerifyingResetCode(true);
    setAuthAlert(null);

    try {
      const responseBody = await sendAuthEnginePayload({
        action: 'verify_reset_code',
        email: resetForm.email.trim().toLowerCase(),
        code: resetForm.code,
      });
      if (!isConfirmedAuthResponse(responseBody)) {
        throw new Error('Reset code was not confirmed by the authorization service.');
      }
      setResetStep('password');
      setAuthAlert({
        type: 'success',
        message: getAuthResponseMessage(responseBody, 'Code verified. Create your new password.'),
      });
    } catch (requestError) {
      setAuthAlert({
        type: 'error',
        message: requestError.message || 'Reset code could not be verified. Please try again.',
      });
    } finally {
      setIsVerifyingResetCode(false);
    }
  }

  async function submitPasswordReset(event) {
    event.preventDefault();

    if (!resetPasswordIsValid) {
      setAuthAlert({
        type: 'error',
        message: 'New password must be 8+ characters and match exactly.',
      });
      return;
    }

    setIsResettingPassword(true);
    setAuthAlert(null);

    try {
      const resetEmail = resetForm.email.trim().toLowerCase();
      const responseBody = await sendAuthEnginePayload({
        action: 'reset_password',
        email: resetEmail,
        code: resetForm.code,
        new_password: resetForm.password,
      });
      if (!isConfirmedAuthResponse(responseBody)) {
        throw new Error('Password reset was not confirmed by the authorization service.');
      }
      setAuthAlert({
        type: 'success',
        message: getAuthResponseMessage(
          responseBody,
          'Password updated successfully. Redirecting to login...',
        ),
      });
      window.setTimeout(() => {
        setResetForm({ email: '', code: '', password: '', confirmPassword: '' });
        setResetStep('email');
        openLoginView(resetEmail);
      }, 2500);
    } catch (requestError) {
      setAuthAlert({
        type: 'error',
        message: requestError.message || 'Password could not be updated. Please try again.',
      });
    } finally {
      setIsResettingPassword(false);
    }
  }

  const inputShellClass =
    'flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition duration-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10';
  const inputClass =
    'min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400';
  const authViewMeta = {
    registration: {
      label: 'Registration View',
      title: 'Request access',
      description: 'Generate an access request for the admin panel.',
    },
    verification: {
      label: 'Verification View',
      title: 'Enter received code',
      description: 'Enter the activation authorization code sent to your email.',
    },
    login: {
      label: 'Login View',
      title: 'Sign in',
      description: 'Use your activated account credentials to enter the admin panel.',
    },
    reset: {
      label: 'Password Reset View',
      title:
        resetStep === 'email'
          ? 'Reset password'
          : resetStep === 'code'
            ? 'Enter reset code'
            : 'Create new password',
      description:
        resetStep === 'email'
          ? 'Enter your email and we will send a reset verification code.'
          : resetStep === 'code'
            ? 'Enter the code before the 60-second timer expires.'
            : 'Choose and confirm your new password.',
    },
  }[authView];

  return (
    <main className="flex min-h-screen bg-[#f6f7fb] font-sans text-slate-800">
      <section className="relative hidden min-h-screen w-[44%] max-w-[620px] flex-col justify-between overflow-hidden bg-[#09111f] px-12 py-10 text-white lg:flex">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#09111f] shadow-lg shadow-black/20">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
                Probation Test
              </p>
              <p className="text-xl font-black">Control Center</p>
            </div>
          </div>
        </div>

        <div className="relative max-w-xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
            Secure administration
          </p>
          <h2 className="mt-4 text-5xl font-black leading-tight tracking-tight">
            Access with verified identity.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            A private workspace for candidate profiles, question banks, live testing, and result operations.
          </p>

          <div className="mt-10 grid gap-3">
            {[
              ['Verified access', 'Registration and reset flows are routed through n8n authorization.'],
              ['Session protected', 'Only activated accounts can reach the admin dashboard.'],
              ['Operational clarity', 'Designed for daily HR and testing workflows.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                <p className="text-sm font-black text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-white/10 pt-6 text-xs font-bold text-slate-500">
          <span>Encrypted access workflow</span>
          <span>Version {appVersion}</span>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-[480px]">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#09111f] text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Probation Test
              </p>
              <p className="text-xl font-black text-slate-950">Control Center</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 sm:p-7">
            <div className="mb-6">
              <div className="mb-5 flex rounded-lg bg-slate-100 p-1 text-xs font-black text-slate-500">
                {[
                  ['login', 'Sign in'],
                  ['registration', 'Request'],
                  ['reset', 'Reset'],
                ].map(([view, label]) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => {
                      if (view === 'login') openLoginView();
                      if (view === 'registration') openRegistrationView();
                      if (view === 'reset') openPasswordResetView();
                    }}
                    className={`h-9 flex-1 rounded-md transition duration-200 ${
                      authView === view ||
                      (view === 'registration' && authView === 'verification')
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'hover:text-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                {authViewMeta.label}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {authViewMeta.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {authViewMeta.description}
              </p>
            </div>

            <div className="relative min-h-[560px]">
              <form
                className={`absolute inset-0 space-y-4 transition duration-300 ${
                  authView === 'registration'
                    ? 'translate-x-0 opacity-100'
                    : 'pointer-events-none -translate-x-8 opacity-0'
                }`}
                onSubmit={submitRegistration}
              >
                <label className="block text-sm font-semibold text-slate-800">
                  <span className="mb-2 block">Target Role</span>
                  <select
                    value={registrationForm.role}
                    onChange={(event) => updateRegistrationForm('role', event.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition duration-200 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold text-slate-800">
                  <span className="mb-2 block">Full Name</span>
                  <span className={inputShellClass}>
                    <Users className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      type="text"
                      value={registrationForm.fullName}
                      onChange={(event) => updateRegistrationForm('fullName', event.target.value)}
                      placeholder="Enter full name"
                      autoComplete="name"
                      className={inputClass}
                      required
                    />
                  </span>
                </label>

                <label className="block text-sm font-semibold text-slate-800">
                  <span className="mb-2 block">Corporate Email</span>
                  <span className={inputShellClass}>
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      type="email"
                      value={registrationForm.email}
                      onChange={(event) => updateRegistrationForm('email', event.target.value)}
                      placeholder="name@company.com"
                      autoComplete="email"
                      className={inputClass}
                      required
                    />
                  </span>
                  {registrationForm.email && !emailIsValid ? (
                    <span className="mt-1 block text-xs font-semibold text-red-600">
                      Enter a valid corporate email address.
                    </span>
                  ) : null}
                </label>

                <label className="block text-sm font-semibold text-slate-800">
                  <span className="mb-2 block">Password</span>
                  <span className={inputShellClass}>
                    <LockKeyhole className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      type="password"
                      value={registrationForm.password}
                      onChange={(event) => updateRegistrationForm('password', event.target.value)}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      className={inputClass}
                      required
                    />
                  </span>
                  {registrationForm.password && !passwordIsValid ? (
                    <span className="mt-1 block text-xs font-semibold text-red-600">
                      Password must be at least 8 characters.
                    </span>
                  ) : null}
                </label>

                <label className="block text-sm font-semibold text-slate-800">
                  <span className="mb-2 block">Confirm Password</span>
                  <span className={inputShellClass}>
                    <CheckCircle className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      type="password"
                      value={registrationForm.confirmPassword}
                      onChange={(event) =>
                        updateRegistrationForm('confirmPassword', event.target.value)
                      }
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      className={inputClass}
                      required
                    />
                  </span>
                  {registrationForm.confirmPassword && !passwordsMatch ? (
                    <span className="mt-1 block text-xs font-semibold text-red-600">
                      Passwords must match exactly.
                    </span>
                  ) : null}
                </label>

                {authView === 'registration' && (authAlert || error) ? (
                  <AuthAlert alert={authAlert} fallbackError={error} />
                ) : null}

                <button
                  type="submit"
                  disabled={!registrationIsValid || isRegistering}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0b1220] px-4 text-base font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:translate-y-0"
                >
                  {isRegistering ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Generate Access Request
                    </>
                  )}
                </button>
              </form>

              <form
                className={`absolute inset-0 space-y-5 transition duration-300 ${
                  authView === 'verification'
                    ? 'translate-x-0 opacity-100'
                    : 'pointer-events-none translate-x-8 opacity-0'
                }`}
                onSubmit={submitVerification}
              >
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
                  An activation authorization code has been sent to{' '}
                  {verificationState.email || 'your email'}.
                </div>

                <label className="block text-sm font-semibold text-slate-800">
                  <span className="mb-2 block">6-digit Verification Code</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    placeholder="000000"
                    className="h-16 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-center text-3xl font-black tracking-[0.45em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                    autoComplete="one-time-code"
                  />
                </label>

                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <span className="inline-flex items-center gap-2 font-bold text-slate-700">
                    <Clock3 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    Code expires in:
                  </span>
                  <span
                    className={`font-black ${
                      verificationIsExpired ? 'text-red-600' : 'text-slate-950'
                    }`}
                  >
                    {formatAuthCountdown(expirySeconds)}
                  </span>
                </div>

                <p className="text-center text-xs font-semibold text-slate-500">
                  Role selected: {roleTitle}
                </p>

                {authView === 'verification' && authAlert ? (
                  <AuthAlert alert={authAlert} fallbackError="" />
                ) : null}

                <button
                  type="submit"
                  disabled={!verificationIsValid || isVerifying}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0b1220] px-4 text-base font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:translate-y-0"
                >
                  {isVerifying ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    'Verify & Activate Account'
                  )}
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView('registration');
                      setAuthAlert(null);
                    }}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={resendVerificationCode}
                    disabled={resendCooldownSeconds > 0 || isResending}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {isResending
                      ? 'Sending...'
                      : resendCooldownSeconds > 0
                        ? `Resend Code (${resendCooldownSeconds}s)`
                        : 'Resend Code'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => openLoginView(verificationState.email)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Back to Sign In
                </button>
              </form>

              <form
                className={`absolute inset-0 space-y-5 transition duration-300 ${
                  authView === 'login'
                    ? 'translate-x-0 opacity-100'
                    : 'pointer-events-none translate-x-8 opacity-0'
                }`}
                onSubmit={submitLogin}
              >
                <label className="block text-sm font-semibold text-slate-800">
                  <span className="mb-2 block">Username</span>
                  <span className={inputShellClass}>
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(event) => updateLoginForm('email', event.target.value)}
                      placeholder="Enter username"
                      autoComplete="username"
                      className={inputClass}
                      required
                    />
                  </span>
                </label>

                <label className="block text-sm font-semibold text-slate-800">
                  <span className="mb-2 block">Password</span>
                  <span className={inputShellClass}>
                    <KeyRound className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(event) => updateLoginForm('password', event.target.value)}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      className={inputClass}
                      required
                    />
                  </span>
                </label>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-slate-500">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={openRegistrationView}
                    className="font-bold text-blue-700 transition hover:text-blue-800 hover:underline"
                  >
                    Request access
                  </button>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={openPasswordResetView}
                    className="text-sm font-semibold text-slate-500 transition hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {authView === 'login' && (authAlert || error) ? (
                  <AuthAlert alert={authAlert} fallbackError={error} />
                ) : null}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#0b1220] px-4 text-base font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:translate-y-0"
                >
                  {isLoggingIn ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <form
                className={`absolute inset-0 space-y-5 transition duration-300 ${
                  authView === 'reset'
                    ? 'translate-x-0 opacity-100'
                    : 'pointer-events-none translate-x-8 opacity-0'
                }`}
                onSubmit={
                  resetStep === 'email'
                    ? submitResetEmail
                    : resetStep === 'code'
                      ? submitResetCode
                      : submitPasswordReset
                }
              >
                {resetStep === 'email' ? (
                  <>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
                      Enter your account email. We will send a 6-digit password reset code.
                    </div>
                    <label className="block text-sm font-semibold text-slate-800">
                      <span className="mb-2 block">Account Email</span>
                      <span className={inputShellClass}>
                        <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                        <input
                          type="email"
                          value={resetForm.email}
                          onChange={(event) => updateResetForm('email', event.target.value)}
                          placeholder="name@company.com"
                          autoComplete="email"
                          className={inputClass}
                          required
                        />
                      </span>
                    </label>

                    {authView === 'reset' && authAlert ? (
                      <AuthAlert alert={authAlert} fallbackError="" />
                    ) : null}

                    <button
                      type="submit"
                      disabled={!resetEmailIsValid || isRequestingReset}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0b1220] px-4 text-base font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:translate-y-0"
                    >
                      {isRequestingReset ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        'Send Reset Code'
                      )}
                    </button>
                  </>
                ) : resetStep === 'code' ? (
                  <>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
                      A password reset code has been sent to {resetForm.email || 'your email'}.
                    </div>
                    <label className="block text-sm font-semibold text-slate-800">
                      <span className="mb-2 block">6-digit Reset Code</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={resetForm.code}
                        onChange={(event) => updateResetForm('code', event.target.value)}
                        placeholder="000000"
                        className="h-14 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-center text-2xl font-black tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                        autoComplete="one-time-code"
                      />
                    </label>

                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-2 font-bold text-slate-700">
                        <Clock3 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        Reset code expires in:
                      </span>
                      <span
                        className={`font-black ${
                          resetCodeIsExpired ? 'text-red-600' : 'text-slate-950'
                        }`}
                      >
                        {formatAuthCountdown(resetExpirySeconds)}
                      </span>
                    </div>

                    {authView === 'reset' && authAlert ? (
                      <AuthAlert alert={authAlert} fallbackError="" />
                    ) : null}

                    <button
                      type="submit"
                      disabled={!resetCodeIsValid || isVerifyingResetCode}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0b1220] px-4 text-base font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:translate-y-0"
                    >
                      {isVerifyingResetCode ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        'Verify Reset Code'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => requestPasswordResetCode('resend_reset_code')}
                      disabled={isRequestingReset}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {isRequestingReset ? 'Sending...' : 'Resend Reset Code'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-sm font-semibold leading-6 text-green-900">
                      Code verified. Set a new password for {resetForm.email || 'your account'}.
                    </div>
                    <label className="block text-sm font-semibold text-slate-800">
                      <span className="mb-2 block">New Password</span>
                      <span className={inputShellClass}>
                        <LockKeyhole className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                        <input
                          type="password"
                          value={resetForm.password}
                          onChange={(event) => updateResetForm('password', event.target.value)}
                          placeholder="Minimum 8 characters"
                          autoComplete="new-password"
                          className={inputClass}
                          required
                        />
                      </span>
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">
                      <span className="mb-2 block">Confirm New Password</span>
                      <span className={inputShellClass}>
                        <CheckCircle className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                        <input
                          type="password"
                          value={resetForm.confirmPassword}
                          onChange={(event) =>
                            updateResetForm('confirmPassword', event.target.value)
                          }
                          placeholder="Re-enter new password"
                          autoComplete="new-password"
                          className={inputClass}
                          required
                        />
                      </span>
                      {resetForm.confirmPassword && !resetPasswordsMatch ? (
                        <span className="mt-1 block text-xs font-semibold text-red-600">
                          Passwords must match exactly.
                        </span>
                      ) : null}
                    </label>

                    {authView === 'reset' && authAlert ? (
                      <AuthAlert alert={authAlert} fallbackError="" />
                    ) : null}

                    <button
                      type="submit"
                      disabled={!resetPasswordIsValid || isResettingPassword}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0b1220] px-4 text-base font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:translate-y-0"
                    >
                      {isResettingPassword ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </>
                )}

              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function AuthAlert({ alert, fallbackError }) {
  const message = alert?.message || fallbackError;

  if (!message) {
    return null;
  }

  const isError = alert?.type === 'error' || fallbackError;

  return (
    <p
      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
        isError
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-green-200 bg-green-50 text-green-700'
      }`}
    >
      {message}
    </p>
  );
}

function TestProfilesSection({
  batchRecords,
  form,
  isLoadingProfiles,
  onCreateProfile,
  onDeleteProfile,
  onResendCredentials,
  onResetProfile,
  onToggleProfile,
  onUpdateForm,
  profileError,
  profiles,
}) {
  const selectedBatch = batchRecords.find((batch) => batch.batchId === form.assignedBatch);
  const selectedProfileDesignationValue =
    form.department === 'Amazon' && profileAmazonDesignationOptions.includes(form.designation)
      ? form.designation
      : 'Custom';
  const [revealedCredentialIds, setRevealedCredentialIds] = useState([]);
  const [expandedProfileIds, setExpandedProfileIds] = useState([]);

  function revealCredentials(profileId) {
    setRevealedCredentialIds((currentIds) =>
      currentIds.includes(profileId) ? currentIds : [...currentIds, profileId],
    );

    window.setTimeout(() => {
      setRevealedCredentialIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== profileId),
      );
    }, 7000);
  }

  function toggleProfileDetails(profileId) {
    setExpandedProfileIds((currentIds) =>
      currentIds.includes(profileId)
        ? currentIds.filter((currentId) => currentId !== profileId)
        : [...currentIds, profileId],
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.25fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-950">Create New Profile</h3>
          <p className="mt-1 text-sm text-slate-500">
            Create a candidate profile and assign a question batch.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Candidate Full Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => onUpdateForm('name', event.target.value)}
              placeholder="Enter full name"
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Department</span>
            <select
              value={form.department}
              onChange={(event) => onUpdateForm('department', event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
            >
              {departmentOptions.map((departmentOption) => (
                <option key={departmentOption}>{departmentOption}</option>
              ))}
            </select>
          </label>

          {form.department === 'Custom' ? (
            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Custom department</span>
              <input
                type="text"
                value={form.customDepartment}
                onChange={(event) => onUpdateForm('customDepartment', event.target.value)}
                placeholder="Type custom department"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
              />
            </label>
          ) : null}

          <label className="block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Designation</span>
            {form.department === 'Amazon' ? (
              <select
                value={selectedProfileDesignationValue}
                onChange={(event) => {
                  const nextDesignation = event.target.value;
                  onUpdateForm('designation', nextDesignation === 'Custom' ? '' : nextDesignation);
                }}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
              >
                {profileAmazonDesignationOptions.map((designationOption) => (
                  <option key={designationOption}>{designationOption}</option>
                ))}
                <option>Custom</option>
              </select>
            ) : (
              <input
                type="text"
                value={form.designation}
                onChange={(event) => onUpdateForm('designation', event.target.value)}
                placeholder="Type designation"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
              />
            )}
          </label>

          {form.department === 'Amazon' && selectedProfileDesignationValue === 'Custom' ? (
            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Custom designation</span>
              <input
                type="text"
                value={form.designation}
                onChange={(event) => onUpdateForm('designation', event.target.value)}
                placeholder="Type custom designation"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
              />
            </label>
          ) : null}

          <label className="block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Candidate Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => onUpdateForm('email', event.target.value)}
              placeholder="candidate@example.com"
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Assign Question Batch</span>
            <select
              value={form.assignedBatch}
              onChange={(event) => onUpdateForm('assignedBatch', event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
            >
              {batchRecords.length === 0 ? (
                <option value="">No generated batches available</option>
              ) : (
                batchRecords.map((batch) => (
                  <option key={batch.batchId} value={batch.batchId}>
                    {formatBatchOptionLabel(batch)}
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Test Timing</span>
            <select
              value={form.testDurationMinutes}
              onChange={(event) => onUpdateForm('testDurationMinutes', Number(event.target.value))}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
            >
              {testDurationOptions.map((durationOption) => (
                <option key={durationOption.value} value={durationOption.value}>
                  {durationOption.label}
                </option>
              ))}
            </select>
          </label>

          {selectedBatch ? (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-bold">
                {selectedBatch.department} Batch - {selectedBatch.designation} - {selectedBatch.totalCount} Questions
              </p>
              <ul className="mt-2 space-y-1 text-blue-800">
                <li>- {selectedBatch.mcqCount} MCQs</li>
                <li>- {selectedBatch.shortCount} Short Answer</li>
                <li>- {selectedBatch.longCount} Long Answer</li>
              </ul>
            </div>
          ) : null}

          {profileError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {profileError}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onCreateProfile}
            disabled={batchRecords.length === 0}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:translate-y-0"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Create Profile & Send Credentials
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Existing Profiles</h3>
            <p className="mt-1 text-sm text-slate-500">
              {isLoadingProfiles ? 'Loading profiles...' : `${profiles.length} candidate profiles`}
            </p>
          </div>
        </div>

        {profiles.length === 0 ? (
          <EmptyState
            icon={Users}
            title={isLoadingProfiles ? 'Loading profiles' : 'No profiles yet'}
            message={
              isLoadingProfiles
                ? 'Fetching saved candidate profiles from Supabase.'
                : 'Create a candidate profile to save credentials and assign a test batch.'
            }
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden grid-cols-[minmax(220px,1.1fr)_minmax(220px,0.9fr)_minmax(240px,auto)] border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 lg:grid">
              <span>Candidate Info</span>
              <span>Department & Role</span>
              <span className="text-right">Actions</span>
            </div>
            {profiles.map((profile) => {
              const areCredentialsRevealed = revealedCredentialIds.includes(profile.id);
              const isExpanded = expandedProfileIds.includes(profile.id);
              const profileInitials = profile.name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((namePart) => namePart[0])
                .join('')
                .toUpperCase();

              return (
            <article
              key={profile.id}
              className="border-b border-slate-200 bg-white transition duration-200 last:border-b-0 hover:bg-slate-50/70"
            >
              <div className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(220px,1.1fr)_minmax(220px,0.9fr)_minmax(240px,auto)] lg:items-center">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-black text-slate-600">
                      {profileInitials || 'PT'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-base font-black text-slate-950">{profile.name}</h4>
                        <span
                          className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ring-1 ring-inset ${
                            profile.active ? badgeStyles.Active : badgeStyles.Inactive
                          }`}
                        >
                          {profile.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm font-medium text-slate-500">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-wrap gap-2 text-xs font-bold text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">
                      {profile.department}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">
                      {profile.designation}
                    </span>
                  </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => onToggleProfile(profile)}
                    title={profile.active ? 'Deactivate profile' : 'Activate profile'}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-white"
                    aria-pressed={profile.active}
                  >
                    <span
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition duration-200 ${
                        profile.active ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition duration-200 ${
                          profile.active ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onResendCredentials(profile)}
                    title="Resend credentials"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-navy-700 hover:text-navy-900"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Resend Credentials</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onResetProfile(profile)}
                    title="Reset and retake"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-navy-700 hover:text-navy-900"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Reset & Retake</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProfile(profile)}
                    title="Delete profile"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-700 transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Delete</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleProfileDetails(profile.id)}
                    aria-expanded={isExpanded}
                    title={isExpanded ? 'Collapse profile details' : 'Expand profile details'}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-transparent text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'} profile details</span>
                  </button>
                </div>
              </div>

              <div
                className={`profile-detail-panel grid transition-[grid-template-rows] duration-300 ease-out ${
                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div
                    className={`grid gap-5 border-t border-slate-200 bg-white px-6 py-5 transition duration-300 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] ${
                      isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                    }`}
                  >
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Candidate Details
                      </p>
                      <dl className="mt-4 grid gap-3 text-sm">
                        <div className="grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                          <dt className="font-semibold text-slate-500">Email</dt>
                          <dd className="break-words font-black text-slate-900">{profile.email}</dd>
                        </div>
                        <div className="grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                          <dt className="font-semibold text-slate-500">Assigned Batch</dt>
                          <dd className="break-words font-black text-slate-900">{profile.assignedBatch}</dd>
                        </div>
                        <div className="grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                          <dt className="font-semibold text-slate-500">Test Timing</dt>
                          <dd className="font-black text-slate-900">
                            {profile.testDurationMinutes} mins
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                          Credentials
                        </p>
                        <button
                          type="button"
                          onClick={() => revealCredentials(profile.id)}
                          className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-navy-700 hover:text-navy-900"
                        >
                          {areCredentialsRevealed ? 'Visible' : 'Reveal'}
                        </button>
                      </div>
                      <div
                        className={`grid gap-3 ${
                          areCredentialsRevealed
                            ? 'blur-0'
                            : 'select-none blur-sm transition duration-200'
                        }`}
                        aria-hidden={!areCredentialsRevealed}
                      >
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                            Username
                          </p>
                          <p className="mt-1 break-all font-bold text-slate-800">
                            {profile.username || 'Not set'}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                            Password
                          </p>
                          <p className="mt-1 break-all font-bold text-slate-800">
                            {profile.password || 'Not set'}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                            Test Link
                          </p>
                          <p className="mt-1 break-all font-medium leading-relaxed text-slate-700">
                            {profile.testLink || 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function QuestionBankSection({
  activeBatchSummary,
  customDepartment,
  department,
  designation,
  editingQuestionId,
  generationError,
  generationElapsedSeconds,
  isGenerating,
  isLoadingBatchQuestions,
  loadedBatchId,
  onClearGeneratorInputs,
  onClearQuestionSelection,
  onCustomDepartmentChange,
  onDeleteAllQuestions,
  onDeleteQuestionBatch,
  onDeleteQuestion,
  onDeleteSelectedQuestions,
  onDepartmentChange,
  onDesignationChange,
  onEditQuestion,
  onConfirmGenerate,
  onPromptChange,
  onQuestionTypeFilterChange,
  onRegenerate,
  onSelectQuestionBatch,
  onSelectVisibleQuestions,
  onToggleQuestionSelection,
  onToggleType,
  onTypeCountBlur,
  onUpdateOption,
  onUpdateQuestion,
  onUpdateTypeCount,
  prompt,
  questionTypeFilter,
  questionTypes,
  questionBatchRecords,
  questions,
  selectedQuestionIds,
}) {
  const loadedDepartment = department === 'Custom' ? customDepartment || 'Custom' : department;
  const loadedDesignation = designation || 'Unassigned Designation';
  const selectedDesignationValue = questionDesignationOptions.includes(designation)
    ? designation
    : 'Custom';
  const suggestedPrompt =
    department === 'Amazon' && selectedDesignationValue !== 'Custom'
      ? amazonDesignationPromptSuggestions[designation] || ''
      : '';
  const [animatedSuggestedPrompt, setAnimatedSuggestedPrompt] = useState('');
  const questionTypeOptions = [
    { id: 'mcq', label: 'MCQ (Multiple Choice)', countLabel: 'MCQs' },
    { id: 'short', label: 'Short Answer', countLabel: 'Short Answer' },
    { id: 'long', label: 'Long Answer', countLabel: 'Long Answer' },
  ];
  const selectedTypeCount = questionTypeOptions.filter(
    (type) => questionTypes[type.id].selected,
  ).length;
  const totalQuestions = questionTypeOptions.reduce(
    (total, type) =>
      questionTypes[type.id].selected
        ? total + getQuestionCountValue(questionTypes[type.id].count)
        : total,
    0,
  );
  const resolvedDepartment = department === 'Custom' ? customDepartment.trim() : department.trim();
  const hasCompleteGeneratorInputs =
    selectedTypeCount > 0 &&
    totalQuestions > 0 &&
    prompt.trim().length > 0 &&
    resolvedDepartment.length > 0 &&
    designation.trim().length > 0;
  const canGenerate = hasCompleteGeneratorInputs;
  const questionListFilters = ['All', 'MCQ', 'Short Answer', 'Long Answer'];
  const filteredQuestions =
    questionTypeFilter === 'All'
      ? questions
      : questions.filter((question) => question.type === questionTypeFilter);
  const filteredQuestionIds = filteredQuestions.map((question) => question.id);
  const visibleSelectedCount = filteredQuestionIds.filter((questionId) =>
    selectedQuestionIds.includes(questionId),
  ).length;
  const allVisibleSelected =
    filteredQuestionIds.length > 0 && visibleSelectedCount === filteredQuestionIds.length;
  const groupedQuestions = ['MCQ', 'Short Answer', 'Long Answer']
    .map((type) => ({
      type,
      questions: filteredQuestions.filter((question) => question.type === type),
    }))
    .filter((group) => group.questions.length > 0);
  const visibleQuestionCount = groupedQuestions.reduce(
    (count, group) => count + group.questions.length,
    0,
  );
  const currentBatchSummary =
    activeBatchSummary ||
    (loadedBatchId ? questionBatchRecords.find((batch) => batch.batchId === loadedBatchId) : null);
  const visibleSummary = {
    department: currentBatchSummary?.department || loadedDepartment,
    designation: currentBatchSummary?.designation || loadedDesignation,
    mcqCount: groupedQuestions.find((group) => group.type === 'MCQ')?.questions.length || 0,
    shortCount: groupedQuestions.find((group) => group.type === 'Short Answer')?.questions.length || 0,
    longCount: groupedQuestions.find((group) => group.type === 'Long Answer')?.questions.length || 0,
    totalCount: visibleQuestionCount,
  };
  const listSummary = formatBatchSummary(visibleSummary);
  const canRegenerate =
    hasCompleteGeneratorInputs && Boolean(loadedBatchId) && questions.length > 0 && !isGenerating;

  useEffect(() => {
    setAnimatedSuggestedPrompt('');

    if (!suggestedPrompt || prompt.trim().length > 0) {
      return undefined;
    }

    let nextLength = 0;
    const stepSize = Math.max(1, Math.ceil(suggestedPrompt.length / 110));
    const typingTimer = window.setInterval(() => {
      nextLength = Math.min(suggestedPrompt.length, nextLength + stepSize);
      setAnimatedSuggestedPrompt(suggestedPrompt.slice(0, nextLength));

      if (nextLength >= suggestedPrompt.length) {
        window.clearInterval(typingTimer);
      }
    }, 24);

    return () => window.clearInterval(typingTimer);
  }, [suggestedPrompt, prompt, selectedDesignationValue]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-950">Question Generator</h3>
          <p className="mt-1 text-sm text-slate-500">
            Draft a prompt and select a department to prepare a question batch.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <div className="text-sm font-semibold text-slate-700">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="question-generator-prompt" className="block">
                Enter prompt to generate questions
              </label>
              {suggestedPrompt ? (
                <button
                  type="button"
                  onClick={() => onPromptChange(suggestedPrompt)}
                  disabled={isGenerating}
                  className="inline-flex h-8 items-center justify-center rounded-full border border-blue-100 bg-blue-50 px-3 text-xs font-black text-blue-700 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  Use suggestion
                </button>
              ) : null}
            </div>
            <div className="relative rounded-lg bg-slate-50">
              {!prompt && animatedSuggestedPrompt ? (
                <div className="prompt-suggestion-overlay pointer-events-none absolute inset-0 px-4 py-3 text-sm font-semibold leading-6 text-slate-400">
                  {animatedSuggestedPrompt}
                  <span className="prompt-suggestion-caret" />
                </div>
              ) : null}
              <textarea
                id="question-generator-prompt"
                value={prompt}
                onChange={(event) => onPromptChange(event.target.value)}
                rows={5}
                placeholder={
                  suggestedPrompt
                    ? ''
                    : 'Generate probation assessment questions for role-specific skills, policy awareness, and workplace conduct.'
                }
                className="relative z-10 w-full resize-none rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm leading-6 text-slate-600 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-navy-700 focus:bg-white focus:text-slate-800 focus:ring-2 focus:ring-navy-700/15"
              />
            </div>
            {suggestedPrompt ? (
              <p className="mt-2 text-xs font-semibold text-slate-400">
                Animated suggestion appears only for Amazon designations. You can use it or write your own prompt.
              </p>
            ) : null}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Department</span>
              <select
                value={department}
                onChange={(event) => onDepartmentChange(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
              >
                {departmentOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            {department === 'Custom' ? (
              <label className="text-sm font-semibold text-slate-700">
                <span className="mb-2 block">Custom department</span>
                <input
                  type="text"
                  value={customDepartment}
                  onChange={(event) => onCustomDepartmentChange(event.target.value)}
                  placeholder="Type department name"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
                />
              </label>
            ) : null}

            <label className="text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Designation</span>
              <select
                value={selectedDesignationValue}
                onChange={(event) => {
                  const nextDesignation = event.target.value;
                  onDesignationChange(nextDesignation === 'Custom' ? '' : nextDesignation);
                }}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
              >
                {questionDesignationOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
                <option>Custom</option>
              </select>
            </label>

            {selectedDesignationValue === 'Custom' ? (
              <label className="text-sm font-semibold text-slate-700">
                <span className="mb-2 block">Custom designation</span>
                <input
                  type="text"
                  value={designation}
                  onChange={(event) => onDesignationChange(event.target.value)}
                  placeholder="Type custom designation"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
                />
              </label>
            ) : null}

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-800">Question Types</p>
              <div className="mt-3 space-y-3">
                {questionTypeOptions.map((type) => {
                  const typeState = questionTypes[type.id];

                  return (
                    <div
                      key={type.id}
                      className="grid gap-3 rounded-lg bg-white p-3 sm:grid-cols-[1fr_120px] sm:items-center"
                    >
                      <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={typeState.selected}
                          onChange={() => onToggleType(type.id)}
                          className="h-4 w-4 rounded border-slate-300 text-navy-900 focus:ring-navy-700"
                        />
                        {type.label}
                      </label>
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        <span className="sr-only">{type.countLabel}</span>
                        <input
                          type="number"
                          min="0"
                          value={typeState.count}
                          disabled={!typeState.selected}
                          onChange={(event) => onUpdateTypeCount(type.id, event.target.value)}
                          onBlur={() => onTypeCountBlur(type.id)}
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition disabled:bg-slate-50 disabled:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
                          aria-label={`${type.countLabel} count`}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded-lg bg-white px-3 py-2">
                <p
                  className="text-sm font-bold text-slate-800"
                >
                  Total Questions: {totalQuestions}
                </p>
                {selectedTypeCount === 0 ? (
                  <p className="mt-1 text-sm font-semibold text-red-700">
                    Select at least one question type.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              <button
                type="button"
                onClick={onConfirmGenerate}
                disabled={!canGenerate || isGenerating}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-green-700 px-4 text-sm font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:hover:translate-y-0"
              >
                {isGenerating ? 'Generating...' : 'Confirm & Generate'}
              </button>
              <button
                type="button"
                onClick={onRegenerate}
                disabled={!canRegenerate}
                title={
                  canRegenerate
                    ? 'Regenerate the loaded batch'
                    : 'Generate or load a batch before regenerating'
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-navy-700 hover:text-navy-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:translate-y-0"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {isGenerating ? 'Regenerating...' : 'Regenerate'}
              </button>
              <button
                type="button"
                onClick={onClearGeneratorInputs}
                disabled={isGenerating}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:translate-y-0"
              >
                Clear inputs
              </button>
            </div>
            <AiLoadingSkeleton elapsedSeconds={generationElapsedSeconds} isVisible={isGenerating} />
            {generationError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {generationError}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Questions List</h3>
            <p className="mt-1 text-sm font-semibold text-slate-600">{listSummary}</p>
            {loadedBatchId ? (
              <p className="mt-1 text-xs font-semibold text-slate-400">Loaded batch: {loadedBatchId}</p>
            ) : null}
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-1 block">Load Existing Batch</span>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={loadedBatchId}
                  onChange={(event) => onSelectQuestionBatch(event.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15 md:w-[420px]"
                >
                  <option value="">Select a generated batch</option>
                  {questionBatchRecords.length === 0 ? (
                    <option value="" disabled>
                      No generated batches found
                    </option>
                  ) : null}
                  {questionBatchRecords.map((batch) => (
                    <option key={batch.batchId} value={batch.batchId}>
                      {formatBatchOptionLabel(batch)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onDeleteQuestionBatch}
                  disabled={!loadedBatchId || isLoadingBatchQuestions || isGenerating}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-bold text-red-700 transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:translate-y-0"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete batch
                </button>
              </div>
            </label>
            <div className="flex flex-wrap gap-2 rounded-lg bg-slate-50 p-1">
              {questionListFilters.map((filter) => {
                const isActive = questionTypeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => onQuestionTypeFilterChange(filter)}
                    className={`h-9 rounded-lg px-3 text-sm font-bold transition duration-200 ${
                      isActive
                        ? 'bg-navy-900 text-white shadow-soft'
                        : 'text-slate-600 hover:bg-white hover:text-navy-900'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {questions.length > 0 ? (
          <div className="mb-5 flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
            <div className="text-sm font-semibold text-slate-600">
              {selectedQuestionIds.length > 0
                ? `${selectedQuestionIds.length} selected | ${visibleQuestionCount} visible`
                : `${visibleQuestionCount} visible question${visibleQuestionCount === 1 ? '' : 's'}`}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSelectVisibleQuestions(filteredQuestionIds)}
                disabled={filteredQuestionIds.length === 0 || allVisibleSelected}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-navy-700 hover:text-navy-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:translate-y-0"
              >
                Select visible
              </button>
              <button
                type="button"
                onClick={onClearQuestionSelection}
                disabled={selectedQuestionIds.length === 0}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:translate-y-0"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onDeleteSelectedQuestions}
                disabled={selectedQuestionIds.length === 0}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-bold text-red-700 transition duration-200 hover:-translate-y-0.5 hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:translate-y-0"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete selected
              </button>
              <button
                type="button"
                onClick={onDeleteAllQuestions}
                disabled={questions.length === 0}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 text-xs font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:hover:translate-y-0"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete all
              </button>
            </div>
          </div>
        ) : null}

        {isLoadingBatchQuestions ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-navy-800" />
              Loading questions from Supabase...
            </div>
          </div>
        ) : visibleQuestionCount === 0 ? (
          <EmptyState
            icon={FileQuestion}
            title="No questions to show"
            message="Switch the question type filter or regenerate a batch to populate this view."
          />
        ) : (
          <div className="space-y-6">
            {groupedQuestions.map((group) => (
              <div key={group.type} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={questionTypeBadgeStyles[group.type]}>{group.type}</Badge>
                  <p className="text-sm font-bold text-slate-500">
                    {group.questions.length} question{group.questions.length === 1 ? '' : 's'}
                  </p>
                </div>
                {group.questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    editing={editingQuestionId === question.id}
                    index={index}
                    onDelete={() => onDeleteQuestion(question.id)}
                    onEdit={() => onEditQuestion(question.id)}
                    onSelect={() => onToggleQuestionSelection(question.id)}
                    onUpdate={(field, value) => onUpdateQuestion(question.id, field, value)}
                    onUpdateOption={(optionIndex, value) =>
                      onUpdateOption(question.id, optionIndex, value)
                    }
                    question={question}
                    selected={selectedQuestionIds.includes(question.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function QuestionCard({
  editing,
  index,
  onDelete,
  onEdit,
  onSelect,
  onUpdate,
  onUpdateOption,
  question,
  selected,
}) {
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <article
      className={`rounded-lg border bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft ${
        selected ? 'border-navy-700 ring-2 ring-navy-700/15' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
              <input
                type="checkbox"
                checked={selected}
                onChange={onSelect}
                className="h-4 w-4 rounded border-slate-300 text-navy-900 focus:ring-navy-700"
                aria-label={`Select question ${index + 1}`}
              />
              Select
            </label>
            <p className="text-sm font-bold uppercase text-navy-700">Question {index + 1}</p>
            <Badge className={questionTypeBadgeStyles[question.type]}>{question.type}</Badge>
          </div>
          {editing ? (
            <textarea
              value={question.text}
              onChange={(event) => onUpdate('text', event.target.value)}
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 text-slate-800 outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
            />
          ) : (
            <p className="mt-2 text-base font-semibold leading-7 text-slate-950">{question.text}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-navy-700 hover:text-navy-900"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            {editing ? 'Done' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-bold text-red-700 transition duration-200 hover:-translate-y-0.5 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      {question.type === 'MCQ' ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {question.options.map((option, optionIndex) => {
            const label = optionLabels[optionIndex];
            const isCorrect = isCorrectMcqOption(question.correctAnswer, label, option);

            return (
              <div
                key={label}
                className={`rounded-lg border p-3 transition duration-200 ${
                  isCorrect
                    ? 'border-green-200 bg-green-50 text-green-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCorrect ? 'bg-green-600 text-white' : 'bg-white text-slate-600'
                    }`}
                  >
                    {label}
                  </span>
                  {editing ? (
                    <input
                      type="text"
                      value={option}
                      onChange={(event) => onUpdateOption(optionIndex, event.target.value)}
                      className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
                    />
                  ) : (
                    <p className="min-w-0 flex-1 text-sm font-medium leading-6">{option}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

    </article>
  );
}

function formatDashboardMark(value, suffix = '') {
  if (value === null || value === undefined) {
    return '-';
  }

  const roundedValue = Math.round(Number(value) * 10) / 10;
  return `${Number.isInteger(roundedValue) ? roundedValue : roundedValue.toFixed(1)}${suffix}`;
}

function formatDashboardTimestamp(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DashboardSection({
  candidates,
  dashboardStats,
  dashboardError,
  departments,
  departmentFilter,
  filteredCandidates,
  isLoadingDashboard,
  lastDashboardSync,
  onCandidateDoubleClick,
  onDepartmentChange,
  onSendResults,
  onStatusChange,
  sendingResultCandidateIds,
  statusFilter,
  statuses,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const visibleCandidates = filteredCandidates.filter((candidate) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [candidate.name, candidate.designation, candidate.department, candidate.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });
  const statMeta = {
    'Total Candidates': {
      icon: Users,
      detail: `${candidates.length} in current workspace`,
      tone: 'neutral',
    },
    'Tests Completed': {
      icon: CheckCircle,
      detail: 'Completed submissions',
      tone: 'up',
    },
    'Tests Pending': {
      icon: Clock3,
      detail: 'Awaiting completion',
      tone: 'neutral',
    },
    'Pass Rate': {
      icon: Percent,
      detail: 'Based on completed tests',
      tone: 'attention',
    },
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map(([label, value]) => {
          const meta = statMeta[label] || { icon: Home, detail: 'Live metric', tone: 'neutral' };
          const StatIcon = meta.icon;
          const TrendIcon = meta.tone === 'attention' ? TrendingDown : TrendingUp;

          return (
            <article
              key={label}
              className="group relative overflow-hidden rounded-xl border border-[#cfc4c5] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-[13px] font-semibold text-[#4c4546]">{label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#efeded] text-[#1b1b1b]">
                  <StatIcon className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
              <p className="app-kpi-value mt-4 text-[32px] font-extrabold leading-none text-[#1b1c1c]">
                {value}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <TrendIcon
                  className={`h-3.5 w-3.5 ${
                    meta.tone === 'attention' ? 'text-[#ba1a1a]' : 'text-[#1b1b1b]'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-semibold text-[#4c4546]">{meta.detail}</span>
              </div>
              <div className="absolute bottom-4 left-6 right-6 h-px bg-[#cfc4c5]/70" />
            </article>
          );
        })}
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-[#cfc4c5] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#cfc4c5] px-6 py-5 xl:flex-row xl:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-black text-[#1b1c1c]">Candidates</h3>
              <span className="rounded bg-[#efeded] px-2 py-0.5 text-[11px] font-bold text-[#4c4546]">
                {visibleCandidates.length} records
              </span>
            </div>
            <p className="mt-1 text-sm text-[#4c4546]">
              {isLoadingDashboard
                ? 'Loading candidate records from Supabase...'
                : `Showing ${visibleCandidates.length} of ${candidates.length} probation test records.`}
            </p>
            <p className="mt-1 text-xs font-bold text-[#1b1b1b]">
              Live sync active
              {lastDashboardSync
                ? ` - last updated ${lastDashboardSync.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}`
                : ''}
            </p>
            {dashboardError ? (
              <p className="mt-2 text-sm font-semibold text-red-600">{dashboardError}</p>
            ) : null}
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(180px,220px)_minmax(160px,200px)_minmax(150px,180px)]">
            <label className="relative">
              <span className="sr-only">Search candidates</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4c4546]"
                aria-hidden="true"
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search..."
                type="search"
                className="h-10 w-full rounded border border-[#cfc4c5] bg-[#f5f3f3] pl-10 pr-3 text-sm font-medium text-[#1b1c1c] outline-none transition focus:border-[#1b1b1b] focus:ring-1 focus:ring-[#1b1b1b]"
              />
            </label>
            <label>
              <span className="sr-only">Department</span>
              <select
                value={departmentFilter}
                onChange={(event) => onDepartmentChange(event.target.value)}
                className="h-10 w-full rounded border border-[#cfc4c5] bg-white px-3 text-xs font-bold text-[#1b1c1c] outline-none transition focus:border-[#1b1b1b] focus:ring-1 focus:ring-[#1b1b1b]"
              >
                {departments.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => onStatusChange(event.target.value)}
                className="h-10 w-full rounded border border-[#cfc4c5] bg-white px-3 text-xs font-bold text-[#1b1c1c] outline-none transition focus:border-[#1b1b1b] focus:ring-1 focus:ring-[#1b1b1b]"
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1240px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#cfc4c5] bg-[#f5f3f3]">
                {[
                  'Candidate',
                  'Designation',
                  'Department',
                  'Status',
                  'Updated',
                  'Attempts',
                  'Score %',
                  'Result',
                  'Actions',
                ].map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className={`px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#7e7576] ${
                      ['Status', 'Updated', 'Attempts', 'Score %', 'Result', 'Actions'].includes(column)
                        ? 'text-center'
                        : ''
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfc4c5]">
              {visibleCandidates.map((candidate) => {
                const isSendingResult = sendingResultCandidateIds.includes(candidate.id);

                return (
                  <tr
                    key={candidate.id}
                    onDoubleClick={() => onCandidateDoubleClick(candidate)}
                    className={`cursor-pointer transition duration-200 hover:bg-[#f5f3f3] ${
                      candidate.isResultHighlighted
                        ? 'dashboard-result-updated'
                        : ''
                    } ${
                      candidate.isResultPending
                        ? 'dashboard-result-loading'
                        : ''
                    }`}
                  >
                  <td className="px-4 py-4 font-bold text-[#1b1c1c]">
                    <div className="flex flex-col gap-1">
                      <span>{candidate.name}</span>
                      {candidate.isResultPending ? (
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                          Results loading
                        </span>
                      ) : null}
                      {candidate.isResultHighlighted ? (
                        <span className="inline-flex w-fit rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                          Updated result
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#4c4546]">{candidate.designation}</td>
                  <td className="px-4 py-4 text-[#4c4546]">{candidate.department}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <Badge status={candidate.status}>{candidate.status}</Badge>
                      {candidate.isResultPending ? (
                        <span className="text-[10px] font-black uppercase tracking-wide text-amber-700">
                          Syncing result
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex rounded bg-[#f5f3f3] px-3 py-1 text-xs font-bold text-[#4c4546]">
                      {formatDashboardTimestamp(candidate.latestActivityAt)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex h-8 min-w-10 items-center justify-center rounded bg-[#efeded] px-3 text-sm font-black text-[#1b1b1b]">
                      {candidate.attempts}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {candidate.isResultPending ? (
                      <span className="dashboard-cell-skeleton mx-auto h-7 w-20" aria-label="Score percentage loading" />
                    ) : (
                      <span className="inline-flex rounded bg-[#efeded] px-3 py-1 text-xs font-black text-[#1b1b1b]">
                        {formatDashboardMark(candidate.percentage, '%')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {candidate.isResultPending ? (
                      <span className="dashboard-cell-skeleton mx-auto h-7 w-16" aria-label="Result loading" />
                    ) : candidate.result ? (
                      <Badge status={candidate.result}>{candidate.result}</Badge>
                    ) : (
                      <span className="text-[#cfc4c5]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      disabled={isSendingResult}
                      onClick={(event) => {
                        event.stopPropagation();
                        onSendResults(candidate);
                      }}
                      className="inline-flex h-9 min-w-28 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-[#1b1b1b] transition duration-200 hover:-translate-y-0.5 hover:border-[#1b1b1b] hover:bg-[#f5f3f3] active:translate-y-0 active:scale-[0.97] disabled:cursor-wait disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-700 disabled:hover:translate-y-0"
                    >
                      {isSendingResult ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" />
                      ) : null}
                      {isSendingResult ? 'Sending...' : 'Send Result'}
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {visibleCandidates.length === 0 ? (
          <div className="border-t border-[#cfc4c5] p-6">
            <EmptyState
              icon={Inbox}
              title={isLoadingDashboard ? 'Loading candidates' : 'No candidates match these filters'}
              message={
                isLoadingDashboard
                  ? 'Candidate records are being pulled from Supabase.'
                  : 'Adjust the department or status filters to bring candidate records back into view.'
              }
            />
          </div>
        ) : null}
        <div className="flex items-center justify-between border-t border-[#cfc4c5] px-6 py-4">
          <span className="text-xs font-semibold text-[#7e7576]">
            Showing {visibleCandidates.length} of {candidates.length} candidates
          </span>
          <span className="rounded bg-[#efeded] px-2 py-1 text-[11px] font-bold text-[#4c4546]">
            Live
          </span>
        </div>
      </section>
    </>
  );
}

function ResultOverviewModal({ overview, onClose }) {
  const [activeTab, setActiveTab] = useState('mcq');

  if (!overview.isOpen) {
    return null;
  }

  const candidate = overview.candidate || {};
  const answerByQuestionId = new Map(
    overview.answers.map((answer) => [answer.question_id, answer]),
  );
  const questionsWithAnswers = overview.questions.map((question, index) => ({
    ...question,
    displayIndex: question.orderIndex || index + 1,
    answer: answerByQuestionId.get(question.databaseId || question.id) || null,
  }));
  const mcqItems = questionsWithAnswers.filter((question) => question.type === 'MCQ');
  const writtenItems = questionsWithAnswers.filter((question) => question.type !== 'MCQ');
  const shortAnswerItems = questionsWithAnswers.filter((question) => question.type === 'Short Answer');
  const longAnswerItems = questionsWithAnswers.filter((question) => question.type === 'Long Answer');
  const sortedWrittenGroups = [
    { type: 'Short Answer', label: 'Short Questions', questions: shortAnswerItems },
    { type: 'Long Answer', label: 'Long Questions', questions: longAnswerItems },
  ]
    .map((group) => ({
      ...group,
      questions: group.questions
        .slice()
        .sort(
          (firstQuestion, secondQuestion) =>
            (firstQuestion.orderIndex || firstQuestion.displayIndex || 0) -
            (secondQuestion.orderIndex || secondQuestion.displayIndex || 0),
        ),
    }))
    .filter((group) => group.questions.length > 0);
  const rawTotalScore = overview.result?.total_score ?? candidate.score;
  const totalScore = formatDashboardMark(rawTotalScore);
  const totalQuestions =
    overview.result?.total_questions || overview.questions.length || candidate.totalQuestions || 0;
  const scoreDenominatorFromSummary = Number(
    String(overview.result?.summary_paragraph || '').match(/final score of\s*[\d.]+\s*\/\s*([\d.]+)/i)?.[1] ||
      String(overview.result?.summary_paragraph || '').match(/score of\s*[\d.]+\s*\/\s*([\d.]+)/i)?.[1],
  );
  const computedScoreDenominator =
    mcqItems.length + shortAnswerItems.length * 3 + longAnswerItems.length * 5;
  const scoreDenominator =
    Number(overview.result?.max_score ?? overview.result?.total_marks ?? overview.result?.possible_score) ||
    (Number.isFinite(scoreDenominatorFromSummary) && scoreDenominatorFromSummary > 0
      ? scoreDenominatorFromSummary
      : 0) ||
    computedScoreDenominator ||
    null;
  const percentage = toDashboardNumber(overview.result?.percentage ?? candidate.percentage);
  const aiAssessment =
    overview.result?.terminated || candidate.status === 'Terminated'
      ? 'Terminated'
      : percentage !== null && percentage >= 75
        ? 'High Potential'
        : percentage !== null && percentage >= 50
          ? 'Developing'
          : 'Needs Review';
  const aiAssessmentClass =
    aiAssessment === 'High Potential'
      ? 'text-emerald-700'
      : aiAssessment === 'Terminated'
        ? 'text-red-700'
        : 'text-[#1b1c1c]';
  function parseAnalysisList(value) {
    function normalizeAnalysisItem(item) {
      if (!item) {
        return '';
      }

      if (typeof item === 'string') {
        return item.trim();
      }

      if (typeof item === 'object') {
        return String(item.point || item.text || item.value || item.title || JSON.stringify(item)).trim();
      }

      return String(item).trim();
    }

    if (Array.isArray(value)) {
      return value.map(normalizeAnalysisItem).filter(Boolean);
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeAnalysisItem).filter(Boolean);
        }
      } catch {
        return value
          .split(/\n|;/)
          .map(normalizeAnalysisItem)
          .filter(Boolean);
      }
    }

    return [];
  }

  const analysisStrengths = parseAnalysisList(overview.result?.strengths);
  const analysisImprovements = parseAnalysisList(overview.result?.areas_for_improvement);
  function parseResultFeedbackCandidates(value) {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.flatMap(parseResultFeedbackCandidates);
    }

    if (typeof value === 'string') {
      try {
        return parseResultFeedbackCandidates(JSON.parse(value));
      } catch {
        return [];
      }
    }

    if (typeof value === 'object') {
      const nestedCollections = [
        value.answers,
        value.feedback,
        value.questions,
        value.question_feedback,
        value.written_answers,
        value.evaluations,
        value.items,
      ].filter(Boolean);

      return [
        value,
        ...nestedCollections.flatMap(parseResultFeedbackCandidates),
      ];
    }

    return [];
  }

  const resultFeedbackCandidates = Object.values(overview.result || {}).flatMap(
    parseResultFeedbackCandidates,
  );

  function getMatchedWrittenFeedback(question) {
    const questionId = question.databaseId || question.id;
    const answerId = question.answer?.id;
    const matchedResultFeedback = resultFeedbackCandidates.find((item) => {
      const itemQuestionId =
        item.question_id || item.questionId || item.questionID || item.id || item.question?.id;
      const itemAnswerId = item.answer_id || item.answerId || item.answerID;

      return (
        (questionId && String(itemQuestionId || '') === String(questionId)) ||
        (answerId && String(itemAnswerId || '') === String(answerId))
      );
    });

    const feedback =
      matchedResultFeedback?.ai_feedback ||
      matchedResultFeedback?.feedback ||
      matchedResultFeedback?.aiFeedback ||
      matchedResultFeedback?.assessment ||
      matchedResultFeedback?.comment ||
      question.answer?.ai_feedback ||
      '';
    const score =
      matchedResultFeedback?.ai_score ??
      matchedResultFeedback?.score ??
      matchedResultFeedback?.marks ??
      matchedResultFeedback?.points ??
      question.answer?.ai_score;

    return { feedback, score };
  }

  const hasAiAnalysis =
    Boolean(overview.result?.summary_paragraph) ||
    analysisStrengths.length > 0 ||
    analysisImprovements.length > 0 ||
    Boolean(overview.result?.hiring_reasoning);
  const hasPassed =
    typeof overview.result?.passed === 'boolean'
      ? overview.result.passed
      : candidate.result === 'Pass' || (percentage !== null && percentage >= 50);
  const statusPill =
    overview.result?.terminated || candidate.status === 'Terminated'
      ? 'TERMINATED'
      : String(overview.result?.overall_verdict || '').trim().toUpperCase() || (hasPassed ? 'PASS' : 'FAIL');
  const roleFitPill =
    overview.result?.fit_level ||
    (statusPill === 'TERMINATED'
      ? 'REVIEW REQUIRED'
      : percentage !== null && percentage >= 75
        ? 'ADEQUATE FIT'
        : percentage !== null && percentage >= 50
          ? 'DEVELOPING FIT'
          : 'NEEDS REVIEW');
  const recommendationPill =
    overview.result?.hiring_action ||
    (statusPill === 'PASS' ? 'PROCEED TO INTERVIEW' : statusPill === 'FAIL' ? 'REVIEW BEFORE INTERVIEW' : 'HOLD REVIEW');
  const integrityFlags = Number(
    overview.result?.cheating_attempts ??
      overview.result?.cheating_log?.total_violations_count ??
      overview.session?.tab_violations_count ??
      overview.session?.key_violations_count ??
      0,
  );
  const deductedFromReason = String(overview.result?.integrity_reason || '').match(
    /([\d.]+)\s*marks?\s+deducted/i,
  )?.[1];
  const marksDeducted =
    deductedFromReason || (integrityFlags > 0 ? Math.min(integrityFlags * 0.5, 10).toFixed(1) : '0');
  const strongestTopic = overview.result?.strongest_topic || `${candidate.department || 'Role'} Fundamentals`;
  const weakestTopic = overview.result?.weakest_topic || 'Needs deeper review';
  const tabs = [
    { id: 'mcq', label: 'MCQ Review' },
    { id: 'written', label: 'Written Answers' },
    { id: 'analysis', label: 'AI Analysis' },
  ];

  function getOptionValue(question, value) {
    const answerValue = String(value || '').trim();
    const optionIndex = ['A', 'B', 'C', 'D'].indexOf(answerValue.toUpperCase());

    if (optionIndex >= 0 && question.options?.[optionIndex]) {
      return question.options[optionIndex];
    }

    return answerValue || '-';
  }

  function getOptionMatch(question, value) {
    const answerValue = String(value || '').trim();
    const labels = ['A', 'B', 'C', 'D'];
    const prefixedLabel = answerValue.match(/^([A-D])[\s.):;-]+/i)?.[1] || '';
    const labelIndex = labels.indexOf((prefixedLabel || answerValue).toUpperCase());

    if (labelIndex >= 0 && question.options?.[labelIndex]) {
      return {
        index: labelIndex,
        label: labels[labelIndex],
        value: question.options[labelIndex],
      };
    }

    const normalizedAnswer = answerValue.toLowerCase();
    const optionIndex =
      question.options?.findIndex((option, index) => {
        const optionText = String(option || '').trim().toLowerCase();
        const labeledOptionText = `${labels[index]}. ${optionText}`.toLowerCase();
        return optionText === normalizedAnswer || labeledOptionText === normalizedAnswer;
      }) ??
      -1;

    if (optionIndex >= 0) {
      return {
        index: optionIndex,
        label: labels[optionIndex],
        value: question.options[optionIndex],
      };
    }

    return {
      index: -1,
      label: '',
      value: answerValue || '-',
    };
  }

  function getCorrectness(question) {
    const selectedOption = getOptionMatch(question, question.answer?.answer_text);
    const correctOption = getOptionMatch(question, question.correctAnswer);

    if (selectedOption.index >= 0 && correctOption.index >= 0) {
      return selectedOption.index === correctOption.index;
    }

    const selectedAnswer = selectedOption.value.toLowerCase();
    const correctAnswer = correctOption.value.toLowerCase();

    if (selectedAnswer && correctAnswer && selectedAnswer !== '-' && correctAnswer !== '-') {
      return selectedAnswer === correctAnswer;
    }

    if (typeof question.answer?.is_correct === 'boolean') {
      return question.answer.is_correct;
    }

    return false;
  }

  const mcqCorrectCount = mcqItems.filter((question) => getCorrectness(question)).length;
  const mcqIncorrectCount = Math.max(mcqItems.length - mcqCorrectCount, 0);
  const mcqAccuracy = mcqItems.length ? Math.round((mcqCorrectCount / mcqItems.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white text-[#1b1c1c]">
      <div className="sticky top-0 z-10 border-b border-[#d9dee7] bg-white/95 px-6 py-5 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="app-header-title text-xl font-bold">Result Overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Probation Test Analysis - {candidate.name || 'Candidate'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live updating
              </span>
              {overview.lastUpdated ? (
                <span className="text-xs font-semibold text-slate-500">
                  Last synced {new Date(overview.lastUpdated).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close result overview"
            title="Close"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex flex-col justify-between gap-4 border-b border-[#d9dee7] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              Final Score
            </p>
            <p className="app-kpi-value mt-2 text-4xl font-extrabold">
              {totalScore}
              {scoreDenominator ? (
                <span className="text-xl font-bold text-slate-500">/{formatDashboardMark(scoreDenominator)}</span>
              ) : null}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              AI Assessment
            </p>
            <p className={`mt-2 text-xl font-black ${aiAssessmentClass}`}>{aiAssessment}</p>
          </div>
        </div>

        <div className="mt-6 border-b border-[#d9dee7]">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`app-nav-button border-b-2 px-6 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'border-[#1b1b1b] text-[#1b1b1b]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {overview.isLoading ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
            <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#1b1b1b]" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Loading result details...</p>
          </div>
        ) : overview.error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
            {overview.error}
          </div>
        ) : null}

        {!overview.isLoading && !overview.error && activeTab === 'mcq' ? (
          <div className="mt-6 space-y-5">
            {mcqItems.length === 0 ? (
              <EmptyState icon={Inbox} title="No MCQ answers" message="No MCQ answers were found for this session." />
            ) : (
              <>
                <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">
                        MCQ Performance
                      </p>
                      <h3 className="app-display mt-2 text-2xl font-black">
                        {mcqCorrectCount} of {mcqItems.length} correct
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-white/10 px-4 py-3">
                        <p className="text-xl font-black">{mcqAccuracy}%</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-white/55">
                          Accuracy
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-400/15 px-4 py-3 text-emerald-100">
                        <p className="text-xl font-black">{mcqCorrectCount}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-emerald-100/70">
                          Correct
                        </p>
                      </div>
                      <div className="rounded-xl bg-red-400/15 px-4 py-3 text-red-100">
                        <p className="text-xl font-black">{mcqIncorrectCount}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-red-100/70">
                          Missed
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid gap-4">
                  {mcqItems.map((question) => {
                    const selectedOption = getOptionMatch(question, question.answer?.answer_text);
                    const correctOption = getOptionMatch(question, question.correctAnswer);
                    const selectedAnswer = selectedOption.value;
                    const correctAnswer = correctOption.value;
                    const isCorrect = getCorrectness(question);

                    return (
                      <article
                        key={question.id}
                        className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                          isCorrect ? 'border-emerald-200' : 'border-red-200'
                        }`}
                      >
                        <div
                          className={`h-1.5 ${
                            isCorrect
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-gradient-to-r from-red-500 to-rose-400'
                          }`}
                        />
                        <div className="p-5">
                          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-600">
                                  Question {question.displayIndex}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide ${
                                    isCorrect
                                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                      : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                                  }`}
                                >
                                  {isCorrect ? (
                                    <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                  ) : (
                                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                                  )}
                                  {isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                              </div>
                              <h3 className="mt-4 text-base font-black leading-7 text-slate-950">
                                {question.text}
                              </h3>
                            </div>
                            <div className="grid shrink-0 gap-2 text-xs font-bold sm:grid-cols-2 lg:w-80">
                              <div
                                className={`rounded-xl border px-3 py-2 ${
                                  isCorrect
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                    : 'border-red-200 bg-red-50 text-red-800'
                                }`}
                              >
                                <p className="text-[10px] font-black uppercase tracking-wide opacity-70">
                                  Selected
                                </p>
                                <p className="mt-1 line-clamp-2">{selectedAnswer}</p>
                              </div>
                              <div className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-emerald-800">
                                <p className="text-[10px] font-black uppercase tracking-wide opacity-70">
                                  Correct
                                </p>
                                <p className="mt-1 line-clamp-2">{correctAnswer}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {question.options.map((option, optionIndex) => {
                              const optionLabel = ['A', 'B', 'C', 'D'][optionIndex] || String(optionIndex + 1);
                              const isSelectedOption = selectedOption.index === optionIndex;
                              const isCorrectOption = correctOption.index === optionIndex;
                              const optionTone = isCorrectOption
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-900 shadow-[0_0_0_1px_rgba(16,185,129,0.14)]'
                                : isSelectedOption
                                  ? 'border-red-300 bg-red-50 text-red-900 shadow-[0_0_0_1px_rgba(239,68,68,0.12)]'
                                  : 'border-slate-200 bg-slate-50 text-slate-700';

                              return (
                                <div
                                  key={`${question.id}-${optionLabel}`}
                                  className={`flex min-h-16 items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${optionTone}`}
                                >
                                  <span
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                      isCorrectOption
                                        ? 'bg-emerald-600 text-white'
                                        : isSelectedOption
                                          ? 'bg-red-600 text-white'
                                          : 'bg-white text-slate-600 ring-1 ring-slate-200'
                                    }`}
                                  >
                                    {optionLabel}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="leading-6">{option}</p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {isCorrectOption ? (
                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                                          Correct answer
                                        </span>
                                      ) : null}
                                      {isSelectedOption ? (
                                        <span
                                          className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                                            isCorrect
                                              ? 'bg-emerald-100 text-emerald-700'
                                              : 'bg-red-100 text-red-700'
                                          }`}
                                        >
                                          Candidate selected
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ) : null}

        {!overview.isLoading && !overview.error && activeTab === 'written' ? (
          <div className="mt-6 space-y-6">
            {writtenItems.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No written answers"
                message="No short or long answers were found for this session."
              />
            ) : (
              sortedWrittenGroups.map((group) => (
                <section key={group.type} className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                        {group.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        {group.questions.length} {group.questions.length === 1 ? 'question' : 'questions'} in sequence
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ring-1 ring-inset ${
                        group.type === 'Short Answer'
                          ? questionTypeBadgeStyles['Short Answer']
                          : questionTypeBadgeStyles['Long Answer']
                      }`}
                    >
                      {group.type}
                    </span>
                  </div>

                  {group.questions.map((question, groupIndex) => {
                    const matchedFeedback = getMatchedWrittenFeedback(question);
                    const submittedAnswer = String(question.answer?.answer_text || '').trim();
                    const hasSubmittedAnswer = submittedAnswer.length > 0;

                    return (
                      <article key={question.id} className="rounded-xl border border-slate-200 bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                              {group.type} {groupIndex + 1}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-400">
                              Original question #{question.displayIndex}
                            </p>
                          </div>
                          {!hasSubmittedAnswer ? (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">
                              Not attempted
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-3 text-base font-bold">{question.text}</h3>
                        <div className="mt-5">
                          <p className="text-xs font-semibold text-slate-500">Candidate's Answer</p>
                          <p
                            className={`mt-2 rounded-lg px-3 py-2 text-sm leading-6 ${
                              hasSubmittedAnswer
                                ? 'bg-slate-50 italic text-slate-600'
                                : 'border border-slate-200 bg-slate-50 font-semibold text-slate-400'
                            }`}
                          >
                            {hasSubmittedAnswer ? `"${submittedAnswer}"` : 'No answer submitted.'}
                          </p>
                        </div>
                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="app-display text-sm font-bold text-[#1b1b1b]">AI Feedback</p>
                            {matchedFeedback.score !== null && matchedFeedback.score !== undefined ? (
                              <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-black text-white">
                                Score: {formatDashboardMark(matchedFeedback.score)}
                              </span>
                            ) : null}
                          </div>
                          {matchedFeedback.feedback ? (
                            <p className="mt-4 text-sm leading-6 text-slate-700">
                              {matchedFeedback.feedback}
                            </p>
                          ) : !hasSubmittedAnswer ? (
                            <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-500">
                              No AI feedback is available because the candidate did not submit an answer.
                            </div>
                          ) : (
                            <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-navy-800" />
                              AI feedback is being prepared for this answer.
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </section>
              ))
            )}
          </div>
        ) : null}

        {!overview.isLoading && !overview.error && activeTab === 'analysis' ? (
          !hasAiAnalysis ? (
            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-navy-800" />
                <div>
                  <p className="text-sm font-black text-slate-900">AI analysis is being prepared...</p>
                  <p className="mt-1 text-sm text-slate-500">
                    The candidate result exists, but the AI summary fields have not been written to
                    Supabase yet.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="h-32 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-32 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>
          ) : (
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="app-kpi-value text-lg font-black text-[#1b1c1c]">
                Final Score: {totalScore}
                {scoreDenominator ? `/${formatDashboardMark(scoreDenominator)}` : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide ${
                    statusPill === 'PASS'
                      ? 'bg-emerald-100 text-emerald-700'
                      : statusPill === 'FAIL'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {statusPill}
                </span>
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-cyan-700">
                  {String(roleFitPill).toUpperCase()}
                </span>
                <span className="rounded-full bg-orange-400 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white">
                  {String(recommendationPill).toUpperCase()}
                </span>
              </div>
            </div>

            <section className="flex gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                AI
              </div>
              <p className="text-sm italic leading-7 text-slate-700">
                "{overview.result?.summary_paragraph}"
              </p>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-teal-500">
                  Strengths
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {analysisStrengths.map((strength) => (
                    <li key={strength} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-red-400">
                  Areas for Improvement
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {analysisImprovements.map((improvement) => (
                    <li key={improvement} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-sm font-semibold text-slate-500">Strongest Topic</span>
                <span className="rounded-full bg-teal-500 px-4 py-2 text-sm font-black text-white">
                  {strongestTopic}
                </span>
              </section>
              <section className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-sm font-semibold text-slate-500">Weakest Topic</span>
                <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white">
                  {weakestTopic}
                </span>
              </section>
            </div>

            <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <h3 className="text-sm font-black text-amber-800">Integrity Flags</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-600">
                    Violations Logged
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-900">{integrityFlags}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-600">
                    Marks Deducted
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-900">{marksDeducted}</p>
                </div>
              </div>
              {overview.result?.integrity_reason ? (
                <p className="mt-4 text-sm font-semibold leading-6 text-amber-900">
                  {overview.result.integrity_reason}
                </p>
              ) : null}
            </section>

            <section className="rounded-lg border-2 border-teal-400 bg-teal-50/50 p-5 shadow-sm">
              <p className="text-sm leading-6 text-slate-700">
                <strong className="text-slate-900">Recommendation:</strong>{' '}
                <span className="font-black text-teal-600">
                  {overview.result?.hiring_action || recommendationPill}
                </span>
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                <strong>Reasoning:</strong> {overview.result?.hiring_reasoning}
              </p>
              {overview.result?.topic_notes ? (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  <strong>Topic Notes:</strong> {overview.result.topic_notes}
                </p>
              ) : null}
            </section>
          </div>
          )
        ) : null}
      </div>
    </div>
  );
}

function ConfirmationModal({ confirmation, isConfirming = false, onCancel, onConfirm }) {
  if (!confirmation) {
    return null;
  }

  const confirmingLabel =
    confirmation.confirmLabel === 'Reset & Retake'
      ? 'Resetting...'
      : confirmation.confirmLabel === 'Delete Profile'
        ? 'Deleting...'
        : confirmation.confirmLabel === 'Deactivate Profile'
          ? 'Deactivating...'
          : 'Working...';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700">
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-950">{confirmation.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{confirmation.message}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:translate-y-0"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-red-700 active:translate-y-0 active:scale-[0.98] disabled:cursor-wait disabled:bg-red-500 disabled:hover:translate-y-0"
          >
            {isConfirming ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-white" />
            ) : null}
            {isConfirming ? confirmingLabel : confirmation.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
      <div className="relative mb-4 flex h-20 w-24 items-center justify-center">
        <div className="absolute bottom-1 h-8 w-20 rounded-full bg-slate-200" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-lg border border-slate-200 bg-white text-navy-800 shadow-soft">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
    </div>
  );
}

function AiLoadingSkeleton({ elapsedSeconds = 0, isVisible }) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-all duration-300 ${
        isVisible ? 'max-h-40 p-4 opacity-100' : 'max-h-0 border-transparent p-0 opacity-0'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-navy-800" />
          <p className="text-sm font-bold text-slate-700">
            AI is generating your questions...
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
          {formatElapsedTime(elapsedSeconds)}
        </span>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-11/12 animate-pulse rounded-full bg-slate-200" />
        <div className="h-3 w-9/12 animate-pulse rounded-full bg-slate-200" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 animate-pulse rounded-lg bg-white" />
          <div className="h-8 animate-pulse rounded-lg bg-white" />
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className = '', status }) {
  const resolvedClassName = status ? badgeStyles[status] : className;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${resolvedClassName}`}
    >
      {children}
    </span>
  );
}

function TestPortalSection() {
  const storedCandidateSession = (() => {
    try {
      return JSON.parse(window.localStorage.getItem('probation-test-candidate-session') || 'null');
    } catch {
      return null;
    }
  })();
  const [portalView, setPortalView] = useState(
    storedCandidateSession?.portal_view ||
      (storedCandidateSession?.candidate_status === 'completed'
        ? 'submitted'
        : storedCandidateSession?.candidate_status === 'terminated'
          ? 'terminated'
          : storedCandidateSession
            ? 'rules'
            : 'login'),
  );
  const [candidateSession, setCandidateSession] = useState(storedCandidateSession);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [rulesError, setRulesError] = useState('');
  const [isStartingTest, setIsStartingTest] = useState(false);
  const [testSession, setTestSession] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [testAnswers, setTestAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultTestDurationMinutes * 60);
  const [testError, setTestError] = useState('');
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [isTerminatingTest, setIsTerminatingTest] = useState(false);
  const [isTestTerminated, setIsTestTerminated] = useState(false);
  const answerSaveTimers = useRef({});
  const warningCountRef = useRef(0);
  const tabViolationCountRef = useRef(0);
  const isTestTerminatedRef = useRef(false);
  const isSubmittingTestRef = useRef(false);
  const blurCheckTimeoutRef = useRef(null);
  const suppressFocusViolationUntilRef = useRef(0);

  useEffect(() => {
    if (portalView !== 'test') {
      return undefined;
    }

    loadTestPage();
    return undefined;
  }, [portalView]);

  useEffect(() => {
    if (portalView !== 'submitted') {
      return undefined;
    }

    const redirectTimer = window.setTimeout(() => {
      window.localStorage.removeItem('probation-test-candidate-session');
      setCandidateSession(null);
      setTestSession(null);
      setTestQuestions([]);
      setTestAnswers({});
      setCurrentQuestionIndex(0);
      setRemainingSeconds(defaultTestDurationMinutes * 60);
      setRulesAccepted(false);
      setWarningCount(0);
      setIsTestTerminated(false);
      setShowSubmitConfirm(false);
      setLoginForm({ email: '', password: '' });
      setLoginError('');
      setPortalView('login');
    }, 5000);

    return () => window.clearTimeout(redirectTimer);
  }, [portalView]);

  useEffect(() => {
    if (portalView !== 'test' || remainingSeconds <= 0 || isTestTerminated) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [portalView, remainingSeconds, isTestTerminated]);

  useEffect(() => {
    if (
      portalView === 'test' &&
      remainingSeconds <= 0 &&
      testSession?.id &&
      !isSubmittingTestRef.current &&
      !isTestTerminated
    ) {
      submitTest(0);
    }
  }, [portalView, remainingSeconds, testSession?.id, isTestTerminated]);

  useEffect(() => {
    warningCountRef.current = warningCount;
  }, [warningCount]);

  useEffect(() => {
    isTestTerminatedRef.current = isTestTerminated;
  }, [isTestTerminated]);

  useEffect(() => {
    if (portalView !== 'test' || !testSession?.id || isTestTerminated) {
      return undefined;
    }

    const blockedEvents = {
      copy: 'copy_attempt',
      cut: 'cut_attempt',
      paste: 'paste_attempt',
      contextmenu: 'right_click',
    };

    const blockInteraction = (event) => {
      event.preventDefault();
      logCheatingViolation(blockedEvents[event.type], `${event.type} event blocked`);
    };
    const handleWindowBlur = () => {
      if (blurCheckTimeoutRef.current) {
        window.clearTimeout(blurCheckTimeoutRef.current);
      }

      blurCheckTimeoutRef.current = window.setTimeout(() => {
        if (
          showSubmitConfirm ||
          Date.now() < suppressFocusViolationUntilRef.current ||
          document.hidden ||
          document.hasFocus()
        ) {
          return;
        }

        logCheatingViolation('window_blur', 'Window lost focus during test');
      }, 1500);
    };
    const handleWindowFocus = () => {
      suppressFocusViolationUntilRef.current = Date.now() + 2500;
      if (blurCheckTimeoutRef.current) {
        window.clearTimeout(blurCheckTimeoutRef.current);
        blurCheckTimeoutRef.current = null;
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logCheatingViolation('tab_switch', 'Browser tab became hidden');
      }
    };
    const blockDevtoolsShortcut = (event) => {
      const key = String(event.key || '').toLowerCase();
      const isBlockedShortcut =
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (key === 'i' || key === 'j')) ||
        (event.ctrlKey && key === 'u');

      if (!isBlockedShortcut) {
        return;
      }

      event.preventDefault();
      logCheatingViolation('devtools_open', `Blocked shortcut: ${event.key}`);
    };

    Object.keys(blockedEvents).forEach((eventName) => {
      document.addEventListener(eventName, blockInteraction);
    });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', blockDevtoolsShortcut);

    return () => {
      Object.keys(blockedEvents).forEach((eventName) => {
        document.removeEventListener(eventName, blockInteraction);
      });
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', blockDevtoolsShortcut);
      if (blurCheckTimeoutRef.current) {
        window.clearTimeout(blurCheckTimeoutRef.current);
        blurCheckTimeoutRef.current = null;
      }
    };
  }, [portalView, testSession?.id, isTestTerminated, showSubmitConfirm]);

  useEffect(
    () => () => {
      Object.values(answerSaveTimers.current).forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  async function handleCandidateLogin(event) {
    event.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const email = loginForm.email.trim();
      const password = loginForm.password;
      const response = await fetch(
        `${supabaseUrl}/rest/v1/candidates?select=id,batch_id,full_name,email,password,status,test_link&email=eq.${encodeURIComponent(email)}&password=eq.${encodeURIComponent(password)}&limit=1`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Candidate login failed');
      }

      const rows = await response.json();
      if (!Array.isArray(rows) || rows.length === 0) {
        setLoginError('Invalid email or password');
        return;
      }

      const candidate = rows[0];
      const sessionData = {
        id: candidate.id,
        batch_id: candidate.batch_id,
        full_name: candidate.full_name,
        candidate_status: candidate.status,
        test_duration_minutes: getTestDurationMinutesFromLink(candidate.test_link),
        portal_view:
          candidate.status === 'completed'
            ? 'submitted'
            : candidate.status === 'terminated'
              ? 'terminated'
              : 'rules',
      };
      window.localStorage.setItem(
        'probation-test-candidate-session',
        JSON.stringify(sessionData),
      );
      setCandidateSession(sessionData);
      setPortalView(sessionData.portal_view);
    } catch {
      setLoginError('Invalid email or password');
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function getExistingTestSession(sessionData) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/test_sessions?select=*&candidate_id=eq.${encodeURIComponent(sessionData.id)}&batch_id=eq.${encodeURIComponent(sessionData.batch_id)}&status=eq.in_progress&limit=1`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Test session lookup failed');
    }

    const rows = await response.json();
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }

  async function createTestSession(sessionData) {
    const response = await fetch(`${supabaseUrl}/rest/v1/test_sessions`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        candidate_id: sessionData.id,
        batch_id: sessionData.batch_id,
        started_at: new Date().toISOString(),
        time_limit_minutes: getValidTestDurationMinutes(sessionData.test_duration_minutes),
        status: 'in_progress',
      }),
    });

    if (!response.ok) {
      throw new Error('Test session create failed');
    }

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Test session create failed');
    }

    return rows[0];
  }

  async function handleContinueToTest() {
    if (!rulesAccepted) {
      return;
    }

    setRulesError('');
    setIsStartingTest(true);

    try {
      const sessionData = candidateSession;
      if (!sessionData?.id || !sessionData?.batch_id) {
        throw new Error('Candidate session missing');
      }

      const existingSession = await getExistingTestSession(sessionData);
      const testSession = existingSession || (await createTestSession(sessionData));
      const nextSessionData = {
        ...sessionData,
        test_session_id: testSession.id,
      };

      window.localStorage.setItem(
        'probation-test-candidate-session',
        JSON.stringify(nextSessionData),
      );
      setCandidateSession(nextSessionData);
      setPortalView('test');
    } catch {
      setRulesError('Unable to start test session, please try again.');
    } finally {
      setIsStartingTest(false);
    }
  }

  async function fetchCandidateBatchId(sessionData) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/candidates?select=id,batch_id,full_name,test_link&id=eq.${encodeURIComponent(sessionData.id)}&limit=1`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Candidate fetch failed');
    }

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Candidate not found');
    }

    return rows[0];
  }

  async function fetchTestSession(sessionId) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/test_sessions?select=*&id=eq.${encodeURIComponent(sessionId)}&limit=1`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Test session fetch failed');
    }

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Test session not found');
    }

    return rows[0];
  }

  async function fetchSavedAnswers(sessionId) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/answers?select=*&session_id=eq.${encodeURIComponent(sessionId)}`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Answers fetch failed');
    }

    const rows = await response.json();
    return rows.reduce((answerMap, answer) => {
      answerMap[answer.question_id] = {
        id: answer.id,
        value: answer.answer_text || '',
      };
      return answerMap;
    }, {});
  }

  async function fetchTestQuestionsRows(batchId) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/questions?batch_id=eq.${encodeURIComponent(batchId)}&order=order_index.asc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Questions fetch failed');
    }

    return response.json();
  }

  function calculateRemainingSeconds(sessionRow) {
    const limitMinutes = Number(sessionRow.time_limit_minutes || defaultTestDurationMinutes);
    const startedAt = sessionRow.started_at ? new Date(sessionRow.started_at) : new Date();
    const elapsedSeconds = Math.floor((Date.now() - startedAt.getTime()) / 1000);

    return Math.max(limitMinutes * 60 - elapsedSeconds, 0);
  }

  async function loadTestPage() {
    const sessionData = candidateSession;

    if (!sessionData?.id || !sessionData?.test_session_id) {
      setTestError('Candidate session is missing. Please log in again.');
      return;
    }

    setIsLoadingTest(true);
    setTestError('');

    try {
      const candidate = await fetchCandidateBatchId(sessionData);
      const batchId = candidate.batch_id || sessionData.batch_id;
      const sessionRow = await fetchTestSession(sessionData.test_session_id);
      const [questionsRows, savedAnswers] = await Promise.all([
        fetchTestQuestionsRows(batchId),
        fetchSavedAnswers(sessionRow.id),
      ]);

      setCandidateSession((currentSession) => ({
        ...currentSession,
        batch_id: batchId,
        full_name: candidate.full_name || currentSession?.full_name,
        test_duration_minutes: getTestDurationMinutesFromLink(candidate.test_link),
      }));
      setTestSession(sessionRow);
      setTestQuestions(questionsRows.map(normalizeFetchedQuestion));
      setTestAnswers(savedAnswers);
      setCurrentQuestionIndex(0);
      setRemainingSeconds(calculateRemainingSeconds(sessionRow));
    } catch {
      setTestError('Unable to load test questions, please try again.');
    } finally {
      setIsLoadingTest(false);
    }
  }

  async function saveAnswerToSupabase(question, answerText) {
    if (!candidateSession?.id || !testSession?.id || !question?.databaseId) {
      return;
    }

    const existingAnswer = testAnswers[question.databaseId];
    const answerPayload = {
      session_id: testSession.id,
      candidate_id: candidateSession.id,
      question_id: question.databaseId,
      question_type: toDatabaseQuestionType(question.type),
      answer_text: answerText,
    };

    if (existingAnswer?.id) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/answers?id=eq.${encodeURIComponent(existingAnswer.id)}`,
        {
          method: 'PATCH',
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answer_text: answerText }),
        },
      );

      if (!response.ok) {
        throw new Error('Answer update failed');
      }
      return;
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/answers`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(answerPayload),
    });

    if (!response.ok) {
      throw new Error('Answer save failed');
    }

    const rows = await response.json();
    if (Array.isArray(rows) && rows[0]?.id) {
      setTestAnswers((currentAnswers) => ({
        ...currentAnswers,
        [question.databaseId]: {
          id: rows[0].id,
          value: answerText,
        },
      }));
    }
  }

  function updateTestAnswer(question, answerText) {
    if (!question?.databaseId) {
      return;
    }

    setTestAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.databaseId]: {
        ...(currentAnswers[question.databaseId] || {}),
        value: answerText,
      },
    }));
    setTestError('');

    if (answerSaveTimers.current[question.databaseId]) {
      window.clearTimeout(answerSaveTimers.current[question.databaseId]);
    }

    answerSaveTimers.current[question.databaseId] = window.setTimeout(() => {
      saveAnswerToSupabase(question, answerText).catch(() => {
        setTestError('Answer could not be saved. Please check your connection.');
      });
    }, 300);
  }

  async function logCheatingViolation(eventType, eventDetail) {
    if (!testSession?.id || !candidateSession?.id || isTestTerminatedRef.current) {
      return;
    }

    const isTabViolation = eventType === 'window_blur' || eventType === 'tab_switch';
    if (isTabViolation) {
      tabViolationCountRef.current += 1;
    }

    const nextWarningCount = warningCountRef.current + 1;
    warningCountRef.current = nextWarningCount;
    setWarningCount(nextWarningCount);

    try {
      await fetch(`${supabaseUrl}/rest/v1/cheating_logs`, {
        method: 'POST',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: testSession.id,
          candidate_id: candidateSession.id,
          event_type: eventType,
          event_detail: eventDetail,
          warning_number: nextWarningCount,
        }),
      });
    } catch {
      // Keep enforcement active even if logging is blocked by network or RLS.
    }

    if (isTabViolation && tabViolationCountRef.current >= 2) {
      terminateTestForCheating('Excessive tab switching');
      return;
    }

    if (!isTabViolation && nextWarningCount >= 3) {
      terminateTestForCheating();
    }
  }

  async function terminateTestForCheating(reason = 'cheating') {
    if (!testSession?.id || !candidateSession?.id || isTestTerminatedRef.current) {
      return;
    }

    isTestTerminatedRef.current = true;
    setIsTestTerminated(true);
    setIsTerminatingTest(true);
    setShowSubmitConfirm(false);
    setTestError('');
    const checkerPayload = {
      session_id: testSession.id,
      candidate_id: candidateSession.id,
      status: 'terminated',
      session_status: 'terminated',
      termination_reason: reason,
    };

    try {
      const [sessionResponse, candidateResponse] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/test_sessions?id=eq.${encodeURIComponent(testSession.id)}`, {
          method: 'PATCH',
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'terminated',
            termination_reason: reason,
            time_remaining_seconds: remainingSeconds,
          }),
        }),
        fetch(`${supabaseUrl}/rest/v1/candidates?id=eq.${encodeURIComponent(candidateSession.id)}`, {
          method: 'PATCH',
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'terminated' }),
        }),
      ]);

      if (!sessionResponse.ok || !candidateResponse.ok) {
        throw new Error('Termination update failed');
      }

      const nextSessionData = {
        ...candidateSession,
        candidate_status: 'terminated',
        portal_view: 'terminated',
      };
      window.localStorage.setItem(
        'probation-test-candidate-session',
        JSON.stringify(nextSessionData),
      );
      setCandidateSession(nextSessionData);
    } catch {
      setTestError('Test terminated, but the termination update could not be fully saved.');
    } finally {
      try {
        const checkerResponse = await fetch(aiTestCheckerWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(checkerPayload),
        });

        if (!checkerResponse.ok) {
          console.warn('AI test checker termination webhook failed:', await checkerResponse.text());
        }
      } catch (error) {
        console.warn('AI test checker termination webhook could not be called:', error);
        await fetch(aiTestCheckerWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
          },
          body: JSON.stringify(checkerPayload),
        });
      }
      setIsTerminatingTest(false);
    }
  }

  function requestSubmitTest() {
    if (isTestTerminated) {
      return;
    }

    if (remainingSeconds > 0) {
      suppressFocusViolationUntilRef.current = Date.now() + 3500;
      setShowSubmitConfirm(true);
      return;
    }

    submitTest(remainingSeconds);
  }

  async function submitTest(remainingOverride = remainingSeconds) {
    if (!testSession?.id || isTestTerminated || isSubmittingTestRef.current) {
      return;
    }

    isSubmittingTestRef.current = true;
    setIsSubmittingTest(true);
    setTestError('');
    setShowSubmitConfirm(false);
    const finalRemainingSeconds = Math.max(Number(remainingOverride) || 0, 0);

    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/test_sessions?id=eq.${encodeURIComponent(testSession.id)}`,
        {
          method: 'PATCH',
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            time_remaining_seconds: finalRemainingSeconds,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Test submit failed');
      }

      const candidateResponse = await fetch(
        `${supabaseUrl}/rest/v1/candidates?id=eq.${encodeURIComponent(candidateSession.id)}`,
        {
          method: 'PATCH',
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'completed' }),
        },
      );

      if (!candidateResponse.ok) {
        throw new Error('Candidate status update failed');
      }

      const checkerPayload = {
        session_id: testSession.id,
        candidate_id: candidateSession.id,
        status: 'submitted',
        session_status: 'submitted',
      };

      try {
        const checkerResponse = await fetch(aiTestCheckerWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(checkerPayload),
        });

        if (!checkerResponse.ok) {
          console.warn('AI test checker webhook failed:', await checkerResponse.text());
        }
      } catch (error) {
        console.warn('AI test checker webhook could not be called:', error);
        await fetch(aiTestCheckerWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
          },
          body: JSON.stringify(checkerPayload),
        });
      }

      const nextSessionData = {
        ...candidateSession,
        candidate_status: 'completed',
        portal_view: 'submitted',
      };
      window.localStorage.setItem(
        'probation-test-candidate-session',
        JSON.stringify(nextSessionData),
      );
      setCandidateSession(nextSessionData);
      setPortalView('submitted');
    } catch {
      setTestError('Unable to submit test, please try again.');
    } finally {
      isSubmittingTestRef.current = false;
      setIsSubmittingTest(false);
    }
  }

  const portalQuestionGroups = testQuestions.reduce(
    (groups, question, index) => {
      const sectionId =
        question.type === 'MCQ' ? 'mcq' : question.type === 'Short Answer' ? 'short' : 'long';
      groups[sectionId].push({ question, index });
      return groups;
    },
    { mcq: [], short: [], long: [] },
  );
  const portalSections = [
    { id: 'mcq', label: 'MCQ', title: 'MCQ Questions', questions: portalQuestionGroups.mcq },
    {
      id: 'short',
      label: 'Short',
      title: 'Short Questions',
      questions: portalQuestionGroups.short,
    },
    { id: 'long', label: 'Long', title: 'Long Questions', questions: portalQuestionGroups.long },
  ];

  if (portalView === 'test') {
    const currentQuestion = testQuestions[currentQuestionIndex];
    const currentAnswer = currentQuestion?.databaseId
      ? testAnswers[currentQuestion.databaseId]?.value || ''
      : '';
    const isTestLocked = isSubmittingTest || isTestTerminated || isTerminatingTest;
    const answeredCount = testQuestions.filter((question) =>
      Boolean(testAnswers[question.databaseId]?.value?.trim()),
    ).length;
    const progressPercent = testQuestions.length
      ? Math.round((answeredCount / testQuestions.length) * 100)
      : 0;

    const timerStateClass =
      remainingSeconds <= 60 ? 'danger' : remainingSeconds <= 300 ? 'warning' : '';
    const activeSectionId =
      currentQuestion?.type === 'MCQ'
        ? 'mcq'
        : currentQuestion?.type === 'Short Answer'
          ? 'short'
          : 'long';

    return (
      <section className="portal-bg min-h-[620px] select-none overflow-hidden rounded-2xl border border-slate-200">
        {warningCount > 0 && !isTestTerminated ? (
          <div className="fixed left-0 right-0 top-0 z-[1000] bg-red-600 px-4 py-3 text-center text-sm font-bold text-white shadow-lg">
            Warning: policy violation detected. This incident has been logged.
          </div>
        ) : null}

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                  <FileQuestion className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-black">Probation Test</p>
                  <p className="max-w-[220px] truncate text-xs text-slate-500">
                    {candidateSession?.full_name || 'Candidate'}
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                {portalSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    disabled={section.questions.length === 0 || isTestLocked}
                    onClick={() => setCurrentQuestionIndex(section.questions[0].index)}
                    className={`portal-section-tab ${
                      activeSectionId === section.id ? 'active' : ''
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    {section.label} ({section.questions.length})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:block">
                <div className="mb-1 text-xs text-slate-500">
                  Progress: <span className="font-bold text-black">{answeredCount}/{testQuestions.length}</span>
                </div>
                <div className="h-1 w-32 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-black transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
                <span className="text-sm text-slate-500" aria-hidden="true">Time</span>
                <span className={`portal-timer text-sm font-bold text-black ${timerStateClass}`}>
                  {formatElapsedTime(remainingSeconds)}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex min-h-[560px] flex-col lg:flex-row">
        {isTestTerminated ? (
          <div className="m-4 flex-1 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h4 className="text-xl font-bold text-red-800">Test terminated due to policy violations.</h4>
            <p className="mt-2 text-sm text-red-700">
              Further input and navigation have been disabled.
            </p>
          </div>
        ) : isLoadingTest ? (
          <div className="m-4 flex-1 rounded-2xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-600 shadow-sm">
            Loading test questions...
          </div>
        ) : testError ? (
          <div className="m-4 flex-1 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
            {testError}
          </div>
        ) : currentQuestion ? (
          <div className="grid flex-1 gap-0 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <div className="space-y-6 p-4 lg:order-2 lg:p-8">
              <article className="portal-card overflow-hidden rounded-2xl">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                      {currentQuestionIndex + 1}
                    </div>
                    <div>
                      <Badge className={questionTypeBadgeStyles[currentQuestion.type]}>
                        {currentQuestion.type}
                      </Badge>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Question {currentQuestionIndex + 1} of {testQuestions.length}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                    Auto-save enabled
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                <h4 className="text-2xl font-bold leading-9 tracking-tight text-black">{currentQuestion.text}</h4>

                {currentQuestion.type === 'MCQ' ? (
                  <div className="mt-5 space-y-3">
                    {currentQuestion.options.map((option, optionIndex) => {
                      const optionLabel = String.fromCharCode(65 + optionIndex);
                      const optionValue = `${optionLabel}. ${option}`;

                      return (
                        <label
                          key={optionValue}
                          className={`portal-option flex cursor-pointer items-center gap-4 rounded-xl p-4 text-sm font-semibold ${
                            currentAnswer === optionValue
                              ? 'selected text-black'
                              : 'text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.databaseId}`}
                            checked={currentAnswer === optionValue}
                            disabled={isTestLocked}
                            onChange={() => updateTestAnswer(currentQuestion, optionValue)}
                            className="h-5 w-5 text-black focus:ring-black"
                          />
                          <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">
                            {optionLabel}
                          </span>
                          <span className="flex-1">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    value={currentAnswer}
                    onChange={(event) => updateTestAnswer(currentQuestion, event.target.value)}
                    disabled={isTestLocked}
                    rows={currentQuestion.type === 'Long Answer' ? 8 : 4}
                    placeholder="Type your answer here"
                    className="portal-input mt-5 min-h-32 w-full rounded-xl p-4 text-sm leading-6 text-slate-700 placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                )}
                </div>
              </article>

              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0 || isTestLocked}
                  onClick={() => setCurrentQuestionIndex((index) => Math.max(index - 1, 0))}
                  className="portal-secondary inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={requestSubmitTest}
                    disabled={isTestLocked}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-5 text-sm font-bold text-red-700 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingTest ? 'Submitting...' : 'Submit Test'}
                  </button>
                  <button
                    type="button"
                    disabled={currentQuestionIndex >= testQuestions.length - 1 || isTestLocked}
                    onClick={() =>
                      setCurrentQuestionIndex((index) =>
                        Math.min(index + 1, testQuestions.length - 1),
                      )
                    }
                    className="portal-primary inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {currentQuestionIndex >= testQuestions.length - 1 ? 'Review' : 'Next'}
                  </button>
                </div>
              </div>
            </div>

            <aside className="border-b border-slate-200 bg-slate-50 p-4 lg:order-1 lg:border-b-0 lg:border-r xl:sticky xl:top-24">
              <div className="mb-4">
                <h4 className="text-sm font-bold text-black">Question Navigator</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Jump to any question.
                </p>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2 text-xs font-semibold">
                <span className="rounded-lg bg-green-50 px-2 py-1 text-green-700 ring-1 ring-green-200">
                  Answered
                </span>
                <span className="rounded-lg bg-white px-2 py-1 text-slate-500 ring-1 ring-slate-200">
                  Pending
                </span>
              </div>
              <div className="grid grid-cols-10 gap-2 lg:grid-cols-5">
                {testQuestions.map((question, index) => {
                  const isAnswered = Boolean(
                    testAnswers[question.databaseId]?.value?.trim(),
                  );
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.databaseId || question.id}
                      type="button"
                      disabled={isTestLocked}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`relative inline-flex h-10 items-center justify-center rounded-lg text-sm font-bold transition ${
                        isCurrent
                          ? 'bg-navy-900 text-white shadow-soft'
                          : isAnswered
                            ? 'border border-green-200 bg-green-50 text-green-700 hover:border-green-300'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-navy-700 hover:text-navy-900'
                      }`}
                      aria-label={`Go to question ${index + 1}`}
                    >
                      {index + 1}
                      {isAnswered ? (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] leading-none text-white">
                          ✓
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        ) : (
          <EmptyState
            icon={FileQuestion}
            title="No questions found"
            message="No questions are available for this candidate batch."
          />
        )}
        </main>

        {showSubmitConfirm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
              <h4 className="text-lg font-bold text-slate-950">Submit test?</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                You still have {Math.ceil(remainingSeconds / 60)} minutes left. Are you sure you want to submit?
              </p>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onPointerDown={() => {
                    suppressFocusViolationUntilRef.current = Date.now() + 3500;
                  }}
                  onClick={() => {
                    suppressFocusViolationUntilRef.current = Date.now() + 3500;
                    setShowSubmitConfirm(false);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onPointerDown={() => {
                    suppressFocusViolationUntilRef.current = Date.now() + 3500;
                  }}
                  onClick={() => {
                    suppressFocusViolationUntilRef.current = Date.now() + 3500;
                    submitTest();
                  }}
                  disabled={isSubmittingTest}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-navy-900 px-4 text-sm font-bold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  if (portalView === 'submitted') {
    return (
      <section className="portal-bg flex min-h-[620px] items-center justify-center rounded-2xl border border-slate-200 p-4">
        <div className="portal-card relative z-10 w-full max-w-lg rounded-2xl p-8 text-center md:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white">
            <FileQuestion className="h-8 w-8" aria-hidden="true" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-black">Thank you for taking the test</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Results will be emailed to you shortly. You will be redirected to login in a few seconds.
          </p>
        </div>
      </section>
    );
  }

  if (portalView === 'terminated') {
    return (
      <section className="portal-bg flex min-h-[620px] items-center justify-center rounded-2xl border border-red-200 p-4">
        <div className="relative z-10 w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-soft md:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white">
            <FileQuestion className="h-8 w-8" aria-hidden="true" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-red-800">
            Test terminated due to policy violations.
          </h3>
          <p className="mt-3 text-sm leading-6 text-red-700">
            Further input and navigation have been disabled.
          </p>
        </div>
      </section>
    );
  }

  if (portalView === 'rules') {
    const rules = [
      'Stay on the test tab. Leaving the tab or switching windows triggers a strict 2-tier penalty while your main test timer keeps running.',
      'Tab-switch penalties: 1st violation = 45-second lock penalty. 2nd violation instantly terminates and submits the test.',
      'There are no further warnings after the first lock penalty. The next tab or window switch ends the test for excessive tab switching.',
      'Copy, cut, paste, right-click, and Alt/Ctrl/Cmd keyboard shortcuts are blocked and logged as separate violations.',
      'No using AI or external help',
      'All violations are stored with your test session and may affect your probation assessment.',
    ];

    return (
      <section className="portal-bg flex min-h-[620px] items-center justify-center rounded-2xl border border-slate-200 p-4">
        <div className="portal-card relative z-10 w-full max-w-2xl rounded-2xl p-8 md:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 text-black">
              <FileQuestion className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-black">Test Guidelines</h3>
            <p className="mt-2 text-sm text-slate-500">
              Please read and understand the following rules
            </p>
          </div>

          <ul className="space-y-4">
            {rules.map((rule) => (
              <li
                key={rule}
                className="portal-rule-item py-2 text-sm font-semibold text-black md:text-base"
              >
                <span className="text-slate-600">{rule}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-slate-200 pt-6">
          <label className="mb-6 flex cursor-pointer items-start gap-3 text-sm text-slate-500">
            <input
              type="checkbox"
              checked={rulesAccepted}
              onChange={(event) => setRulesAccepted(event.target.checked)}
              className="portal-checkbox mt-0.5 shrink-0"
            />
            I understand and confirm
          </label>

          {rulesError ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {rulesError}
            </p>
          ) : null}

          <button
            type="button"
            disabled={!rulesAccepted || isStartingTest}
            onClick={handleContinueToTest}
            className="portal-primary inline-flex h-12 w-full items-center justify-center rounded-xl px-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-30 disabled:transform-none"
          >
            {isStartingTest ? 'Starting test...' : 'Continue to Test'}
          </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="portal-bg flex min-h-[620px] items-center justify-center rounded-2xl border border-slate-200 p-4">
      <div className="portal-card relative z-10 w-full max-w-md rounded-2xl p-8 md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white">
            <FileQuestion className="h-8 w-8" aria-hidden="true" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-black">Probation Test Portal</h3>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to begin</p>
        </div>

        <form className="space-y-4" onSubmit={handleCandidateLogin}>
          <label className="block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Email</span>
            <input
              type="email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((currentForm) => ({
                  ...currentForm,
                  email: event.target.value,
                }))
              }
              placeholder="candidate@example.com"
              className="portal-input h-12 w-full rounded-xl px-4 text-base placeholder:text-slate-400"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Password</span>
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((currentForm) => ({
                  ...currentForm,
                  password: event.target.value,
                }))
              }
              placeholder="Enter password"
              className="portal-input h-12 w-full rounded-xl px-4 text-base placeholder:text-slate-400"
            />
          </label>

          {loginError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {loginError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="portal-primary inline-flex h-12 w-full items-center justify-center rounded-xl px-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoggingIn ? 'Checking credentials...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          This is a secure examination portal. All activities are monitored.
        </p>
      </div>
    </section>
  );
}

function PlaceholderSection({ section }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sectionStats[section.id].map(([label, value]) => (
          <article
            key={label}
            className="relative overflow-hidden rounded-xl border border-[#cfc4c5] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-[13px] font-semibold text-[#4c4546]">{label}</p>
            <p className="app-kpi-value mt-4 text-[32px] font-extrabold leading-none text-[#1b1c1c]">
              {value}
            </p>
            <div className="absolute bottom-4 left-6 right-6 h-px bg-[#cfc4c5]/70" />
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border border-[#cfc4c5] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-[#1b1c1c]">{section.label} Overview</h3>
          <div className="mt-6 overflow-hidden rounded-xl border border-[#cfc4c5]">
            <div className="grid grid-cols-3 bg-[#f5f3f3] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#7e7576]">
              <span>Area</span>
              <span>Status</span>
              <span className="text-right">Updated</span>
            </div>
            {['Policy Review', 'Content Audit', 'Profile Sync'].map((item, index) => (
              <div
                key={item}
                className="grid grid-cols-3 border-t border-[#cfc4c5] px-4 py-4 text-sm text-[#4c4546]"
              >
                <span className="font-bold text-[#1b1c1c]">{item}</span>
                <span>{index === 0 ? 'In progress' : 'Ready'}</span>
                <span className="text-right">{index + 1}h ago</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#cfc4c5] bg-[#f5f3f3] p-6">
          <h3 className="text-lg font-black text-[#1b1c1c]">Placeholder Content</h3>
          <p className="mt-3 text-sm leading-6 text-[#4c4546]">
            This area is prepared for the future {section.label.toLowerCase()} workflow. Backend
            data, forms, filters, and permissions can be connected here when the application is
            ready for implementation.
          </p>
          <div className="mt-6 h-2 rounded-full bg-[#e3e2e2]">
            <div className="h-2 w-2/3 rounded-full bg-[#1b1b1b]" />
          </div>
        </section>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

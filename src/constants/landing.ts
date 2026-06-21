import {
  BarChart3,
  Flame,
  Layers,
  Moon,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { APP_TAGLINE } from "@/constants/brand";
import {
  METRICS_GUIDE_EXAMPLE,
  METRICS_GUIDE_EXAMPLE_SCORE,
  METRICS_GUIDE_WEIGHTS,
} from "@/components/tutorial/tutorial-content";

export const LANDING_SEO_DESCRIPTION =
  "Build better habits. Quit the ones holding you back. RIZEN treats transformation as a daily practice—one step closer, every day.";

export const LANDING_DASHBOARD_CTA = "Go to Dashboard";

export const LANDING_HERO = {
  eyebrow: APP_TAGLINE,
  headline: "Transform one step at a time.",
  subcopy:
    "Build better habits. Quit the ones holding you back. Every day, one step closer.",
  primaryCta: "Get Started",
  secondaryCta: "Log in",
} as const;

export const LANDING_PHILOSOPHY = {
  eyebrow: "Our Philosophy",
  headline: "Progress isn't perfection. It's direction.",
  paragraphs: [
    "Real transformation doesn't happen overnight. It happens in the quiet moments when you choose to show up—or choose to let go.",
    "RIZEN treats change as a daily practice, not an all-or-nothing sprint. Build the routines that move you forward. Release the patterns that hold you back. Small steps compound into lasting change.",
  ],
  pillars: [
    {
      title: "Build forward",
      description:
        "Grow positive routines—reading, exercise, mindfulness—with optional daily targets that keep momentum alive.",
    },
    {
      title: "Release what holds you back",
      description:
        "Break negative patterns around screen time, substances, impulse spending, and more—with the same care you give your wins.",
    },
    {
      title: "One step closer",
      description:
        "Every check-in is a step on your journey. Consistency over intensity. Direction over perfection.",
    },
  ],
} as const;

export type LandingFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: TrendingUp,
    title: "Build Habits",
    description:
      "Track positive routines with flexible schedules, custom categories, and optional daily targets like 30 minutes of reading.",
  },
  {
    icon: Target,
    title: "Quit Habits",
    description:
      "Break patterns that hold you back. Mark each day you stay on course and watch your quit success grow over time.",
  },
  {
    icon: Layers,
    title: "Categories",
    description:
      "Organize habits by Health & Fitness, Mindfulness, Digital, Substance, and more—or create your own.",
  },
  {
    icon: BarChart3,
    title: "Insights Dashboard",
    description:
      "Rolling 30-day trends, streak highlights, and category performance—so you always know where you shine.",
  },
  {
    icon: Flame,
    title: "Streaks & Scheduling",
    description:
      "Fair streak calculation that respects rest days. Daily, weekly, or custom schedules for every habit.",
  },
  {
    icon: Moon,
    title: "Designed for Daily Use",
    description:
      "Light and dark modes, a mobile-first layout, and installable as a PWA—ready whenever you are.",
  },
];

export const LANDING_METRICS = {
  eyebrow: "Your Metrics",
  headline: "Know exactly where you stand.",
  subcopy:
    "Your Rizen Score blends completion, streaks, build success, quit success, and growth trend into one clear number—updated every day over a rolling 30-day window.",
  demoScore: METRICS_GUIDE_EXAMPLE_SCORE,
  demoMetrics: METRICS_GUIDE_EXAMPLE,
  weights: METRICS_GUIDE_WEIGHTS,
  supporting: [
    {
      title: "Steps Forward",
      description:
        "Every lifetime check-in counts—a running total of the steps you've taken on your journey.",
    },
    {
      title: "Transformation",
      description:
        "Month-over-month completion change. See whether you're improving, holding steady, or need a gentle reset.",
    },
    {
      title: "Category Highlights",
      description:
        "Discover your strongest category and where a few more consistent steps could make the biggest difference.",
    },
  ],
} as const;

export const LANDING_BENEFITS = {
  eyebrow: "Why RIZEN",
  headline: "Built for the long game.",
  items: [
    {
      title: "Fair streaks",
      description:
        "Rest days and grace periods keep streaks honest—you're not penalized for habits you didn't schedule.",
    },
    {
      title: "Rolling 30-day view",
      description:
        "Recent consistency matters most. Your score reflects how you're showing up now, not months ago.",
    },
    {
      title: "Organized by category",
      description:
        "See which areas of life you're mastering and which deserve a little more attention.",
    },
    {
      title: "Your data, your account",
      description:
        "Export your habits and logs anytime. Your journey stays private and under your control.",
    },
  ],
} as const;

export const LANDING_CTA = {
  headline: "Your next step starts here.",
  subcopy:
    "Build better habits. Release what holds you back. Transformation begins with one choice.",
  primaryCta: "Start Your Journey",
  secondaryCta: "Log in",
} as const;

export const LANDING_FOOTER = {
  tagline: APP_TAGLINE,
} as const;

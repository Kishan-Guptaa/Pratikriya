import { GraduationCap, Ticket, Briefcase, Gamepad2, Utensils, HeartPulse, Building, ShoppingCart, Bug, Music } from "lucide-react";
import React from "react";

export const TEMPLATES_DATA = [
  { 
    id: "student-feedback",
    icon: <GraduationCap />, 
    title: "Student Feedback", 
    description: "Gather insights from students on course material and teaching methods.",
    color: "text-blue-500", 
    border: "rounded-[255px_15px_225px_15px/15px_225px_15px_255px]",
    fields: [
      { label: "Department", labelKey: "department", type: "TEXT" as const, isRequired: true, placeholder: "e.g. Computer Science", description: "Your department", index: 1 },
      { label: "Rating (1-10)", labelKey: "rating", type: "NUMBER" as const, isRequired: true, placeholder: "e.g. 8", description: "Rate the course", index: 2 },
      { label: "Comments", labelKey: "comments", type: "LONG_TEXT" as const, isRequired: false, placeholder: "Any additional thoughts?", description: "", index: 3 }
    ]
  },
  { 
    id: "event-registration",
    icon: <Ticket />, 
    title: "Event Registration", 
    description: "Register attendees for your upcoming event, meetup, or conference.",
    color: "text-pink-500", 
    border: "rounded-[15px_225px_15px_255px/255px_15px_225px_15px]",
    fields: [
      { label: "Full Name", labelKey: "full_name", type: "TEXT" as const, isRequired: true, placeholder: "e.g. John Doe", description: "Your full legal name", index: 1 },
      { label: "Email Address", labelKey: "email", type: "TEXT" as const, isRequired: true, placeholder: "e.g. john@example.com", description: "We'll send your tickets here", index: 2 },
      { label: "Age", labelKey: "age", type: "NUMBER" as const, isRequired: false, placeholder: "e.g. 25", description: "Your current age", index: 3 }
    ]
  },
  { 
    id: "job-application",
    icon: <Briefcase />, 
    title: "Job Application", 
    description: "Collect applications from candidates for an open position.",
    color: "text-orange-500", 
    border: "rounded-[225px_15px_255px_15px/15px_255px_15px_225px]",
    fields: [
      { label: "Applicant Name", labelKey: "applicant_name", type: "TEXT" as const, isRequired: true, placeholder: "e.g. Jane Smith", description: "", index: 1 },
      { label: "Portfolio URL", labelKey: "portfolio", type: "TEXT" as const, isRequired: false, placeholder: "https://...", description: "Link to your work", index: 2 },
      { label: "Years of Experience", labelKey: "experience", type: "NUMBER" as const, isRequired: true, placeholder: "e.g. 3", description: "", index: 3 }
    ]
  },
  { 
    id: "gaming-tournament",
    icon: <Gamepad2 />, 
    title: "Gaming Tournament", 
    description: "Sign up players and teams for your gaming tournament.",
    color: "text-purple-500", 
    border: "rounded-[15px_255px_15px_225px/225px_15px_255px_15px]",
    fields: [
      { label: "Gamer Tag", labelKey: "gamer_tag", type: "TEXT" as const, isRequired: true, placeholder: "e.g. Ninja", description: "Your in-game name", index: 1 },
      { label: "Team Name", labelKey: "team_name", type: "TEXT" as const, isRequired: false, placeholder: "Optional", description: "", index: 2 },
      { label: "Discord ID", labelKey: "discord", type: "TEXT" as const, isRequired: true, placeholder: "User#1234", description: "", index: 3 }
    ]
  },
  { 
    id: "restaurant-review",
    icon: <Utensils />, 
    title: "Restaurant Review", 
    description: "Get feedback from customers about their dining experience.",
    color: "text-green-500", 
    border: "rounded-[255px_25px_225px_25px/25px_225px_25px_255px]",
    fields: [
      { label: "Date of Visit", labelKey: "visit_date", type: "TEXT" as const, isRequired: true, placeholder: "MM/DD/YYYY", description: "", index: 1 },
      { label: "Food Quality (1-5)", labelKey: "food_quality", type: "NUMBER" as const, isRequired: true, placeholder: "5", description: "", index: 2 },
      { label: "Favorite Dish", labelKey: "favorite_dish", type: "TEXT" as const, isRequired: false, placeholder: "", description: "", index: 3 }
    ]
  },
  { 
    id: "health-survey",
    icon: <HeartPulse />, 
    title: "Health Survey", 
    description: "Conduct a basic health or wellness questionnaire.",
    color: "text-red-500", 
    border: "rounded-[225px_15px_255px_15px/15px_255px_15px_225px]",
    fields: [
      { label: "Patient Name", labelKey: "patient_name", type: "TEXT" as const, isRequired: true, placeholder: "", description: "", index: 1 },
      { label: "Any allergies?", labelKey: "allergies", type: "YES_NO" as const, isRequired: true, placeholder: "", description: "", index: 2 },
      { label: "Symptoms", labelKey: "symptoms", type: "LONG_TEXT" as const, isRequired: false, placeholder: "Describe how you feel...", description: "", index: 3 }
    ]
  },
  { 
    id: "office-feedback",
    icon: <Building />, 
    title: "Office Feedback", 
    description: "Collect anonymous feedback from employees in the office.",
    color: "text-slate-500", 
    border: "rounded-[15px_225px_15px_255px/255px_15px_225px_15px]",
    fields: [
      { label: "Department", labelKey: "department", type: "TEXT" as const, isRequired: true, placeholder: "e.g. Sales", description: "", index: 1 },
      { label: "Satisfaction (1-10)", labelKey: "satisfaction", type: "NUMBER" as const, isRequired: true, placeholder: "8", description: "", index: 2 },
      { label: "Suggestions", labelKey: "suggestions", type: "LONG_TEXT" as const, isRequired: false, placeholder: "How can we improve?", description: "", index: 3 }
    ]
  },
  { 
    id: "product-order",
    icon: <ShoppingCart />, 
    title: "Product Order", 
    description: "Simple order form for purchasing physical or digital products.",
    color: "text-yellow-500", 
    border: "rounded-[255px_15px_225px_15px/15px_225px_15px_255px]",
    fields: [
      { label: "Product Name", labelKey: "product_name", type: "TEXT" as const, isRequired: true, placeholder: "e.g. T-Shirt", description: "", index: 1 },
      { label: "Quantity", labelKey: "quantity", type: "NUMBER" as const, isRequired: true, placeholder: "1", description: "", index: 2 },
      { label: "Shipping Address", labelKey: "address", type: "LONG_TEXT" as const, isRequired: true, placeholder: "Full address...", description: "", index: 3 }
    ]
  },
  { 
    id: "bug-report",
    icon: <Bug />, 
    title: "Bug Report", 
    description: "Allow users to report bugs or technical issues.",
    color: "text-lime-500", 
    border: "rounded-[255px_25px_225px_25px/25px_225px_25px_255px]",
    fields: [
      { label: "Issue Title", labelKey: "issue_title", type: "TEXT" as const, isRequired: true, placeholder: "Short summary", description: "", index: 1 },
      { label: "Steps to Reproduce", labelKey: "steps", type: "LONG_TEXT" as const, isRequired: true, placeholder: "1. Do this\n2. Do that", description: "", index: 2 },
      { label: "Browser/Device", labelKey: "device", type: "TEXT" as const, isRequired: false, placeholder: "e.g. Chrome / Mac", description: "", index: 3 }
    ]
  },
  { 
    id: "event-playlist",
    icon: <Music />, 
    title: "Event Playlist", 
    description: "Let guests request songs for an upcoming party or event.",
    color: "text-cyan-500", 
    border: "rounded-[15px_255px_15px_225px/225px_15px_255px_15px]",
    fields: [
      { label: "Guest Name", labelKey: "guest_name", type: "TEXT" as const, isRequired: true, placeholder: "", description: "", index: 1 },
      { label: "Song Title", labelKey: "song_title", type: "TEXT" as const, isRequired: true, placeholder: "e.g. Bohemian Rhapsody", description: "", index: 2 },
      { label: "Artist", labelKey: "artist", type: "TEXT" as const, isRequired: false, placeholder: "e.g. Queen", description: "", index: 3 }
    ]
  }
];

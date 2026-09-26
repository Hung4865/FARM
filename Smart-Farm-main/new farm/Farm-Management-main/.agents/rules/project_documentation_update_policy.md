# PROJECT DOCUMENTATION UPDATE POLICY

## CRITICAL — MANDATORY PROJECT RULE

This is a **mandatory project-wide documentation policy**.

You MUST treat this policy as a **persistent project-level rule** and follow it throughout every development session.

Do NOT treat documentation updates as optional, secondary, or something to do only when explicitly requested.

Whenever a task causes a change that falls within the scopes defined below, you MUST update the corresponding documentation files as part of the same task.

You MUST NOT finish a task while leaving required documentation updates undone.

---

# 1. UI Architecture Documentation (`UI.md`)

## When to Update

You MUST update `UI.md` (e.g. `docs/Frontend_docs/UI.md` or equivalent module UI doc) whenever:

* Starting a **new Frontend/UI task**.
* Moving to a **different Frontend/UI scope or module**.
* Completing one UI area and starting another.

Examples of scope/module transitions:

* Dashboard → Sidebar
* Sidebar → Form View
* Form View → List View
* List View → Kanban View
* One major OWL component/module → another major OWL component/module

A change in scope is sufficient reason to review and update this document.

## What to Document

When updating `UI.md`, document the current UI architecture relevant to the new task, including:

### 1. Overall UI/UX Architecture

* Current Frontend/UI architecture.
* How the current task/module fits into the overall UI.
* Relationships between major UI components.

### 2. Layout and OWL Components

Document the relevant:

* Layout structure.
* OWL components.
* Component hierarchy.
* Parent/child relationships.
* Important XML/QWeb templates.
* Relevant JavaScript/OWL logic.
* Component responsibilities and boundaries.

### 3. CSS Tokens and Design Guidelines

Document the design system rules that apply to the task, including:

* CSS variables/tokens.
* Spacing conventions.
* Typography.
* Colors.
* Borders and radii.
* Shadows.
* Responsive behavior.
* Component styling conventions.
* Reusable UI patterns.
* Any project-specific design constraints.

The purpose of `UI.md` is to describe the **current UI architecture and design system**, not to become a raw change log.

---

# 2. Detailed Frontend Change History (`UI_changed.md`)

## When to Update

You MUST update `UI_changed.md` (e.g. `docs/Frontend_docs/UI_changed.md` or module UI-Change doc) whenever there is **ANY Frontend/UI/UX-related change**, regardless of size or importance.

This includes, but is not limited to:

* CSS changes.
* SCSS changes.
* CSS token changes.
* OWL JavaScript changes.
* OWL component changes.
* XML/QWeb template changes.
* Layout changes.
* UI behavior changes.
* UX changes.
* Responsive design changes.
* Visual design changes.
* Frontend bug fixes.
* Frontend refactoring.
* Frontend performance improvements.
* Frontend architecture changes.

Even a small Frontend/UI/UX modification MUST be recorded.

## What to Document

Record Frontend changes in **chronological order**, from oldest to newest.

Each change should explain:

1. What was changed.
2. Which files/components were affected.
3. Why the change was necessary.
4. The implementation approach.
5. Important technical details.
6. Any technical limitations or side effects.
7. Important considerations for future development.
8. Any non-obvious OWL/QWeb/CSS behavior that developers need to know.

The documentation should contain enough technical detail for another developer to understand the implementation without having to reverse-engineer the entire change from the source code.

### Important

`UI_changed.md` is the **detailed Frontend change history**.

Do NOT replace detailed technical documentation with vague summaries such as:

> "Updated the Dashboard UI."

Instead, explain what actually changed and why.

---

# 3. Master Changelog Index (`Changes.md`)

## Role

`Changes.md` is the project's:

**MASTER CHANGELOG INDEX / MASTER DOCUMENTATION HUB**

It must provide a concise overview of major project changes and direct developers to the detailed documentation.

It is NOT intended to contain the full technical history of every change.

---

## When to Update

You MUST update `Changes.md` whenever there is **ANY meaningful change anywhere in the project**, including:

* Frontend.
* UI/UX.
* OWL.
* XML/QWeb.
* Backend models.
* Python controllers.
* Business logic.
* Security.
* Access rights.
* Views.
* Database-related changes.
* APIs.
* Infrastructure.
* Configuration.
* Deployment.
* Other project-wide technical changes.

---

# 4. Changes.md Anti-Bloat Rule

This rule is CRITICAL.

`Changes.md` MUST remain concise.

Do NOT turn `Changes.md` into a massive technical log.

Do NOT copy:

* Large code blocks.
* Full implementation details.
* Long debugging logs.
* Detailed technical explanations.
* Repeated information from specialized change documents.

Instead:

1. Add a short summary of the major change.
2. Identify the affected area/module.
3. Link directly to the specialized detailed change documentation.

---

# 5. Documentation Hierarchy

The documentation system MUST follow this hierarchy:

```text
Changes.md
│
├── Frontend
│   ├── UI.md
│   └── Frontend_docs/UI_changed.md
│
├── Backend
│   └── <specialized backend change documentation>
│
├── Security
│   └── <specialized security change documentation>
│
├── Infrastructure
│   └── <specialized infrastructure change documentation>
│
└── Other Modules
    └── <corresponding specialized documentation>
```

### Responsibility of Each File

| File            | Purpose                                                |
| --------------- | ------------------------------------------------------ |
| `UI.md`         | Current Frontend/UI architecture and design guidelines |
| `UI_changed.md` | Detailed chronological Frontend/UI/UX change history   |
| `Changes.md`    | Concise master index of major project changes          |

Do NOT mix these responsibilities.

---

# 6. Mandatory Workflow

For EVERY development task, follow this workflow:

## Step 1 — Determine the Scope
Before modifying code, determine:
* Is this a new task?
* Has the Frontend/UI scope changed?
* Does this task affect Frontend/UI/UX?
* Does this task affect any other project area?

## Step 2 — Read the Relevant Documentation
Before making changes, read the documentation relevant to the task (`UI.md`, `UI_changed.md`, `Changes.md`, etc.). Do NOT blindly modify code without understanding existing documented architecture and change history.

## Step 3 — Implement the Task
Make required code changes while maintaining consistency with existing OWL/QWeb/CSS patterns, tokens, and component structure.

## Step 4 — Update Documentation
* If starting a new Frontend/UI task or changing Frontend scope: → Update `UI.md`.
* If ANY Frontend/UI/UX code or behavior changed: → Update `UI_changed.md`.
* If ANY project area changed: → Update `Changes.md`.

---

# 7. Chronological Integrity

`UI_changed.md` MUST maintain chronological order. New changes MUST be added after older changes. Do NOT rewrite history unnecessarily.

---

# 8. Documentation Quality Rules

Documentation MUST be accurate, concise where appropriate, technically meaningful, consistent with the source code, and chronologically organized. Never document something that was not actually implemented.

---

# 9. No Documentation Skipping

You MUST NOT skip documentation updates for "small changes", "just CSS/XML/UI", or quick bug fixes. If the change falls within scope, documentation is mandatory.

---

# 10. Final Verification Before Completing a Task

Before declaring any development task complete, perform a documentation check:
* **Frontend/UI Scope Check**: Scope changed? → `UI.md` updated.
* **Frontend Change Check**: UI/UX/CSS/JS changed? → `UI_changed.md` updated.
* **Project Change Check**: Backend/DB/API/Config changed? → `Changes.md` updated.

If any required update is missing, **DO NOT consider the task complete**.

---

# 11. Priority Rule

```text
Implementation + Required Documentation = Complete Task
```
Treat this policy as a **persistent development rule** applied automatically to all future tasks.

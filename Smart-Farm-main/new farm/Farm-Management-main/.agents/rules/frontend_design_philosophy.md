# FRONTEND DESIGN & CODING PHILOSOPHY

## Native-First, Lightweight & Efficient

### CRITICAL — MANDATORY RULE

This is a **mandatory Frontend engineering rule**.

Apply it to all Frontend work, especially:

* Odoo Views / XML / QWeb
* OWL components
* JavaScript / TypeScript
* HTML
* CSS / SCSS
* Bootstrap
* UI/UX implementation

The core philosophy is:

> **Use native capabilities first. Keep the implementation as simple, lightweight, consistent, maintainable, and efficient as possible.**

---

## 1. NATIVE FIRST, CUSTOM LAST

Before writing custom CSS, JavaScript, OWL logic, or complex XML, always check:

1. Does Odoo already provide this?
2. Does OWL/QWeb already provide this?
3. Does Bootstrap already provide this?
4. Can native HTML/CSS solve it?
5. Does the existing project already have a reusable solution?
6. Can an existing design token solve it?

Only introduce custom code when existing capabilities cannot adequately solve the requirement.

Priority:

```text
Native Framework
→ Existing Project Components/Utilities
→ Bootstrap Utilities
→ Design Tokens
→ Small Custom CSS/JS
→ Complex Custom Implementation
```

---

## 2. USE BOOTSTRAP BEFORE CUSTOM CSS

When Bootstrap utilities can achieve the required result, use them instead of creating custom CSS.

Prefer utilities such as:

```text
d-flex, align-items-center, justify-content-between
gap-2, p-3, m-0
rounded-3, border, shadow-sm
bg-white, bg-primary
text-primary, text-muted
fw-bold, badge
w-100, h-100
```

Do NOT create custom classes for functionality that Bootstrap already provides.

For example, prefer:

```xml
<div class="d-flex align-items-center gap-2 p-3 rounded-3 shadow-sm">
```

instead of creating CSS that reproduces the same properties.

---

## 3. USE DESIGN TOKENS INSTEAD OF REPEATED OVERRIDES

When a requirement affects a global design property, change the appropriate design token instead of creating many component-specific overrides.

For example, for a global Bootstrap primary color:

```css
:root,
[data-bs-theme="light"] {
    --bs-primary: #e66c0c;
    --bs-primary-rgb: 230, 108, 12;
}
```

This allows:

```text
.text-primary
.bg-primary
.border-primary
.btn-primary
```

to automatically follow the theme.

General rule:

> **Change the source of truth before overriding its consumers.**

---

## 4. MINIMIZE CUSTOM CSS AND INLINE STYLES

Custom CSS is allowed when genuinely necessary, but every custom rule must have a clear purpose.

Prefer:

```text
Bootstrap utility
→ Existing project utility/token
→ Small reusable CSS rule
→ Inline style only when truly necessary
```

Inline styles should be avoided unless the value is highly specific, dynamic, one-off, or difficult to represent with existing utilities.

Do NOT create custom CSS for simple things such as:

* Flexbox alignment.
* Spacing.
* Basic colors.
* Basic borders.
* Basic radius.
* Basic shadows.
* Standard sizing.

when Bootstrap already provides the required utility.

---

## 5. KEEP XML/QWEB AND DOM STRUCTURE SIMPLE

Keep templates and HTML as flat and clean as reasonably possible.

Avoid unnecessary:

* `<div>` wrappers.
* Nested containers.
* Styling-only elements.
* Empty elements.
* Positioning layers.

Every wrapper should have a meaningful structural, semantic, or behavioral purpose.

Prefer:

```text
Flexbox
Grid
Bootstrap utilities
Normal document flow
Gap
Margin / Padding
```

before using:

```text
position: absolute
z-index
negative margins
manual offsets
```

These techniques are valid, but should only be used when genuinely required.

---

## 6. KEEP OWL / JAVASCRIPT LEAN

Do not use OWL or JavaScript to solve problems that HTML/CSS can already solve.

Avoid unnecessary:

* State.
* Lifecycle hooks.
* Event handlers.
* DOM manipulation.
* Helper functions.
* Component layers.
* Reactive variables.

Use OWL/JavaScript when actual application behavior or logic requires it.

---

## 7. REUSE BEFORE RECREATE

Before creating a new component, class, utility, helper, or pattern, inspect the existing project.

Ask:

> **"Does this already exist?"**

Reuse existing:

* OWL components.
* QWeb templates.
* CSS classes.
* Bootstrap utilities.
* Design tokens.
* Helpers.
* Shared UI patterns.

Do not create multiple implementations of the same UI concept without a real reason.

---

## 8. DO NOT OVER-ENGINEER

Prefer the **simplest correct solution**.

Avoid:

* Premature abstractions.
* Unnecessary componentization.
* Future-proof code without a current requirement.
* Unused CSS/classes/variables.
* Excessive configuration.
* Complex solutions for simple problems.

> **Solve the actual problem, not imaginary future problems.**

---

## 9. CONSISTENCY, SEMANTICS AND PERFORMANCE

Follow existing project conventions instead of introducing personal styling preferences.

Maintain:

* Semantic HTML.
* Accessibility.
* Keyboard usability.
* Consistent design tokens.
* Consistent spacing, typography, radius, shadows, etc.
* Minimal DOM.
* Minimal JavaScript.
* Minimal unnecessary reactivity.

"Lightweight" does NOT mean sacrificing accessibility, semantics, or correctness.

---

## 10. FINAL CHECK BEFORE COMPLETING FRONTEND WORK

Before considering a Frontend task complete, verify:

```text
□ Can any custom code be replaced by a native capability?
□ Can any custom CSS be replaced by Bootstrap?
□ Can any repeated CSS be replaced by a design token?
□ Can any existing component/utility be reused?
□ Are there unnecessary wrappers?
□ Are inline styles really necessary?
□ Is OWL/JS doing something CSS/HTML could do?
□ Is there unnecessary state or complexity?
□ Is the implementation consistent with the existing project?
□ Is the final code as simple as possible without sacrificing correctness?
```

### Core Principle

> **Native first. Reuse second. Custom last.**

> **Write only the code necessary to solve the problem correctly.**

The goal is:

```text
Minimal Code
+
Native Capabilities
+
Clean Structure
+
Consistency
+
Correctness
+
Performance
=
High-Quality Frontend
```

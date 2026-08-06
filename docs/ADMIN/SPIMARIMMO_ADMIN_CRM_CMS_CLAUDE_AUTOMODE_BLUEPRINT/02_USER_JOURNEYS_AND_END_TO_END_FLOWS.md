# 02 — USER JOURNEYS AND END-TO-END FLOWS

## 1. Staff journey: invitation to productive session

```mermaid
flowchart TD
    INVITE[Invitation email] --> ACCEPT[Accept invitation]
    ACCEPT --> PASSWORD[Create password]
    PASSWORD --> MFA[Configure MFA if required]
    MFA --> PROFILE[Complete profile]
    PROFILE --> ROLE[Review workspace and permissions]
    ROLE --> HOME[Admin overview]
    HOME --> TOUR[Contextual first-run tour]
    TOUR --> FIRST[First useful action]
```

### Screens

1. Invitation
2. Create password
3. Email verification
4. MFA
5. Profile setup
6. Workspace selection
7. Permission summary
8. Admin overview
9. First-run checklist

### Success condition

A new user understands:

- which site they are working on
- their role
- what they can edit
- what they cannot publish
- where their assigned work appears

---

## 2. Daily sales-agent journey

```mermaid
flowchart LR
    LOGIN[Login] --> MYDAY[My day]
    MYDAY --> TASKS[Due tasks]
    TASKS --> LEAD[Open lead]
    LEAD --> CONTEXT[Review source and event]
    CONTEXT --> ACTION[Call / email / meeting]
    ACTION --> NOTE[Log outcome]
    NOTE --> STAGE[Update stage]
    STAGE --> NEXT[Create next action]
```

### Required UX

- “My day” view
- overdue tasks
- newly assigned leads
- next appointments
- quick call/email actions
- timeline
- stage control
- next action control
- no need to leave the lead page for basic work

---

## 3. Public exhibitor enquiry journey

This is the primary B2B funnel.

```mermaid
flowchart TD
    LAND[Public page] --> VALUE[Understand value]
    VALUE --> PROOF[Review events and proof]
    PROOF --> OFFER[Compare offer or choose custom request]
    OFFER --> FORM[Exhibitor form]
    FORM --> VALIDATE[Validate + consent]
    VALIDATE --> SUBMISSION[Durable submission]
    SUBMISSION --> DEDUPE[Contact and organization dedupe]
    DEDUPE --> LEAD[Create or update lead]
    LEAD --> ASSIGN[Assign queue or owner]
    ASSIGN --> CONFIRM[Confirmation]
    CONFIRM --> FOLLOWUP[Sales follow-up]
    FOLLOWUP --> MEETING[Meeting]
    MEETING --> PROPOSAL[Proposal]
    PROPOSAL --> WON[Won]
    WON --> ONBOARD[Exhibitor onboarding]
```

### Public form fields

Minimum useful data:

- name
- organization
- job title
- phone
- email
- event of interest
- offer level or custom request
- message
- consent

### CRM result

- organization
- contact
- lead
- acquisition kind
- event interest
- campaign attribution
- consent record
- form submission
- assignment
- initial activity
- follow-up task

---

## 4. Brochure request journey

Brochure download is a progressive conversion, not a dead-end download.

```mermaid
flowchart LR
    RESOURCE[Resource page] --> FORM[Short form]
    FORM --> SUBMISSION[Submission]
    SUBMISSION --> LEAD[Lead created or linked]
    LEAD --> DELIVERY[Versioned resource delivery]
    DELIVERY --> NURTURE[Nurture sequence]
    NURTURE --> HIGHINTENT[Exhibitor enquiry or appointment]
```

### Important rules

- The resource has a presentation page before download.
- The exact resource version is recorded.
- Delivery state is visible.
- A failed delivery must not be shown as successful.
- Download context includes event, campaign, route and locale.
- Nurture must respect consent.

---

## 5. Appointment booking journey

```mermaid
flowchart TD
    CTA[Book a meeting] --> QUALIFY[Qualification form]
    QUALIFY --> SLOTS[Available slots]
    SLOTS --> SELECT[Select slot]
    SELECT --> PROVIDER[Provider booking]
    PROVIDER -->|Accepted| BOOKED[Booked]
    PROVIDER -->|Retryable| PENDING[Pending / retry]
    PROVIDER -->|Terminal| FAILED[Booking failed]
    BOOKED --> CONFIRM[Email confirmation]
    BOOKED --> CRM[CRM appointment + task]
```

### UX requirement

The acknowledgement must distinguish:

- request received
- provider pending
- booked
- provider failed
- cancelled
- expired

A “request received” screen must never falsely imply that the calendar booking succeeded.

---

## 6. Visitor registration journey

The visitor path is secondary to the homepage but strategically useful.

```mermaid
flowchart LR
    FIND[Find event] --> UNDERSTAND[Date, venue, program]
    UNDERSTAND --> DISCOVER[Exhibitors and conferences]
    DISCOVER --> REGISTER[Registration]
    REGISTER --> CONSENT[Consent and preferences]
    CONSENT --> PREPARE[Reminders and appointments]
    PREPARE --> ATTEND[Attendance]
    ATTEND --> FOLLOWUP[Post-event follow-up]
```

### Useful data, with explicit consent

- residence country and city
- project type
- purchase horizon
- indicative budget
- geographic interest
- appointment preference

### CRM handling

Visitor records should be distinguishable from exhibitor leads while still supporting event reporting and exhibitor lead delivery.

---

## 7. Lead qualification journey

```mermaid
stateDiagram-v2
    [*] --> New
    New --> Deduplicated
    Deduplicated --> MarketingQualified
    MarketingQualified --> SalesReview
    SalesReview --> SalesQualified
    SalesQualified --> MeetingScheduled
    MeetingScheduled --> MeetingCompleted
    MeetingCompleted --> ProposalRequested
    ProposalRequested --> ProposalSent
    ProposalSent --> Negotiation
    Negotiation --> Won
    Negotiation --> Lost
    SalesReview --> Nurture
    Won --> ExhibitorOnboarding
```

### Required controls

- stage
- owner
- event
- organization
- acquisition source
- campaign
- next action
- value
- lost reason
- timeline
- audit history

### Guardrails

- lost requires a reason
- won requires a confirmed date
- every stage change creates history
- assigned users only see permitted records
- duplicate contacts link to one identity rather than silently creating new ones

---

## 8. Won lead to exhibitor onboarding

The current lead stage includes `exhibitor_onboarding`. The product should make this a real operational workspace.

```mermaid
flowchart TD
    WON[Opportunity won] --> EXHIBITOR[Create exhibitor profile]
    EXHIBITOR --> PACKAGE[Confirm package]
    PACKAGE --> CONTRACT[Contract and payment status]
    CONTRACT --> ASSETS[Collect logo and media]
    ASSETS --> PROFILE[Public exhibitor profile]
    PROFILE --> APPOINTMENTS[Meeting preparation]
    APPOINTMENTS --> EVENT[Event participation]
    EVENT --> LEADS[Lead delivery]
    LEADS --> REPORT[Performance report]
    REPORT --> CASE[Case study candidate]
```

### Onboarding checklist

- legal entity confirmed
- contact owners confirmed
- package confirmed
- contractual documents
- payment state
- logo and rights
- profile copy
- translations
- booth details
- campaign assets
- appointment availability
- event contacts
- post-event reporting owner

---

## 9. CMS page publishing journey

```mermaid
flowchart LR
    CREATE[Create page] --> STRUCTURE[Choose template and sections]
    STRUCTURE --> CONTENT[Edit content]
    CONTENT --> MEDIA[Attach governed media]
    MEDIA --> LOCALES[Complete translations]
    LOCALES --> SEO[Complete SEO]
    SEO --> REVIEW[Submit for review]
    REVIEW --> APPROVE[Approve]
    APPROVE --> SCHEDULE[Schedule or publish]
    SCHEDULE --> LIVE[Public]
    LIVE --> REVISION[Revision history]
```

### Publication states

- Draft
- In review
- Changes requested
- Approved
- Scheduled
- Published
- Expired
- Withdrawn
- Archived

### Mandatory checks

- route and slug valid
- required locales complete
- SEO complete
- linked media rights valid
- metrics verified
- event data validated
- no unapproved package price
- preview passes

---

## 10. Event lifecycle journey

Event lifecycle and public availability are related but independent.

```mermaid
flowchart TD
    DRAFT[Draft] --> UNDATED[Announced, undated]
    UNDATED --> SCHEDULED[Scheduled]
    SCHEDULED --> LIVE[Live]
    LIVE --> COMPLETED[Completed]
    COMPLETED --> ARCHIVED[Archived]
    SCHEDULED --> POSTPONED[Postponed]
    SCHEDULED --> CANCELLED[Cancelled]
```

Separate controls:

- event lifecycle
- exhibitor sales status
- visitor registration status
- publication state

The admin must never derive one from another.

---

## 11. Evidence governance journey

Metrics, testimonials, partners, package prices and case-study claims require evidence.

```mermaid
flowchart LR
    MISSING[Missing] --> SUBMITTED[Submitted]
    SUBMITTED --> VERIFIED[Verified]
    SUBMITTED --> REJECTED[Rejected]
    REJECTED --> SUBMITTED
    VERIFIED --> PUBLISH[Eligible for publication]
```

### Evidence record must include

- definition
- period
- source label
- source URL or internal source
- approver
- approval date
- event or case-study relation

This directly enforces the public strategy: proof before promise.

---

## 12. Translation journey

```mermaid
flowchart LR
    SOURCE[Source content] --> MISSING[Missing translation]
    MISSING --> DRAFT[Draft]
    DRAFT --> REVIEW[In review]
    REVIEW --> APPROVED[Approved]
    APPROVED --> PUBLISHED[Published]
```

Arabic requires:

- RTL preview
- mirrored directional layout where appropriate
- locale-specific typography testing
- independent SEO values
- no assumption that text length matches French or English

---

## 13. Consent withdrawal and retention journey

```mermaid
flowchart TD
    REQUEST[Withdrawal request] --> VERIFY[Verify opaque reference or identity]
    VERIFY --> WITHDRAW[Record withdrawal]
    WITHDRAW --> SUPPRESS[Propagate suppression]
    SUPPRESS --> RETENTION[Apply retention policy]
    RETENTION --> ANON[Anonymize when due]
    ANON --> AUDIT[Retain non-PII audit evidence]
```

The admin should provide:

- consent history
- withdrawal status
- retention deadline
- anonymization state
- suppression propagation state

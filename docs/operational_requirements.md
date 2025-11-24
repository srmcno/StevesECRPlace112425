# Operational Requirements

## User Roles and Key Actions
- **Requester**: Submit new requests, edit their own drafts, view status updates, respond to information requests.
- **Approver**: Review submitted requests, approve or reject with comments, reassign to another approver when needed, and close items they have approved.
- **Coordinator/Service Desk**: Triage incoming requests, validate details, assign owners/approvers, update metadata (priority, category, SLA clock), and close duplicate or invalid items.
- **Owner/Assignee**: Work requests assigned to them, update progress notes, propose closure, and request re-approval if scope changes.
- **Administrator**: Manage role membership, SLA rules, notification templates, integration credentials, and retention settings.

## SLA Validation
- **Acknowledgement SLA**: Confirm receipt and initial triage within 1 business day of submission.
- **Approval SLA**: Complete approval or rejection within 2 business days after the request is marked "Ready for review."
- **Fulfillment SLA**: Complete assigned work and close within the target based on priority (e.g., P1: 3 business days, P2: 5 business days, P3: 10 business days).
- **Reapproval SLA**: If material changes occur, route for reapproval within 1 business day of the change request.
- Track SLA timers by status transitions; pause during "Waiting on requester" and resume when information is provided.

## Notification Rules
- Send submission confirmation to the requester with request ID and SLA expectations.
- Notify the coordinator queue when a new request arrives or is returned for rework.
- Alert assigned owner/approver on assignment and when due dates or SLA thresholds are approaching (e.g., 24 hours before breach).
- Send decision notifications (approve/reject) to the requester and coordinator, including comments.
- On closure, send a summary to requester and stakeholders with resolution notes and final timestamps.
- Support channel-specific delivery: Outlook email (always) plus Teams posts for team visibility.

## Data Retention
- Store request records, comments, approval history, and attachments for at least 3 years for auditability.
- Maintain an immutable log of status changes and SLA timestamps for the full retention period.
- Archive closed requests after 90 days of inactivity; allow retrieval from archive within 24 hours.
- Purge personally identifiable information (PII) fields on purge/expiry while retaining aggregate metrics.

## Required Integrations
- **Outlook Email**: Mandatory for transactional notifications (submission, assignments, SLA warnings, approvals, closures) and replies-to-comments where supported.
- **Microsoft Teams**: Post to a designated channel for new submissions, assignments, approvals/rejections, and closures; allow deep links back to the request.
- **Planner/To Do Sync**: Create or update tasks when requests are assigned; maintain status, due dates, and comments in sync so owners can manage work from Planner/To Do.

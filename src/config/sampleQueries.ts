import type { SampleQuery } from '../types';

/**
 * Sample queries that populate the sidebar.
 * ─────────────────────────────────────────
 * ★ This is the PRIMARY file to customize when forking NaApiE. ★
 *
 * Each entry describes a pre-built request users can click to populate
 * the query bar and body editor. Group them by `category` for the sidebar.
 */
const sampleQueries: SampleQuery[] = [
  // ── User ──────────────────────────────────
  {
    id: 'get-me',
    category: 'User',
    name: 'Get my profile',
    method: 'GET',
    path: '/me',
    description: 'Retrieve the signed-in user profile.',
  },
  {
    id: 'get-me-photo',
    category: 'User',
    name: 'Get my photo',
    method: 'GET',
    path: '/me/photo/$value',
    description: 'Retrieve the signed-in user profile photo.',
  },

  // ── Groups ────────────────────────────────
  {
    id: 'list-groups',
    category: 'Groups',
    name: 'List my groups',
    method: 'GET',
    path: '/me/memberOf',
    description: 'List groups the signed-in user is a member of.',
  },

  // ── Mail ──────────────────────────────────
  {
    id: 'list-messages',
    category: 'Mail',
    name: 'List messages',
    method: 'GET',
    path: '/me/messages?$top=10',
    description: 'List the 10 most recent email messages.',
  },
  {
    id: 'send-mail',
    category: 'Mail',
    name: 'Send mail',
    method: 'POST',
    path: '/me/sendMail',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      {
        message: {
          subject: 'Hello from NaApiE',
          body: { contentType: 'Text', content: 'Sent via API Explorer!' },
          toRecipients: [{ emailAddress: { address: 'user@example.com' } }],
        },
      },
      null,
      2,
    ),
    description: 'Send an email message on behalf of the signed-in user.',
  },
];

export default sampleQueries;

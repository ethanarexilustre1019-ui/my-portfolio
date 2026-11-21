export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormPayload, string>>;
}

export function validateContactForm(payload: ContactFormPayload): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormPayload, string>> = {};

  if (!payload.name.trim() || payload.name.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.email.trim() || !emailRegex.test(payload.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!payload.subject.trim() || payload.subject.trim().length < 3) {
    errors.subject = 'Please enter a concise subject (at least 3 characters).';
  }

  if (!payload.message.trim() || payload.message.trim().length < 12) {
    errors.message = 'Please describe your project, challenge, or inquiry (at least 12 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface ContactSubmissionResult {
  ok: boolean;
  mode: 'serverless' | 'mailto-ready';
  message: string;
  mailtoUrl: string;
}

/**
 * Submits the contact form payload to a configured serverless endpoint if VITE_CONTACT_ENDPOINT
 * is set in environment variables (keeping API secrets server-side), or prepares an instant
 * verified direct dispatch link to ethanilustre@yahoo.com.
 */
export async function submitContactMessage(
  payload: ContactFormPayload,
  recipientEmail: string
): Promise<ContactSubmissionResult> {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

  const subjectEncoded = encodeURIComponent(`[Portfolio Inquiry] ${payload.subject.trim()}`);
  const bodyEncoded = encodeURIComponent(
    `Hello Ethan,\n\n${payload.message.trim()}\n\n---\nFrom: ${payload.name.trim()}\nReply-To: ${payload.email.trim()}`
  );
  const mailtoUrl = `mailto:${recipientEmail}?subject=${subjectEncoded}&body=${bodyEncoded}`;

  if (endpoint && endpoint.trim().length > 0) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim(),
        subject: payload.subject.trim(),
        message: payload.message.trim(),
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Endpoint returned status ${response.status}`);
    }

    return {
      ok: true,
      mode: 'serverless',
      message: 'Transmission delivered to Ethan Arex V. Ilustre via serverless endpoint.',
      mailtoUrl,
    };
  }

  // Simulate brief cryptographic packet handshake for immediate tactile feedback
  await new Promise((resolve) => setTimeout(resolve, 450));

  return {
    ok: true,
    mode: 'mailto-ready',
    message: `Message validated and formatted for ${recipientEmail}. Click "Open Direct Email Client" below or copy the formatted payload.`,
    mailtoUrl,
  };
}

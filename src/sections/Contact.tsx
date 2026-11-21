import React, { useState } from 'react';
import {
  Mail,
  Github,
  Linkedin,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { ownerProfile } from '../data/profile';
import {
  ContactFormPayload,
  submitContactMessage,
  validateContactForm,
} from '../services/contactService';
import { audioService } from '../services/audioService';

export const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormPayload>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormPayload, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<{
    ok: boolean;
    message: string;
    mailtoUrl?: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormPayload]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playClick();

    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      setSubmitResult(null);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      const res = await submitContactMessage(form, ownerProfile.email);
      setSubmitResult({
        ok: res.ok,
        message: res.message,
        mailtoUrl: res.mailtoUrl,
      });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitResult({
        ok: false,
        message: `Direct endpoint unavailable. You can email Ethan directly at ${ownerProfile.email}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-label="Contact Ethan Arex V. Ilustre"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div data-gsap-reveal className="mb-12">
          <p className="font-mono text-xs sm:text-sm font-semibold text-[#00E676] tracking-wider uppercase mb-2">
            07. CONTACT
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
            HAVE A PROBLEM?{' '}
            <span className="text-[#00E676] text-glow-emerald">LET&rsquo;S BUILD A SOLUTION.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#D5E2DC] mt-3 max-w-2xl leading-relaxed">
            I am always interested in exploring ideas, collaborating on projects, and building
            technology that solves meaningful problems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels (5 cols) */}
          <div data-gsap-reveal className="lg:col-span-5 space-y-5">
            <div className="hud-panel p-6 sm:p-7 space-y-4">
              <h3 className="font-display text-lg font-bold text-white border-b border-white/10 pb-3">
                Direct Contact Channels
              </h3>

              {/* Email */}
              <a
                href={`mailto:${ownerProfile.email}`}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-[#050807]/85 border border-white/10 hover:border-[#00E676] transition-all group"
              >
                <Mail className="w-5 h-5 text-[#00E676] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#00E676]">Email</p>
                  <p className="font-display font-bold text-base text-white group-hover:text-[#00E676] transition-colors break-all">
                    {ownerProfile.email}
                  </p>
                </div>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/ethanarexilustre1019-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 p-4 rounded-xl bg-[#050807]/85 border border-white/10 hover:border-[#00E676] transition-all group"
              >
                <Github className="w-5 h-5 text-[#00E676] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#00E676]">GitHub</p>
                  <p className="font-display font-bold text-base text-white group-hover:text-[#00E676] transition-colors">
                    github.com/ethanarexilustre1019-ui
                  </p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 p-4 rounded-xl bg-[#050807]/85 border border-white/10 hover:border-[#72B8FF] transition-all group"
              >
                <Linkedin className="w-5 h-5 text-[#72B8FF] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#72B8FF]">LinkedIn</p>
                  <p className="font-display font-bold text-base text-white group-hover:text-[#72B8FF] transition-colors">
                    in/ethan-arex-ilustre-6501ba2bb
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#050807]/85 border border-white/10">
                <MapPin className="w-5 h-5 text-[#00E676] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#00E676]">University &amp; Location</p>
                  <p className="font-display font-bold text-base text-white">
                    {ownerProfile.university}
                  </p>
                  <p className="text-sm text-[#D5E2DC]">{ownerProfile.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Contact Form (7 cols) */}
          <div data-gsap-reveal className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="hud-panel p-6 sm:p-8 space-y-5"
              aria-label="Portfolio Contact Form"
            >
              <div className="border-b border-white/10 pb-3">
                <h3 className="font-display text-xl font-bold text-white">Send a Message</h3>
                <p className="text-sm text-[#D5E2DC] mt-0.5">
                  Fill out the form below to discuss a project, internship, or collaboration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-[#D5E2DC] mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Alex Rivera"
                    className="w-full px-4 py-3 rounded-lg bg-[#050807] border border-white/15 focus:border-[#00E676] focus:outline-none text-base text-white placeholder:text-white/35"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-[#D5E2DC] mb-2"
                  >
                    Your Email *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#050807] border border-white/15 focus:border-[#00E676] focus:outline-none text-base text-white placeholder:text-white/35"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-medium text-[#D5E2DC] mb-2"
                >
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project Collaboration / Internship Inquiry / Problem to Solve"
                  className="w-full px-4 py-3 rounded-lg bg-[#050807] border border-white/15 focus:border-[#00E676] focus:outline-none text-base text-white placeholder:text-white/35"
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.subject}</span>
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-[#D5E2DC] mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe the challenge, project idea, or opportunity..."
                  className="w-full px-4 py-3 rounded-lg bg-[#050807] border border-white/15 focus:border-[#00E676] focus:outline-none text-base text-white placeholder:text-white/35 resize-y"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Feedback Alert */}
              {submitResult && (
                <div
                  role="status"
                  className={`p-4 rounded-xl border text-sm ${
                    submitResult.ok
                      ? 'bg-[#00E676]/10 border-[#00E676]/50 text-white'
                      : 'bg-red-500/10 border-red-400/50 text-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {submitResult.ok ? (
                      <CheckCircle2 className="w-5 h-5 text-[#00E676] shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-2.5">
                      <p>{submitResult.message}</p>
                      {submitResult.mailtoUrl && (
                        <a
                          href={submitResult.mailtoUrl}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00E676] text-[#050807] font-display text-xs font-bold"
                        >
                          <span>Open Direct Email Client</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto hud-button-primary px-8 py-3.5 text-sm sm:text-base cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

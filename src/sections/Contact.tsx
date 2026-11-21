import React, { useState } from 'react';
import {
  Mail,
  Github,
  Linkedin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
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
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormPayload, string>>
  >({});
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
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Next-Sheet Conversion Banner (Echoing ralfmangubos.com "NEXT SHEET -> 06 CONTACT") */}
        <div
          data-gsap-reveal
          className="mb-14 p-6 sm:p-8 bg-[#070c0a]/88 border border-white/12 rounded-[4px] backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <p className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#00E676] tracking-[0.22em] uppercase mb-1.5">
              NEXT SHEET &rarr; 07 CONTACT
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight leading-[0.94] text-[#F4F7F5]">
              HAVE A PROJECT IN MIND?{' '}
              <span className="text-[#00E676]">LET&rsquo;S BUILD IT.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href={`mailto:${ownerProfile.email}`}
              className="hud-button-emerald px-5 py-3 text-sm"
            >
              <span>Email me directly</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={ownerProfile.resumePath}
              download="Ethan-Arex-Ilustre-Resume.pdf"
              className="text-sm font-semibold text-[#F4F7F5] hover:text-[#00E676] transition-colors"
            >
              Download Resume
            </a>
          </div>
        </div>

        {/* Split Contact Workspace: Availability Metadata Left, Hairline Form Card Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Metadata & Direct Links (5 cols) */}
          <div data-gsap-reveal className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight leading-[0.96] text-white mb-3">
                LET&rsquo;S BUILD SOMETHING THAT HOLDS.
              </h3>
              <p className="text-sm sm:text-base text-[#C5D3CC] leading-relaxed">
                Open to software development collaborations, internships, web
                application builds, and problem-solving projects.
              </p>
            </div>

            {/* Availability Spec Rows */}
            <div className="border-y border-white/12 divide-y divide-white/10 font-mono text-xs">
              <div className="py-3.5 flex items-center justify-between gap-4">
                <span className="text-[#8FA198] tracking-[0.16em] uppercase">
                  DIRECT EMAIL
                </span>
                <a
                  href={`mailto:${ownerProfile.email}`}
                  className="text-[#00E676] hover:underline break-all text-right"
                >
                  {ownerProfile.email}
                </a>
              </div>
              <div className="py-3.5 flex items-center justify-between gap-4">
                <span className="text-[#8FA198] tracking-[0.16em] uppercase">
                  TIMEZONE
                </span>
                <span className="text-white text-right">
                  GMT+8 (PHILIPPINES) &bull; ASYNC-FRIENDLY
                </span>
              </div>
              <div className="py-3.5 flex items-center justify-between gap-4">
                <span className="text-[#8FA198] tracking-[0.16em] uppercase">
                  INSTITUTION
                </span>
                <span className="text-white text-right">
                  UNO-R &bull; BSIT THIRD YEAR
                </span>
              </div>
            </div>

            {/* Direct Social Links */}
            <div className="space-y-2.5">
              <a
                href="https://github.com/ethanarexilustre1019-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-[3px] bg-[#070c0a]/85 border border-white/12 hover:border-[#00E676] transition-colors group"
              >
                <span className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-[#00E676]" />
                  <span className="text-sm font-medium text-white group-hover:text-[#00E676]">
                    github.com/ethanarexilustre1019-ui
                  </span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8FA198]" />
              </a>

              <a
                href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-[3px] bg-[#070c0a]/85 border border-white/12 hover:border-[#00E676] transition-colors group"
              >
                <span className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-[#72B8FF]" />
                  <span className="text-sm font-medium text-white group-hover:text-[#00E676]">
                    in/ethan-arex-ilustre-6501ba2bb
                  </span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8FA198]" />
              </a>

              <a
                href={`mailto:${ownerProfile.email}`}
                className="flex items-center justify-between p-3.5 rounded-[3px] bg-[#070c0a]/85 border border-white/12 hover:border-[#00E676] transition-colors group"
              >
                <span className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#00E676]" />
                  <span className="text-sm font-medium text-white group-hover:text-[#00E676]">
                    {ownerProfile.email}
                  </span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8FA198]" />
              </a>
            </div>
          </div>

          {/* Right Column: Hairline Bordered Contact Form (7 cols) */}
          <div data-gsap-reveal className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="hud-panel p-6 sm:p-8 space-y-5"
              aria-label="Portfolio Contact Form"
            >
              <div className="border-b border-white/10 pb-3.5">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#00E676] mb-1">
                  PROJECT INQUIRY FORM
                </p>
                <h3 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
                  SEND A MESSAGE
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#C5D3CC] mb-2"
                  >
                    Your name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Alex Rivera"
                    className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#050807] border border-white/15 focus:border-[#00E676] focus:outline-none text-sm text-white placeholder:text-white/30"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#C5D3CC] mb-2"
                  >
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#050807] border border-white/15 focus:border-[#00E676] focus:outline-none text-sm text-white placeholder:text-white/30"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#C5D3CC] mb-2"
                >
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Web App Build / Internship / Technical Collaboration"
                  className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#050807] border border-white/15 focus:border-[#00E676] focus:outline-none text-sm text-white placeholder:text-white/30"
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.subject}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#C5D3CC] mb-2"
                >
                  Tell me about your project *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe the problem, timeline, or project goals..."
                  className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#050807] border border-white/15 focus:border-[#00E676] focus:outline-none text-sm text-white placeholder:text-white/30 resize-y"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {submitResult && (
                <div
                  role="status"
                  className={`p-4 rounded-[3px] border text-sm ${
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
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[3px] bg-[#00E676] text-[#050807] font-mono text-xs font-bold uppercase"
                        >
                          <span>Open Email Client</span>
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
                className="w-full sm:w-auto hud-button-primary px-7 py-3.5 text-sm cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send message'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

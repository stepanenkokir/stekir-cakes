import {
  AtSign,
  Clock,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
} from "lucide-react";
import {
  BAKERY_HOURS,
  contactChannels,
} from "@/lib/data/contact";

const channelIcons = {
  phone: Phone,
  email: Mail,
  instagram: AtSign,
  sms: MessageSquare,
  whatsapp: MessageCircle,
} as const;

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-text">Reach Us</h2>
        <p className="mt-2 text-text-muted">
          Questions about a custom design, wedding cake, or delivery? We would love to hear from
          you.
        </p>

        <ul className="mt-6 space-y-4">
          {contactChannels.map(({ id, label, value, href, description }) => {
            const Icon = channelIcons[id];
            const isExternal = href.startsWith("http");

            return (
              <li key={id}>
                <a
                  href={href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-bg"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg text-primary transition-colors group-hover:bg-surface">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-text-muted">
                      {label}
                    </span>
                    <span className="mt-0.5 block font-medium text-text group-hover:text-primary-dark">
                      {value}
                    </span>
                    <span className="mt-1 block text-sm text-text-muted">{description}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg text-primary">
            <Clock className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="font-display text-xl font-semibold text-text">Business Hours</h2>
        </div>

        <ul className="mt-5 space-y-3">
          {BAKERY_HOURS.map(({ days, hours }) => (
            <li
              key={days}
              className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
            >
              <span className="font-medium text-text">{days}</span>
              <span className="text-text-muted">{hours}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm leading-relaxed text-text-muted">
          Orders are baked fresh to your schedule — please allow at least 3 days notice for standard
          cakes.
        </p>
      </div>
    </div>
  );
}

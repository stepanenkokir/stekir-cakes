import {
  AtSign,
  Clock,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { BAKERY_PHONE, BAKERY_PHONE_DISPLAY } from "@/lib/constants";
import {
  BAKERY_EMAIL,
  BAKERY_INSTAGRAM_HANDLE,
  BAKERY_INSTAGRAM_URL,
} from "@/lib/data/contact";
import { getMessages } from "@/lib/i18n/messages";

const channelIcons = {
  phone: Phone,
  email: Mail,
  instagram: AtSign,
  sms: MessageSquare,
  whatsapp: MessageCircle,
} as const;

export async function ContactInfo() {
  const locale = await getLocale();
  const t = await getTranslations("contact");
  const contact = getMessages(locale).contact;
  const hours = contact.hours;
  const channels = [
    {
      id: "phone" as const,
      label: contact.channels.phone.label,
      value: BAKERY_PHONE_DISPLAY,
      href: `tel:${BAKERY_PHONE}`,
      description: contact.channels.phone.description,
    },
    {
      id: "email" as const,
      label: contact.channels.email.label,
      value: BAKERY_EMAIL,
      href: `mailto:${BAKERY_EMAIL}`,
      description: contact.channels.email.description,
    },
    {
      id: "instagram" as const,
      label: contact.channels.instagram.label,
      value: BAKERY_INSTAGRAM_HANDLE,
      href: BAKERY_INSTAGRAM_URL,
      description: contact.channels.instagram.description,
    },
    {
      id: "sms" as const,
      label: contact.channels.sms.label,
      value: contact.channels.sms.value,
      href: `sms:${BAKERY_PHONE}`,
      description: contact.channels.sms.description,
    },
    {
      id: "whatsapp" as const,
      label: contact.channels.whatsapp.label,
      value: contact.channels.whatsapp.value,
      href: `https://wa.me/${BAKERY_PHONE.replace("+", "")}`,
      description: contact.channels.whatsapp.description,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-text">{t("reachUs")}</h2>
        <p className="mt-2 text-text-muted">{t("reachIntro")}</p>

        <ul className="mt-6 space-y-4">
          {channels.map(({ id, label, value, href, description }) => {
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
          <h2 className="font-display text-xl font-semibold text-text">{t("businessHours")}</h2>
        </div>

        <ul className="mt-5 space-y-3">
          {hours.map(({ days, hours: time }) => (
            <li
              key={days}
              className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
            >
              <span className="font-medium text-text">{days}</span>
              <span className="text-text-muted">{time}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm leading-relaxed text-text-muted">{t("hoursNote")}</p>
      </div>
    </div>
  );
}

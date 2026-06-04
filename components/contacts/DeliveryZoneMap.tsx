import { getLocale, getTranslations } from "next-intl/server";
import {
  DELIVERY_CENTER,
  DELIVERY_RADIUS_MILES,
} from "@/lib/data/contact";
import { getMessages } from "@/lib/i18n/messages";

function buildEmbedUrl(): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${DELIVERY_CENTER.lat},${DELIVERY_CENTER.lng}&zoom=10&maptype=roadmap`;
  }

  return `https://maps.google.com/maps?q=${DELIVERY_CENTER.lat},${DELIVERY_CENTER.lng}&z=10&output=embed`;
}

export async function DeliveryZoneMap() {
  const locale = await getLocale();
  const t = await getTranslations("contact");
  const areas = getMessages(locale).contact.areas;
  const embedUrl = buildEmbedUrl();

  return (
    <section aria-labelledby="delivery-zone-heading" className="mt-16">
      <h2
        id="delivery-zone-heading"
        className="font-display text-2xl font-semibold text-text sm:text-3xl"
      >
        {t("deliveryZone")}
      </h2>
      <p className="mt-3 max-w-2xl text-text-muted">{t("deliveryZoneIntro")}</p>

      <div className="relative mt-8 overflow-hidden rounded-2xl border border-border shadow-card">
        <div className="relative aspect-[16/10] w-full bg-surface sm:aspect-[21/9]">
          <iframe
            title={`${t("deliveryZone")} — ${t("centerLabel")}`}
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(72%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/70 bg-primary/10"
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-border bg-surface/95 px-4 py-3 shadow-soft backdrop-blur-sm">
            <p className="text-sm font-medium text-text">{t("radiusLabel")}</p>
            <p className="text-xs text-text-muted">{t("centerLabel")}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted">
          {t("areasTitle")}
        </h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {areas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-text"
            >
              {area}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

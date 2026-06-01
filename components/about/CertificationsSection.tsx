import { Award, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CertificationsSection() {
  return (
    <section
      className="border-t border-border bg-surface py-20"
      aria-labelledby="certifications-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="certifications-heading"
            className="font-display text-3xl font-semibold text-text sm:text-4xl"
          >
            Certified &amp; Insured
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">
            We operate under Sacramento County cottage food regulations, so you
            can order with confidence knowing our kitchen meets local health and
            safety standards.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-bg px-6 py-10 text-center shadow-soft">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Award className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="mt-5 font-display text-lg font-semibold text-text">
              Sacramento County
            </p>
            <p className="mt-1 text-sm font-medium text-primary">Cottage Food License</p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Registered and approved for direct-to-customer sales under California
              cottage food law.
            </p>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-border bg-bg px-6 py-10 text-center shadow-soft">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="mt-5 font-display text-lg font-semibold text-text">Insured &amp; Certified</p>
            <p className="mt-1 text-sm font-medium text-primary">Fully Covered</p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Liability insurance in place for your peace of mind at every
              celebration we serve.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button href="/catalog">Browse Our Cakes</Button>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

const bakerImage =
  "https://images.unsplash.com/photo-1583394294304-6d0454237422?auto=format&fit=crop&w=800&q=80";

export function MeetTheBakerSection() {
  return (
    <section className="py-20" aria-labelledby="meet-the-baker-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="meet-the-baker-heading"
          title="Meet the Baker"
          subtitle="The hands and heart behind every layer"
        />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card">
            <Image
              src={bakerImage}
              alt="Anna, founder and head baker of SteKir Cakes"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="font-accent text-3xl text-primary">Anna</p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wider text-text-muted">
              Founder &amp; Head Baker
            </p>
            <div className="mt-6 space-y-4 leading-relaxed text-text-muted">
              <p>
                Anna grew up watching her grandmother layer Napoleon cakes for every
                family celebration. When she moved to Sacramento, those recipes
                came with her — and soon friends and neighbors were asking for
                cakes of their own.
              </p>
              <p>
                Today, Anna runs SteKir Cakes from her home kitchen, personally
                overseeing every order from the first phone call to the final
                decoration. She believes a great cake should taste like a memory —
                and she puts that belief into every batch she bakes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

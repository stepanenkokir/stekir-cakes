import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const heroImage =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1920&q=80";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-end overflow-hidden">
      <Image
        src={heroImage}
        alt="Layered Napoleon cake with golden pastry and cream"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-text/80 via-text/30 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-accent mb-4 text-2xl text-accent sm:text-3xl">
            Sacramento&apos;s home bakery
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Homemade Cakes, Made to Order
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
            Crafted with love in Sacramento. Delivering to Folsom, Roseville, El
            Dorado Hills &amp; beyond.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/catalog" size="lg">
              Browse Cakes
            </Button>
            <Button href="#how-it-works" variant="ghost" size="lg" className="border-white/40 text-white hover:border-white hover:bg-white/10 hover:text-white">
              How It Works
            </Button>
          </div>
        </div>
      </div>

      <a
        href="#trust-bar"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/80 transition-colors hover:text-white"
        aria-label="Scroll to learn more"
      >
        <ChevronDown className="animate-bounce-subtle h-8 w-8" />
      </a>
    </section>
  );
}

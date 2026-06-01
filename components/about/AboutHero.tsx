import Image from "next/image";

const heroImage =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1920&q=80";

export function AboutHero() {
  return (
    <section className="relative flex min-h-[55vh] items-end overflow-hidden sm:min-h-[60vh]">
      <Image
        src={heroImage}
        alt="Baker preparing a fresh cake in a warm home kitchen"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/35 to-text/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="font-accent mb-3 text-2xl text-accent sm:text-3xl">Our Story</p>
        <h1 className="font-display max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
          Made with love in Sacramento
        </h1>
      </div>
    </section>
  );
}

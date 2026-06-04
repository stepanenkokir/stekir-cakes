import type { Metadata } from "next";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { ReviewSubmissionForm } from "@/components/reviews/ReviewSubmissionForm";
import { ReviewsGrid } from "@/components/reviews/ReviewsGrid";
import { ReviewsSummary } from "@/components/reviews/ReviewsSummary";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Read what Sacramento-area customers say about our homemade Napoleon, Medovik, Smetannik, and Mannik cakes.",
  openGraph: {
    title: "Customer Reviews — SteKir Cakes",
    description:
      "Real reviews from birthdays, anniversaries, and celebrations across Sacramento and surrounding suburbs.",
  },
};

export default function ReviewsPage() {
  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Our Cakes", href: "/catalog" },
            { label: "Reviews" },
          ]}
        />

        <SectionHeading
          title="What Our Customers Say"
          subtitle="Honest feedback from families and celebrations across Sacramento, Folsom, Roseville, and beyond"
          align="left"
        />

        <ReviewsSummary />
        <ReviewsGrid />
        <ReviewSubmissionForm />
      </div>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { Step1Contact, type ContactFormValues } from "@/components/checkout/Step1Contact";
import {
  Step2Delivery,
  type DeliveryFormValues,
  type DeliveryType,
  type DeliveryWindow,
} from "@/components/checkout/Step2Delivery";
import { Step3Review, type PaymentMethod } from "@/components/checkout/Step3Review";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/CartProvider";
import { ESTIMATED_DELIVERY_FEE } from "@/lib/constants";

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
type DeliveryFormErrors = Partial<Record<keyof DeliveryFormValues, string>>;
type ReviewFormErrors = {
  terms?: string;
  paymentMethod?: string;
};

function getMinDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function CheckoutContent() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [isHydrated, setIsHydrated] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [contactValues, setContactValues] = useState<ContactFormValues>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [deliveryValues, setDeliveryValues] = useState<DeliveryFormValues>({
    deliveryType: "delivery",
    deliveryAddress: "",
    deliveryCity: "Sacramento",
    deliveryZip: "",
    deliveryDate: "",
    deliveryWindow: "afternoon",
    deliveryInstructions: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("zelle");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({});
  const [deliveryErrors, setDeliveryErrors] = useState<DeliveryFormErrors>({});
  const [reviewErrors, setReviewErrors] = useState<ReviewFormErrors>({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    if (!deliveryValues.deliveryDate && items[0]?.deliveryDate) {
      setDeliveryValues((current) => ({
        ...current,
        deliveryDate: items[0].deliveryDate,
      }));
    }
  }, [isHydrated, items, router, deliveryValues.deliveryDate]);

  const minDate = useMemo(() => getMinDate(2), []);
  const deliveryFee = deliveryValues.deliveryType === "delivery" ? ESTIMATED_DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const depositAmount = Number((total * 0.5).toFixed(2));

  const handleContactChange = (field: keyof ContactFormValues, value: string) => {
    setContactValues((current) => ({ ...current, [field]: value }));
    setContactErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleDeliveryChange = (field: keyof DeliveryFormValues, value: string) => {
    setDeliveryValues((current) => ({ ...current, [field]: value }));
    setDeliveryErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateStep1 = (): boolean => {
    const nextErrors: ContactFormErrors = {};

    if (contactValues.firstName.trim().length < 2) {
      nextErrors.firstName = "First name is required.";
    }
    if (contactValues.lastName.trim().length < 2) {
      nextErrors.lastName = "Last name is required.";
    }
    if (contactValues.phone.trim().length < 7) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (!isEmailValid(contactValues.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    setContactErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const nextErrors: DeliveryFormErrors = {};

    if (!deliveryValues.deliveryDate) {
      nextErrors.deliveryDate = "Please choose a date.";
    }

    if (!deliveryValues.deliveryWindow) {
      nextErrors.deliveryWindow = "Please select a time window.";
    }

    if (deliveryValues.deliveryType === "delivery") {
      if (deliveryValues.deliveryAddress.trim().length < 5) {
        nextErrors.deliveryAddress = "Enter your street address.";
      }
      if (deliveryValues.deliveryCity.trim().length < 2) {
        nextErrors.deliveryCity = "Enter your city.";
      }
      if (!/^\d{5}$/.test(deliveryValues.deliveryZip.trim())) {
        nextErrors.deliveryZip = "Enter a valid 5-digit ZIP.";
      }
    }

    setDeliveryErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const nextErrors: ReviewFormErrors = {};

    if (!paymentMethod) {
      nextErrors.paymentMethod = "Please select a payment method.";
    }
    if (!agreeToTerms) {
      nextErrors.terms = "You must agree to the Terms & Conditions.";
    }

    setReviewErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    if (step === 2 && !validateStep2()) {
      return;
    }

    setStep((current) => Math.min(3, current + 1));
  };

  const handleBack = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!validateStep3()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactValues,
          ...deliveryValues,
          paymentMethod,
          agreeToTerms,
          items: items.map((item) => ({
            slug: item.slug,
            name: item.name,
            weightLbs: item.weightLbs,
            tiers: item.tiers,
            inscription: item.inscription,
            decorationNotes: item.decorationNotes,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
          subtotal,
          deliveryFee,
          total,
          depositAmount,
        }),
      });

      const data = (await response.json()) as { orderNumber?: string; error?: string };
      if (!response.ok || !data.orderNumber) {
        setSubmitError(data.error ?? "Unable to place your order right now. Please try again.");
        return;
      }

      const firstItem = items[0];
      clearCart();

      const search = new URLSearchParams({
        name: contactValues.firstName,
        orderNumber: data.orderNumber,
        cake: firstItem?.name ?? "Custom Cake",
        weight: firstItem?.weightLbs ? String(firstItem.weightLbs) : "",
        date: deliveryValues.deliveryDate,
        total: total.toFixed(2),
        deposit: depositAmount.toFixed(2),
        paymentMethod,
        deliveryType: deliveryValues.deliveryType,
      });

      router.push(`/order-success?${search.toString()}`);
    } catch {
      setSubmitError("Something went wrong. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="h-10 w-64 animate-pulse rounded bg-border/60" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-text sm:text-5xl">Checkout</h1>
        <p className="mt-3 text-lg text-text-muted">
          Complete your order in three quick steps. We&rsquo;ll confirm details by phone or text.
        </p>
      </div>

      <StepIndicator currentStep={step} />

      <div className="mt-6">
        {step === 1 ? (
          <Step1Contact values={contactValues} errors={contactErrors} onChange={handleContactChange} />
        ) : null}

        {step === 2 ? (
          <Step2Delivery
            values={deliveryValues}
            errors={deliveryErrors}
            onChange={handleDeliveryChange}
            minDate={minDate}
          />
        ) : null}

        {step === 3 ? (
          <Step3Review
            items={items}
            deliveryType={deliveryValues.deliveryType as DeliveryType}
            paymentMethod={paymentMethod}
            agreeToTerms={agreeToTerms}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            depositAmount={depositAmount}
            paymentError={reviewErrors.paymentMethod}
            termsError={reviewErrors.terms}
            onPaymentMethodChange={(method) => {
              setPaymentMethod(method);
              setReviewErrors((current) => ({ ...current, paymentMethod: undefined }));
            }}
            onAgreeChange={(checked) => {
              setAgreeToTerms(checked);
              setReviewErrors((current) => ({ ...current, terms: undefined }));
            }}
          />
        ) : null}
      </div>

      {submitError ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isSubmitting}>
          Back
        </Button>

        {step < 3 ? (
          <Button onClick={handleNext}>Continue</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        )}
      </div>
    </div>
  );
}

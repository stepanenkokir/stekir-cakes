"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import type { CakeFormInput, CakeTranslation, CakeTranslations } from "@/lib/data/cake-types";
import { cakeLocales } from "@/lib/data/cake-utils";
import { localeNames, type Locale } from "@/lib/i18n/locale";

type CakeFormProps = {
  mode: "create" | "edit";
  cakeId?: string;
  initialValue: CakeFormInput;
};

const translationFields: Array<{ key: keyof CakeTranslation; label: string; multiline?: boolean }> = [
  { key: "name", label: "Name" },
  { key: "tagline", label: "Tagline" },
  { key: "description", label: "Description", multiline: true },
  { key: "ingredients", label: "Ingredients", multiline: true },
  { key: "servings", label: "Servings" },
  { key: "prepTime", label: "Prep time" },
  { key: "storageInstructions", label: "Storage instructions", multiline: true },
];

function createEmptyForm(): CakeFormInput {
  return {
    slug: "",
    pricePerPound: 12,
    minWeight: 2,
    noticeDays: 2,
    sortOrder: 0,
    isActive: true,
    tags: [],
    imagePaths: [],
    translations: {
      en: {
        name: "",
        tagline: "",
        description: "",
        ingredients: "",
        servings: "",
        prepTime: "",
        storageInstructions: "",
      },
      es: {
        name: "",
        tagline: "",
        description: "",
        ingredients: "",
        servings: "",
        prepTime: "",
        storageInstructions: "",
      },
      ru: {
        name: "",
        tagline: "",
        description: "",
        ingredients: "",
        servings: "",
        prepTime: "",
        storageInstructions: "",
      },
      uk: {
        name: "",
        tagline: "",
        description: "",
        ingredients: "",
        servings: "",
        prepTime: "",
        storageInstructions: "",
      },
    },
  };
}

export function CakeForm({ mode, cakeId, initialValue }: CakeFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CakeFormInput>(initialValue ?? createEmptyForm());
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [tagsInput, setTagsInput] = useState(initialValue.tags.join(", "));
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateTranslation(locale: Locale, key: keyof CakeTranslation, value: string) {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: {
          ...(current.translations[locale] ?? createEmptyForm().translations.en!),
          [key]: value,
        },
      } as CakeTranslations,
    }));
  }

  async function handleUpload(file: File) {
    if (!form.slug.trim()) {
      setError("Enter a slug before uploading images.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("slug", form.slug);

      const response = await fetch("/api/admin/cakes/upload", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      setForm((current) => ({
        ...current,
        imagePaths: [...current.imagePaths, data.url!],
      }));
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function addImageUrl() {
    const url = imageUrlInput.trim();
    if (!url) {
      return;
    }

    setForm((current) => ({
      ...current,
      imagePaths: [...current.imagePaths, url],
    }));
    setImageUrlInput("");
  }

  function removeImage(path: string) {
    setForm((current) => ({
      ...current,
      imagePaths: current.imagePaths.filter((item) => item !== path),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: CakeFormInput = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/admin/cakes" : `/api/admin/cakes/${cakeId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json()) as { error?: string; id?: string };

      if (!response.ok) {
        setError(data.error ?? "Failed to save cake.");
        return;
      }

      router.push("/admin/cakes");
      router.refresh();
    } catch {
      setError("Failed to save cake.");
    } finally {
      setSaving(false);
    }
  }

  const activeTranslation = form.translations[activeLocale] ?? createEmptyForm().translations.en!;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Slug" htmlFor="cake-slug">
          <input
            id="cake-slug"
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            className={formInputClassName()}
            required
            disabled={mode === "edit"}
          />
        </FormField>

        <FormField label="Sort order" htmlFor="cake-sort">
          <input
            id="cake-sort"
            type="number"
            value={form.sortOrder}
            onChange={(event) =>
              setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))
            }
            className={formInputClassName()}
          />
        </FormField>

        <FormField label="Price per pound ($)" htmlFor="cake-price">
          <input
            id="cake-price"
            type="number"
            min="0"
            step="0.01"
            value={form.pricePerPound}
            onChange={(event) =>
              setForm((current) => ({ ...current, pricePerPound: Number(event.target.value) }))
            }
            className={formInputClassName()}
            required
          />
        </FormField>

        <FormField label="Minimum weight (lbs)" htmlFor="cake-min-weight">
          <input
            id="cake-min-weight"
            type="number"
            min="0"
            step="0.1"
            value={form.minWeight}
            onChange={(event) =>
              setForm((current) => ({ ...current, minWeight: Number(event.target.value) }))
            }
            className={formInputClassName()}
            required
          />
        </FormField>

        <FormField label="Notice days" htmlFor="cake-notice">
          <input
            id="cake-notice"
            type="number"
            min="0"
            value={form.noticeDays}
            onChange={(event) =>
              setForm((current) => ({ ...current, noticeDays: Number(event.target.value) }))
            }
            className={formInputClassName()}
            required
          />
        </FormField>

        <FormField label="Tags (comma-separated)" htmlFor="cake-tags">
          <input
            id="cake-tags"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            className={formInputClassName()}
            placeholder="Birthday, Holiday"
          />
        </FormField>
      </div>

      <label className="flex items-center gap-3 text-sm text-text">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
          className="size-4 rounded border-border text-primary focus:ring-primary"
        />
        Active in catalog
      </label>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h3 className="font-display text-xl text-text">Images</h3>
        <div className="mt-4 flex flex-wrap gap-4">
          {form.imagePaths.map((path) => (
            <div key={path} className="relative">
              <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-border">
                <Image src={path} alt="" fill className="object-cover" sizes="112px" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(path)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField label="Upload image" htmlFor="cake-upload">
            <input
              id="cake-upload"
              type="file"
              accept="image/webp,image/jpeg,image/png"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleUpload(file);
                }
              }}
              className={formInputClassName()}
            />
          </FormField>

          <FormField label="Or paste image URL" htmlFor="cake-image-url">
            <div className="flex gap-2">
              <input
                id="cake-image-url"
                value={imageUrlInput}
                onChange={(event) => setImageUrlInput(event.target.value)}
                className={formInputClassName()}
                placeholder="/images/catalog/example-01.webp"
              />
              <Button type="button" variant="ghost" onClick={addImageUrl}>
                Add
              </Button>
            </div>
          </FormField>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap gap-2">
          {cakeLocales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => setActiveLocale(locale)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeLocale === locale
                  ? "bg-primary text-white"
                  : "border border-border bg-bg text-text-muted hover:text-primary-dark"
              }`}
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5">
          {translationFields.map((field) => (
            <FormField
              key={field.key}
              label={`${field.label} (${localeNames[activeLocale]})`}
              htmlFor={`cake-${activeLocale}-${field.key}`}
            >
              {field.multiline ? (
                <textarea
                  id={`cake-${activeLocale}-${field.key}`}
                  rows={field.key === "description" ? 5 : 3}
                  value={activeTranslation[field.key]}
                  onChange={(event) =>
                    updateTranslation(activeLocale, field.key, event.target.value)
                  }
                  className={formInputClassName("resize-y")}
                />
              ) : (
                <input
                  id={`cake-${activeLocale}-${field.key}`}
                  value={activeTranslation[field.key]}
                  onChange={(event) =>
                    updateTranslation(activeLocale, field.key, event.target.value)
                  }
                  className={formInputClassName()}
                />
              )}
            </FormField>
          ))}
        </div>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Saving..." : mode === "create" ? "Create cake" : "Save changes"}
        </Button>
        <Link
          href="/admin/cakes"
          className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-text hover:bg-bg"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

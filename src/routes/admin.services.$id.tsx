import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  createService,
  updateService,
  listServicesAdmin,
} from "@/lib/api/admin.functions";
import { getAuthToken } from "@/lib/auth";
import type { ServiceRow } from "@/types/database";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { generateSlug } from "@/lib/blog-mapping";
import { Plus, Trash2, Loader2, ArrowLeft, Save } from "lucide-react";

export const Route = createFileRoute("/admin/services/$id")({ component: ServiceEditor });

const SERVICE_CATEGORIES = [
  "personal", "professional", "relationship", "remedies", "health", "specialized", "education",
];

type FormState = {
  slug: string;
  name: string;
  price: number;
  category: string;
  tagline: string;
  description: string;
  delivery_text: string;
  image_url: string;
  covers: string[];
  receive: string[];
  faqs: { q: string; a: string }[];
  active: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
};

function emptyForm(): FormState {
  return {
    slug: "",
    name: "",
    price: 151,
    category: "personal",
    tagline: "",
    description: "",
    delivery_text: "1–2 business days",
    image_url: "",
    covers: [""],
    receive: [""],
    faqs: [{ q: "", a: "" }],
    active: true,
    sort_order: 0,
    seo_title: "",
    seo_description: "",
  };
}

function ServiceEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(emptyForm());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (isNew) return;
    async function load() {
      try {
        const token = await getAuthToken();
        if (!token) throw new Error("No auth token.");
        const result = await listServicesAdmin({ data: { authToken: token } });
        const svc = (result.services as ServiceRow[]).find((s) => s.id === id);
        if (!svc) throw new Error("Service not found.");
        setForm({
          slug: svc.slug,
          name: svc.name,
          price: Number(svc.price),
          category: svc.category,
          tagline: svc.tagline,
          description: svc.description,
          delivery_text: svc.delivery_text,
          image_url: svc.image_url ?? "",
          covers: (svc.covers as string[]).length ? svc.covers as string[] : [""],
          receive: (svc.receive as string[]).length ? svc.receive as string[] : [""],
          faqs: (svc.faqs as { q: string; a: string }[]).length ? svc.faqs as { q: string; a: string }[] : [{ q: "", a: "" }],
          active: svc.active,
          sort_order: svc.sort_order,
          seo_title: svc.seo_title ?? "",
          seo_description: svc.seo_description ?? "",
        });
        setSlugEdited(true); // Don't auto-update slug for existing services
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isNew]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !slugEdited) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  }

  // Repeater helpers
  function setListItem(key: "covers" | "receive", i: number, val: string) {
    setForm((prev) => {
      const arr = [...prev[key]];
      arr[i] = val;
      return { ...prev, [key]: arr };
    });
  }
  function addListItem(key: "covers" | "receive") {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  }
  function removeListItem(key: "covers" | "receive", i: number) {
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((_, idx) => idx !== i) }));
  }
  function setFaqItem(i: number, field: "q" | "a", val: string) {
    setForm((prev) => {
      const faqs = prev.faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f);
      return { ...prev, faqs };
    });
  }
  function addFaq() { setForm((prev) => ({ ...prev, faqs: [...prev.faqs, { q: "", a: "" }] })); }
  function removeFaq(i: number) { setForm((prev) => ({ ...prev, faqs: prev.faqs.filter((_, idx) => idx !== i) })); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No auth token.");

      const payload = {
        slug: form.slug,
        name: form.name,
        price: form.price,
        category: form.category,
        tagline: form.tagline,
        description: form.description,
        delivery_text: form.delivery_text,
        image_url: form.image_url || null,
        covers: form.covers.filter(Boolean),
        receive: form.receive.filter(Boolean),
        faqs: form.faqs.filter((f) => f.q && f.a),
        active: form.active,
        sort_order: form.sort_order,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
      };

      if (isNew) {
        await createService({ data: { authToken: token, service: payload } });
      } else {
        await updateService({ data: { authToken: token, id, updates: payload } });
      }

      navigate({ to: "/admin/services" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-slate-400">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading service…</span>
      </div>
    );
  }

  const inputCls = "w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500";
  const labelCls = "block text-xs font-mono uppercase tracking-widest text-slate-500 mb-1.5";
  const fieldset = "space-y-5";

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/services" })}
          className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white inline-flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white">{isNew ? "New service" : "Edit service"}</h1>
          {!isNew && <p className="text-xs font-mono text-slate-500 mt-0.5">{id}</p>}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* ─── Basic Info ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500">Basic info</h2>

          <div className={fieldset}>
            <div>
              <label className={labelCls} htmlFor="svc-name">Name *</label>
              <input id="svc-name" type="text" required value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className={inputCls} placeholder="Kundli Report" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} htmlFor="svc-slug">Slug *</label>
                <input id="svc-slug" type="text" required value={form.slug}
                  onChange={(e) => { setSlugEdited(true); setField("slug", e.target.value); }}
                  className={inputCls} placeholder="kundli-report" />
              </div>
              <div>
                <label className={labelCls} htmlFor="svc-price">Price (₹) *</label>
                <input id="svc-price" type="number" required min={1} value={form.price}
                  onChange={(e) => setField("price", Number(e.target.value))}
                  className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} htmlFor="svc-category">Category</label>
                <select id="svc-category" value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className={inputCls}>
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="svc-order">Sort order</label>
                <input id="svc-order" type="number" value={form.sort_order}
                  onChange={(e) => setField("sort_order", Number(e.target.value))}
                  className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="svc-tagline">Tagline</label>
              <input id="svc-tagline" type="text" value={form.tagline}
                onChange={(e) => setField("tagline", e.target.value)}
                className={inputCls} placeholder="Your cosmic blueprint, decoded." />
            </div>

            <div>
              <label className={labelCls} htmlFor="svc-desc">Description</label>
              <textarea id="svc-desc" rows={4} value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                className={inputCls} placeholder="Detailed description…" />
            </div>

            <div>
              <label className={labelCls} htmlFor="svc-delivery">Delivery text</label>
              <input id="svc-delivery" type="text" value={form.delivery_text}
                onChange={(e) => setField("delivery_text", e.target.value)}
                className={inputCls} placeholder="1–2 business days" />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setField("active", !form.active)}
                className={`relative w-10 h-6 rounded-full transition-colors ${form.active ? "bg-amber-500" : "bg-slate-700"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? "left-5" : "left-1"}`} />
              </button>
              <span className="text-sm text-slate-300">Active (visible on public site)</span>
            </div>
          </div>
        </section>

        {/* ─── Image ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">Service image</h2>
          <ImageUpload
            bucket="service-images"
            currentUrl={form.image_url || null}
            onUpload={(url) => setField("image_url", url)}
            onClear={() => setField("image_url", "")}
            label="Upload service image"
          />
        </section>

        {/* ─── What it covers ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">What it covers</h2>
          <div className="space-y-2">
            {form.covers.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={item}
                  onChange={(e) => setListItem("covers", i, e.target.value)}
                  className={`${inputCls} flex-1`} placeholder={`Cover point ${i + 1}`} />
                <button type="button" onClick={() => removeListItem("covers", i)}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-500 hover:text-red-400 inline-flex items-center justify-center transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addListItem("covers")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400">
            <Plus size={12} /> Add point
          </button>
        </section>

        {/* ─── What you receive ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">What you receive</h2>
          <div className="space-y-2">
            {form.receive.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={item}
                  onChange={(e) => setListItem("receive", i, e.target.value)}
                  className={`${inputCls} flex-1`} placeholder={`Deliverable ${i + 1}`} />
                <button type="button" onClick={() => removeListItem("receive", i)}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-500 hover:text-red-400 inline-flex items-center justify-center transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addListItem("receive")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400">
            <Plus size={12} /> Add item
          </button>
        </section>

        {/* ─── FAQs ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">FAQs</h2>
          <div className="space-y-4">
            {form.faqs.map((faq, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={faq.q}
                      onChange={(e) => setFaqItem(i, "q", e.target.value)}
                      className={inputCls} placeholder="Question" />
                    <textarea rows={3} value={faq.a}
                      onChange={(e) => setFaqItem(i, "a", e.target.value)}
                      className={inputCls} placeholder="Answer" />
                  </div>
                  <button type="button" onClick={() => removeFaq(i)}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-500 hover:text-red-400 inline-flex items-center justify-center transition-colors shrink-0 mt-0.5">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addFaq}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400">
            <Plus size={12} /> Add FAQ
          </button>
        </section>

        {/* ─── SEO ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500">SEO</h2>
          <div>
            <label className={labelCls} htmlFor="svc-seo-title">SEO title</label>
            <input id="svc-seo-title" type="text" value={form.seo_title}
              onChange={(e) => setField("seo_title", e.target.value)}
              className={inputCls} placeholder="Kundli Report — SudnadiAstro" />
          </div>
          <div>
            <label className={labelCls} htmlFor="svc-seo-desc">Meta description</label>
            <textarea id="svc-seo-desc" rows={3} value={form.seo_description}
              onChange={(e) => setField("seo_description", e.target.value)}
              className={inputCls} placeholder="A short description for search engines (max 160 chars)" />
          </div>
        </section>

        {/* ─── Save ─── */}
        <div className="flex gap-3 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isNew ? "Create service" : "Save changes"}
          </button>
          <button type="button" onClick={() => navigate({ to: "/admin/services" })}
            className="px-6 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

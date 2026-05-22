'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, Check, Clock } from 'lucide-react';
import type { AdminCategoryCard } from '@/lib/mock-data';
import { saveAdminCategory } from '@/lib/data';
import AdminPageFooter from '@/components/admin/AdminPageFooter';

const DEFAULT_CATEGORY_IMAGE =
  'https://images.pexels.com/photos/424196/pexels-photo-424196.jpeg?auto=compress&cs=tinysrgb&w=600';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

const ORIGIN_OPTIONS = [
  { code: 'KE', label: 'Kenya' },
  { code: 'AE', label: 'Dubai (UAE)' },
  { code: 'CN', label: 'China' },
] as const;

export interface CategoryFormValues {
  name: string;
  description: string;
  origins: string[];
  status: AdminCategoryCard['status'];
  imageUrl: string | null;
}

function emptyValues(): CategoryFormValues {
  return {
    name: '',
    description: '',
    origins: ['KE'],
    status: 'draft',
    imageUrl: null,
  };
}

function fromCategory(cat: AdminCategoryCard): CategoryFormValues {
  return {
    name: cat.name,
    description: cat.description,
    origins: [...cat.origins],
    status: cat.status,
    imageUrl: cat.image_url,
  };
}

export interface CategoryFormProps {
  mode: 'create' | 'edit';
  categoryId?: string;
  initial?: AdminCategoryCard | null;
}

export default function CategoryForm({ mode, categoryId, initial }: CategoryFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CategoryFormValues>(
    initial ? fromCategory(initial) : emptyValues(),
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const title = mode === 'create' ? 'Create Product Category' : 'Edit Product Category';
  const breadcrumbCurrent = mode === 'create' ? 'New Category' : 'Edit Category';

  const toggleOrigin = useCallback((code: string) => {
    setValues((v) => {
      const has = v.origins.includes(code);
      const origins = has ? v.origins.filter((o) => o !== code) : [...v.origins, code];
      return { ...v, origins: origins.length > 0 ? origins : [code] };
    });
  }, []);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setValues((v) => ({ ...v, imageUrl: url }));
  };

  const canPublish =
    values.name.trim().length > 0 &&
    values.description.trim().length > 0 &&
    values.origins.length > 0;

  async function handleSave(publish: boolean) {
    if (!canPublish || saving) return;
    const status = publish ? 'published' : 'draft';
    setSaving(true);
    try {
      await saveAdminCategory({
        id: categoryId,
        name: values.name.trim(),
        description: values.description.trim(),
        origins: values.origins as AdminCategoryCard['origins'],
        image_url: values.imageUrl ?? DEFAULT_CATEGORY_IMAGE,
        status,
      });
      setValues((v) => ({ ...v, status }));
      setSaved(true);
      setTimeout(() => router.push('/admin/categories'), 600);
    } finally {
      setSaving(false);
    }
  }

  const previewImage =
    values.imageUrl ??
    'https://images.pexels.com/photos/424196/pexels-photo-424196.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8">
        <nav className="text-xs text-[#737784] mb-1">
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
          {' / '}
          <Link href="/admin/categories" className="hover:underline">
            Categories
          </Link>
          {' / '}
          <span className="text-[#434653]">{breadcrumbCurrent}</span>
        </nav>

        <h1 className="text-2xl font-bold mt-2 mb-1" style={{ color: BLUE_DARK }}>
          {title}
        </h1>
        <p className="text-sm text-[#737784] mb-8 max-w-xl">
          {mode === 'create'
            ? 'Establish a new trade vertical across Kenyan, Dubai, and Chinese markets.'
            : `Update classification ${categoryId ? `#${categoryId}` : ''} for marketplace and sourcing flows.`}
        </p>

        {saved && (
          <p
            className="mb-4 text-sm font-semibold px-3 py-2 rounded-lg border border-[#b0c6ff] bg-white"
            style={{ color: BLUE }}
          >
            Category saved — redirecting to category list…
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(true);
          }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        >
          <div className="xl:col-span-2 space-y-5">
            <section className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <h2 className="text-sm font-bold text-black mb-4">Category Essentials</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cat-name" className="block text-xs font-bold text-[#434653] mb-1.5">
                    Category Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="cat-name"
                    name="name"
                    required
                    value={values.name}
                    onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                    placeholder="e.g. Industrial Textiles"
                    className="w-full px-3 py-2.5 text-sm border border-[#c3c6d5] rounded focus:outline-none focus:border-[#004aad]"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#434653] mb-2">
                    Active Markets <span className="text-red-600">*</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {ORIGIN_OPTIONS.map((o) => (
                      <label
                        key={o.code}
                        className="flex items-center gap-2 text-sm text-[#434653] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={values.origins.includes(o.code)}
                          onChange={() => toggleOrigin(o.code)}
                          className="rounded border-[#c3c6d5]"
                        />
                        {o.label} ({o.code})
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="cat-desc" className="block text-xs font-bold text-[#434653] mb-1.5">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="cat-desc"
                    name="description"
                    required
                    value={values.description}
                    onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
                    rows={4}
                    placeholder="Describe the category scope and sourcing guidelines..."
                    className="w-full px-3 py-2.5 text-sm border border-[#c3c6d5] rounded resize-y focus:outline-none focus:border-[#004aad]"
                  />
                </div>
                <div>
                  <label htmlFor="cat-status" className="block text-xs font-bold text-[#434653] mb-1.5">
                    Publication Status
                  </label>
                  <select
                    id="cat-status"
                    value={values.status}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        status: e.target.value as AdminCategoryCard['status'],
                      }))
                    }
                    className="w-full max-w-xs px-3 py-2.5 text-sm border border-[#c3c6d5] rounded bg-white focus:outline-none focus:border-[#004aad]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <h2 className="text-sm font-bold text-black mb-4">Visual Assets</h2>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#c3c6d5] rounded-lg p-10 cursor-pointer hover:bg-[#f8f9ff] min-h-[180px]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                />
                {values.imageUrl ? (
                  <img
                    src={values.imageUrl}
                    alt="Category preview upload"
                    className="max-h-32 object-contain mb-3 rounded"
                  />
                ) : (
                  <Upload className="w-10 h-10 text-[#737784] mb-3" />
                )}
                <p className="text-sm text-[#434653] text-center">
                  Drop image here or{' '}
                  <span className="font-bold" style={{ color: BLUE }}>
                    click to upload
                  </span>
                </p>
              </label>
            </section>

            <div className="flex flex-wrap gap-3 justify-end">
              <Link
                href="/admin/categories"
                className="px-5 py-2.5 text-xs font-bold border-2 rounded-lg bg-white"
                style={{ borderColor: BLUE, color: BLUE }}
              >
                Discard Draft
              </Link>
              <button
                type="button"
                disabled={!canPublish || saving}
                onClick={() => handleSave(false)}
                className="px-5 py-2.5 text-xs font-bold border-2 rounded-lg bg-white disabled:opacity-50"
                style={{ borderColor: BLUE, color: BLUE }}
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={!canPublish || saving}
                className="px-5 py-2.5 text-xs font-bold rounded-lg text-white disabled:opacity-50"
                style={{ backgroundColor: BLUE_DARK }}
              >
                {saving ? 'Saving…' : 'Publish Category'}
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <section className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <h2 className="text-sm font-bold text-black mb-4">Live Preview</h2>
              <div className="border border-[#e5eeff] rounded-lg overflow-hidden">
                <div className="h-32 bg-[#eff4ff]">
                  <img src={previewImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex gap-1 mb-2">
                    {values.origins.map((o) => (
                      <span
                        key={o}
                        className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-[#c3c6d5] rounded"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-black">{values.name || 'Category Title'}</p>
                  <p className="text-xs text-[#737784] mt-1 line-clamp-3">
                    {values.description || 'Category description preview for marketplace users.'}
                  </p>
                  <button
                    type="button"
                    className="mt-3 w-full py-2 text-xs font-bold rounded-lg text-white"
                    style={{ backgroundColor: BLUE }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <h2 className="text-sm font-bold text-black mb-4">Deployment Status</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-[#434653]">
                  <Check
                    className="w-4 h-4 shrink-0"
                    style={{ color: values.name && values.description ? BLUE : '#c3c6d5' }}
                  />
                  Content Validation
                </li>
                <li className="flex items-center gap-2 text-orange-600 font-medium">
                  <span className="w-4 h-4 rounded-full border-2 border-orange-500 shrink-0" />
                  Regional Localization — In Progress
                </li>
                <li className="flex items-center gap-2 text-[#737784]">
                  <Clock className="w-4 h-4 shrink-0" />
                  Global CDN Sync
                </li>
              </ul>
            </section>
          </div>
        </form>
      </div>
      <AdminPageFooter />
    </div>
  );
}

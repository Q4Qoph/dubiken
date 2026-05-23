'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Loader2,
  Check,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { FileUploadField } from '@/components/sourcing/file-upload-field';
import { useCreateSourcingRequestMutation } from '@/lib/api/hooks';
import {
  HUB_OPTIONS,
  KENYA_REGIONS,
  SOURCING_UNITS,
  type HubCode,
  type SourcingShippingMethod,
} from '@/lib/contracts';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

const STEPS = [
  { id: 1, label: 'REQUIREMENTS', sub: 'Product & Specifications' },
  { id: 2, label: 'LOGISTICS', sub: 'Markets & Quantity' },
  { id: 3, label: 'REVIEW', sub: 'Submit for Verification' },
] as const;

const COUNTIES = [...KENYA_REGIONS];
const ORIGINS = HUB_OPTIONS;
const UNITS = [...SOURCING_UNITS];

type FormState = {
  productName: string;
  description: string;
  origin: HubCode;
  county: string;
  deliveryAddress: string;
  quantity: string;
  unit: string;
  targetDate: string;
  shippingMethod: 'air' | 'sea' | 'flexible';
  budget: string;
  acceptTerms: boolean;
};

const initialForm: FormState = {
  productName: '',
  description: '',
  origin: 'CN',
  county: 'Nairobi County',
  deliveryAddress: '',
  quantity: '',
  unit: 'units',
  targetDate: '',
  shippingMethod: 'flexible',
  budget: '',
  acceptTerms: false,
};

function FormSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#e5eeff] bg-[#f8f9ff] p-4 lg:p-5 space-y-3">
      {title ? (
        <p className="text-xs font-bold uppercase tracking-wide text-[#737784]">{title}</p>
      ) : null}
      {children}
    </div>
  );
}

function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-bold text-[#434653] mb-1.5">
      {children}
      {required ? <span className="text-red-600"> *</span> : null}
    </label>
  );
}

function inputClass(hasError?: boolean) {
  return `w-full px-3 py-2.5 text-sm border rounded-lg bg-white focus:outline-none focus:border-[#004aad] ${
    hasError ? 'border-red-400' : 'border-[#c3c6d5]'
  }`;
}

export default function NewSourcingRequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [fileCount, setFileCount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createRequest = useCreateSourcingRequestMutation();

  const patch = (updates: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...updates }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(updates).forEach((key) => delete next[key]);
      return next;
    });
  };

  const validateStep = (targetStep: number): boolean => {
    const nextErrors: Record<string, string> = {};

    if (targetStep === 1) {
      if (!form.productName.trim()) {
        nextErrors.productName = 'Enter a product name or title';
      }
      if (!form.description.trim()) {
        nextErrors.description = 'Add a description for suppliers';
      } else if (form.description.trim().length < 20) {
        nextErrors.description = 'Description should be at least 20 characters';
      }
    }

    if (targetStep === 2) {
      if (!form.quantity.trim() || Number(form.quantity) <= 0) {
        nextErrors.quantity = 'Enter a valid quantity';
      }
      if (!form.targetDate) {
        nextErrors.targetDate = 'Select a target delivery date';
      }
      if (!form.deliveryAddress.trim()) {
        nextErrors.deliveryAddress = 'Enter your delivery address';
      }
      if (!form.budget.trim()) {
        nextErrors.budget = 'Enter your budget';
      }
    }

    if (targetStep === 3) {
      if (!form.acceptTerms) {
        nextErrors.acceptTerms = 'Accept the terms to submit your request';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) {
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }

    try {
      const created = await createRequest.mutateAsync({
        productName: form.productName.trim(),
        description: form.description.trim(),
        origin: form.origin,
        county: form.county,
        deliveryAddress: form.deliveryAddress.trim(),
        quantity: form.quantity.trim(),
        unit: form.unit,
        targetDate: form.targetDate,
        shippingMethod: form.shippingMethod,
        budget: form.budget.trim(),
      });

      toast.success('Sourcing request submitted', {
        description: `Request #${created.request_number} is pending verification.`,
      });
      router.push('/dashboard/sourcing');
    } catch {
      toast.error('Could not submit request', {
        description: 'Please try again in a moment.',
      });
    }
  };

  const originLabel = ORIGINS.find((o) => o.code === form.origin)?.label ?? form.origin;

  return (
    <div className="min-h-full bg-white flex flex-col">
      <Toaster position="top-right" richColors />
      <div className="flex flex-1 min-h-0">
        <div className="hidden lg:flex w-72 shrink-0 flex-col border-r border-[#c3c6d5] bg-white p-6 overflow-hidden">
          <h1 className="text-xl font-bold mb-3" style={{ color: BLUE_DARK }}>
            Custom Sourcing Request
          </h1>
          <p className="text-sm text-[#737784] leading-relaxed mb-6">
            Tell us what you need. We source from verified manufacturers across Kenya,
            Dubai, and China.
          </p>

          <div className="space-y-3 flex-1 min-h-0">
            {STEPS.map((s) => {
              const isActive = step === s.id;
              const isComplete = step > s.id;
              return (
                <div
                  key={s.id}
                  className={`rounded-lg border-2 p-4 ${
                    isActive
                      ? 'border-[#004aad] bg-[#f8f9ff]'
                      : isComplete
                        ? 'border-[#004aad]/40 bg-[#f8f9ff]'
                        : 'border-[#e5eeff] bg-[#f8f9ff]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        isComplete
                          ? 'bg-[#004aad] text-white'
                          : isActive
                            ? 'bg-[#004aad] text-white'
                            : 'bg-white border border-[#c3c6d5] text-[#737784]'
                      }`}
                    >
                      {isComplete ? <Check className="w-3.5 h-3.5" /> : s.id}
                    </span>
                    <p className="text-[10px] font-bold text-[#737784]">Step {s.id}</p>
                  </div>
                  <p className="text-xs font-bold text-black mt-1.5">{s.label}</p>
                  <p className="text-xs text-[#737784]">{s.sub}</p>
                </div>
              );
            })}
          </div>

          <div
            className="rounded-lg p-4 text-white mt-4 shrink-0"
            style={{ backgroundColor: BLUE_DARK }}
          >
            <Shield className="w-8 h-8 mb-2 opacity-90" />
            <p className="text-sm font-bold mb-1">Secure Global Sourcing</p>
            <p className="text-xs opacity-90 leading-relaxed">
              Every supplier is vetted with on-site manufacturer inspections.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6 lg:p-10 max-w-3xl">
            <div className="lg:hidden mb-6 space-y-4">
              <Link
                href="/dashboard/sourcing"
                className="text-xs font-bold text-[#737784] hover:underline"
              >
                ← Back to requests
              </Link>
              <h1 className="text-xl font-bold" style={{ color: BLUE_DARK }}>
                Custom Sourcing Request
              </h1>
              <div className="flex gap-2">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={`flex-1 h-1.5 rounded-full ${
                      step >= s.id ? 'bg-[#004aad]' : 'bg-[#e5eeff]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-[#737784]">
                Step {step} of 3 — {STEPS[step - 1].label}
              </p>
            </div>

            <div className="space-y-5 rounded-lg border border-[#e5eeff] bg-white p-6 lg:p-8 shadow-sm">
              {step === 1 && (
                <>
                  <FormSection title="Product details">
                    <div>
                      <FieldLabel htmlFor="productName" required>
                        Product name / title
                      </FieldLabel>
                      <input
                        id="productName"
                        value={form.productName}
                        onChange={(e) => patch({ productName: e.target.value })}
                        placeholder="e.g. High-Grade Photovoltaic Inverters"
                        className={inputClass(Boolean(errors.productName))}
                      />
                      {errors.productName && (
                        <p className="text-xs text-red-600 mt-1">{errors.productName}</p>
                      )}
                    </div>
                  </FormSection>

                  <FormSection title="Specifications">
                    <div>
                      <FieldLabel htmlFor="description" required>
                        Detailed description
                      </FieldLabel>
                      <textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => patch({ description: e.target.value })}
                        rows={5}
                        placeholder="Describe technical requirements, certifications, MOQ, and packaging needs..."
                        className={`${inputClass(Boolean(errors.description))} resize-y`}
                      />
                      {errors.description && (
                        <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                      )}
                    </div>
                  </FormSection>

                  <FormSection title="Reference files">
                    <FieldLabel>Specifications & reference images</FieldLabel>
                    <FileUploadField onFilesChange={(files) => setFileCount(files.length)} />
                  </FormSection>
                </>
              )}

              {step === 2 && (
                <>
                  <FormSection title="Source market">
                    <p className="text-xs text-[#737784] mb-2">
                      Where should we source this product?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {ORIGINS.map((market) => (
                        <button
                          key={market.code}
                          type="button"
                          onClick={() => patch({ origin: market.code })}
                          className={`rounded-lg border-2 p-4 text-left transition-colors ${
                            form.origin === market.code
                              ? 'border-[#004aad] bg-white'
                              : 'border-[#e5eeff] bg-white/70 hover:border-[#c3c6d5]'
                          }`}
                        >
                          <span className="text-2xl">{market.flag}</span>
                          <p className="text-sm font-bold text-black mt-2">{market.label}</p>
                          <p className="text-xs text-[#737784]">{market.code}</p>
                        </button>
                      ))}
                    </div>
                  </FormSection>

                  <FormSection title="Delivery in Kenya">
                    <div>
                      <FieldLabel htmlFor="county" required>
                        County
                      </FieldLabel>
                      <div className="relative">
                        <select
                          id="county"
                          value={form.county}
                          onChange={(e) => patch({ county: e.target.value })}
                          className={`${inputClass()} appearance-none`}
                        >
                          {COUNTIES.map((county) => (
                            <option key={county} value={county}>
                              {county}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737784] pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <FieldLabel htmlFor="deliveryAddress" required>
                        Delivery address
                      </FieldLabel>
                      <textarea
                        id="deliveryAddress"
                        value={form.deliveryAddress}
                        onChange={(e) => patch({ deliveryAddress: e.target.value })}
                        rows={3}
                        placeholder="Street, building, town, landmarks…"
                        className={`${inputClass(Boolean(errors.deliveryAddress))} resize-y`}
                      />
                      {errors.deliveryAddress && (
                        <p className="text-xs text-red-600 mt-1">{errors.deliveryAddress}</p>
                      )}
                    </div>
                  </FormSection>

                  <FormSection title="Quantity & timing">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <FieldLabel htmlFor="quantity" required>
                          Quantity
                        </FieldLabel>
                        <input
                          id="quantity"
                          type="number"
                          min={1}
                          value={form.quantity}
                          onChange={(e) => patch({ quantity: e.target.value })}
                          placeholder="e.g. 50"
                          className={inputClass(Boolean(errors.quantity))}
                        />
                        {errors.quantity && (
                          <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
                        )}
                      </div>
                      <div>
                        <FieldLabel htmlFor="unit">Unit</FieldLabel>
                        <div className="relative">
                          <select
                            id="unit"
                            value={form.unit}
                            onChange={(e) => patch({ unit: e.target.value })}
                            className={`${inputClass()} appearance-none`}
                          >
                            {UNITS.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737784] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <FieldLabel htmlFor="targetDate" required>
                        Target delivery date
                      </FieldLabel>
                      <input
                        id="targetDate"
                        type="date"
                        value={form.targetDate}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => patch({ targetDate: e.target.value })}
                        className={inputClass(Boolean(errors.targetDate))}
                      />
                      {errors.targetDate && (
                        <p className="text-xs text-red-600 mt-1">{errors.targetDate}</p>
                      )}
                    </div>
                  </FormSection>

                  <FormSection title="Shipping & budget">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {(
                        [
                          { id: 'air' as const, label: 'Air freight', hint: 'Faster, higher cost' },
                          { id: 'sea' as const, label: 'Sea freight', hint: 'Economical for bulk' },
                          { id: 'flexible' as const, label: 'Flexible', hint: 'We recommend best option' },
                        ] as const
                      ).map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => patch({ shippingMethod: option.id })}
                          className={`flex-1 rounded-lg border-2 p-3 text-left ${
                            form.shippingMethod === option.id
                              ? 'border-[#004aad] bg-white'
                              : 'border-transparent bg-white/70'
                          }`}
                        >
                          <p className="text-sm font-bold text-black">{option.label}</p>
                          <p className="text-xs text-[#737784]">{option.hint}</p>
                        </button>
                      ))}
                    </div>
                    <div>
                      <FieldLabel htmlFor="budget" required>
                        Budget (KSh)
                      </FieldLabel>
                      <input
                        id="budget"
                        value={form.budget}
                        onChange={(e) => patch({ budget: e.target.value })}
                        placeholder="e.g. KSh 500,000 – KSh 750,000"
                        className={inputClass(Boolean(errors.budget))}
                      />
                      {errors.budget && (
                        <p className="text-xs text-red-600 mt-1">{errors.budget}</p>
                      )}
                    </div>
                  </FormSection>
                </>
              )}

              {step === 3 && (
                <>
                  <FormSection title="Review your request">
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between gap-4 border-b border-[#e5eeff] pb-2">
                        <dt className="text-[#737784] font-medium">Product</dt>
                        <dd className="font-bold text-black text-right">{form.productName}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-[#e5eeff] pb-2">
                        <dt className="text-[#737784] font-medium">Route</dt>
                        <dd className="font-bold text-black text-right">
                          {originLabel} → {form.county}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-[#e5eeff] pb-2">
                        <dt className="text-[#737784] font-medium">Delivery address</dt>
                        <dd className="font-bold text-black text-right max-w-[55%]">
                          {form.deliveryAddress}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-[#e5eeff] pb-2">
                        <dt className="text-[#737784] font-medium">Quantity</dt>
                        <dd className="font-bold text-black text-right">
                          {form.quantity} {form.unit}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-[#e5eeff] pb-2">
                        <dt className="text-[#737784] font-medium">Target date</dt>
                        <dd className="font-bold text-black text-right">{form.targetDate}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-[#e5eeff] pb-2">
                        <dt className="text-[#737784] font-medium">Shipping</dt>
                        <dd className="font-bold text-black text-right capitalize">
                          {form.shippingMethod.replace('_', ' ')}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-[#e5eeff] pb-2">
                        <dt className="text-[#737784] font-medium">Budget</dt>
                        <dd className="font-bold text-black text-right">{form.budget}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#737784] font-medium">Attachments</dt>
                        <dd className="font-bold text-black text-right">
                          {fileCount} file{fileCount === 1 ? '' : 's'}
                        </dd>
                      </div>
                    </dl>
                    <p className="text-xs text-[#737784] leading-relaxed mt-3 pt-3 border-t border-[#e5eeff]">
                      {form.description}
                    </p>
                  </FormSection>

                  <FormSection title="Terms">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.acceptTerms}
                        onChange={(e) => patch({ acceptTerms: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-[#c3c6d5]"
                      />
                      <span className="text-sm text-[#434653] leading-relaxed">
                        I confirm the details are accurate and agree to Dubiken&apos;s sourcing
                        terms. Quotes are subject to supplier availability and logistics
                        conditions.
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="text-xs text-red-600">{errors.acceptTerms}</p>
                    )}
                  </FormSection>
                </>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase rounded-lg border border-[#c3c6d5] bg-white text-[#434653] hover:bg-[#f8f9ff]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <Link
                    href="/dashboard/sourcing"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase rounded-lg border border-[#c3c6d5] bg-white text-[#434653] hover:bg-[#f8f9ff]"
                  >
                    Cancel
                  </Link>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase text-white rounded-lg sm:ml-auto"
                    style={{ backgroundColor: BLUE_DARK }}
                  >
                    {step === 1 ? 'Continue to Logistics' : 'Review request'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={createRequest.isPending}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase text-white rounded-lg sm:ml-auto disabled:opacity-60"
                    style={{ backgroundColor: BLUE_DARK }}
                  >
                    {createRequest.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit request
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

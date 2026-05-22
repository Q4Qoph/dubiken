'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import CategoryForm from '@/components/admin/CategoryForm';
import { getAdminCategoryById } from '@/lib/data';
import type { AdminCategoryCard } from '@/lib/mock-data';

const BLUE = '#004aad';

export default function EditCategoryPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [category, setCategory] = useState<AdminCategoryCard | null | undefined>(undefined);

  useEffect(() => {
    if (id) getAdminCategoryById(id).then(setCategory);
  }, [id]);

  if (category === undefined) {
    return (
      <div className="p-8 text-sm text-[#737784] bg-[#f8f9ff] min-h-full">Loading category…</div>
    );
  }

  if (!category) {
    return (
      <div className="p-8 bg-[#f8f9ff] min-h-full">
        <p className="text-sm text-[#737784] mb-4">Category not found.</p>
        <Link href="/admin/categories" className="text-sm font-bold hover:underline" style={{ color: BLUE }}>
          ← Back to categories
        </Link>
      </div>
    );
  }

  return <CategoryForm mode="edit" categoryId={id} initial={category} />;
}

'use client';

import { Package, UserCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

export interface GuestCartPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  onSignIn: () => void;
  onSignUp: () => void;
  onContinueGuest: () => void;
  continuing?: boolean;
}

export function GuestCartPromptDialog({
  open,
  onOpenChange,
  productName,
  onSignIn,
  onSignUp,
  onContinueGuest,
  continuing = false,
}: GuestCartPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-[#dce9ff] bg-white p-0 overflow-hidden gap-0 sm:rounded-xl">
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{
            background:
              'linear-gradient(165deg, #eff4ff 0%, #f8f9ff 45%, #ffffff 100%)',
          }}
        >
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md"
            style={{ backgroundColor: BLUE }}
          >
            <Package className="h-7 w-7" strokeWidth={2} />
          </div>
          <DialogHeader className="space-y-2 text-center sm:text-center">
            <DialogTitle className="text-xl font-bold text-[#0b1c30]">
              Save your cart to your account?
            </DialogTitle>
            <DialogDescription className="text-sm text-[#434653] leading-relaxed">
              {productName ? (
                <>
                  Add <span className="font-semibold text-[#0b1c30]">{productName}</span> and
                  track your order from your dashboard.
                </>
              ) : (
                <>
                  Sign in to sync your cart and track orders, or continue as a guest — no account
                  required.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <button
            type="button"
            onClick={onSignIn}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white hover:opacity-95 transition-opacity"
            style={{ backgroundColor: BLUE_DARK }}
          >
            <UserCircle className="h-4 w-4" />
            Sign in
          </button>
          <button
            type="button"
            onClick={onSignUp}
            className="w-full rounded-lg border-2 py-3 text-sm font-bold hover:bg-[#f8f9ff] transition-colors"
            style={{ borderColor: BLUE, color: BLUE }}
          >
            Create account
          </button>
          <button
            type="button"
            onClick={onContinueGuest}
            disabled={continuing}
            className="w-full rounded-lg py-3 text-sm font-semibold text-[#434653] bg-[#f8f9ff] border border-[#dce9ff] hover:bg-[#eff4ff] disabled:opacity-60 transition-colors"
          >
            {continuing ? 'Adding…' : 'Continue without account'}
          </button>
          <p className="text-center text-[11px] text-[#737784] pt-1">
            Guest checkout — we&apos;ll use your email at checkout to reach you about delivery.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

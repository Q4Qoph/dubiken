import Link from 'next/link';
import DubikenLogo from '@/components/DubikenLogo';

const FOOTER_BG = '#dce9ff';

export default function AdminPageFooter() {
  return (
    <footer style={{ backgroundColor: FOOTER_BG }} className="border-t border-[#c3c6d5]">
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <DubikenLogo href="/" size="sm" />
        <div className="flex flex-wrap justify-center gap-4 text-black">
          <Link href="#">Sourcing Guide</Link>
          <Link href="#">Shipping Policy</Link>
          <Link href="#">Tracking</Link>
          <Link href="#">Contact Support</Link>
          <Link href="#">Terms of Service</Link>
        </div>
        <p className="text-[#737784]">
          © {new Date().getFullYear()} Dubiken Global. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

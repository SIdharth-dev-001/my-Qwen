import React from 'react';
import { APP_VERSION } from '../../utils/constants';

export function Footer() {
  return (
    <footer className="py-4 border-t border-zinc-900 select-none text-center text-[10px] font-mono text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
        <span>© 2026 My Qwen Assistant. All rights reserved.</span>
        <span>Version {APP_VERSION} (Fluid Canvas Beta)</span>
      </div>
    </footer>
  );
}

export default Footer;

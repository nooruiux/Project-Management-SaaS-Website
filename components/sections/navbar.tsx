"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { authNav, primaryNav, type NavItem } from "@/content/navigation";
import { cn } from "@/lib/utils";
import chevronDown from "@/public/figma/icon-chevron-down.svg";

const navItemClass =
  "inline-flex items-center gap-1 rounded-sm p-2.5 text-base leading-6 font-medium text-ink transition-colors hover:text-primary";

function Chevron({ open }: { open: boolean }) {
  return (
    <Image
      src={chevronDown}
      alt=""
      width={12}
      height={12}
      unoptimized
      className={cn("transition-transform", open && "rotate-180")}
    />
  );
}

function DesktopDropdown({
  item,
  open,
  onOpenChange,
}: {
  item: NavItem & { menu: NonNullable<NavItem["menu"]> };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const panelId = useId();
  const wrapperRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          onOpenChange(false);
          buttonRef.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) onOpenChange(false);
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpenChange(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onOpenChange(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        className={navItemClass}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
      >
        {item.label}
        <Chevron open={open} />
      </button>
      {/* pt-2 bridges the gap so the hover state survives moving into the panel. */}
      <div id={panelId} hidden={!open} className="absolute top-full left-0 z-10 pt-2">
        <ul className="min-w-60 rounded-md border border-border bg-surface p-2 shadow-xl">
          {item.menu.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-base leading-6 font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                onClick={() => onOpenChange(false)}
              >
                {link.label}
                {link.badge ? <Badge variant="new">{link.badge}</Badge> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function MobileSheet({
  onClose,
  returnFocusRef,
}: {
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const returnTarget = returnFocusRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      returnTarget?.focus();
    };
  }, [returnFocusRef]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  // Portalled to <body>: the header's backdrop-filter would otherwise become the containing block for `fixed`.
  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden" onKeyDown={onKeyDown}>
      <div aria-hidden="true" className="animate-fade-in absolute inset-0 bg-ink/40" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-sheet-in absolute inset-y-0 right-0 flex h-dvh w-full max-w-sm flex-col bg-surface shadow-xl"
      >
        <h2 id={titleId} className="sr-only">
          Menu
        </h2>
        <div className="flex h-24 shrink-0 items-center justify-between px-5">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-sm text-ink hover:bg-surface-muted"
          >
            <X aria-hidden="true" className="size-6" strokeWidth={1.75} />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pb-6">
          <ul className="flex flex-col">
            {primaryNav.map((item) =>
              item.menu ? (
                <li key={item.label} className="border-b border-border">
                  <button
                    type="button"
                    aria-expanded={expanded === item.label}
                    aria-controls={`mobile-${item.label}`}
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    className="flex min-h-14 w-full items-center justify-between text-lg font-semibold text-ink"
                  >
                    {item.label}
                    <Chevron open={expanded === item.label} />
                  </button>
                  <ul id={`mobile-${item.label}`} hidden={expanded !== item.label} className="pb-3">
                    {item.menu.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="flex min-h-11 items-center gap-3 text-base font-medium text-ink-muted hover:text-ink"
                        >
                          {link.label}
                          {link.badge ? <Badge variant="new">{link.badge}</Badge> : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.label} className="border-b border-border">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-14 items-center text-lg font-semibold text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="flex shrink-0 flex-col gap-3 border-t border-border p-5">
          <Button href={authNav.login.href} variant="secondary" className="w-full" onClick={onClose}>
            {authNav.login.label}
          </Button>
          <Button href={authNav.cta.href} className="w-full" onClick={onClose}>
            {authNav.cta.label}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet if the viewport grows to the desktop layout.
  useEffect(() => {
    if (!sheetOpen) return;
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && setSheetOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [sheetOpen]);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  return (
    <header
      className={cn(
        // Divider is an inset shadow (not a border) so the bar stays exactly 96px like Figma.
        "sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-200",
        scrolled ? "bg-surface/80 shadow-[inset_0_-1px_0_var(--color-border)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      {/* Figma 1:2303: 1240px content row, 24px vertical padding, 48px tall controls. */}
      <div className="mx-auto flex h-24 w-full max-w-[calc(1240px+2*var(--gutter))] items-center justify-between gap-8 px-(--gutter) [--gutter:20px] md:[--gutter:32px]">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-3">
              {primaryNav.map((item) =>
                item.menu ? (
                  <DesktopDropdown
                    key={item.label}
                    item={{ ...item, menu: item.menu }}
                    open={openMenu === item.label}
                    onOpenChange={(open) =>
                      setOpenMenu((current) => (open ? item.label : current === item.label ? null : current))
                    }
                  />
                ) : (
                  <li key={item.label}>
                    <Link href={item.href} className={navItemClass}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
        <div className="hidden items-center lg:flex">
          <Button href={authNav.login.href} variant="ghost">
            {authNav.login.label}
          </Button>
          <Button href={authNav.cta.href}>{authNav.cta.label}</Button>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-sm text-ink hover:bg-surface-muted lg:hidden"
          aria-label="Open menu"
          aria-expanded={sheetOpen}
          aria-haspopup="dialog"
          onClick={() => setSheetOpen(true)}
        >
          <Menu aria-hidden="true" className="size-6" strokeWidth={1.75} />
        </button>
      </div>
      {sheetOpen ? <MobileSheet onClose={closeSheet} returnFocusRef={menuButtonRef} /> : null}
    </header>
  );
}

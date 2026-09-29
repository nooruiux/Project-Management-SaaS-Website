// In-page responsive checks. `pageChecks` is serialized into the page by Playwright, so it must be self-contained.

/**
 * @param {{ fresh: boolean, touchRules?: boolean }} opts
 *   fresh      — page was just loaded at this size (srcset choice + CLS are meaningful)
 *   touchRules — force ≥44px tap targets on/off; default: width < 1280 or a hover:none / pointer:coarse device
 *                (the same condition as the site's `touch:` Tailwind variant)
 */
export function pageChecks(opts) {
  const W = document.documentElement.clientWidth;
  const H = window.innerHeight;
  const fails = [];
  const info = {};
  const fail = (check, detail) => fails.push({ check, detail: String(detail).slice(0, 160) });

  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const label = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("alt") || "").trim().replace(/\s+/g, " ").slice(0, 40);
    const section = el.closest("section[id], section[aria-labelledby], footer, header, [role=dialog]");
    const where = section ? section.id || section.getAttribute("aria-labelledby") || section.tagName.toLowerCase() : "page";
    return `${el.tagName.toLowerCase()}${id}${label ? ` "${label}"` : ""} @${where}`;
  };
  const isShown = (el) =>
    el.checkVisibility
      ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true })
      : el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
  const srOnly = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      if (cs.position === "absolute" && r.width <= 1 && r.height <= 1 && cs.overflow !== "visible") return true;
      // Visually-hidden patterns: clip: rect(0 0 0 0) / clip-path: inset(50%).
      if (cs.position === "absolute" && (/rect\(0px,? 0px,? 0px,? 0px\)/.test(cs.clip) || /inset\(50%\)/.test(cs.clipPath))) return true;
    }
    return false;
  };
  const clips = (cs) => cs.overflowX !== "visible" || cs.overflowY !== "visible";
  const scrolls = (cs) => /auto|scroll/.test(cs.overflowX) || /auto|scroll/.test(cs.overflowY);
  /** Nearest ancestor (below <body>) that clips its content, or null. */
  const clipParent = (el) => {
    for (let n = el.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
      if (clips(getComputedStyle(n))) return n;
    }
    return null;
  };
  const inView = (r) => r.left >= -1 && r.right <= W + 1;

  // 1. Horizontal page scroll.
  const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  if (sw > W) fail("h-scroll", `scrollWidth ${sw} > ${W}`);

  const all = [...document.body.querySelectorAll("*")].filter((el) => !["SCRIPT", "STYLE", "LINK", "META", "NOSCRIPT", "BR"].includes(el.tagName));
  const shown = all.filter((el) => isShown(el) && !srOnly(el));

  // 2. Elements escaping the viewport without a clipping ancestor inside the viewport.
  const escaped = [];
  for (const el of shown) {
    if (getComputedStyle(el).position === "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || inView(r)) continue;
    let p = clipParent(el);
    let contained = false;
    while (p) {
      if (inView(p.getBoundingClientRect())) { contained = true; break; }
      p = clipParent(p);
    }
    if (!contained && !el.closest("[data-qa-bleed]")) escaped.push(el);
  }
  // Report only the outermost escaping elements.
  for (const el of escaped) if (!escaped.some((o) => o !== el && o.contains(el))) fail("overflow", `${describe(el)} spans ${Math.round(el.getBoundingClientRect().left)}…${Math.round(el.getBoundingClientRect().right)} of ${W}`);

  // 3. Text: collect visible text runs (per line box).
  const runs = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (t) => (t.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const el = t.parentElement;
    if (!el || ["SCRIPT", "STYLE", "NOSCRIPT", "TITLE"].includes(el.tagName) || !isShown(el) || srOnly(el)) continue;
    const range = document.createRange();
    range.selectNodeContents(t);
    for (const r of range.getClientRects()) if (r.width > 1 && r.height > 1) runs.push({ el, r });
  }

  // 3a. Clipped text: text box sticking out of a non-scrolling clipping ancestor, or an ellipsis-truncated element.
  const clippedSeen = new Set();
  for (const { el, r } of runs) {
    if (clippedSeen.has(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth + 1) {
      clippedSeen.add(el);
      fail("text-clipped", `${describe(el)} truncated (${el.scrollWidth} > ${el.clientWidth})`);
      continue;
    }
    for (let p = clipParent(el); p; p = clipParent(p)) {
      const pcs = getComputedStyle(p);
      if (scrolls(pcs)) break; // inside an intended scroller — reachable by scrolling
      const pr = p.getBoundingClientRect();
      if (r.left < pr.left - 1 || r.right > pr.right + 1 || r.top < pr.top - 1 || r.bottom > pr.bottom + 1) {
        if (!p.closest("[data-qa-marquee]")) {
          clippedSeen.add(el);
          fail("text-clipped", `${describe(el)} cut by ${p.tagName.toLowerCase()}.${String(p.className).split(" ")[0]}`);
        }
        break;
      }
    }
  }

  // 3b. Overlapping text runs from different elements.
  const overlaps = new Set();
  for (let i = 0; i < runs.length; i++) {
    for (let j = i + 1; j < runs.length; j++) {
      const a = runs[i], b = runs[j];
      if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const x = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const y = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (x > 2 && y > 2) {
        const key = describe(a.el) + " × " + describe(b.el);
        if (!overlaps.has(key)) { overlaps.add(key); fail("text-overlap", key); }
      }
    }
  }

  // 4. Tap targets.
  const touchRules = opts.touchRules ?? (W < 1280 || matchMedia("(hover: none), (pointer: coarse)").matches);
  info.touchRules = touchRules;
  if (touchRules) {
    const sel = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=switch], [role=button], [tabindex]:not([tabindex="-1"])';
    for (const el of document.querySelectorAll(sel)) {
      if (!isShown(el) || srOnly(el) || el.disabled || el.closest("[inert], [aria-hidden=true]")) continue;
      let r = el.getBoundingClientRect();
      const label = el.closest("label") || (el.id && document.querySelector(`label[for="${el.id}"]`));
      if (label) {
        const lr = label.getBoundingClientRect();
        r = { width: Math.max(r.width, lr.width), height: Math.max(r.height, lr.height) };
      }
      if (r.width < 43.5 || r.height < 43.5) fail("tap-target", `${describe(el)} ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
  }

  // 5. Typography. Words → visual lines (words whose tops are within 8px share a line; inline badges shift a few px).
  const wordLines = (el) => {
    const words = [];
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let t = tw.nextNode(); t; t = tw.nextNode()) {
      if (srOnly(t.parentElement)) continue;
      for (const m of t.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(t, m.index);
        range.setEnd(t, m.index + m[0].length);
        const r = range.getBoundingClientRect();
        if (r.width > 0) words.push({ w: m[0], top: r.top, left: r.left, right: r.right });
      }
    }
    const lines = [];
    for (const word of words.sort((a, b) => a.top - b.top)) {
      const line = lines.find((l) => Math.abs(l.top - word.top) <= 8);
      if (line) {
        line.words.push(word.w);
        line.left = Math.min(line.left, word.left);
        line.right = Math.max(line.right, word.right);
      } else lines.push({ top: word.top, words: [word.w], left: word.left, right: word.right });
    }
    return lines;
  };
  // Desktop (≥1280) is locked to the Figma frame: line length there is reported, not failed.
  const figmaLocked = W >= 1280;
  info.lineLength = [];
  for (const p of document.querySelectorAll("main p, footer p")) {
    if (!isShown(p) || srOnly(p) || p.closest("[data-qa-mockup]")) continue;
    const text = p.textContent.trim().replace(/\s+/g, " ");
    if (text.length < 40) continue;
    const fs = parseFloat(getComputedStyle(p).fontSize);
    if (W < 768 && fs < 15.5) fail("body-size", `${describe(p)} ${fs}px`);
    const lines = wordLines(p);
    if (lines.length >= 2) {
      const full = lines.slice(0, -1).map((l) => l.words.join(" ").length + 1); // +1: the space at the break
      const max = Math.max(...full);
      const avg = full.reduce((a, b) => a + b, 0) / full.length;
      if (max > 75) {
        if (figmaLocked) info.lineLength.push(`${describe(p)} ${max}ch`);
        else fail("line-length", `${describe(p)} ${max}ch/line`);
      }
      if (!figmaLocked && W >= 768 && avg < 45 && text.length >= 120) fail("line-length", `${describe(p)} ${Math.round(avg)}ch/line (short)`);
    }
  }
  // Orphans: a heading whose last line is a single short word (< 40% of the widest line). A long word that
  // fills most of its line on a narrow phone isn't an orphan — no break can avoid it and it reads balanced.
  for (const h of document.querySelectorAll("main h1, main h2, footer h2")) {
    if (!isShown(h) || srOnly(h)) continue;
    const lines = wordLines(h);
    if (lines.length < 2) continue;
    const last = lines[lines.length - 1];
    const widest = Math.max(...lines.map((l) => l.right - l.left));
    if (last.words.length === 1 && last.right - last.left < 0.4 * widest) fail("orphan", `${describe(h)} ends with lone "${last.words[0]}"`);
  }
  // Primary CTA inside the first viewport on portrait phones (the brief's 375×667 class: ≥ 640px tall).
  if (W < 768 && H >= 640 && H > W) {
    const cta = document.querySelector('[aria-labelledby="hero-title"] a[href]:not([href^="#"]):is(.bg-primary)');
    const r = cta?.getBoundingClientRect();
    if (r && r.bottom + window.scrollY > H) fail("cta-fold", `hero CTA bottom ${Math.round(r.bottom + window.scrollY)} > ${H}`);
  }
  info.h1 = [...document.querySelectorAll("main h1")].filter(isShown).map((h) => parseFloat(getComputedStyle(h).fontSize));
  info.h2 = [...document.querySelectorAll("main section h2")].filter((h) => isShown(h) && !srOnly(h)).map((h) => parseFloat(getComputedStyle(h).fontSize));

  // 6. Images: srcset variant vs rendered size × DPR (only meaningful right after a fresh load).
  if (opts.fresh) {
    const dpr = window.devicePixelRatio;
    for (const img of document.querySelectorAll("img[srcset]")) {
      const r = img.getBoundingClientRect();
      if (!isShown(img) || r.width < 2 || !img.currentSrc) continue;
      const cand = img.srcset.split(",").map((s) => parseInt(s.trim().split(/\s+/)[1], 10)).filter(Boolean).sort((a, b) => a - b);
      const chosen = parseInt(new URL(img.currentSrc, location.href).searchParams.get("w") || "0", 10);
      if (!chosen || cand.length < 2) continue;
      const need = r.width * dpr;
      const ideal = cand.find((c) => c >= need) ?? cand[cand.length - 1];
      if (chosen < Math.min(need, cand[cand.length - 1]) * 0.85) fail("img-blurry", `${describe(img)} ${chosen}w for ${Math.round(need)}px`);
      else if (chosen > ideal && chosen > need * 2) fail("img-oversized", `${describe(img)} ${chosen}w for ${Math.round(need)}px (ideal ${ideal}w)`);
    }
  }
  return { W, H, fails, info };
}

/** Page-wide / device-specific checks that don't depend on width. */
export function deviceChecks() {
  const fails = [];
  const fail = (check, detail) => fails.push({ check, detail: String(detail).slice(0, 160) });
  const css = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) css.push(rule);
    } catch {
      /* cross-origin */
    }
  }
  const text = css.map((r) => r.cssText).join("\n");

  const vp = document.querySelector('meta[name="viewport"]')?.content ?? "";
  if (!/viewport-fit\s*=\s*cover/.test(vp)) fail("viewport-fit", `viewport meta "${vp}"`);
  if (!/safe-area-inset/.test(text)) fail("safe-area", "no env(safe-area-inset-*) in CSS");
  if (/(^|[^d])100vh/.test(text) || /\b100vh\b/.test(text)) fail("vh-units", "100vh used (use svh/dvh)");

  // Declarations that apply on :hover must be gated by (hover: hover) and (pointer: fine).
  // Tailwind v4 nests them: `.x { &:hover { @media (hover: hover) { … } } }`, so track both as we descend.
  const bad = [];
  const gated = (conds) => /hover:\s*hover/.test(conds) && /pointer:\s*fine/.test(conds);
  const walk = (rules, conds, inHover, sel) => {
    for (const r of rules) {
      if (r.media) walk(r.cssRules, `${conds} ${r.media.mediaText}`, inHover, sel);
      else if (r.selectorText !== undefined) {
        const h = inHover || r.selectorText.includes(":hover");
        if (h && r.style?.length && !gated(conds)) bad.push(r.selectorText);
        if (r.cssRules?.length) walk(r.cssRules, conds, h, r.selectorText);
      } else if (r.style && !r.cssRules) {
        if (inHover && r.style.length && !gated(conds)) bad.push(sel); // CSSNestedDeclarations
      } else if (r.cssRules) walk(r.cssRules, conds, inHover, sel); // @supports, @layer
    }
  };
  walk(css, "", false, "");
  if (bad.length) fail("hover-media", `${bad.length} :hover rules outside (hover:hover) and (pointer:fine), e.g. ${bad[0]}`);

  const email = document.querySelector('input[type="email"]');
  if (email && parseFloat(getComputedStyle(email).fontSize) < 16) fail("ios-zoom", `newsletter input ${getComputedStyle(email).fontSize}`);

  const link = document.querySelector("a[href]");
  const tap = link && getComputedStyle(link).webkitTapHighlightColor;
  if (tap && !/rgba\(0, 0, 0, 0\)|transparent/.test(tap)) fail("tap-highlight", `-webkit-tap-highlight-color ${tap}`);

  if (!/@supports[^{]*backdrop-filter/.test(text)) fail("backdrop-fallback", "no @supports fallback for backdrop-filter");
  return { fails };
}

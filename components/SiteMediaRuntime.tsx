"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import InlineSiteEditor from "@/components/InlineSiteEditor";
import { designTargets, isSafeDesignSelector } from "@/lib/site-design";
import type { SiteContent, SiteDesign } from "@/lib/site-content";

type SiteMediaResponse = {
  siteMedia?: Record<string, string>;
  design?: {
    fonts?: Record<string, string>;
    colors?: Record<string, string>;
    placements?: SiteDesign["placements"];
  };
};

export default function SiteMediaRuntime() {
  const pathname = usePathname();
  const [previewActive, setPreviewActive] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewMessage, setPreviewMessage] = useState("");

  useEffect(() => {
    let alive = true;
    let overrides: Record<string, string> = {};

    const replaceCssUrls = (value: string, slot: string) => value.replace(/url\((['"]?)(.*?)\1\)/g, (whole) => {
      const replacement = overrides[slot];
      return replacement ? `url("${replacement}")` : whole;
    });

    const updateImage = (image: HTMLImageElement) => {
      const slot = image.dataset.melpMediaId;
      if (!slot) return;
      const current = image.getAttribute("src") || "";
      const applied = image.dataset.melpMediaApplied;
      if (!image.dataset.melpMediaOriginal || current !== applied) image.dataset.melpMediaOriginal = current;
      const original = image.dataset.melpMediaOriginal;
      const replacement = overrides[slot];
      if (replacement && current !== replacement) {
        image.dataset.melpMediaApplied = replacement;
        image.setAttribute("src", replacement);
      } else if (!replacement && current !== original) {
        delete image.dataset.melpMediaApplied;
        image.setAttribute("src", original);
      }
    };

    const updateBackground = (element: HTMLElement) => {
      const slot = element.dataset.melpMediaId;
      if (!slot) return;
      const current = element.style.backgroundImage;
      const applied = element.dataset.melpMediaBackgroundApplied;
      if (!element.dataset.melpMediaBackgroundOriginal || current !== applied) element.dataset.melpMediaBackgroundOriginal = current;
      const original = element.dataset.melpMediaBackgroundOriginal;
      const next = replaceCssUrls(original, slot);
      if (next !== current) {
        element.dataset.melpMediaBackgroundApplied = next;
        element.style.backgroundImage = next;
      }
    };

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLImageElement) updateImage(root);
      if (root instanceof HTMLElement) updateBackground(root);
      root.querySelectorAll("img").forEach(updateImage);
      root.querySelectorAll<HTMLElement>("[style]").forEach(updateBackground);
    };

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "childList") record.addedNodes.forEach((node) => { if (node instanceof HTMLElement) scan(node); });
        else if (record.target instanceof HTMLImageElement) updateImage(record.target);
        else if (record.target instanceof HTMLElement) updateBackground(record.target);
      }
    });

    scan(document);
    observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["src", "style", "data-melp-media-id"] });
    fetch("/api/site-content", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<SiteMediaResponse> : null)
      .then((content) => {
        if (!alive || !content) return;
        overrides = content.siteMedia ?? {};
        const root = document.documentElement;
        const savedDesign = content.design as SiteDesign | undefined;
        let previewDesign: SiteDesign | undefined;
        const previewEnabled = sessionStorage.getItem("melp-design-preview-active") === "1" && pathname !== "/admin";
        if (previewEnabled) {
          try { previewDesign = JSON.parse(sessionStorage.getItem("melp-design-preview") || "null") as SiteDesign | undefined; } catch { previewDesign = undefined; }
        }
        const design = previewDesign ?? savedDesign;
        setPreviewActive(Boolean(previewEnabled && previewDesign));
        setPreviewMessage("");
        const fonts = design?.fonts;
        const colors = design?.colors;
        const fontStack = (font: string | undefined, fallback: string) => font ? `"${font.replace(/["\\]/g, "")}", ${fallback}` : fallback;
        if (fonts) {
          const placementFonts = (design?.placements ?? []).map(rule => rule.fontFamily);
          const availableFonts = [...new Set([...Object.values(fonts), ...placementFonts].filter((font): font is string => typeof font === "string" && /^[\p{L}\p{N} .'-]{1,80}$/u.test(font)))];
          let fontLink = document.querySelector<HTMLLinkElement>("link[data-melp-google-fonts]");
          if (!fontLink) {
            fontLink = document.createElement("link");
            fontLink.rel = "stylesheet";
            fontLink.dataset.melpGoogleFonts = "";
            document.head.appendChild(fontLink);
          }
          fontLink.href = availableFonts.length
            ? `https://fonts.googleapis.com/css2?${availableFonts.map(font => `family=${encodeURIComponent(font).replace(/%20/g, "+")}`).join("&")}&display=swap`
            : "";
          root.style.setProperty("--site-font-title", fontStack(fonts.title, "Georgia, serif"));
          root.style.setProperty("--site-font-subtitle", fontStack(fonts.subtitle, "Georgia, serif"));
          root.style.setProperty("--site-font-minor-title", fontStack(fonts.minorTitle, "Georgia, serif"));
          root.style.setProperty("--site-font-body", fontStack(fonts.body, "Arial, sans-serif"));
          root.style.setProperty("--site-font-accent", fontStack(fonts.accent, "cursive"));
          root.style.setProperty("--site-font-interface", fontStack(fonts.interface, "Arial, sans-serif"));
        }
        if (colors) {
          const cssNames: Record<string, string> = { background: "--site-color-background", section: "--site-color-section", surface: "--site-color-surface", heading: "--site-color-heading", text: "--site-color-text", muted: "--site-color-muted", accent: "--site-color-accent", buttonText: "--site-color-button-text", border: "--site-color-border", footer: "--site-color-footer" };
          Object.entries(cssNames).forEach(([key, name]) => { const value = colors[key as keyof SiteDesign["colors"]]; if (value) root.style.setProperty(name, value); });
        }
        let overrideStyle = document.querySelector<HTMLStyleElement>("style[data-melp-design-overrides]");
        if (!overrideStyle) {
          overrideStyle = document.createElement("style");
          overrideStyle.dataset.melpDesignOverrides = "";
          document.head.appendChild(overrideStyle);
        }
        const cssRules = (design?.placements ?? []).flatMap(rule => {
          const target = designTargets.find(item => item.id === rule.target);
          const selector = rule.target === "custom" ? (isSafeDesignSelector(rule.selector) ? rule.selector : "") : target?.selector;
          if (!selector) return [];
          const declarations = [
            /^#[0-9a-f]{6}$/i.test(rule.color) ? `color:${rule.color}!important` : "",
            rule.useGradient && /^#[0-9a-f]{6}$/i.test(rule.gradientStart) && /^#[0-9a-f]{6}$/i.test(rule.gradientEnd) && Number.isInteger(rule.gradientAngle) && rule.gradientAngle >= 0 && rule.gradientAngle <= 360
              ? `background:linear-gradient(${rule.gradientAngle}deg,${rule.gradientStart},${rule.gradientEnd})!important`
              : /^#[0-9a-f]{6}$/i.test(rule.background) ? `background:${rule.background}!important` : "",
            rule.fontFamily && /^[\p{L}\p{N} .'-]{1,80}$/u.test(rule.fontFamily) ? `font-family:"${rule.fontFamily}"!important` : "",
          ].filter(Boolean).join(";");
          if (!declarations) return [];
          const scoped = rule.target === "site-background" ? selector : selector.split(",").map(part => `body:not(:has(.admin-shell)):not(.admin-shell):not(.admin-shell) ${part.trim()}`).join(",");
          return [`${scoped}{${declarations}}`];
        });
        overrideStyle.textContent = cssRules.join("\n");
        scan(document);
      })
      .catch(() => undefined);

    return () => { alive = false; observer.disconnect(); };
  }, [pathname]);

  async function publishPreview() {
    setPreviewBusy(true);
    setPreviewMessage("");
    try {
      const design = JSON.parse(sessionStorage.getItem("melp-design-preview") || "null") as SiteDesign | null;
      const password = sessionStorage.getItem("melp-admin-password") ?? "";
      if (!design || !password) throw new Error("Retourne dans l’administration pour relancer l’aperçu.");
      const response = await fetch("/api/site-content", { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible de charger le contenu actuel.");
      const content = await response.json() as SiteContent;
      const save = await fetch("/api/site-content", { method: "PUT", headers: { "Content-Type": "application/json", "x-melp-admin-password": password }, body: JSON.stringify({ ...content, design }) });
      const result = await save.json().catch(() => null) as { error?: string } | null;
      if (!save.ok) throw new Error(result?.error ?? "La publication a échoué.");
      sessionStorage.removeItem("melp-design-preview-active");
      sessionStorage.removeItem("melp-design-preview");
      sessionStorage.setItem("melp-admin-preview-draft", JSON.stringify({ ...content, design }));
      sessionStorage.setItem("melp-admin-preview-result", "Design enregistré et publié.");
      setPreviewActive(false);
      window.location.assign("/admin?preview=published");
    } catch (error) {
      setPreviewMessage(error instanceof Error ? error.message : "La publication a échoué.");
    } finally { setPreviewBusy(false); }
  }

  function cancelPreview() {
    sessionStorage.removeItem("melp-design-preview-active");
    sessionStorage.removeItem("melp-design-preview");
    sessionStorage.setItem("melp-admin-preview-result", "Aperçu annulé. Tes réglages sont toujours disponibles dans l’administration.");
  }

  return <>{previewActive && <aside className="site-theme-preview-toolbar"><div><strong>Aperçu privé du design</strong><span>Les changements ne sont pas publiés tant que tu ne les enregistres pas.</span></div>{previewMessage && <p role="status">{previewMessage}</p>}<button type="button" onClick={() => void publishPreview()} disabled={previewBusy}>{previewBusy ? "Publication…" : "Enregistrer et publier"}</button><a className="site-theme-preview-cancel" href="/admin?preview=cancelled" onClick={cancelPreview}>Annuler et retourner aux réglages</a></aside>}{previewMessage && !previewActive && <div className="site-theme-published-message" role="status">{previewMessage}</div>}<InlineSiteEditor /></>;
}

"use client";

import { useEffect } from "react";

type SiteMediaResponse = { siteMedia?: Record<string, string> };

export default function SiteMediaRuntime() {
  useEffect(() => {
    let alive = true;
    let overrides: Record<string, string> = {};

    const replaceCssUrls = (value: string, slot: string) => value.replace(/url\((['"]?)(.*?)\1\)/g, (whole, _quote: string) => {
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
        if (!alive || !content?.siteMedia) return;
        overrides = content.siteMedia;
        scan(document);
      })
      .catch(() => undefined);

    return () => { alive = false; observer.disconnect(); };
  }, []);

  return null;
}

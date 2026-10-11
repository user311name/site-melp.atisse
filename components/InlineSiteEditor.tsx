"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/site-content";

type EditableSpan = HTMLSpanElement & { dataset: DOMStringMap & { inlineTextKey?: string } };

function elementPath(element: Element) {
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.body) {
    const signature = `${current.tagName.toLowerCase()}.${Array.from(current.classList).sort().join(".")}`;
    const siblings = current.parentElement ? Array.from(current.parentElement.children).filter(item => `${item.tagName.toLowerCase()}.${Array.from(item.classList).sort().join(".")}` === signature) : [];
    parts.unshift(`${signature}[${Math.max(0, siblings.indexOf(current))}]`);
    current = current.parentElement;
  }
  return parts.join(">");
}

export default function InlineSiteEditor() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [linkKey, setLinkKey] = useState("");
  const [linkValue, setLinkValue] = useState("");
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [linkValues, setLinkValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const enabled = sessionStorage.getItem("melp-site-copy-edit") === "1" && pathname !== "/admin";
    if (pathname === "/admin") return;

    let alive = true;
    let scanning = false;
    let textMap: Record<string, string> = {};
    let linksMap: Record<string, string> = {};
    let observer: MutationObserver | undefined;
    let clickHandler: ((event: MouseEvent) => void) | undefined;
    let inputHandler: ((event: Event) => void) | undefined;

    fetch("/api/site-content", { cache: "no-store" })
      .then(response => response.ok ? response.json() as Promise<SiteContent> : Promise.reject(new Error("Impossible de charger les textes du site.")))
      .then(content => {
        if (!alive) return;
        setActive(enabled);
        setMessage("");
        textMap = content.inlineText ?? {};
        linksMap = content.inlineLinks ?? {};
        setTextValues(textMap);
        setLinkValues(linksMap);

        const makeKey = (element: Element, kind: "text" | "link", index = 0) => {
          const scope = element.closest(".site-header") ? "global" : pathname;
          return `${scope}|${kind}|${elementPath(element)}|${index}`;
        };

        const scan = () => {
          if (!alive || scanning) return;
          scanning = true;
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          const nodes: Text[] = [];
          while (walker.nextNode()) nodes.push(walker.currentNode as Text);
          const indexes = new Map<Element, number>();
          for (const node of nodes) {
            const parent = node.parentElement;
            const value = node.nodeValue ?? "";
            if (!parent || !value.trim() || parent.closest("script,style,noscript,svg,textarea,select,option,.admin-shell,.site-inline-toolbar,.site-theme-preview-toolbar,[aria-hidden='true'],.managed-page-sections,.managed-page-section,.pas-product,.pas-modal,.grocery-card,.value-card,.review-wall-card,.event-card,.experience-card,.hero-card,.about-story,.values-intro,.home-hero,.warm-hero,.pas-hero,.events-hero,.contact-hero,.simple-hero,[contenteditable='true']")) continue;
            if (parent.closest("[data-inline-text-key]")) continue;
            const index = indexes.get(parent) ?? 0;
            indexes.set(parent, index + 1);
            const key = makeKey(parent, "text", index);
            const replacement = textMap[key];
            if (!enabled) {
              if (replacement !== undefined && node.nodeValue !== replacement) node.nodeValue = replacement;
              continue;
            }
            const span = document.createElement("span") as EditableSpan;
            span.dataset.inlineTextKey = key;
            span.dataset.inlineDefault = value;
            span.textContent = replacement ?? value;
            parent.replaceChild(span, node);
          }

          document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(anchor => {
            if (anchor.closest(".admin-shell,.site-inline-toolbar,.site-theme-preview-toolbar,[aria-hidden='true'],.managed-page-sections,.managed-page-section,.pas-product,.pas-modal,.grocery-card,.value-card,.review-wall-card,.event-card,.experience-card,.hero-card,.about-story,.values-intro,.home-hero,.warm-hero,.pas-hero,.events-hero,.contact-hero,.simple-hero")) return;
            let key = anchor.dataset.inlineLinkKey;
            if (!key) {
              key = makeKey(anchor, "link");
              anchor.dataset.inlineLinkKey = key;
              anchor.dataset.inlineLinkDefault = anchor.getAttribute("href") ?? "";
            }
            const replacement = linksMap[key];
            if (Object.prototype.hasOwnProperty.call(linksMap, key) && anchor.getAttribute("href") !== replacement) anchor.setAttribute("href", replacement);
          });
          scanning = false;
        };

        scan();
        observer = new MutationObserver(scan);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-hidden"] });

        clickHandler = event => {
          const target = event.target;
          if (!(target instanceof Element) || target.closest(".site-inline-toolbar,.site-theme-preview-toolbar")) return;
          const span = target.closest<EditableSpan>("[data-inline-text-key]");
          const anchor = target.closest<HTMLAnchorElement>("a[href]");
          if (!span && !anchor) {
            if (target.closest("button,input,textarea,select,form")) {
              event.preventDefault();
              event.stopPropagation();
            }
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          const nextLinkKey = anchor?.dataset.inlineLinkKey ?? "";
          setLinkKey(nextLinkKey);
          setLinkValue(anchor?.getAttribute("href") ?? "");
          if (!span) {
            setMessage("Lien sélectionné. Tu peux modifier son adresse dans la barre en haut.");
            return;
          }
          document.querySelectorAll<HTMLElement>("[data-inline-text-key][contenteditable='true']").forEach(item => item.setAttribute("contenteditable", "false"));
          span.setAttribute("contenteditable", "true");
          span.focus();
          setMessage("Clique sur un autre texte pour le modifier, ou enregistre les changements.");
        };
        document.addEventListener("click", clickHandler, true);
        inputHandler = event => {
          const target = event.target;
          if (!(target instanceof HTMLElement) || !target.matches("[data-inline-text-key][contenteditable='true']")) return;
          const key = target.dataset.inlineTextKey;
          if (key) setTextValues(current => ({ ...current, [key]: target.innerText }));
        };
        document.addEventListener("input", inputHandler, true);
      })
      .catch(error => { if (alive) setMessage(error instanceof Error ? error.message : "Chargement des textes impossible."); });

    return () => {
      alive = false;
      observer?.disconnect();
      if (clickHandler) document.removeEventListener("click", clickHandler, true);
      if (inputHandler) document.removeEventListener("input", inputHandler, true);
    };
  }, [pathname]);

  if (!active) return null;

  function editLink(value: string) {
    setLinkValue(value);
    if (!linkKey) return;
    setLinkValues(current => ({ ...current, [linkKey]: value }));
    const anchor = document.querySelector<HTMLAnchorElement>(`[data-inline-link-key="${CSS.escape(linkKey)}"]`);
    if (anchor) anchor.setAttribute("href", value);
  }

  async function save() {
    setBusy(true);
    setMessage("");
    const password = sessionStorage.getItem("melp-admin-password") ?? "";
    try {
      const response = await fetch("/api/site-content", { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible de charger le contenu actuel du site.");
      const content = await response.json() as SiteContent;
      const saveResponse = await fetch("/api/site-content", { method: "PUT", headers: { "Content-Type": "application/json", "x-melp-admin-password": password }, body: JSON.stringify({ ...content, inlineText: { ...content.inlineText, ...textValues }, inlineLinks: { ...content.inlineLinks, ...linkValues } }) });
      const result = await saveResponse.json().catch(() => null) as { error?: string } | null;
      if (!saveResponse.ok) throw new Error(result?.error ?? "Enregistrement impossible.");
      setMessage("Modifications enregistrées et publiées sur le site.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");
    } finally {
      setBusy(false);
    }
  }

  function finish() {
    sessionStorage.removeItem("melp-site-copy-edit");
    sessionStorage.removeItem("melp-admin-password");
    setActive(false);
    router.push("/admin");
  }

  function goToPage(page: string) {
    if (page && page !== pathname) router.push(page);
  }

  return <aside className="site-inline-toolbar" aria-label="Modification directe du site">
    <div><strong>Mode modification</strong><span>Clique sur un texte pour le modifier sur cette page.</span></div>
    <label className="site-inline-page-select">Page<select value={pathname} onChange={event => goToPage(event.target.value)}><option value="/">Accueil</option><option value="/patisserie">Pâtisserie</option><option value="/epicerie">Épicerie</option><option value="/ateliers">Ateliers</option><option value="/cheffe-privee">Cheffe privée</option><option value="/cartes-cadeaux">Cartes cadeaux</option><option value="/commander">Commander</option><option value="/evenements">Événements</option><option value="/a-propos">À propos</option><option value="/collaborations">Collaborations</option><option value="/avis">Avis</option><option value="/contact">Contact</option></select></label>
    <label className="site-inline-link-edit">Lien sélectionné<input value={linkValue} onChange={event => editLink(event.target.value)} placeholder="URL, adresse e-mail ou téléphone" disabled={!linkKey}/></label>
    {message && <p role="status">{message}</p>}
    <button type="button" onClick={() => void save()} disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
    <button type="button" className="site-inline-finish" onClick={finish}>Retour à l’administration</button>
  </aside>;
}

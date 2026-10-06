import WarmPage from "@/components/WarmPage";
import EpicerieSelection from "@/app/epicerie/EpicerieSelection";
import { readSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function Epicerie() {
  const content = (await readSiteContent()).epicerie;
  return (
    <WarmPage eyebrow={content.eyebrow} title={content.title} emphasis={content.emphasis} intro={content.intro} image={content.heroImage} imageAlt={content.heroImageAlt} cta="Voir la sélection">
      <span className="warm-eyebrow">{content.selectionEyebrow}</span>
      <h2>{content.selectionTitle} <em>{content.selectionEmphasis}</em></h2>
      <p>{content.selectionIntro}</p>
      <EpicerieSelection products={content.products}/>
      <div className="warm-note">{content.note}</div>
    </WarmPage>
  );
}

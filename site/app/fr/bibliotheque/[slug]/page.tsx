import { DocumentPage, documentMetadata } from "../../../DocumentPage";
import { documents } from "../../../document-manifest.mjs";
export const generateStaticParams = () => documents.filter((doc) => doc.locale === "fr").map((doc) => ({ slug: doc.id }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return documentMetadata("fr", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <DocumentPage locale="fr" slug={(await params).slug} />; }

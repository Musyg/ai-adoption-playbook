import { DocumentPage, documentMetadata } from "../../DocumentPage";
import { documents } from "../../document-manifest.mjs";
export const generateStaticParams = () => documents.filter((doc) => doc.locale === "en").map((doc) => ({ slug: doc.id }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return documentMetadata("en", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <DocumentPage locale="en" slug={(await params).slug} />; }

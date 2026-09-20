import { DocumentPage, documentMetadata } from "../../DocumentPage";
export const generateMetadata = () => documentMetadata("fr");
export default function Page() { return <DocumentPage locale="fr" />; }

import { DocumentPage, documentMetadata } from "../DocumentPage";
export const generateMetadata = () => documentMetadata("en");
export default function Page() { return <DocumentPage locale="en" />; }

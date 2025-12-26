import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nawi Marketplace | Curated Enhancements",
    description: "Enhance your Nawi experience with our curated selection of lingerie, costumes, and atmospheric tools. Discreetly shipped to your venue or home.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

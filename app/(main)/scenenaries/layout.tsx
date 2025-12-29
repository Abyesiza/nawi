import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Honey Moon Experiences | Bespoke Romantic Scenes",
    description: "Explore our catalog of curated romantic and fantasy environments. From moonlit forests to celestial heights, we design the perfect backdrop for your intimacy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

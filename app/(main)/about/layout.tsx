import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Nawi | Our Philosophy & Privacy",
    description: "Learn about the magic behind Nawi's transformative experiences and our commitment to absolute anonymity through our unique identity model.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

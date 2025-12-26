import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Book Your Experience | Nawi",
    description: "Start your journey today. Select your theme, experience type, and venue preferences. Your anonymity is guaranteed throughout the process.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

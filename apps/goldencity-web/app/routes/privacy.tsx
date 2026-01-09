import { META_DESCRIPTION, META_TITLE } from "../constants";
import type { Route } from "./+types/privacy";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Privacy Policy - ${META_TITLE}` },
    { name: "description", content: META_DESCRIPTION },
  ];
}

export default function PrivacyRoute() {
  return (
    <div className="min-h-screen bg-primary text-text">
      <header className="border-b border-border bg-secondary">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-semibold">
            GoldenCity
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-text-secondary">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-text-secondary">
          <section>
            <h2 className="text-2xl font-semibold text-text">Introduction</h2>
            <p className="mt-2">
              GoldenCity ("we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, and
              safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text">
              Information We Collect
            </h2>
            <p className="mt-2">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="mt-2 list-disc pl-6">
              <li>Wallet address and blockchain transaction data</li>
              <li>KYC information (name, email, country)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text">
              How We Use Your Information
            </h2>
            <p className="mt-2">
              We use the information we collect to:
            </p>
            <ul className="mt-2 list-disc pl-6">
              <li>Provide and improve our services</li>
              <li>Verify your identity for KYC compliance</li>
              <li>Process transactions and manage your investments</li>
              <li>Communicate with you about your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text">
              Data Security
            </h2>
            <p className="mt-2">
              We implement appropriate technical and organizational measures to
              protect your personal information. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text">Contact Us</h2>
            <p className="mt-2">
              If you have questions about this Privacy Policy, please contact us
              at privacy@goldencity-ymzw2sanaa-uc.a.run.app
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

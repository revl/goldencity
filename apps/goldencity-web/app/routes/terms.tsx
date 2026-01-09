import { Link } from "react-router";
import { META_DESCRIPTION, META_TITLE } from "../constants";
import type { Route } from "./+types/terms";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Terms of Service - ${META_TITLE}` },
    { name: "description", content: META_DESCRIPTION },
  ];
}

export default function TermsRoute() {
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
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-text-secondary">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-text-secondary">
          <section>
            <h2 className="text-2xl font-semibold text-text">
              Acceptance of Terms
            </h2>
            <p className="mt-2">
              By accessing and using GoldenCity, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text">
              Description of Service
            </h2>
            <p className="mt-2">
              GoldenCity is a Real-World Asset (RWA) SaaS platform that enables
              fractional ownership of real estate properties through blockchain
              technology. We facilitate cryptocurrency transactions for property
              investments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text">
              User Responsibilities
            </h2>
            <p className="mt-2">You agree to:</p>
            <ul className="mt-2 list-disc pl-6">
              <li>Provide accurate and complete information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Maintain the security of your wallet and account</li>
              <li>Not engage in any fraudulent or illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text">Risks</h2>
            <p className="mt-2">
              Investing in real estate through blockchain technology involves
              risks. You should carefully consider your investment objectives
              and risk tolerance before participating. Past performance does not
              guarantee future results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text">
              Limitation of Liability
            </h2>
            <p className="mt-2">
              GoldenCity shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of the
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text">Contact Us</h2>
            <p className="mt-2">
              If you have questions about these Terms of Service, please contact
              us at legal@goldencity-ymzw2sanaa-uc.a.run.app
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

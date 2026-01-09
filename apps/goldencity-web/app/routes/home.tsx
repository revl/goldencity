import { META_DESCRIPTION, META_TITLE } from "../constants";
import type { Route } from "./+types/home";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Building2, Coins, Globe, Shield } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: META_TITLE },
    { name: "description", content: META_DESCRIPTION },
  ];
}

export default function HomeRoute() {
  return (
    <div className="min-h-screen bg-primary text-text">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-primary/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">GoldenCity</div>
            <div className="text-sm text-text-secondary">
              Real-World Asset Investment
            </div>
          </div>
        </div>
        <Link
          to="/onboarding"
          className="hidden items-center gap-2 rounded-lg bg-accent px-4 py-2 text-base font-medium text-white shadow-sm sm:inline-flex"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Democratize Real Estate Investment
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            Leverage blockchain technology to make property ownership accessible
            to investors worldwide through fractional ownership and
            cryptocurrency transactions.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/onboarding"
              className="rounded-lg bg-accent px-6 py-3 text-base font-semibold text-white shadow-sm"
            >
              Connect Wallet
            </Link>
            <Link
              to="/terms"
              className="rounded-lg border border-border px-6 py-3 text-base font-semibold text-text hover:bg-secondary"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      Icon: Building2,
      title: "Fractional Ownership",
      description:
        "Own a portion of real estate properties, making investment accessible to everyone.",
    },
    {
      Icon: Coins,
      title: "Crypto Transactions",
      description:
        "Buy and sell property shares using cryptocurrency for seamless global transactions.",
    },
    {
      Icon: Globe,
      title: "Global Access",
      description:
        "Invest in real estate properties worldwide from anywhere, anytime.",
    },
    {
      Icon: Shield,
      title: "Secure & Transparent",
      description:
        "Blockchain technology ensures transparency and security for all transactions.",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Why GoldenCity?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Revolutionizing real estate investment through blockchain
            technology.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title, description }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border border-border bg-secondary p-6"
            >
              <Icon className="h-6 w-6 text-accent" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-text-secondary sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} GoldenCity. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/privacy" className="hover:text-text">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-text">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

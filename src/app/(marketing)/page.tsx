import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap, Target } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-accent" />,
      title: 'AI-Powered Assessment',
      description: 'Our AI analyzes your business in minutes, identifying gaps in GDPR, Bogforingsloven, NIS2, and EU AI Act compliance.'
    },
    {
      icon: <Target className="h-10 w-10 text-accent" />,
      title: 'Danish Regulation Expertise',
      description: 'Built specifically for Danish startups and SMBs. We translate complex EU directives into actionable Danish requirements.'
    },
    {
      icon: <Zap className="h-10 w-10 text-accent" />,
      title: 'Automated Compliance Tracking',
      description: 'Stay up‑to‑date with changing regulations. Get alerts when new obligations apply and track your progress over time.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Answer simple questions',
      description: 'Tell us about your business, data flows, and tech stack. No legal expertise needed.'
    },
    {
      number: '2',
      title: 'AI analyzes your compliance',
      description: 'Our system cross‑references your answers against current EU and Danish regulations.'
    },
    {
      number: '3',
      title: 'Get your actionable plan',
      description: 'Receive a prioritized roadmap with clear steps, templates, and deadlines.'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          EU Compliance on Autopilot for <span className="text-accent">Danish Startups</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          GDPR, Bogforingsloven, NIS2 and the EU AI Act — assessed by AI, tailored
          to Danish SMBs. Know where you stand in minutes, not weeks.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: 'lg' }), 'bg-accent text-accent-foreground hover:bg-accent/90')}
          >
            Start free assessment
          </Link>
          <Link
            href="/pricing"
            className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
          >
            See pricing
          </Link>
        </div>
      </section>

      {/* Penalty Stats Banner */}
      <section className="bg-muted py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-8 text-center shadow-sm">
              <div className="text-5xl font-bold text-destructive">€20M</div>
              <div className="mt-2 text-lg font-semibold">Maximum GDPR penalty</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Up to 4% of global annual turnover or €20 million — whichever is higher
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-8 text-center shadow-sm">
              <div className="text-5xl font-bold text-destructive">€10M</div>
              <div className="mt-2 text-lg font-semibold">NIS2 Directive fines</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Severe fines for insufficient cybersecurity measures under the new EU directive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why choose EUComply?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Built by compliance experts and AI engineers to give Danish businesses a clear,
            affordable path to full EU compliance.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-border shadow-sm transition-all hover:shadow-md">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Three simple steps from uncertainty to compliance confidence.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-muted-foreground">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="absolute top-8 left-3/4 hidden h-0.5 w-full bg-border md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to automate your compliance?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Join Danish startups who have already discovered where they stand.
          No credit card required.
        </p>
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: 'lg' }), 'mt-10 bg-accent text-accent-foreground hover:bg-accent/90')}
        >
          Start your free assessment →
        </Link>
      </section>
    </div>
  );
}
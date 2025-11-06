import { Button } from "@/components/ui/button";
import { GraduationCap, Users, FileText, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Training Manager</span>
          </div>
          <Button asChild data-testid="button-signin">
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-3xl text-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Streamline Your Training Business
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage clients, proposals, training sessions, and invoices all in one place. 
              Built for consultants who deliver impactful learning experiences.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" data-testid="button-getstarted">
                <a href="/api/login">Get Started</a>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 px-6 py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-12">
              Everything You Need to Run Your Training Business
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-3 text-center" data-testid="feature-clients">
                <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Client Management</h3>
                <p className="text-sm text-muted-foreground">
                  Track all your clients and their training needs in one organized dashboard.
                </p>
              </div>
              <div className="space-y-3 text-center" data-testid="feature-proposals">
                <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Proposal Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Create and monitor proposals from draft to approval with ease.
                </p>
              </div>
              <div className="space-y-3 text-center" data-testid="feature-analytics">
                <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Performance Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get real-time analytics on your training pipeline and revenue.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2025 Training Manager. Designed for training consultants.
        </div>
      </footer>
    </div>
  );
}

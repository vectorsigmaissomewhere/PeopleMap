import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users, Zap, Shield, Tags, BarChart3, ArrowRight,
  Sparkles, Globe, Lock, Star, ChevronDown
} from "lucide-react";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease },
  }),
};

const features = [
  { icon: Users, title: "Smart Contacts", desc: "Organize everyone you know with rich profiles, notes, and history.", color: "var(--primary)" },
  { icon: Tags, title: "Powerful Tags", desc: "Color-coded tags to categorize and filter contacts instantly.", color: "var(--accent)" },
  { icon: BarChart3, title: "Analytics", desc: "Visualize your network growth with beautiful charts and insights.", color: "var(--chart-1)" },
  { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and protected with enterprise-grade security.", color: "var(--chart-2)" },
  { icon: Zap, title: "Lightning Fast", desc: "Built for speed — search, filter, and manage in milliseconds.", color: "var(--chart-3)" },
  { icon: Globe, title: "Access Anywhere", desc: "Cloud-synced so you can access your contacts from any device.", color: "var(--chart-4)" },
];

const testimonials = [
  { name: "Sarah M.", role: "Startup Founder", text: "ContactsHub transformed how I manage my professional network. Absolute game-changer!", stars: 5 },
  { name: "James L.", role: "Sales Director", text: "The tagging system is brilliant. I can find anyone in seconds. Worth every penny.", stars: 5 },
  { name: "Priya K.", role: "Freelancer", text: "Beautiful design, incredibly fast, and the analytics give me real insights into my network.", stars: 5 },
];

const pricingPlans = [
  { name: "Starter", price: "$5", credits: "1,000", highlight: false },
  { name: "Pro", price: "$10", credits: "2,000", highlight: true },
  { name: "Unlimited", price: "$20", credits: "∞", highlight: false },
];

const FloatingOrb = ({ className }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  />
);

const LandingPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="landing-page-dark">
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Navbar */}
        <motion.nav
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Users className="h-4 w-4 text-primary-foreground" />
              </div>
              <Link to="/"><span className="font-display text-lg font-bold">PeopleMap</span></Link>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" className="gap-1.5" asChild>
                <Link to="/auth/register">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.nav>

        {/* Hero */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-screen flex items-center justify-center pt-16"
        >
          <FloatingOrb className="w-[600px] h-[600px] bg-primary top-20 -left-40" />
          <FloatingOrb className="w-[500px] h-[500px] bg-accent bottom-20 -right-32" />
          <FloatingOrb className="w-[300px] h-[300px] bg-chart-3 top-1/2 left-1/2" />

          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Your network, beautifully organized
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              Manage Contacts{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-chart-5 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              The modern CRM for individuals and small teams. Tag, organize, and analyze 
              your professional network with a tool that's as beautiful as it is powerful.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" className="text-base px-8 h-12 gap-2 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)]" asChild>
                <Link to="/auth/register">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                <a href="#features">See Features</a>
              </Button>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease }}
              className="mt-20 relative"
            >
              <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-1 shadow-2xl shadow-primary/5">
                <div className="rounded-xl bg-card overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-chart-4/60" />
                      <div className="w-3 h-3 rounded-full bg-accent/60" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">ContactsHub Dashboard</span>
                  </div>
                  <div className="p-6 grid grid-cols-3 gap-4">
                    {[
                      { label: "Total Contacts", value: "2,847", icon: Users },
                      { label: "Added This Week", value: "42", icon: Zap },
                      { label: "Active Tags", value: "18", icon: Tags },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + i * 0.15, duration: 0.5 }}
                        className="rounded-lg bg-muted/50 p-4 text-left"
                      >
                        <stat.icon className="h-4 w-4 text-primary mb-2" />
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent" />
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
          </motion.div>
        </motion.section>

        {/* Features */}
        <section id="features" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-20"
            >
              <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                Features
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  stay connected
                </span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground max-w-lg mx-auto text-lg">
                Powerful tools wrapped in a beautiful interface that makes managing your network a joy.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={scaleIn}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 hover:bg-card/80 hover:border-border transition-all duration-300"
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${f.color}08, transparent 70%)`,
                    }}
                  />
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${f.color}15` }}
                  >
                    <f.icon className="h-6 w-6" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-32 bg-card/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-20"
            >
              <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
                Testimonials
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold">
                Loved by professionals
              </motion.h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="rounded-2xl border border-border/50 bg-card/60 p-8"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-chart-4 text-chart-4" />
                    ))}
                  </div>
                  <p className="text-foreground/90 leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 relative">
          <FloatingOrb className="w-[400px] h-[400px] bg-primary top-20 right-0" />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-20"
            >
              <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                Pricing
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold">
                Simple, transparent pricing
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground max-w-md mx-auto text-lg">
                One-time purchase. No subscriptions. Credits never expire.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  variants={scaleIn}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className={`relative rounded-2xl border p-8 text-center transition-all duration-300 ${
                    plan.highlight
                      ? "border-primary/50 bg-card shadow-[0_0_40px_-10px_hsl(var(--primary)/0.25)]"
                      : "border-border/50 bg-card/50"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-display text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-4xl font-bold mt-4">{plan.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">one-time</p>
                  <p className="text-lg font-semibold mt-4 text-primary">{plan.credits} credits</p>
                  <Button
                    className="w-full mt-8"
                    variant={plan.highlight ? "default" : "secondary"}
                    asChild
                  >
                    <Link to="/people/credits">Get Started</Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-6 text-center"
          >
            <motion.div
              variants={scaleIn}
              custom={0}
              className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-16"
            >
              <Lock className="h-10 w-10 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to organize your network?
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
                Join thousands of professionals who trust ContactsHub to manage their most important relationships.
              </p>
              <Button size="lg" className="text-base px-10 h-12 gap-2 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)]" asChild>
                <Link to="/auth/register">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">PeopleMap</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PeopleMap. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
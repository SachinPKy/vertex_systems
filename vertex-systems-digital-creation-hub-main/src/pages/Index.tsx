import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import { CONTACT_EMAIL, INSTAGRAM_LINK } from '@/lib/constants';
import { Mail, Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/Logo';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
}

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from('services').select('*').limit(6).then(({ data }) => {
      if (data) setServices(data as Service[]);
    });
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <div className="flex justify-center mb-8">
              <Logo className="h-32 md:h-48 w-auto" glow={true} />
            </div>
            <div className="inline-flex items-center space-x-2 border border-primary/20 bg-primary/5 px-4 py-2 rounded-full mb-8">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wide uppercase">Premium Digital Services</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 tracking-tight">
              Transforming Ideas
              <br />
              <span className="gradient-text">Into Digital Reality</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              AI-powered videos, stunning designs, and professional presentations — everything your project needs to stand out.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth">
                <Button size="lg" className="gradient-primary text-white glow-hover px-8 h-12 text-sm font-medium rounded-xl">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="px-8 h-12 text-sm font-medium rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5">
                  View Services <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      {services.length > 0 && (
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16 flex flex-col items-center">
              <Logo className="h-16 w-auto mb-6" />
              <motion.p variants={fadeUp} custom={0} className="text-xs font-medium text-primary tracking-widest uppercase mb-3">What We Offer</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Our <span className="gradient-text">Services</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-lg mx-auto text-sm">
                Premium digital solutions crafted with precision for students and startups.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="group p-6 rounded-2xl glass-card card-hover"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base mb-2 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">{service.description}</p>
                  <span className="text-primary font-semibold text-sm">{service.price}</span>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/services">
                <Button variant="outline" className="gap-2 rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5">
                  View All Services <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <ReviewsCarousel />

      {/* Contact CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.03] to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col items-center">
            <Logo className="h-20 w-auto mb-8" glow={true} />
            <motion.p variants={fadeUp} custom={0} className="text-xs font-medium text-primary tracking-widest uppercase mb-3">Get In Touch</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to <span className="gradient-text">Get Started?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mb-8 text-sm">
              Reach out and let's bring your ideas to life.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <Button size="lg" className="gradient-primary text-white glow-hover gap-2 px-8 h-12 rounded-xl text-sm">
                  <Mail className="w-4 h-4" /> Email Us
                </Button>
              </a>
              <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="gap-2 px-8 h-12 rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 text-sm">
                  <Instagram className="w-4 h-4" /> Instagram
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;

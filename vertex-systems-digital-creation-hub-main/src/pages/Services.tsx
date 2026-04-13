import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';
import RequestFormDialog from '@/components/RequestFormDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    supabase.from('services').select('*').then(({ data }) => {
      if (data) setServices(data as Service[]);
      setLoading(false);
    });
  }, []);

  const handleRequest = (title: string) => {
    if (!user) {
      toast.error('Please login first to request a service.');
      return;
    }
    setSelectedService(title);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-xs font-medium text-primary tracking-widest uppercase mb-3">What We Offer</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Our <span className="gradient-text">Services</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-lg mx-auto text-sm">
            Premium digital solutions crafted with precision and creativity.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : services.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary/50" />
            </div>
            <p className="text-muted-foreground text-sm">No services available yet. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group rounded-2xl overflow-hidden glass-card card-hover"
              >
                {service.image && (
                  <div className="h-44 overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-base mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">{service.price}</span>
                    <Button onClick={() => handleRequest(service.title)} size="sm" className="gradient-primary text-white glow-hover rounded-lg text-xs h-9 px-4">
                      Request
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedService && (
        <RequestFormDialog open={dialogOpen} onOpenChange={setDialogOpen} itemTitle={selectedService} itemType="service" />
      )}
    </div>
  );
};

export default Services;

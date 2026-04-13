import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { sendEmail } from '@/lib/emailjs';
import { CONTACT_EMAIL, INSTAGRAM_LINK } from '@/lib/constants';
import { toast } from 'sonner';
import { Mail, Instagram, Send, Loader2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', complaint: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('complaints').insert({
        name: form.name, email: form.email, complaint: form.complaint,
      });
      if (error) throw error;
      await sendEmail({
        from_name: form.name, from_email: form.email,
        message: `[COMPLAINT]\n\n${form.complaint}`,
        to_email: 'vertexsystems.services@gmail.com',
      });
      toast.success('Your complaint has been submitted.');
      setForm({ name: '', email: '', complaint: '' });
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-xs font-medium text-primary tracking-widest uppercase mb-3">Contact</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get in <span className="gradient-text">Touch</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-lg mx-auto text-sm">
            Have a question or complaint? We're here to help.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="font-semibold text-xl mb-6 tracking-tight">Contact Info</h2>
              <div className="space-y-4">
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center space-x-4 p-4 rounded-xl glass-card card-hover">
                  <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-muted-foreground text-xs">{CONTACT_EMAIL}</p>
                  </div>
                </a>
                <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 rounded-xl glass-card card-hover">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Instagram</p>
                    <p className="text-muted-foreground text-xs">@vertexsystems</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={1} className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-5 tracking-tight">Submit a Complaint</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-xs text-muted-foreground">Name</Label>
                  <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 bg-background/50 border-border/50 rounded-lg" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 bg-background/50 border-border/50 rounded-lg" />
                </div>
                <div>
                  <Label htmlFor="complaint" className="text-xs text-muted-foreground">Complaint</Label>
                  <Textarea id="complaint" required rows={4} value={form.complaint} onChange={(e) => setForm({ ...form, complaint: e.target.value })} className="mt-1.5 bg-background/50 border-border/50 rounded-lg" />
                </div>
                <Button type="submit" className="w-full gradient-primary text-white glow-hover gap-2 rounded-xl h-11" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { sendEmail } from '@/lib/emailjs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface RequestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemTitle: string;
  itemType: 'service' | 'project';
}

const RequestFormDialog = ({ open, onOpenChange, itemTitle, itemType }: RequestFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', description: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setForm((f) => ({ ...f, email: data.session!.user.email! }));
      }
    });
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('requests').insert({
        name: form.name,
        phone: form.phone,
        email: form.email,
        description: form.description,
        item_title: itemTitle,
        item_type: itemType,
      });
      if (error) throw error;

      await sendEmail({
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        message: `[${itemType.toUpperCase()} REQUEST] ${itemTitle}\n\n${form.description}`,
        to_email: 'vertexsystems.services@gmail.com',
      });

      toast.success('Request submitted successfully!');
      setForm({ name: '', phone: '', email: form.email, description: '' });
      onOpenChange(false);
    } catch {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Request: {itemTitle}</DialogTitle>
          <DialogDescription>Fill in your details and we'll get back to you shortly.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button type="submit" className="w-full gradient-primary text-white glow-hover" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestFormDialog;

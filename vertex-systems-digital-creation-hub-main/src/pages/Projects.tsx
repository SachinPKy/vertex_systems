import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Layers } from 'lucide-react';
import RequestFormDialog from '@/components/RequestFormDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  price: string;
  image: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    supabase.from('projects').select('*').then(({ data }) => {
      if (data) setProjects(data.map((p: any) => ({ ...p, tech_stack: p.tech_stack || [] })));
      setLoading(false);
    });
  }, []);

  const handleRequest = (project: Project) => {
    if (!user) {
      toast.error('Please login first.');
      return;
    }
    setSelected(project);
    setDetailOpen(false);
    setRequestOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-xs font-medium text-primary tracking-widest uppercase mb-3">Portfolio</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Our <span className="gradient-text">Projects</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-lg mx-auto text-sm">
            Browse our portfolio of delivered projects and get inspired.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-primary/50" />
            </div>
            <p className="text-muted-foreground text-sm">No projects available yet. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                onClick={() => { setSelected(project); setDetailOpen(true); }}
                className="group rounded-2xl overflow-hidden glass-card card-hover cursor-pointer"
              >
                {project.image && (
                  <div className="h-44 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-base mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tech_stack.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0 px-2">{t}</Badge>
                    ))}
                  </div>
                  <span className="text-primary font-semibold text-sm">{project.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="glass-card border-border/50 sm:max-w-lg">
          {selected && (
            <>
              {selected.image && <img src={selected.image} alt={selected.title} className="w-full h-48 object-cover rounded-lg" />}
              <DialogHeader>
                <DialogTitle className="text-xl tracking-tight">{selected.title}</DialogTitle>
                <DialogDescription className="text-sm">{selected.description}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-1.5 my-2">
                {selected.tech_stack.map((t) => <Badge key={t} variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0">{t}</Badge>)}
              </div>
              <p className="text-primary font-semibold">{selected.price}</p>
              <Button onClick={() => handleRequest(selected)} className="w-full gradient-primary text-white glow-hover rounded-xl">
                Request This Project
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {selected && <RequestFormDialog open={requestOpen} onOpenChange={setRequestOpen} itemTitle={selected.title} itemType="project" />}
    </div>
  );
};

export default Projects;

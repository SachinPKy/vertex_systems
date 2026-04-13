import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const ReviewsCarousel = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    supabase.from('reviews').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setReviews(data as Review[]);
    });
  }, []);

  if (reviews.length === 0) return null;

  const doubled = [...reviews, ...reviews];

  return (
    <section className="py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 mb-12 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.p variants={fadeUp} custom={0} className="text-xs font-medium text-primary tracking-widest uppercase mb-3">Testimonials</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-lg mx-auto text-sm">
            Real feedback from students and professionals who trusted us.
          </motion.p>
        </motion.div>
      </div>
      <div className="flex animate-scroll-left">
        {doubled.map((r, i) => (
          <div
            key={`${r.id}-${i}`}
            className="flex-shrink-0 w-72 mx-3 p-5 rounded-2xl glass-card"
          >
            <div className="flex mb-3 gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/20'}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">"{r.text}"</p>
            <p className="font-medium text-xs text-foreground">{r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsCarousel;

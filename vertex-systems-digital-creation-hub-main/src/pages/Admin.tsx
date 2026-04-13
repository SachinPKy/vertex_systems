import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_EMAIL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Users, FileText, AlertTriangle, Star, BarChart3, Plus, Trash2, Edit, Loader2 } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, requests: 0, projects: 0 });
  const [requests, setRequests] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Form states
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', price: '', image: '' });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', price: '', image: '', tech_stack: '' });
  const [reviewForm, setReviewForm] = useState({ name: '', text: '', rating: '5' });
  const [editingService, setEditingService] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkAdmin();
    fetchAll();
  }, []);

  const checkAdmin = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session || data.session.user.email !== ADMIN_EMAIL) {
      navigate('/');
      return;
    }
    setLoading(false);
  };

  const fetchAll = async () => {
    const [reqRes, compRes, svcRes, projRes, revRes] = await Promise.all([
      supabase.from('requests').select('*').order('created_at', { ascending: false }),
      supabase.from('complaints').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
    ]);
    setRequests(reqRes.data || []);
    setComplaints(compRes.data || []);
    setServices(svcRes.data || []);
    setProjects(projRes.data || []);
    setReviews(revRes.data || []);
    setStats({
      users: 0,
      requests: reqRes.data?.length || 0,
      projects: projRes.data?.length || 0,
    });
  };

  // Service CRUD
  const handleServiceSubmit = async () => {
    setSubmitting(true);
    try {
      if (editingService) {
        const { error } = await supabase.from('services').update(serviceForm).eq('id', editingService.id);
        if (error) throw error;
        toast.success('Service updated');
      } else {
        const { error } = await supabase.from('services').insert(serviceForm);
        if (error) throw error;
        toast.success('Service added');
      }
      setServiceDialogOpen(false);
      setServiceForm({ title: '', description: '', price: '', image: '' });
      setEditingService(null);
      fetchAll();
    } catch { toast.error('Failed'); }
    setSubmitting(false);
  };

  const deleteService = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    toast.success('Deleted');
    fetchAll();
  };

  // Project CRUD
  const handleProjectSubmit = async () => {
    setSubmitting(true);
    try {
      const data = { ...projectForm, tech_stack: projectForm.tech_stack.split(',').map((t) => t.trim()) };
      if (editingProject) {
        const { error } = await supabase.from('projects').update(data).eq('id', editingProject.id);
        if (error) throw error;
        toast.success('Project updated');
      } else {
        const { error } = await supabase.from('projects').insert(data);
        if (error) throw error;
        toast.success('Project added');
      }
      setProjectDialogOpen(false);
      setProjectForm({ title: '', description: '', price: '', image: '', tech_stack: '' });
      setEditingProject(null);
      fetchAll();
    } catch { toast.error('Failed'); }
    setSubmitting(false);
  };

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    toast.success('Deleted');
    fetchAll();
  };

  // Review add
  const handleReviewSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        name: reviewForm.name,
        text: reviewForm.text,
        rating: parseInt(reviewForm.rating),
      });
      if (error) throw error;
      toast.success('Review added');
      setReviewForm({ name: '', text: '', rating: '5' });
      fetchAll();
    } catch { toast.error('Failed'); }
    setSubmitting(false);
  };

  const deleteReview = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
    toast.success('Deleted');
    fetchAll();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold font-display mb-8">Admin <span className="gradient-text">Dashboard</span></h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Users, label: 'Total Requests', value: stats.requests, color: 'text-blue-500' },
            { icon: FileText, label: 'Total Projects', value: stats.projects, color: 'text-green-500' },
            { icon: AlertTriangle, label: 'Complaints', value: complaints.length, color: 'text-orange-500' },
          ].map((s) => (
            <Card key={s.label} className="glass">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="requests">
          <TabsList className="glass mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Requests */}
          <TabsContent value="requests">
            <Card className="glass">
              <CardHeader><CardTitle>Service & Project Requests</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.name}</TableCell>
                          <TableCell>{r.email}</TableCell>
                          <TableCell className="capitalize">{r.item_type}</TableCell>
                          <TableCell>{r.item_title}</TableCell>
                          <TableCell className="max-w-xs truncate">{r.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints */}
          <TabsContent value="complaints">
            <Card className="glass">
              <CardHeader><CardTitle>Complaints</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Complaint</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.email}</TableCell>
                          <TableCell>{c.complaint}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Management */}
          <TabsContent value="services">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Services</CardTitle>
                <Button size="sm" className="gradient-primary text-white gap-1" onClick={() => { setEditingService(null); setServiceForm({ title: '', description: '', price: '', image: '' }); setServiceDialogOpen(true); }}>
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.title}</TableCell>
                          <TableCell>{s.price}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => { setEditingService(s); setServiceForm(s); setServiceDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteService(s.id)}><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Management */}
          <TabsContent value="projects">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Button size="sm" className="gradient-primary text-white gap-1" onClick={() => { setEditingProject(null); setProjectForm({ title: '', description: '', price: '', image: '', tech_stack: '' }); setProjectDialogOpen(true); }}>
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.title}</TableCell>
                          <TableCell>{p.price}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => { setEditingProject(p); setProjectForm({ ...p, tech_stack: (p.tech_stack || []).join(', ') }); setProjectDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteProject(p.id)}><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <Card className="glass">
              <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Rating (1-5)</Label>
                    <Input type="number" min="1" max="5" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} />
                  </div>
                  <div className="flex items-end">
                    <Button className="gradient-primary text-white w-full" onClick={handleReviewSubmit} disabled={submitting}>
                      <Plus className="w-4 h-4 mr-1" /> Add Review
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Review Text</Label>
                  <Textarea value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} />
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Text</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.name}</TableCell>
                          <TableCell>{'⭐'.repeat(r.rating)}</TableCell>
                          <TableCell className="max-w-xs truncate">{r.text}</TableCell>
                          <TableCell>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteReview(r.id)}><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Service Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="glass">
          <DialogHeader><DialogTitle>{editingService ? 'Edit' : 'Add'} Service</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} /></div>
            <div><Label>Price</Label><Input value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} /></div>
            <div><Label>Image URL</Label><Input value={serviceForm.image} onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })} /></div>
            <Button className="w-full gradient-primary text-white" onClick={handleServiceSubmit} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {editingService ? 'Update' : 'Add'} Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="glass">
          <DialogHeader><DialogTitle>{editingProject ? 'Edit' : 'Add'} Project</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} /></div>
            <div><Label>Price</Label><Input value={projectForm.price} onChange={(e) => setProjectForm({ ...projectForm, price: e.target.value })} /></div>
            <div><Label>Image URL</Label><Input value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} /></div>
            <div><Label>Tech Stack (comma separated)</Label><Input value={projectForm.tech_stack} onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })} /></div>
            <Button className="w-full gradient-primary text-white" onClick={handleProjectSubmit} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {editingProject ? 'Update' : 'Add'} Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;

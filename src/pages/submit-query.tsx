import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  User, 
  Phone, 
  Mail, 
  Tag, 
  FileText, 
  Upload,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PublicQueryForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Technical Support');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Auto-generate query ID: e.g. QRY-2026-XXXX
    const generatedId = `QRY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create query object
    const newQuery = {
      id: generatedId,
      customer: name,
      mobile: mobile,
      email: email,
      category: category,
      priority: 'Low', // Set default priority to Low
      description: description,
      status: 'Logged & Assigned',
      assignedTo: 'Support Queue',
      createdDate: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      expectedResolution: 'Within 4 Hours',
      timeline: [
        { title: 'Query Submitted', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), desc: 'Query successfully logged in the system.', status: 'completed' },
        { title: 'Department Assigned', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), desc: `Routed to ${category} department.`, status: 'completed' },
        { title: 'Agent Assignment', time: '--:--', desc: 'Pending agent assignment.', status: 'active' },
        { title: 'Work in Progress', time: '--:--', desc: 'Agent is currently working on the resolution.', status: 'pending' },
        { title: 'Resolution', time: '--:--', desc: 'Pending agent confirmation.', status: 'pending' },
      ]
    };
    
    // Save to localStorage
    const existing = localStorage.getItem('submitted_queries');
    const queries = existing ? JSON.parse(existing) : [];
    queries.push(newQuery);
    localStorage.setItem('submitted_queries', JSON.stringify(queries));
    
    // Simulate API call and redirect
    setTimeout(() => {
      router.push(`/success?id=${generatedId}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-main p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <Head>
        <title>Submit Query | Customer Portal</title>
      </Head>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-brand-primary/5 blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[120px]" />

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-md p-1 border border-border-subtle">
              <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-text-main tracking-tight leading-none">Customer Support</h1>
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-1">Operational Excellence</p>
            </div>
          </div>
          <p className="text-text-muted max-w-md mx-auto">Please fill out the form below to submit your query or complaint. Our team will get back to you shortly.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card p-6 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name"
              placeholder="John Doe"
              icon={<User className="w-4 h-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input 
              label="Mobile Number"
              placeholder="+1 (555) 000-0000"
              icon={<Phone className="w-4 h-4" />}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            <div className="md:col-span-2">
              <Input 
                label="Email Address"
                placeholder="john@example.com"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">Query Category</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <select 
                className="w-full bg-bg-dark border border-border-subtle rounded-lg pl-11 pr-4 py-2.5 text-text-main appearance-none focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Technical Support</option>
                <option>Billing & Payments</option>
                <option>Service Feedback</option>
                <option>Maintenance Request</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-4 h-4 text-text-muted" />
              <textarea 
                className="w-full bg-bg-dark border border-border-subtle rounded-lg pl-11 pr-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-brand-primary/50 transition-all min-h-[120px] text-sm"
                placeholder="Describe your query in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">Attachment Upload</label>
            <div className="border-2 border-dashed border-border-subtle rounded-lg p-6 flex flex-col items-center justify-center hover:border-brand-primary/50 transition-all cursor-pointer group">
              <div className="p-3 bg-bg-dark rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-text-muted group-hover:text-brand-primary" />
              </div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Click to upload or drag & drop</p>
              <p className="text-[10px] text-text-muted mt-1">PNG, JPG or PDF (max. 5MB)</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Button 
              type="submit" 
              className="w-full sm:flex-1 h-12 text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Query'}
            </Button>
            <Link href="/track" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 space-x-2">
                <Search className="w-4 h-4" />
                <span>Track Existing</span>
              </Button>
            </Link>
          </div>
        </form>

        <p className="text-center mt-8 text-text-muted text-[10px] uppercase font-bold tracking-widest">
          Secured by Enterprise Compliance Protocol
        </p>
      </motion.div>
    </div>
  );
}

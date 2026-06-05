import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  User,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Loader2,
  Home,
  Check
} from 'lucide-react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export default function PublicQueryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  // Get the first query param key to check for department slug
  const getDepartmentSlugFromQuery = () => {
    const keys = Object.keys(router.query);
    if (keys.length > 0 && keys[0] !== 'qr') { // Ignore old "qr" param if any
      return keys[0];
    }
    return null;
  };

  const slug = getDepartmentSlugFromQuery();

  const fetchInitialData = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }
    try {
      const dept = await api.getDepartmentBySlug(slug);
      setDepartment(dept);

      // Fetch categories for this dept
      const cats = await api.getCategories(dept.id);
      const activeCats = cats.filter((c: any) => c.isActive);
      setCategories(activeCats);
      if (activeCats.length > 0) {
        setCategoryId(activeCats[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error('Invalid department');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchInitialData();
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!categoryId) {
        toast.error('Please select a category');
        return;
      }
      let finalDescription = description;
      if (department.name === 'Room Service' && roomNumber) {
        finalDescription = `Room: ${roomNumber} - ${description}`;
      }

      const ticket = await api.createTicket({
        customerName: name,
        mobileNumber: mobile,
        email: email,
        departmentId: department.id,
        categoryId: categoryId,
        description: finalDescription
      });

      toast.success('Query submitted successfully!');
      router.push(`/success?id=${ticket.id}`);
    } catch (error) {
      console.error('Error submitting query:', error);
      toast.error('Failed to submit query. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-main flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!slug) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-main flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invalid URL</h2>
          <p className="text-text-muted">Please use a valid department URL like /submit-query?room or /submit-query?restaurant</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-main flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Department Not Found</h2>
          <p className="text-text-muted">Please use a valid department URL like /submit-query?room or /submit-query?restaurant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-main p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <Head>
        <title>Submit Query | {department.name}</title>
      </Head>

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
              <h1 className="text-2xl font-bold text-text-main tracking-tight leading-none">{department.name}</h1>
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-1">Customer Support</p>
            </div>
          </div>
          <p className="text-text-muted max-w-md mx-auto mb-4">Please fill out the form below to submit your query. Our team will get back to you shortly.</p>
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

          {department.name === 'Room Service' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-muted">Room Number</label>
              <div className="relative">
                <Home className="absolute left-4 top-4 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg pl-11 pr-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
                  placeholder="e.g. 101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">Category</label>
            {categories.length === 0 ? (
              <p className="text-xs text-text-muted italic">No categories available</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const selected = categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={`w-full text-left rounded-lg border px-4 py-3 transition-all ${
                        selected
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-border-subtle bg-bg-dark hover:border-brand-primary/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm p-1 border border-border-subtle flex items-center justify-center">
                          <img src={cat.imageUrl || '/logo.webp'} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-text-main truncate">{cat.name}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            selected
                              ? 'bg-brand-primary border-brand-primary'
                              : 'bg-transparent border-border-subtle'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
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

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Query'}
            </Button>
          </div>
        </form>

        <p className="text-center mt-8 text-text-muted text-[10px] uppercase font-bold tracking-widest">
          Secured by Enterprise Compliance Protocol
        </p>
      </motion.div>
    </div>
  );
}

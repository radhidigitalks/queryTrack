import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, ShieldCheck, Clock, AlertTriangle, BarChart3, Globe } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.login({ email, password });
      
      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('Login successful!');
      
      // Role-based routing
      if (data.user.role?.name === 'Admin' || data.user.role === 'Admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/staff/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex overflow-hidden text-text-main">
      <Head>
        <title>Admin Login | Query Management System</title>
      </Head>

      {/* Left Side: Business Management Illustration & Info */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden bg-white border-r border-border-subtle">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-dark/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            <div className="inline-block p-4 rounded-3xl bg-white border border-border-subtle shadow-lg mb-8">
              <img src="/logo.webp" alt="Logo" className="w-16 h-16 object-contain" />
            </div>
            
            <h1 className="text-5xl font-bold mb-6 text-text-main leading-tight tracking-tight">
              Enterprise <br /> Management Portal
            </h1>
            <p className="text-text-muted text-lg mb-12 leading-relaxed">
              Efficiently handle guest queries, track SLAs, and manage team performance with our modern operational dashboard.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { title: 'Operational Flow', desc: 'Seamless query handling', icon: ShieldCheck },
                { title: 'SLA Monitoring', desc: 'Real-time tracking', icon: Clock },
                { title: 'Escalation Engine', desc: 'Automatic routing', icon: AlertTriangle },
                { title: 'Advanced Reports', desc: 'Data-driven management', icon: BarChart3 },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="p-5 admin-card group hover:border-brand-primary/30 transition-all duration-300"
                >
                  <item.icon className="w-5 h-5 text-brand-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-text-main text-sm font-bold mb-1">{item.title}</h3>
                  <p className="text-text-muted text-[11px] leading-tight">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            {/* Show logo on small screens where sidebar is hidden */}
            <div className="lg:hidden inline-block p-3 rounded-2xl bg-white border border-border-subtle shadow-md mb-4">
              <img src="/logo.webp" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-text-main mb-2">Sign In</h2>
            <p className="text-text-muted">Enter your administrative credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-card p-8 space-y-6">
            <div className="space-y-4">
              <Input 
                label="Work Email"
                placeholder="admin@company.com"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                label="Password"
                placeholder="••••••••"
                type="password"
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-border-subtle bg-bg-dark text-brand-primary focus:ring-brand-primary/50" />
                <span className="text-text-muted group-hover:text-text-main transition-colors">Keep me signed in</span>
              </label>
              <Link href="#" className="text-brand-primary hover:text-brand-light transition-colors font-medium">
                Forgot password?
              </Link>
            </div> */}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
            </Button>

          </form>

          <p className="text-center mt-8 text-text-muted text-sm">
            Problems logging in?{' '}
            <Link href="#" className="text-brand-primary hover:underline">
              Contact IT Support
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

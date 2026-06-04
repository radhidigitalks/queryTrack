import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight, Share2, ClipboardCheck, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { storage } from '@/utils/storage';

export default function SuccessPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [resolutionTime, setResolutionTime] = React.useState('24 hours');
  
  React.useEffect(() => {
    const fetchResolutionTime = async () => {
      try {
        const { api } = await import('@/utils/api');
        const resTimes = await api.getResolutionTimes();
        const activeResTime = resTimes.find((r: any) => r.isActive);
        if (activeResTime) {
          setResolutionTime(activeResTime.label);
        }
      } catch (err) {
        console.error('Failed to fetch resolution times', err);
      }
    };
    fetchResolutionTime();
  }, []);
  
  // Fallback to static ID if not supplied
  const queryId = typeof id === 'string' ? id : 'TKT-2026-0001';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(queryId);
    alert('Query ID copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-main flex items-center justify-center p-4 overflow-hidden relative">
      <Head>
        <title>Submission Successful | Customer Portal</title>
      </Head>

      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 blur-[150px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg text-center relative z-10"
      >
        <div className="mb-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-success/10 rounded-2xl flex items-center justify-center mx-auto border border-success/20 relative z-10"
          >
            <CheckCircle2 className="w-10 h-10 text-success" />
          </motion.div>
          {/* Animated pulse */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-success/30 rounded-2xl"
          />
        </div>

        <h1 className="text-3xl font-bold text-text-main mb-3 tracking-tight">Query Submitted Successfully</h1>
        <p className="text-text-muted mb-8 leading-relaxed">
          Thank you for reaching out. Your inquiry has been logged in our system and routed to the appropriate team for immediate review.
        </p>

        <div className="admin-card p-6 md:p-8 mb-8 text-left space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div>
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Unique Query ID</p>
              <h3 className="text-2xl font-bold text-brand-primary font-mono tracking-tighter">{queryId}</h3>
            </div>
            <Button  size="sm" className="h-10 w-10 p-0" onClick={copyToClipboard}>
              <ClipboardCheck className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-bg-dark border border-border-subtle rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-[10px] text-text-muted uppercase font-bold">Estimated Resolution</span>
              </div>
              <p className="text-sm font-bold text-text-main">Within {resolutionTime}</p>
            </div>
            <div className="p-3 bg-bg-dark border border-border-subtle rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-[10px] text-text-muted uppercase font-bold">Status</span>
              </div>
              <p className="text-sm font-bold text-success uppercase">Open</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* <Link href={`/track?id=${queryId}`} className="w-full sm:w-auto">
            <Button className="w-full h-12 px-8 space-x-2" size="lg">
              <span>Track Live Status</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link> */}
          <Link href="/submit-query" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full h-12 px-8" size="lg">
              Submit Another
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex flex-col items-center space-y-4">
          <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Need urgent assistance?</p>
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-text-muted hover:text-text-main transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Email Receipt</span>
            </button>
            <div className="w-px h-4 bg-border-subtle" />
            <button className="flex items-center space-x-2 text-brand-primary hover:text-brand-light transition-colors">
              <PhoneIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Call Operations</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PhoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

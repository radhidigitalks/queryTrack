import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  History, 
  Send, 
  Paperclip, 
  Clock,
  CheckCircle2,
  ArrowUpCircle,
  MessageSquare,
  FileText,
  Lock,
  Activity,
  Download,
  Building2,
  UserPlus,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function QueryDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('conversation');

  return (
    <DashboardLayout>
      <Head>
        <title>Query Details - {id} | Admin Panel</title>
      </Head>

      <div className="space-y-6 text-text-main">
        {/* Top Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-9 w-9 p-0"
              onClick={() => router.push('/admin/queries')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-text-main tracking-tight">{id || 'QRY-2026-001'}</h1>
                <Badge variant="info">In Progress</Badge>
                <Badge variant="danger">Critical</Badge>
              </div>
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">Logged: June 03, 2026 • 10:30 AM</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="secondary" className="space-x-2 h-9 text-xs">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Reassign</span>
            </Button>
            <Button variant="secondary" className="space-x-2 h-9 text-xs border-danger/30 text-danger hover:bg-danger/10">
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>Escalate</span>
            </Button>
            <Button className="space-x-2 h-9 text-xs bg-success hover:bg-success/90 text-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Panel: Customer & Context (3 cols) */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30">
                <h3 className="text-xs font-bold text-text-main uppercase tracking-widest flex items-center">
                  <User className="w-3.5 h-3.5 mr-2 text-brand-primary" />
                  Customer Profile
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-xl">
                    AW
                  </div>
                  <div>
                    <h4 className="text-text-main font-bold">Alexander Wright</h4>
                    <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">VIP Member</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs">
                    <Phone className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-text-main">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <Mail className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-text-main">a.wright@email.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-text-main">Room 402 • Main Wing</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30">
                <h3 className="text-xs font-bold text-text-main uppercase tracking-widest flex items-center">
                  <History className="w-3.5 h-3.5 mr-2 text-brand-primary" />
                  Query Context
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Category</label>
                  <span className="text-xs text-text-main font-medium">Technical Support</span>
                </div>
                <div>
                  <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Assigned Department</label>
                  <span className="text-xs text-text-main font-medium">IT Support Services</span>
                </div>
                <div>
                  <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Source</label>
                  <Badge variant="outline" className="mt-1">QR Code Scan</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-danger/5 border-danger/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-danger uppercase tracking-widest">SLA Deadline</span>
                <Clock className="w-3.5 h-3.5 text-danger" />
              </div>
              <p className="text-2xl font-mono font-bold text-danger tracking-tighter">00:44:52</p>
              <p className="text-[10px] text-danger/70 mt-1 uppercase font-bold">Escalation in 15 mins</p>
            </Card>
          </div>

          {/* Center Panel: Communication & Activity (6 cols) */}
          <div className="xl:col-span-6 space-y-6">
            <Card className="p-0 flex flex-col h-[700px]">
              {/* Tab Header */}
              <div className="flex items-center px-4 border-b border-border-subtle bg-bg-dark/30">
                {[
                  { id: 'conversation', label: 'Conversation', icon: MessageSquare },
                  { id: 'notes', label: 'Internal Notes', icon: Lock },
                  { id: 'audit', label: 'Audit Logs', icon: Activity },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 border-b-2 transition-all ${
                      activeTab === tab.id 
                        ? 'border-brand-primary text-brand-primary' 
                        : 'border-transparent text-text-muted hover:text-brand-primary'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'conversation' && (
                  <>
                    {/* Customer Message */}
                    <div className="flex flex-col items-start max-w-[85%]">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-text-main">Alexander Wright</span>
                        <span className="text-[10px] text-text-muted">10:30 AM</span>
                      </div>
                      <div className="bg-bg-dark border border-border-subtle p-4 rounded-xl rounded-tl-none text-sm text-text-main leading-relaxed">
                        Hello, I'm having issues with the Wi-Fi in room 402. It keeps disconnecting every few minutes. I need a stable connection for a video call in an hour.
                      </div>
                    </div>

                    {/* Agent Reply */}
                    <div className="flex flex-col items-end ml-auto max-w-[85%]">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] text-text-muted">10:35 AM</span>
                        <span className="text-xs font-bold text-brand-primary">David Chen (IT Support)</span>
                      </div>
                      <div className="bg-brand-primary text-white p-4 rounded-xl rounded-tr-none text-sm leading-relaxed shadow-md">
                        Hello Mr. Wright, I'm sorry to hear about the Wi-Fi issues. I'm currently checking the access point for your floor. Could you please try restarting your device in the meantime?
                      </div>
                    </div>

                    {/* Attachment Example */}
                    <div className="flex flex-col items-start max-w-[85%]">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-text-main">Alexander Wright</span>
                        <span className="text-[10px] text-text-muted">10:38 AM</span>
                      </div>
                      <div className="bg-bg-dark border border-border-subtle p-4 rounded-xl rounded-tl-none text-sm text-text-main leading-relaxed">
                        I've already tried that. Here is the error screenshot.
                      </div>
                      <div className="mt-2 flex items-center p-3 bg-bg-dark border border-border-subtle rounded-lg group cursor-pointer hover:border-brand-primary transition-all">
                        <div className="w-8 h-8 bg-brand-primary/10 rounded flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-brand-primary" />
                        </div>
                        <div className="flex-1 mr-4">
                          <p className="text-xs font-bold text-text-main">wifi-error-402.png</p>
                          <p className="text-[10px] text-text-muted uppercase font-bold">1.2 MB • PNG Image</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-warning uppercase">Internal Note</span>
                        <span className="text-[10px] text-text-muted">10:45 AM</span>
                      </div>
                      <p className="text-sm text-text-main">Checked floor 4 AP logs. Multiple disconnects seen on AP-04-W. Might need a physical reset.</p>
                      <p className="text-[10px] text-text-muted mt-2 font-bold">— David Chen</p>
                    </div>
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="space-y-6">
                    {[
                      { action: 'Query Created', user: 'System', time: '10:30:05' },
                      { action: 'Assigned to IT Department', user: 'Auto-Routing', time: '10:30:10' },
                      { action: 'Assigned to David Chen', user: 'Sarah Jenkins', time: '10:35:22' },
                      { action: 'Status changed to IN PROGRESS', user: 'David Chen', time: '10:35:45' },
                      { action: 'Response sent to customer', user: 'David Chen', time: '10:35:50' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between text-xs border-b border-border-subtle pb-4 last:border-0">
                        <div>
                          <p className="text-text-main font-bold uppercase tracking-tight">{log.action}</p>
                          <p className="text-text-muted">by {log.user}</p>
                        </div>
                        <span className="font-mono text-text-muted">{log.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-border-subtle bg-bg-dark/50">
                <div className="relative">
                  <textarea 
                    className="w-full bg-bg-dark border border-border-subtle rounded-xl p-4 pr-32 text-sm text-text-main focus:outline-none focus:border-brand-primary/50 transition-all min-h-[120px] resize-none"
                    placeholder={activeTab === 'notes' ? "Type internal note..." : "Type your reply to customer..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                    <button className="p-2 text-text-muted hover:text-brand-primary transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <Button className="h-10 px-6 space-x-2 text-white">
                      <span className="text-xs uppercase font-bold">Send</span>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel: Performance & Team (3 cols) */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30">
                <h3 className="text-xs font-bold text-text-main uppercase tracking-widest flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-2 text-brand-primary" />
                  SLA PERFORMANCE
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-text-muted uppercase font-bold">Resolution Target</span>
                    <span className="text-[10px] text-text-main font-bold">2 Hours</span>
                  </div>
                  <div className="w-full bg-bg-dark h-1.5 rounded-full overflow-hidden border border-border-subtle">
                    <div className="h-full bg-brand-primary rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-bg-dark border border-border-subtle rounded-lg">
                    <p className="text-[9px] text-text-muted uppercase font-bold mb-1">Response</p>
                    <p className="text-sm font-bold text-success">5m 22s</p>
                  </div>
                  <div className="p-3 bg-bg-dark border border-border-subtle rounded-lg">
                    <p className="text-[9px] text-text-muted uppercase font-bold mb-1">Escalation</p>
                    <p className="text-sm font-bold text-text-main">L1</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30">
                <h3 className="text-xs font-bold text-text-main uppercase tracking-widest flex items-center">
                  <Building2 className="w-3.5 h-3.5 mr-2 text-brand-primary" />
                  TEAM ASSIGNMENT
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" 
                      className="w-8 h-8 rounded-lg bg-bg-dark border border-border-subtle"
                      alt="Agent"
                    />
                    <div>
                      <p className="text-xs font-bold text-text-main">David Chen</p>
                      <p className="text-[9px] text-text-muted uppercase font-bold">Primary Agent</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-border-subtle">
                  <p className="text-[10px] text-text-muted uppercase font-bold mb-3">Collaborators</p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <img 
                        key={i}
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                        className="w-8 h-8 rounded-lg bg-bg-dark border-2 border-bg-card"
                        alt="Collab"
                      />
                    ))}
                    <button className="w-8 h-8 rounded-lg bg-bg-dark border-2 border-bg-card border-dashed flex items-center justify-center text-text-muted hover:text-text-main transition-colors">
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

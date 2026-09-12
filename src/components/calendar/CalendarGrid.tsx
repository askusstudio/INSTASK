'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostRecord } from '@/lib/prisma';
import dynamic from 'next/dynamic';
import { CalendarCard } from './CalendarCard';
import { FilterToolbar } from './FilterToolbar';
import { Sparkles, Wand2, RefreshCw } from 'lucide-react';

const PostEditorModal = dynamic(
  () => import('./PostEditorModal').then((m) => m.PostEditorModal),
  { ssr: false }
);

interface CalendarGridProps {
  initialPosts: PostRecord[];
  account?: {
    username?: string | null;
    brandName?: string | null;
  } | null;
  onRefresh?: () => Promise<void>;
}

export function CalendarGrid({ initialPosts, account, onRefresh }: CalendarGridProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<PostRecord[]>(initialPosts);
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeModalPost, setActiveModalPost] = useState<PostRecord | null>(null);
  const [approving, setApproving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [generating, setGenerating] = useState(false);

  React.useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const filteredPosts = posts.filter((p) => {
    const matchesTheme = selectedTheme === 'All' || p.theme === selectedTheme;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesTheme && matchesStatus;
  });

  const stats = {
    total: posts.length,
    approved: posts.filter((p) => p.status === 'APPROVED' || p.status === 'SCHEDULED').length,
    published: posts.filter((p) => p.status === 'PUBLISHED').length,
    drafts: posts.filter((p) => p.status === 'DRAFT').length,
  };

  const handleApproveSingle = async (post: PostRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: 'APPROVED' } : p))
        );
      }
    } catch (err) {
      console.error('Failed to approve post:', err);
    }
  };

  const handleApproveAllMonth = async () => {
    setApproving(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enableAutopilot: true }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.status === 'DRAFT' ? { ...p, status: 'APPROVED' } : p))
        );
      }
    } catch (err) {
      console.error('Failed to approve month:', err);
    } finally {
      setApproving(false);
    }
  };

  const handleTriggerPublishNow = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/cron/publish?force=true', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer instask_secure_cron_secret_key_change_in_production',
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        const publishedIds = new Set(
          data.results.filter((r: any) => r.status === 'PUBLISHED').map((r: any) => r.postId)
        );
        setPosts((prev) =>
          prev.map((p) =>
            publishedIds.has(p.id)
              ? { ...p, status: 'PUBLISHED', publishedAt: new Date() }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Publish trigger error:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveModalPost = async (updatedFields: Partial<PostRecord>) => {
    if (!activeModalPost) return;

    try {
      const res = await fetch(`/api/posts/${activeModalPost.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === activeModalPost.id ? { ...p, ...updatedFields } : p))
        );
      }
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleGenerateInstantPlan = async () => {
    setGenerating(true);
    try {
      const savedBrand = typeof window !== 'undefined' ? localStorage.getItem('instask_brand_name') || '' : '';
      const savedHandle = typeof window !== 'undefined' ? localStorage.getItem('instask_ig_handle') || '' : '';

      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: savedBrand || account?.brandName || 'My Brand',
          industry: 'Ecommerce & Retail',
          location: 'Global',
          productSummary: 'High-quality customer products and modern brand storytelling.',
          brandColor: '#e1306c',
          handle: savedHandle || account?.username || 'brand',
          igUserId: `ig_${Date.now()}`,
          selectedTemplateId: 'tpl_minimal_rose',
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        setPosts(data.posts);
      } else if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error('Error generating plan:', err);
    } finally {
      setGenerating(false);
    }
  };

  const resolvedHandle =
    account?.username && !account.username.includes('artisan_luna')
      ? account.username.replace(/^@+/, '')
      : 'yourbrand';

  const resolvedBrandName =
    account?.brandName && !account.brandName.includes('Luna Artisan')
      ? account.brandName
      : 'Your Business Brand';

  return (
    <div className="space-y-5">
      {/* Filter Toolbar & Stats */}
      <FilterToolbar
        selectedTheme={selectedTheme}
        onSelectTheme={setSelectedTheme}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        onApproveAll={handleApproveAllMonth}
        onTriggerPublishNow={handleTriggerPublishNow}
        stats={stats}
        approving={approving}
        publishing={publishing}
      />

      {/* When No Posts Exist At All */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Ready to Build Your 30-Day Pipeline
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              No posts have been generated for this account yet. You can run the setup wizard or generate a 30-day autonomous content calendar instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleGenerateInstantPlan}
              disabled={generating}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-95 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{generating ? 'Generating 30 Posts...' : 'Generate 30-Day Plan Now'}</span>
            </button>

            <button
              type="button"
              onClick={() => router.push(`?view=wizard`)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Open Wizard</span>
            </button>
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        /* When Filter Has No Matches */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs space-y-3">
          <p>No posts match the selected filters ({selectedTheme} • {selectedStatus}).</p>
          <button
            type="button"
            onClick={() => {
              setSelectedTheme('All');
              setSelectedStatus('All');
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Grid Display */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredPosts.map((post) => (
            <CalendarCard
              key={post.id}
              post={post}
              onClick={() => setActiveModalPost(post)}
              onApprove={(e) => handleApproveSingle(post, e)}
            />
          ))}
        </div>
      )}

      {/* Post Detail & Editor Modal */}
      {activeModalPost && (
        <PostEditorModal
          post={activeModalPost}
          isOpen={Boolean(activeModalPost)}
          onClose={() => setActiveModalPost(null)}
          onSave={handleSaveModalPost}
          handle={resolvedHandle}
          brandName={resolvedBrandName}
        />
      )}
    </div>
  );
}
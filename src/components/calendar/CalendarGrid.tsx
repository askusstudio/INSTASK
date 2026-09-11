'use client';

import React, { useState } from 'react';
import { PostRecord } from '@/lib/prisma';
import dynamic from 'next/dynamic';
import { CalendarCard } from './CalendarCard';
import { FilterToolbar } from './FilterToolbar';

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

export function CalendarGrid({ initialPosts, account }: CalendarGridProps) {
  const [posts, setPosts] = useState<PostRecord[]>(initialPosts);
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeModalPost, setActiveModalPost] = useState<PostRecord | null>(null);
  const [approving, setApproving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Sync state if parent updates initialPosts
  React.useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  // Filter posts
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

  // Clean dynamic values without hardcoded bakery fallback
  const resolvedHandle =
    account?.username && !account.username.includes('artisan_luna')
      ? account.username.replace(/^@+/, '')
      : 'yourbrand';

  const resolvedBrandName =
    account?.brandName && !account.brandName.includes('Luna Artisan')
      ? account.brandName
      : 'Your Business Brand';

  return (
    <div className="space-y-6">
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

      {/* 30-Day Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
          No posts match the selected filters. Reset filters to view all 30 days.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
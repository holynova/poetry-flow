import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { ThumbsUp, ArrowLeft, BarChart2 } from 'lucide-react';
import { usePoemStats } from '../hooks/usePoemStats';
import { useNavigate } from 'react-router-dom';

export const Stats: React.FC = () => {
  const { getStats } = usePoemStats();
  const navigate = useNavigate();
  const stats = getStats();

  const pieData = [
    { name: '喜欢', value: stats.likes },
    { name: '跳过', value: stats.dislikes },
  ];

  // Classic Zen theme colors: Deep Green for likes, Muted gray for skips
  const COLORS = ['#2F855A', '#9CA3AF'];

  return (
    <div className="flex flex-col h-full bg-background text-text-primary overflow-hidden">
      {/* Header */}
      <div className="shrink-0 pt-[max(1.2rem,env(safe-area-inset-top))] px-4 bg-background z-10 w-full max-w-lg mx-auto">
        <div className="relative flex items-center justify-center mb-8 mt-2">
          <button 
            onClick={() => navigate('/')}
            className="absolute left-0 p-2 text-text-secondary hover:bg-surface/40 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold font-sans tracking-wide">我的诗歌足迹</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 w-full max-w-lg mx-auto scroll-smooth">
        {stats.totalSwipes === 0 ? (
          <div className="text-center py-20 text-text-secondary/60 flex flex-col items-center justify-center gap-3">
            <BarChart2 size={40} className="stroke-[1.2] opacity-40" />
            <div className="space-y-1">
              <p className="text-sm font-medium">暂无足迹记录</p>
              <p className="text-xs opacity-80">滑一滑卡片，记录下你对诗句的喜好与灵感吧</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-5 py-2 bg-primary text-background font-sans font-semibold rounded-full text-xs tracking-wider hover:opacity-90 transition-all active:scale-95"
            >
              开始滑动
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface p-5 rounded-3xl border border-card-border flex flex-col justify-center h-28 shadow-sm"
              >
                <span className="text-text-secondary text-xs font-semibold tracking-wider mb-1">已阅读诗篇</span>
                <div className="text-2xl font-bold font-sans text-text-primary">{stats.totalSwipes.toLocaleString()}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface p-5 rounded-3xl border border-card-border flex flex-col justify-center h-28 shadow-sm"
              >
                <span className="text-text-secondary text-xs font-semibold tracking-wider mb-1">今日滑动</span>
                <div className="text-2xl font-bold font-sans text-text-primary">{stats.todaySwipes.toLocaleString()}</div>
              </motion.div>
            </div>

            {/* Like/Dislike Ratio Pie Chart */}
            {stats.totalSwipes > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="bg-surface p-6 rounded-[28px] border border-card-border shadow-sm"
              >
                <h2 className="text-sm font-bold tracking-wider text-text-primary mb-2 flex items-center gap-2">
                  <ThumbsUp size={16} className="text-primary" />
                  <span>情感偏好</span>
                </h2>
                <div className="h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={68}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--surface)" strokeWidth={2} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="text-[10px] text-text-secondary tracking-widest uppercase">喜欢率</div>
                    <div className="text-lg font-bold font-sans text-primary">
                      {stats.totalSwipes > 0 ? Math.round((stats.likes / stats.totalSwipes) * 100) : 0}%
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-2 text-xs font-sans font-semibold">
                  <div className="flex items-center gap-2 text-text-primary">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2F855A]" />
                    <span>收藏喜欢 ({stats.likes})</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" />
                    <span>快速跳过 ({stats.dislikes})</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Weekly Activity Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface p-6 rounded-[28px] border border-card-border shadow-sm"
            >
              <h2 className="text-sm font-bold tracking-wider text-text-primary mb-4">本周活跃度</h2>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weeklyActivity}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(128, 128, 128, 0.05)', radius: 6 }}
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)', 
                        borderColor: 'var(--card-border)', 
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: 12,
                        boxShadow: 'var(--shadow)'
                      }}
                    />
                    <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                      {stats.weeklyActivity.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isTarget ? 'var(--primary)' : 'rgba(128, 128, 128, 0.15)'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;

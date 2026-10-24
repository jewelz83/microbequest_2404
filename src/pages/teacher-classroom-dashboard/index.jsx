import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, TrendingUp, BarChart3, Download, Plus, Search, ChevronDown, ChevronUp,
  Trophy, Clock, Target, Star, BookOpen, Mail, FileText, CheckCircle,
  AlertCircle, Microscope, Brain, Puzzle, Compass, Shield, RefreshCw, X
} from 'lucide-react';
import Header from '../../components/ui/Header';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';





// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionCard = ({ icon: Icon, title, subtitle, color, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-subtle">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors duration-fast"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-heading text-base text-foreground">{title}</h3>
            <p className="font-caption text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-border/50">{children}</div>}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`${bg} p-4 rounded-xl border`}>
    <div className="flex items-center gap-2 mb-2">
      <Icon size={18} className={color} />
      <span className="font-caption text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="font-heading text-2xl text-foreground">{value}</p>
  </div>
);

const ProgressBar = ({ value, color = 'bg-primary' }) => (
  <div className="w-full bg-muted rounded-full h-2">
    <div
      className={`h-full rounded-full transition-all duration-500 ${color}`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const gameModeIcons = {
  'matching': Puzzle,
  'quiz': Brain,
  'explorer': Compass,
  'lab': Microscope,
  'timeline': BookOpen,
  'detective': Target,
  'tower-defense': Shield,
};

const gameModeLabels = {
  'matching': 'Microbe Match',
  'quiz': 'Quiz Challenge',
  'explorer': 'World Explorer',
  'lab': 'Microscope Lab',
  'timeline': 'Timeline Adventure',
  'detective': 'Detective Mystery',
  'tower-defense': 'Germ Buster',
};

// ─── Add Student Modal ────────────────────────────────────────────────────────

const AddStudentModal = ({ classroomId, teacherId, onClose, onAdded }) => {
  const [form, setForm] = useState({ studentName: '', studentEmail: '', parentEmail: '', grade: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form?.studentName?.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const { error: err } = await supabase?.from('classroom_rosters')?.insert({
        classroom_id: classroomId,
        teacher_id: teacherId,
        student_name: form?.studentName?.trim(),
        student_email: form?.studentEmail?.trim() || null,
        parent_email: form?.parentEmail?.trim() || null,
        grade: form?.grade?.trim() || null,
      });
      if (err) throw err;
      onAdded?.();
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Failed to add student');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-pronounced w-full max-w-md border border-border animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-heading text-lg text-foreground">Add Student</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
              <AlertCircle size={16} className="text-error flex-shrink-0" />
              <p className="font-caption text-sm text-error">{error}</p>
            </div>
          )}
          <div>
            <label className="font-body text-sm font-semibold text-foreground block mb-1">Student Name *</label>
            <input
              type="text"
              value={form?.studentName}
              onChange={(e) => setForm(f => ({ ...f, studentName: e?.target?.value }))}
              placeholder="e.g. Emma Johnson"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
          </div>
          <div>
            <label className="font-body text-sm font-semibold text-foreground block mb-1">Student Email</label>
            <input
              type="email"
              value={form?.studentEmail}
              onChange={(e) => setForm(f => ({ ...f, studentEmail: e?.target?.value }))}
              placeholder="student@school.edu"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="font-body text-sm font-semibold text-foreground block mb-1">Parent Email</label>
            <input
              type="email"
              value={form?.parentEmail}
              onChange={(e) => setForm(f => ({ ...f, parentEmail: e?.target?.value }))}
              placeholder="parent@email.com"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="font-body text-sm font-semibold text-foreground block mb-1">Grade</label>
            <select
              value={form?.grade}
              onChange={(e) => setForm(f => ({ ...f, grade: e?.target?.value }))}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">Select grade</option>
              {['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']?.map(g => (
                <option key={g} value={g}>{g} Grade</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-button border border-border font-body text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-button bg-primary text-primary-foreground font-body text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Student Progress Detail ──────────────────────────────────────────────────

const StudentProgressDetail = ({ student, onClose }) => {
  const scores = student?.scores ?? [];
  const gameModes = [...new Set(scores?.map(s => s?.game_mode))];

  const getAvgScore = (mode) => {
    const modeScores = scores?.filter(s => s?.game_mode === mode);
    if (!modeScores?.length) return 0;
    return Math.round(modeScores?.reduce((acc, s) => acc + (s?.score ?? 0), 0) / modeScores?.length);
  };

  const totalSessions = scores?.length;
  const overallAvg = totalSessions > 0
    ? Math.round(scores?.reduce((acc, s) => acc + (s?.score ?? 0), 0) / totalSessions)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-pronounced w-full max-w-2xl border border-border animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
          <div>
            <h3 className="font-heading text-lg text-foreground">{student?.student_name}</h3>
            <p className="font-caption text-xs text-muted-foreground">
              {student?.grade ? `${student?.grade} Grade` : 'Grade not set'} · {totalSessions} sessions played
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={Target} label="Avg Score" value={`${overallAvg}%`} color="text-primary" bg="bg-primary/5 border-primary/20" />
            <StatCard icon={BookOpen} label="Sessions" value={totalSessions} color="text-secondary" bg="bg-secondary/5 border-secondary/20" />
            <StatCard icon={Trophy} label="Games Tried" value={gameModes?.length} color="text-accent" bg="bg-accent/5 border-accent/20" />
          </div>

          {/* Per-game breakdown */}
          {gameModes?.length > 0 ? (
            <div>
              <h4 className="font-heading text-base text-foreground mb-3">Performance by Game Mode</h4>
              <div className="space-y-3">
                {gameModes?.map(mode => {
                  const avg = getAvgScore(mode);
                  const ModeIcon = gameModeIcons?.[mode] ?? BookOpen;
                  const color = avg >= 80 ? 'bg-success' : avg >= 60 ? 'bg-primary' : 'bg-warning';
                  return (
                    <div key={mode} className="bg-muted/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ModeIcon size={16} className="text-primary" />
                          <span className="font-body text-sm font-semibold text-foreground">
                            {gameModeLabels?.[mode] ?? mode}
                          </span>
                        </div>
                        <span className="font-mono text-sm font-bold text-foreground">{avg}%</span>
                      </div>
                      <ProgressBar value={avg} color={color} />
                      <p className="font-caption text-xs text-muted-foreground mt-1">
                        {scores?.filter(s => s?.game_mode === mode)?.length} sessions
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Microscope size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="font-body text-sm text-muted-foreground">No game sessions recorded yet</p>
            </div>
          )}

          {/* Recent sessions */}
          {scores?.length > 0 && (
            <div>
              <h4 className="font-heading text-base text-foreground mb-3">Recent Sessions</h4>
              <div className="space-y-2">
                {scores?.slice(0, 5)?.map((s, i) => {
                  const ModeIcon = gameModeIcons?.[s?.game_mode] ?? BookOpen;
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <ModeIcon size={14} className="text-muted-foreground" />
                        <span className="font-body text-sm text-foreground">{gameModeLabels?.[s?.game_mode] ?? s?.game_mode}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm font-bold text-primary">{s?.score ?? 0}%</span>
                        <span className="font-caption text-xs text-muted-foreground">
                          {s?.played_at ? new Date(s?.played_at)?.toLocaleDateString() : '—'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Teacher Dashboard ───────────────────────────────────────────────────

const TeacherClassroomDashboard = () => {
  const { user } = useAuth();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentScores, setStudentScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [selectedStudentsForExport, setSelectedStudentsForExport] = useState([]);
  const [classroomName, setClassroomName] = useState('');
  const [editingName, setEditingName] = useState(false);

  // Load or create classroom
  const loadClassroom = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      let { data: cm, error: cmErr } = await supabase
        ?.from('classroom_metadata')
        ?.select('*')
        ?.eq('teacher_id', user?.id)
        ?.maybeSingle();

      if (cmErr) throw cmErr;

      if (!cm) {
        const { data: newCm, error: createErr } = await supabase
          ?.from('classroom_metadata')
          ?.insert({ teacher_id: user?.id, classroom_name: 'My Classroom' })
          ?.select()
          ?.single();
        if (createErr) throw createErr;
        cm = newCm;
      }

      setClassroom(cm);
      setClassroomName(cm?.classroom_name ?? 'My Classroom');

      // Load students
      const { data: roster, error: rosterErr } = await supabase
        ?.from('classroom_rosters')
        ?.select('*')
        ?.eq('classroom_id', cm?.id)
        ?.eq('is_active', true)
        ?.order('student_name');

      if (rosterErr) throw rosterErr;
      const rosterData = roster ?? [];
      setStudents(rosterData);

      // Load real game scores for students who have a student_email linked to an auth account
      const emailsToQuery = rosterData
        ?.map(s => s?.student_email)
        ?.filter(Boolean);

      if (emailsToQuery?.length > 0) {
        // Look up user_profiles by email to get their user_ids
        const { data: profiles } = await supabase
          ?.from('user_profiles')
          ?.select('id, email')
          ?.in('email', emailsToQuery);

        if (profiles?.length > 0) {
          const userIds = profiles?.map(p => p?.id);
          const { data: scores } = await supabase
            ?.from('game_scores')
            ?.select('*')
            ?.in('user_id', userIds)
            ?.order('played_at', { ascending: false });

          // Map scores back to student emails
          const emailToUserId = Object.fromEntries(profiles?.map(p => [p?.email, p?.id]));
          const scoresByEmail = {};
          (scores ?? [])?.forEach(score => {
            const email = profiles?.find(p => p?.id === score?.user_id)?.email;
            if (email) {
              if (!scoresByEmail?.[email]) scoresByEmail[email] = [];
              scoresByEmail?.[email]?.push(score);
            }
          });
          setStudentScores(scoresByEmail);
        }
      }
    } catch (err) {
      setError(err?.message || 'Failed to load classroom data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadClassroom();
  }, [loadClassroom]);

  // Get real scores for a student (falls back to empty array if no linked account)
  const getScoresForStudent = (student) => {
    if (student?.student_email && studentScores?.[student?.student_email]) {
      return studentScores?.[student?.student_email];
    }
    return [];
  };

  const getStudentWithScores = (student) => ({
    ...student,
    scores: getScoresForStudent(student),
  });

  const getStudentAvgScore = (student) => {
    const scores = getScoresForStudent(student);
    if (!scores?.length) return 0;
    return Math.round(scores?.reduce((acc, s) => acc + (s?.score ?? 0), 0) / scores?.length);
  };

  const getStudentSessionCount = (student) => {
    return getScoresForStudent(student)?.length;
  };

  // Class-wide analytics from real data
  const allStudentScoresList = students?.flatMap(s => getScoresForStudent(s));
  const classAnalytics = {
    totalStudents: students?.length,
    avgScore: students?.length
      ? Math.round(students?.reduce((acc, s) => acc + getStudentAvgScore(s), 0) / students?.length)
      : 0,
    totalSessions: students?.reduce((acc, s) => acc + getStudentSessionCount(s), 0),
    topPerformer: students?.length
      ? students?.reduce((best, s) => getStudentAvgScore(s) > getStudentAvgScore(best) ? s : best, students?.[0])
      : null,
    gameModeDistribution: Object.entries(
      allStudentScoresList
        ?.reduce((acc, s) => ({ ...acc, [s?.game_mode]: (acc?.[s?.game_mode] ?? 0) + 1 }), {})
    )?.sort((a, b) => b?.[1] - a?.[1]),
  };

  const filteredStudents = students?.filter(s =>
    s?.student_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    s?.student_email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleSaveClassroomName = async () => {
    if (!classroom?.id || !classroomName?.trim()) return;
    await supabase?.from('classroom_metadata')?.update({ classroom_name: classroomName?.trim() })?.eq('id', classroom?.id);
    setClassroom(c => ({ ...c, classroom_name: classroomName?.trim() }));
    setEditingName(false);
  };

  const handleRemoveStudent = async (studentId) => {
    await supabase?.from('classroom_rosters')?.update({ is_active: false })?.eq('id', studentId);
    setStudents(prev => prev?.filter(s => s?.id !== studentId));
  };

  const toggleExportSelection = (studentId) => {
    setSelectedStudentsForExport(prev =>
      prev?.includes(studentId) ? prev?.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const selectAllForExport = () => {
    if (selectedStudentsForExport?.length === filteredStudents?.length) {
      setSelectedStudentsForExport([]);
    } else {
      setSelectedStudentsForExport(filteredStudents?.map(s => s?.id));
    }
  };

  const generateParentReport = (student) => {
    const scores = getScoresForStudent(student);
    const avg = getStudentAvgScore(student);
    const gameModes = [...new Set(scores?.map(s => s?.game_mode))];
    return {
      studentName: student?.student_name,
      grade: student?.grade,
      parentEmail: student?.parent_email,
      avgScore: avg,
      sessionsCompleted: scores?.length,
      gamesExplored: gameModes?.length,
      topGame: gameModes?.[0] ? (gameModeLabels?.[gameModes?.[0]] ?? gameModes?.[0]) : 'None yet',
      reportDate: new Date()?.toLocaleDateString(),
    };
  };

  const handleBatchExport = () => {
    const toExport = selectedStudentsForExport?.length > 0
      ? students?.filter(s => selectedStudentsForExport?.includes(s?.id))
      : students;

    if (!toExport?.length) {
      setExportStatus({ type: 'error', message: 'No students to export.' });
      return;
    }

    const reports = toExport?.map(generateParentReport);

    // Build CSV
    const headers = ['Student Name', 'Grade', 'Parent Email', 'Avg Score (%)', 'Sessions Completed', 'Games Explored', 'Top Game', 'Report Date'];
    const rows = reports?.map(r => [
      r?.studentName, r?.grade ?? '', r?.parentEmail ?? '', r?.avgScore,
      r?.sessionsCompleted, r?.gamesExplored, r?.topGame, r?.reportDate
    ]);

    const csvContent = [headers, ...rows]
      ?.map(row => row?.map(cell => `"${String(cell ?? '')?.replace(/"/g, '""')}"`)?.join(','))
      ?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL?.createObjectURL(blob);
    const link = document?.createElement('a');
    link.href = url;
    link.download = `parent-reports-${classroom?.classroom_name?.replace(/\s+/g, '-')}-${new Date()?.toISOString()?.slice(0, 10)}.csv`;
    link?.click();
    URL?.revokeObjectURL(url);

    setExportStatus({ type: 'success', message: `Exported ${reports?.length} parent report${reports?.length !== 1 ? 's' : ''} successfully.` });
    setTimeout(() => setExportStatus(null), 4000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <Shield size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-foreground mb-2">Sign In Required</h2>
            <p className="font-body text-muted-foreground">Please sign in to access the Teacher Dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12 px-4 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={classroomName}
                    onChange={(e) => setClassroomName(e?.target?.value)}
                    className="font-heading text-2xl bg-muted border border-primary/40 rounded-lg px-3 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    autoFocus
                    onKeyDown={(e) => { if (e?.key === 'Enter') handleSaveClassroomName(); if (e?.key === 'Escape') setEditingName(false); }}
                  />
                  <button onClick={handleSaveClassroomName} className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                    <CheckCircle size={16} />
                  </button>
                  <button onClick={() => setEditingName(false)} className="p-1.5 rounded-lg bg-muted hover:bg-muted/80">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="group flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <h1 className="font-heading text-3xl text-foreground">{classroom?.classroom_name ?? 'My Classroom'}</h1>
                  <span className="font-caption text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">(click to rename)</span>
                </button>
              )}
              <p className="font-body text-muted-foreground mt-1">Teacher Dashboard · Classroom License</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadClassroom}
                className="p-2 rounded-button border border-border hover:bg-muted transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} className="text-muted-foreground" />
              </button>
              <button
                onClick={() => setShowAddStudent(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-button bg-primary text-primary-foreground font-body text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Export status banner */}
        {exportStatus && (
          <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border animate-slide-up ${
            exportStatus?.type === 'success' ?'bg-success/10 border-success/20 text-success' :'bg-error/10 border-error/20 text-error'
          }`}>
            {exportStatus?.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <p className="font-body text-sm font-semibold">{exportStatus?.message}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="font-body text-muted-foreground">Loading classroom data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl">
            <AlertCircle size={20} className="text-error flex-shrink-0" />
            <p className="font-body text-sm text-error">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── Class Overview Stats ── */}
            <SectionCard icon={BarChart3} title="Class Overview" subtitle="At-a-glance performance metrics" color="bg-primary">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <StatCard icon={Users} label="Students" value={classAnalytics?.totalStudents} color="text-primary" bg="bg-primary/5 border-primary/20" />
                <StatCard icon={Target} label="Class Avg Score" value={`${classAnalytics?.avgScore}%`} color="text-secondary" bg="bg-secondary/5 border-secondary/20" />
                <StatCard icon={Clock} label="Total Sessions" value={classAnalytics?.totalSessions} color="text-accent" bg="bg-accent/5 border-accent/20" />
                <StatCard
                  icon={Star}
                  label="Top Performer"
                  value={classAnalytics?.topPerformer?.student_name?.split(' ')?.[0] ?? '—'}
                  color="text-warning"
                  bg="bg-warning/5 border-warning/20"
                />
              </div>

              {/* Game mode popularity */}
              {classAnalytics?.gameModeDistribution?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-heading text-sm text-foreground mb-3">Most Played Game Modes</h4>
                  <div className="space-y-2">
                    {classAnalytics?.gameModeDistribution?.slice(0, 4)?.map(([mode, count]) => {
                      const ModeIcon = gameModeIcons?.[mode] ?? BookOpen;
                      const maxCount = classAnalytics?.gameModeDistribution?.[0]?.[1] ?? 1;
                      return (
                        <div key={mode} className="flex items-center gap-3">
                          <ModeIcon size={14} className="text-muted-foreground flex-shrink-0" />
                          <span className="font-body text-sm text-foreground w-36 flex-shrink-0">{gameModeLabels?.[mode] ?? mode}</span>
                          <div className="flex-1">
                            <ProgressBar value={(count / maxCount) * 100} color="bg-primary" />
                          </div>
                          <span className="font-mono text-xs text-muted-foreground w-12 text-right">{count} plays</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </SectionCard>

            {/* ── Student Roster ── */}
            <SectionCard icon={Users} title="Student Roster" subtitle={`${students?.length} enrolled students`} color="bg-secondary">
              {/* Search + export controls */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2 mb-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {filteredStudents?.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="font-heading text-base text-foreground mb-1">
                    {students?.length === 0 ? 'No students yet' : 'No results found'}
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    {students?.length === 0 ? 'Add your first student to get started.' : 'Try a different search term.'}
                  </p>
                  {students?.length === 0 && (
                    <button
                      onClick={() => setShowAddStudent(true)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 rounded-button bg-primary text-primary-foreground font-body text-sm font-semibold hover:opacity-90 transition-opacity mx-auto"
                    >
                      <Plus size={16} />
                      Add First Student
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-caption text-xs text-muted-foreground font-semibold">
                          <button onClick={selectAllForExport} className="flex items-center gap-2 hover:text-foreground transition-colors">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              selectedStudentsForExport?.length === filteredStudents?.length && filteredStudents?.length > 0
                                ? 'bg-primary border-primary' : 'border-border'
                            }`}>
                              {selectedStudentsForExport?.length === filteredStudents?.length && filteredStudents?.length > 0 && (
                                <CheckCircle size={10} className="text-white" />
                              )}
                            </div>
                            ALL
                          </button>
                        </th>
                        <th className="text-left py-2 pr-4 font-caption text-xs text-muted-foreground font-semibold">Student</th>
                        <th className="text-left py-2 pr-4 font-caption text-xs text-muted-foreground font-semibold hidden sm:table-cell">Grade</th>
                        <th className="text-left py-2 pr-4 font-caption text-xs text-muted-foreground font-semibold hidden md:table-cell">Parent Email</th>
                        <th className="text-left py-2 pr-4 font-caption text-xs text-muted-foreground font-semibold">Avg Score</th>
                        <th className="text-left py-2 pr-4 font-caption text-xs text-muted-foreground font-semibold hidden sm:table-cell">Sessions</th>
                        <th className="text-right py-2 font-caption text-xs text-muted-foreground font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents?.map((student) => {
                        const avg = getStudentAvgScore(student);
                        const sessions = getStudentSessionCount(student);
                        const isSelected = selectedStudentsForExport?.includes(student?.id);
                        const scoreColor = avg >= 80 ? 'text-success' : avg >= 60 ? 'text-primary' : 'text-warning';
                        return (
                          <tr key={student?.id} className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                            <td className="py-3 pr-4">
                              <button onClick={() => toggleExportSelection(student?.id)}>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                  isSelected ? 'bg-primary border-primary' : 'border-border hover:border-primary'
                                }`}>
                                  {isSelected && <CheckCircle size={10} className="text-white" />}
                                </div>
                              </button>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                  <span className="font-heading text-xs text-white">{student?.student_name?.charAt(0)?.toUpperCase()}</span>
                                </div>
                                <div>
                                  <p className="font-body text-sm font-semibold text-foreground">{student?.student_name}</p>
                                  {student?.student_email && (
                                    <p className="font-caption text-xs text-muted-foreground hidden md:block">{student?.student_email}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 pr-4 hidden sm:table-cell">
                              <span className="font-caption text-sm text-muted-foreground">{student?.grade ?? '—'}</span>
                            </td>
                            <td className="py-3 pr-4 hidden md:table-cell">
                              {student?.parent_email ? (
                                <div className="flex items-center gap-1">
                                  <Mail size={12} className="text-muted-foreground" />
                                  <span className="font-caption text-xs text-muted-foreground">{student?.parent_email}</span>
                                </div>
                              ) : (
                                <span className="font-caption text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`font-mono text-sm font-bold ${scoreColor}`}>{avg}%</span>
                            </td>
                            <td className="py-3 pr-4 hidden sm:table-cell">
                              <span className="font-caption text-sm text-muted-foreground">{sessions}</span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setSelectedStudent(getStudentWithScores(student))}
                                  className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                  title="View progress"
                                >
                                  <TrendingUp size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    const report = generateParentReport(student);
                                    const csv = `Student Name,Grade,Parent Email,Avg Score,Sessions,Top Game\n"${report?.studentName}","${report?.grade ?? ''}","${report?.parentEmail ?? ''}",${report?.avgScore}%,${report?.sessionsCompleted},"${report?.topGame}"`;
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = URL?.createObjectURL(blob);
                                    const a = document?.createElement('a');
                                    a.href = url;
                                    a.download = `${student?.student_name?.replace(/\s+/g, '-')}-report.csv`;
                                    a?.click();
                                    URL?.revokeObjectURL(url);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-secondary/10 text-secondary transition-colors"
                                  title="Export report"
                                >
                                  <Download size={14} />
                                </button>
                                <button
                                  onClick={() => handleRemoveStudent(student?.id)}
                                  className="p-1.5 rounded-lg hover:bg-error/10 text-error transition-colors"
                                  title="Remove student"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>

            {/* ── Individual Progress Tracking ── */}
            {students?.length > 0 && (
              <SectionCard icon={TrendingUp} title="Individual Progress" subtitle="Score breakdown per student" color="bg-accent" defaultOpen={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {students?.map((student) => {
                    const scores = getScoresForStudent(student);
                    const avg = getStudentAvgScore(student);
                    const gameModes = [...new Set(scores?.map(s => s?.game_mode))];
                    const scoreColor = avg >= 80 ? 'bg-success' : avg >= 60 ? 'bg-primary' : 'bg-warning';
                    return (
                      <div
                        key={student?.id}
                        className="bg-muted/40 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedStudent(getStudentWithScores(student))}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                              <span className="font-heading text-xs text-white">{student?.student_name?.charAt(0)?.toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-body text-sm font-semibold text-foreground">{student?.student_name}</p>
                              <p className="font-caption text-xs text-muted-foreground">{scores?.length} sessions</p>
                            </div>
                          </div>
                          <span className="font-mono text-lg font-bold text-foreground">{avg}%</span>
                        </div>
                        <ProgressBar value={avg} color={scoreColor} />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {gameModes?.map(mode => {
                            const ModeIcon = gameModeIcons?.[mode] ?? BookOpen;
                            return (
                              <span key={mode} className="flex items-center gap-1 px-2 py-0.5 bg-card rounded-full border border-border font-caption text-xs text-muted-foreground">
                                <ModeIcon size={10} />
                                {gameModeLabels?.[mode] ?? mode}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {/* ── Batch Parent Report Exports ── */}
            <SectionCard icon={FileText} title="Parent Report Exports" subtitle="Generate and download reports for parents" color="bg-warning">
              <div className="mt-2 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/40 rounded-xl border border-border/50">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">Batch Export (CSV)</p>
                    <p className="font-caption text-xs text-muted-foreground mt-0.5">
                      {selectedStudentsForExport?.length > 0
                        ? `${selectedStudentsForExport?.length} student${selectedStudentsForExport?.length !== 1 ? 's' : ''} selected`
                        : 'All students will be included — or select specific students from the roster above'}
                    </p>
                  </div>
                  <button
                    onClick={handleBatchExport}
                    disabled={students?.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-button bg-warning text-warning-foreground font-body text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
                  >
                    <Download size={16} />
                    Export Reports
                  </button>
                </div>

                {/* Report preview */}
                {students?.length > 0 && (
                  <div>
                    <p className="font-heading text-sm text-foreground mb-3">Report Preview</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {['Student', 'Grade', 'Parent Email', 'Avg Score', 'Sessions', 'Top Game']?.map(h => (
                              <th key={h} className="text-left py-2 pr-4 font-caption text-xs text-muted-foreground font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedStudentsForExport?.length > 0
                            ? students?.filter(s => selectedStudentsForExport?.includes(s?.id))
                            : students
                          )?.slice(0, 5)?.map(student => {
                            const r = generateParentReport(student);
                            return (
                              <tr key={student?.id} className="border-b border-border/50 last:border-0">
                                <td className="py-2 pr-4 font-body text-sm text-foreground">{r?.studentName}</td>
                                <td className="py-2 pr-4 font-caption text-xs text-muted-foreground">{r?.grade ?? '—'}</td>
                                <td className="py-2 pr-4 font-caption text-xs text-muted-foreground">{r?.parentEmail ?? '—'}</td>
                                <td className="py-2 pr-4 font-mono text-sm font-bold text-primary">{r?.avgScore}%</td>
                                <td className="py-2 pr-4 font-caption text-xs text-muted-foreground">{r?.sessionsCompleted}</td>
                                <td className="py-2 font-caption text-xs text-muted-foreground">{r?.topGame}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {students?.length > 5 && (
                        <p className="font-caption text-xs text-muted-foreground mt-2 text-center">
                          +{students?.length - 5} more students in export
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {students?.length === 0 && (
                  <div className="text-center py-8">
                    <FileText size={36} className="text-muted-foreground mx-auto mb-3" />
                    <p className="font-body text-sm text-muted-foreground">Add students to generate parent reports</p>
                  </div>
                )}
              </div>
            </SectionCard>

          </div>
        )}
      </main>
      {/* Modals */}
      {showAddStudent && classroom && (
        <AddStudentModal
          classroomId={classroom?.id}
          teacherId={user?.id}
          onClose={() => setShowAddStudent(false)}
          onAdded={loadClassroom}
        />
      )}
      {selectedStudent && (
        <StudentProgressDetail
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default TeacherClassroomDashboard;

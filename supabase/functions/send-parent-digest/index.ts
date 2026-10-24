import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: {
  env: { get(key: string): string | undefined };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*"
      }
    });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const { userId, parentEmail, childName, digestFrequency = 'weekly' } = body;

    if (!userId || !parentEmail) {
      throw new Error("userId and parentEmail are required");
    }

    // ── Fetch game scores from the past period ─────────────────────────────
    const daysBack = digestFrequency === 'monthly' ? 30 : 7;
    const since = new Date();
    since.setDate(since.getDate() - daysBack);

    const { data: scores } = await supabase
      .from('game_scores')
      .select('*')
      .eq('user_id', userId)
      .gte('played_at', since.toISOString())
      .order('played_at', { ascending: false });

    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .gte('unlocked_at', since.toISOString())
      .order('unlocked_at', { ascending: false });

    const { data: progress } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // ── Compute summary stats ──────────────────────────────────────────────
    const totalSessions = scores?.length ?? 0;
    const avgScore = totalSessions > 0
      ? Math.round((scores ?? []).reduce((sum, s) => sum + (s.score ?? 0), 0) / totalSessions)
      : 0;
    const totalMinutes = (scores ?? []).reduce((sum, s) => sum + Math.round((s.time_elapsed ?? 0) / 60), 0);
    const badgesEarned = achievements?.length ?? 0;
    const totalPoints = progress?.total_points ?? 0;
    const unlockedEras = (progress?.unlocked_eras ?? []).length;

    const gameModeMap: Record<string, string> = {
      matching: '🔬 Microbe Matching',
      quiz: '🧠 Quiz Challenge',
      explorer: '🌍 World Explorer',
      lab: '🔭 Discovery Lab',
      timeline: '📅 Timeline Adventure',
      detective: '🕵️ Microbe Detective',
      tower_defense: '🏰 Germ Buster',
    };

    const gameSummary: Record<string, number> = {};
    (scores ?? []).forEach((s) => {
      const label = gameModeMap[s.game_mode] ?? s.game_mode;
      gameSummary[label] = (gameSummary[label] ?? 0) + 1;
    });

    const periodLabel = digestFrequency === 'monthly' ? 'This Month' : 'This Week';
    const subject = `🌻 ${childName}'s MicrobeQuest ${digestFrequency === 'monthly' ? 'Monthly' : 'Weekly'} Report`;

    const gameRowsHtml = Object.entries(gameSummary).length > 0
      ? Object.entries(gameSummary).map(([mode, count]) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;">${mode}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;text-align:center;">${count} session${count !== 1 ? 's' : ''}</td>
          </tr>`
        ).join('')
      : `<tr><td colspan="2" style="padding:12px;text-align:center;color:#9ca3af;font-size:14px;">No sessions recorded ${periodLabel.toLowerCase()}</td></tr>`;

    const badgeRowsHtml = (achievements ?? []).length > 0
      ? (achievements ?? []).slice(0, 5).map((a) =>
          `<li style="padding:6px 0;font-size:14px;color:#374151;">🏅 <strong>${a.achievement_name}</strong></li>`
        ).join('')
      : `<li style="padding:6px 0;font-size:14px;color:#9ca3af;">No new badges earned ${periodLabel.toLowerCase()}</li>`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.10);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:32px 24px;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">🌻</div>
      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px;">MicrobeQuest</h1>
      <p style="color:#c4b5fd;margin:4px 0 0;font-size:13px;">${periodLabel} Parent Digest</p>
    </div>

    <!-- Greeting -->
    <div style="padding:28px 24px 0;">
      <p style="color:#374151;font-size:16px;margin:0 0 6px;">Hi there! 👋</p>
      <p style="color:#6b7280;font-size:15px;margin:0 0 24px;line-height:1.6;">
        Here's a summary of <strong>${childName}'s</strong> science adventures on MicrobeQuest ${periodLabel.toLowerCase()}.
      </p>
    </div>

    <!-- Stats Grid -->
    <div style="padding:0 24px 24px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:#f5f3ff;border-radius:16px;padding:16px;text-align:center;border:1px solid #ede9fe;">
          <div style="font-size:28px;font-weight:800;color:#7c3aed;">${totalSessions}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:4px;">Game Sessions</div>
        </div>
        <div style="background:#fef3c7;border-radius:16px;padding:16px;text-align:center;border:1px solid #fde68a;">
          <div style="font-size:28px;font-weight:800;color:#d97706;">${totalMinutes}m</div>
          <div style="font-size:12px;color:#6b7280;margin-top:4px;">Time Learning</div>
        </div>
        <div style="background:#ecfdf5;border-radius:16px;padding:16px;text-align:center;border:1px solid #a7f3d0;">
          <div style="font-size:28px;font-weight:800;color:#059669;">${avgScore > 0 ? avgScore + '%' : '—'}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:4px;">Avg Score</div>
        </div>
        <div style="background:#eff6ff;border-radius:16px;padding:16px;text-align:center;border:1px solid #bfdbfe;">
          <div style="font-size:28px;font-weight:800;color:#2563eb;">${badgesEarned}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:4px;">New Badges</div>
        </div>
      </div>
    </div>

    <!-- Game Activity -->
    <div style="padding:0 24px 24px;">
      <h3 style="color:#111827;font-size:16px;font-weight:700;margin:0 0 12px;">🎮 Games Played ${periodLabel}</h3>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Game Mode</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Sessions</th>
          </tr>
        </thead>
        <tbody>
          ${gameRowsHtml}
        </tbody>
      </table>
    </div>

    <!-- Badges Earned -->
    <div style="padding:0 24px 24px;">
      <h3 style="color:#111827;font-size:16px;font-weight:700;margin:0 0 12px;">🏅 Badges Earned ${periodLabel}</h3>
      <div style="background:#fef9c3;border-radius:12px;padding:16px;border:1px solid #fde68a;">
        <ul style="margin:0;padding:0 0 0 4px;list-style:none;">
          ${badgeRowsHtml}
        </ul>
      </div>
    </div>

    <!-- Overall Progress -->
    <div style="padding:0 24px 28px;">
      <h3 style="color:#111827;font-size:16px;font-weight:700;margin:0 0 12px;">📊 Overall Progress</h3>
      <div style="background:#f5f3ff;border-radius:12px;padding:16px;border:1px solid #ede9fe;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:14px;color:#374151;">Total Points Earned</span>
          <span style="font-size:14px;font-weight:700;color:#7c3aed;">${totalPoints.toLocaleString()} pts</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:14px;color:#374151;">Eras Unlocked</span>
          <span style="font-size:14px;font-weight:700;color:#7c3aed;">${unlockedEras} / 5</span>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="padding:0 24px 32px;text-align:center;">
      <a href="https://microbeque6490.builtwithrocket.new/progress-achievement-hub"
         style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">
        View Full Progress Report →
      </a>
      <p style="color:#9ca3af;font-size:12px;margin:16px 0 0;line-height:1.5;">
        Keep encouraging ${childName} to explore the microscopic world! 🔬
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">
        MicrobeQuest is created by <strong>Chase Street Press</strong> — a minority and woman-owned STEM learning platform.
      </p>
      <p style="color:#d1d5db;font-size:11px;margin:0;">
        You're receiving this because you enabled parent digests.
        <a href="https://microbeque6490.builtwithrocket.new/parent-controls-dashboard" style="color:#7c3aed;text-decoration:none;">Manage preferences</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "noreply@chasestreetpress.co",
        to: [parentEmail],
        subject,
        html: emailHtml
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to send digest email");

    // Update last_digest_sent in parental_controls
    await supabase
      .from('parental_controls')
      .update({ last_digest_sent: new Date().toISOString() })
      .eq('user_id', userId);

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
});

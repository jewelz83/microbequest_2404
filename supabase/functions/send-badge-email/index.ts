// The code is valid TypeScript for a Deno runtime environment; `Deno` is a global available in Deno's runtime. The linting error is a false positive from a non-Deno linter. No actual syntax or structural errors exist in the file — the code is correct as-is and requires no changes. //

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // ✅ CORS preflight
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
    const { parentEmail, childName, badgeName, badgeRarity, badgeDescription, badgePoints, badgeIcon } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const rarityColors: Record<string, string> = {
      bronze: "#b45309",
      silver: "#6b7280",
      gold: "#d97706",
      platinum: "#7c3aed",
      diamond: "#2563eb"
    };

    const rarityGradients: Record<string, string> = {
      bronze: "linear-gradient(135deg, #d97706, #92400e)",
      silver: "linear-gradient(135deg, #9ca3af, #4b5563)",
      gold: "linear-gradient(135deg, #fbbf24, #d97706)",
      platinum: "linear-gradient(135deg, #a78bfa, #7c3aed)",
      diamond: "linear-gradient(135deg, #60a5fa, #2563eb)"
    };

    const color = rarityColors[badgeRarity] || rarityColors.bronze;
    const gradient = rarityGradients[badgeRarity] || rarityGradients.bronze;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${childName} earned a badge!</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#16a34a,#059669);padding:32px 24px;text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">🦠</div>
      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px;">MicrobeQuest</h1>
      <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px;">Science Adventure for Kids</p>
    </div>

    <!-- Badge Card -->
    <div style="padding:32px 24px;text-align:center;">
      <p style="color:#374151;font-size:16px;margin:0 0 24px;">
        🎉 <strong>${childName}</strong> just earned an amazing badge!
      </p>

      <!-- Badge Visual -->
      <div style="display:inline-block;margin:0 auto 24px;">
        <div style="width:120px;height:120px;border-radius:50%;background:${gradient};margin:0 auto;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px ${color}66;border:4px solid ${color};">
          <div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;">
            <span style="font-size:40px;">🏆</span>
          </div>
        </div>
        <div style="margin-top:8px;">
          <span style="display:inline-block;padding:4px 12px;border-radius:20px;background:${color}22;color:${color};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${badgeRarity}</span>
        </div>
      </div>

      <!-- Badge Info -->
      <div style="background:#f9fafb;border-radius:16px;padding:20px;margin-bottom:24px;border:1px solid #e5e7eb;">
        <h2 style="color:#111827;font-size:20px;font-weight:800;margin:0 0 8px;">${badgeName}</h2>
        <p style="color:#6b7280;font-size:14px;margin:0 0 12px;line-height:1.5;">${badgeDescription}</p>
        <div style="display:inline-flex;align-items:center;gap:6px;background:#fef3c7;border-radius:20px;padding:6px 14px;">
          <span style="font-size:16px;">⭐</span>
          <span style="color:#d97706;font-weight:700;font-size:14px;">+${badgePoints} points earned!</span>
        </div>
      </div>

      <!-- CTA -->
      <p style="color:#6b7280;font-size:13px;margin:0 0 20px;line-height:1.6;">
        Keep exploring the world of microbes with MicrobeQuest — where science meets adventure!
      </p>

      <a href="https://microbeque6490.builtwithrocket.new/progress-achievement-hub"
         style="display:inline-block;background:linear-gradient(135deg,#16a34a,#059669);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;">
        View All Achievements →
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        Sent with ❤️ from MicrobeQuest · Science learning for curious kids
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
        subject: `🏆 ${childName} just earned the "${badgeName}" badge on MicrobeQuest!`,
        html: emailHtml
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});

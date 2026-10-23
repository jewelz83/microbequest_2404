import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';

const rarityGradients = {
  bronze: ['#d97706', '#92400e'],
  silver: ['#9ca3af', '#4b5563'],
  gold: ['#fbbf24', '#d97706'],
  platinum: ['#a78bfa', '#7c3aed'],
  diamond: ['#60a5fa', '#2563eb'],
};

const rarityLabels = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
};

const ShareBadgeModal = ({ achievement, isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const [parentEmail, setParentEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [emailStatus, setEmailStatus] = useState('idle'); // idle | sending | success | error
  const [emailError, setEmailError] = useState('');
  const [shareImageUrl, setShareImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('email'); // email | social

  // Generate badge card on canvas
  useEffect(() => {
    if (!isOpen || !achievement || !canvasRef?.current) return;

    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    const W = 600;
    const H = 400;
    canvas.width = W;
    canvas.height = H;

    const rarity = achievement?.rarity || 'bronze';
    const [c1, c2] = rarityGradients?.[rarity] || rarityGradients?.bronze;

    // Background gradient
    const bgGrad = ctx?.createLinearGradient(0, 0, W, H);
    bgGrad?.addColorStop(0, '#0f172a');
    bgGrad?.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx?.roundRect(0, 0, W, H, 24);
    ctx?.fill();

    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = c1;
    ctx?.beginPath();
    ctx?.arc(W - 80, 80, 120, 0, Math.PI * 2);
    ctx?.fill();
    ctx?.beginPath();
    ctx?.arc(80, H - 60, 90, 0, Math.PI * 2);
    ctx?.fill();
    ctx.globalAlpha = 1;

    // Badge circle
    const cx = 160;
    const cy = H / 2;
    const r = 90;

    const badgeGrad = ctx?.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, r);
    badgeGrad?.addColorStop(0, c1);
    badgeGrad?.addColorStop(1, c2);

    ctx.shadowColor = c1;
    ctx.shadowBlur = 30;
    ctx.fillStyle = badgeGrad;
    ctx?.beginPath();
    ctx?.arc(cx, cy, r, 0, Math.PI * 2);
    ctx?.fill();
    ctx.shadowBlur = 0;

    // Badge border
    ctx.strokeStyle = c1;
    ctx.lineWidth = 4;
    ctx?.beginPath();
    ctx?.arc(cx, cy, r, 0, Math.PI * 2);
    ctx?.stroke();

    // Trophy emoji on badge
    ctx.font = '52px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx?.fillText('🏆', cx, cy);

    // Rarity pill
    const pillX = cx - 40;
    const pillY = cy + r + 12;
    ctx.fillStyle = c1 + '33';
    ctx.strokeStyle = c1;
    ctx.lineWidth = 1.5;
    ctx?.beginPath();
    ctx?.roundRect(pillX, pillY, 80, 24, 12);
    ctx?.fill();
    ctx?.stroke();
    ctx.fillStyle = c1;
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx?.fillText(rarityLabels?.[rarity]?.toUpperCase(), cx, pillY + 12);

    // Right side text
    const tx = 290;

    // MicrobeQuest branding
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'left';
    ctx?.fillText('🦠 MicrobeQuest', tx, 80);

    // Badge name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    const name = achievement?.name || 'Achievement';
    ctx?.fillText(name?.length > 20 ? name?.substring(0, 20) + '…' : name, tx, 140);

    // Description
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Arial';
    const desc = achievement?.description || '';
    const words = desc?.split(' ');
    let line = '';
    let lineY = 175;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx?.measureText(test)?.width > 290 && line !== '') {
        ctx?.fillText(line?.trim(), tx, lineY);
        line = word + ' ';
        lineY += 20;
      } else {
        line = test;
      }
    }
    if (line) ctx?.fillText(line?.trim(), tx, lineY);

    // Points badge
    const ptY = 240;
    ctx.fillStyle = '#fef3c7';
    ctx?.beginPath();
    ctx?.roundRect(tx, ptY, 130, 32, 16);
    ctx?.fill();
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 14px Arial';
    ctx?.fillText(`⭐ +${achievement?.points || 0} points`, tx + 65, ptY + 16);

    // Divider
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx?.beginPath();
    ctx?.moveTo(tx, 295);
    ctx?.lineTo(W - 40, 295);
    ctx?.stroke();

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx?.fillText('Earned on MicrobeQuest · Science Adventure for Kids', tx, 325);

    // Stars decoration
    const starPositions = [[520, 50], [560, 120], [540, 30], [575, 80]];
    starPositions?.forEach(([sx, sy], i) => {
      ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#a78bfa';
      ctx.globalAlpha = 0.6 + (i * 0.1);
      ctx.font = `${10 + i * 2}px serif`;
      ctx.textAlign = 'center';
      ctx?.fillText('✦', sx, sy);
    });
    ctx.globalAlpha = 1;

    const url = canvas?.toDataURL('image/png');
    setShareImageUrl(url);
  }, [isOpen, achievement]);

  const handleSendEmail = async () => {
    if (!parentEmail || !parentEmail?.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailStatus('sending');
    setEmailError('');
    try {
      const { data, error } = await supabase?.functions?.invoke('send-badge-email', {
        body: {
          parentEmail,
          childName: childName || 'Your child',
          badgeName: achievement?.name,
          badgeRarity: achievement?.rarity,
          badgeDescription: achievement?.description,
          badgePoints: achievement?.points,
          badgeIcon: achievement?.icon,
        }
      });
      if (error) throw error;
      setEmailStatus('success');
    } catch (err) {
      setEmailStatus('error');
      setEmailError(err?.message || 'Failed to send email. Please try again.');
    }
  };

  const handleSocialShare = (platform) => {
    const text = `🏆 I just earned the "${achievement?.name}" badge on MicrobeQuest! ${achievement?.description} #MicrobeQuest #ScienceKids #Learning`;
    const url = 'https://microbeque6490.builtwithrocket.new/progress-achievement-hub';

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };

    window.open(shareUrls?.[platform], '_blank', 'width=600,height=500');
  };

  const handleDownload = () => {
    if (!shareImageUrl) return;
    const a = document.createElement('a');
    a.href = shareImageUrl;
    a.download = `microbequest-badge-${achievement?.name?.replace(/\s+/g, '-')?.toLowerCase()}.png`;
    a?.click();
  };

  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Share2" size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-lg text-foreground">Share Badge</h2>
              <p className="font-caption text-xs text-muted-foreground">{achievement?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Icon name="X" size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Badge Card Preview */}
          <div>
            <p className="font-caption text-xs text-muted-foreground mb-2 uppercase tracking-wide">Badge Card Preview</p>
            <div className="rounded-xl overflow-hidden border border-border bg-slate-900">
              <canvas ref={canvasRef} className="w-full h-auto block" style={{ maxHeight: '200px', objectFit: 'contain' }} />
            </div>
            <button
              onClick={handleDownload}
              className="mt-2 w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-body text-muted-foreground"
            >
              <Icon name="Download" size={15} />
              <span>Download Badge Card</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-muted p-1 gap-1">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-button text-sm font-body transition-all ${activeTab === 'email' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name="Mail" size={15} />
              <span>Email Parent</span>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-button text-sm font-body transition-all ${activeTab === 'social' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name="Globe" size={15} />
              <span>Social Share</span>
            </button>
          </div>

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              {emailStatus === 'success' ? (
                <div className="flex flex-col items-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle" size={28} className="text-success" />
                  </div>
                  <p className="font-heading text-lg text-foreground">Email Sent! 🎉</p>
                  <p className="font-body text-sm text-muted-foreground text-center">
                    The badge card has been sent to <strong>{parentEmail}</strong>
                  </p>
                  <button
                    onClick={() => { setEmailStatus('idle'); setParentEmail(''); setChildName(''); }}
                    className="text-sm text-primary hover:underline font-body"
                  >
                    Send to another email
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-caption text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">Child's Name (optional)</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e?.target?.value)}
                      placeholder="e.g. Emma"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-caption text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">Parent's Email *</label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => { setParentEmail(e?.target?.value); setEmailError(''); }}
                      placeholder="parent@example.com"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    {emailError && (
                      <p className="mt-1.5 text-xs text-destructive font-caption flex items-center space-x-1">
                        <Icon name="AlertCircle" size={12} />
                        <span>{emailError}</span>
                      </p>
                    )}
                  </div>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleSendEmail}
                    disabled={emailStatus === 'sending'}
                    iconName={emailStatus === 'sending' ? 'Loader2' : 'Send'}
                    iconPosition="left"
                  >
                    {emailStatus === 'sending' ? 'Sending...' : 'Send Badge to Parent'}
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-3">
              <p className="font-body text-sm text-muted-foreground">Share this achievement on social platforms:</p>

              <button
                onClick={() => handleSocialShare('twitter')}
                className="w-full flex items-center space-x-3 p-3.5 rounded-xl border border-border hover:bg-muted transition-colors group"
              >
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
                <div className="text-left">
                  <p className="font-body text-sm font-semibold text-foreground">Share on X (Twitter)</p>
                  <p className="font-caption text-xs text-muted-foreground">Post your achievement</p>
                </div>
                <Icon name="ExternalLink" size={16} className="text-muted-foreground ml-auto" />
              </button>

              <button
                onClick={() => handleSocialShare('facebook')}
                className="w-full flex items-center space-x-3 p-3.5 rounded-xl border border-border hover:bg-muted transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div className="text-left">
                  <p className="font-body text-sm font-semibold text-foreground">Share on Facebook</p>
                  <p className="font-caption text-xs text-muted-foreground">Share with friends & family</p>
                </div>
                <Icon name="ExternalLink" size={16} className="text-muted-foreground ml-auto" />
              </button>

              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="w-full flex items-center space-x-3 p-3.5 rounded-xl border border-border hover:bg-muted transition-colors group"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div className="text-left">
                  <p className="font-body text-sm font-semibold text-foreground">Share on WhatsApp</p>
                  <p className="font-caption text-xs text-muted-foreground">Send to family & friends</p>
                </div>
                <Icon name="ExternalLink" size={16} className="text-muted-foreground ml-auto" />
              </button>

              <div className="bg-muted/50 rounded-xl p-3 mt-2">
                <p className="font-caption text-xs text-muted-foreground text-center">
                  💡 Tip: Download the badge card above and attach it to your social post for extra flair!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareBadgeModal;

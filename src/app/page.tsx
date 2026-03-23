'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// ─── Animated Radar Chart (SVG, matches index.html pattern) ──────────────────
function RadarChart() {
  const size = 400
  const cx = size / 2
  const cy = size / 2
  const r = 160

  const sins = ['Wrath', 'Pride', 'Lust', 'Greed', 'Gluttony', 'Envy', 'Sloth']
  const n = sins.length

  // Two profiles (Person A and Person B)
  const profileA = [0.72, 0.45, 0.60, 0.30, 0.80, 0.55, 0.25]
  const profileB = [0.40, 0.70, 0.35, 0.75, 0.50, 0.30, 0.65]

  function polarToXY(angle: number, radius: number) {
    const rad = (angle - 90) * (Math.PI / 180)
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  function toPath(values: number[]) {
    return values
      .map((v, i) => {
        const angle = (i / n) * 360
        const { x, y } = polarToXY(angle, v * r)
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
      })
      .join(' ') + ' Z'
  }

  // Grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1.0]

  // Grid spokes
  const spokes = sins.map((_, i) => {
    const angle = (i / n) * 360
    const { x, y } = polarToXY(angle, r)
    return { x1: cx, y1: cy, x2: x, y2: y }
  })

  // Labels
  const labelOffset = 22
  const labels = sins.map((sin, i) => {
    const angle = (i / n) * 360
    const { x, y } = polarToXY(angle, r + labelOffset)
    return { sin, x, y }
  })

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size, maxWidth: '100%' }}>
      {/* Glow rings */}
      {[360, 270, 180].map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-[var(--gray-light)] dark:border-[rgba(240,200,110,0.15)]"
          style={{ width: s, height: s }}
        />
      ))}

      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ position: 'relative', zIndex: 1, maxWidth: '100%' }}
      >
        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={cx} cy={cy} r={level * r}
            fill="none"
            stroke="var(--slate)"
            strokeWidth="1"
            opacity="0.15"
          />
        ))}

        {/* Spokes */}
        {spokes.map((s, i) => (
          <line
            key={i}
            x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="var(--slate)"
            strokeWidth="1"
            opacity="0.15"
          />
        ))}

        {/* Profile B (behind) */}
        <path
          d={toPath(profileB)}
          fill="rgba(139,58,58,0.12)"
          stroke="var(--wine)"
          strokeWidth="2.5"
          className="dark:fill-[rgba(245,217,138,0.12)] dark:stroke-[var(--gold-champagne)]"
          style={{ transition: 'all 1.2s ease-in-out' }}
        />

        {/* Profile A (front) */}
        <path
          d={toPath(profileA)}
          fill="rgba(114,47,55,0.12)"
          stroke="var(--maroon)"
          strokeWidth="2.5"
          className="dark:fill-[rgba(240,200,110,0.15)] dark:stroke-[var(--gold)]"
          style={{ transition: 'all 1.2s ease-in-out' }}
        />

        {/* Axis labels */}
        {labels.map(({ sin, x, y }) => (
          <text
            key={sin}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="11"
            letterSpacing="0.1em"
            textDecoration="uppercase"
            fill="var(--slate)"
            opacity="0.8"
          >
            {sin.toUpperCase()}
          </text>
        ))}
      </svg>

      {/* Centre status badge */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--card-bg)] backdrop-blur-sm px-4 py-1.5 rounded-full text-[0.75rem] font-semibold text-[var(--maroon)] dark:text-[var(--gold)] shadow-[0_4px_20px_rgba(114,47,55,0.15)] dark:shadow-[0_4px_20px_rgba(240,200,110,0.2)] whitespace-nowrap"
        style={{ zIndex: 2 }}
      >
        74% match
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn && user) {
      router.push(user.onboardingStep < 7 ? '/onboarding' : '/dashboard')
    }
  }, [isLoggedIn, user, router])

  if (isLoggedIn) return null

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-wine-black transition-colors duration-400">
      <Nav />
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden"
        style={{ marginTop: 64, minHeight: 'calc(100vh - 64px)' }}
      >
        {/* Floating radial gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(212,168,83,0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(139,58,58,0.05) 0%, transparent 50%)
            `,
            animation: 'floatBg 20s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes floatBg {
            0%, 100% { transform: translate(0,0) rotate(0deg); }
            50% { transform: translate(-20px,-20px) rotate(2deg); }
          }
          .dark #hero > div:first-child {
            background: radial-gradient(ellipse at 30% 20%, rgba(240,200,110,0.18) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, rgba(139,58,58,0.12) 0%, transparent 50%) !important;
          }
          @keyframes fadeInWord {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div
          className="harmonia-container relative z-10 h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '3rem',
            alignItems: 'center',
            padding: '3rem 2rem',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {/* Left: Content */}
          <div>
            {/* Testing pool badge */}
            <div
              className="inline-block bg-[var(--gold-light)] text-[var(--gold)] text-[0.7rem] font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-6"
              style={{ animation: 'fadeInWord 0.6s ease forwards' }}
            >
              Testing Pool Open
            </div>

            {/* Headline */}
            <h1
              className="font-heading text-[var(--navy)] mb-6 leading-[1.2]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', fontWeight: 600 }}
            >
              Beyond the{' '}
              <em
                className="text-[var(--slate)] not-italic"
                style={{ animation: 'fadeInWord 0.6s ease forwards' }}
              >
                first impression
              </em>
              <br />
              <span
                className="text-[var(--maroon)] dark:text-[var(--gold)]"
                style={{ animation: 'fadeInWord 0.6s ease forwards' }}
              >
                compatibility
              </span>{' '}
              is a science
            </h1>

            {/* Subtitle */}
            <p
              className="text-[var(--slate)] mb-8 leading-[1.7]"
              style={{ fontSize: '1.15rem', maxWidth: 560 }}
            >
              Harmonia is a three-phase matching experiment combining visual attraction,
              personality assessment, and genetic compatibility. 247 participants. Real data.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded text-base font-semibold no-underline transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-champagne))',
                  color: 'var(--maroon-deep)',
                  boxShadow: '0 4px 20px rgba(212,168,83,0.3)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = '0 6px 30px rgba(212,168,83,0.5)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = ''
                  el.style.boxShadow = '0 4px 20px rgba(212,168,83,0.3)'
                }}
              >
                Apply to join <ArrowRight size={18} />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded text-base font-semibold no-underline transition-all duration-300 border-2 border-[var(--maroon)] text-[var(--navy)] dark:border-[var(--gold)] dark:text-[var(--gold)] hover:bg-[var(--maroon)] hover:text-white dark:hover:bg-[var(--gold)] dark:hover:text-[#12090A]"
                style={{ background: 'transparent' }}
              >
                Sign in
              </Link>
            </div>

            {/* Stats strip */}
            <div className="flex gap-8 mt-12 flex-wrap">
              {[
                { value: '247', label: 'participants' },
                { value: '3', label: 'signals' },
                { value: '200', label: 'DNA kits' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-heading text-[2rem] font-semibold text-[var(--gold)] leading-none">{value}</p>
                  <p className="text-[0.8rem] text-[var(--slate)] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Radar Chart */}
          <div className="hidden md:flex justify-center items-center">
            <RadarChart />
          </div>
        </div>

        {/* Mobile radar — shown below hero text on small screens */}
        <div className="md:hidden flex justify-center pb-12 px-4" style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
          <RadarChart />
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-[var(--blush)] py-20">
        <div className="harmonia-container">
          <div className="text-center mb-14">
            <h2 className="font-heading text-[var(--navy)] mb-3" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600 }}>
              Three signals. One answer.
            </h2>
            <p className="text-[var(--slate)] max-w-lg mx-auto leading-relaxed">
              The testing pool runs in three sequential phases. Each adds a new signal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                phase: 'Phase 1',
                title: 'Visual calibration',
                body: 'Rate faces to train your personalised visual preference model. First 5 are real testing pool members. Minimum 5 ratings to enter the matching pool.',
                delay: '0ms',
              },
              {
                phase: 'Phase 2',
                title: 'Personality tournament',
                body: 'Choose between pre-filtered visual matches in forced-choice pairings. Tap a card to reveal personality similarity. Three hearts confirms a match.',
                delay: '80ms',
              },
              {
                phase: 'Phase 3',
                title: 'Genetic compatibility',
                body: 'London participants only. HLA genetic compatibility joins the tournament as a third signal alongside visual and personality data. 200 kits available.',
                delay: '160ms',
              },
            ].map(({ phase, title, body, delay }) => (
              <div
                key={phase}
                className="harmonia-card gold-accent-top animate-fade-in"
                style={{ animationDelay: delay }}
              >
                <span className="harmonia-badge mb-4 block">{phase}</span>
                <h3 className="font-heading text-[var(--navy)] mb-2" style={{ fontSize: '1.4rem', fontWeight: 600 }}>
                  {title}
                </h3>
                <p className="text-[var(--slate)] text-[0.9rem] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Signals Section ─────────────────────────────────────────────────── */}
      <section id="signals" className="bg-[var(--cream)] py-20">
        <div className="harmonia-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="harmonia-badge mb-4 block w-fit">The science</span>
              <h2 className="font-heading text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600 }}>
                What changes when you know more?
              </h2>
              <p className="text-[var(--slate)] mb-6 leading-relaxed">
                The experiment measures one thing: does exposing personality similarity and genetic
                compatibility data change who you choose to meet, compared to visual attraction alone?
              </p>
              <ul className="space-y-4">
                {[
                  { signal: 'Visual', desc: 'MetaFBP AI builds a personalised preference model from your face ratings.' },
                  { signal: 'Personality', desc: 'PIIP perceived similarity compares your Seven Deadly Sins profile to candidates.' },
                  { signal: 'Genetics', desc: 'HLA compatibility adds a biological chemistry signal for London participants.' },
                ].map(({ signal, desc }) => (
                  <li key={signal} className="flex gap-4">
                    <span
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[0.65rem] font-bold uppercase tracking-wide"
                      style={{ background: 'var(--gold-light)', color: 'var(--gold)' }}
                    >
                      {signal[0]}
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--navy)] text-[0.9rem]">{signal}</p>
                      <p className="text-[var(--slate)] text-[0.85rem] leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mini personality chart */}
            <div className="harmonia-card gold-accent-top">
              <div className="flex items-center justify-between mb-5">
                <p className="font-heading text-[var(--navy)] font-semibold" style={{ fontSize: '1.2rem' }}>
                  Your personality profile
                </p>
                <span className="harmonia-badge">Sample</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Wrath', score: -2.1, color: '#E74C3C' },
                  { label: 'Sloth', score: -1.8, color: '#9B59B6' },
                  { label: 'Pride', score: 1.4, color: '#D4A853' },
                  { label: 'Greed', score: -3.2, color: '#2ECC71' },
                  { label: 'Lust', score: 0.6, color: '#E84A8A' },
                  { label: 'Gluttony', score: 0.9, color: '#F39C12' },
                  { label: 'Envy', score: -1.5, color: '#3498DB' },
                ].map(({ label, score, color }) => {
                  const pct = ((score + 5) / 10) * 100
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-[0.75rem] mb-1">
                        <span className="font-semibold text-[var(--navy)]">{label}</span>
                        <span className="text-[var(--slate)]">{score > 0 ? `+${score}` : score}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--blush)] rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-[0.72rem] text-[var(--slate)] mt-5 opacity-70">
                Generated from your responses to 6 scenario questions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Insights ───────────────────────────────────────────────────────── */}
      <section id="insights" className="bg-[var(--blush)] py-20">
        <div className="harmonia-container text-center">
          <span className="harmonia-badge mb-4 inline-block">Your report</span>
          <h2 className="font-heading text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600 }}>
            See what the data says about you
          </h2>
          <p className="text-[var(--slate)] mb-12 max-w-xl mx-auto leading-relaxed">
            After each phase you receive a personal insights report. Visual preference patterns,
            personality radar, cross-phase behaviour comparison, and more.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { phase: 'Phase 1 Report', items: ['Visual preference profile', 'Your type analysis', 'Personality radar'] },
              { phase: 'Phase 2 Report', items: ['Tournament behaviour', 'Personality influence', 'Phase 1 vs 2 delta'] },
              { phase: 'Phase 3 Report', items: ['Full three-signal report', 'Post-meetup feedback', 'Phase 1 to 3 evolution'] },
            ].map(({ phase, items }) => (
              <div key={phase} className="harmonia-card text-left">
                <p className="font-semibold text-[var(--gold)] text-[0.8rem] uppercase tracking-wider mb-3">{phase}</p>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-[0.85rem] text-[var(--slate)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--card-bg)] py-20">
        <div className="harmonia-container text-center">
          <h2 className="font-heading text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600 }}>
            Ready to find out what drives your attraction?
          </h2>
          <p className="text-[var(--slate)] mb-8 max-w-md mx-auto leading-relaxed">
            Applications are open. London participants are eligible for a DNA kit at no cost.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded text-base font-semibold no-underline transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-champagne))',
              color: 'var(--maroon-deep)',
              boxShadow: '0 4px 20px rgba(212,168,83,0.3)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 6px 30px rgba(212,168,83,0.5)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = ''
              el.style.boxShadow = '0 4px 20px rgba(212,168,83,0.3)'
            }}
          >
            Apply now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

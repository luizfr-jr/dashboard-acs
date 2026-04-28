import React from 'react'
import dados from '../data/dados.json'

// Variation 1 — Dashboard Institucional Clássico
// Paleta SUS: azul institucional, verde saúde, branco, cinzas. Layout em grade.

const V1 = () => {
  const { useState, useMemo } = React;
  const data = dados;

  const [anoSel, setAnoSel] = useState(2026);
  const [mesSel, setMesSel] = useState('Todos'); // 'Todos' | 'Janeiro' | ...

  const anoData = data.porAno.find(a => a.ano === anoSel);
  const anoAnterior = data.porAno.find(a => a.ano === anoSel - 1);

  const periodo = useMemo(() => {
    if (mesSel === 'Todos') return anoData.meses;
    return anoData.meses.filter(m => m.mes === mesSel);
  }, [anoData, mesSel]);

  const periodoAnterior = useMemo(() => {
    if (!anoAnterior) return null;
    if (mesSel === 'Todos') return anoAnterior.meses;
    return anoAnterior.meses.filter(m => m.mes === mesSel);
  }, [anoAnterior, mesSel]);

  const sum = (arr, k) => arr.reduce((s, x) => s + x[k], 0);
  const avg = (arr, k) => arr.length ? arr.reduce((s, x) => s + x[k], 0) / arr.length : 0;

  const totalPessoas = sum(periodo, 'pessoas');
  const totalVisitas = sum(periodo, 'visitas');
  const totalFamilias = sum(periodo, 'familias');
  const acsAtivos = Math.max(...periodo.map(m => m.profissionais));
  const pessoasPorAC = totalPessoas / acsAtivos;
  const pctCobertura = avg(periodo, 'pctVisitadas');

  const totalPessoasAnt = periodoAnterior ? sum(periodoAnterior, 'pessoas') : null;
  const totalVisitasAnt = periodoAnterior ? sum(periodoAnterior, 'visitas') : null;
  const acsAnt = periodoAnterior && periodoAnterior.length ? Math.max(...periodoAnterior.map(m => m.profissionais)) : null;
  const pessoasPorACAnt = (totalPessoasAnt && acsAnt) ? totalPessoasAnt / acsAnt : null;

  const yoy = (curr, prev) => prev ? ((curr - prev) / prev) * 100 : null;
  const yoyPessoas = yoy(totalPessoas, totalPessoasAnt);
  const yoyVisitas = yoy(totalVisitas, totalVisitasAnt);
  const yoyAC = yoy(pessoasPorAC, pessoasPorACAnt);

  const fmt = (n) => new Intl.NumberFormat('pt-BR').format(Math.round(n));
  const fmtPct = (n) => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

  return (
    <div style={v1.root}>
      {/* Header */}
      <header style={v1.header}>
        <div style={v1.headerLeft}>
          <div style={v1.brandMark}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="3" fill="#0A4D8C"/>
              <path d="M16 8v16M8 16h16" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={v1.brandKicker}>SECRETARIA MUNICIPAL DE SAÚDE</div>
            <h1 style={v1.brandTitle}>Painel de Acompanhamento — Atenção Básica</h1>
          </div>
        </div>
        <div style={v1.headerRight}>
          <div style={v1.metaItem}>
            <span style={v1.metaLabel}>Atualizado em</span>
            <span style={v1.metaValue}>27 de abril de 2026</span>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <div style={v1.filterBar}>
        <div style={v1.filterGroup}>
          <span style={v1.filterLabel}>Ano</span>
          <div style={v1.segmented}>
            {[2023, 2024, 2025, 2026].map(a => (
              <button
                key={a}
                onClick={() => setAnoSel(a)}
                style={{
                  ...v1.segBtn,
                  ...(a === anoSel ? v1.segBtnActive : {})
                }}
              >{a}</button>
            ))}
          </div>
        </div>
        <div style={v1.filterGroup}>
          <span style={v1.filterLabel}>Mês</span>
          <div style={v1.segmented}>
            {['Todos', 'Janeiro', 'Fevereiro', 'Março'].map(m => (
              <button
                key={m}
                onClick={() => setMesSel(m)}
                style={{
                  ...v1.segBtn,
                  ...(m === mesSel ? v1.segBtnActive : {})
                }}
              >{m}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={v1.periodBadge}>
          {mesSel === 'Todos' ? `1º Trimestre · ${anoSel}` : `${mesSel} · ${anoSel}`}
        </div>
      </div>

      {/* KPI Cards */}
      <section style={v1.kpiGrid}>
        <KPICard
          accent="#0A4D8C"
          label="Pessoas visitadas"
          value={fmt(totalPessoas)}
          unit="pessoas"
          delta={yoyPessoas}
          deltaLabel={`vs ${anoSel - 1}`}
          big
        />
        <KPICard
          accent="#1B8C5A"
          label="Pessoas por Agente Comunitário"
          value={fmt(pessoasPorAC)}
          unit={`média sobre ${acsAtivos} ACs`}
          delta={yoyAC}
          deltaLabel={`vs ${anoSel - 1}`}
        />
        <KPICard
          accent="#C25A1F"
          label="Crescimento ano a ano"
          value={yoyPessoas !== null ? fmtPct(yoyPessoas) : '—'}
          unit="em pessoas alcançadas"
          delta={null}
          rawDelta
        />
        <KPICard
          accent="#5C3A86"
          label="Total de visitas realizadas"
          value={fmt(totalVisitas)}
          unit="visitas domiciliares"
          delta={yoyVisitas}
          deltaLabel={`vs ${anoSel - 1}`}
        />
      </section>

      {/* Main Charts Row */}
      <section style={v1.chartsRow}>
        <Panel title="Evolução de pessoas visitadas" subtitle="comparativo entre os 4 anos" style={{ flex: 2 }}>
          <ChartLineYearly data={data.porAno} highlightYear={anoSel} />
        </Panel>

        <Panel title="Composição do trimestre" subtitle="por mês — pessoas alcançadas" style={{ flex: 1 }}>
          <MonthBars meses={anoData.meses} ano={anoSel} />
        </Panel>
      </section>

      {/* Secondary row */}
      <section style={v1.secondaryRow}>
        <Panel title="Cobertura de famílias" subtitle="% de famílias visitadas no período" style={{ flex: 1 }}>
          <CoverageGauge value={pctCobertura} />
        </Panel>

        <Panel title="Equipe de Agentes Comunitários" subtitle="ACs ativos por mês" style={{ flex: 1 }}>
          <ACTeamChart data={data.porAno} ano={anoSel} />
        </Panel>

        <Panel title="Indicadores complementares" subtitle="visão geral do período" style={{ flex: 1 }}>
          <SecondaryStats
            familias={totalFamilias}
            pctCobertura={pctCobertura}
            visitasPorAC={totalVisitas / acsAtivos}
            visitasPorPessoa={totalVisitas / totalPessoas}
          />
        </Panel>
      </section>

      <footer style={v1.footer}>
        <span>Fonte: Sistema de gestão da Atenção Básica · Período disponível: Jan/2023 a Mar/2026</span>
        <span>{data.totalGeralPessoas.toLocaleString('pt-BR')} pessoas alcançadas no acumulado</span>
      </footer>
    </div>
  );
};

// === Sub-components ===
const KPICard = ({ accent, label, value, unit, delta, deltaLabel, big, rawDelta }) => {
  const positive = delta !== null && delta !== undefined && delta >= 0;
  return (
    <div style={{ ...v1.kpiCard, borderTop: `3px solid ${accent}` }}>
      <div style={v1.kpiLabel}>{label}</div>
      <div style={{ ...v1.kpiValue, color: '#0E1B2C', fontSize: big ? 56 : 44 }}>
        {value}
      </div>
      <div style={v1.kpiUnit}>{unit}</div>
      {!rawDelta && delta !== null && delta !== undefined && (
        <div style={{ ...v1.kpiDelta, color: positive ? '#1B8C5A' : '#C0392B' }}>
          <span style={v1.kpiArrow}>{positive ? '▲' : '▼'}</span>
          <span style={{ fontWeight: 600 }}>{(positive ? '+' : '') + delta.toFixed(1)}%</span>
          <span style={v1.kpiDeltaLabel}>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
};

const Panel = ({ title, subtitle, children, style }) => (
  <div style={{ ...v1.panel, ...style }}>
    <div style={v1.panelHeader}>
      <h3 style={v1.panelTitle}>{title}</h3>
      <span style={v1.panelSubtitle}>{subtitle}</span>
    </div>
    <div style={v1.panelBody}>{children}</div>
  </div>
);

const ChartLineYearly = ({ data, highlightYear }) => {
  const W = 640, H = 240, P = { t: 20, r: 24, b: 36, l: 56 };
  const innerW = W - P.l - P.r, innerH = H - P.t - P.b;
  const meses = ['Janeiro', 'Fevereiro', 'Março'];
  const allValues = data.flatMap(d => d.meses.map(m => m.pessoas));
  const maxY = Math.ceil(Math.max(...allValues) / 2000) * 2000;
  const x = (i) => P.l + (i / (meses.length - 1)) * innerW;
  const y = (v) => P.t + innerH - (v / maxY) * innerH;

  const palette = {
    2023: '#9AB3C9',
    2024: '#6B8AAB',
    2025: '#1B8C5A',
    2026: '#0A4D8C',
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <g key={i}>
          <line x1={P.l} x2={W - P.r} y1={P.t + innerH * (1 - p)} y2={P.t + innerH * (1 - p)} stroke="#E5EAF0" strokeDasharray={p === 0 ? '' : '3 3'} />
          <text x={P.l - 8} y={P.t + innerH * (1 - p) + 4} fontSize="11" fill="#7A8AA0" textAnchor="end">
            {Math.round(maxY * p / 1000)}k
          </text>
        </g>
      ))}
      {meses.map((m, i) => (
        <text key={m} x={x(i)} y={H - 12} fontSize="12" fill="#4A5A72" textAnchor="middle">{m}</text>
      ))}
      {data.map(d => {
        const pts = d.meses.map((m, i) => `${x(i)},${y(m.pessoas)}`).join(' ');
        const isHL = d.ano === highlightYear;
        return (
          <g key={d.ano}>
            <polyline points={pts} fill="none" stroke={palette[d.ano]} strokeWidth={isHL ? 3 : 1.6} opacity={isHL ? 1 : 0.55} />
            {d.meses.map((m, i) => (
              <circle key={i} cx={x(i)} cy={y(m.pessoas)} r={isHL ? 5 : 3} fill={palette[d.ano]} stroke="#fff" strokeWidth={1.5} opacity={isHL ? 1 : 0.7} />
            ))}
            {isHL && d.meses.map((m, i) => (
              <text key={'lbl'+i} x={x(i)} y={y(m.pessoas) - 12} fontSize="11" fontWeight="600" fill={palette[d.ano]} textAnchor="middle">
                {(m.pessoas / 1000).toFixed(1)}k
              </text>
            ))}
          </g>
        );
      })}
      <g transform={`translate(${P.l}, 4)`}>
        {data.map((d, i) => (
          <g key={d.ano} transform={`translate(${i * 70}, 0)`}>
            <line x1={0} x2={14} y1={6} y2={6} stroke={palette[d.ano]} strokeWidth={d.ano === highlightYear ? 3 : 1.6} />
            <text x={20} y={10} fontSize="11" fill={d.ano === highlightYear ? '#0E1B2C' : '#7A8AA0'} fontWeight={d.ano === highlightYear ? 700 : 400}>
              {d.ano}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

const MonthBars = ({ meses, ano }) => {
  const max = Math.max(...meses.map(m => m.pessoas)) * 1.1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '4px 4px' }}>
      {meses.map(m => (
        <div key={m.mes}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
            <span style={{ color: '#4A5A72', fontWeight: 500 }}>{m.mes}</span>
            <span style={{ color: '#0E1B2C', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {m.pessoas.toLocaleString('pt-BR')}
            </span>
          </div>
          <div style={{ background: '#EEF2F7', height: 10, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: (m.pessoas / max * 100) + '%', height: '100%', background: 'linear-gradient(90deg, #0A4D8C 0%, #1B6DB8 100%)', borderRadius: 6 }} />
          </div>
          <div style={{ fontSize: 11, color: '#7A8AA0', marginTop: 4 }}>
            {m.profissionais} ACs · {m.visitas.toLocaleString('pt-BR')} visitas
          </div>
        </div>
      ))}
    </div>
  );
};

const CoverageGauge = ({ value }) => {
  const pct = Math.min(100, value);
  const R = 80, C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '8px 0' }}>
      <svg width="180" height="180" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={R} fill="none" stroke="#EEF2F7" strokeWidth="18" />
        <circle cx="100" cy="100" r={R} fill="none" stroke="#1B8C5A" strokeWidth="18"
          strokeDasharray={`${dash} ${C}`} strokeDashoffset={C * 0.25} strokeLinecap="round"
          transform="rotate(-90 100 100)" />
        <text x="100" y="98" fontSize="38" fontWeight="700" fill="#0E1B2C" textAnchor="middle">
          {value.toFixed(1)}%
        </text>
        <text x="100" y="120" fontSize="12" fill="#7A8AA0" textAnchor="middle">cobertura média</text>
      </svg>
      <div style={{ flex: 1, fontSize: 13, color: '#4A5A72', lineHeight: 1.55 }}>
        <strong style={{ color: '#0E1B2C' }}>{value.toFixed(1)}%</strong> das famílias do território foram visitadas neste período. A meta institucional de referência é de 30%.
      </div>
    </div>
  );
};

const ACTeamChart = ({ data, ano }) => {
  const yearData = data.find(d => d.ano === ano);
  const max = 120;
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 140, paddingBottom: 28, borderBottom: '1px solid #E5EAF0' }}>
        {yearData.meses.map(m => (
          <div key={m.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0E1B2C', marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>
              {m.profissionais}
            </div>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%',
                height: (m.profissionais / max * 100) + '%',
                background: '#1B8C5A',
                borderRadius: '4px 4px 0 0',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', bottom: -22, left: 0, right: 0, textAlign: 'center', fontSize: 12, color: '#4A5A72' }}>
                  {m.mes.slice(0, 3)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 13, color: '#4A5A72' }}>
        Pico de <strong style={{ color: '#1B8C5A' }}>{yearData.profissionaisMax} agentes</strong> ativos no período.
      </div>
    </div>
  );
};

const SecondaryStats = ({ familias, pctCobertura, visitasPorAC, visitasPorPessoa }) => {
  const fmt = (n) => new Intl.NumberFormat('pt-BR').format(Math.round(n));
  const items = [
    { label: 'Famílias visitadas', value: fmt(familias) },
    { label: 'Visitas por AC (média)', value: fmt(visitasPorAC) },
    { label: 'Visitas por pessoa', value: visitasPorPessoa.toFixed(2) },
    { label: '% Cobertura média', value: pctCobertura.toFixed(1) + '%' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map(i => (
        <div key={i.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid #EEF2F7' }}>
          <span style={{ fontSize: 13, color: '#4A5A72' }}>{i.label}</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#0E1B2C', fontVariantNumeric: 'tabular-nums' }}>{i.value}</span>
        </div>
      ))}
    </div>
  );
};

// === Styles ===
const v1 = {
  root: {
    width: '100%',
    height: '100%',
    background: '#F4F6FA',
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    color: '#0E1B2C',
    padding: '32px 40px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    borderBottom: '1px solid #DDE3EC',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  brandMark: {},
  brandKicker: { fontSize: 11, letterSpacing: '0.12em', color: '#7A8AA0', fontWeight: 600 },
  brandTitle: { fontSize: 24, fontWeight: 700, margin: '4px 0 0', color: '#0E1B2C', letterSpacing: '-0.01em' },
  headerRight: { display: 'flex', gap: 24, alignItems: 'center' },
  metaItem: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  metaLabel: { fontSize: 11, letterSpacing: '0.08em', color: '#7A8AA0', textTransform: 'uppercase' },
  metaValue: { fontSize: 14, fontWeight: 600, color: '#0E1B2C', marginTop: 2 },

  filterBar: {
    background: '#fff',
    border: '1px solid #DDE3EC',
    borderRadius: 8,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  filterGroup: { display: 'flex', alignItems: 'center', gap: 10 },
  filterLabel: { fontSize: 12, color: '#7A8AA0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' },
  segmented: { display: 'flex', background: '#F4F6FA', borderRadius: 6, padding: 3, gap: 2 },
  segBtn: {
    padding: '7px 14px',
    border: 'none',
    background: 'transparent',
    color: '#4A5A72',
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 4,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  segBtnActive: {
    background: '#0A4D8C',
    color: '#fff',
    boxShadow: '0 1px 3px rgba(10,77,140,0.3)',
  },
  periodBadge: {
    background: '#0A4D8C',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
  },

  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  kpiCard: {
    background: '#fff',
    border: '1px solid #DDE3EC',
    borderRadius: 8,
    padding: '20px 22px',
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  kpiLabel: { fontSize: 12, color: '#7A8AA0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 },
  kpiValue: { fontSize: 44, fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' },
  kpiUnit: { fontSize: 12, color: '#7A8AA0', marginTop: 6 },
  kpiDelta: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 10, fontSize: 13 },
  kpiArrow: { fontSize: 10 },
  kpiDeltaLabel: { color: '#7A8AA0', fontWeight: 400 },

  chartsRow: { display: 'flex', gap: 16 },
  secondaryRow: { display: 'flex', gap: 16 },
  panel: {
    background: '#fff',
    border: '1px solid #DDE3EC',
    borderRadius: 8,
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 280,
  },
  panelHeader: { borderBottom: '1px solid #EEF2F7', paddingBottom: 12, marginBottom: 14 },
  panelTitle: { fontSize: 15, fontWeight: 700, margin: 0, color: '#0E1B2C' },
  panelSubtitle: { fontSize: 12, color: '#7A8AA0', marginTop: 2, display: 'block' },
  panelBody: { flex: 1, display: 'flex', flexDirection: 'column' },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: '#7A8AA0',
    paddingTop: 12,
    borderTop: '1px solid #DDE3EC',
  },
};

export default V1;

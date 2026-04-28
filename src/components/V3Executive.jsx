import React from 'react'
import dados from '../data/dados.json'

// Variation 3 — Executive dense single-screen
// Tudo visível sem scroll. Layout em grade densa com microvisualizações.

const V3 = () => {
  const { useState } = React;
  const data = dados;

  const [anoSel, setAnoSel] = useState(2026);
  const [mesSel, setMesSel] = useState('Todos');

  const anoData = data.porAno.find(a => a.ano === anoSel);
  const anoAnt = data.porAno.find(a => a.ano === anoSel - 1);
  const periodo = mesSel === 'Todos' ? anoData.meses : anoData.meses.filter(m => m.mes === mesSel);
  const periodoAnt = anoAnt ? (mesSel === 'Todos' ? anoAnt.meses : anoAnt.meses.filter(m => m.mes === mesSel)) : null;

  const sum = (a,k) => a.reduce((s,x)=>s+x[k],0);
  const totalPessoas = sum(periodo,'pessoas');
  const totalVisitas = sum(periodo,'visitas');
  const totalFamilias = sum(periodo,'familias');
  const acsAtivos = Math.max(...periodo.map(m=>m.profissionais));
  const pessoasPorAC = totalPessoas / acsAtivos;
  const pctCobertura = periodo.reduce((s,m)=>s+m.pctVisitadas,0) / periodo.length;

  const yoy = (c, p) => p ? ((c-p)/p)*100 : null;
  const yoyPessoas = periodoAnt ? yoy(totalPessoas, sum(periodoAnt,'pessoas')) : null;
  const yoyVisitas = periodoAnt ? yoy(totalVisitas, sum(periodoAnt,'visitas')) : null;
  const yoyAC = periodoAnt ? yoy(pessoasPorAC, sum(periodoAnt,'pessoas') / Math.max(...periodoAnt.map(m=>m.profissionais))) : null;

  const fmt = (n) => new Intl.NumberFormat('pt-BR').format(Math.round(n));
  const fmtPct = (n) => (n>=0?'+':'')+n.toFixed(1)+'%';

  return (
    <div style={v3.root}>
      {/* Top strip */}
      <header style={v3.top}>
        <div style={v3.topL}>
          <svg width="22" height="22" viewBox="0 0 32 32"><rect width="32" height="32" rx="3" fill="#0A4D8C"/><path d="M16 8v16M8 16h16" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
          <span style={v3.topTitle}>Painel Executivo · Atenção Básica</span>
          <span style={v3.topSep}>/</span>
          <span style={v3.topPeriod}>{mesSel === 'Todos' ? `1º Trim. ${anoSel}` : `${mesSel}/${anoSel}`}</span>
        </div>
        <div style={v3.topR}>
          <FilterChip label="Ano">
            {[2023,2024,2025,2026].map(a => (
              <button key={a} onClick={()=>setAnoSel(a)} style={{...v3.chipBtn, ...(a===anoSel?v3.chipBtnActive:{})}}>{a}</button>
            ))}
          </FilterChip>
          <FilterChip label="Mês">
            {['Todos','Janeiro','Fevereiro','Março'].map(m => (
              <button key={m} onClick={()=>setMesSel(m)} style={{...v3.chipBtn, ...(m===mesSel?v3.chipBtnActive:{})}}>{m === 'Todos' ? 'Tri.' : m.slice(0,3)}</button>
            ))}
          </FilterChip>
          <span style={v3.timestamp}>27 abr 2026</span>
        </div>
      </header>

      {/* Hero strip + KPI grid */}
      <div style={v3.gridRoot}>
        {/* Headline number */}
        <div style={{...v3.cell, ...v3.cellHero}}>
          <div style={v3.heroLabel}>Pessoas alcançadas</div>
          <div style={v3.heroValue}>{fmt(totalPessoas)}</div>
          <div style={v3.heroFooter}>
            {yoyPessoas !== null && (
              <span style={{...v3.deltaTag, color: yoyPessoas>=0?'#1B8C5A':'#C0392B', borderColor: yoyPessoas>=0?'#1B8C5A':'#C0392B'}}>
                {yoyPessoas>=0?'▲':'▼'} {fmtPct(yoyPessoas)}
              </span>
            )}
            <span style={v3.deltaContext}>vs. mesmo período em {anoSel-1}</span>
          </div>
          <Sparkline data={data.porAno.flatMap(d=>d.meses)} highlightYear={anoSel} />
        </div>

        {/* KPI tiles */}
        <Tile label="Agentes Comunitários ativos" value={String(acsAtivos)} unit="ACs no pico do período" accent="#1B8C5A" />
        <Tile label="Pessoas por agente" value={fmt(pessoasPorAC)} unit={`média no ${mesSel === 'Todos' ? 'trimestre' : 'mês'}`} accent="#0A4D8C" delta={yoyAC} />
        <Tile label="Total de visitas" value={fmt(totalVisitas)} unit="visitas domiciliares" accent="#5C3A86" delta={yoyVisitas} />
        <Tile label="Cobertura de famílias" value={pctCobertura.toFixed(1)+'%'} unit={`${fmt(totalFamilias)} famílias`} accent="#C25A1F" />
      </div>

      {/* Charts row */}
      <div style={v3.chartsRow}>
        <Card title="Pessoas alcançadas — comparativo entre anos" style={{ flex: 2 }}>
          <YearlyLineChart data={data.porAno} highlight={anoSel} />
        </Card>
        <Card title="Distribuição mensal" style={{ flex: 1 }}>
          <MonthlyMini meses={anoData.meses} />
        </Card>
      </div>

      {/* Bottom strip */}
      <div style={v3.bottomRow}>
        <Card title="Pessoas / AC por ano" style={{ flex: 1 }}>
          <PpACMini data={data.porAno} highlight={anoSel} />
        </Card>
        <Card title="Equipe ao longo do ano" style={{ flex: 1 }}>
          <TeamMini meses={anoData.meses} />
        </Card>
        <Card title="Insights do período" style={{ flex: 2 }}>
          <Insights
            anoSel={anoSel}
            mesSel={mesSel}
            totalPessoas={totalPessoas}
            yoyPessoas={yoyPessoas}
            acsAtivos={acsAtivos}
            pessoasPorAC={pessoasPorAC}
            anoData={anoData}
            data={data}
          />
        </Card>
      </div>
    </div>
  );
};

const FilterChip = ({ label, children }) => (
  <div style={v3.chipGroup}>
    <span style={v3.chipLabel}>{label}</span>
    <div style={v3.chipBtns}>{children}</div>
  </div>
);

const Tile = ({ label, value, unit, accent, delta }) => (
  <div style={{...v3.cell, ...v3.cellTile, borderTop: `2px solid ${accent}`}}>
    <div style={v3.tileLabel}>{label}</div>
    <div style={{...v3.tileValue, color: '#0E1B2C'}}>{value}</div>
    <div style={v3.tileFooter}>
      <span style={v3.tileUnit}>{unit}</span>
      {delta !== null && delta !== undefined && (
        <span style={{...v3.tileDelta, color: delta>=0?'#1B8C5A':'#C0392B'}}>
          {delta>=0?'▲':'▼'} {(delta>=0?'+':'')+delta.toFixed(1)}%
        </span>
      )}
    </div>
  </div>
);

const Card = ({ title, style, children }) => (
  <div style={{...v3.card, ...style}}>
    <div style={v3.cardTitle}>{title}</div>
    <div style={v3.cardBody}>{children}</div>
  </div>
);

const Sparkline = ({ data, highlightYear }) => {
  const points = data.map((m, i) => ({ ...m, i }));
  const max = Math.max(...points.map(p=>p.pessoas));
  const W = 280, H = 50;
  const x = (i) => (i / (points.length - 1)) * W;
  const y = (v) => H - (v / max) * (H - 6) - 3;
  const path = points.map((p, i) => `${i===0?'M':'L'} ${x(i)} ${y(p.pessoas)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 50, marginTop: 12 }}>
      <path d={path} fill="none" stroke="#0A4D8C" strokeWidth="1.5" opacity="0.4" />
      {points.map((p, i) => p.ano === highlightYear && (
        <circle key={i} cx={x(i)} cy={y(p.pessoas)} r="3" fill="#0A4D8C" />
      ))}
    </svg>
  );
};

const YearlyLineChart = ({ data, highlight }) => {
  const W = 540, H = 200, P = { t: 16, r: 16, b: 30, l: 44 };
  const inW = W - P.l - P.r, inH = H - P.t - P.b;
  const meses = ['Janeiro', 'Fevereiro', 'Março'];
  const max = Math.ceil(Math.max(...data.flatMap(d=>d.meses.map(m=>m.pessoas))) / 2000) * 2000;
  const x = (i) => P.l + (i / (meses.length - 1)) * inW;
  const y = (v) => P.t + inH - (v / max) * inH;
  const colors = { 2023: '#9AB3C9', 2024: '#6B8AAB', 2025: '#1B8C5A', 2026: '#0A4D8C' };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      {[0, 0.5, 1].map((p, i) => (
        <g key={i}>
          <line x1={P.l} x2={W-P.r} y1={P.t+inH*(1-p)} y2={P.t+inH*(1-p)} stroke="#EEF2F7" />
          <text x={P.l-6} y={P.t+inH*(1-p)+3} fontSize="9" fill="#7A8AA0" textAnchor="end">{(max*p/1000)|0}k</text>
        </g>
      ))}
      {meses.map((m,i) => <text key={m} x={x(i)} y={H-10} fontSize="10" fill="#4A5A72" textAnchor="middle">{m}</text>)}
      {data.map(d => {
        const isHL = d.ano === highlight;
        const pts = d.meses.map((m,i) => `${x(i)},${y(m.pessoas)}`).join(' ');
        return (
          <g key={d.ano}>
            <polyline points={pts} fill="none" stroke={colors[d.ano]} strokeWidth={isHL?2.5:1.4} opacity={isHL?1:0.5} />
            {d.meses.map((m,i) => <circle key={i} cx={x(i)} cy={y(m.pessoas)} r={isHL?3.5:2} fill={colors[d.ano]} />)}
          </g>
        );
      })}
      <g transform={`translate(${P.l},2)`}>
        {data.map((d,i) => (
          <g key={d.ano} transform={`translate(${i*60},0)`}>
            <rect x="0" y="0" width="10" height="3" fill={colors[d.ano]} />
            <text x="14" y="4" fontSize="9" fill={d.ano===highlight?'#0E1B2C':'#7A8AA0'} fontWeight={d.ano===highlight?700:400}>{d.ano}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

const MonthlyMini = ({ meses }) => {
  const max = Math.max(...meses.map(m=>m.pessoas));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 8, padding: '4px 0' }}>
      {meses.map(m => (
        <div key={m.mes}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, marginBottom: 3 }}>
            <span style={{ color: '#4A5A72', fontWeight: 600 }}>{m.mes}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{m.pessoas.toLocaleString('pt-BR')}</span>
          </div>
          <div style={{ background: '#EEF2F7', height: 6, borderRadius: 3 }}>
            <div style={{ width: (m.pessoas/max*100)+'%', height: '100%', background: '#0A4D8C', borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const PpACMini = ({ data, highlight }) => {
  const max = Math.max(...data.map(d=>d.pessoas/d.profissionaisMax));
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap: 8, height: 100, padding: '8px 0' }}>
      {data.map(d => {
        const ratio = d.pessoas / d.profissionaisMax;
        const isHL = d.ano === highlight;
        return (
          <div key={d.ano} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: isHL?'#0A4D8C':'#4A5A72' }}>{Math.round(ratio)}</div>
            <div style={{ flex: 1, width:'100%', display:'flex', alignItems:'flex-end', marginTop: 4 }}>
              <div style={{ width:'100%', height: (ratio/max*100)+'%', background: isHL?'#0A4D8C':'#C8D3E0', borderRadius: '3px 3px 0 0' }} />
            </div>
            <div style={{ fontSize: 10, color: isHL?'#0A4D8C':'#7A8AA0', marginTop: 4, fontWeight: isHL?700:500 }}>{d.ano}</div>
          </div>
        );
      })}
    </div>
  );
};

const TeamMini = ({ meses }) => (
  <div style={{ display:'flex', alignItems:'flex-end', gap: 14, height: 100, padding: '8px 0' }}>
    {meses.map(m => (
      <div key={m.mes} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height: '100%' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0E1B2C' }}>{m.profissionais}</div>
        <div style={{ flex: 1, width:'100%', display:'flex', alignItems:'flex-end', marginTop: 4 }}>
          <div style={{ width:'100%', height: (m.profissionais/120*100)+'%', background: '#1B8C5A', borderRadius: '3px 3px 0 0' }} />
        </div>
        <div style={{ fontSize: 10, color: '#4A5A72', marginTop: 4 }}>{m.mes.slice(0,3)}</div>
      </div>
    ))}
  </div>
);

const Insights = ({ anoSel, mesSel, totalPessoas, yoyPessoas, acsAtivos, pessoasPorAC, anoData, data }) => {
  const melhorMes = [...anoData.meses].sort((a,b)=>b.pessoas-a.pessoas)[0];
  const items = [
    {
      icon: '★',
      color: '#1B8C5A',
      text: `${melhorMes.mes} foi o mês com maior alcance: ${melhorMes.pessoas.toLocaleString('pt-BR')} pessoas visitadas com ${melhorMes.profissionais} ACs ativos.`
    },
    yoyPessoas !== null && yoyPessoas >= 0 ? {
      icon: '▲',
      color: '#0A4D8C',
      text: `Crescimento de ${yoyPessoas.toFixed(1)}% no alcance de pessoas em relação a ${anoSel-1}, com adição de equipe.`
    } : yoyPessoas !== null ? {
      icon: '▼',
      color: '#C0392B',
      text: `Queda de ${Math.abs(yoyPessoas).toFixed(1)}% em relação a ${anoSel-1} — recomenda-se revisar dimensionamento da equipe.`
    } : null,
    {
      icon: '⊙',
      color: '#5C3A86',
      text: `Cada agente comunitário alcançou em média ${Math.round(pessoasPorAC)} pessoas no período — referência para metas de 2026.`
    },
    {
      icon: '◆',
      color: '#C25A1F',
      text: `Acumulado da série (Jan/2023–Mar/2026): ${data.totalGeralPessoas.toLocaleString('pt-BR')} pessoas em ${data.totalGeralVisitas.toLocaleString('pt-BR')} visitas.`
    }
  ].filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, lineHeight: 1.45, color: '#0E1B2C' }}>
          <span style={{ color: it.color, fontWeight: 700, fontSize: 14, lineHeight: 1.3, flexShrink: 0 }}>{it.icon}</span>
          <span>{it.text}</span>
        </div>
      ))}
    </div>
  );
};

const v3 = {
  root: { width: '100%', height: '100%', background: '#F4F6FA', fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif', color: '#0E1B2C', display: 'flex', flexDirection: 'column', padding: 18, gap: 12, boxSizing: 'border-box' },

  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 14px', background: '#fff', border: '1px solid #DDE3EC', borderRadius: 6 },
  topL: { display: 'flex', alignItems: 'center', gap: 12 },
  topTitle: { fontSize: 14, fontWeight: 700 },
  topSep: { color: '#C8D3E0' },
  topPeriod: { fontSize: 13, color: '#4A5A72', fontWeight: 600 },
  topR: { display: 'flex', alignItems: 'center', gap: 14 },
  timestamp: { fontSize: 11, color: '#7A8AA0' },

  chipGroup: { display: 'flex', alignItems: 'center', gap: 8 },
  chipLabel: { fontSize: 10, color: '#7A8AA0', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 },
  chipBtns: { display: 'flex', background: '#F4F6FA', borderRadius: 4, padding: 2, gap: 1 },
  chipBtn: { padding: '4px 10px', border: 'none', background: 'transparent', color: '#4A5A72', fontSize: 11, fontWeight: 600, borderRadius: 3, cursor: 'pointer', fontFamily: 'inherit' },
  chipBtnActive: { background: '#0A4D8C', color: '#fff' },

  gridRoot: { display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 12 },
  cell: { background: '#fff', border: '1px solid #DDE3EC', borderRadius: 6, padding: 16 },
  cellHero: { gridRow: 'span 1', display: 'flex', flexDirection: 'column', borderTop: '3px solid #0A4D8C' },
  heroLabel: { fontSize: 11, color: '#7A8AA0', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 },
  heroValue: { fontSize: 52, fontWeight: 800, lineHeight: 1, marginTop: 6, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' },
  heroFooter: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 },
  deltaTag: { fontSize: 11, fontWeight: 700, padding: '2px 6px', border: '1px solid', borderRadius: 3 },
  deltaContext: { fontSize: 11, color: '#7A8AA0' },

  cellTile: { display: 'flex', flexDirection: 'column' },
  tileLabel: { fontSize: 11, color: '#7A8AA0', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 },
  tileValue: { fontSize: 32, fontWeight: 700, marginTop: 8, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', lineHeight: 1 },
  tileFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'auto', paddingTop: 12, gap: 8 },
  tileUnit: { fontSize: 11, color: '#7A8AA0' },
  tileDelta: { fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },

  chartsRow: { display: 'flex', gap: 12, flex: 1, minHeight: 0 },
  bottomRow: { display: 'flex', gap: 12, flex: 1, minHeight: 0 },
  card: { background: '#fff', border: '1px solid #DDE3EC', borderRadius: 6, padding: '12px 14px', display: 'flex', flexDirection: 'column' },
  cardTitle: { fontSize: 12, fontWeight: 700, color: '#0E1B2C', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #EEF2F7' },
  cardBody: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
};

export default V3;

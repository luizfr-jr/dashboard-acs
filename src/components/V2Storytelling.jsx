import React from 'react'
import dados from '../data/dados.json'

// Variation 2 — Data-storytelling vertical
// Layout narrativo de cima pra baixo. Números enormes, anotações contextuais.

const V2 = () => {
  const { useState, useMemo } = React;
  const data = dados;

  const [anoSel, setAnoSel] = useState(2026);
  const [mesSel, setMesSel] = useState('Todos');

  const anoData = data.porAno.find(a => a.ano === anoSel);
  const anoAnt = data.porAno.find(a => a.ano === anoSel - 1);

  const periodo = mesSel === 'Todos' ? anoData.meses : anoData.meses.filter(m => m.mes === mesSel);
  const periodoAnt = anoAnt ? (mesSel === 'Todos' ? anoAnt.meses : anoAnt.meses.filter(m => m.mes === mesSel)) : null;

  const sum = (a, k) => a.reduce((s,x)=>s+x[k], 0);
  const totalPessoas = sum(periodo, 'pessoas');
  const totalVisitas = sum(periodo, 'visitas');
  const totalFamilias = sum(periodo, 'familias');
  const acsAtivos = Math.max(...periodo.map(m => m.profissionais));
  const pessoasPorAC = totalPessoas / acsAtivos;
  const yoyPessoas = periodoAnt ? ((totalPessoas - sum(periodoAnt,'pessoas')) / sum(periodoAnt,'pessoas')) * 100 : null;
  const yoyVisitas = periodoAnt ? ((totalVisitas - sum(periodoAnt,'visitas')) / sum(periodoAnt,'visitas')) * 100 : null;

  const fmt = (n) => new Intl.NumberFormat('pt-BR').format(Math.round(n));

  return (
    <div style={v2.root}>
      {/* Hero */}
      <header style={v2.hero}>
        <div style={v2.heroTopBar}>
          <div style={v2.brandRow}>
            <svg width="28" height="28" viewBox="0 0 32 32"><rect width="32" height="32" rx="3" fill="#fff"/><path d="M16 8v16M8 16h16" stroke="#0A4D8C" strokeWidth="3" strokeLinecap="round"/></svg>
            <span style={v2.brandName}>ATENÇÃO BÁSICA · PAINEL EXECUTIVO</span>
          </div>
          <div style={v2.controlPill}>
            <span style={{ opacity: 0.7, fontSize: 11, letterSpacing: '0.1em' }}>PERÍODO</span>
            {[2023, 2024, 2025, 2026].map(a => (
              <button key={a} onClick={()=>setAnoSel(a)} style={{ ...v2.pillBtn, ...(a===anoSel?v2.pillBtnActive:{}) }}>{a}</button>
            ))}
            <span style={v2.pillSep} />
            {['Todos', 'Janeiro', 'Fevereiro', 'Março'].map(m => (
              <button key={m} onClick={()=>setMesSel(m)} style={{ ...v2.pillBtn, ...(m===mesSel?v2.pillBtnActive:{}) }}>{m === 'Todos' ? 'Trim.' : m.slice(0,3)}</button>
            ))}
          </div>
        </div>

        <div style={v2.heroContent}>
          <div style={v2.heroKicker}>{mesSel === 'Todos' ? `1º TRIMESTRE DE ${anoSel}` : `${mesSel.toUpperCase()} DE ${anoSel}`}</div>
          <div style={v2.heroNumber}>
            {fmt(totalPessoas)}
          </div>
          <div style={v2.heroLabel}>
            pessoas alcançadas pelos Agentes Comunitários de Saúde
          </div>
          <div style={v2.heroSubline}>
            <span style={v2.heroSubItem}>
              <span style={v2.heroSubVal}>{acsAtivos}</span>
              <span style={v2.heroSubLabel}>agentes comunitários ativos</span>
            </span>
            <span style={v2.heroSubItem}>
              <span style={v2.heroSubVal}>{fmt(pessoasPorAC)}</span>
              <span style={v2.heroSubLabel}>pessoas por agente</span>
            </span>
            <span style={v2.heroSubItem}>
              <span style={v2.heroSubVal}>{fmt(totalVisitas)}</span>
              <span style={v2.heroSubLabel}>visitas domiciliares</span>
            </span>
            {yoyPessoas !== null && (
              <span style={{ ...v2.heroSubItem, ...v2.heroDelta }}>
                <span style={v2.heroSubVal}>
                  {yoyPessoas >= 0 ? '↑' : '↓'} {Math.abs(yoyPessoas).toFixed(1)}%
                </span>
                <span style={v2.heroSubLabel}>vs. {anoSel - 1}</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Story 1: Yearly trajectory */}
      <section style={v2.section}>
        <div style={v2.sectionHeader}>
          <div style={v2.sectionNum}>01</div>
          <div>
            <h2 style={v2.sectionTitle}>A trajetória dos últimos 4 anos</h2>
            <p style={v2.sectionLead}>Após queda em 2024, o programa retomou crescimento consistente. <strong>2026</strong> projeta o melhor primeiro trimestre da série.</p>
          </div>
        </div>
        <YearlyComparison data={data.porAno} highlight={anoSel} />
      </section>

      {/* Story 2: Pessoas por AC */}
      <section style={v2.section}>
        <div style={v2.sectionHeader}>
          <div style={{ ...v2.sectionNum, background: '#1B8C5A' }}>02</div>
          <div>
            <h2 style={v2.sectionTitle}>Quantas pessoas cada agente alcança?</h2>
            <p style={v2.sectionLead}>A produtividade média por agente comunitário é um indicador-chave de cobertura territorial.</p>
          </div>
        </div>
        <PessoasPorACChart data={data.porAno} highlight={anoSel} />
      </section>

      {/* Story 3: Composição mensal */}
      <section style={v2.section}>
        <div style={v2.sectionHeader}>
          <div style={{ ...v2.sectionNum, background: '#C25A1F' }}>03</div>
          <div>
            <h2 style={v2.sectionTitle}>Como o trimestre se distribui em {anoSel}</h2>
            <p style={v2.sectionLead}>Mês a mês: pessoas alcançadas, agentes ativos e cobertura de famílias.</p>
          </div>
        </div>
        <MonthlyBreakdown meses={anoData.meses} />
      </section>

      <footer style={v2.footer}>
        <span>Fonte: Sistema de gestão da Atenção Básica · Jan/2023 a Mar/2026</span>
        <span>Acumulado: <strong>{data.totalGeralPessoas.toLocaleString('pt-BR')} pessoas</strong> · <strong>{data.totalGeralVisitas.toLocaleString('pt-BR')} visitas</strong></span>
      </footer>
    </div>
  );
};

const YearlyComparison = ({ data, highlight }) => {
  const max = Math.max(...data.map(d => d.pessoas));
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 360, padding: '20px 0', borderBottom: '1px solid #DDE3EC' }}>
      {data.map((d, i) => {
        const isHL = d.ano === highlight;
        const h = (d.pessoas / max) * 280;
        const yoy = i > 0 ? ((d.pessoas - data[i-1].pessoas) / data[i-1].pessoas) * 100 : null;
        return (
          <div key={d.ano} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 13, color: yoy !== null ? (yoy >= 0 ? '#1B8C5A' : '#C0392B') : '#7A8AA0', fontWeight: 600 }}>
              {yoy !== null ? `${yoy >= 0 ? '+' : ''}${yoy.toFixed(1)}%` : '—'}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0E1B2C', fontVariantNumeric: 'tabular-nums' }}>
              {(d.pessoas / 1000).toFixed(1)}k
            </div>
            <div style={{
              width: '70%',
              height: h,
              background: isHL ? 'linear-gradient(180deg, #0A4D8C, #1B6DB8)' : '#C8D3E0',
              borderRadius: '4px 4px 0 0',
              boxShadow: isHL ? '0 4px 16px rgba(10,77,140,0.25)' : 'none',
              transition: 'all 0.3s',
            }} />
            <div style={{ fontSize: 14, fontWeight: isHL ? 700 : 500, color: isHL ? '#0A4D8C' : '#4A5A72', marginTop: 6 }}>
              {d.ano}
            </div>
            <div style={{ fontSize: 11, color: '#7A8AA0' }}>
              {d.profissionaisMax} ACs ativos
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PessoasPorACChart = ({ data, highlight }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, padding: '12px 0' }}>
      {data.map(d => {
        const ratio = d.pessoas / d.profissionaisMax;
        const isHL = d.ano === highlight;
        return (
          <div key={d.ano} style={{
            background: isHL ? '#0A4D8C' : '#fff',
            color: isHL ? '#fff' : '#0E1B2C',
            border: isHL ? 'none' : '1px solid #DDE3EC',
            borderRadius: 8,
            padding: '20px 18px',
          }}>
            <div style={{ fontSize: 12, opacity: isHL ? 0.8 : 0.6, fontWeight: 600, letterSpacing: '0.08em' }}>{d.ano}</div>
            <div style={{ fontSize: 48, fontWeight: 700, marginTop: 6, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              {Math.round(ratio)}
            </div>
            <div style={{ fontSize: 12, opacity: isHL ? 0.85 : 0.65, marginTop: 4 }}>pessoas / agente</div>
            <div style={{ marginTop: 14, fontSize: 11, opacity: isHL ? 0.75 : 0.55 }}>
              {d.pessoas.toLocaleString('pt-BR')} pessoas ÷ {d.profissionaisMax} ACs
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MonthlyBreakdown = ({ meses }) => {
  const max = Math.max(...meses.map(m => m.pessoas));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {meses.map(m => (
        <div key={m.mes} style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 220px',
          alignItems: 'center',
          gap: 24,
          padding: '18px 22px',
          background: '#fff',
          border: '1px solid #DDE3EC',
          borderRadius: 8,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0E1B2C' }}>{m.mes}</div>
            <div style={{ fontSize: 12, color: '#7A8AA0' }}>{m.profissionais} ACs ativos</div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#7A8AA0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pessoas alcançadas</span>
              <span style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#0E1B2C' }}>
                {m.pessoas.toLocaleString('pt-BR')}
              </span>
            </div>
            <div style={{ background: '#EEF2F7', height: 12, borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ width: (m.pessoas / max * 100) + '%', height: '100%', background: 'linear-gradient(90deg, #0A4D8C, #1B6DB8)', borderRadius: 6 }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#4A5A72' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Visitas</span><strong style={{ color: '#0E1B2C' }}>{m.visitas.toLocaleString('pt-BR')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Famílias</span><strong style={{ color: '#0E1B2C' }}>{m.familias.toLocaleString('pt-BR')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cobertura</span><strong style={{ color: '#1B8C5A' }}>{m.pctVisitadas.toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const v2 = {
  root: { width: '100%', minHeight: '100%', background: '#F4F6FA', fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif', color: '#0E1B2C', display: 'flex', flexDirection: 'column' },
  hero: { background: 'linear-gradient(140deg, #0A4D8C 0%, #0E3A6B 100%)', color: '#fff', padding: '28px 56px 64px' },
  heroTopBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  brandRow: { display: 'flex', alignItems: 'center', gap: 12 },
  brandName: { fontSize: 12, letterSpacing: '0.14em', fontWeight: 600, opacity: 0.9 },
  controlPill: { display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 30, padding: '6px 8px', backdropFilter: 'blur(6px)' },
  pillBtn: { padding: '6px 12px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit' },
  pillBtnActive: { background: '#fff', color: '#0A4D8C' },
  pillSep: { width: 1, height: 18, background: 'rgba(255,255,255,0.25)', margin: '0 4px' },
  heroContent: { maxWidth: 900 },
  heroKicker: { fontSize: 13, letterSpacing: '0.18em', fontWeight: 600, opacity: 0.85, marginBottom: 8 },
  heroNumber: { fontSize: 120, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' },
  heroLabel: { fontSize: 22, fontWeight: 400, opacity: 0.92, marginTop: 8, maxWidth: 700, lineHeight: 1.3 },
  heroSubline: { display: 'flex', gap: 40, marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.2)' },
  heroSubItem: { display: 'flex', flexDirection: 'column' },
  heroSubVal: { fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  heroSubLabel: { fontSize: 11, opacity: 0.75, letterSpacing: '0.06em', marginTop: 2 },
  heroDelta: { color: '#A7E0BD' },

  section: { padding: '40px 56px', borderBottom: '1px solid #DDE3EC' },
  sectionHeader: { display: 'flex', gap: 20, marginBottom: 20, alignItems: 'flex-start' },
  sectionNum: { width: 44, height: 44, borderRadius: 4, background: '#0A4D8C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', flexShrink: 0 },
  sectionTitle: { fontSize: 24, fontWeight: 700, margin: 0, color: '#0E1B2C', letterSpacing: '-0.01em' },
  sectionLead: { fontSize: 15, color: '#4A5A72', margin: '4px 0 0', maxWidth: 700, lineHeight: 1.5 },

  footer: { padding: '20px 56px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#7A8AA0', background: '#fff' },
};

export default V2;

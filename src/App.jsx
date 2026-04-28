import React from 'react'
import DesignCanvas, { DCSection, DCArtboard } from './components/DesignCanvas'
import V1 from './components/V1Institucional'
import V2 from './components/V2Storytelling'
import V3 from './components/V3Executive'

export default function App() {
  return (
    <DesignCanvas title="Dashboard ACS — 3 direções" subtitle="Painel executivo · Atenção Básica · 2026">
      <DCSection id="dashboards" title="Variações de Layout" subtitle="Mesmos dados, três tratamentos. Clique em um artboard para abrir em tela cheia.">
        <DCArtboard id="v1" label="01 · Institucional clássico" width={1280} height={920}>
          <V1 />
        </DCArtboard>
        <DCArtboard id="v3" label="02 · Executivo denso (uma tela)" width={1440} height={900}>
          <V3 />
        </DCArtboard>
        <DCArtboard id="v2" label="03 · Data-storytelling vertical" width={1280} height={1900}>
          <V2 />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  )
}

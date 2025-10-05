# Auditoria de UI

## Principais achados

1. **Hero 3D com partículas aleatórias gera variações visuais** – o componente recalcula as posições das partículas em cada renderização, o que dificulta regressões visuais consistentes e pode aumentar o custo de renderização se o usuário não tiver `prefers-reduced-motion` configurado. [Evidência](../src/components/Hero3D.tsx#L1-L52)
2. **Navegação Gooey depende do estado da rota** – a barra fixa utiliza `react-router-dom` para detectar a rota ativa e transições com `framer-motion`, exigindo que histórias e testes forneçam um roteador de memória para cobrir todos os caminhos. [Evidência](../src/components/reactbits/GooeyNav.tsx#L1-L89)
3. **SectionReveal repete lógica de animação em várias páginas** – o wrapper concentra a animação de entrada com `whileInView`, permitindo criar histórias focadas no ajuste de `delay` e `className` para validar tokens de espaçamento. [Evidência](../src/components/SectionReveal.tsx#L1-L26)
4. **Skeletons garantem placeholders coerentes** – os placeholders de obras e timeline compartilham linguagem visual com cantos arredondados e espaçamentos fluidos, importantes para validar estados de carregamento em regressões. [Evidência](../src/components/ArtworkSkeleton.tsx#L1-L11) · [Evidência](../src/components/TimelineSkeleton.tsx#L1-L18)

## Recomendações

- **Forçar `prefers-reduced-motion` em testes visuais** para manter consistência ao capturar telas do Hero 3D e de seções com animações intensas.
- **Documentar variações de navegação no Storybook** garantindo controles para testar cada rota antes de promover releases.
- **Cobrir estados de carregamento** com capturas Playwright/Storybook para evitar regressões de layout em dados lentos.

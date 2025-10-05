# Auditoria de UI – Art Leo

## Resumo executivo

- A navegação principal mantém consistência visual e feedback animado, mas ainda carece de um "skip link" para facilitar salto direto ao conteúdo principal em leitores de tela.
- Componentes críticos como botões e cartões têm variantes de alto contraste documentadas e agora contam com stories que aceleram validação visual.
- As páginas com cenas WebGL (Hero3D) continuam exigindo fallback estático para usuários com `prefers-reduced-motion`; o comportamento está implementado, porém precisa de monitoramento de performance móvel.

## Principais achados

| Área | Observação | Evidência |
| ---- | ---------- | --------- |
| Navegação | Não há ponto de acesso rápido ao conteúdo ou indicação de foco visível para o contêiner principal. Recomenda-se incluir skip link e focar o primeiro heading ao navegar por teclado. | [`src/components/Navigation.tsx`](../src/components/Navigation.tsx) |
| Componentes de ação | Variantes "glass" e "hero" possuem contraste aceitável, mas devem ser validadas periodicamente contra a paleta dinâmica. Stories permitem captura rápida de regressões. | [`src/components/ui/button.tsx`](../src/components/ui/button.tsx), [`src/components/ui/button.stories.tsx`](../src/components/ui/button.stories.tsx) |
| Cards de portfolio | Layout responsivo preserva hierarquia e espaçamento. Story dedicada cobre estado padrão e placeholder esquelético usado nas páginas de carregamento. | [`src/components/ui/card.tsx`](../src/components/ui/card.tsx), [`src/components/ui/card.stories.tsx`](../src/components/ui/card.stories.tsx) |
| Hero animado | Campo de partículas degrade fallback está ativo para reduzir movimento, mas há custo de renderização elevado em dispositivos modestos. Monitorar FPS durante QA móvel. | [`src/components/Hero3D.tsx`](../src/components/Hero3D.tsx) |
| Cobertura visual | Capturas automatizadas por breakpoint evitam regressões em navegação, portfolio, about e contact. Os anexos são armazenados no relatório HTML do Playwright. | [`tests/visual-breakpoints.spec.ts`](../tests/visual-breakpoints.spec.ts) |
| Acessibilidade | Auditoria automatizada via axe-core verifica critérios WCAG 2.0/2.1 nível A/AA, garantindo visibilidade de violações críticas antes do deploy. | [`tests/accessibility.spec.ts`](../tests/accessibility.spec.ts) |

## Próximos passos sugeridos

1. Introduzir um componente de skip link visível ao foco e revisar ordem de tabulação no header.
2. Medir desempenho do `Hero3D` em dispositivos móveis usando as capturas do Playwright como baseline e considerar degradação progressiva abaixo de 60 FPS.
3. Expandir stories para componentes de formulário (`input`, `textarea`) com estados de erro/sucesso, garantindo alinhamento com guidelines de acessibilidade.

## Como validar

- Executar `npm run test:visual` para gerar novas capturas responsivas.
- Rodar `npm run test:axe` e `npm run test:lighthouse` antes de aprovar mudanças sensíveis de UI.
- Revisar os relatórios anexos em `playwright-report/` e `./.lighthouse/` junto com o time de design.

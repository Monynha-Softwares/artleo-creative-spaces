# Checklist de Regressão de UI

## Layout e navegação
- [ ] Verificar navegação Gooey em resoluções desktop/tablet/mobile, garantindo destaque do link ativo.
- [ ] Validar o comportamento do menu hambúrguer: animação de abertura, foco nos itens e fechamento após clique.
- [ ] Confirmar que `ScrollToTop` reposiciona a viewport ao trocar de rota.

## Hero e animações
- [ ] Testar fallback estático do `Hero3D` quando `prefers-reduced-motion` está ativo.
- [ ] Avaliar desempenho do campo de partículas no desktop e quedas de FPS em dispositivos modestos.
- [ ] Garantir que textos animados (SplitText/TextType) mantenham contraste adequado durante transições.

## Seções de conteúdo
- [ ] Validar espaçamentos e delays do `SectionReveal` em seções com múltiplos cards.
- [ ] Conferir responsividade do carrossel/galeria destacada e dos cards Spotlight/Pixel.
- [ ] Confirmar consistência visual entre estados carregados e `ArtworkSkeleton`/`TimelineSkeleton`.

## Formulários e acessibilidade
- [ ] Executar varredura axe-core para garantir ausência de violações críticas.
- [ ] Testar navegação por teclado em modais, menus e botões principais.
- [ ] Revisar mensagens de erro e foco nos formulários de contato/login.

## Performance e VRT
- [ ] Rodar o fluxo de Playwright com capturas por breakpoint (mobile, tablet, desktop).
- [ ] Atualizar snapshots do Chromatic após aprovar alterações visuais intencionais.
- [ ] Registrar relatórios Lighthouse (Performance, Accessibility, Best Practices, SEO) no diretório `reports/`.

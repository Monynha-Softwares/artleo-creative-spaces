# Checklist de regressão UI

Use esta lista antes de cada release para garantir que os fluxos principais do Art Leo continuam íntegros.

## Preparação
- [ ] Instalar dependências (`npm install`) e gerar build de produção (`npm run build`).
- [ ] Atualizar as referências visuais executando `npm run test:visual` e revisar `playwright-report/index.html`.
- [ ] Publicar a build no Chromatic (`npm run chromatic`) ou confirmar que o job de CI executou o passo.

## Navegação
- [ ] Logo retorna para a Home e mantém animação gooey sem jitter visível em desktop.
- [ ] Menu hambúrguer alterna para o Flowing Menu no mobile com foco e `aria-expanded` atualizados.
- [ ] Verificar existência/visibilidade de skip link (até ser implementado) e foco no primeiro heading ao tabular.

## Hero & motion
- [ ] Hero 3D aplica fallback estático quando `prefers-reduced-motion` está ativo.
- [ ] Animações do título e cards não ultrapassam 3 componentes React Bits na mesma viewport.
- [ ] Verificar FPS em dispositivos móveis (capturas Playwright mobile) e ausência de tearing.

## Portfolio
- [ ] Cards principais carregam skeletons antes do conteúdo final (referência em `UI/Card` story "Skeleton").
- [ ] Carousel/rolling gallery responde ao teclado e pausa animações com `prefers-reduced-motion`.
- [ ] Filtros e busca permanecem funcionais depois do último refino de dados.

## Formulários & feedback
- [ ] Campos de contato exibem estados de erro e sucesso consistentes com os tokens da marca.
- [ ] Toasts e feedbacks (Sonner) aparecem uma única vez e respeitam `aria-live`.
- [ ] Inputs de OTP, upload ou sliders mantêm rótulos e descrições acessíveis.

## Acessibilidade & performance
- [ ] Executar `npm run test:axe` e resolver violações críticas reportadas.
- [ ] Rodar `npm run test:lighthouse` garantindo pontuação >= 90 em Performance e Acessibilidade.
- [ ] Revisar mudanças de contraste nos temas claro/escuro quando aplicável.

## Pós-release
- [ ] Atualizar `docs/ui-audit.md` com novos achados relevantes.
- [ ] Armazenar capturas Playwright e relatórios Lighthouse no diretório compartilhado do time.

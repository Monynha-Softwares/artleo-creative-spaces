# Auditoria da branch `add-liquid-ether-background-globally`

## Visão geral
- Escopo verificado: integração do `LiquidEtherBackground`, hooks Supabase (artworks, pages, settings, expositions, mensagens de contato), formulário de contato, design system/acessibilidade, desempenho do bundle, estrutura/código morto e alinhamento com RLS.
- Ferramentas utilizadas: análise estática do código-fonte, busca contextual e build de produção para aferir tamanho do bundle.

## Tarefas de correção propostas

1. **Mitigar peso do bundle inicial gerado pelo Liquid Ether**  
   - **Prioridade:** Alta · **Tipo:** Performance  
   - **Local:** `src/App.tsx` (importação estática), `src/components/reactbits/LiquidEtherBackground.tsx`, relatório de build  
   - **Problema:** O build de produção gera um chunk JS de ~1,23 MB (gzip 354 kB), muito acima da meta < 170 kB, porque o `LiquidEtherBackground` (que embute `three` + shaders) é importado estaticamente e carregado em todas as rotas públicas.  
   - **Impacto:** Tempo de carregamento inicial elevado e queda no Core Web Vitals, especialmente em conexões móveis.  
   - **Solução proposta:** Converter o background para `React.lazy`/`Suspense` com fallback estático (gradiente) e/ou usar `import()` condicionado a `prefers-reduced-motion`/`IntersectionObserver`, além de mover `three` para um chunk dedicado.  
   - **Referências:** `App` monta o background globalmente【F:src/App.tsx†L1-L49】; o bundle excede 1 MB após minificação【81eb4f†L1-L10】.

2. **Ajustar remoção dos event listeners no `LiquidEther`**  
   - **Prioridade:** Média · **Tipo:** Bug  
   - **Local:** `src/components/reactbits/LiquidEther.tsx` linhas 163–173  
   - **Problema:** Os listeners de `mousemove`/`touch*` são adicionados com `{ passive: true }`, porém removidos com o terceiro parâmetro `false`, o que impede o `removeEventListener` de funcionar. Isso provoca múltiplos handlers ativos após hot-reload ou recriação do canvas.  
   - **Impacto:** Vazamento de memória, degradação de performance e comportamento inconsistente do background em re-montagens.  
   - **Solução proposta:** Persistir as mesmas opções (usar objeto constante ou `passive: true`) ao remover, garantindo detach correto durante `dispose()`.  
   - **Referências:** Implementação atual de `init`/`dispose` do `MouseClass`【F:src/components/reactbits/LiquidEther.tsx†L140-L173】.

3. **Tornar `SectionReveal` compatível com `prefers-reduced-motion`**  
   - **Prioridade:** Média · **Tipo:** Acessibilidade  
   - **Local:** `src/components/SectionReveal.tsx`  
   - **Problema:** O componente aplica animações de entrada com `framer-motion` sem consultar `useReducedMotion`. Usuários que solicitam movimento reduzido continuam recebendo transições, contrariando WCAG 2.2.  
   - **Impacto:** Experiência desconfortável para pessoas sensíveis a movimento; risco de não conformidade com políticas de acessibilidade.  
   - **Solução proposta:** Integrar `useReducedMotion` para desativar animações (ou usar transições instantâneas) quando o usuário preferir movimento reduzido.  
   - **Referências:** Animação fixa sem verificação de preferência【F:src/components/SectionReveal.tsx†L1-L25】.

4. **Fortalecer validação acessível do formulário de contato**  
   - **Prioridade:** Média · **Tipo:** Acessibilidade  
   - **Local:** `src/pages/Contact.tsx`, `src/hooks/useContactForm.ts`  
   - **Problema:** O formulário controla estado manualmente e delega erros ao toast global. A validação Zod dispara exceções, mas não há mensagens contextuais (`aria-live`, `role=alert`) nem `aria-invalid` nos campos. Usuários com leitor de tela não recebem feedback apropriado e quem desabilita toasts fica sem retorno.  
   - **Impacto:** Violação de boas práticas de acessibilidade e possível perda de dados (usuário não sabe por que o envio falhou).  
   - **Solução proposta:** Migrar para React Hook Form + `zodResolver`, exibir mensagens inline vinculadas via `<FormMessage>`/`aria-describedby`, e manter o toast apenas como complemento.  
   - **Referências:** Implementação atual do form e da mutação Supabase【F:src/pages/Contact.tsx†L1-L172】【F:src/hooks/useContactForm.ts†L1-L44】.

5. **Expor conteúdo dinâmico de `pages`/`settings` via hooks dedicados**  
   - **Prioridade:** Média · **Tipo:** Refatoração  
   - **Local:** Diretório `src/hooks` e páginas estáticas  
   - **Problema:** Apenas artworks/exhibitions/contact usam hooks. Não há consultas para tabelas `pages`/`settings`; a home e demais páginas exibem texto hardcoded, exigindo deploy para ajustes editoriais.  
   - **Impacto:** Equipe de conteúdo depende de releases para mudanças simples; integrações CMS/Supabase ficam subutilizadas.  
   - **Solução proposta:** Criar hooks tipados (`usePage`, `useSettings`) com cache React Query e consumir nos componentes relevantes (Hero, metadata, CTAs), permitindo que o painel Supabase controle conteúdo.  
   - **Referências:** Hooks existentes limitam-se a artworks/exhibitions/contact【503ff4†L1-L2】; não há queries `pages`/`settings` no código【53ede6†L1-L2】【1caebd†L1-L2】; Home mantém copy estático【F:src/pages/Home.tsx†L1-L134】.

6. **Remover/arquivar `SilkBackground` não utilizado**  
   - **Prioridade:** Baixa · **Tipo:** Refatoração  
   - **Local:** `src/components/reactbits/SilkBackground.tsx`  
   - **Problema:** O componente permanece no código sem ser importado (apenas citado no README), aumentando a superfície de manutenção e confundindo novas contribuições.  
   - **Impacto:** Código morto dificulta rastrear a variante vigente do background e aumenta o custo cognitivo.  
   - **Solução proposta:** Excluir o arquivo ou mover para exemplos/documentação, garantindo que só `LiquidEther` seja mantido no bundle.  
   - **Referências:** Implementação residual do SilkBackground【F:src/components/reactbits/SilkBackground.tsx†L1-L60】; busca sem usos no app【e3466e†L1-L7】.

7. **Usar `isAdmin` para alinhar visualização de rascunhos às policies de RLS**  
   - **Prioridade:** Média · **Tipo:** Bug  
   - **Local:** `src/hooks/useArtwork.ts`, `src/contexts/AuthContext.tsx`  
   - **Problema:** O hook `useArtwork` não diferencia usuários autenticados; ele pede qualquer slug sem filtrar `status`, enquanto o contexto calcula `isAdmin` mas ninguém consome essa flag. Assim, admins não conseguem pré-visualizar rascunhos (pois o hook de lista filtra `published`) e visitantes dependem de erros de RLS para bloquear conteúdo.  
   - **Impacto:** Fluxo editorial inconsistente: admins não veem rascunhos no front, e mensagens de erro do Supabase podem vazar para usuários finais.  
   - **Solução proposta:** Injetar `isAdmin` nos hooks (`useArtwork`/`useArtworks`) para decidir filtros (`eq('status','published')` para público, sem filtro para admin) e tratar `403` com mensagem amigável.  
   - **Referências:** Hook ignora `status` e não usa `isAdmin`【F:src/hooks/useArtwork.ts†L1-L18】; contexto expõe `isAdmin` mas não há consumidores além do provider【4508c9†L1-L5】【F:src/contexts/AuthContext.tsx†L1-L155】.

---

**Observação:** Nenhuma correção foi aplicada neste commit; o arquivo contém apenas recomendações de auditoria.

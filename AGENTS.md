### Análise da base existente

A versão atual do **Art Leo** é construída em React com React Router, Tailwind (incluindo tokens “fluid”), animações do Framer Motion e um campo 3D feito com `@react-three/fiber` e `@react-three/drei`. O *Hero* exibe um campo de partículas animado que roda lentamente em torno de X e Y, sobreposto por um gradiente e texto principal. As seções seguintes utilizam um componente `SectionReveal` para revelar cards e textos no scroll e incluem cards estáticos para destacar “Motion Design”, “3D Art” e “Interactive”. O portfólio e demais páginas usam cards simples com transições de hover. Portanto, o site já dispõe de uma boa fundação com Supabase/Next.js, mas as animações e cards são relativamente básicos.

### React Bits – visão geral

React Bits é uma biblioteca de componentes animados que oferece **backgrounds 3D (Aurora, Silk, Plasma, Particles etc.), cards interativos (Pixel Card, Spotlight Card, Decay Card), menus animados (Flowing Menu, Gooey Nav) e efeitos de texto (Split Text, Gradient Text, Text Type)**, todos personalizáveis e independentes. Os componentes são importados individualmente, podendo ser copiados manualmente ou instalados via CLI (e.g. `npx shadcn@latest add https://reactbits.dev/r/Silk-JS-CSS`). A biblioteca recomenda utilizar **no máximo 2–3 componentes React Bits por página** para preservar desempenho e prever alternativas estáticas para dispositivos móveis ou usuários com `prefers-reduced-motion`.

### Proposta de redesign com React Bits

A seguir, um **plano passo a passo**, em forma de *prompt*, para adaptar o site Art Leo usando componentes React Bits, com foco em backgrounds 3D, animações de texto e cards interativos. As sugestões mantêm a identidade visual (fundo escuro com gradiente roxo/azul) e integram Supabase para dados dinâmicos.

---

#### 1. Preparação e instalação

1. **Escolha os componentes React Bits** que serão utilizados (ver seções abaixo).
2. **Instale dependências** para backgrounds 3D:

   ```bash
   npm install three @react-three/fiber @react-three/drei
   ```
3. Para cada componente selecionado, **copie o código do site** ou use a CLI do React Bits, por exemplo:

   ```bash
   # instalar o componente Silk com variantes JS+CSS
   npx shadcn@latest add https://reactbits.dev/r/Silk-JS-CSS
   ```

   Os arquivos serão adicionados à pasta `components` (por exemplo `Silk.tsx`), juntamente com o CSS correspondente.
4. **Mantenha a estratégia de acessibilidade**: verifique a mídia-query `prefers-reduced-motion` e forneça fallback estático (gradientes simples ou imagens) para backgrounds e efeitos pesados.

---

#### 2. Home / Hero

* **Background 3D**: substitua o componente `Hero3D` por um background React Bits como **Aurora** ou **Silk**. Esses componentes geram ondas fluidas e auroras com WebGL; modifique as props (`speed`, `scale`, `color`, `noiseIntensity`) para obter um efeito etéreo que combina com roxo/azul. Mantenha um gradiente de fallback quando `prefers-reduced-motion` estiver ativo.
* **Texto animado**: troque o título “Leonardo Silva / Crafting Visual Stories” por **Split Text** ou **Gradient Text**. Divida o texto em caracteres e aplique `staggerDelay` para revelar cada letra; defina `tag="h1"` e `text="Leonardo Silva\nCrafting Visual Stories"`.
* **Cards de destaque**: substitua a grade de três cards (“Motion Design”, “3D Art”, “Interactive”) por **Spotlight Card** ou **Pixel Card**. Cada card reage ao movimento do cursor com um efeito de spotlight/pixelado; configure `spotlightColor` ou `variant` para cores primárias, e forneça ícones (Palette, Eye, Sparkles) dentro do slot `children`.
* **Indicador de scroll**: adicione o componente **Scroll Float** ou utilize o **Infinite Scroll** minimalista para a seta que anima para baixo.

---

#### 3. Seção de trabalhos em destaque

* **Carousel/Galeria**: use **Rolling Gallery** ou **Carousel** para mostrar um carrossel horizontal com as 6 obras mais recentes. Cada slide pode usar um **Tilted Card** (efeito de inclinação 3D) ou **Pixel Card** com a imagem da obra e texto sobreposto. Ajuste `gap` e `speed` para um scroll suave.
* **Filtros de categoria**: substitua os botões de categoria por **Infinite Menu** ou **Flowing Menu**, permitindo que o usuário deslize as categorias horizontalmente; defina a lista `[“All”, “Motion Design”, “3D Art”, “Interactive”]` como items.
* **Busca**: mantenha o `Input` do shadcn UI para a pesquisa, pois React Bits não fornece campos de formulário.

---

#### 4. Página de portfólio

* **Grid interativo**: use **Pixel Card** ou **Spotlight Card** para cada item da grade. Defina `variant="neon"` ou personalize `colors` com gradiente roxo/azul; configure `gap` (tamanho dos pixels) e `speed` (velocidade da animação). Para mobile, defina `noFocus={true}` para não acionar a animação ao toque.
* **Animação de entrada**: envolva a grade em um componente React Bits **Infinite Scroll** vertical para dar um movimento sutil enquanto o usuário rola – ou continue com o atual `motion.div` do Framer Motion.

---

#### 5. Página de detalhe de obra

* **Header com efeito de vidro**: use **Glass Icons** para os ícones de ano, categoria e técnica (Calendar, Tag, Layers); passe `gradient="linear-to-r"` para cores primárias e aplique `blur` no fundo.
* **Cards de descrição**: envolva a descrição e a lista de tags em um **Decay Card** ou **Spotlight Card** para destacar a informação.
* **Viewer 3D**: mantenha a renderização de modelos com React Three Fiber, mas considere usar o background **Particles** ou **Threads** atrás da imagem para enriquecer o visual.

---

#### 6. Página About

* **Biografia animada**: utilize **Text Type** para exibir o parágrafo principal como um efeito de máquina de escrever, controlando `delay` e `speed`.
* **Timeline**: substitua a lista cronológica por um componente **Stepper** ou **Counter**. O **Stepper** permite mostrar cada evento (Ano + Evento) com uma barra progressiva; personalize `color` e `icon`.
* **Background**: aplique um background sutil, como **Prism** ou **Liquid Ether**, na seção da biografia ou timeline. Ajuste intensidade e velocidade para que não distraia.

---

#### 7. Página Contact

* **Ícones**: troque os cartões de Email/Instagram por **Glass Icons**, configurando `icon` para Mail/Instagram e `size` para 48px.
* **Fundo**: adicione um background **Ripple Grid** ou **Dot Grid** por trás do formulário, ajustando `lineColor` e `speed` para um efeito dinâmico mas discreto.
* **Chamada para ação**: use **Decrypted Text** para o título “Get in Touch”, dando a sensação de texto que aparece e se revela.

---

#### 8. Navegação

* **Menu interativo**: substitua a barra de navegação por **Gooey Nav** ou **Dock**, criando um menu fluido com bolhas. Use as labels `Home`, `Portfolio`, `About`, `Contact` como itens, definindo `activeColor` para o gradiente primário.
* **Menu móvel**: utilize **Infinite Menu** como menu hambúrguer, permitindo deslizar verticalmente pelos links.

---

#### 9. Desempenho e acessibilidade

* **Limitar a quantidade de componentes**: em cada página, selecione no máximo 2–3 componentes React Bits para evitar sobrecarregar a animação, conforme as boas práticas da biblioteca.
* **Fallbacks**: detecte `prefers-reduced-motion` e exiba versões estáticas (gradientes, imagens) em vez de backgrounds WebGL ou efeitos de texto.
* **Lazy load**: importe componentes React Bits dinamicamente (`import()`) e carregue-os apenas quando entram na viewport.
* **Testes**: verifique o comportamento em dispositivos móveis; ajuste `speed` e `size` dos efeitos para telas menores.

---

### Exemplo de prompt para Lovable

> **Título**: Atualizar Art Leo com React Bits
> **Descrição**:
>
> * Instalar **React Bits** e dependências 3D (`three`, `@react-three/fiber`, `@react-three/drei`).
> * Substituir `Hero3D` do Home por background **Aurora**/ **Silk**, com cores roxo/azul.
> * Animar o título com **Split Text**.
> * Trocar cartões “Motion Design/3D Art/Interactive” por **Spotlight Card** com ícones.
> * Na página *Portfolio*, usar **Pixel Card** para cada obra; adicionar carrossel **Rolling Gallery** para destaques.
> * No *About*, implementar timeline com **Stepper** e texto com **Text Type**.
> * Na página *Contact*, aplicar **Glass Icons** e background **Ripple Grid**.
> * Implementar navegação com **Gooey Nav** e **Infinite Menu** para mobile.
> * Manter dark/light mode, integrar com Supabase e garantir fallback estático para reduzido movimento.
> * Testar em mobile e limitar a 2–3 componentes animados por página.

Seguindo esse roteiro, você conseguirá reimaginar o portfólio Art Leo com **backgrounds WebGL envolventes**, **cards interativos**, **textos animados** e menus fluidos, mantendo a performance e a estética minimalista do site original.

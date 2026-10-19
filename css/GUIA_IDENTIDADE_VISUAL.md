# Guia de identidade visual

Este guia registra a linguagem visual que aparece nos CSS atuais do site Rising Flow. Use-o como referência para evoluir páginas existentes ou criar novas abas, mantendo consistência sem impedir soluções específicas para cada conteúdo.

## Essência visual

- **Energia e movimento:** amarelo e laranja dão destaque à navegação, categorias e ações.
- **Leitura direta:** texto escuro sobre fundos claros, com títulos objetivos e hierarquia tipográfica simples.
- **Conteúdo em primeiro plano:** imagens, eventos, jogos e músicas são apresentados em grades ou blocos de leitura fáceis de percorrer.
- **Interação perceptível:** estados de hover, foco e seleção usam mudanças de cor, elevação ou realce.

## Paleta

Os valores abaixo são os tokens definidos em `style.css`. Prefira reutilizá-los em vez de introduzir valores duplicados.

| Token | Valor | Uso observado / recomendado |
| --- | --- | --- |
| `--color-primary-yellow` | `#F7CD00` | Cor principal; navegação, categorias, datas e seleção. |
| `--color-darker-yellow` | `#E6B800` | Hover de superfícies amarelas. |
| `--color-secondary-orange` | `#F49915` | Destaques secundários, ícones e botões principais. |
| `--color-darker-orange` | `#E08A00` | Hover de elementos laranja. |
| `--color-complementary-blue` | `#0066CC` | Ações e links de destaque; use com moderação como acento. |
| `--color-text-dark` | `#000000` | Texto forte e texto sobre amarelo. |
| `--color-dark-grey` | `#333333` | Texto corrido e conteúdo secundário. |
| `--color-neutral-grey` | `#F8F8F8` | Fundo geral, separadores e superfícies neutras. |
| `--color-background-light` | `#FFFFFF` | Cards e superfícies de conteúdo. |

### Combinações

- Use texto escuro sobre amarelo e laranja sempre que possível.
- Reserve branco sobre fundos escuros. Antes de usar texto branco em laranja ou azul, confira o contraste no tamanho real do texto.
- Use o azul como acento funcional, não como uma segunda cor dominante.
- Para novas cores de estado (por exemplo, erro ou sucesso), escolha valores com contraste suficiente e mantenha-os restritos ao estado correspondente.

## Tipografia

O CSS global usa a pilha `'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`. Preserve essa família nas páginas atuais para manter a continuidade.

- **Títulos de página:** fortes e claros, geralmente entre `2rem` e `2.5rem`; reduza em telas menores.
- **Títulos de seção:** em torno de `1.5rem` a `2.5rem`, conforme a importância e o espaço disponível.
- **Texto corrido:** mantenha leitura confortável; o estilo global usa `line-height: 1.6`.
- **Metadados e rótulos:** podem ser menores, mas devem continuar legíveis e distinguíveis do conteúdo principal.
- Use negrito para navegação, títulos e informação que precisa ser encontrada rapidamente. Itálico aparece pontualmente para dados secundários, como artistas.

Os tamanhos nas páginas variam conforme o componente; os valores acima são referências observadas, não uma escala rígida.

## Estrutura e espaçamento

- O conteúdo compartilhado usa `.container` com largura máxima de `1200px`, centralização e `20px` de padding.
- Organize conteúdo em seções bem delimitadas, com respiro consistente entre título, filtros e resultados.
- Prefira grades responsivas para coleções. Os eventos usam cartões de pelo menos `350px` quando há espaço; a galeria usa itens quadrados a partir de `250px`.
- Use superfícies brancas para separar itens do fundo cinza claro. Sombras devem ser suaves e servir à hierarquia, não decorar cada bloco.
- Cantos arredondados já fazem parte do visual: formulários e controles usam raios menores; cartões, galerias e modais usam raios mais amplos.
- O cabeçalho e a navegação atuais são fixos. Considere o espaço que ocupam no topo ao criar uma página; não replique esses elementos dentro do conteúdo.

## Componentes e estados

- **Navegação:** amarelo com texto escuro; hover em amarelo mais escuro. Menus suspensos podem usar laranja.
- **Botões:** laranja para ações principais, azul para ações de destaque específicas. Deixe o propósito da ação evidente e diferencie hover, foco e estado ativo.
- **Cards de evento:** imagem em destaque, data sobreposta, título, detalhes e ações agrupadas. Eventos passados podem reduzir a saturação da imagem.
- **Galeria:** imagens contidas em blocos claros, mantendo proporção consistente e usando `object-fit` conforme o tipo de imagem.
- **Busca e filtros:** agrupe campo, controles e filtros aplicados; apresente categorias expansíveis e resultados com separadores discretos.
- **Formulários:** rótulos visíveis, campos com borda neutra e ação principal fácil de localizar.
- **Ícones:** use-os como apoio a uma ação ou informação e preserve tamanho, alinhamento e contraste consistentes.
- **Movimento:** prefira transições curtas de cor, sombra ou posição. Use animações mais evidentes apenas quando ajudarem a compreender entrada, seleção ou carregamento.

## Responsividade

Os estilos existentes usam principalmente os breakpoints `768px`, `600px`, `576px` e `480px`. Em novas regras, reutilize os breakpoints da página sempre que possível e evite criar variações muito próximas sem necessidade.

- Em telas menores, reduza títulos e espaçamentos e transforme grades em uma coluna quando os itens ficarem apertados.
- Permita que filtros, botões e navegação quebrem ou empilhem sem causar rolagem horizontal.
- Mantenha alvos de toque confortáveis e texto integralmente visível.
- Teste pelo menos uma largura de celular e uma de desktop, inclusive os estados de menu aberto e conteúdo expandido.

## Organização dos estilos

- `style.css`: tokens, tipografia e elementos compartilhados, como cabeçalho, navegação, rodapé e carrossel.
- `events.css`, `contact.css`, `pixel_block.css` e `song_search.css`: estilos específicos de cada página.
- Coloque tokens compartilhados em `:root` no CSS global; não redefina a paleta em folhas de página.
- Mantenha seletores de página específicos para evitar que uma nova aba altere componentes de outras páginas.
- Prefira classes para componentes e estados. Reserve IDs para estruturas realmente únicas ou integrações já existentes.
- Os arquivos são carregados diretamente no site estático; não dependa de pré-processador ou etapa de build sem atualizar o processo do projeto.

## Cuidados ao evoluir

O guia descreve o estado atual, que tem algumas inconsistências. Ao tocar nessas áreas, confirme o comportamento no navegador e corrija somente dentro do escopo da mudança:

- `--color-light-grey` e `--color-background-medium` são referenciadas em `events.css`, mas não estão definidas no `:root` de `style.css`. Prefira um token existente ou defina um token global com intenção clara.
- `.modal-content` é estilizado em mais de uma folha de página. Como folhas posteriores podem sobrescrever as anteriores, limite regras de modal ao contexto da página ou compartilhe uma regra intencional.
- Existem valores de cor diretos em componentes, inclusive tons de azul, vermelho e cinza. Antes de adicionar outro valor, avalie se ele deve ser um token compartilhado ou se é uma exceção semântica local.
- Os tamanhos de fonte, raios, espaçamentos e sombras não formam uma escala única. Trate os valores deste documento como referências aproximadas e mantenha consistência dentro de cada página.

## Checklist para uma nova aba

- Reutiliza a paleta e a família tipográfica globais?
- Usa o mesmo cabeçalho, navegação e rodapé do restante do site?
- Mantém largura de conteúdo, espaçamento e hierarquia de títulos coerentes?
- Os estados de hover, foco, seleção e carregamento são visíveis?
- Continua legível e utilizável em celular, sem rolagem horizontal?
- Os estilos novos estão isolados em uma folha própria ou em um escopo específico da página?
- Cores e tokens referenciados existem e têm contraste adequado?
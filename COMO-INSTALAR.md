# Ferro — registro de treinos

App offline, sem contas, sem anúncios. Os dados ficam só no seu aparelho.

## Opção 1 — Rápida (só testar)
Abra o `index.html` no navegador do celular ou do PC. Funciona na hora.
Limitação: em `file://` o navegador pode limpar os dados junto com o cache. Bom para experimentar,
arriscado para uso sério.

## Opção 2 — Recomendada (uso de verdade)
Publique os arquivos no GitHub Pages e instale como app:

1. Crie um repositório novo (pode ser privado com Pages ativo em conta paga, ou público — não há dados dentro do código).
2. Suba os 5 arquivos na raiz: `index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`.
3. Settings → Pages → Source: `Deploy from a branch` → `main` / `root` → Save.
4. Abra a URL gerada no Chrome do Android → menu ⋮ → **Adicionar à tela inicial**.

Depois disso o app abre em tela cheia, com ícone próprio, e funciona sem internet
(o service worker guarda tudo em cache na primeira visita).

## Sincronizar entre PC e celular
Não existe servidor: os dados vivem em cada aparelho. A troca é por arquivo, e a
importação **mescla** — não substitui.

- **PC → celular** (levar rotinas): Ajustes → Exportar backup no PC, importar no celular.
- **Celular → PC** (trazer treinos): o mesmo, na direção contrária.

Pode ir e vir em qualquer ordem, quantas vezes quiser. Como funciona o merge:
- **Treinos** têm id único e são imutáveis → os dois conjuntos se somam.
- **Rotinas e exercícios** → quem foi editado por último vence (carimbo `up`).
- **Exclusões** viram lápide (`del`), não sumiço → apagar num aparelho não é desfeito pelo outro.
- **Exercício igual cadastrado nos dois** → unificados, e o histórico é reapontado.

Nada é perdido em nenhuma direção. Se um dia quiser sync automático por nuvem
(Supabase e afins), o motor de merge já está pronto: só falta o transporte.

## Analisar no computador
Ajustes → **Exportar histórico (.csv)**. Uma linha por série (formato longo), com
data, hora, treino, exercício, grupo, tipo de série, reps, carga, volume e 1RM estimado.
Separador `;` e vírgula decimal, com BOM — abre no Excel pt-BR com dois cliques,
pronto para tabela dinâmica. Séries de aquecimento aparecem com volume 0.

## Backup
O `.json` é o backup completo. Faça de vez em quando: limpar os dados do navegador
apaga o histórico. Para restaurar do zero: Apagar tudo, depois importar o arquivo.

## Alterando os arquivos
Tudo está em `index.html`: HTML, CSS e JS num arquivo só, sem dependências externas.
- Catálogo de exercícios: constantes `GROUPS` e `CATALOG`, no topo do `<script>` (131 exercícios).
- Migração de versões antigas do banco: função `migrate()` — casa exercícios pelo nome e
  reaproveita o `id`, para o histórico não virar órfão. Se mexer nos nomes do catálogo,
  bump o `db.v` e trate a mudança lá.
- Fórmula de 1RM estimado: função `e1rm` (Epley — `peso × (1 + reps/30)`).
- Cores: bloco `:root` no CSS.

## Tipos de série
Toque no marcador à esquerda de cada série para mudar o tipo:

| Marca | Tipo | Efeito |
|---|---|---|
| `1 2 3` | Normal | Série de trabalho. Conta no volume e nos recordes. |
| `W` | Aquecimento | Fica no histórico, **não** conta no volume nem nos recordes. Não recebe número. |
| `F` | Até a falha | Conta normalmente. Registre a última repetição completa. |
| `D` | Drop set | Conta normalmente. O timer de descanso **não** dispara antes dela. |

O tipo é reaproveitado no próximo treino: se você aqueceu com duas séries da última vez,
elas voltam prontas, já marcadas como aquecimento.


## Cadastrar exercício
Três caminhos, todos salvam direto:
- **Exercícios → + Novo**: digita o nome, toca no grupo muscular, salva.
- **Buscou e não achou**: o próprio "nada encontrado" vira botão de cadastrar com o termo já preenchido.
- **No meio do treino**: em "+ Adicionar exercício", se a busca não achar, cadastra ali mesmo —
  o novo exercício volta já marcado e entra na sessão, sem sair do fluxo.

Renomear um exercício é seguro: o histórico acompanha (o vínculo é por id, não por nome).
Excluir só é permitido se ele nunca foi usado em treino ou rotina.

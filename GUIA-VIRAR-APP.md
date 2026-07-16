# Ferro — de site instalado a APK de verdade

Isso empacota o app que já existe (mesmo `index.html`, mesmo `sw.js`, mesmo GitHub Pages)
dentro de um APK instalável, com ícone e nome próprios. Não reescreve nada — embrulha.
Sem Android Studio, sem Java, sem SDK. Só o navegador do PC.

**Pré-requisito:** o site já publicado no GitHub Pages, funcionando (o que você já tem).

---

## Etapa 1 — Preparar nome e ícone (opcional, mas faça antes)

O pacote herda o que está no `manifest.webmanifest` como padrão, mas você pode
sobrescrever na hora de empacotar. Se já está satisfeito com "Ferro" e o ícone atual
(barra com anilhas), pule para a Etapa 2.

Se quiser mudar: me diga o nome e como imagina o ícone, e eu regenero os arquivos
antes de você empacotar — é mais simples trocar aqui do que depois de gerado o APK.

---

## Etapa 2 — Gerar o pacote no PWABuilder

1. No PC, abra **pwabuilder.com**.
2. Cole a URL do seu GitHub Pages (algo como `https://seu-usuario.github.io/ferro/`)
   e clique em **Start**.
3. A ferramenta audita o site (manifest, ícones, service worker) e mostra uma nota.
   Com os arquivos que já temos, deve vir tudo verde ou quase. Se aparecer algo em
   amarelo/vermelho, me manda o print — ajusto no `manifest.webmanifest`.
4. Clique em **Package for stores** → escolha **Android**.

### Na tela de opções do Android, preste atenção nestes campos:

| Campo | O que colocar |
|---|---|
| **Package ID** | Identificador único do app, formato `com.seunome.ferro`. Não precisa ser domínio real — é só um identificador técnico interno. |
| **App name / Launcher name** | O nome que vai aparecer embaixo do ícone no celular. |
| **Ícones** | Se quiser trocar, envie aqui os arquivos PNG (512×512 recomendado). |
| **Signing key** | **Escolha "Create new"**. Veja o aviso crítico abaixo. |
| **Display mode** | Deixe `standalone` (já é o padrão do app). |

### ⚠️ O ponto que não pode errar: a chave de assinatura

O PWABuilder vai gerar um arquivo `signing.keystore` — é a "assinatura digital" que
prova que as próximas versões do APK vêm de você. **Guarde esse arquivo e a senha
dele no mesmo lugar onde você guarda os backups `.json` do app** (Google Drive, por
exemplo). Se perder essa chave:

- Você **não consegue atualizar** o app instalado — só desinstalar e instalar um novo,
  do zero, como se fosse outro aplicativo.
- Como os dados ficam presos ao app antigo, isso significa **exportar backup antes de
  desinstalar** e importar depois no app novo.

Isso só importa se você mudar nome/ícone/config do pacote no futuro — atualizações de
conteúdo (novo exercício, correção de bug) **não passam por aqui**, veja a Etapa 5.

5. Clique em **Generate** / **Download**. Baixa um `.zip`.

---

## Etapa 3 — Tirar o APK do zip e levar pro celular

1. Extraia o `.zip` baixado. Dentro, o arquivo que interessa é o `.apk`
   (o `.aab` é só para Play Store — ignore).
2. Também vai vir `signing.keystore` e um `signing-key-info.txt` com as senhas —
   guarde os dois junto com seus backups.
3. Leve o `.apk` até o celular. Qualquer caminho serve:
   - Cabo USB (arrasta pro celular como um arquivo qualquer)
   - Envia pra si mesmo por WhatsApp / Telegram / e-mail
   - Sobe pro Google Drive e baixa no celular

---

## Etapa 4 — Instalar no Android

1. No celular, abra o arquivo `.apk` (pelo Files, pelo WhatsApp, de onde você mandou).
2. O Android vai bloquear na primeira vez e pedir permissão para instalar apps daquela
   origem específica (é por app, não é um interruptor global — ex.: "permitir que o
   WhatsApp instale apps"). Toque em **Configurações** → ative → volte e toque em
   **Instalar**.
3. Pronto — ícone próprio na gaveta de apps, nome próprio, abre sem barra de navegador
   (ou quase — veja a Etapa 5 se a barra aparecer).

---

## Etapa 5 — Tirar a barra de endereço (Digital Asset Links)

Às vezes o APK abre mostrando uma faixa fina com a URL no topo, tipo navegador. Isso
acontece porque o Android ainda não **verificou** que o app e o site são seus — falta
um arquivo de prova no seu repositório.

1. O `.zip` do PWABuilder inclui as instruções exatas e o conteúdo pronto de um arquivo
   chamado `assetlinks.json`, com a "impressão digital" (SHA-256) da sua chave de
   assinatura.
2. Você cria a pasta `.well-known/` no repositório do GitHub e coloca esse arquivo lá,
   de forma que fique acessível em:
   `https://seu-usuario.github.io/ferro/.well-known/assetlinks.json`
3. Commit, espera o Pages publicar (mesma espera de sempre, minutos).
4. Reabra o app no celular. Se ainda mostrar a barra, force-parar o app e abra de novo —
   a verificação do Android às vezes demora um pouco para checar esse arquivo.

Me avise nessa hora — eu monto o `assetlinks.json` certinho a partir da impressão
digital que o PWABuilder te der, é rapidinho.

---

## Dali pra frente: como funcionam as atualizações

Isso é o ponto mais importante para não se confundir depois:

- **Mudou exercício, corrigiu bug, mexeu no `index.html`/`sw.js`** → **não precisa
  gerar APK de novo.** O app é uma casca que carrega o site ao vivo — o fluxo que já
  existe (`bump.sh` + commit + push) continua funcionando exatamente como está, e a
  faixa azul de "nova versão disponível" aparece dentro do próprio app instalado.

- **Mudou nome, ícone, ou configuração do pacote Android** → aí sim precisa voltar ao
  PWABuilder, gerar um APK novo **usando a mesma chave de assinatura salva**, e instalar
  por cima do anterior (o Android reconhece como atualização, não perde dados).

Ou seja: no dia a dia, você nunca mais vai precisar mexer nisso. Isso aqui é feito uma
vez.

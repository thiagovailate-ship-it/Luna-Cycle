# Luna Cycle — Web app de ciclo menstrual

Aplicação web responsiva em React para acompanhar **exclusivamente o ciclo menstrual**. O produto foi refinado para ser prático, acolhedor e visualmente mais moderno, mantendo a identidade rosé/blush das referências originais.

> Versão 2.0.0: foco total em menstruação, fluxo, calendário, sintomas, humor e bem-estar. As telas de gravidez, menopausa e exames/preventivo foram **preservadas no código**, mas removidas da navegação, rotas ativas e interface.

## Acesso de demonstração

- E-mail: `demo@lunacycle.app`
- Senha: `luna123`

Também é possível criar uma nova conta local. O cadastro não pede mais escolha de fase: todas as contas começam no acompanhamento do ciclo menstrual.

## Como executar

```bash
cd luna-cycle
npm install
npm run dev
```

O Vite inicia em `http://localhost:5173` e aceita hosts de preview externos.

Build de produção:

```bash
npm run build
npm run preview
```

Qualidade:

```bash
npm run lint
npm test
```

Os testes usam o runner nativo do Node (`node --test`) e cobrem o motor do ciclo, a migração do banco local e a criptografia dos backups. O workflow `ci.yml` roda lint, testes e build em pull requests, e o deploy para GitHub Pages executa a mesma checagem antes de publicar.

## O que está implementado

### Ciclo menstrual
- Motor de previsão baseado na **mediana dos últimos ciclos plausíveis** (14–90 dias), com fallback para a duração de referência e indicação de confiança.
- Contagem real do dia do ciclo, sem reiniciar quando a menstruação atrasa; atraso, janela prevista e próxima ovulação aparecem de forma coerente em todas as telas.
- Linha do tempo das fases: menstruação, folicular, ovulação e lútea, com definições compartilhadas entre dashboard, guia e calendário.
- Calendário interativo com menstruação, previsão, período fértil, ovulação e lembretes.
- Registro do início da menstruação com data, duração, fluxo e observações.
- **Fluxo dia a dia**: registro de fluxo leve, moderado ou intenso para cada dia do período, com opção de desfazer. Dias futuros ficam bloqueados até chegarem.
- Histórico de ciclos com intervalos reais, variação, confiança e previsões dos próximos três inícios.
- Sintomas e humor com opções focadas no ciclo (cólicas, dor de cabeça, inchaço, cansaço etc.).
- Saúde hormonal educativa, composição corporal, temperatura, frequência cardíaca, sono e peso.
- Relatórios com tendências, gráficos, exportação CSV e impressão/PDF para levar à consulta.
- Dispositivo/pulseira simulada com conexão, bateria e sincronização — claramente identificada como demonstração.
- Bem-estar e dicas com artigos sobre alimentação, movimento, sono, saúde mental e ciclo.
- Lembretes com categorias de ciclo, sintomas, medicação e bem-estar.

### Onboarding e contas novas
- Contas novas passam por um onboarding curto: último período, duração de referência, duração da menstruação e regularidade.
- É possível pular o onboarding e explorar o app com um painel vazio, sem dados fabricados.
- Contas de demonstração continuam com dados de exemplo; contas locais começam vazias.

### Praticidade e UX
- Registro rápido flutuante com tecla `Q`: humor, menstruação, cólica, dor de cabeça e água, todos com **Desfazer**.
- Check-in de humor no dashboard com rostos ilustrados em SVG.
- Botão de início da menstruação em um toque no dashboard e na página de menstruação.
- Respiração guiada de 1 minuto.
- Busca global com `Ctrl/Cmd + K`.
- Notificações, perfil, configurações e backup/importação protegida por senha.

### Privacidade, discrição e acessibilidade
- Modo discreto com títulos neutros e dados sensíveis suavizados; toque e segure para revelar.
- Bloqueio rápido, PIN local de 4 dígitos, bloqueio automático e tela de desbloqueio neutra.
- Texto maior, alto contraste e redução de animações.
- Alvos de toque ampliados, foco visível, `skip link` e navegação por teclado.
- Linguagem acolhedora e sem cobrança em erros, estados vazios e orientações.

### Visual e ícones
- Nova linguagem de ícones próprios em SVG, com estilo duotone e fundos tonais.
- Rostos de humor ilustrados em SVG no lugar de emojis.
- Arte de ciclo orbital no dashboard, sidebar e telas públicas.
- Cards maiores, mais contraste, gradientes suaves, sombras elegantes e microinterações.
- Sidebar com cartão de progresso do ciclo e navegação inferior com visual de app.

## Estrutura

```text
src/
  components/  AppShell, ícones próprios, artes SVG, calendário, UI
  context/     autenticação e persistência
  data/        dados iniciais, navegação e conteúdos
  hooks/       ações rápidas com desfazer
  lib/         datas e cálculos de ciclo/hormônios
  pages/       telas do ciclo, saúde, bem-estar e configurações
  pages/       LegacyDashboards.jsx preserva os dashboards antigos
  styles.css   design system completo
```

Arquivos das jornadas antigas (`ExamPagesA.jsx`, `ExamPagesB.jsx`, `BabyPage`, `DiaryPage`, etc.) continuam no projeto, mas não são importados pelas rotas ativas. Os caminhos antigos redirecionam para `/app`.

### App instalável e offline
- Manifest com ícones em PNG, atalhos para registrar menstruação, calendário e Meu ciclo.
- Service worker que pré-cacheia o shell e os assets do build, permitindo abrir o app offline depois do primeiro carregamento.
- Convite de instalação em **Mais**, com instruções específicas para Safari/iOS e fallback quando o navegador não oferece instalação automática.
- Avisos do navegador para lembretes do dia, com deduplicação por lembrete. Eles funcionam **enquanto o app está aberto**; não há envio em segundo plano com o app fechado.

## Persistência e privacidade

Esta entrega usa **persistência local no navegador**, conforme a opção escolhida. Não há backend, sincronização entre dispositivos nem envio de dados para servidores. O banco local passa por migração automática ao carregar, sem apagar contas de versões anteriores.

O backup protegido usa **AES-GCM 256 bits com chave derivada por PBKDF2-SHA-256** (210 mil iterações). A senha não é salva; sem ela, o arquivo não pode ser restaurado. A cópia simples continua disponível para quem preferir um JSON legível.

O modo discreto, o PIN e o bloqueio automático aumentam a privacidade visual, mas não são criptografia: para proteção efetiva dos dados locais, use a senha/biometria do dispositivo.

## Limites conhecidos

- Ainda não há conta em servidor, sincronização entre dispositivos ou conformidade LGPD formal; isso exige backend, autenticação, política de retenção e revisão jurídica.
- As previsões vêm do histórico registrado, não de temperatura basal ou exames. A estimativa por temperatura e a revisão clínica dos conteúdos seguem como próximos passos.
- Recursos marcados como **em breve** (e-mail, sons, biometria e compartilhamento com profissional) aparecem desativados de forma explícita.
- As telas legacy de gravidez/exames continuam preservadas no código, fora das rotas ativas, até uma limpeza definitiva.


## Aviso de saúde

O Luna Cycle é uma ferramenta informativa de acompanhamento. Previsões, gráficos hormonais e conteúdos não substituem exames, diagnóstico ou orientação de profissionais de saúde. As previsões de ciclo não devem ser usadas como método contraceptivo.

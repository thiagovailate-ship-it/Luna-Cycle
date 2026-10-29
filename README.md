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

## O que está implementado

### Ciclo menstrual
- Dashboard com dia do ciclo, fase atual, previsão da próxima menstruação e ovulação.
- Linha do tempo das fases: menstruação, folicular, ovulação e lútea.
- Calendário interativo com menstruação, previsão, período fértil, ovulação e lembretes.
- Registro do início da menstruação com data, duração, fluxo e observações.
- **Fluxo dia a dia**: registro de fluxo leve, moderado ou intenso para cada dia do período, com opção de desfazer. Dias futuros ficam bloqueados até chegarem.
- Histórico de ciclos, ajuste da duração média e previsões dos próximos ciclos.
- Sintomas e humor com opções focadas no ciclo (cólicas, dor de cabeça, inchaço, cansaço etc.).
- Saúde hormonal educativa, composição corporal, temperatura, frequência cardíaca, sono e peso.
- Relatórios com tendências, gráficos e exportação CSV.
- Dispositivo/pulseira simulado com conexão, bateria e sincronização.
- Bem-estar e dicas com artigos sobre alimentação, movimento, sono, saúde mental e ciclo.
- Lembretes com categorias de ciclo, sintomas, medicação e bem-estar.

### Praticidade e UX
- Registro rápido flutuante com tecla `Q`: humor, menstruação, cólica, dor de cabeça e água, todos com **Desfazer**.
- Check-in de humor no dashboard com rostos ilustrados em SVG.
- Botão de início da menstruação em um toque no dashboard e na página de menstruação.
- Respiração guiada de 1 minuto.
- Busca global com `Ctrl/Cmd + K`.
- Notificações, perfil, configurações, backup/importação e exportação de dados.

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

## Persistência e privacidade

Esta entrega usa **persistência local no navegador**, conforme a opção escolhida. Não há backend, sincronização entre dispositivos nem envio de dados para servidores. O modo discreto, o PIN e o bloqueio automático aumentam a privacidade visual, mas não são criptografia: para proteção efetiva dos dados locais, use a senha/biometria do dispositivo.

## Aviso de saúde

O Luna Cycle é uma ferramenta informativa de acompanhamento. Previsões, gráficos hormonais e conteúdos não substituem exames, diagnóstico ou orientação de profissionais de saúde. As previsões de ciclo não devem ser usadas como método contraceptivo.

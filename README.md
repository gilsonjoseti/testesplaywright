
# QA Sênior Portfolio

## Objetivo
Este portfólio demonstra um projeto de automação de testes com foco em QA Sênior, cobrindo:
- Automação de API com Playwright Test
- Automação de UI com Playwright Test e Page Object Model
- Testes de performance com k6
- Relatórios com Playwright Report e Allure
- Integração contínua com GitHub Actions

## Tecnologias utilizadas
- Node.js
- Playwright
- k6
- dotenv
- Allure Playwright
- GitHub Actions

## Estrutura do projeto
- `tests/api` - testes de API e cenários BDD
- `tests/api/fixtures` - dados parametrizados para API
- `tests/ui` - testes de UI e Page Objects
- `tests/ui/fixtures` - dados parametrizados para UI
- `performance` - scripts de performance k6
- `tools/agents` - agente simples para gerar casos BDD
- `.github/workflows` - pipeline CI
- `playwright.config.js` - configuração do Playwright
- `.env` - variáveis de ambiente

## Estratégia de testes
- API: validação de status code, contrato da resposta e fluxo dinâmico de criação/exclusão
- UI: login, carrinho e checkout usando POM
- Dados parametrizados via JSON fixtures para UI e API
- Integração API+UI: validação de fluxo híbrido entre criação de dados por API e login na UI
- Testes estáveis com esperas automáticas do Playwright
- Relatórios gerados localmente para análise de falhas

## Como executar
1. Instalar dependências
   ```bash
   npm install
   ```
2. Rodar todos os testes
   ```bash
   npm test
   ```
   Este comando executa o Playwright, gera os resultados do Allure e, quando rodado localmente, abre o relatório automaticamente no navegador.
3. Rodar somente API
   ```bash
   npm run test:api
   ```
4. Rodar somente UI
   ```bash
   npm run test:ui
   ```

   Após a execução, o relatório Allure é gerado automaticamente em `allure-report` e será aberto no navegador local se não estiver em ambiente CI.

5. Rodar o teste de checkout parametrizado
   ```bash
   npx playwright test tests/ui/ui-checkout.spec.js
   ```
   Este teste valida o fluxo completo de compra usando diferentes perfis de usuário e combinações de produtos, garantindo cobertura de cenários de carga e checkout com dados parametrizados.
6. Rodar o teste de integração API+UI
   ```bash
   npm run test:ui:integration
   ```
7. Rodar testes BDD de API
   ```bash
   npm run test:bdd
   ```
   Observação: O BDD usa CommonJS para compatibilidade com o runner Cucumber.
8. Rodar teste de performance
   ```bash
   npm run test:perf
   ```

### Relatórios
- Playwright HTML: `npx playwright show-report`
- Allure resultados: `npm run allure:generate`
- Abrir Allure: `npm run allure:open`

> Relatório Allure gerado com sucesso em `allure-report`.

### Teste de performance
- O script padrão usa `https://jsonplaceholder.typicode.com`.
- Se precisar usar outro endpoint, exporte `API_URL` antes de rodar.

> Observação: o k6 deve estar instalado no sistema para executar o script de performance.
> Instalação local:
> - macOS/Linux: `brew install k6` ou siga https://k6.io/docs/getting-started/installation/
> - Windows: use o instalador oficial ou o Windows Subsystem for Linux

## Como acessar relatórios
- Playwright HTML: `npx playwright show-report`
- Allure: gerar usando plugin ou acessar `playwright-report` gerado localmente

## CI/CD
Pipeline GitHub Actions em `.github/workflows/ci.yml` executa:
- testes de API
- testes de UI
- testes de performance
- upload de relatórios como artefatos

## Execução manual no GitHub Actions
[![Run manual tests](https://img.shields.io/badge/Run%20Manual%20Tests-GitHub%20Actions-blue?logo=github)](https://github.com/gilsonjoseti/testesplaywright/actions/workflows/manual-test-runner.yml)

O workflow `manual-test-runner.yml` permite disparar testes diretamente pelo GitHub Actions usando `workflow_dispatch`.

Ele aceita as seguintes opções:
- `all`: executa todos os testes
- `api`: executa apenas testes de API
- `ui`: executa apenas testes de UI
- `bdd`: executa apenas testes BDD
- `perf`: executa apenas teste de performance

Você também pode escolher o browser para UI:
- `chromium`
- `firefox`
- `webkit`

Os artefatos gerados são enviados como `manual-test-artifacts-<target>`.

## Decisões técnicas
- Escolha do Playwright por estabilidade, execução cruzada de browser e suporte a testes UI + API.
- API pública escolhida: `https://jsonplaceholder.typicode.com`.
- Aplicação web escolhida: `https://www.saucedemo.com`.
- k6 para testes de performance leve com thresholds simples.
- Uso de POM para separar ações de página e facilitar manutenção.

## Observações
- `https://jsonplaceholder.typicode.com` é uma API de teste pública que aceita criação e atualização de recursos, mas não persiste alterações reais.
- O fluxo dinâmico foi adaptado para usar criação dinâmica e atualização/exclusão de um recurso existente (`/posts/1`), devido à limitação de persistência da API.
- A API JSONPlaceholder retorna apenas o `id` no corpo da resposta para o PUT em alguns casos, então a validação foi adaptada para confirmar o status e o `id` retornado.
- Os cenários de erro foram adaptados para o comportamento da API pública, usando `404` para recursos inexistentes e `201` para duplicação de posts.

## Possíveis melhorias
- Adicionar mais validações de contrato com schemas JSON
- Incluir testes de borda adicionais na UI
- Implementar testes de API com autenticação real
- Publicar relatórios Allure no pipeline

## Uso de IA
- Auxílio na criação da estrutura do projeto, arquivos de configuração e README.
- Prompts podem ser incluídos aqui para documentação futura.

(Initial QA portfolio with Playwright, BDD, performance and Allure reporting)

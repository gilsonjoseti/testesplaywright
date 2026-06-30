Feature: API Publica - JSONPlaceholder
  Como QA Sênior
  Eu quero validar a API pública
  Para garantir a integridade, estabilidade e qualidade do contrato

  Background:
    Given a public API endpoint

  Scenario: Buscar lista de posts com sucesso
    When I request GET /posts
    Then the response status code should be 200
    And the response schema should match the post list contract

  Scenario: Recurso inexistente retorna erro adaptado
    When I request GET /invalid-endpoint
    Then the response status code should be 404

  Scenario: Fluxo dinâmico de criação, atualização e exclusão de post
    When I create a new post with random dynamic data
    Then the response status code should be 201
    And the response body should include the created post data
    When I update the created post
    Then the update response status code should be 200
    When I delete the created post
    Then the response status code should be 200

  Scenario: Criar post duplicado retorna fluxo adaptado
    Given a post already exists with title "foo"
    When I create a new post with the same title
    Then the response status code should be 201

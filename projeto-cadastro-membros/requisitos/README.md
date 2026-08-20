[Cadastro Membros](../README.md) > **Requisitos**

---

# Estrutura de Requisitos — Plataforma de Gestão de Membros

**Versão:** 0.3 | **Última atualização:** 30/04/2026

---

## Visão Geral do Produto

Plataforma web para gestão e cadastro de membros de igrejas, com arquitetura multi-tenant escalável. A Fase 1 foca em uma única igreja para validação do modelo.

**Objetivo central:** oferecer visibilidade clara sobre membros, seus dados e vínculos com células, facilitando gestão e tomada de decisão pela liderança.

---

## Perfis de Usuário

| Perfil | MVP | Descrição |
|--------|-----|-----------|
| **Administrador** | 🟢 | Secretaria / pastores — acesso total ao sistema |
| **Líder de célula** | 🟣 Futuro | Acesso restrito à própria célula |
| **Membro** | 🟣 Futuro | Auto-cadastro via link externo, sujeito à aprovação |

---

## Estrutura Analítica do Produto (EAP)

### Módulo 1 — Autenticação e Controle de Acesso

| Requisito | Arquivo | Prioridade | Status |
|-----------|---------|------------|--------|
| Autenticação de Usuário (login/logout) | [`autenticacao/autenticacao-usuario.md`](./funcionais/autenticacao/autenticacao-usuario.md) | 🟢 MVP | ✅ Aprovado |
| Recuperação de Senha | [`autenticacao/recuperacao-senha.md`](./funcionais/autenticacao/recuperacao-senha.md) | 🟢 MVP | ✅ Aprovado |

---

### Módulo 2 — Cadastro de Membros

Gerencia o ciclo de vida completo de cada membro. Todo membro possui vínculo obrigatório com um **líder de célula** (discipulado por) no momento do cadastro. O sistema não rastreia em qual das células do líder o membro participa — o vínculo é membro → líder.

**Dados obrigatórios:** Nome completo, Telefone, Data de nascimento, Data de ingresso, Tipo de ingresso (Batismo/Recepção), Endereço completo, Líder (discipulado por — seleção do líder responsável).

**Dados adicionais para líder:** Detalhes da célula — cada célula com Dia, Horário, Tipo(s) (Kids/Teens/Adolescente/Adulto) e Endereço próprio. Um líder pode registrar mais de uma célula.

**Critério de duplicata:** nome completo + data de nascimento.

| Requisito | Arquivo | Prioridade | Status |
|-----------|---------|------------|--------|
| Criar Membro | [`membros/criar-membro.md`](./funcionais/membros/criar-membro.md) | 🟢 MVP | ✅ Aprovado |
| Listar Membros | [`membros/listar-membros.md`](./funcionais/membros/listar-membros.md) | 🟢 MVP | ✅ Aprovado |
| Visualizar Membro | [`membros/visualizar-membro.md`](./funcionais/membros/visualizar-membro.md) | 🟢 MVP | ✅ Aprovado |
| Editar Membro | [`membros/editar-membro.md`](./funcionais/membros/editar-membro.md) | 🟢 MVP | ✅ Aprovado |
| Inativar Membro | [`membros/inativar-membro.md`](./funcionais/membros/inativar-membro.md) | 🟢 MVP | ✅ Aprovado |
| Reativar Membro | [`membros/reativar-membro.md`](./funcionais/membros/reativar-membro.md) | 🟢 MVP | ✅ Aprovado |
| Exportar Listagem (PDF e Excel) | `membros/exportar-membros.md` | 🟣 P2 | 🔄 A escrever |

---

### Módulo 3 — Gestão de Células

Uma célula é uma entidade independente definida por: líder + dia + horário + tipo(s) + endereço. Um membro pertence a exatamente uma célula. Um líder pode liderar N células, cada uma com configuração própria.

**Tipos de célula (MVP — lista fixa):** Kids / Teens / Adolescente / Adulto. Uma célula pode ter múltiplos tipos (multi-select). Ao menos um tipo é obrigatório.

| Requisito | Arquivo | Prioridade | Status |
|-----------|---------|------------|--------|
| Listar Células | [`celulas/listar-celulas.md`](./funcionais/celulas/listar-celulas.md) | 🟢 MVP | ✅ Aprovado |
| Visualizar Célula | [`celulas/visualizar-celula.md`](./funcionais/celulas/visualizar-celula.md) | 🟢 MVP | ✅ Aprovado |
| Editar Célula | [`celulas/editar-celula.md`](./funcionais/celulas/editar-celula.md) | 🟢 MVP | ✅ Aprovado |
| ~~Vincular Membro à Célula~~ | — coberto por Criar/Editar/Reativar Membro | ~~🟢 MVP~~ | ❌ Removido |

---

### Módulo 4 — Importação CSV

Funcionalidade de onboarding obrigatória no MVP. Download de template único (.csv com linhas de exemplo prefixadas por `EXEMPLO`), upload, prévia com validação linha a linha e resumo pós-importação.

**Suporte a múltiplas células por líder:** mesmo líder aparece em múltiplas linhas do CSV (uma por célula). Critério de duplicata: nome + data de nascimento. Normalização automática de campos enum (case-insensitive, acento opcional).

| Requisito | Arquivo | Prioridade | Status |
|-----------|---------|------------|--------|
| Importação de Base via CSV | [`importacao/importacao-csv.md`](./funcionais/importacao/importacao-csv.md) | 🟢 MVP | ✅ Aprovado |

---

### Módulo 5 — Dashboard

| Requisito | Arquivo | Prioridade | Status |
|-----------|---------|------------|--------|
| Dashboard Geral | [`dashboard/dashboard.md`](./funcionais/dashboard/dashboard.md) | 🟢 MVP | ✅ Aprovado |

**Cards:** total de membros ativos; total de células ativas (clicável — navega para Listar Células; conta células individualmente, não líderes); aniversariantes do mês.
**Gráfico:** total acumulado de membros por período (anual, semestral, trimestral, personalizado). Tooltip ao passar o mouse exibe: total acumulado, +ingressos e −inativações do período (quando houver).

---

### Módulo 6 — Administração

Gerenciamento de usuários do sistema (secretaria, pastores, coordenadores). O primeiro administrador é criado via seed de implantação antes do primeiro uso da plataforma.

| Requisito | Arquivo | Prioridade | Status |
|-----------|---------|------------|--------|
| Gerenciar Usuários do Sistema | [`administracao/gerenciar-usuarios.md`](./funcionais/administracao/gerenciar-usuarios.md) | 🟢 MVP | ✅ Aprovado |

---

### Módulo 7 — Organograma Hierárquico

| Requisito | Arquivo | Prioridade | Status |
|-----------|---------|------------|--------|
| Visualizar Organograma | `organograma/visualizar-organograma.md` | 🟣 P2 | 🔄 A escrever |

**Visualização:** árvore líder → membros vinculados. Exportável e imprimível.

---

### Módulo 8 — Relatórios

| Requisito | Arquivo | Prioridade | Status |
|-----------|---------|------------|--------|
| Relatório de Células | `relatorios/relatorio-celulas.md` | 🟣 P2 | 🔄 A escrever |
| Relatório de Aniversariantes | `relatorios/relatorio-aniversariantes.md` | 🟣 P2 | 🔄 A escrever |

---

## Priorização — MVP

| Prioridade | Funcionalidade |
|------------|---------------|
| P1 | Autenticação e controle de acesso |
| P1 | Gerenciamento de usuários do sistema (Administração) |
| P1 | Cadastro de membros e líderes de célula |
| P1 | Vínculo membro → líder (discipulado por) |
| P1 | Tipos de célula: Kids / Teens / Adolescente / Adulto (multi-select) |
| P1 | Listagem com filtro dinâmico (membros e células) |
| P1 | Dashboard com cards e gráfico de crescimento |
| P1 | Importação de base via CSV |
| P2 | Organograma hierárquico |
| P2 | Exportação de listagem em PDF e Excel |
| P2 | Relatório de células |
| P2 | Relatório de aniversariantes |
| Futuro | Auto-cadastro de membros via link externo |
| Futuro | Acesso do líder de célula à sua célula |
| Futuro | Configuração de tipos de célula via interface |

---

## Premissas Técnicas

- Arquitetura multi-tenant desde o backend, mesmo que MVP opere com tenant único
- Sistema de permissões (roles) extensível desde a primeira versão
- Exclusão permanente de dados não é permitida — apenas inativação
- Importação CSV aplica as mesmas regras de validação do cadastro manual
- **Seed de implantação:** o primeiro usuário administrador e os primeiros líderes são criados via seed antes do primeiro uso da interface
- **Tipos de célula no MVP:** lista fixa (Kids / Teens / Adolescente / Adulto) definida no modelo de dados, sem interface de configuração
- Stack tecnológica a ser definida pelo tech lead
- **Auditoria:** todas as operações de escrita (criar, editar, inativar, reativar, importar) registram data, hora e ID do usuário responsável na camada de persistência

---

## Convenções de Status

| Status | Significado |
|--------|-------------|
| 🔄 A escrever | Requisito identificado, ainda não documentado |
| ✏️ Em andamento | Em elaboração na branch de especificação |
| ✅ Aprovado | Aprovado em `spec-approved` |
| 📦 Publicado | Documentado na `main` (entregue em produção) |

---

## Mapa de Permissões — MVP

Referência consolidada de todas as permissões definidas nos requisitos. No MVP, o perfil **Administrador** possui todas as permissões listadas por padrão.

| Permissão | Módulo | Descrição |
|-----------|--------|-----------|
| `MEMBRO_VISUALIZAR` | Membros | Acessar listagem e visualizar membros |
| `MEMBRO_CRIAR` | Membros | Criar novos membros |
| `MEMBRO_EDITAR` | Membros | Editar dados de membros existentes |
| `MEMBRO_INATIVAR` | Membros | Inativar membros ativos |
| `MEMBRO_REATIVAR` | Membros | Reativar membros inativos |
| `CELULA_VISUALIZAR` | Células | Acessar listagem e visualizar células |
| `CELULA_EDITAR` | Células | Editar dados operacionais da célula |
| `IMPORTACAO_EXECUTAR` | Importação | Realizar upload e processar importação CSV |
| `DASHBOARD_VISUALIZAR` | Dashboard | Acessar e visualizar o dashboard com todas as métricas |
| `USUARIO_VISUALIZAR` | Administração | Acessar a listagem de usuários do sistema |
| `USUARIO_CRIAR` | Administração | Criar novos usuários do sistema |
| `USUARIO_EDITAR` | Administração | Editar dados de usuários existentes |
| `USUARIO_INATIVAR` | Administração | Inativar usuários ativos |
| `USUARIO_REATIVAR` | Administração | Reativar usuários inativos |

---

## Histórico de Alterações

| Data | Card | Autor | Descrição |
|------|------|-------|-----------|
| 29/04/2026 | — | Thiago Oliveira | Criação inicial do EAP com base no escopo v1.1 |
| 30/04/2026 | — | Thiago Oliveira | Revisão completa: modelo célula como entidade independente; tipos de célula; seed de implantação; Módulo 6 Administração adicionado; organograma movido para P2; dashboard com tooltip e card clicável |
| 30/04/2026 | — | Thiago Oliveira | Vínculo membro→líder (não célula específica); mapa de permissões consolidado (IMPORTACAO_EXECUTAR e DASHBOARD_VISUALIZAR incluídos); premissa de auditoria global; P1 atualizado |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>

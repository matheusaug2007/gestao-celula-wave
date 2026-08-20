[Cadastro Membros](../README.md) > **Requisitos**

---

# Estrutura de Requisitos — Portal de Cadastro de Membros

**Versão:** 0.1 | **Última atualização:** 29/04/2026

---

## Visão Geral do Produto

O **Portal de Cadastro de Membros** é um sistema web centralizado para gestão do ciclo de vida de membros de uma organização. O sistema permite registrar, consultar, organizar e acompanhar membros, garantindo rastreabilidade, controle de acesso e exportação de dados para uso administrativo.

### Objetivos Estratégicos

- Centralizar o cadastro de membros eliminando registros duplicados ou dispersos em planilhas.
- Permitir consulta rápida por diferentes critérios (nome, grupo, status, data de cadastro).
- Controlar o acesso ao sistema por perfis de usuário com permissões granulares.
- Oferecer visibilidade gerencial através de relatórios exportáveis.
- Manter histórico completo de alterações para auditoria.

---

## Estrutura Analítica do Produto (EAP)

### Módulo 1 — Autenticação

Gerencia o acesso ao portal. Controla identidade, sessão e permissões dos usuários do sistema.

| Requisito | Arquivo | Status |
|-----------|---------|--------|
| Autenticação de Usuário (login/logout) | `autenticacao/autenticacao-usuario.md` | 🔄 A escrever |
| Recuperação de Senha | `autenticacao/recuperacao-senha.md` | 🔄 A escrever |

---

### Módulo 2 — Gestão de Membros

Núcleo do sistema. Permite o gerenciamento completo do ciclo de vida de um membro.

**Linguagem Ubíqua:** Membro, Status do Membro (Ativo / Inativo / Pendente), Data de Ingresso, Código do Membro.

| Requisito | Arquivo | Status |
|-----------|---------|--------|
| Listar Membros | `membros/listar-membros.md` | 🔄 A escrever |
| Criar Membro | `membros/criar-membro.md` | 🔄 A escrever |
| Editar Membro | `membros/editar-membro.md` | 🔄 A escrever |
| Visualizar Membro | `membros/visualizar-membro.md` | 🔄 A escrever |
| Inativar Membro | `membros/inativar-membro.md` | 🔄 A escrever |
| Reativar Membro | `membros/reativar-membro.md` | 🔄 A escrever |

---

### Módulo 3 — Gestão de Grupos

Permite organizar membros em grupos funcionais (células, turmas, equipes ou congregações).

**Linguagem Ubíqua:** Grupo, Líder do Grupo, Vínculo Membro-Grupo, Data de Ingresso no Grupo.

| Requisito | Arquivo | Status |
|-----------|---------|--------|
| Listar Grupos | `grupos/listar-grupos.md` | 🔄 A escrever |
| Criar Grupo | `grupos/criar-grupo.md` | 🔄 A escrever |
| Editar Grupo | `grupos/editar-grupo.md` | 🔄 A escrever |
| Visualizar Grupo | `grupos/visualizar-grupo.md` | 🔄 A escrever |
| Vincular Membros ao Grupo | `grupos/vincular-membros-grupo.md` | 🔄 A escrever |
| Desvincular Membro do Grupo | `grupos/desvincular-membro-grupo.md` | 🔄 A escrever |

---

### Módulo 4 — Perfil do Membro

Gerencia os dados detalhados de cada membro, incluindo documentos, endereço e histórico.

**Linguagem Ubíqua:** Perfil, Documento (CPF, RG), Endereço, Contato, Foto do Membro.

| Requisito | Arquivo | Status |
|-----------|---------|--------|
| Visualizar Perfil Completo | `perfil/visualizar-perfil.md` | 🔄 A escrever |
| Editar Dados Pessoais | `perfil/editar-dados-pessoais.md` | 🔄 A escrever |
| Atualizar Documentos | `perfil/atualizar-documentos.md` | 🔄 A escrever |
| Histórico de Alterações do Perfil | `perfil/historico-alteracoes-perfil.md` | 🔄 A escrever |

---

### Módulo 5 — Relatórios

Permite exportar e visualizar dados consolidados da base de membros para fins gerenciais.

**Linguagem Ubíqua:** Relatório, Exportação, Filtro de Período, Formato de Exportação (PDF, Excel).

| Requisito | Arquivo | Status |
|-----------|---------|--------|
| Relatório de Membros Ativos | `relatorios/relatorio-membros-ativos.md` | 🔄 A escrever |
| Relatório de Novos Cadastros | `relatorios/relatorio-novos-cadastros.md` | 🔄 A escrever |
| Exportar Base de Membros | `relatorios/exportar-base-membros.md` | 🔄 A escrever |
| Relatório de Membros por Grupo | `relatorios/relatorio-membros-grupo.md` | 🔄 A escrever |

---

### Módulo 6 — Administração

Gerencia os usuários do sistema, seus perfis de acesso e configurações globais.

**Linguagem Ubíqua:** Usuário do Sistema, Perfil de Acesso (Admin, Operador, Visualizador), Permissão.

| Requisito | Arquivo | Status |
|-----------|---------|--------|
| Listar Usuários do Sistema | `administracao/listar-usuarios.md` | 🔄 A escrever |
| Criar Usuário do Sistema | `administracao/criar-usuario.md` | 🔄 A escrever |
| Editar Usuário do Sistema | `administracao/editar-usuario.md` | 🔄 A escrever |
| Inativar Usuário do Sistema | `administracao/inativar-usuario.md` | 🔄 A escrever |
| Gerenciar Perfis de Acesso | `administracao/gerenciar-perfis-acesso.md` | 🔄 A escrever |

---

## Mapa de Permissões (Esboço)

| Permissão | Admin | Operador | Visualizador |
|-----------|-------|----------|--------------|
| MEMBRO_VISUALIZAR | ✅ | ✅ | ✅ |
| MEMBRO_CRIAR | ✅ | ✅ | ❌ |
| MEMBRO_EDITAR | ✅ | ✅ | ❌ |
| MEMBRO_INATIVAR | ✅ | ❌ | ❌ |
| GRUPO_VISUALIZAR | ✅ | ✅ | ✅ |
| GRUPO_CRIAR | ✅ | ✅ | ❌ |
| GRUPO_EDITAR | ✅ | ✅ | ❌ |
| RELATORIO_EXPORTAR | ✅ | ✅ | ❌ |
| USUARIO_GERENCIAR | ✅ | ❌ | ❌ |

---

## Convenções de Status

| Status | Significado |
|--------|-------------|
| 🔄 A escrever | Requisito identificado, ainda não documentado |
| ✏️ Em andamento | Requisito em elaboração na branch de especificação |
| ✅ Aprovado | Requisito aprovado em `spec-approved` |
| 📦 Publicado | Requisito documentado na `main` (feature entregue em produção) |

---

## Histórico de Alterações

| Data | Card | Autor | Descrição |
|------|------|-------|-----------|
| 29/04/2026 | — | Thiago Oliveira | Criação inicial do EAP — escopo v0.1 |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>

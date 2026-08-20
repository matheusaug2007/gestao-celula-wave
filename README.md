# 🌊 Wave Células — Sistema de Gestão Pastoral & Células

Sistema moderno de gestão de células e pastoreio intencional para a **Comunidade Cristã Wave**.
Desenvolvido com foco na experiência do usuário (UX), navegabilidade simples para líderes de todas as idades e arquitetura 100% responsiva (Mobile & Desktop).

---

## 🌟 Funcionalidades Principais

### 👑 Modo Admin (Visão Pastoral & Secretaria)
* **Dashboard Pastoral**: Estatísticas em tempo real (Total de Membros, Células Ativas, Líderes e Taxa de Frequência).
* **Liberação de Acessos & Permissões (`#admin-usuarios`)**: Controle de login e cargos (`ADMIN`, `PASTOR`, `SECRETARIA`, `LIDER`, `MEMBRO`).
* **Gestão de Células & Líderes (`#admin-lideres`)**: Visualização por geração (`Movement`, `Ripe`, `Teens`), dia da semana e ranking de frequência.
* **Gestão de Membros (`#admin-membros`)**: Tabela completa da igreja com status da trilha espiritual e filtros.
* **Importação CSV (`#importacao`)**: Carga em lote de discípulos e líderes.
* **Eventos & Cultos (`#admin-eventos`)**: Cadastro de eventos no calendário da igreja.

### 🌱 Modo Líder (Pastoreio da Célula)
* **Frequência Inteligente (`#chamada`)**: Chamada em 1 toque com contador de presença.
* **Aniversariantes & Gerador de Parabéns**: Criação de mensagens personalizadas por tom (Espiritual, Carinhoso, Fraterno) sem emojis, prontas para enviar no WhatsApp.
* **Regra de Negócio de Células**: Nome dinâmico ("Célula" quando o líder possui 1 célula; especificado por público quando possui mais de 1).
* **Ficha Pastoral (`#perfil`)**: Acompanhamento individual e notas de pedidos de oração.

---

## 🚀 Como Executar Localmente

Como o projeto é construído em HTML, CSS e JavaScript puro (Vanilla JS), não necessita de servidores complexos de build.

1. Clone este repositório:
   ```bash
   git clone https://github.com/matheusaug2007/gestao-celula-wave.git
   ```
2. Abra o arquivo `index.html` diretamente no seu navegador ou utilize a extensão **Live Server** no VS Code.

---

## ☁️ Deploy no Vercel

Este projeto já está configurado para deploy instantâneo na **Vercel** (`vercel.json`).

1. Acesse [vercel.com/new](https://vercel.com/new).
2. Importe o repositório `matheusaug2007/gestao-celula-wave`.
3. Clique em **Deploy**.

---

## 🔒 Autenticação & Banco de Dados

* **Supabase Client**: Integrado ao projeto Supabase (`dkdtgdmcmvofolukynri`).
* **Credenciais do Administrador**:
  * **E-mail:** `matheus.augusto5117@gmail.com`
  * **Senha:** `123456`

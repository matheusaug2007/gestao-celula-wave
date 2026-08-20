#!/usr/bin/env bash
# setup-agentes.sh — Configura os agentes da sua ferramenta de IA
#
# Uso:
#   bash .luby/agents/sync.sh [ferramenta]
#
# Ferramentas suportadas:
#   claude   → cria symlink de .claude/commands/ para .luby/agents/
#   copilot  → copia os arquivos para .github/instructions/

AGENTS_DIR=".luby/agents"
TOOL="${1:-}"

if [[ -z "$TOOL" ]]; then
  echo "Uso: bash .luby/agents/sync.sh [claude|copilot]"
  echo ""
  echo "  claude   → configura Claude Code (VS Code)"
  echo "  copilot  → configura Copilot Pro (VS Code / Obsidian)"
  exit 1
fi

case "$TOOL" in
  claude)
    mkdir -p .claude
    if [[ -d ".claude/commands" ]]; then
      echo "⚠️  .claude/commands já existe. Remova manualmente se quiser reconfigurar."
      exit 1
    fi
    # Cria symlink para evitar duplicação
    ln -s "../$AGENTS_DIR" ".claude/commands"
    echo "✅ Claude Code configurado: .claude/commands → $AGENTS_DIR"
    echo "   Reinicie o VS Code para carregar os slash commands."
    ;;

  copilot)
    COPILOT_DIR=".github/instructions"
    mkdir -p "$COPILOT_DIR"
    for agent_file in "$AGENTS_DIR"/*.agent.md; do
      agent_name=$(basename "$agent_file" .agent.md)
      copilot_file="$COPILOT_DIR/${agent_name}.instructions.md"
      {
        echo "---"
        echo "applyTo: '**'"
        echo "---"
        echo ""
        cat "$agent_file"
      } > "$copilot_file"
      echo "  ✅ $copilot_file"
    done
    echo "✅ Copilot Pro configurado. Arquivos gerados em $COPILOT_DIR"
    echo "   Adicione .github/instructions/ ao .gitignore se não quiser versionar."
    ;;

  *)
    echo "Ferramenta '$TOOL' não suportada. Use: claude | copilot"
    exit 1
    ;;
esac

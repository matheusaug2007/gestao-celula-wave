---
name: Revisao Rapida de Requisito
description: "Revisao funcional rapida de um requisito com foco em estrutura, lacunas, ambiguidades e perguntas criticas."
argument-hint: "Informe o caminho do requisito e, se houver, contexto da feature."
agent: "Revisor de Requisitos"
---
Revise o requisito funcional informado pelo usuario sem reescrever o documento.

## Entrada esperada
- Caminho do requisito (arquivo `.md`)
- Contexto da feature (opcional)

## Instrucoes
1. Leia o requisito completo.
2. Valide aderencia estrutural ao padrao da pasta `.luby/templates` quando aplicavel.
3. Identifique lacunas de fluxo, ambiguidades, regras de negocio incompletas e riscos de testabilidade.
4. Levante perguntas criticas para o Product Owner antes da implementacao.
5. Nao reescreva o requisito completo.

## Formato de saida
Responda sempre em 4 blocos:

## 1. Avaliacao Geral
Classifique em `Bom`, `Precisa ajustes` ou `Incompleto` e justifique de forma breve.

## 2. Problemas Identificados
Liste problemas concretos encontrados no documento.

## 3. Perguntas para o Product Owner
Liste perguntas objetivas que precisam de resposta antes da implementacao.

## 4. Sugestoes de Melhoria
Sugira melhorias de clareza e estrutura sem reescrever todo o requisito.

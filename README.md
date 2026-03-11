<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🚌 BusCheck - Controle de Presença Escolar

Dashboard web para controle de presença de transporte escolar, com foco em simplicidade e praticidade para uso mobile e desktop.

## 📋 Sobre o Projeto

Sistema desenvolvido para facilitar o controle diário de presença dos alunos no transporte escolar. Permite marcar presença/ausência de forma rápida e visual, com indicadores de mensalidades pendentes.

## ✨ Funcionalidades

- ✅ **Controle de Presença**: Marque presença ou falta com um clique
- 📊 **Dashboard com Estatísticas**: Visualize totais de alunos, presentes, ausentes e pendentes
- 🔍 **Busca Rápida**: Encontre alunos por nome ou escola
- 🏫 **Filtros Inteligentes**: Filtre por período (Manhã/Tarde/Noite) e escola
- ⚠️ **Alerta de Mensalidades**: Identificação visual de pagamentos pendentes
- 📱 **Responsivo**: Funciona perfeitamente em celulares, tablets e desktop

## 🎨 Tecnologias Utilizadas

- **Google AI Studio** - Interface de desenvolvimento
- **Material Design** - Design system e componentes
- **Google Material Icons** - Biblioteca de ícones
- **localStorage** - Armazenamento local dos dados

## 🚀 Como Usar

### Marcando Presença

1. Localize o aluno na lista (use a busca se necessário)
2. Clique no botão **verde (✓)** para marcar presença
3. Clique no botão **vermelho (✗)** para marcar falta
4. Os contadores são atualizados automaticamente

### Aplicando Filtros

**Por Período:**
- Clique em "Manhã", "Tarde" ou "Noite" no topo
- Os números nos cards refletem apenas os alunos do período selecionado

**Por Escola:**
- Use o filtro de escolas para visualizar alunos de instituições específicas
- Combine filtros de período e escola para maior precisão

### Gerenciando Escolas

- Digite o nome de uma nova escola no campo de cadastro
- A escola será automaticamente adicionada às opções de filtro
- Escolas são salvas localmente no navegador

## 📊 Cards de Estatísticas

| Card | Descrição |
|------|-----------|
| 👥 **Total** | Número total de alunos (considerando filtros ativos) |
| ✅ **Presentes** | Alunos com presença marcada |
| ❌ **Ausentes** | Alunos com falta marcada |
| ⚠️ **Pendentes** | Alunos com mensalidade em atraso |

## 🎯 Indicadores Visuais

- **Borda verde**: Aluno com presença confirmada
- **Borda vermelha**: Aluno com falta confirmada
- **Badge amarelo "Pendente"**: Mensalidade em atraso
- **Fundo amarelo claro**: Aluno com pagamento pendente

## 💾 Armazenamento de Dados

Os dados são salvos localmente no navegador usando **localStorage**:
- ✅ Funciona offline
- ✅ Não requer servidor ou banco de dados
- ⚠️ Dados ficam apenas no navegador atual (não sincroniza entre dispositivos)

## 📱 Responsividade

- **Desktop**: Layout expandido com 3 colunas de cards
- **Tablet**: Cards em scroll horizontal
- **Mobile**: Interface otimizada com botões maiores para toque

## 🎨 Paleta de Cores

```
Background:     #F8FAFC (Cinza claro)
Cards:          #FFFFFF (Branco)
Primária:       #2563EB (Azul)
Sucesso:        #10B981 (Verde)
Erro:           #EF4444 (Vermelho)
Alerta:         #F59E0B (Laranja)
```

## 🔄 Próximas Melhorias

- [ ] Integração com banco de dados
- [ ] Sincronização entre dispositivos
- [ ] Relatórios exportáveis (PDF/Excel)
- [ ] Histórico de presença por aluno
- [ ] Notificações automáticas para pais
- [ ] Modo offline completo (PWA)

## 👥 Autor

Desenvolvido para facilitar o dia a dia do transporte escolar.

---

## 📄 Licença

Este projeto é de uso livre para fins educacionais e pessoais.

---

**Versão:** 1.0.0  
**Última atualização:** Março 2026

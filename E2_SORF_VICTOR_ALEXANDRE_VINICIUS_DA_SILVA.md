# E2 — Design Técnico, Arquitetura e Backlog

> **Disciplina:** Teoria dos Grafos  
> **Prazo:** 13 de abril de 2026  
> **Peso:** 20% da nota final  

---

## Identificação do Grupo

| Campo | Preenchimento |
|-------|---------------|
| Nome do projeto | SORF |
| Repositório GitHub | https://github.com/VictorSunn/SORF-PROJETO-TEORIA-DOS-GRAFOS |
| Integrante 1 | Vinícius da Silva Cardoso — 40373924 |
| Integrante 2 | Victor Alexandre Dorea Randis — 38470071 |
| Integrante 3 *(se houver)* | Nome — RA |

---

## 1. Algoritmos Escolhidos

### 1.1 Algoritmo Principal

| Campo | Resposta |
|-------|----------|
| Nome do algoritmo | Dijkstra |
| Categoria | ex.: guloso / Busca em grafos / Algoritmo guloso |
| Complexidade de tempo | O((V + E) log V) |
| Complexidade de espaço |O(V)|
| Problema que resolve | Encontrar o menor caminho entre dois vértices em grafos ponderados com pesos não negativos |

**Por que este algoritmo foi escolhido?**

<!--O algoritmo de Dijkstra foi escolhido porque o problema definido no projeto consiste em encontrar a menor rota entre dois pontos em uma cidade fictícia representada por um grafo ponderado. Nesse cenário, os vértices representam locais e as arestas representam caminhos com pesos que indicam distância ou custo.

Esse algoritmo é adequado para grafos com pesos não negativos, característica compatível com o domínio do projeto, já que distâncias físicas não podem ser negativas. Além disso, o algoritmo é amplamente utilizado em sistemas reais, como navegação GPS e roteamento logístico, o que reforça sua aplicabilidade prática.

Outro fator relevante é sua eficiência computacional quando utilizado com lista de adjacência e fila de prioridade, permitindo o cálculo rápido das rotas mesmo em grafos maiores. -->

**Alternativa descartada e motivo:**

| Algoritmo alternativo | Motivo da exclusão |
|----------------------|-------------------|
| Bellman-Ford | Possui maior custo computacional (O(VE)) e é indicado principalmente quando existem pesos negativos, o que não ocorre no contexto do projeto |

**Limitações no contexto do problema:**

<!-- O algoritmo não funciona corretamente em grafos com pesos negativos.
Pode apresentar custo computacional elevado em grafos extremamente grandes.
Não calcula múltiplos caminhos ótimos simultaneamente sem modificações adicionais. -->

**Referência bibliográfica:**

> <!-- GEEKSFORGEEKS. What are the differences between Bellman-Ford's and Dijkstra's Algorithms? GeeksforGeeks, 2026. Disponível em: https://www.geeksforgeeks.org/dsa/what-are-the-differences-between-bellman-fords-and-dijkstras-algorithms/. Acesso em: 21 abr. 2026. -->

---

### 1.2 Algoritmo Adicional *(se houver)*

| Campo | Resposta |
|-------|----------|
| Nome do algoritmo | |
| Categoria | |
| Complexidade de tempo | O( ) |
| Complexidade de espaço | O( ) |

**Justificativa:**

<!-- Por que este segundo algoritmo complementa o projeto? -->

**Referência bibliográfica:**

> 

---

## 2. Arquitetura em Camadas

> Insira o diagrama abaixo. Pode ser exportado do Draw.io, Excalidraw, etc.

![Diagrama de arquitetura](./docs/arquitetura_e2.png)

### Descrição das camadas

| Camada | Responsabilidade | Artefatos principais |
|--------|-----------------|----------------------|
| Apresentação (UI/CLI) | Responsável pela interação com o usuário, permitindo a entrada dos vértices de origem e destino e exibindo o caminho mínimo calculado. | main.py, interface em terminal (entrada e saída de dados) |
| Aplicação (Service) | Responsável por coordenar o fluxo do sistema, validar os dados informados pelo usuário e chamar o algoritmo de cálculo de rotas. | route_service.py, controlador principal |
| Domínio (Core) | Contém as estruturas de dados do grafo e a implementação dos algoritmos responsáveis pelo cálculo do menor caminho. | graph.py, edge.py, dijkstra.py, bfs.py |
| Infraestrutura (I/O) | Responsável pela leitura e carregamento dos arquivos JSON contendo os dados do grafo utilizados pelo sistema. | file_reader.py, leitura do grafo JSON |
---

## 3. Estrutura de Diretórios

```
sorf/
├── docs/
│   ├── README.md
│   ├── E1_SORF_VICTOR_ALEXANDRE_VINICIUS_DA_SILVA.md
│   └── E2_SORF_Design_Tecnico.md
├── src/
│   ├── core/
│   │   ├── graph.py          # estrutura do grafo
│   │   └── edge.py           # definição das arestas
│   ├── algorithms/
│   │   ├── dijkstra.py       # algoritmo principal
│   │   └── bfs.py            # algoritmo auxiliar
│   ├── io/
│   │   └── file_reader.py    # leitura do JSON
│   └── main.py               # execução do sistema
├── tests/
│   ├── test_graph.py
│   └── test_algorithms.py
├── data/
│   └── grafo_exemplo.json
└── requirements.txt          # dependências do projeto

> **Justificativa de desvios** *(se houver)*: 

---

## 4. Definição do Dataset

**Formato de entrada aceito:**

<!-- JSON / CSV / GraphML / lista de adjacência — O arquivo JSON representa um grafo ponderado utilizado para simular uma cidade fictícia.

O campo "inicio" define o vértice de origem e o campo "destino" define o vértice final da rota.
O campo "vertices" contém a lista de locais existentes no grafo, como depósito, bairros e cliente.
O campo "arestas" representa as conexões entre os vértices, contendo origem, destino e peso, onde o peso indica a distância ou custo entre os locais.
Esse formato permite que o algoritmo de Dijkstra calcule o menor caminho entre o ponto inicial e o destino. -->

**Exemplo de estrutura do arquivo de entrada:**

{
  "inicio": "Deposito",
  "destino": "Cliente",
  "vertices": [
    "Deposito",
    "Bairro A",
    "Bairro B",
    "Cliente"
  ],
  "arestas": [
    {"origem": "Deposito", "destino": "Bairro A", "peso": 4},
    {"origem": "Deposito", "destino": "Bairro B", "peso": 6},
    {"origem": "Bairro A", "destino": "Bairro B", "peso": 3},
    {"origem": "Bairro A", "destino": "Cliente", "peso": 5},
    {"origem": "Bairro B", "destino": "Cliente", "peso": 2}
  ]
}

**Estratégia de geração aleatória:**

| Parâmetro | Descrição |
|-----------|-----------|
| Número de vértices | Define quantos locais existirão na cidade fictícia, como depósito, bairros e clientes. O valor poderá variar entre 4 e 20 vértices. |
| Densidade |Define a quantidade de conexões entre os locais, variando entre 0.3 e 0.8, garantindo que o grafo permaneça conectado.|
| Faixa de pesos |Define o intervalo de valores atribuídos às arestas, representando distâncias entre os locais, variando entre 1 e 10 unidades. |

---

## 5. Backlog do Projeto

### 5.1 In-Scope — O que será implementado

| # | Funcionalidade | Prioridade | Critério de aceite |
|---|---------------|------------|-------------------|
| 1 | Carregar grafo a partir de arquivo JSON | Alta | Dado um arquivo JSON válido contendo vértices e arestas, quando o sistema realizar a leitura do arquivo, então o grafo deve ser carregado corretamente na memória. |
| 2 | Permitir definição do vértice de origem | Alta | Dado um grafo carregado, quando o usuário informar o vértice de origem, então o sistema deve validar se o vértice existe no grafo. |
| 3 | Permitir definição do vértice de destino | Alta | Dado um grafo carregado, quando o usuário informar o vértice de destino, então o sistema deve validar se o vértice existe no grafo. |
| 4 | Executar o algoritmo de Dijkstra | Alta | Dado um grafo carregado e vértices de origem e destino definidos, quando o algoritmo de Dijkstra for executado, então o sistema deve calcular o menor caminho entre os dois pontos. |
| 5 | Exibir o caminho mínimo e custo total | Média | Dado o cálculo do menor caminho concluído, quando o sistema finalizar a execução do algoritmo, então o caminho encontrado e o custo total devem ser exibidos ao usuário. |

### 5.2 Out-of-Scope — O que NÃO será feito

| Funcionalidade excluída | Motivo |
|------------------------|--------|
| Implementação de interface gráfica (GUI) | O sistema será desenvolvido inicialmente com interface em terminal (CLI), priorizando a lógica do algoritmo e simplificando o desenvolvimento. |
| Integração com mapas reais ou APIs externas (ex: GPS) | O projeto utiliza uma cidade fictícia para fins educacionais, evitando dependência de dados externos e complexidade adicional. |
| Suporte a grafos com pesos negativos | O algoritmo escolhido (Dijkstra) não suporta pesos negativos, e essa funcionalidade não é necessária para o contexto do projeto. |s

---

## Checklist de Entrega

- [x] Big-O de tempo e espaço declarados para cada algoritmo
- [x] Ao menos 1 alternativa descartada com justificativa
- [x] Diagrama de arquitetura com 4 camadas identificadas
- [x] Referência bibliográfica para cada algoritmo (ABNT ou IEEE)
- [x] Backlog com ≥ 5 itens In-Scope e ≥ 3 Out-of-Scope
- [x] Ao menos 3 critérios de aceite no formato "dado / quando / então"
- [x] Exemplo de estrutura de arquivo de entrada presente

---

*Teoria dos Grafos — Profa. Dra. Andréa Ono Sakai*

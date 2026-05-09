# SORF — Sistema de Otimização de Rotas com Grafos

Projeto desenvolvido para a disciplina de Teoria dos Grafos com o objetivo de simular uma cidade fictícia utilizando grafos ponderados e o algoritmo de Dijkstra para cálculo do menor caminho entre dois pontos.

O sistema permite carregar um grafo via arquivo JSON, executar o algoritmo de Dijkstra e exibir a rota de menor custo através de uma interface em linha de comando (CLI).

---

# Tecnologias Utilizadas

- :contentReference[oaicite:0]{index=0} 3
- Pytest
- JSON

---

# Estrutura do Projeto

```text
SORF/
├── src/
│   ├── algorithms/
│   │   └── dijkstra.py
│   │
│   ├── core/
│   │   └── graph.py
│   │
│   ├── loader/
│   │   └── file_reader.py
│   │
│   └── main.py
│
├── tests/
│   └── test_algorithms.py
│
├── data/
│   └── grafo_exemplo.json
│
├── requirements.txt
├── .gitignore
└── README.md

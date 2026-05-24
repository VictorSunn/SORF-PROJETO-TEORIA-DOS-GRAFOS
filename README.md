Claro. Pode criar/substituir o arquivo **`README.md`** na raiz do projeto com este conteúdo:

````markdown
# SORF — Sistema de Otimização de Rotas Urbanas

O **SORF** é um sistema de otimização de rotas urbanas baseado em **Teoria dos Grafos**, utilizando o algoritmo de **Dijkstra** para calcular o menor caminho entre pontos de uma rede urbana.

O projeto modela regiões reais de **Ferraz de Vasconcelos** como um grafo ponderado, onde os vértices representam locais urbanos e as arestas representam conexões entre esses pontos com pesos em quilômetros.

---

## Objetivo do Projeto

O objetivo principal do SORF é demonstrar como problemas reais de mobilidade urbana e logística podem ser representados por meio de grafos e resolvidos com algoritmos clássicos de menor caminho.

O sistema permite que o usuário selecione uma origem e um destino, execute o cálculo da menor rota e visualize o resultado em uma interface web com apoio visual de mapa.

---

## Tecnologias Utilizadas

- Python
- FastAPI
- Uvicorn
- HTML
- CSS
- JavaScript
- Mapbox
- JSON
- Pytest

---

## Algoritmo Utilizado

O algoritmo principal do projeto é o **Dijkstra**.

Ele foi escolhido porque o problema trabalha com:

- grafo ponderado;
- pesos não negativos;
- cálculo de menor caminho;
- otimização de rotas urbanas.

No SORF, o Dijkstra é responsável por calcular a menor rota entre dois vértices do grafo.

---

## Como o Grafo é Modelado

O grafo é composto por:

### Vértices

Representam locais urbanos, como:

- Vila São Paulo
- Centro
- Mercado da Praça
- Avenida Brasil
- Estação Ferraz
- Hospital Regional
- Jardim Castelo
- Cidade Kemel

### Arestas

Representam conexões entre os pontos urbanos.

### Pesos

Representam a distância aproximada em quilômetros entre os pontos conectados.

Exemplo:

```json
{
  "origem": "vila_sao_paulo",
  "destino": "avenida_brasil",
  "peso": 0.6
}
````

Isso significa que existe uma conexão entre Vila São Paulo e Avenida Brasil com custo de 0.6 km.

---

## Importante sobre o Mapbox

O Mapbox é utilizado apenas como **camada visual** do sistema.

Ele serve para:

* exibir o mapa;
* mostrar os pontos urbanos;
* desenhar visualmente a rota.

O cálculo da menor rota **não é feito pelo Mapbox**.

A decisão da rota é feita internamente pelo algoritmo de **Dijkstra**, implementado no backend do SORF.

Fluxo do sistema:

```text
Frontend
↓
API FastAPI
↓
Algoritmo de Dijkstra
↓
Grafo em JSON
↓
Resultado da rota
↓
Visualização no Mapbox
```

---

## Estrutura do Projeto

```text
SORF/
├── data/
│   └── grafo_exemplo.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── src/
│   ├── algorithms/
│   │   └── dijkstra.py
│   │
│   ├── api/
│   │   └── app.py
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
├── requirements.txt
└── README.md
```

---

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/VictorSunn/SORF-PROJETO-TEORIA-DOS-GRAFOS.git
```

Depois entre na pasta do projeto:

```bash
cd SORF-PROJETO-TEORIA-DOS-GRAFOS/SORF
```

---

### 2. Instalar as dependências

```bash
pip install -r requirements.txt
```

Caso o arquivo `requirements.txt` ainda não esteja configurado, instale manualmente:

```bash
pip install fastapi uvicorn pytest
```

---

### 3. Executar a API

Na raiz do projeto, rode:

```bash
python -m uvicorn src.api.app:app --reload
```

Se estiver funcionando, aparecerá algo parecido com:

```text
Uvicorn running on http://127.0.0.1:8000
```

---

### 4. Testar a API

Abra no navegador:

```text
http://127.0.0.1:8000/docs
```

Essa página abre a documentação automática da API pelo Swagger.

Também é possível testar os locais disponíveis acessando:

```text
http://127.0.0.1:8000/locations
```

---

### 5. Executar o Frontend

Com a API ainda rodando, abra a pasta `frontend/` no VS Code.

Depois clique com o botão direito no arquivo:

```text
index.html
```

E selecione:

```text
Open with Live Server
```

O frontend será aberto no navegador e permitirá selecionar origem e destino para calcular a rota.

---

## Endpoints da API

### `GET /`

Verifica se a API está online.

Resposta esperada:

```json
{
  "message": "SORF API online"
}
```

---

### `GET /locations`

Retorna os locais disponíveis para seleção no sistema.

---

### `GET /graph`

Retorna os vértices e arestas do grafo urbano.

---

### `POST /route`

Calcula a menor rota entre origem e destino.

Exemplo de requisição:

```json
{
  "origin": "vila_sao_paulo",
  "destination": "mercado_praca"
}
```

Exemplo de resposta:

```json
{
  "origin": "Vila São Paulo",
  "destination": "Mercado da Praça",
  "path": [
    "Vila São Paulo",
    "Avenida Brasil",
    "Mercado da Praça"
  ],
  "path_ids": [
    "vila_sao_paulo",
    "avenida_brasil",
    "mercado_praca"
  ],
  "distance_km": 1.0
}
```

---

## Como Executar pelo Terminal

Além da interface web, o projeto também pode ser executado pelo terminal:

```bash
python -m src.main
```

Nesse modo, o usuário informa os IDs dos locais e o sistema retorna a menor rota encontrada.

---

## Testes

Para executar os testes unitários, use:

```bash
pytest
```

Os testes validam o funcionamento do algoritmo principal e da estrutura do grafo.

---

## Diferença entre SORF e GPS

O SORF não é um GPS completo como Google Maps ou Waze.

O objetivo do projeto é acadêmico e computacional: demonstrar a aplicação de grafos e do algoritmo de Dijkstra em um problema de otimização urbana.

O Mapbox é utilizado apenas para visualização, enquanto o cálculo da menor rota é feito pelo algoritmo implementado no próprio projeto.

---

## Autores

Projeto desenvolvido para a disciplina de **Teoria dos Grafos**.

Grupo: **SORF**

Integrantes:

* Vinícius da Silva Cardoso
* Victor Alexandre Dorea Randis

---

## Status do Projeto
````
MVP funcional com:

* leitura de grafo por JSON;
* algoritmo de Dijkstra;
* API FastAPI;
* frontend web;
* visualização com Mapbox;
* cálculo de menor rota;
* estrutura de diretórios organizada.

````

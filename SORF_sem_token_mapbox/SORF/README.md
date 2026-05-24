# SORF
Sistema de otimização de rotas utilizando grafos e o algoritmo de Dijkstra.

O projeto simula uma cidade fictícia representada por um grafo ponderado, onde os vértices representam locais e as arestas representam caminhos com pesos correspondentes às distâncias entre os pontos.

# Tecnologias utilizadas

- Python 3
- Pytest

# Estrutura do projeto

SORF/
├── src/
│   ├── algorithms/
│   ├── core/
│   ├── loader/
│   └── main.py
│
├── tests/
├── data/
├── requirements.txt
└── README.md

# Como executar o projeto

## 1. Clonar o repositório

git clone https://github.com/SEU-USUARIO/SORF-PROJETO-TEORIA-DOS-GRAFOS.git

## 2. Entrar na pasta do projeto

cd SORF-PROJETO-TEORIA-DOS-GRAFOS

## 3. Instalar dependências

pip install -r requirements.txt

# Executar o MVP

python -m src.main

# Executar os testes

python -m pytest

# Exemplo de execução

Origem: Deposito
Destino: Cliente B

===== RESULTADO =====

Menor caminho encontrado:
Deposito -> Mercado Central -> Praca -> Posto -> Cliente B

Custo total: 15

# Funcionalidades implementadas

- Leitura de grafos via arquivo JSON
- Estrutura de grafo utilizando lista de adjacência
- Algoritmo de Dijkstra
- Cálculo do menor caminho
- Interface CLI
- Testes unitários automatizados
# Integrantes

- Vinícius da Silva Cardoso — 40373924
- Victor Alexandre Dorea Randis — 38470071

## Configuração do Mapbox

O token real do Mapbox não deve ser enviado ao GitHub.

Para ativar o mapa localmente:

1. Copie o arquivo:

```text
frontend/config.example.js
```

2. Renomeie a cópia para:

```text
frontend/config.js
```

3. Dentro de `config.js`, substitua o texto de exemplo pelo seu token público do Mapbox:

```javascript
const MAPBOX_TOKEN = "COLE_SEU_TOKEN_MAPBOX_AQUI";
```

O arquivo `frontend/config.js` está listado no `.gitignore`, portanto não será enviado ao repositório. A API FastAPI e o algoritmo de Dijkstra funcionam mesmo sem o token; sem ele, apenas o mapa visual não será carregado.

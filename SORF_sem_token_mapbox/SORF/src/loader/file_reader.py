import json

from src.core.graph import Graph


def load_graph(filepath):

    with open(filepath, "r", encoding="utf-8") as file:
        data = json.load(file)

    graph = Graph()
    names = {}

    for vertex in data["vertices"]:
        vertex_id = vertex["id"]
        vertex_name = vertex["nome"]

        graph.add_vertex(vertex_id)
        names[vertex_id] = vertex_name

    for edge in data["arestas"]:
        graph.add_edge(
    edge["origem"],
    edge["destino"],
    edge["peso_distancia_km"]
)

    return graph, names
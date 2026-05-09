import json

from src.core.graph import Graph


def load_graph(filepath):

    with open(filepath, "r", encoding="utf-8") as file:
        data = json.load(file)

    graph = Graph()

    for vertex in data["vertices"]:
        graph.add_vertex(vertex)

    for edge in data["arestas"]:

        graph.add_edge(
            edge["origem"],
            edge["destino"],
            edge["peso"]
        )

    return graph
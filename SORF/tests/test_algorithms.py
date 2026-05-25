from src.core.graph import Graph
from src.algorithms.dijkstra import dijkstra


def test_base_case():

    graph = Graph()

    graph.add_edge("A", "B", 2)
    graph.add_edge("B", "C", 3)

    path, cost = dijkstra(graph, "A", "C")

    assert path == ["A", "B", "C"]
    assert cost == 5


def test_empty_graph():

    graph = Graph()

    try:

        dijkstra(graph, "A", "B")

        assert False

    except KeyError:

        assert True


def test_complete_graph():

    graph = Graph()

    graph.add_edge("A", "B", 1)
    graph.add_edge("A", "C", 4)
    graph.add_edge("B", "C", 2)

    path, cost = dijkstra(graph, "A", "C")

    assert path == ["A", "B", "C"]
    assert cost == 3
from src.loader.file_reader import load_graph
from src.algorithms.dijkstra import dijkstra


def main():

    graph = load_graph("data/grafo_exemplo.json")

    print("\n===== SORF =====")

    print("\nLocais disponíveis:")

    for vertex in graph.adjacency_list:
        print(f"- {vertex}")

    start = input("\nDigite o local de origem: ")
    end = input("Digite o local de destino: ")

    if start not in graph.adjacency_list:
        print("\nErro: origem inválida.")
        return

    if end not in graph.adjacency_list:
        print("\nErro: destino inválido.")
        return

    path, cost = dijkstra(graph, start, end)

    print("\n===== RESULTADO =====")

    print(f"\nOrigem: {start}")
    print(f"Destino: {end}")

    print("\nMenor caminho encontrado:")

    print(" -> ".join(path))

    print(f"\nCusto total: {cost}")


if __name__ == "__main__":
    main()
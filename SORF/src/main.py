from src.loader.file_reader import load_graph
from src.algorithms.dijkstra import dijkstra


def print_logo():

    print(r"""
███████╗ ██████╗ ██████╗ ███████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝
███████╗██║   ██║██████╔╝█████╗
╚════██║██║   ██║██╔══██╗██╔══╝
███████║╚██████╔╝██║  ██║██║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝
""")


def main():

    graph, names = load_graph("data/grafo_exemplo.json")

    print("\n")
    print_logo()

    print("=" * 75)
    print("        SISTEMA DE OTIMIZAÇÃO DE ROTAS URBANAS")
    print("=" * 75)

    print("\nProjeto de Teoria dos Grafos")
    print("Cidade modelada: Ferraz de Vasconcelos")
    print("Algoritmo utilizado: Dijkstra")
    print("Modelagem baseada em grafos ponderados urbanos")

    print("\n" + "=" * 75)
    print("                    LOCAIS DISPONÍVEIS")
    print("=" * 75)

    for vertex_id, vertex_name in names.items():
        print(f"[{vertex_id}] -> {vertex_name}")

    print("\n" + "=" * 75)

    start = input("\nDigite o ID do local de ORIGEM: ")
    end = input("Digite o ID do local de DESTINO: ")

    if start not in graph.adjacency_list:
        print("\n[ERRO] Origem inválida.")
        return

    if end not in graph.adjacency_list:
        print("\n[ERRO] Destino inválido.")
        return

    path, distance = dijkstra(graph, start, end)

    print("\n")
    print("=" * 75)
    print("                    RESULTADO DA ROTA")
    print("=" * 75)

    print(f"\nOrigem : {names[start]}")
    print(f"Destino: {names[end]}")

    print("\nMenor caminho encontrado:\n")

    readable_path = [names[vertex] for vertex in path]

    for i, location in enumerate(readable_path):

        if i < len(readable_path) - 1:
            print(f"{location}")
            print("   ↓")
        else:
            print(f"{location}")

    print("\n" + "=" * 75)

    print(f"\nDistância total percorrida: {distance:.1f} km")

    print("\nRota otimizada com sucesso.")
    print("Processamento realizado utilizando o algoritmo de Dijkstra.")

    print("\n" + "=" * 75)


if __name__ == "__main__":
    main()
import heapq


def dijkstra(graph, start, end):

    distances = {}
    previous = {}

    for vertex in graph.adjacency_list:
        distances[vertex] = float("inf")
        previous[vertex] = None

    distances[start] = 0

    priority_queue = [(0, start)]

    while priority_queue:

        current_distance, current_vertex = heapq.heappop(priority_queue)

        if current_vertex == end:
            break

        neighbors = graph.get_neighbors(current_vertex)

        for neighbor, weight in neighbors:

            distance = current_distance + weight

            if distance < distances[neighbor]:

                distances[neighbor] = distance
                previous[neighbor] = current_vertex

                heapq.heappush(
                    priority_queue,
                    (distance, neighbor)
                )

    path = []

    current = end

    while current is not None:
        path.insert(0, current)
        current = previous[current]

    return path, distances[end]
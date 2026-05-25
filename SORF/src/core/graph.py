class Graph:

    def __init__(self):
        self.adjacency_list = {}

    def add_vertex(self, vertex):

        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []

    def add_edge(self, origin, destination, weight):

        self.add_vertex(origin)
        self.add_vertex(destination)

        self.adjacency_list[origin].append((destination, weight))
        self.adjacency_list[destination].append((origin, weight))

    def get_neighbors(self, vertex):

        return self.adjacency_list.get(vertex, [])
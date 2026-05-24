import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.loader.file_reader import load_graph
from src.algorithms.dijkstra import dijkstra


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph, names = load_graph("data/grafo_exemplo.json")

with open("data/grafo_exemplo.json", "r", encoding="utf-8") as file:
    graph_data = json.load(file)


class RouteRequest(BaseModel):
    origin: str
    destination: str


@app.get("/")
def root():
    return {
        "message": "SORF API online"
    }


@app.get("/locations")
def get_locations():
    return names


@app.get("/graph")
def get_graph():
    return graph_data


@app.post("/route")
def calculate_route(request: RouteRequest):
    origin = request.origin
    destination = request.destination

    if origin not in graph.adjacency_list:
        return {
            "error": "Origem inválida"
        }

    if destination not in graph.adjacency_list:
        return {
            "error": "Destino inválido"
        }

    path, distance = dijkstra(graph, origin, destination)

    readable_path = [
        names[vertex]
        for vertex in path
    ]

    return {
        "origin": names[origin],
        "destination": names[destination],
        "path": readable_path,
        "path_ids": path,
        "distance_km": round(distance, 1)
    }
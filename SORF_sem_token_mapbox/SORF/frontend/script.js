const API_URL = "http://127.0.0.1:8000";

const MAPBOX_TOKEN_VALUE =
    typeof MAPBOX_TOKEN !== "undefined"
        ? MAPBOX_TOKEN
        : "";

if (typeof mapboxgl !== "undefined" && MAPBOX_TOKEN_VALUE) {
    mapboxgl.accessToken = MAPBOX_TOKEN_VALUE;
}

let map;
let graphData;
let markers = [];

async function loadLocations() {
    const response = await fetch(`${API_URL}/locations`);

    if (!response.ok) {
        throw new Error("Não foi possível carregar /locations");
    }

    const locations = await response.json();

    const originSelect = document.getElementById("origin");
    const destinationSelect = document.getElementById("destination");

    originSelect.innerHTML = "";
    destinationSelect.innerHTML = "";

    for (const [id, name] of Object.entries(locations)) {
        const optionOrigin = document.createElement("option");
        optionOrigin.value = id;
        optionOrigin.textContent = name;
        originSelect.appendChild(optionOrigin);

        const optionDestination = document.createElement("option");
        optionDestination.value = id;
        optionDestination.textContent = name;
        destinationSelect.appendChild(optionDestination);
    }
}

async function initMap() {
    const resultDiv = document.getElementById("result");

    if (typeof mapboxgl === "undefined") {
        resultDiv.innerHTML = `
            <div class="error">
                O Mapbox não foi carregado. A API e o cálculo de rotas continuam funcionando.
            </div>
        `;
        return;
    }

    if (!MAPBOX_TOKEN_VALUE || MAPBOX_TOKEN_VALUE === "COLE_SEU_TOKEN_MAPBOX_AQUI") {
        resultDiv.innerHTML = `
            <div class="error">
                Token do Mapbox não configurado. Copie frontend/config.example.js para frontend/config.js
                e cole seu token para ativar o mapa. A API e o Dijkstra continuam funcionando.
            </div>
        `;
        return;
    }

    if (!mapboxgl.supported()) {
        resultDiv.innerHTML = `
            <div class="error">
                Este navegador/ambiente não suporta Mapbox GL. A API e o cálculo de rotas continuam funcionando.
            </div>
        `;
        return;
    }

    map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/navigation-night-v1",
        center: [-46.3655, -23.5465],
        zoom: 15,
        pitch: 60,
        bearing: -25
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", async () => {
        try {
            add3DBuildings();
            await loadGraph();
        } catch (error) {
            console.error("Erro ao carregar grafo/mapa:", error);
        }
    });
}

function add3DBuildings() {
    if (!map || map.getLayer("3d-buildings")) {
        return;
    }

    const layers = map.getStyle().layers;

    const labelLayerId = layers.find(
        layer => layer.type === "symbol" && layer.layout && layer.layout["text-field"]
    )?.id;

    map.addLayer(
        {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
                "fill-extrusion-color": "#1e293b",
                "fill-extrusion-height": ["get", "height"],
                "fill-extrusion-base": ["get", "min_height"],
                "fill-extrusion-opacity": 0.75
            }
        },
        labelLayerId
    );
}

async function loadGraph() {
    const response = await fetch(`${API_URL}/graph`);

    if (!response.ok) {
        throw new Error("Não foi possível carregar /graph");
    }

    graphData = await response.json();

    markers.forEach(marker => marker.remove());
    markers = [];

    graphData.vertices.forEach(vertex => {
        if (vertex.latitude === undefined || vertex.longitude === undefined) {
            return;
        }

        const markerElement = document.createElement("div");
        markerElement.className = "custom-marker";

        const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([vertex.longitude, vertex.latitude])
            .setPopup(
                new mapboxgl.Popup().setHTML(
                    `<strong>${vertex.nome}</strong>`
                )
            )
            .addTo(map);

        markers.push(marker);
    });
}

async function calculateRoute() {
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const resultDiv = document.getElementById("result");

    resultDiv.innerHTML = "Calculando menor rota com Dijkstra...";

    try {
        const response = await fetch(`${API_URL}/route`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                origin,
                destination
            })
        });

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<div class="error">${data.error}</div>`;
            return;
        }

        showResult(data);

        if (map && graphData) {
            await drawRoute(data.path_ids);
        }

    } catch (err) {
        resultDiv.innerHTML = `
            <div class="error">
                Erro ao calcular rota. Verifique se a API FastAPI está rodando em http://127.0.0.1:8000.
            </div>
        `;
        console.error(err);
    }
}

function showResult(data) {
    const resultDiv = document.getElementById("result");

    const routeSteps = data.path.map((location, index) => {
        if (index === data.path.length - 1) {
            return `<div class="route-step">${location}</div>`;
        }

        return `
            <div class="route-step">${location}</div>
            <div class="route-connector"><span></span></div>
        `;
    }).join("");

    resultDiv.innerHTML = `
        <strong>Origem:</strong> ${data.origin}
        <br>
        <strong>Destino:</strong> ${data.destination}

        <div class="route-box">
            ${routeSteps}
        </div>

        <div class="distance">
            Distância total pelo grafo: ${data.distance_km} km
        </div>
    `;
}

async function drawRoute(pathIds) {
    if (!pathIds || pathIds.length < 2 || !map || !graphData) {
        return;
    }

    const originId = pathIds[0];
    const destId = pathIds[pathIds.length - 1];

    const originVertex = graphData.vertices.find(v => v.id === originId);
    const destVertex = graphData.vertices.find(v => v.id === destId);

    if (!originVertex || !destVertex) {
        return;
    }

    const coordinatesText = `${originVertex.longitude},${originVertex.latitude};${destVertex.longitude},${destVertex.latitude}`;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesText}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
            drawStraightRoute([
                [originVertex.longitude, originVertex.latitude],
                [destVertex.longitude, destVertex.latitude]
            ]);
            return;
        }

        const routeGeometry = data.routes[0].geometry;
        removeOldRoute();

        map.addSource("route", {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: routeGeometry
            }
        });

        map.addLayer({
            id: "route-line-glow",
            type: "line",
            source: "route",
            layout: {
                "line-join": "round",
                "line-cap": "round"
            },
            paint: {
                "line-color": "#38bdf8",
                "line-width": 14,
                "line-opacity": 0.35
            }
        });

        map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: {
                "line-join": "round",
                "line-cap": "round"
            },
            paint: {
                "line-color": "#38bdf8",
                "line-width": 7,
                "line-opacity": 0.95
            }
        });

        const bounds = new mapboxgl.LngLatBounds();
        routeGeometry.coordinates.forEach(coord => {
            bounds.extend(coord);
        });

        map.fitBounds(bounds, {
            padding: 100,
            pitch: 60,
            bearing: -25
        });

    } catch (error) {
        console.error("Falha no Mapbox Directions:", error);
        drawStraightRoute([
            [originVertex.longitude, originVertex.latitude],
            [destVertex.longitude, destVertex.latitude]
        ]);
    }
}

function drawStraightRoute(coordinates) {
    if (!map) {
        return;
    }

    removeOldRoute();

    map.addSource("route", {
        type: "geojson",
        data: {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: coordinates
            }
        }
    });

    map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
            "line-color": "#ff3838",
            "line-width": 7,
            "line-opacity": 0.95
        }
    });
}

function removeOldRoute() {
    if (!map) {
        return;
    }

    if (map.getLayer("route-line")) {
        map.removeLayer("route-line");
    }

    if (map.getLayer("route-line-glow")) {
        map.removeLayer("route-line-glow");
    }

    if (map.getSource("route")) {
        map.removeSource("route");
    }
}

window.onload = async () => {
    try {
        await loadLocations();
    } catch (error) {
        console.error("Erro ao carregar locais:", error);
        document.getElementById("result").innerHTML = `
            <div class="error">
                Não foi possível carregar os locais. Verifique se a API FastAPI está rodando.
            </div>
        `;
    }

    try {
        await initMap();
    } catch (error) {
        console.error("Erro ao inicializar mapa:", error);
    }
};

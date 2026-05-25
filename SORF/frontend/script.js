const API_URL = "http://127.0.0.1:8000";

mapboxgl.accessToken = MAPBOX_TOKEN;

let map;
let graphData;
let markers = [];

async function initMap() {
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
        add3DBuildings();
        await loadLocations();
        await loadGraph();
    });
}

function add3DBuildings() {
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

async function loadLocations() {
    const response = await fetch(`${API_URL}/locations`);
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

async function loadGraph() {
    const response = await fetch(`${API_URL}/graph`);
    graphData = await response.json();

    graphData.vertices.forEach(vertex => {
        const markerElement = document.createElement("div");
        markerElement.className = "custom-marker";

        const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([vertex.longitude, vertex.latitude])
            .setPopup(
                new mapboxgl.Popup().setHTML(
                    `<strong>${vertex.nome}</strong><br>ID: ${vertex.id}`
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

    resultDiv.innerHTML = "A calcular a menor rota com Dijkstra...";

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

        // Se o Python devolver aquele erro de 'inf' (inifinito) configurado
        if (data.error) {
            resultDiv.innerHTML = `<div class="error" style="color: #ff3838; font-weight: bold;">${data.error}</div>`;
            return;
        }

        showResult(data);
        await drawRoute(data.path_ids);

    } catch (err) {
        resultDiv.innerHTML = `<div class="error" style="color: #ff3838;">Erro crítico no servidor Python. Verifique a consola do Backend.</div>`;
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
            <div class="arrow">↓</div>
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

// === FUNÇÃO REESCRITA: PASSA APENAS A ORIGEM E O DESTINO AO MAPBOX ===
async function drawRoute(pathIds) {
    if (!pathIds || pathIds.length < 2) return;

    // Pega APENAS na origem e no destino finais calculados pelo Dijkstra
    const originId = pathIds[0];
    const destId = pathIds[pathIds.length - 1];

    const originVertex = graphData.vertices.find(v => v.id === originId);
    const destVertex = graphData.vertices.find(v => v.id === destId);

    // Monta a string apenas com as duas coordenadas principais
    const coordinatesText = `${originVertex.longitude},${originVertex.latitude};${destVertex.longitude},${destVertex.latitude}`;

    // Pedido à API de condução (driving) para agarrar a linha ao asfalto naturalmente
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesText}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
            console.error("Mapbox falhou ao traçar via asfalto. A usar linha reta.", data.message);
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
        console.error("Falha no Mapbox:", error);
        drawStraightRoute([
            [originVertex.longitude, originVertex.latitude],
            [destVertex.longitude, destVertex.latitude]
        ]);
    }
}

// Se o Mapbox falhar, a linha desenhada será VERMELHA para lhe alertar do erro.
function drawStraightRoute(coordinates) {
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
            "line-color": "#ff3838", // Vermelho para indicar falha da API
            "line-width": 7,
            "line-opacity": 0.95
        }
    });
}

function removeOldRoute() {
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getLayer("route-line-glow")) map.removeLayer("route-line-glow");
    if (map.getSource("route")) map.removeSource("route");
}

initMap();
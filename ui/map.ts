import "./map.css";
import "./popup.css";
import {Map, Overlay, View} from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {fromLonLat} from "ol/proj";
import {XYZ} from "ol/source";
import {defaults as defaultControls, FullScreen, ScaleLine} from "ol/control";
import {LayerDef} from "./ts/LayerDef";
import {HutsLayer} from "./ts/HutsLayer";
import {StartLayer} from "./ts/StartLayer";
import {FinishLayer} from "./ts/FinishLayer";
import {ControlsLayer} from "./ts/ControlsLayer";
import {BusLayer} from "./ts/BusLayer";
import {pistesLayer} from "./ts/pistes";

document.addEventListener("DOMContentLoaded", () => {
    const layerSwitch = 10;

    const rasterLayers: TileLayer<XYZ | OSM>[] = [];
    const zoomedInLayer = new TileLayer({
        minZoom: layerSwitch,
        source: new XYZ({
            url: "https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
        }),
    });
    rasterLayers.push(zoomedInLayer);
    const osmLayer = new TileLayer({
        maxZoom: layerSwitch,
        source: new OSM(),
    });
    rasterLayers.push(osmLayer);
    rasterLayers.forEach((r) => r.setOpacity(0.6));

    const layerDefs: LayerDef[] = [
        new BusLayer(),
        new HutsLayer(),
        new StartLayer(),
        new FinishLayer(),
        new ControlsLayer(),
    ];

    layerDefs.forEach((d) => {
        const source = new VectorSource({wrapX: false});
        d.setSource(source);
        const layer = new VectorLayer({source, visible: true});
        d.setLayer(layer);
    });

    const mapView = new View({maxZoom: 19});
    mapView.setZoom(10);
    mapView.setCenter(fromLonLat([23.738, 68.1851]));

    function initialiseMap() {
        const map = new Map({
            controls: defaultControls().extend([
                new FullScreen(),
                new ScaleLine(),
            ]),
            target: "map",
            layers: [
                ...rasterLayers,
                pistesLayer,
                ...layerDefs.map((d) => d.getLayer()),
            ],
            keyboardEventTarget: document,
            view: mapView,
        });

        const container = document.getElementById("popup") as HTMLDivElement;
        const title = document.getElementById("popup-title") as HTMLDivElement;
        const text = document.getElementById("popup-text") as HTMLDivElement;
        const closer = document.getElementById(
            "popup-closer"
        ) as HTMLDivElement;

        const overlay = new Overlay({
            element: container,
            autoPan: true,
        });

        map.on("click", function (e) {
            const feature = map.forEachFeatureAtPixel(e.pixel, (f) =>
                f.getProperties().popup ? f : false
            );
            if (!feature) {
                overlay.setPosition(undefined);
                closer.blur();
                return;
            }
            const props = feature.getProperties().popup;

            title.innerHTML = props.title;
            text.innerHTML = props.text;
            overlay.setPosition(e.coordinate);
        });

        map.addOverlay(overlay);
        closer.onclick = () => {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };
    }

    function loadLayers() {
        layerDefs.forEach((def) => {
            def.render().catch((e) => {
                alert(e);
            });
        });
    }

    initialiseMap();
    loadLayers();
});

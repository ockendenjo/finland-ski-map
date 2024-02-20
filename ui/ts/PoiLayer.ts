import {LayerDef} from "./LayerDef";
import {LayerDefBase} from "./LayerDefBase";
import {Feature} from "ol";
import {fromLonLat} from "ol/proj";
import {Point} from "ol/geom";
import {Fill, RegularShape, Stroke, Style} from "ol/style";
import {HutsLayer} from "./HutsLayer";

export class PoiLayer extends LayerDefBase implements LayerDef {
    render() {
        data.forEach((poi) => {
            const f = this.getFeature(poi);
            this.getSource().addFeature(f);
        });
        return Promise.resolve();
    }

    private getFeature(p: Poi): Feature<any> {
        let txt = "";
        if (p.note) {
            txt += `<p>${p.note}</p>`;
        }

        let iconFeature = new Feature({
            geometry: new Point(fromLonLat([p.lon, p.lat])),
            type: "INFO",
            popup: {
                title: p.name,
                text: txt,
            },
        });

        iconFeature.setStyle(INFO_STYLE);

        return iconFeature;
    }
}

const INFO_STYLE = HutsLayer.buildStyle(8, "purple");

type Poi = {
    name: string;
    lat: number;
    lon: number;
    note?: string;
};

const data: Poi[] = [
    {
        name: "Tourist center",
        lat: 68.39508,
        lon: 23.66773,
        note: "Pick up hut keys etc.",
    },
    {
        name: "Accommodation",
        lat: 68.3858,
        lon: 23.60477,
        note: "In Hetta - 14 Mar",
    },
    {
        name: "Hetta Huskies",
        lat: 68.38161,
        lon: 23.55775,
        note: "Ski hire",
    },
];

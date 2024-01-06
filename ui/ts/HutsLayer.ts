import {LayerDef} from "./LayerDef";
import {LayerDefBase} from "./LayerDefBase";
import {Feature} from "ol";
import {fromLonLat} from "ol/proj";
import {Point} from "ol/geom";
import {Fill, RegularShape, Stroke, Style} from "ol/style";

export class HutsLayer extends LayerDefBase implements LayerDef {
    render() {
        fetch("huts.json")
            .then((r) => r.json())
            .then((j: HutsFile) => {
                j.huts.sort((a, b) => {
                    return Number(a.reservable) - Number(b.reservable);
                });

                j.huts.forEach((h) => {
                    const f = this.getFeature(h);
                    this.getSource().addFeature(f);
                });
            });

        return Promise.resolve();
    }

    private getFeature(h: Hut): Feature<any> {
        let iconFeature = new Feature({
            geometry: new Point(fromLonLat([h.lon, h.lat])),
            type: "HUT",
            data: h,
        });

        iconFeature.setStyle(h.reservable ? RESERVABLE_STYLE : OPEN_STYLE);

        return iconFeature;
    }

    static buildStyle(
        radius: number,
        fill: string,
        stroke = "white",
        width = 2
    ) {
        return new Style({
            image: new RegularShape({
                points: 4,
                rotation: Math.PI / 4,
                radius,
                fill: new Fill({color: fill}),
                stroke: new Stroke({color: stroke, width}),
            }),
        });
    }
}

type HutsFile = {
    huts: Hut[];
};

type Hut = {
    name: string;
    lat: number;
    lon: number;
    reservable: boolean;
};

const RESERVABLE_STYLE = HutsLayer.buildStyle(8, "green");
const OPEN_STYLE = HutsLayer.buildStyle(8, "orange");

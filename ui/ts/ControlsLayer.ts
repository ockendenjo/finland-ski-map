import {LayerDef} from "./LayerDef";
import {LayerDefBase} from "./LayerDefBase";
import {Feature} from "ol";
import {fromLonLat} from "ol/proj";
import {Point} from "ol/geom";
import {Circle, Fill, RegularShape, Stroke, Style} from "ol/style";
import {buildStyle} from "ol/render/canvas/style";
import {FinishLayer} from "./FinishLayer";

export class ControlsLayer extends LayerDefBase implements LayerDef {
    render() {
        const controls = [
            {
                lat: 68.21776,
                lon: 23.94408,
            },
            {lat: 68.1297, lon: 24.05645},
        ];

        controls.forEach((c) => {
            const f = new Feature({
                geometry: new Point(fromLonLat([c.lon, c.lat])),
                type: "CONTROL",
            });
            f.setStyle(INNER_STYLE);
            this.getSource().addFeature(f);
        });

        return Promise.resolve();
    }
}

const INNER_STYLE = FinishLayer.buildStyle(12);

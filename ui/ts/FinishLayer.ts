import {LayerDef} from "./LayerDef";
import {LayerDefBase} from "./LayerDefBase";
import {Feature} from "ol";
import {fromLonLat} from "ol/proj";
import {Point} from "ol/geom";
import {Circle, Fill, RegularShape, Stroke, Style} from "ol/style";
import {buildStyle} from "ol/render/canvas/style";

export class FinishLayer extends LayerDefBase implements LayerDef {
    render() {
        let inner = new Feature({
            geometry: new Point(fromLonLat([24.06262, 68.04616])),
            type: "FINISH",
        });
        inner.setStyle(INNER_STYLE);
        this.getSource().addFeature(inner);

        let outer = new Feature({
            geometry: new Point(fromLonLat([24.06262, 68.04616])),
            type: "FINISH",
        });
        outer.setStyle(OUTER_STYLE);
        this.getSource().addFeature(outer);

        return Promise.resolve();
    }

    static buildStyle(radius: number) {
        return new Style({
            image: new Circle({
                radius,
                stroke: new Stroke({color: "#ff007f", width: 2}),
            }),
        });
    }
}

const INNER_STYLE = FinishLayer.buildStyle(10);
const OUTER_STYLE = FinishLayer.buildStyle(14);

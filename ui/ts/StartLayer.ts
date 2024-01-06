import {LayerDef} from "./LayerDef";
import {LayerDefBase} from "./LayerDefBase";
import {Feature} from "ol";
import {fromLonLat} from "ol/proj";
import {Point} from "ol/geom";
import {Fill, RegularShape, Stroke, Style} from "ol/style";

export class StartLayer extends LayerDefBase implements LayerDef {
    render() {
        let feature = new Feature({
            geometry: new Point(fromLonLat([23.6441, 68.38565])),
            type: "START",
        });
        feature.setStyle(StartLayer.buildStyle());
        this.getSource().addFeature(feature);

        return Promise.resolve();
    }

    static buildStyle() {
        return new Style({
            image: new RegularShape({
                points: 3,
                rotation: Math.PI / 4,
                radius: 14,
                stroke: new Stroke({color: "#ff007f", width: 3}),
            }),
        });
    }
}

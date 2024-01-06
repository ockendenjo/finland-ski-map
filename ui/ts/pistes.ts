import {Stroke, Style} from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GPX} from "ol/format";
import {FeatureLike} from "ol/Feature";
import {Geometry} from "ol/geom";

export const pistesLayer = new VectorLayer({
    source: new VectorSource({
        url: "pistes.gpx",
        format: new GPX(),
    }),
    style: function (feature: FeatureLike) {
        const geom = feature.getGeometry() as Geometry;
        if (geom.getType() === "MultiLineString") {
            return pisteStyle;
        }
        return undefined;
    },
});

const pisteStyle = new Style({
    stroke: new Stroke({
        color: "#0080FF",
        width: 3,
    }),
});

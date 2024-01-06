import {LayerDef} from "./LayerDef";
import {LayerDefBase} from "./LayerDefBase";
import {Feature} from "ol";
import {fromLonLat} from "ol/proj";
import {LineString, Point} from "ol/geom";
import {Stroke, Style} from "ol/style";

export class BusLayer extends LayerDefBase implements LayerDef {
    render() {
        const buses: Bus[] = [
            {
                from: "Pallas",
                to: "Kolari station",
                points: ["68.04604/24.06252", "67.34865/23.83554"],
            },
        ];

        buses.forEach((b) => {
            const feature = new Feature({
                geometry: this.getLineString(b),
                type: "BUS",
                popup: {
                    title: "Bus",
                    text: `${b.from} &#10132; ${b.to}`,
                },
            });
            feature.setStyle(LINE_STYLE);
            this.getSource().addFeature(feature);
        });

        return Promise.resolve();
    }

    private getLineString(b: Bus): LineString {
        return new LineString(
            b.points.map((cp) => {
                const parts = cp.split("/");
                const p = new Point(
                    fromLonLat([Number(parts[1]), Number(parts[0])])
                );
                return p.getCoordinates();
            })
        );
    }
}

const LINE_STYLE = new Style({
    stroke: new Stroke({
        color: "#888",
        width: 3,
        lineDash: [10, 10],
    }),
});

type Bus = {
    from: string;
    to: string;
    points: string[];
};

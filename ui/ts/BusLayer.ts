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
                from: "Pallas (1340/1735)",
                to: "Kolari station (1600/1910)",
                points: ["68.04604/24.06252", "67.34865/23.83554"],
            },
            {
                from: "Kolari station (1105)",
                to: "Hetta (1400)",
                points: [
                    "67.34865/23.83554",
                    "67.60228/23.54669",
                    "67.95504/23.68197",
                    "67.90991/23.91992",
                    "68.14022/24.22155",
                    "68.28992/24.02064",
                    "68.38721/24.20255",
                    "68.44249/24.01688",
                    "68.38556/23.64377",
                ],
            },
        ];

        const source = this.getSource();
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
            source.addFeature(feature);
            console.log(feature);
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

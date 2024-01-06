import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

export interface LayerDef {
    setSource(source: VectorSource): void;

    setLayer(layer: VectorLayer<any>): void;

    getLayer(): VectorLayer<any>;

    render(): Promise<any>;
}

import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

export abstract class LayerDefBase {
    private source: VectorSource;
    private layer: VectorLayer<any>;

    setSource(source: VectorSource) {
        this.source = source;
    }

    setLayer(layer: VectorLayer<any>) {
        this.layer = layer;
    }

    getLayer(): VectorLayer<any> {
        return this.layer;
    }

    getSource(): VectorSource {
        return this.source;
    }
}

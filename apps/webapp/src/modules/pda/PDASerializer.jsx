import { useCallback } from 'react';
import { JSON as GraphParserJSON } from './PDAGraphParser';

export function useSerDes(app, module) {
    let ser = useSerializer(module.getGraphController());
    let des = useDeserializer(module.getGraphController());
    return [ser, des];
}

export function useSerializer(graphController) {
    const serializer = useCallback(function serializer(dst) {
        let result = GraphParserJSON.objectify(graphController.getGraph());
        Object.assign(dst, result);
    }, [graphController]);
    return serializer;
}

export function useDeserializer(graphController) {
    const deserializer = useCallback(function deserializer(src) {
        GraphParserJSON.parse(src, graphController.getGraph());
    }, [graphController]);
    return deserializer;
}

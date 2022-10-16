import { useCallback } from 'react';

export function useSerDes(app, module) {
    let ser = useSerializer(module.getMachineController());
    let des = useDeserializer(module.getMachineController());
    return [ser, des];
}

export function useSerializer(machineController) {
    const serializer = useCallback(function serializer(dst) {
        let expression = machineController.getMachineExpression();
        dst.expression = expression;
    }, [machineController]);
    return serializer;
}

export function useDeserializer(machineController) {
    const deserializer = useCallback(function deserializer(src) {
        machineController.setMachineExpression(src.expression);
    }, [machineController]);
    return deserializer;
}

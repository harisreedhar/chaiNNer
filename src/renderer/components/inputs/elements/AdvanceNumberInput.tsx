import {
    InputGroup,
    InputLeftAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from '@chakra-ui/react';
import { memo } from 'react';
import { areApproximatelyEqual } from '../../../../common/util';

const clamp = (value: number, min?: number | null, max?: number | null): number => {
    if (min != null && value < min) return min;
    if (max != null && value > max) return max;
    return value;
};

const getPrecision = (n: number) => {
    // eslint-disable-next-line no-param-reassign
    n %= 1;
    if (areApproximatelyEqual(n, 0)) return 0;
    return Math.min(10, n.toFixed(10).replace(/0+$/, '').split('.')[1]?.length ?? 0);
};

interface AdvancedNumberInputProps {
    unit?: string | null;
    max: number;
    min: number;
    offset: number;
    step: number;
    controlsStep: number;

    defaultValue: number;
    isDisabled?: boolean;
    small?: true;

    inputString: string;
    setInputString: (input: string) => void;
    setInput: (value: number) => void;
}

export const AdvancedNumberInput = memo(
    ({
        unit,
        max,
        min,
        offset,
        step,
        controlsStep,

        defaultValue,
        isDisabled,
        small,

        inputString,
        setInputString,
        setInput,
    }: AdvancedNumberInputProps) => {
        const precision = Math.max(getPrecision(offset), getPrecision(step));

        const onBlur = () => {
            const valAsNumber =
                precision > 0
                    ? parseFloat(inputString || String(defaultValue))
                    : Math.round(parseFloat(inputString || String(defaultValue)));

            if (!Number.isNaN(valAsNumber)) {
                const roundedVal = Math.round((valAsNumber - offset) / step) * step + offset;
                const value = Number(clamp(roundedVal, min, max).toFixed(precision));

                // Make sure the input value has been altered so onChange gets correct value if adjustment needed
                setImmediate(() => {
                    setInput(value);
                    setInputString(String(value));
                });
            }
        };

        if (small) {
            return (
                <InputGroup
                    mx={0}
                    size="xs"
                    w="fit-content"
                >
                    {unit && (
                        <InputLeftAddon
                            px={1}
                            w="fit-content"
                        >
                            {unit}
                        </InputLeftAddon>
                    )}
                    <NumberInput
                        className="nodrag"
                        defaultValue={defaultValue}
                        draggable={false}
                        isDisabled={isDisabled}
                        max={max}
                        min={min}
                        size="xs"
                        step={controlsStep}
                        value={inputString}
                        onBlur={onBlur}
                        onChange={setInputString}
                    >
                        <NumberInputField
                            borderLeftRadius={unit ? 0 : 'xs'}
                            m={0}
                            p={1}
                            // dynamic width based on precision
                            w={`${3 + 0.5 * precision}rem`}
                        />
                        <NumberInputStepper w={4}>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </InputGroup>
            );
        }

        return (
            <InputGroup>
                {unit && (
                    <InputLeftAddon
                        px={2}
                        w="fit-content"
                    >
                        {unit}
                    </InputLeftAddon>
                )}
                <NumberInput
                    className="nodrag"
                    defaultValue={defaultValue}
                    draggable={false}
                    isDisabled={isDisabled}
                    max={max}
                    min={min}
                    step={controlsStep}
                    value={inputString}
                    onBlur={onBlur}
                    onChange={setInputString}
                >
                    <NumberInputField
                        borderLeftRadius={unit ? 0 : 'md'}
                        px={unit ? 2 : 4}
                    />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </InputGroup>
        );
    }
);
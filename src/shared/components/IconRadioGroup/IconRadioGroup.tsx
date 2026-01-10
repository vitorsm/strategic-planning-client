import React from 'react';
import {
    RadioGroup,
    RadioLabel,
    RadioInput,
    RadioCard,
    RadioIconWrapper,
    RadioContent,
    RadioTitle,
    RadioDescription,
    RadioCheckIcon,
} from './styles';

export interface IconRadioOption {
    value: string;
    icon: string;
    title: string;
    description: string;
}

interface IconRadioGroupProps {
    name: string;
    options: IconRadioOption[];
    selectedValue: string;
    onChange: (value: string) => void;
}

export const IconRadioGroup: React.FC<IconRadioGroupProps> = ({
    name,
    options,
    selectedValue,
    onChange,
}) => {
    return (
        <RadioGroup>
            {options.map((option) => (
                <RadioLabel key={option.value}>
                    <RadioInput
                        type="radio"
                        name={name}
                        checked={selectedValue === option.value}
                        onChange={() => onChange(option.value)}
                    />
                    <RadioCard checked={selectedValue === option.value}>
                        <RadioIconWrapper checked={selectedValue === option.value}>
                            <span className="material-symbols-outlined">{option.icon}</span>
                        </RadioIconWrapper>
                        <RadioContent>
                            <RadioTitle>{option.title}</RadioTitle>
                            <RadioDescription>{option.description}</RadioDescription>
                        </RadioContent>
                        <RadioCheckIcon checked={selectedValue === option.value}>
                            <span className="material-symbols-outlined">check_circle</span>
                        </RadioCheckIcon>
                    </RadioCard>
                </RadioLabel>
            ))}
        </RadioGroup>
    );
};


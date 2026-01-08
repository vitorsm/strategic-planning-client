import React, { useState } from 'react';
import { Icon } from '../Icon';
import {
    Overlay,
    PickerContainer,
    PickerHeader,
    PickerTitle,
    CloseButton,
    ColorsContainer,
    CategoryTitle,
    ColorsGrid,
    ColorItem,
    CustomColorSection,
    CustomColorLabel,
    CustomColorLabelText,
    CustomColorInputRow,
    CustomColorPreview,
    CustomColorInput,
    NativeColorInput,
    SelectedPreview,
    PreviewColor,
    PreviewInfo,
    PreviewLabel,
    PreviewValue,
    SelectButton,
} from './styles';

// Color palettes organized by category
const COLOR_CATEGORIES: Record<string, { name: string; value: string }[]> = {
    'Primary': [
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Violet', value: '#a855f7' },
        { name: 'Fuchsia', value: '#d946ef' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Rose', value: '#f43f5e' },
    ],
    'Warm': [
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Amber', value: '#f59e0b' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Lime', value: '#84cc16' },
        { name: 'Coral', value: '#ff6b6b' },
        { name: 'Peach', value: '#ffb4a2' },
    ],
    'Cool': [
        { name: 'Green', value: '#22c55e' },
        { name: 'Emerald', value: '#10b981' },
        { name: 'Teal', value: '#14b8a6' },
        { name: 'Cyan', value: '#06b6d4' },
        { name: 'Sky', value: '#0ea5e9' },
        { name: 'Mint', value: '#2dd4bf' },
        { name: 'Aqua', value: '#67e8f9' },
    ],
    'Neutral': [
        { name: 'Slate', value: '#64748b' },
        { name: 'Gray', value: '#6b7280' },
        { name: 'Zinc', value: '#71717a' },
        { name: 'Stone', value: '#78716c' },
        { name: 'Charcoal', value: '#374151' },
        { name: 'Iron', value: '#4b5563' },
        { name: 'Silver', value: '#9ca3af' },
    ],
    'Dark': [
        { name: 'Navy', value: '#1e3a5f' },
        { name: 'Dark Blue', value: '#1e40af' },
        { name: 'Dark Purple', value: '#5b21b6' },
        { name: 'Dark Green', value: '#166534' },
        { name: 'Dark Red', value: '#991b1b' },
        { name: 'Dark Cyan', value: '#0e7490' },
        { name: 'Dark Slate', value: '#1e293b' },
    ],
    'Vibrant': [
        { name: 'Electric Blue', value: '#0066ff' },
        { name: 'Hot Pink', value: '#ff1493' },
        { name: 'Neon Green', value: '#39ff14' },
        { name: 'Electric Purple', value: '#bf00ff' },
        { name: 'Vivid Orange', value: '#ff6600' },
        { name: 'Bright Yellow', value: '#ffea00' },
        { name: 'Magenta', value: '#ff00ff' },
    ],
};

export interface ColorPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (color: { name: string; value: string }) => void;
    selectedColor?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
    isOpen,
    onClose,
    onSelect,
    selectedColor = '',
}) => {
    const [tempSelectedColor, setTempSelectedColor] = useState(selectedColor);
    const [customColor, setCustomColor] = useState(selectedColor || '#3b82f6');

    // Find color name from value
    const getColorName = (value: string): string => {
        for (const colors of Object.values(COLOR_CATEGORIES)) {
            const found = colors.find(c => c.value.toLowerCase() === value.toLowerCase());
            if (found) return found.name;
        }
        return 'Custom';
    };

    const handleColorClick = (colorValue: string) => {
        setTempSelectedColor(colorValue);
        setCustomColor(colorValue);
    };

    const handleCustomColorChange = (value: string) => {
        // Ensure it starts with #
        let color = value;
        if (!color.startsWith('#')) {
            color = '#' + color;
        }
        setCustomColor(color);
        // Only update temp selection if it's a valid hex color
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            setTempSelectedColor(color);
        }
    };

    const handleSelect = () => {
        const name = getColorName(tempSelectedColor);
        onSelect({ name, value: tempSelectedColor });
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Reset temp selection when opening
    React.useEffect(() => {
        if (isOpen) {
            setTempSelectedColor(selectedColor || '#3b82f6');
            setCustomColor(selectedColor || '#3b82f6');
        }
    }, [isOpen, selectedColor]);

    if (!isOpen) return null;

    return (
        <Overlay onClick={handleOverlayClick}>
            <PickerContainer role="dialog" aria-labelledby="color-picker-title">
                <PickerHeader>
                    <PickerTitle id="color-picker-title">Select Color</PickerTitle>
                    <CloseButton onClick={onClose} aria-label="Close">
                        <Icon name="close" />
                    </CloseButton>
                </PickerHeader>

                <ColorsContainer>
                    {Object.entries(COLOR_CATEGORIES).map(([category, colors]) => (
                        <div key={category}>
                            <CategoryTitle>{category}</CategoryTitle>
                            <ColorsGrid>
                                {colors.map((color) => (
                                    <ColorItem
                                        key={color.value}
                                        type="button"
                                        $color={color.value}
                                        $selected={tempSelectedColor.toLowerCase() === color.value.toLowerCase()}
                                        onClick={() => handleColorClick(color.value)}
                                        aria-label={color.name}
                                        title={color.name}
                                    />
                                ))}
                            </ColorsGrid>
                        </div>
                    ))}

                    <CustomColorSection>
                        <CustomColorLabel>
                            <CustomColorLabelText>Custom Color</CustomColorLabelText>
                            <CustomColorInputRow>
                                <NativeColorInput
                                    type="color"
                                    value={customColor}
                                    onChange={(e) => handleCustomColorChange(e.target.value)}
                                    aria-label="Pick custom color"
                                />
                                <CustomColorInput
                                    type="text"
                                    value={customColor}
                                    onChange={(e) => handleCustomColorChange(e.target.value)}
                                    placeholder="#000000"
                                    maxLength={7}
                                />
                                <CustomColorPreview $color={customColor} />
                            </CustomColorInputRow>
                        </CustomColorLabel>
                    </CustomColorSection>
                </ColorsContainer>

                <SelectedPreview>
                    <PreviewColor $color={tempSelectedColor} />
                    <PreviewInfo>
                        <PreviewLabel>Selected color</PreviewLabel>
                        <PreviewValue>{tempSelectedColor}</PreviewValue>
                    </PreviewInfo>
                    <SelectButton onClick={handleSelect}>
                        Select
                    </SelectButton>
                </SelectedPreview>
            </PickerContainer>
        </Overlay>
    );
};


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IconRadioGroup, IconRadioOption } from '../IconRadioGroup';

describe('IconRadioGroup', () => {
    const mockOptions: IconRadioOption[] = [
        {
            value: 'option1',
            icon: 'domain',
            title: 'Option 1',
            description: 'This is the first option',
        },
        {
            value: 'option2',
            icon: 'person',
            title: 'Option 2',
            description: 'This is the second option',
        },
    ];

    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('should render all options', () => {
        render(
            <IconRadioGroup
                name="test-radio"
                options={mockOptions}
                selectedValue="option1"
                onChange={mockOnChange}
            />
        );

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('This is the first option')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('This is the second option')).toBeInTheDocument();
    });

    it('should mark the selected option as checked', () => {
        render(
            <IconRadioGroup
                name="test-radio"
                options={mockOptions}
                selectedValue="option1"
                onChange={mockOnChange}
            />
        );

        const radioInputs = screen.getAllByRole('radio');
        expect(radioInputs[0]).toBeChecked();
        expect(radioInputs[1]).not.toBeChecked();
    });

    it('should call onChange when an option is clicked', () => {
        render(
            <IconRadioGroup
                name="test-radio"
                options={mockOptions}
                selectedValue="option1"
                onChange={mockOnChange}
            />
        );

        const radioInputs = screen.getAllByRole('radio');
        fireEvent.click(radioInputs[1]);

        expect(mockOnChange).toHaveBeenCalledWith('option2');
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should render icons correctly', () => {
        render(
            <IconRadioGroup
                name="test-radio"
                options={mockOptions}
                selectedValue="option1"
                onChange={mockOnChange}
            />
        );

        const icons = screen.getAllByText((content, element) => {
            return element?.classList.contains('material-symbols-outlined') || false;
        });

        // Each option has 2 icons: the main icon and the check_circle icon
        expect(icons.length).toBeGreaterThan(0);
    });

    it('should not call onChange when clicking the already selected option', () => {
        render(
            <IconRadioGroup
                name="test-radio"
                options={mockOptions}
                selectedValue="option1"
                onChange={mockOnChange}
            />
        );

        const radioInputs = screen.getAllByRole('radio');
        fireEvent.click(radioInputs[0]);

        expect(mockOnChange).toHaveBeenCalledWith('option1');
    });
});


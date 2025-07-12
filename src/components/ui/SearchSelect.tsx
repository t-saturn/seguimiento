import { useState, useEffect, useRef } from "react";

interface Option {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    placeholder?: string;
    onChange: (value: string | number) => void;
    className?: string;
    validationRegex: RegExp;
}

export const SearchSelect: React.FC<SearchableSelectProps> = ({
    options,
    placeholder = "Selecciona una opción",
    onChange,
    className = "",
    validationRegex = /[^a-zA-Z0-9-\s]/g,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filtrar las opciones cuando escribes
    useEffect(() => {
        const filtered = options.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [inputValue, options]);

    // Cierra el dropdown si haces click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionSelect = (option: Option) => {
        setInputValue(option.label);
        setIsOpen(false);
        onChange(option.value);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                    const rawValue = e.target.value.replace(validationRegex, "");
                    setInputValue(rawValue);
                    setIsOpen(true);
                }}
                placeholder={placeholder}
                onFocus={() => setIsOpen(true)}
                className="w-full sm:w-[300px] md:w-[440px] lg:w-[540px] shadow-md border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-900 dark:border-gray-700 dark:text-white/90"
            />
            {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-10 mt- w-full max-h-80 overflow-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-lg">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleOptionSelect(option)}
                            className="cursor-pointer px-4 py-2 text-md text-gray-800 hover:bg-gray-100 dark:text-white/90 dark:hover:bg-gray-800"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


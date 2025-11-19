'use client'

export default function Select({
    options,
    value,
    onChange,
}: {
    options: { value: any; label: string }[];
    value: any;
    onChange: (value: any) => void;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)} className="p-2 border border-slate-400 rounded my-2 cursor-pointer w-full">
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
}
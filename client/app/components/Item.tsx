
interface ItemProps {
    title: string;
    value: string;
    description: string;
}

export default function Item({ title, value, description }: ItemProps) {
    return (
        <>
            <div className="flex flex-col gap-1 border border-gray-200 p-4 rounded">
                <h2 className={`text-3xl font-semibold pb-4`}>{value}</h2>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </>
    )
}
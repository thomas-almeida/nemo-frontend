'use client'

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useDrag, useDrop } from 'react-dnd';
import { FileText } from 'lucide-react';

interface MessageComponentProps {
    id?: string | number;
    message: string;
    attachment?: {
        url: string,
        type: string,
        name: string,
        publicLink: string
    }
    index?: number;
    moveMessage?: (dragIndex: number, hoverIndex: number) => void;
    draggable?: boolean;
    onDelete?: (id: string | number) => void;
}

interface DragItem {
    index: number;
    id: string | number;
    type: string;
}

const DraggableMessage: React.FC<MessageComponentProps & { index: number }> = ({ id, message, attachment, index, moveMessage, onDelete }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'message',
        item: () => ({ id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'message',
        hover(item: DragItem, monitor) {
            if (!ref.current || !moveMessage) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            moveMessage(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="relative cursor-move"
        >
            <MessageContent message={message} attachment={attachment} onDelete={onDelete} id={id} />
        </div>
    );
};

const MessageContent: React.FC<Pick<MessageComponentProps, 'message' | 'attachment' | 'onDelete' | 'id'>> = ({ message, attachment, onDelete, id }) => {

    return (
        <div className="border p-2 rounded-md bg-gray-50 my-2 relative group">
            {attachment && (
                <div className="mb-2">
                    <div className="flex flex-col items-center p-4 border rounded bg-white">
                        <FileText className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600 text-center break-all">{attachment.name || 'Documento'}</span>
                        <a
                            href={attachment.publicLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Ver documento
                        </a>
                    </div>
                </div>
            )}
            {message && (
                <div className="prose max-w-none">
                    <ReactMarkdown>{message}</ReactMarkdown>
                </div>
            )}
            {onDelete && id && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remover mensagem"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            )}
        </div>
    )
}

export default function MessageComponent({ id, message, attachment, index, moveMessage, draggable = false, onDelete }: MessageComponentProps) {
    if (draggable && typeof index !== 'undefined' && moveMessage) {
        return (
            <DraggableMessage
                id={id}
                message={message}
                attachment={attachment}
                index={index}
                moveMessage={moveMessage}
                onDelete={onDelete}
            />
        );
    }

    return <MessageContent message={message} attachment={attachment} onDelete={onDelete} id={id} />;
}
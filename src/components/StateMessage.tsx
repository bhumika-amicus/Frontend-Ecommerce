import type { ReactNode } from 'react'

interface StateMessageProps {
    title: string
    message: string
    buttonText?: string
    onAction?: () => void
    children?: ReactNode
}

function StateMessage({
    title,
    message,
    buttonText,
    onAction,
    children,
}: StateMessageProps) {
    return (
        <div className="mt-7.5 flex w-full items-start justify-center">
            <div className="flex w-full max-w-125 flex-col items-center p-5 text-center">
                <h2 className="mb-6 text-lg md:text-xl lg:text-2xl font-bold text-gray-700">
                    {title}
                </h2>
                <p className="mb-6 text-base text-gray-600">
                    {message}
                </p>
                
                {children}
                
                {buttonText && onAction && (
                    <button
                        className="button button-outline mt-8"
                        onClick={onAction}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    )
}

export default StateMessage

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) {
        return null // No need to show pagination for a single page
    }

    return (
        <nav className="mt-6 flex justify-center" aria-label="Product pagination">
            <ul className="m-0 flex max-w-full flex-wrap list-none items-center justify-center gap-1 p-0 sm:gap-2">
                <li>
                    <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="inline-flex h-8 items-center justify-center rounded-sm px-2 text-xs font-medium text-brand-orange transition-colors hover:bg-brand-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                        Previous
                    </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <li key={pageNumber}>
                        <button
                            type="button"
                            onClick={() => onPageChange(pageNumber)}
                            aria-current={currentPage === pageNumber ? 'page' : undefined}
                            aria-label={currentPage === pageNumber ? `Page ${pageNumber}, current page` : `Page ${pageNumber}`}
                            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-sm px-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 ${currentPage === pageNumber
                                ? 'bg-brand-orange text-white hover:bg-brand-orange-hover'
                                : 'text-gray-700 hover:bg-brand-orange-50 hover:text-brand-orange'
                                }`}
                        >
                            {pageNumber}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="inline-flex h-8 items-center justify-center rounded-sm px-2 text-xs font-medium text-brand-orange transition-colors hover:bg-brand-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination

import Card from '../ui/Card'

function ProductCardSkeleton() {
  return (
    <Card variant="elevated">
      <div className="h-47.5 w-full border-b border-gray-100 bg-gray-200 animate-pulse max-[650px]:h-65" />
    
      <div className="flex flex-1 flex-col p-[22px_20px_24px]">
        <div className="mx-auto mb-8 h-5.5 w-4/5 rounded bg-gray-200 animate-pulse" />

        <div className="mx-auto mb-5 h-4 w-25 rounded bg-gray-200 animate-pulse" />

        <div className="mx-auto mb-5 h-5 w-15 rounded bg-gray-200 animate-pulse" />

        <div className="mt-auto h-12 w-full rounded bg-gray-200 animate-pulse" />
      </div>
    </Card>
  )
}

export default ProductCardSkeleton
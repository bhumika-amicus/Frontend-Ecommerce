interface CheckoutStepsProps {
  currentStep: number
}

function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { number: 1, label: 'Shipping' },
    { number: 2, label: 'Payment' },
    { number: 3, label: 'Review' },
  ]

  return (
    <div className="flex items-center justify-center gap-4 mb-8 text-sm md:text-base font-semibold w-full max-w-2xl mx-auto">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep
        const isPast = step.number < currentStep

        return (
          <div key={step.number} className="flex items-center gap-4 flex-1">
            <div
              className={`flex-1 py-1.5 px-4 rounded-full text-center transition-colors ${
                isActive
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {step.number}. {step.label}
            </div>
            
            {index < steps.length - 1 && (
              <div className="h-0.5 bg-gray-300 w-8 md:w-16 shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CheckoutSteps

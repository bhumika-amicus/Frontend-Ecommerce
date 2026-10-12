import { Check, Truck, CreditCard, FileCheck } from 'lucide-react'

interface CheckoutStepsProps {
  currentStep: number
}

function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { number: 1, label: 'Shipping', icon: Truck },
    { number: 2, label: 'Payment', icon: CreditCard },
    { number: 3, label: 'Review', icon: FileCheck },
  ]

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 text-xs sm:text-sm md:text-base font-semibold w-full max-w-2xl mx-auto">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep
        const isCompleted = step.number < currentStep
        const StepIcon = step.icon

        return (
          <div key={step.number} className="flex items-center gap-2 sm:gap-4 flex-1">
            <div
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-4 rounded-full text-center transition-all ${
                isActive
                  ? 'bg-brand-orange text-white shadow-sm ring-2 ring-brand-orange/30'
                  : isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              {isCompleted ? (
                <Check size={16} className="shrink-0 stroke-[2.5]" />
              ) : (
                <StepIcon size={16} className="shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-4 sm:w-8 md:w-12 shrink-0 transition-colors ${
                  step.number < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CheckoutSteps

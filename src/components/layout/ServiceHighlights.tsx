import {
  CreditCard,
  Headphones,
  Truck,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface ServiceHighlight {
  title: string
  description: string
  icon: ReactNode
}

const serviceHighlights: ServiceHighlight[] = [
  {
    title: 'Secure payments',
    description: 'Safe and secure credit card payments',
    icon: <CreditCard />,
  },
  {
    title: 'Help center',
    description: 'Call or chat online for support',
    icon: <Headphones />,
  },
  {
    title: 'Reliable shipping',
    description: 'Rely on our dependable shipping services',
    icon: <Truck />,
  },
]

function ServiceHighlights() {
  return (
    <section className="bg-[#4b4c4e] px-5 py-9 text-white md:px-6 md:py-12">
      <div className="mx-auto grid max-w-300 grid-cols-1 gap-7 md:grid-cols-3 md:gap-10">
        {serviceHighlights.map((service) => (
          <div
            key={service.title}
            className="flex items-center gap-5"
          >
            <div className="flex shrink-0 items-center justify-center">
              {service.icon}
            </div>

            <div>
              <h3 className="m-0 mb-0.5 text-lg font-light">
                {service.title}
              </h3>

              <p className="m-0 text-xs md:text-sm">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ServiceHighlights
import {
  CreditCard,
  Headphones,
  Truck,
} from 'lucide-react'
import './ServiceHighlights.css'

interface ServiceHighlight {
  title: string
  description: string
  icon: React.ReactNode
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
    <section className="service-highlights">
      <div className="service-highlights-container">
        {serviceHighlights.map((service) => (
          <div
            key={service.title}
            className="service-highlight"
          >
            <div className="service-highlight-icon">
              {service.icon}
            </div>

            <div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ServiceHighlights
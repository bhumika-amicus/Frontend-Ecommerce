import { Search } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { ComponentProps } from 'react'

type HeroFormSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0]

function Hero() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Keep the input in sync with the URL
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: HeroFormSubmitEvent) => {
    e.preventDefault();
    const query = searchInput.trim();

    if (window.location.pathname === '/assignment5') {
      if (query) {
        searchParams.set('search', query);
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams, { replace: true });
    } else {
      navigate(query ? `/assignment5?search=${encodeURIComponent(query)}` : '/assignment5');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (window.location.pathname === '/assignment5') {
      const query = value.trim();
      if (query) {
        searchParams.set('search', query);
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <section className="relative w-full overflow-hidden aspect-auto min-h-[400px] md:aspect-[15/4] md:min-h-0">
      <img
        src="/hero.png"
        alt="Construction equipment"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-[50px] text-center text-white sm:px-16 sm:py-0">
        <h1 className="m-0 max-w-[700px] text-4xl font-bold uppercase leading-[1.1] md:text-5xl">
          Find Construction Parts
        </h1>

        <form 
          className="mt-6 flex h-12 w-full max-w-[600px] items-center overflow-hidden rounded bg-white transition-colors focus-within:ring-2 focus-within:ring-brand-orange/30" 
          onSubmit={handleSearch}
        >
          <input
            type="search"
            placeholder="Search"
            value={searchInput}
            onChange={handleInputChange}
            aria-label="Search products"
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-base text-gray-700 outline-none placeholder:text-gray-400"
          />
          <button type="submit" className="flex h-full w-12 shrink-0 items-center justify-center border-0 bg-transparent text-brand-orange transition-colors hover:bg-gray-50 focus-visible:outline-none" aria-label="Search">
            <Search size={20} />
          </button>
        </form>
      </div>
    </section>
  )
}

export default Hero
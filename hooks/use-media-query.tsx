import { useEffect, useState } from 'react'

function useClientSideMediaQuery(query) {
  const [matches, setMatches] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(query)
      setMatches(mediaQuery.matches)

      const handleChange = () => {
        setMatches(mediaQuery.matches)
      }

      mediaQuery.addEventListener('change', handleChange)

      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

export default useClientSideMediaQuery

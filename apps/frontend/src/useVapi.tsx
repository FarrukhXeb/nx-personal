import { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';

export function useVapi() {
  const [vapi, setVapi] = useState<Vapi | null>(null);

  useEffect(() => {
    const vapiInstance = new Vapi('41ad01e1-d9e7-41ab-b6c6-91fef25b9d94');
    setVapi(vapiInstance);
  }, []);

  return vapi;
}

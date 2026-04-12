'use client';

import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/Background/Scene'), { 
  ssr: false,
  loading: () => <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#09090b', zIndex: -1 }} />
});

export default function BackgroundWrapper() {
  return <Scene />;
}

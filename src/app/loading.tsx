import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="relative h-24 w-24 sm:h-32 sm:w-32">
        <Image
          src="/images/makeitads-logo.png"
          alt="MakeItAds"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}